# API Contracts & Endpoints

## Aselo Platform — Complete API Surface for .NET MAUI Rebuild

**Source:** Reverse-engineered from `techmatters/flex-plugins`  
**Date:** 2026-03-30

---

## 1. API Layers Overview

The frontend communicates through four distinct API layers:

| Layer | Base URL Pattern | Auth Method | Purpose |
|-------|-----------------|-------------|---------|
| **HRM API** | `{hrmBaseUrl}/v0/accounts/{accountSid}` | Bearer token in `Authorization` header | Contact, Case, Profile, CSAM CRUD |
| **Protected/Serverless API** | `{serverlessBaseUrl}` | Token in request body (`Token` field) | Twilio operations (tasks, transfers, workers) |
| **Resources API** | `{resourcesBaseUrl}/v0/accounts/{accountSid}` | Bearer token in `Authorization` header | Resource search and referrals |
| **Lambda Direct** | `{lambdaBaseUrl}/{helplineCode}` | Varies per endpoint | Webchat init, channel operations |

---

## 2. Base HTTP Pattern

All API calls use a common `fetchApi` wrapper:

```
Headers:
  Content-Type: application/json
  Authorization: Bearer {twilioFlexToken}  (for HRM and Resources APIs)

Body (for Protected API):
  { Token: {twilioFlexToken}, ...params }

Error format:
  { error: string, status: number }
```

---

## 3. Contact Service Endpoints

### Base: `{hrmBaseUrl}/v0/accounts/{accountSid}/contacts`

All list/search endpoints automatically append `onlyEssentialData=true` to reduce payload size.

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|-------------|----------|
| POST | `/contacts` | Create new contact | `Partial<Contact>` | `Contact` |
| PATCH | `/contacts/{contactId}` | Update existing contact | `Partial<Contact>` | `Contact` |
| PATCH | `/contacts/{contactId}?finalize=true` | Finalize contact (marks FinalizedAt) | `Partial<Contact>` | `Contact` |
| PATCH | `/contacts/{contactId}?finalize=false` | Save draft without finalizing | `Partial<Contact>` | `Contact` |
| GET | `/contacts/{contactId}` | Get contact by ID | — | `Contact` |
| PATCH | `/contacts/{contactId}/connectToCase` | Link contact to case | `{ caseId: string }` | `Contact` |
| DELETE | `/contacts/{contactId}/connectToCase` | Unlink contact from case | — | `Contact` |
| POST | `/contacts/search` | Legacy search contacts | `SearchParams` + pagination | `{ count, contacts[] }` |
| POST | `/contacts/generalizedSearch` | New generalized search | `{ searchParameters, limit, offset }` | `{ count, contacts[] }` |
| GET | `/contacts/byTaskSid/{taskSid}` | Get contact by task SID | — | `Contact` |
| POST | `/contacts/{contactId}/conversationMedia` | Add conversation media | `ConversationMedia[]` | `Contact` |

### Contact Search Request Body
```json
{
  "firstName": "string",
  "lastName": "string",
  "counselor": "string",
  "phoneNumber": "string",
  "dateFrom": "string",
  "dateTo": "string",
  "contactNumber": "string",
  "helpline": "string",
  "onlyDataContacts": false,
  "limit": 20,
  "offset": 0
}
```

---

## 4. Case Service Endpoints

### Base: `{hrmBaseUrl}/v0/accounts/{accountSid}/cases`

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|-------------|----------|
| POST | `/cases` | Create new case | `{ status, info, helpline, ... }` | `Case` |
| GET | `/cases/{caseId}` | Get case by ID | — | `Case` |
| PUT | `/cases/{caseId}` | Update case | `Partial<Case>` | `Case` |
| PUT | `/cases/{caseId}/overview` | Update case overview | `CaseInfo` | `Case` |
| PUT | `/cases/{caseId}/status` | Transition case status | `{ status, statusUpdatedBy }` | `Case` |
| POST | `/cases/search` | Legacy search/list cases | See below | `{ count, cases[] }` |
| POST | `/cases/generalizedSearch` | New generalized search | `{ searchParameters, limit, offset }` | `{ count, cases[] }` |
| GET | `/cases/{caseId}/timeline` | Get case timeline | Query: `sectionTypes=X,Y&includeContacts=bool&limit=N&offset=N` | `TimelineActivity[]` |
| POST | `/cases/{caseId}/sections/{sectionType}` | Add case section | `{ sectionTypeSpecificData, eventTimestamp }` | `CaseSection` |
| PUT | `/cases/{caseId}/sections/{sectionType}/{sectionId}` | Update case section | `{ sectionTypeSpecificData, eventTimestamp }` | `CaseSection` |
| GET | `/cases/{caseId}/sections/{sectionType}` | List sections by type | — | `CaseSection[]` |

### Case List/Search Request Body
```json
{
  "limit": 20,
  "offset": 0,
  "sort": {
    "sortBy": "CREATED_AT",
    "sortDirection": "DESC"
  },
  "filters": {
    "counsellors": ["WK..."],
    "statuses": ["open"],
    "includeOrphans": false,
    "createdAt": { "from": "2024-01-01", "to": "2024-12-31" },
    "updatedAt": null,
    "followUpDate": null,
    "categories": [{ "category": "abuse", "subcategory": "physical" }]
  }
}
```

---

## 5. Profile Service Endpoints

### Base: `{hrmBaseUrl}/v0/accounts/{accountSid}/profiles`

| Method | Path | Description | Query Params | Response |
|--------|------|-------------|-------------|----------|
| GET | `/profiles/{profileId}` | Get profile by ID | — | `Profile` |
| GET | `/profiles` | List profiles | `limit, offset, sortBy=id\|name\|createdAt\|updatedAt, sortDirection=asc\|desc, profileFlagIds=1,2,3` | `{ count, profiles[] }` |
| GET | `/profiles/{profileId}/contacts` | Get profile's contacts | `limit, offset` | `{ count, contacts[] }` |
| GET | `/profiles/{profileId}/cases` | Get profile's cases | `limit, offset` | `{ count, cases[] }` |
| POST | `/profiles/{profileId}/sections` | Create profile section | `{ sectionType, content }` | `ProfileSection` |
| PUT | `/profiles/{profileId}/sections/{sectionId}` | Update profile section | `{ content }` | `ProfileSection` |
| POST | `/profiles/{profileId}/flags` | Add flag to profile | `{ flagId, validUntil }` | `ProfileFlagAssociation` |
| DELETE | `/profiles/{profileId}/flags/{flagId}` | Remove flag from profile | — | `void` |

### Base: `{hrmBaseUrl}/v0/accounts/{accountSid}/identifiers`

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/identifiers/{identifierId}` | Get identifier | `Identifier` |

### Base: `{hrmBaseUrl}/v0/accounts/{accountSid}/profiles/flags`

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/profiles/flags` | List all profile flags | `ProfileFlag[]` |

---

## 6. CSAM Report Service Endpoints

### Base: `{hrmBaseUrl}/v0/accounts/{accountSid}/csamReports`

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|-------------|----------|
| POST | `/csamReports` | Create CSAM report | `{ reportType, ... }` | `CSAMReportEntry` |
| PUT | `/csamReports/{reportId}` | Update CSAM report | `{ acknowledged }` | `CSAMReportEntry` |
| GET | `/csamReports/contact/{contactId}` | Get reports for contact | — | `CSAMReportEntry[]` |

---

## 7. Permissions Service Endpoints

### Base: `{hrmBaseUrl}/v0/accounts/{accountSid}/permissions`

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/permissions/rules` | Get permission rules for current user | `PermissionRules` |

---

## 8. Insights Service Endpoints

### Base: `{hrmBaseUrl}/v0/accounts/{accountSid}/insights`

| Method | Path | Description | Request Body |
|--------|------|-------------|-------------|
| POST | `/insights/oneToOne` | Push one-to-one insights data | Insights payload |
| POST | `/insights/oneToMany` | Push one-to-many insights data | Insights payload |

---

## 9. Account-Scoped Lambda Routes (Complete Route Table)

### Route prefix: `/lambda/twilio/account-scoped/{accountSid}/`

All routes pass through `validateRequestMethod` first. Auth column indicates additional validation.

#### Webhook-Authenticated Routes (Twilio Signature Validation)

| Route Path | Handler | Description |
|-----------|---------|-------------|
| `webhooks/taskrouterCallback` | handleTaskRouterEvent | TaskRouter event callbacks |
| `getProfileFlagsForIdentifier` | handleGetProfileFlagsForIdentifier | Identifier flag lookup for Studio flows |
| `channelCapture/captureChannelWithBot` | handleCaptureChannelWithBot | Bot channel capture initiation |
| `channelCapture/chatbotCallback` | handleChatbotCallback | Bot callback handler |
| `channelCapture/chatbotCallbackCleanup` | handleChatbotCallbackCleanup | Bot cleanup after handoff |
| `conference/conferenceStatusCallback` | conferenceStatusCallbackHandler | Conference status events |
| `conference/participantStatusCallback` | participantStatusCallbackHandler | Participant status events |
| `conversations/serviceScopedConversationEventHandler` | handleConversationEvent | Conversation lifecycle events |
| `conversation/checkBlockList` | checkBlockListHandler | IP/identity block list check |
| `customChannels/instagram/flexToInstagram` | flexToInstagramHandler | Agent → Instagram message relay |
| `customChannels/telegram/flexToTelegram` | flexToTelegramHandler | Agent → Telegram message relay |
| `customChannels/modica/flexToModica` | flexToModicaHandler | Agent → Modica SMS relay |
| `customChannels/line/flexToLine` | flexToLineHandler | Agent → LINE message relay |
| `conversation/sendStudioMessage` | sendStudioMessageHandler | Studio flow message dispatch |
| `conversation/sendMessageAndRunJanitor` | sendMessageAndRunJanitorHandler | Message + conversation cleanup |

#### Flex Token Authenticated Routes — Agent Mode

| Route Path | Handler | Description |
|-----------|---------|-------------|
| `conference/addParticipant` | addParticipantHandler | Add participant to conference |
| `conference/getParticipant` | getParticipantHandler | Get participant details |
| `conference/removeParticipant` | removeParticipantHandler | Remove participant from conference |
| `conference/updateParticipant` | updateParticipantHandler | Update hold/mute/endConferenceOnExit |
| `conversation/transitionAgentParticipants` | transitionAgentParticipantsHandler | Transition participant state |
| `task/assignOfflineContactInit` | assignOfflineContactInitHandler | Create offline contact task (init) |
| `task/assignOfflineContactResolve` | assignOfflineContactResolveHandler | Create offline contact task (resolve) |
| `task/checkTaskAssignment` | checkTaskAssignmentHandler | Verify task assignment |
| `task/completeTaskAssignment` | completeTaskAssignmentHandler | Complete task assignment |
| `task/cancelOrRemoveTask` | cancelOrRemoveTaskHandler | Cancel or remove a task |
| `task/getTaskAndReservations` | getTaskAndReservationsHandler | Get task with all reservations |
| `transfer/transferStart` | transferStartHandler | Initiate warm or cold transfer |
| `integrations/iwf/reportToIWF` | reportToIWFHandler | Submit counsellor IWF report |
| `integrations/iwf/selfReportToIWF` | selfReportToIWFHandler | Submit self-generated IWF report |
| `conversation/getExternalRecordingS3Location` | getExternalRecordingS3LocationHandler | Lookup recording in S3 |
| `conversation/getMediaUrl` | getMediaUrlHandler | Get signed media URL |
| `worker/populateCounselors` | populateCounselorsHandler | List all counselors |
| `worker/getWorkerAttributes` | getWorkerAttributesHandler | Get worker attributes |
| `worker/listWorkerQueues` | listWorkerQueuesHandler | List queues for worker |
| `worker/pullTask` | pullTaskHandler | Pull task from queue |
| `conversation/sendSystemMessage` | sendSystemMessageHandler | Send system message to conversation |
| `issueSyncToken` | issueSyncTokenHandler | Issue Twilio Sync token |

#### Flex Token Authenticated Routes — Supervisor Mode

| Route Path | Handler | Description |
|-----------|---------|-------------|
| `toggleSwitchboardQueue` | handleToggleSwitchboardQueue | Enable/disable switchboarding for queue |
| `updateWorkersSkills` | handleUpdateWorkersSkills | Update worker skills |

#### Flex Token Authenticated Routes — Guest Mode

| Route Path | Handler | Description |
|-----------|---------|-------------|
| `endChat` | handleEndChat | End webchat conversation |

#### No Authentication Routes

| Route Path | Handler | Description |
|-----------|---------|-------------|
| `customChannels/instagram/instagramToFlex` | instagramToFlexHandler | Instagram → Flex inbound |
| `customChannels/telegram/telegramToFlex` | telegramToFlexHandler | Telegram → Flex inbound |
| `customChannels/modica/modicaToFlex` | modicaToFlexHandler | Modica → Flex inbound |
| `customChannels/line/lineToFlex` | lineToFlexHandler | LINE → Flex inbound |
| `webchatAuth/initWebchat` | initWebchatHandler | Initialize webchat session (public) |
| `webchatAuth/refreshToken` | refreshTokenHandler | Refresh webchat JWT (public) |
| `operatingHours` | handleOperatingHours | Check operating hours (public) |

### Environment Short-Code Routes

Route prefix: `/lambda/twilio/account-scoped/{HELPLINE_CODE}/`
Used by webchat clients that don't have the account SID (resolves via SSM lookup).

| Route Path | Auth | Handler |
|-----------|------|---------|
| `webchatAuthentication/initWebchat` | None | initWebchatHandler |
| `webchatAuthentication/refreshToken` | JWT token validation | refreshTokenHandler |
| `endChat` | JWT token validation | handleEndChat |
| POST | `/recordings/getTranscript` | Get recording transcript | `{ Token, recordingSid }` |
| POST | `/iwf/report` | Submit IWF incident report | `{ Token, url, imageHash, ... }` |
| GET | `/sync/token` | Get Twilio Sync token | Query: `Token` |
| POST | `/taskRouter/createOfflineContactTask` | Create offline task | `{ Token, attributes }` |

---

## 10. Resource Service Endpoints

### Base: `{resourcesBaseUrl}/v0/accounts/{accountSid}/resources`

| Method | Path | Description | Query Params | Response |
|--------|------|-------------|-------------|----------|
| GET | `/resources/search` | Search resources | `generalSearchTerm, filters (JSON), start, limit` | `{ totalCount, results: ReferrableResource[] }` |
| GET | `/resources/{resourceId}` | Get resource by ID | — | `ReferrableResource` |
| GET | `/resources/suggest` | Autocomplete suggestions | `prefix` | `SuggestSearch.suggestions` |
| GET | `/resources/reference-attributes/{list}` | Get reference attribute values | `language, valueStartsWith` | `ReferenceAttributeStringValue[]` |
| GET | `/resources/list-string-attributes/{key}` | Get distinct string attribute values | `language, valueStartsWith` | `ListAttributeStringValue[]` |

---

## 11. LLM / AI Service Endpoints

### Base: `{assistantBaseUrl}` (configured per environment)

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|-------------|----------|
| POST | `/summarize/{contactId}` | Generate AI summary from transcript | `{ transcript: TranscriptForLlmAssistant }` | `{ summaryText: string, id: string }` |

`TranscriptForLlmAssistant` = array of `{ from, role, content }` objects representing chat messages.

---

## 12. Files / Signed URL Endpoints

### Base: `{hrmBaseUrl}/v0/accounts/{accountSid}/files`

| Method | Path | Description | Query Params | Response |
|--------|------|-------------|-------------|----------|
| GET | `/files/urls` | Get signed URL for media access | `method=getObject\|putObject\|deleteObject&objectType=case\|contact&objectId=X&fileType=recording\|transcript\|document&bucket=X&key=X` | `{ signedUrl: string }` |

---

## 13. Switchboard Service Endpoints

### Via Lambda: `/lambda/twilio/account-scoped/{accountSid}/toggleSwitchboardQueue`
Auth: Supervisor flex token

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| POST | `toggleSwitchboardQueue` | Enable/disable queue switchboarding | `{ originalQueueSid, operation: "enable"\|"disable", supervisorWorkerSid }` | `SwitchboardSyncState` |

### Via Lambda: `/lambda/twilio/account-scoped/{accountSid}/worker/pullTask`

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| POST | `worker/pullTask` | Pull task from switchboard queue | `{ taskSid }` | Task details |

---

## 14. Custom Channel Endpoints (Lambda)

### Instagram Webhook
```
POST /instagram/webhook
Body: Instagram webhook payload
Auth: HMAC-SHA256 signature in X-Hub-Signature-256 header
```

### LINE Webhook
```
POST /line/webhook
Body: LINE webhook payload  
Auth: S3 webhook map routing
```

### Modica Webhook
```
POST /modica/webhook
Body: Modica SMS webhook payload
Auth: S3 webhook map routing
```

---

## 15. Webchat Endpoints (Used by Webchat Widget)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/initWebchat` | Create webchat session | None (public) |
| POST | `/refreshToken` | Refresh JWT token | Existing token |
| POST | `/endChat` | End conversation | Session token |
| POST | `/operatingHours` | Check availability | None (public) |
| POST | `/recaptchaValidation` | Verify reCAPTCHA | reCAPTCHA token |

### `/initWebchat` Request
```json
{
  "CustomerFriendlyName": "John",
  "PreEngagementData": "{\"helpline\":\"as\",\"language\":\"en\",\"contactType\":\"ip\"}",
  "DeploymentKey": "CVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
}
```

### `/initWebchat` Response
```json
{
  "token": "eyJ...",
  "conversationSid": "CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "identity": "anonymous_Hxxxxxxx",
  "expiration": "2024-01-01T01:00:00Z"
}
```

---

## 16. Error Response Format

All APIs return errors with this structure:

```json
{
  "error": "Description of what went wrong",
  "status": 400
}
```

HTTP Status Codes used:
- `200` — Success
- `400` — Bad request / validation error
- `401` — Unauthorized (invalid/missing token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not found
- `409` — Conflict (e.g., duplicate)
- `500` — Internal server error

---

## 17. Pagination Pattern

All list endpoints support pagination:

```
Query string: ?limit=20&offset=0

Response wrapper:
{
  "count": 150,      // Total matching records
  "data": [...]      // Page of results
}
```

Or for POST-based search:
```json
{
  "limit": 20,
  "offset": 0,
  "...other search params"
}
```

---

## 18. Authentication Token Flow

### Agent Desktop (Flex Token)
```
1. Agent logs in via Okta SSO → Twilio Flex
2. Flex generates JWT with claims: { worker_sid, roles, account_sid }
3. Plugin reads token from Flex Manager
4. Token sent as:
   - HRM API: Authorization: Bearer {token}
   - Serverless API: Body { Token: token }
5. Lambda validates via twilio-flex-token-validator
```

### Webchat (Anonymous Token)
```
1. Widget calls POST /initWebchat with DeploymentKey
2. Lambda creates WebChannel via Twilio Flex API
3. Lambda generates Conversations JWT for anonymous identity
4. Widget uses JWT to connect to Twilio Conversations SDK
5. Token refreshed via POST /refreshToken before expiry
```

---

## 19. Conference Service — Exact Parameter Shapes

```
POST conference/addParticipant
Body: {
  conferenceSid: string,
  to: string,           // Phone number or client URI
  from: string,         // Caller ID
  callStatusSyncDocumentSid: string,
  label: string
}

POST conference/getParticipant
Body: { conferenceSid: string, callSid: string }
Response: { participant: object }

POST conference/removeParticipant
Body: { conferenceSid: string, callSid: string }

POST conference/updateParticipant
Body: {
  conferenceSid: string,
  callSid: string,
  updates: {
    endConferenceOnExit?: boolean,
    hold?: boolean,
    muted?: boolean
  }
}
```

---

## 20. IWF Reporting — Exact Field Mappings

```
POST integrations/iwf/reportToIWF  (counsellor-generated)
Body: {
  Reported_URL: string,          // form.webAddress
  Reporter_Description: string,  // form.description
  Reporter_Anonymous: "Y" | "N", // form.anonymous === 'anonymous' ? 'Y' : 'N'
  Reporter_First_Name: string,
  Reporter_Last_Name: string,
  Reporter_Email_ID: string
}

POST integrations/iwf/selfReportToIWF  (self/child-generated)
Body: {
  user_age_range: string,  // form.childAge
  case_number: string
}
```

---

## 21. Webchat Security Headers

All webchat API calls include these anti-bot fingerprinting headers:

```
x-twilio-sec-usersettings: JSON { language, cookieEnabled, userTimezone }
x-twilio-sec-webchatinfo: JSON { loginTimestamp }
x-twilio-sec-decoders: JSON { audio: MediaCapabilitiesInfo, video: MediaCapabilitiesInfo }
ui-version: string  (app version)
webchat-version: string
```

Webchat API calls use `Content-Type: application/x-www-form-urlencoded` (not JSON).

---

## 22. Satellite Lambda Endpoints

These lambdas run as independent deployments (not part of account-scoped):

| Lambda | Trigger | Auth | Purpose |
|--------|---------|------|---------|
| `facebookSignin` | HTTP GET/POST | Facebook OAuth | Facebook Page token exchange (3-step) |
| `facebookCallback` | HTTP GET | OAuth callback | Complete Facebook OAuth flow |
| `instagramWebhook` | HTTP POST | HMAC-SHA1 | Instagram message relay to Twilio |
| `lineSetup` | HTTP POST | None | Configure LINE webhook mapping in S3 |
| `lineWebhook` | HTTP POST | LINE signature | LINE message relay to Twilio |
| `modicaWebhook` | HTTP POST | S3 map lookup | Modica SMS relay to Twilio |
| `recaptchaVerify` | HTTP POST | None | Google reCAPTCHA server-side verification |
| `savePendingContacts` | Scheduled | None | Save pending contacts from S3 config to HRM |
| `TwilioErrorReporter` | CloudWatch Events | None | Forward Twilio errors to Datadog (PII-filtered) |
| `twilioEventStreams` | EventBridge | None | Process Twilio event stream events |
| `ipLocationFinder` | HTTP POST | None | IP geolocation via ipfind.co API |
| `integrationTestRunner` | HTTP POST | None | Run integration tests (dual-mode) |

---

## 23. HRM Internal API (Lambda → HRM Backend)

Lambda functions communicate with the HRM backend using a dedicated internal API, separate from the frontend-facing API:

| Aspect | Detail |
|--------|--------|
| **URL Pattern** | `/internal/${apiVersion}/accounts/${hrmAccountId}/${path}` |
| **Auth** | Basic Auth with static API key from SSM |
| **Retry** | 3 attempts on failure |
| **Content-Type** | `application/json` |

**Used by:**
- `taskrouterCallback` handler (RESERVATION_ACCEPTED → create contact)
- `chatbotCallback` handler (update contact with bot interaction data)
- Post-survey handlers (save survey responses to contact)
- `getProfileFlagsForIdentifier` (profile flag lookup for routing)

---

## 24. Operating Hours Endpoint (Detailed)

### Request
```
POST /operatingHours
Body: {
  channel: string,                        // "web", "voice", etc.
  includeMessageTextInResponse: boolean,  // Include friendly message text
  language: string                        // Locale for message text
}
```

### Response
```json
{
  "status": "open" | "closed" | "holiday",
  "message": "string (optional — included if includeMessageTextInResponse=true)"
}
```

**Backend Logic:**
1. Load helpline operating hours JSON (shift-based config)
2. Get current time in helpline's timezone
3. Check holidays map (`"MM/DD/YYYY"` → holiday name)
4. If not holiday, check operating shifts for current channel + day
5. Compare current HHMM time against shift open/close values
6. If `multipleOfficeSupport`: check per-office configs with root fallback
7. Return status + optional localized message

---

## 25. Form Definitions Cache URL Pattern

Form definitions are loaded from S3 via the HRM API:

```
URL: {assetsBucketUrl}/form-definitions/{helplineCode}/{version}
Example: https://assets-bucket.s3.amazonaws.com/form-definitions/as/as-v1

Cache: In-memory Map<string, DefinitionVersion>
Flow:
  1. Frontend requests form definition version
  2. Lambda/HRM API proxies to S3 (or returns cached)
  3. DefinitionVersion JSON parsed and returned
  4. Frontend caches in Redux (definitionVersions state slice)
```

---

## 26. Integration Test Runner Dual-Mode Endpoint

The `integrationTestRunner` Lambda serves two purposes:

| Mode | Trigger | Purpose |
|------|---------|---------|
| **Test Runner** | `IntegrationTestEvent` | Run Jest test suites within Lambda |
| **Webhook Receiver** | `ALBEvent` | Handle HTTP webhook callbacks during tests |

```
IntegrationTestEvent: { testSuite: string, env: object }
  → Runs Jest within Lambda runtime
  → Returns test results

ALBEvent: Standard HTTP request
  → Routes to test webhook handlers
  → Used for callback testing (e.g., Twilio webhooks)
```
