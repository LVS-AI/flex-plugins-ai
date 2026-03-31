# Feature Inventory & Feature Flags

## Aselo Platform — Complete Feature Map for .NET MAUI Rebuild

**Source:** Reverse-engineered from `techmatters/flex-plugins`  
**Date:** 2026-03-30

---

## 1. Feature Registry

### 1.1 Core Features (Always Enabled)

| # | Feature | Module | Description |
|---|---------|--------|-------------|
| 1 | **Contact Creation** | contacts | Create contact records from live calls/chats or offline entry |
| 2 | **Call Type Selection** | CallTypeButtons | Choose "Child calling about self" or "Someone calling about a child" (+ custom types) |
| 3 | **Tabbed Contact Forms** | tabbedForms | Multi-tab form: Caller Info, Child Info, Case Info, Categories |
| 4 | **Dynamic Form Rendering** | forms/inputGenerator | Render form fields from DefinitionVersion JSON schemas |
| 5 | **Issue Categorization** | categories | Grid of categories/subcategories with selection limits |
| 6 | **Contact Save** | contacts/saveContact | Persist contact to HRM API on wrapup/complete |
| 7 | **Case Creation** | case/openNewCase | Create new case and link to current contact |
| 8 | **Case Linking** | contacts/connectToCase | Associate contacts with existing cases |
| 9 | **Case Status Management** | case/caseStatus | Configurable status transitions (open → closed, etc.) |
| 10 | **Case Sections** | case/sections | Add/edit typed sub-records (notes, referrals, incidents) |
| 11 | **Case Timeline** | case/timeline | Chronological view of all activities in a case |
| 12 | **Case List** | caseList | Filterable, sortable list of all cases |
| 13 | **Search** | search | Search contacts and cases by multiple criteria |
| 14 | **Per-Task Routing** | routing | Independent navigation stack per active task |
| 15 | **Multi-Channel Support** | channels | Handle voice, SMS, WhatsApp, Facebook, web, and more |
| 16 | **Transfer (Cold)** | transfer | Hand off task to another agent/queue |
| 17 | **Transfer (Warm)** | transfer | Consult with another agent, then transfer |
| 18 | **Localization** | configuration | Multi-language UI with runtime switching |
| 19 | **Permission System** | permissions | Role-based + time-based + ownership-based access control |
| 20 | **Contact Working Copy** | contacts | Draft edits before committing |

### 1.2 Feature-Flagged Features

Each feature below is controlled by a boolean flag in the deployment configuration.

| Flag | Feature | Module | Description |
|------|---------|--------|-------------|
| `enable_csam_report` | **CSAM Reporting** | CSAMReport | Submit child safety abuse material reports |
| `enable_csam_clc_report` | **CSAM CLC Report** | CSAMReport | CLC-specific CSAM reporting variant |
| `enable_canned_responses` | **Canned Responses** | cannedResponses | Pre-written message templates for quick replies |
| `enable_emoji_picker` | **Emoji Picker** | emojiPicker | Emoji selection palette for chat messages |
| `enable_dual_write` | **Dual Write** | dualWrite | Sync contact data to external backend (e.g., Brazil system) |
| `enable_external_transcripts` | **External Transcripts** | contact/MediaSection | View transcripts stored in S3 |
| `enable_twilio_transcripts` | **Twilio Transcripts** | contact/MediaSection | View Twilio-native transcripts |
| `enable_voice_recordings` | **Voice Recordings** | recordingsService | Access voice call recordings |
| `enable_fullstory_monitoring` | **FullStory** | fullStory | Session recording analytics |
| `enable_language_selector` | **Language Selector** | configuration | UI to switch display language |
| `enable_save_insights` | **Save to Insights** | InsightsService | Push data to analytics/reporting system |
| `enable_post_survey` | **Post Survey** | (post-call) | Post-interaction survey |
| `enable_previous_contacts` | **Previous Contacts** | contacts | Show caller's prior contacts |
| `enable_switchboarding` | **Switchboard** | switchboard | Manual queue management (view pending tasks) |
| `enable_switchboarding_move_tasks` | **Move Tasks** | switchboard | Move tasks between queues |
| `enable_manual_pulling` | **Manual Pulling** | queuesView | Manually pull tasks from queues |
| `enable_select_agents_teams_view` | **Select Agents** | teamsView | Select agents for task assignment |
| `enable_assigned_skill_teams_view_filters` | **Skill Filters** | teamsView | Filter teams view by assigned skills |
| `enable_custom_links` | **Custom Links** | customSideLinks | Configurable sidebar navigation links |
| `enable_conference_status_event_handler` | **Conference Events** | conference | Conference call status tracking |
| `enable_confirm_on_browser_close` | **Close Confirmation** | (browser) | Warn agent before closing browser tab |
| `enable_last_case_status_update_info` | **Status Update Info** | case | Show who/when last updated case status |
| `enable_llm_summary` | **LLM Summary** | llmAssistant | AI-generated contact summaries |
| `enable_region_resource_search` | **Regional Resources** | resources | Filter resource search by region |
| `enable_resources_updates` | **Resource Updates** | resources | Enable resource referral updates |
| `use_prepopulate_mappings` | **Prepopulate Mappings** | contacts | Map survey/pre-engagement data to form fields |
| `use_twilio_lambda_for_conference_functions` | **Lambda Conference** | conference | Route conference calls through Lambda |
| `use_twilio_lambda_for_conversation_duration` | **Lambda Duration** | contacts | Calculate duration via Lambda |
| `use_twilio_lambda_for_iwf_reporting` | **Lambda IWF** | iwfService | IWF reporting via Lambda |
| `use_twilio_lambda_for_offline_contact_tasks` | **Lambda Offline** | contacts | Create offline tasks via Lambda |
| `use_twilio_lambda_for_recordings_lookup` | **Lambda Recordings** | recordingsService | Lookup recordings via Lambda |
| `use_twilio_lambda_for_worker_endpoints` | **Lambda Workers** | twilioWorkerService | Worker queries via Lambda |
| `use_twilio_lambda_to_issue_sync_token` | **Lambda Sync** | SyncService | Issue Sync tokens via Lambda |
| `use_twilio_lambda_to_send_messages` | **Lambda Messages** | twilioConversationService | Send messages via Lambda |
| `use_twilio_lambda_to_transition_participants` | **Lambda Participants** | conference | Manage participants via Lambda |
| `use_twilio_lambda_transfers` | **Lambda Transfers** | transfer | Execute transfers via Lambda |

---

## 2. Feature Workflows

### 2.1 Contact Creation Workflow

```
1. Task arrives (voice/chat/manual)
   ↓
2. Agent accepts task
   ↓
3. Plugin creates contact draft in Redux
   ↓
4. Call Type selection (child/caller/non-data)
   ├── Data type → Show all form tabs
   └── Non-data type → Show minimal form
   ↓
5. Agent fills form tabs:
   ├── Caller Information (dynamic fields)
   ├── Child Information (dynamic fields)
   ├── Case Information (dynamic fields)
   └── Issue Categorization (category grid)
   ↓
6. Agent optionally:
   ├── Creates/links Case
   ├── Adds Resource Referrals
   ├── Files CSAM Report
   ├── Links to Profile
   └── Generates AI Summary
   ↓
7. Agent clicks "End" or task auto-wraps
   ↓
8. Contact saved to HRM API
   ↓
9. Insights data pushed (if enabled)
   ↓
10. Task completed in TaskRouter
```

### 2.2 Case Lifecycle Workflow

```
1. Agent creates case from active contact
   → Case status: "open"
   ↓
2. Case overview populated:
   - Summary text
   - Follow-up date
   - Child-at-risk flag
   ↓
3. Case sections added over time:
   - Notes (free text + date)
   - Referrals
   - Incidents
   - Custom section types
   ↓
4. Additional contacts linked to case
   ↓
5. Status transitions:
   open → closed (by counselor/supervisor)
   closed → open (reopen, supervisor only)
   (Custom transitions per helpline)
   ↓
6. Timeline shows all activities chronologically
```

### 2.3 Search Workflow

```
1. Agent navigates to Search
   ↓
2. Fills search criteria:
   - Name, phone, date range, counselor, helpline
   ↓
3. Backend returns paginated results
   ├── Contact results (with preview)
   └── Case results (with preview)
   ↓
4. Agent clicks result
   ├── Contact → ContactDetails view
   └── Case → CaseHome view
```

### 2.4 Webchat Session Workflow

```
1. End user visits website with embedded widget
   ↓
2. Widget loads configuration (helpline, language, forms)
   ↓
3. Pre-engagement form displayed
   - Fields defined by helpline DefinitionVersion
   - Language selection
   - reCAPTCHA (optional)
   ↓
4. User submits form → POST /initWebchat
   → Lambda creates Twilio WebChannel
   → Returns JWT + conversationSid
   ↓
5. Real-time messaging phase
   - Messages via Twilio Conversations SDK
   - Typing indicators, read receipts
   - File attachments (optional)
   ↓
6. Session persistence
   - Token stored in localStorage
   - Page reload resumes session
   - Token refresh before expiry
   ↓
7. Chat ends
   ├── User clicks "End Chat" → POST /endChat
   ├── User clicks "Quick Exit" → immediate navigation away
   └── Agent completes task → conversation auto-closes
```

### 2.5 Transfer Workflow

```
Cold Transfer:
1. Agent clicks Transfer
2. Selects target (agent or queue)
3. transferStart Lambda called with mode="COLD"
4. Task moved to target
5. Original agent disconnected
6. Target agent receives task

Warm Transfer:
1. Agent clicks Transfer (Warm)
2. Selects target agent
3. transferStart Lambda called with mode="WARM"
4. Consultation channel opened (both agents in conference)
5. Conference must have <3 participants (checked: sidWithTaskControl)
6. Original agent briefs target agent
7. Original agent confirms transfer
8. Task fully transferred to target
```

### 2.6 Task Lifecycle (6 Hook Events)

The plugin registers handlers for 6 task lifecycle events in `setUpActions`:

```
beforeAcceptTask:
  ├── Check for existing contact by taskSid
  ├── Create new contact in HRM if not found
  ├── Initialize contact metadata (startMillis, categories, draft)
  └── Set up initial routing state (push TabbedForm route)

afterAcceptTask:
  ├── Set up conversation listeners (for post-survey detection)
  ├── For voice: start recording
  └── Initialize conference tracking (if voice)

hangupCall:
  ├── Agent hangs up voice call
  ├── Set HangUpBy = "Agent"
  └── Trigger wrapup

wrapupTask:
  ├── Record endMillis
  ├── Save contact to HRM (finalize=false)
  ├── Calculate conversation duration
  └── Save insights data (if enabled)

completeTask:
  ├── Finalize contact (finalize=true)
  ├── Dual-write to external backend (if enable_dual_write)
  │   ├── Save to SaferNet via ServerlessService
  │   └── On failure: queue via SyncService
  └── Remove task from Redux state

afterCompleteTask:
  ├── Run garbage collection (remove contacts >120 min stale without draft)
  └── Clean up routing state for task
```

### 2.7 Identifier Masking Flow

```
1. Plugin loads permission rules from /permissions/rules
2. Check VIEW_IDENTIFIERS permission for current user
3. If NOT granted:
   ├── maskIdentifiers() applied to:
   │   ├── Channel identities (phone numbers, usernames)
   │   ├── Flex Manager string replacements
   │   └── Notification content
   ├── Display shows "***" instead of PII
   └── Applied globally via setUpChannels
4. If granted:
   └── Normal display of identifiers
```

### 2.8 Dual Write Flow (Brazil/SaferNet)

```
1. Contact saved to HRM API (primary)
2. If enable_dual_write flag is set:
   ├── Call ServerlessService.saveContactToExternalBackend()
   ├── On success: done
   └── On failure:
       ├── Queue failed save to Twilio Sync document
       ├── SyncService retries on next opportunity
       └── Eventual consistency maintained
```

### 2.9 Bot Detection & Garbage Collection

```
Bot Detection:
  - Regex pattern: /aselo.+.*techmatters/
  - Applied to chat messages
  - Bot contacts excluded from certain operations

Contact Garbage Collection:
  - Runs after each task completion (afterCompleteTask)
  - Criteria: contact age > 120 minutes AND no draft updates
  - Removes stale contacts from Redux state
  - Preserves contacts with active drafts

Case Garbage Collection:
  - Same stale threshold pattern as contacts
  - Cleans up cases loaded into Redux but no longer active
```

### 2.10 Notification System

```
New Message Notification:
  - Trigger: chat message received while agent tab unfocused
  - Audio: bell sound
  - Visual: Flex notification banner

Reserved Task Notification:
  - Trigger: new task assigned to agent
  - Audio: ringtone sound, repeating every 3 seconds
  - Visual: Flex notification banner
  - Stops when agent accepts/rejects

Transfer Incoming:
  - Visual: banner notification about pending transfer
```

### 2.11 Localization System

```
String Resolution Order:
  1. Definition-version custom strings (per helpline)
  2. Locale-specific overrides
  3. Base English strings (default)

Template Processing:
  - Uses Handlebars.js for string interpolation
  - Template codes in layout definitions (valueTemplateCode, labelTemplateCode)
  - Dynamic values injected at render time

Supported Locales (agent desktop):
  - Configured per helpline via flexUiLocales in DefinitionVersion
  - Each locale has: shortLabel, label, aseloLocale, flexLocale

Webchat Languages (7):
  en, es, fr, hu, mt, ru, ukr
  - Namespaced translation keys
  - Language selected in pre-engagement form
```

### 2.12 Contact Save Frequency

Two modes controlled by configuration:

```
onTabChange (default for some helplines):
  - Contact draft saved to HRM every time agent switches form tabs
  - More frequent saves, higher API load
  - Better recovery if browser crashes

onFinalSaveAndTransfer:
  - Contact saved only on wrapup/complete
  - Single save operation
  - Lower API load, risk of data loss on crash
```

---

## 3. Webchat-Specific Features

| Feature | Description |
|---------|-------------|
| **Session Persistence** | JWT token stored in localStorage; survives page reload |
| **Operating Hours** | Checks helpline availability; shows closed message |
| **Quick Exit** | Safety feature — immediately navigates browser away |
| **File Attachments** | Configurable max size + accepted extensions |
| **Connectivity Notification** | Detects online/offline; shows reconnection alert |
| **Theme Support** | Dark/light theme toggle |
| **IP Blocking** | Block specific IPs from using webchat (legacy) |
| **reCAPTCHA** | Optional bot prevention on pre-engagement form |
| **Language Selection** | Pre-engagement form includes language choice |
| **Unread Messages** | Separator line for unread messages |

---

## 4. Configuration-Driven Behavior

The following behaviors are **not** hardcoded — they are defined per helpline via `DefinitionVersion`:

| Configurable Aspect | Definition Location |
|---------------------|-------------------|
| Contact form fields | `tabbedForms.CallerInformationTab`, `ChildInformationTab`, `CaseInformationTab` |
| Issue categories & subcategories | `tabbedForms.IssueCategorizationTab` |
| Call type buttons | `callTypeButtons` |
| Case statuses & transitions | `caseStatus` |
| Case section types & forms | `caseSectionTypes` |
| Case overview fields | `caseOverview` |
| Case list filter options | `caseFilters` |
| Layout (field display, preview, print) | `layoutVersion` |
| Helpline list | `helplineInformation` |
| Canned responses | `cannedResponses` |
| Profile sections | `profileForms.Sections` |
| Profile flag durations | `profileForms.FlagDurations` |
| Custom sidebar links | `customLinks` |
| Blocked emojis | `blockedEmojis` |
| Locale configuration | `flexUiLocales` |
| Custom UI strings | `customStrings` |
| Pre-engagement form | Pre-engagement form definition (separate) |
| Offline channels | `tabbedForms.ContactlessTaskTab.offlineChannels` |
| Insights mapping | `insights` |
| Prepopulate rules | `prepopulateKeys`, `prepopulateMappings` |

---

## 5. Notification Types

| Notification | Trigger | Type | Audio |
|-------------|---------|------|-------|
| New message | Chat message received while tab unfocused | Sound + visual | Bell sound |
| Reserved task | Task assigned to agent | Sound + banner | Ringtone (repeats every 3s) |
| Connectivity lost | Network disconnection | Banner | None |
| Connectivity restored | Network reconnection | Banner | None |
| Transfer incoming | Warm transfer consultation | Banner | None |
| Browser close | Agent attempts to close tab with active task | Confirmation dialog | None |

### Webchat Notifications (7 factory functions)

| Notification | Context | Dismissible |
|-------------|---------|-------------|
| Connection lost | Conversations client disconnected | No |
| Connection restored | Client reconnected | Yes (auto-timeout) |
| File too large | Attachment exceeds maxFileSize | Yes |
| File type rejected | Extension not in acceptedExtensions | Yes |
| Duplicate file | Same file already attached | Yes |
| Failed to send | Message send failed | Yes |
| General error | Generic error fallback | Yes |

---

## 6. Plugin Initialization Sequence (Complete 14-Step)

When the Flex Plugin loads, the following initialization happens in order:

```
1. HrmFormPlugin.init(flex, manager)
   ├── Read configuration from Flex Manager
   ├── Initialize Redux store
   ├── Load hrmConfig (30+ properties including contactSaveFrequency,
   │   enableUnmaskingCalls, enableClientProfiles, enableConferencing,
   │   hideAddToNewCaseButton, multipleOfficeSupport,
   │   enforceZeroTranscriptRetention)
   └── Orchestrate parallel init:
       ├── setUpActions (6 task lifecycle hooks + afterNavigateToView + conferencing + LLM)
       ├── setUpComponents (23+ component registrations)
       ├── setUpChannels (7 custom channels + masking + number extraction)
       ├── setUpTransferActions
       ├── setUpConferenceComponents (if voice)
       ├── setUpTaskRouterListeners (post-survey, transfer listener mgmt)
       └── Load DefinitionVersions cache
2. If enable_confirm_on_browser_close:
   └── Register beforeunload handler
3. If enable_fullstory_monitoring:
   └── Initialize FullStory with orgId + setUserVars + setVars
```

### 6.1 setUpComponents — Complete Registration List (23+)

```
1. CustomCRMContainer → flex.CRMContainer (replaces default Flex CRM panel)
2. QueuesStatus → flex.ViewCollection "queue-statuses" (live queue monitoring)
3. CaseList → flex.ViewCollection "case-list" (standalone case list page)
4. StandaloneSearch → flex.ViewCollection "standalone-search"
   └── Uses standalone-task-sid for non-task search context (StandaloneITask)
5. Transfer UI components (TransferContainer, TransferActions)
6. Conference components (if enableConferencing)
   └── ConferenceComponents, ConferenceActions
7. Custom sidebar links (if enable_custom_links)
   └── Per-link: "new-window" → ConfirmDialog + window.open
                  "embedded" → navigate to embedded iframe
   └── Icon map: { info: InfoIcon, map: MapIcon }
8. Client profiles list (if enableClientProfiles)
9. Case merging banners:
   ├── AddToCaseBanner (permission: addContactToCase)
   ├── ContactAddedToCaseBanner
   ├── ContactRemovedFromCaseBanner (permission: removeContactFromCase)
   └── CaseCreatedBanner
10. LLM notification handler (if enable_llm_summary)
    └── Intercepts LLM summary completion notifications
11. Keyboard shortcut: 'V' key → toggleDialpad (throttle: 100ms)
12. MUI StylesProvider with generateClassName({ seed: 'plugin-hrm-form' })
```

### 6.2 setUpActions — Complete Hook Setup

```
beforeAcceptTask:
  ├── Check for existing contact by taskSid (getContactByTaskSid)
  ├── Create new contact in HRM if not found
  ├── Initialize contact metadata (startMillis, categories, draft)
  └── Set up initial routing state (push TabbedForm route)

afterAcceptTask:
  ├── Set up Aselo conversation listeners (addAseloListener)
  │   ├── If enable_post_survey: full listener setup for survey detection
  │   └── Else: minimal listeners (participantLeft only)
  ├── For voice: start recording, init conference tracking
  ├── Track reservation SID for ringtone per-reservation playback
  └── afterNavigateToView: update active task SID for routing sync

excludeDeactivateConversationOrchestration:
  └── Prevents Flex from auto-deactivating conversation listeners
      (critical for post-survey and transfer flows)

hangupCall:
  ├── Set HangUpBy in localStorage via HangUpByStateManager
  │   (Values: Agent, Customer, Consult, Cold Transfer, Warm Transfer,
  │    External Cold Transfer, External Warm Transfer)
  └── Trigger wrapup

wrapupTask:
  ├── Record endMillis
  ├── determineConversationMedia(task, contact) → media list
  ├── saveConversationMedia(contactId, media[])
  ├── PATCH /contacts/{id}?finalize=true
  └── Save to external backend (if enable_dual_write)

completeTask:
  ├── buildInsightsData(task, contact, caseState) — if enable_save_insights
  │   ├── One-to-one: contact fields → Insights attributes
  │   └── One-to-many: categories → ';'-delimited Insights attributes
  ├── Update task attributes with insights data
  └── Complete task in TaskRouter

afterCompleteTask:
  ├── Garbage collect stale contacts (>120 min unreferenced, no draft)
  ├── Garbage collect stale cases (same criteria)
  └── Clean up routing state for completed task
```

---

## 7. Feature Interaction Matrix

Some features interact or depend on each other:

| Feature A | Feature B | Interaction |
|-----------|-----------|-------------|
| enable_dual_write | SyncService | Dual-write failures queued to Sync |
| enable_csam_report | enable_csam_clc_report | Exclusive: only one CSAM variant active |
| enable_switchboarding | enable_switchboarding_move_tasks | Move requires switchboarding base |
| enable_voice_recordings | use_twilio_lambda_for_recordings_lookup | Lambda vs direct Twilio SDK lookup |
| enable_conference_status_event_handler | Conference routes | Enables conference status callbacks |
| contactSaveFrequency | Contact draft save | Controls when HRM API is called |
| enable_save_insights | InsightsService | Pushes data to Flex Insights after save |
| enable_llm_summary | llmAssistantService | AI summary generation button appears |
| enable_post_survey | Conversation listeners | Remove ALL listeners on wrapup for bot |
| use_prepopulate_mappings | PrepopulateKeys/Mappings | Switches between legacy and new mapping logic |
| enable_custom_links | DefinitionVersion.customLinks | Sidebar links rendered from def config |
| enableClientProfiles | Profile components | Profile tab visible in search results |
| multipleOfficeSupport | Operating hours | Multi-office operating hours lookup |

---

## 8. Bot Channel Capture & Post-Survey Flow

### Bot Channel Capture

```
1. Webchat user engages chatbot (Amazon Lex)
2. Lex bot handles initial Q&A
3. Escalation trigger → captureChannelWithBot Lambda
   ├── Creates CapturedChannelAttributes:
   │   { userId, environment, helplineCode, botLanguage, botSuffix,
   │     controlTaskSid, releaseType, studioFlowSid, channelType,
   │     isConversation, chatbotCallbackWebhookSid }
   └── Sets releaseType: 'triggerStudioFlow' (agent handoff) or 'postSurveyComplete' (end after survey)
4. chatbotCallback → Bot interaction complete
   ├── If releaseType='triggerStudioFlow': initiate Studio flow for TaskRouter routing
   └── If releaseType='postSurveyComplete': close conversation
5. chatbotCallbackCleanup → Clean up bot state, restore normal conversation flow
```

### Post-Survey Flow

```
1. Agent wraps up task (wrapupTask event)
2. If enable_post_survey:
   ├── Remove ALL conversation listeners (removeConversationListenersForTask)
   │   → Allows post-survey chatbot to interact without agent interference
   ├── Chatbot sends survey questions to caller
   └── On survey complete:
       ├── chatbotCallback with releaseType='postSurveyComplete'
       └── Conversation closed
3. If NOT enable_post_survey:
   ├── Remove only participantLeft listeners
   │   → Prevents chat history from disappearing prematurely
   └── Conversation closes normally
```

---

## 9. Offline Contact Assignment (Detailed)

```
1. Agent clicks "Create offline contact" (contactless task)
2. assignOfflineContactInit Lambda:
   ├── Save worker's current activity state
   ├── Temporarily set worker activity to "Available"
   ├── Create task with attributes: { assignTo: workerSid, targetSid: workerSid }
   └── Return taskSid
3. assignOfflineContactResolve Lambda:
   ├── Poll for reservation (up to 8 retries with 200ms delay each)
   ├── Accept the reservation once found
   └── Restore worker's previous activity state
4. Task appears in agent's task list
5. Agent fills contactless form (custom fields per helpline)
6. Normal save/complete flow
```

---

## 10. Notification System (Detailed)

### Audio Notifications

```
Reserved Task Ringtone:
  ├── Per-reservation SID tracking (prevents duplicate ringtones)
  ├── AudioPlayerManager manages playback lifecycle
  ├── Ringtone plays every 3 seconds until accepted/rejected
  └── Sound URLs from assets bucket (configurable per helpline)

New Message Bell:
  ├── Single bell sound on chat message received
  └── Only when agent tab is unfocused
```

### Message Alert Subscription Retry

```
messageAlertSubscription:
  ├── Subscribe to Flex message alerts (chat notifications)
  ├── Retry logic: 10 attempts with 200ms exponential backoff
  │   delay = 200ms * 2^attempt (200, 400, 800, 1600, ... up to ~100s)
  └── On final failure: log error, no notification support
```

---

## 11. Prepopulate System (Two Strategies)

### Legacy: PrepopulateKeys

```
Simple 1:1 mapping from pre-engagement data fields to form fields:
  { "contactIdentifier": "phone", "language": "preferredLanguage" }
When pre-engagement form is submitted, matching keys are copied to form fields.
```

### New: PrepopulateMappings (2D AND/OR Logic)

```
Complex mappings with conditional logic:
  [
    [ // OR group 1 (all conditions must match = AND)
      { source: "preEngagement.contactType", target: "form.callerInfo.contactType" },
      { source: "preEngagement.age", target: "form.childInfo.age", transform: "checkbox" }
    ],
    [ // OR group 2 (alternative mapping)
      { source: "preEngagement.name", target: "form.callerInfo.firstName" }
    ]
  ]

Checkbox transform: "yes"/"no" strings → boolean true/false
Feature flag: use_prepopulate_mappings (false=legacy, true=new 2D logic)
```

---

## 12. Webchat Config Merge Pipeline (5-Level)

```
Level 1: defaults.json (base configuration)
  ↓ deep merge
Level 2: helpline common (e.g., "as.json" base config)
  ↓ deep merge
Level 3: environment-specific (e.g., "as-staging.json")
  ↓ deep merge
Level 4: translations deep merge (per-locale strings)
  ↓ deep merge
Level 5: runtime overrides (from initWebchat() parameters)

Result: Complete WebchatConfig with all helpline + env + locale specifics
Function: getCurrentConfig() in webchat/configurations/
```

---

## 13. Webchat State Machine (Full Reducer Details)

### ChatReducer (13 Action Handlers)

```
SET_CONVERSATIONS_CLIENT → store client reference
SET_CONVERSATION → store active conversation
ADD_PARTICIPANT → append to participants list
REMOVE_PARTICIPANT → filter from participants list
SET_PARTICIPANTS → replace participants list
ADD_MESSAGE → append message, update unread count
SET_MESSAGES → replace message list (bulk load)
UPDATE_MESSAGE → update single message by index
SET_ATTACHED_FILES → update attached file list
SET_CONVERSATION_STATE → update active/inactive/closed state
SET_PARTICIPANT_NAMES → update name map
CLEAR_CHAT_STATE → reset to initial state
SET_USERS → update users list
```

### ConfigReducer

```
SET_CONFIG → merge new config into state
UPDATE_LOCALE → change currentLocale, re-merge translations
```

### SessionReducer

```
SET_PHASE → update currentPhase (Loading/PreEngagementForm/MessagingCanvas)
SET_EXPANDED → toggle widget expanded/collapsed
SET_TOKEN → store JWT token
SET_CONVERSATION_SID → store active conversation SID
SET_PRE_ENGAGEMENT_DATA → update form field values
CLEAR_SESSION → reset to initial state
```

### NotificationReducer

```
ADD_NOTIFICATION → append notification with id, message, type, dismissible, timeout
REMOVE_NOTIFICATION → filter by id
CLEAR_NOTIFICATIONS → reset to empty
```

---

## 14. USCR Dispatch Integration

US Crisis Response (USCR) helpline has a custom feature:

```
DispatchIncidentButton:
  ├── Visible only for USCR helpline configuration
  ├── Triggers external dispatch service API call
  ├── Sends incident data from current contact/case
  └── Uses dedicated dispatch service integration (not shared with other helplines)
```
