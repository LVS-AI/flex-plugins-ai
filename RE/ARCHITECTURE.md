# System Architecture

## Aselo Platform — Architecture Reference

**Source:** Reverse-engineered from `techmatters/flex-plugins`  
**Date:** 2026-03-30

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        END USERS                                     │
│  (Web Browser / Mobile / Phone / Social Media)                       │
└──────────┬──────────────┬────────────────┬──────────────────────────┘
           │              │                │
     ┌─────▼─────┐  ┌────▼────┐   ┌───────▼───────┐
     │  Webchat   │  │  Voice  │   │ Social Media  │
     │  Widget    │  │  PSTN   │   │ Channels      │
     │ (React)    │  │         │   │ (IG/TG/LINE/  │
     │            │  │         │   │  FB/WA/Modica) │
     └─────┬──────┘  └────┬────┘   └───────┬───────┘
           │              │                │
     ┌─────▼──────────────▼────────────────▼───────┐
     │              TWILIO PLATFORM                  │
     │  ┌────────────┐ ┌──────────┐ ┌────────────┐ │
     │  │Conversations│ │TaskRouter│ │  Flex API   │ │
     │  │    SDK      │ │          │ │             │ │
     │  └─────┬──────┘ └────┬─────┘ └──────┬─────┘ │
     │        │              │              │        │
     │  ┌─────▼──────────────▼──────────────▼─────┐ │
     │  │           TWILIO FLEX                    │ │
     │  │     (Agent Desktop Framework)            │ │
     │  └─────────────────┬───────────────────────┘ │
     └────────────────────┼─────────────────────────┘
                          │
     ┌────────────────────▼───────────────────────┐
     │         FLEX PLUGIN (plugin-hrm-form)       │
     │  ┌──────────┐ ┌─────────┐ ┌─────────────┐ │
     │  │ React UI │ │  Redux  │ │  Services   │ │
     │  │Components│ │  Store  │ │  (API calls)│ │
     │  └──────────┘ └─────────┘ └──────┬──────┘ │
     └──────────────────────────────────┼─────────┘
                                        │
     ┌──────────────────────────────────▼─────────┐
     │            AWS LAMBDA FUNCTIONS              │
     │  ┌─────────────┐  ┌──────────────────────┐ │
     │  │account-scoped│  │ Satellite Lambdas    │ │
     │  │ (60+ routes) │  │ (OAuth, webhooks,    │ │
     │  │              │  │  reCAPTCHA, streams)  │ │
     │  └──────┬──────┘  └──────────┬───────────┘ │
     └─────────┼─────────────────────┼─────────────┘
               │                     │
     ┌─────────▼─────────────────────▼─────────────┐
     │            EXTERNAL SERVICES                  │
     │  ┌──────┐ ┌─────┐ ┌───────┐ ┌────────────┐ │
     │  │ HRM  │ │ S3  │ │  SSM  │ │  Datadog   │ │
     │  │ API  │ │     │ │ Params│ │  FullStory │ │
     │  └──────┘ └─────┘ └───────┘ └────────────┘ │
     └─────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Frontend Applications

| Application | Technology | Purpose |
|------------|-----------|---------|
| **plugin-hrm-form** | React 17 + TypeScript + Redux | Twilio Flex Plugin — agent desktop with forms, cases, search, profiles |
| **aselo-webchat-react-app** | React 17 + TypeScript + Redux + Twilio Conversations SDK | Modern webchat widget for end users |
| **webchat** (legacy) | React 17 + @twilio/flex-webchat-ui | Legacy webchat widget (being replaced) |

### 2.2 Backend — Lambda Functions

| Lambda | Purpose | Auth |
|--------|---------|------|
| **account-scoped** | Main HTTP handler with 60+ routes (TaskRouter, HRM, Conversations, Channels, Transfers, Webchat) | Flex Token / Webhook HMAC |
| **facebookSignin** | Facebook OAuth login flow | OAuth state token (8-char random, 1-hour TTL in SSM) |
| **facebookCallback** | Facebook OAuth callback — 3-step token exchange (short-lived → long-lived → page access token), scope validation, page permission validation | OAuth state validation |
| **instagramWebhook** | Instagram message webhook receiver | Facebook App Secret HMAC-SHA1 via `x-hub-signature` |
| **lineWebhook** | LINE message webhook forwarder (S3 map lookup → forward with `x-line-signature` preserved) | S3 webhook map |
| **modicaWebhook** | Modica message webhook forwarder (S3 map by `activeUser`) | S3 webhook map |
| **recaptchaVerify** | Google reCAPTCHA token verification (POST to `google.com/recaptcha/api/siteverify`) | API secret from SSM `/global/google/recaptcha/secret_key` |
| **TwilioErrorReporter** | Error event streaming to Datadog — filters PII (redacts customerAddress, customerName, from, caller, etc.), omits known benign errors by account+code | Twilio webhook HMAC + Datadog API keys |
| **twilioEventStreams** | Twilio event stream processing and Datadog forwarding | Twilio webhook HMAC |
| **savePendingContacts** | Periodic job: reads S3 config list, calls each serverless `/savePendingContacts` in parallel | Internal (no HTTP trigger) |
| **ipLocationFinder** | IP geolocation via ipfind.com API from Studio flow trigger | Twilio webhook HMAC |
| **integrationTestRunner** | Dual-mode: runs Jest tests (IntegrationTestEvent) or handles webhooks (ALBEvent) | Internal |
| **lineSetup** | LINE channel setup: get bot info, create S3 webhook mapping, store channel credentials in SSM | Payload validation |

### 2.3 Shared Packages (lambdas/packages/)

| Package | Purpose | Key Exports |
|---------|---------|-------------|
| **hrm-types** | Core TypeScript types | `HrmContact`, `HrmContactRawJson`, `CallType`, `HangUpBy`, `ChannelTypes` (voice/sms/facebook/messenger/whatsapp/web/telegram/instagram/line/modica), `FormValue` (string \| string[] \| boolean \| number \| null) |
| **twilio-types** | Branded Twilio SID types | `AccountSID`, `WorkerSID`, `TaskSID`, `ConversationSID`, etc. |
| **twilio-configuration** | Twilio client factory and config lookup via SSM | `getTwilioClient(accountSid)`, `getAccountAuthToken(accountSid)`, `getTwilioWorkspaceSid`, `getChatServiceSid`, `getAccountSid(shortcode)`, `getHelplineCode()`, `getSyncServiceSid()`, `areOperatingHoursEnforced()` — SSM pattern: `/{NODE_ENV}/twilio/{accountSid}/{param}` |
| **ssm-cache** | AWS SSM Parameter Store with in-memory caching | `getSsmParameter(Name)`, `putSsmParameter(request)` — cache TTL: 1 hour, supports custom endpoints via `SSM_ENDPOINT`/`LOCAL_SSM_PORT`/`SSM_REGION` env vars |
| **s3** | S3 read/write utilities | `getS3Object(Bucket, Key): Promise<string>`, `putS3Object(request)` |
| **hrm-form-definitions** | Form schema definitions — 17 input types, versioned form structures | `loadDefinition(url)`, `loadWebchatDefinition(url)`, form input types: Input, SearchInput, NumericInput, Email, RadioInput, ListboxMultiselect, Select, DependentSelect, Checkbox, MixedCheckbox, Textarea, DateInput, TimeInput, FileUpload, Button, CopyTo, CustomContactComponent |

### 2.4 Infrastructure (twilio-iac/)

| Module | Purpose | Key Resources |
|--------|---------|---------------|
| **terraform-modules/aws** | S3, Lambda, ALB resources | IAM roles, policies, buckets, SSM parameters |
| **terraform-modules/channels/v1** | Studio flows per channel | `twilio_studio_flows_v2` with template interpolation (channel vars, chatbot SIDs, serverless URLs) |
| **terraform-modules/channels/custom-lambdas** | Custom Lambda channels | Lambda definitions for custom channel handlers |
| **terraform-modules/channels/message-handler-lambda** | Message handler | Lambda + ALB targeting |
| **terraform-modules/taskRouter/v1** | Task routing | Workspace ("Flex Task Assignment"), activities, queues, workflows (from template files), task channels |
| **terraform-modules/serverless/default** | Serverless function deployment | `twilio_serverless_service` + environment, uses Python external data source |
| **terraform-modules/events/v1** | Event streaming | Webhook sinks, event subscriptions |
| **terraform-modules/external-recordings** | Recording storage | IAM user, policy, access keys, SSM params for S3 recording bucket |
| **terraform-modules/lex/v1, v2** | Amazon Lex chatbot | `aws_lex_slot_type`, `aws_lex_intent` |
| **terraform-modules/hrmServiceIntegration/default** | HRM API key | `null_resource` provisioner calling `npm run twilioResources` |
| **terraform-modules/datadog/v1** | Monitoring | Datadog integration |
| **terraform-modules/survey/default** | Post-call survey | IVR flows |

**Multi-Account Strategy:** 35+ helplines × 3 environments (dev/staging/prod), each with separate Twilio account. Terragrunt manages hierarchy and variable cascade.

**Stages:** `provision` (initial infra), `configure` (post-provision), `external-recordings` (S3 setup), `lex` (chatbot), `system-down` (downtime handling).

**SSM Parameter Hierarchy:**
```
/{environment}/
  /twilio/{account_sid}/
    account_sid, auth_token, region
    external_recordings/ (access_key_id, secret_access_key)
  /aws/{account_sid}/ (region, s3_bucket)
  /slack/ (webhook_url_studio_errors)
  /flex-plugins/e2e/ (okta_username, okta_password)
```

---

## 3. Data Flow Diagrams

### 3.1 Webchat Session Flow

```
1. User loads webpage with embedded webchat widget
2. User fills pre-engagement form (name, language, etc.)
3. Widget calls Lambda POST /initWebchat
   → Lambda creates web channel via Twilio Flex API
   → Returns: JWT token, conversationSid, identity
4. Widget initializes Twilio Conversations SDK with token
5. Messages flow bidirectionally via Conversations SDK
6. Agent receives task in Flex via TaskRouter
7. Agent views contact in plugin-hrm-form
8. On chat end: Widget calls Lambda POST /endChat
   → Lambda closes conversation, sends goodbye message
```

### 3.2 Contact Lifecycle

```
1. Task arrives via TaskRouter (from any channel)
2. Agent accepts task → plugin creates Contact draft in Redux
3. Agent selects call type (child/caller/non-data)
4. Agent fills tabbed forms:
   - Caller Information
   - Child Information  
   - Case Information
   - Issue Categorization (categories grid)
5. Agent optionally:
   - Creates/links a Case
   - Adds resource referrals
   - Files CSAM report
   - Links to client Profile
6. Agent wraps up → Contact saved to HRM API
7. Contact data pushed to Insights (analytics)
8. Task completed in TaskRouter
```

### 3.3 API Request Pipeline (Lambda)

```
ALB Event
  → Parse HTTP body (application/x-www-form-urlencoded or application/json)
  → Route matching: /lambda/twilio/account-scoped/{accountSid}/{path}
     ├── accountSid format → ACCOUNTSID_ROUTES lookup
     └── shortcode format  → ENV_SHORTCODE_ROUTES + SSM getAccountSid(shortcode)
  → INITIAL_PIPELINE: [validateRequestMethod] (POST only, returns 405 otherwise)
  → Route-specific validation pipeline:
     ├── Webhook routes: validateWebhookRequest (HMAC-SHA1 via X-Twilio-Signature)
     ├── Flex token routes: validateFlexTokenRequest({tokenMode})
     │   ├── tokenMode: 'agent'      → worker_sid must start with 'WK'
     │   ├── tokenMode: 'supervisor'  → roles must include 'supervisor'
     │   └── tokenMode: 'guest'       → roles includes 'guest' OR no worker_sid
     ├── JWT token routes: validateRequestWithTwilioJwtToken
     └── No-validation routes: (initWebchat, operatingHours, custom channel inbound)
  → Handler function (AccountScopedHandler<T>)
  → Result<HttpError, Data> monad
  → convertHttpErrorResultToALBResult → HTTP response
     { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({...}) }
```

### 3.4 Task Lifecycle Flow (Agent Desktop)

```
Task arrives via TaskRouter
  → beforeAcceptTask: validate task readiness
  → Agent clicks Accept
  → afterAcceptTask:
     ├── getContactByTaskSid(taskSid) — check for existing contact
     ├── If no contact: createContact → new draft in Redux
     ├── Set metadata: { startMillis: Date.now() }
     ├── Initialize form routing (tabbed-forms subroute)
     └── Load definition version for contact
  → Agent fills forms, creates case, etc.
  → Agent ends interaction
  → hangupCall: set hangUpBy (Agent/Customer/Consult/ColdTransfer/WarmTransfer)
  → wrapupTask:
     ├── determineConversationMedia(task, contact)
     ├── saveConversationMedia(contactId, media[])
     ├── PATCH /contacts/{id}?finalize=true
     └── Save to external backend (if dual-write enabled)
  → completeTask:
     ├── buildInsightsData(task, contact, caseState) — if enable_save_insights
     ├── Update task attributes with insights
     └── Complete task in TaskRouter
  → afterCompleteTask:
     └── Garbage collect stale contacts/cases from Redux
```

---

## 4. State Management Architecture (Redux)

### Root State Tree

```
FlexState (Twilio Flex built-in)
└── 'plugin-hrm-form' (HrmState)
    ├── activeContacts (ContactsState)
    │   ├── existingContacts: { [contactId]: ContactState }
    │   │   ├── lastReferencedDate: Date
    │   │   ├── savedContact: Contact
    │   │   ├── draftContact?: ContactDraftChanges
    │   │   ├── metadata: ContactMetadata
    │   │   │   ├── startMillis, endMillis
    │   │   │   ├── categories: { gridView, expanded: { [key]: bool } }
    │   │   │   ├── draft: { resourceReferralList, dialogsOpen }
    │   │   │   ├── loadingStatus: 'loading' | 'loaded'
    │   │   │   ├── finalizeStatus: { error? }
    │   │   │   └── llmAssistant: { status: 'ready'|'working'|'error', lastError? }
    │   │   └── transcript?: Transcript
    │   ├── contactsBeingCreated: Set<string> (taskIds)
    │   └── contactDetails: ContactDetailsState
    ├── connectedCase (CaseState)
    │   └── cases: { [caseId]: CaseStateEntry }
    │       ├── connectedCase: Case
    │       ├── caseWorkingCopy: CaseWorkingCopy
    │       │   ├── sections: { [type]: { new?, existing: { [id]: data } } }
    │       │   └── caseSummary?: CaseSummaryWorkingCopy
    │       ├── availableStatusTransitions: StatusInfo[]
    │       ├── timelines: { [timelineId]: TimelineActivity[] }
    │       ├── sections: { [type]: { [id]: FullCaseSection } }
    │       ├── lastReferencedDate: Date
    │       ├── outstandingUpdateCount: number
    │       ├── loading?: boolean
    │       └── error?: ParseFetchErrorResult
    ├── routing (RoutingState)
    │   └── tasks: { [taskId]: AppRoutes[] }  // route stack per task
    │       Route types: TabbedFormRoute | SearchRoute | CaseRoute | ProfileRoute | CaseListRoute
    │       Modal support: routes can nest activeModal[] stacks
    │       ChangeRouteMode: Push | Replace | ResetModal
    ├── searchContacts (SearchState)
    │   └── tasks: { [taskId]: { [context]: SearchStateTaskEntry } }
    │       ├── form: SearchFormValues (firstName, lastName, counselor, phone, dates, etc.)
    │       ├── searchContactsResult: { count, ids[] }
    │       ├── searchCasesResult: { count, ids[] }
    │       ├── isRequesting / isRequestingCases: boolean
    │       ├── error / casesError
    │       └── contactRefreshRequired / caseRefreshRequired: boolean
    ├── caseList (CaseListState)
    │   ├── currentSettings: { filter, sort, page }
    │   ├── previousSettings?: (rollback on fetch error)
    │   └── content: { listLoading, fetchError, caseList: string[], caseCount, caseDetailsOpen }
    ├── configuration (ConfigurationState)
    │   ├── locale: { selected: string, status: 'loading'|'loaded' }
    │   ├── counselors: { list: [{ sid, fullName }], hash: { [sid]: fullName } }
    │   ├── workerInfo: { chatChannelCapacity: number }
    │   ├── definitionVersions: { [version]: DefinitionVersion | undefined }
    │   └── currentDefinitionVersion?: DefinitionVersion
    ├── profile (ProfileState)
    │   ├── identifiers: { [id]: IdentifierEntry }
    │   ├── profiles: { [id]: ProfileEntry }
    │   │   ├── sections?: { [type]: AsyncCommon<ProfileSection> }
    │   │   ├── contacts: { data, loading, error, page, total }
    │   │   └── cases: { data, loading, error, page, total }
    │   ├── profileFlags: { data, loading, error }
    │   └── profilesList: { data: id[], count, page, settings: { sort, filter }, loading, error }
    ├── csam-report (CSAMReportState)
    │   └── { [contactId]: { form, reportType: 'child'|'counsellor', reportStatus } }
    ├── queuesStatusState (QueuesStatusState)
    ├── dualWrite (DualWriteState)
    ├── referrableResources (ResourcesState)
    ├── conferencing (ConferencingState)
    ├── switchboard (SwitchboardState)
    ├── teamsView (TeamsViewState)
    └── caseMergingBanners (CaseMergingBannersState)
```

### Async Pattern

Uses `redux-promise-middleware-actions` for async operations:
- Action creators return promises
- Middleware dispatches `_PENDING`, `_FULFILLED`, `_REJECTED` automatically
- Reducers handle all three states

### Garbage Collection

Both contacts and cases implement automatic cleanup:
- Entries unreferenced for >120 minutes are eligible
- Entries with unsaved draft changes are NEVER garbage-collected
- Cleanup runs on state updates (lazy evaluation)
    │   └── chatCapacity
    ├── profile (ProfileState)
    │   ├── identifiers: { [id]: IdentifierEntry }
    │   ├── profiles: { [id]: ProfileEntry }
    │   ├── profileFlags: { data, loading, error }
    │   └── profilesList: { data, count, page, settings }
    ├── csam-report (CSAMReportState)
    ├── queuesStatusState (QueuesStatusState)
    ├── dualWrite (DualWriteState)
    ├── referrableResources (ResourcesState)
    ├── conferencing (ConferencingState)
    ├── switchboard (SwitchboardState)
    ├── teamsView (TeamsViewState)
    └── caseMergingBanners (BannersState)
```

### Async Pattern

Uses `redux-promise-middleware-actions` for async operations:
- Action creators return promises
- Middleware dispatches `_PENDING`, `_FULFILLED`, `_REJECTED` automatically
- Reducers handle all three states

---

## 5. Authentication & Authorization

### Authentication Layers

| Layer | Method | Scope |
|-------|--------|-------|
| **Agent Desktop** | Twilio Flex JWT Token (via Okta SSO) | All agent API calls |
| **Webchat** | Anonymous JWT from Lambda | Webchat session only |
| **Twilio Webhooks** | HMAC-SHA1 signature | Inbound webhooks |
| **Instagram** | Facebook App Secret HMAC | Instagram callbacks |
| **Social Channels** | S3 webhook map lookup | LINE, Modica routing |

### Authorization Model

Permission rules are defined per helpline in a `RulesFile`:

```
{
  [action]: [
    [condition1, condition2],  // AND within array
    [condition3],              // OR between arrays
  ]
}
```

**Condition Types:**
- `everyone` / `nobody` / `isSupervisor` — role-based
- `isOwner` / `isCreator` / `isCaseContactOwner` — ownership-based
- `createdHoursAgo(N)` / `createdDaysAgo(N)` — time-based
- `{ field: 'rawJson.X.Y' }` — field-specific

---

## 6. Configuration Architecture

### Multi-Tenant Configuration Hierarchy

```
Global Defaults
  └── Environment (development / staging / production)
      └── Helpline (e.g., 'as', 'ca', 'za')
          └── Definition Version (form schemas, versioned)
              └── Feature Flags (per deployment)
```

### Configuration Sources

| Source | Content | Storage |
|--------|---------|---------|
| **AWS SSM Parameter Store** | Secrets, API keys, account SIDs | `/{env}/twilio/{accountSid}/{param}`, `/global/{param}` |
| **S3** | Webhook maps (`line-webhook-map.json`, `modica-webhook-map.json`, `instagram-config.json`), static configs, save-pending-contacts-list.json | JSON files in `aselo-webhooks` bucket |
| **Flex API serviceConfiguration** | Feature flags, HRM URL, form versions | Twilio Flex service attributes |
| **hrm-form-definitions** | Form schemas, categories, case types, 17 input types | npm package (versioned, e.g., `as-v1`, `za-v1`) |
| **Terraform** | Infrastructure provisioning | HCL files per helpline/environment |
| **hrmConfig** | Runtime config object (30+ properties) | Assembled from Flex serviceConfiguration at plugin init |
| **Environment Variables** | Feature flag overrides, base URLs | `REACT_APP_FF_*`, `REACT_APP_HRM_BASE_URL`, etc. |

### Feature Flags (35+)

Feature flags are stored in Flex service configuration and read at plugin initialization. They control:
- Channel features (transcripts, recordings, dual write)
- UI features (emoji picker, canned responses, language selector)
- Backend routing (`use_twilio_lambda_for_*` — 9 flags controlling which Lambda endpoints to use)
- Monitoring (FullStory, Datadog)
- Advanced features (switchboarding, CSAM, LLM summary)
- Contact save frequency: `'onTabChange'` (auto-save on tab switch) or `'onFinalSaveAndTransfer'`

**Flag Sources (priority):** Flex serviceConfiguration attributes → Environment variables (`REACT_APP_FF_*`)

---

## 7. Deployment Architecture

```
┌─────────────────────────────────────────┐
│         CI/CD (GitHub Actions)           │
│  ┌──────────┐  ┌──────────┐            │
│  │ Build &  │  │ Terraform│            │
│  │ Deploy   │  │ Apply    │            │
│  │ Plugin   │  │ Infra    │            │
│  └────┬─────┘  └────┬─────┘            │
└───────┼──────────────┼──────────────────┘
        │              │
┌───────▼──────┐ ┌─────▼──────────────────┐
│ Twilio Flex  │ │ AWS                     │
│ Assets       │ │ ┌──────┐ ┌───────────┐ │
│ (plugin JS)  │ │ │Lambda│ │ALB        │ │
│              │ │ │      │ │(routing)  │ │
└──────────────┘ │ └──────┘ └───────────┘ │
                 │ ┌──────┐ ┌───────────┐ │
                 │ │  S3  │ │SSM Params │ │
                 │ └──────┘ └───────────┘ │
                 └────────────────────────┘
```

### Environments

| Stage | Purpose |
|-------|---------|
| **development** | Active development and testing |
| **staging** | Pre-production validation |
| **production** | Live helpline operations |

### Per-Helpline Provisioning

Each helpline gets:
- Twilio account + Flex workspace
- TaskRouter workspace with queues and workflows
- Lambda deployment with helpline-specific config
- S3 assets bucket for webchat widget
- SSM parameters for secrets
- Terraform state in S3 backend

---

## 8. Error Handling Pattern

The codebase uses a **Result monad** pattern throughout:

```typescript
type Result<TError, TData> = 
  | { type: 'error'; error: TError }
  | { type: 'ok'; data: TData };
```

Benefits:
- Explicit error handling (no silent failures)
- Type-safe error propagation
- Composable (chain operations)
- Forces callers to handle both success and error paths

---

## 9. Key Design Patterns

| Pattern | Where Used | Purpose |
|---------|-----------|---------|
| **Plugin Architecture** | Flex Plugin entry point | Extend Flex without forking |
| **Redux Namespace** | State management | Isolate plugin state from Flex state |
| **Dynamic Form Rendering** | Contact/case forms | Configurable forms per helpline |
| **Route Stack per Task** | Routing state | Each task has its own navigation history |
| **Working Copy** | Case editing | Draft changes before commit |
| **Branded Types** | Twilio SIDs | Prevent SID type confusion at compile time |
| **Result Monad** | Error handling | Explicit success/failure propagation |
| **Feature Flags** | Conditional features | Toggle functionality per deployment |
| **Definition Versions** | Form schemas | Version form structures independently |
| **Request Pipeline** | Lambda route handlers | Chained validation middleware before handler |
| **Conversation Listener Mgmt** | Chat lifecycle | Register/deactivate/reactivate per-conversation listeners |
| **HangUpBy State Manager** | Voice calls | localStorage-backed per-task HangUpBy tracking |
| **Async Thunk Pattern** | Redux async | `createAsyncAction` → auto `_PENDING/_FULFILLED/_REJECTED` |
| **Recording Error HOC** | Error boundaries | `recordingErrorHandler` HOC wraps pages for FullStory |

### 9.1 Result/Either Monad (Lambda Backend)

The Lambda backend uses a discriminated-union `Result` pattern:

```typescript
// Two concrete types
class ErrorResult<TError> {
  type: 'error'; error: TError;
  unwrap(): never { throw this.error; }
}
class OkResult<T> {
  type: 'ok'; data: T;
  unwrap(): T { return this.data; }
}

// Usage in handlers:
const result: Result<HttpError, Data> = await handler(request);
return result.type === 'ok'
  ? { statusCode: 200, body: JSON.stringify(result.data) }
  : { statusCode: result.error.status, body: JSON.stringify({ error: result.error.message }) };
```

Every route handler returns `Result<HttpError, Data>`, forcing explicit error handling at every level. The `unwrap()` method enables chaining with try/catch in imperative code.

### 9.2 Request Pipeline Pattern (Lambda Routes)

Each route defines a `FunctionRoute` with a request pipeline — an array of validation/transform steps executed before the handler:

```typescript
type FunctionRoute = {
  requestPipeline: RequestPipelineStep[];  // Executed in order before handler
  handler: AccountScopedHandler;           // Final business logic
};

// Pipeline steps:
INITIAL_PIPELINE = [validateRequestMethod]           // Always: POST-only, else 405
+ route-specific steps:
  [validateWebhookRequest]                            // Twilio HMAC-SHA1
  [validateFlexTokenRequest({ tokenMode: 'agent' })]  // Flex JWT + role
  [validateRequestWithTwilioJwtToken]                 // Direct JWT validation
  []                                                  // No auth (public endpoints)
```

Pipeline steps can reject early (returning `ErrorResult`) or transform the request (e.g., attaching the validated token's worker_sid).

### 9.3 HRM Internal API Pattern

Lambda functions call the HRM backend using a dedicated internal API client with Basic Auth:

```
URL: /internal/${apiVersion}/accounts/${hrmAccountId}/${path}
Auth: Basic Auth with SSM static API key
Retry: 3 attempts on failure
Headers: Content-Type: application/json
```

Used for: TaskRouter event processing (creating contacts on RESERVATION_ACCEPTED), chatbot callback processing, and post-survey handling. The static API key is stored in SSM and rotated independently of Flex tokens.

### 9.4 Form Definitions S3 Cache

Form definitions are loaded from S3 with in-memory caching:

```
URL pattern: {assetsBucketUrl}/form-definitions/{helplineCode}/{version}
Cache: In-memory Map<string, DefinitionVersion>
Load flow: getFormDefinitionUrl(helplineCode, version) → fetch → cache
Fallback: If specific version not found, uses latest available
```

Both the Lambda backend and the frontend cache loaded definitions. The frontend requests them via the HRM API which proxies to S3.

### 9.5 Operating Hours Shift-Based Logic

Operating hours use a shift-based JSON configuration per country/helpline:

```typescript
// DaysOfTheWeek enum: Monday=1, Tuesday=2, ..., Sunday=7
// OperatingShift: { open: number, close: number }
//   where 900 = 9:00 AM, 1730 = 5:30 PM (numeric HHMM format)

type OfficeOperatingInfo = {
  timezone: string;                                              // e.g., "Pacific/Auckland"
  holidays: Record<string, string>;                              // "MM/DD/YYYY" → holiday name
  operatingHours: Record<ChannelType, Record<DayOfWeek, OperatingShift[]>>;
};

// Multi-office support: root-level fallback + per-office overrides
// 14+ country configs: as, br, ca, cl, co, et, in, jm, mt, mw, nz, ph, sg, th, tz, za, zm, zw
```

Three states returned: `'open'`, `'closed'`, `'holiday'` — each with optional channel-specific and language-specific response messages.

### 9.6 Conversation Listener Management

The plugin manages Twilio Conversations event listeners with register/deactivate/reactivate semantics:

```typescript
// Registry: Record<conversationSid, ConversationListenerParams[]>
addAseloListener(conversation, ...listenerArgs)      // Store + attach
deactivateAseloListeners(conversation)                // Remove all without deleting registry
reactivateAseloListeners(conversation)                // Re-attach from registry

// Used in:
// - Post-survey: remove ALL listeners on wrapup to let chatbot interact
// - Transfer: deactivate listeners for transferred tasks to prevent ghost notifications
// - Normal: remove only participantLeft listeners to prevent chat history disappearing
```

### 9.7 Bot Channel Capture Flow

The system supports capturing a chat channel from a bot to begin agent interaction:

```
captureChannelWithBot → Creates CapturedChannelAttributes:
  { userId, environment, helplineCode, botLanguage, botSuffix,
    controlTaskSid, releaseType: 'triggerStudioFlow'|'postSurveyComplete',
    studioFlowSid, channelType, isConversation, chatbotCallbackWebhookSid }

Flow:
  1. captureChannelWithBot → Bot takes over conversation
  2. chatbotCallback → Bot interaction complete, initiate handoff
  3. chatbotCallbackCleanup → Clean up bot state, restore normal flow
  4. If releaseType='postSurveyComplete' → End conversation after survey
```

---

## 10. Plugin Initialization Sequence (Complete 14-Step)

```
FlexPlugin.init(flex, manager)
  → 1. setUpHrmConfig(manager)
     ├── Parse Flex serviceConfiguration attributes
     ├── Resolve feature flags (service config → env vars → REACT_APP_FF_*)
     ├── Bot detection: identity matches /aselo.+.*techmatters/
     ├── Build hrmConfig object (30+ properties):
     │   ├── hrmBaseUrl, serverlessBaseUrl, lambdaBaseUrl, assistantBaseUrl
     │   ├── helplineCode, accountSid, workerSid, identity
     │   ├── contactSaveFrequency: 'onTabChange'|'onFinalSaveAndTransfer'
     │   ├── enableUnmaskingCalls, enableClientProfiles, enableConferencing
     │   ├── hideAddToNewCaseButton, multipleOfficeSupport
     │   ├── enforceZeroTranscriptRetention
     │   └── All 35+ feature flags (enable_* and use_twilio_lambda_*)
     └── Store in module-level singleton
  → 2. setUpActions(flex, manager) — 6 task lifecycle hooks:
     ├── beforeAcceptTask: validate task, check existing contact
     ├── afterAcceptTask: create contact draft, init form routing
     │   ├── Set up conversation listeners (post-survey tracking if flag on)
     │   ├── For voice: start recording, init conference tracking
     │   └── afterNavigateToView: track active task SID for routing
     ├── hangupCall: set HangUpBy in localStorage (Agent/Customer/Consult/Transfer)
     ├── wrapupTask: finalize contact, determine media, save
     ├── completeTask: push insights, dual-write if enabled
     ├── afterCompleteTask: garbage collect, clean routing state
     └── excludeDeactivateConversationOrchestration: prevent Flex from auto-deactivating
  → 3. setUpChannels(flex, manager)
     ├── Default: voice, sms, facebook, whatsapp, web
     ├── Custom: telegram (color:#1DA1F2), instagram (#833AB4), line (#00C300),
     │   messenger, modica — each with custom icon, color, number extraction
     ├── Apply masking to channel templates if VIEW_IDENTIFIERS absent
     └── Register channel number extraction transforms per channel type
  → 4. setUpComponents(flex, manager) — 23+ component registrations:
     ├── CustomCRMContainer → flex.CRMContainer (replaces default CRM)
     ├── QueuesStatus → flex.ViewCollection "queue-statuses"
     ├── CaseList → flex.ViewCollection "case-list"
     ├── StandaloneSearch → flex.ViewCollection "standalone-search"
     ├── Transfer UI components
     ├── Conference components (if voice enabled)
     ├── Custom sidebar links (if enable_custom_links)
     ├── Client profiles list (if enableClientProfiles)
     ├── Case merging banners (AddToCaseBanner, ContactAddedToCaseBanner,
     │   ContactRemovedFromCaseBanner, CaseCreatedBanner)
     ├── LLM notification handler (if enable_llm_summary)
     └── Keyboard shortcut: V → toggleDialpad (throttle: 100ms)
  → 5. maskIdentifiers(manager) — if agent lacks VIEW_IDENTIFIERS permission
     ├── maskChannelStringsWithIdentifiers per channel type
     ├── maskManagerStringsWithIdentifiers on Flex templates
     └── maskConversationServiceUserNames on Conversations SDK
  → 6. setUpNotifications(manager)
     ├── newMessage: bell sound (from assets bucket URL)
     ├── reservedTask: ringtone per-reservation SID tracking
     │   └── AudioPlayerManager manages playback lifecycle
     └── messageAlertSubscription: 10 retries, 200ms exponential backoff
  → 7. setUpConversationListeners(manager) — post-survey tracking
     ├── If enable_post_survey: remove ALL conversation listeners on wrapup
     ├── Else: remove only participantLeft listeners
     └── On taskCompleted: deactivate listeners for transferred tasks
  → 8. setUpTaskRouterListeners(manager) — TaskRouter event hooks
  → 9. fetchPermissionRules() — GET /permissions/rules
  → 10. populateCounselors() — GET /worker/populateCounselors
  → 11. loadCurrentDefinitionVersion() — cache DefinitionVersion from backend
  → 12. If enable_confirm_on_browser_close: register window.beforeunload handler
  → 13. If enable_fullstory_monitoring: FullStory.init(orgId, devMode) +
        setUserVars(helplineCode, accountSid, displayName, email, workerSid, environment) +
        setVars('page', { flexVersion, helplineCode, pluginUrl, pluginVersion })
  → 14. MUI StylesProvider with generateClassName({ seed: 'plugin-hrm-form' })
```
     ├── Resolve feature flags (service config → env vars)
     ├── Bot detection: identity matches /aselo.+.*techmatters/
     └── Build hrmConfig object (30+ properties)
  → setUpActions(flex, manager)
     ├── beforeAcceptTask, afterAcceptTask (create/load contact)
     ├── hangupCall (set hangUpBy), wrapupTask (finalize)
     ├── completeTask (push insights), afterCompleteTask (cleanup)
  → setUpChannels(flex, manager)
     ├── Default: voice, sms, facebook, whatsapp, web
     ├── Custom: telegram, instagram, line, messenger, modica
     └── Apply masking to channel templates if VIEW_IDENTIFIERS absent
  → setUpComponents(flex, manager)
     ├── QueuesStatus, CaseList, CustomCRMContainer, Transfer UI
  → maskIdentifiers(manager) — if agent lacks VIEW_IDENTIFIERS
  → setUpNotifications(manager)
     ├── newMessage: bell sound
     └── reservedTask: ringtone every 3 seconds
  → setUpConversationListeners(manager) — post-survey tracking
  → fetchPermissionRules(), populateCounselors()
```

---

## 11. Webchat Architecture (Modern)

```
window.Twilio.initWebchat(configUrl?, overrides?)
  → Fetch config → getDefinitionVersion() → Create Redux store (5 slices)
  → Render into #aselo-webchat-widget-root → tryResumeExistingSession()
  → Phase: Loading → PreEngagementForm → MessagingCanvas

Session: POST .../webchatAuthentication/initWebchat → {token, conversationSid}
  → ConversationsClient.create(token) → getConversation → setup listeners
  → localStorage persistence → token refresh before expiry
```

---

## 12. Localization Architecture

**Agent Desktop:** Handlebars-based — base language → locale variant → definition version overrides → `Handlebars.compile()`

**Webchat:** 5-level merge (mergeConfigs.js) — defaultTranslations → locale → helpline common → environment → helpline-specific

**Languages:** 7 webchat (en, es, fr, hu, mt, ru, ukr), 13+ agent desktop locales

---

## 12B. TaskRouter Event Handling (Lambda Backend)

The `taskrouterCallback` webhook handler dispatches events to registered handlers:

```
Event: RESERVATION_ACCEPTED
  → Create new HRM contact via internal API
  → Set initial contact attributes (channel, task metadata)

Event: RESERVATION_WRAPUP
  → Adjust chat capacity: increase by 1 (capped by maxMessageCapacity)
  → Allows agent to receive new chats while wrapping up current one

Event: TASK_CREATED
  → Optional: profile flag lookup for routing decisions
```

### Offline Contact Assignment Pattern

When creating an offline/contactless task:
```
1. assignOfflineContactInit:
   ├── Temporarily set worker activity to "Available"
   ├── Create task with assignTo=workerSid attribute
   └── Return taskSid
2. assignOfflineContactResolve:
   ├── Poll for reservation (8 retries, 200ms delay each)
   ├── Accept the reservation
   └── Restore worker's previous activity state
```

This ensures the task gets routed to the specific agent even if they were in a different state.

### Chat Capacity Management

When a chat task wraps up:
```
1. Get current worker attributes (maxMessageCapacity)
2. Get current channel capacity for 'chat' channel
3. Increment capacity by 1 (not exceeding maxMessageCapacity)
4. Update worker channel capacity via TaskRouter API
```

This enables agents to handle multiple concurrent chats up to their configured maximum.

---

## 13. Build & Deployment Details

### Lambda Build
- **Runtime:** Node.js 22
- **Compiler:** TypeScript 5.8.2 via `tsc -b tsconfig.build.json`
- **Bundler:** esbuild 0.27.3
- **Docker:** Multi-stage Dockerfile:
  - Stage 1: `node:22` — install deps, compile TypeScript
  - Stage 2: `public.ecr.aws/lambda/nodejs:22` — copy compiled JS + `rsync node_modules`
  - Entry: AWS Lambda handler
- **Shared Packages:** 6 packages (hrm-types, twilio-types, twilio-configuration, ssm-cache, s3, hrm-form-definitions) → 13 lambdas

### Plugin Build
- **Bundler:** Webpack 5 with DotenvFlow (.env.development/.env.production)
- **Analyzer:** BundleAnalyzerPlugin (optional via env)
- **Output:** Flex plugin bundle deployed to Twilio Assets

### Webchat Build (Modern)
- **Bootstrap:** Create React App with `config-overrides.js`
- **Output:** Single bundle `webchat.min.js` (no code splitting via `splitChunks: false`)
- **No hash in filename** — deterministic output path for embedding

### E2E Test Infrastructure
- **Framework:** Playwright v1.30.0 (60s default timeout)
- **Auth:** Okta PKCE flow for agent authentication
- **Docker:** ARM64 base with AWS Lambda RIC/RIE for Lambda-based test execution
- **Suites:** 5 Playwright suites (caselist, webchat, login, offlineContact, referrableResources) + 3 UI component tests (agent-desktop, case-list, case-view with AXE accessibility)
- **Mocks:** flex-in-a-box for isolated component testing

### Testing (Unit)
- **Framework:** Jest with 2-minute timeout
- **Environment:** jsdom
- **React Adapter:** Enzyme with React 17 adapter
- **CSS:** identity-obj-proxy for CSS module mocking

### Infrastructure Scripts
- **Terraform:** Makefile targets (init/validate/plan/apply/destroy)
- **Twilio Resources:** `npm run twilioResources -- <command>`
- **Secrets:** STS role assumption + SSM secret management scripts
- **Flex Config:** Flex configuration updater for deployment
