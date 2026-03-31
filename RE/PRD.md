# Product Requirements Document (PRD)

## Aselo — Contact Center & Case Management Platform

**Version:** 1.0  
**Date:** 2026-03-30  
**Source:** Reverse-engineered from `techmatters/flex-plugins` repository  
**Target Rebuild:** .NET MAUI Application

---

## 1. Executive Summary

Aselo is an open-source, multi-channel contact center and case management platform built for child helplines and human services organizations. It is currently implemented as a Twilio Flex Plugin ecosystem. The system enables counselors to handle inbound contacts (voice, chat, social media), document interactions, manage cases, search historical records, and refer callers to resources — all within a unified agent desktop.

### Core Mission

Provide helpline counselors with a comprehensive tool to:
- Receive and handle contacts across 10+ communication channels
- Document contact details using configurable, helpline-specific forms
- Create and manage long-running cases linked to contacts
- Search and retrieve historical contacts and cases
- Track client profiles and identifiers
- Report child safety/abuse material (CSAM)
- Refer callers to community resources
- Support multi-language, multi-helpline deployments

---

## 2. User Personas

### 2.1 Counselor (Agent)
- **Role:** Primary user. Handles inbound contacts, fills forms, creates cases.
- **Needs:** Fast form entry, multi-tab workflow, canned responses, search, transfer capability.
- **Channels:** Voice calls, SMS, WhatsApp, Facebook Messenger, Instagram, Telegram, LINE, Modica, Web Chat.

### 2.2 Supervisor
- **Role:** Oversees counselors. Reviews cases, monitors queues, manages teams.
- **Needs:** Team view with filtering/sorting, queue status monitoring, case oversight, permission to edit older records.
- **Permissions:** Elevated — can view all contacts, edit cases beyond time limits, close/reopen cases.

### 2.3 Guest / External Viewer
- **Role:** Limited access for external stakeholders.
- **Needs:** View-only access to specific contact/case data.

### 2.4 End User (Caller/Chatter)
- **Role:** Person reaching out for help via webchat or other channels.
- **Needs:** Pre-engagement form, real-time chat with file attachments, session persistence, quick exit.

---

## 3. Functional Requirements

### 3.1 Contact Handling

| ID | Requirement | Priority |
|----|-------------|----------|
| F-CH-01 | Accept inbound contacts from: voice, SMS, WhatsApp, Facebook, Instagram, Telegram, LINE, Modica, web chat | P0 |
| F-CH-02 | Display call type selection buttons (child calling about self, someone calling about a child, non-data contact types) | P0 |
| F-CH-03 | Render configurable tabbed forms: Caller Information, Child Information, Case Information, Issue Categorization, Contactless Task | P0 |
| F-CH-04 | Support offline/contactless task creation (data entry without live caller) | P0 |
| F-CH-05 | Support "in my behalf" contact creation (supervisor creates on behalf of counselor) | P1 |
| F-CH-06 | Record conversation duration automatically | P0 |
| F-CH-07 | Prepopulate form fields from pre-engagement data and survey data | P1 |
| F-CH-08 | Support categories/subcategories with grid view and max selections constraint | P0 |
| F-CH-09 | Mask/unmask personally identifiable identifiers (phone numbers, etc.) | P1 |
| F-CH-10 | Display channel-specific icons and colors | P2 |

### 3.2 Case Management

| ID | Requirement | Priority |
|----|-------------|----------|
| F-CM-01 | Create new case from an active contact | P0 |
| F-CM-02 | Link/unlink contacts to/from cases | P0 |
| F-CM-03 | Case status workflow with configurable transitions (e.g., open → closed) | P0 |
| F-CM-04 | Case overview with editable summary fields (follow-up date, child-at-risk flag, free-text summary) | P0 |
| F-CM-05 | Case sections (configurable types: notes, referrals, incidents, etc.) with add/edit/view | P0 |
| F-CM-06 | Case timeline view showing interleaved contacts and case sections chronologically | P0 |
| F-CM-07 | Case print to PDF | P1 |
| F-CM-08 | Case list with filtering by: counselor, status, date ranges (created, updated, follow-up), categories | P0 |
| F-CM-09 | Case list sorting by: ID, created date, updated date, label, follow-up date | P0 |
| F-CM-10 | Case working copy (draft edits before save) | P1 |

### 3.3 Search

| ID | Requirement | Priority |
|----|-------------|----------|
| F-SR-01 | Search contacts by: first name, last name, phone number, counselor, date range, contact number, helpline, free text | P0 |
| F-SR-02 | Search cases by same criteria | P0 |
| F-SR-03 | Display search results with contact/case previews | P0 |
| F-SR-04 | "Only data contacts" filter toggle | P1 |
| F-SR-05 | Paginated results | P0 |

### 3.4 Client Profiles

| ID | Requirement | Priority |
|----|-------------|----------|
| F-PR-01 | Create and view client profiles with name, identifiers | P1 |
| F-PR-02 | Link profiles to contacts and cases | P1 |
| F-PR-03 | Profile flags with expiration (e.g., "at risk" flag valid for N hours) | P1 |
| F-PR-04 | Profile sections (configurable, e.g. notes, observations) | P1 |
| F-PR-05 | Profile list view with sorting and filtering | P1 |
| F-PR-06 | Profile detail tabs: cases, contacts, details | P1 |
| F-PR-07 | Identifier banner showing linked identifiers | P2 |

### 3.5 Transfers

| ID | Requirement | Priority |
|----|-------------|----------|
| F-TR-01 | Cold transfer (handoff to another agent/queue) | P0 |
| F-TR-02 | Warm transfer (consult then handoff) | P0 |
| F-TR-03 | Transfer status tracking (transferring, accepted, rejected) | P0 |
| F-TR-04 | Transfer to external number | P1 |

### 3.6 Conference Calls

| ID | Requirement | Priority |
|----|-------------|----------|
| F-CC-01 | Add participants to active voice call | P1 |
| F-CC-02 | Manage conference participants (mute, hold, remove) | P1 |
| F-CC-03 | Conference status event handling | P1 |

### 3.7 CSAM Reporting

| ID | Requirement | Priority |
|----|-------------|----------|
| F-CS-01 | Counselor-generated CSAM reports | P1 |
| F-CS-02 | Self-generated CSAM reports | P1 |
| F-CS-03 | Acknowledgment workflow for CSAM reports | P1 |
| F-CS-04 | IWF (Internet Watch Foundation) incident reporting integration | P2 |

### 3.8 Resource Referrals

| ID | Requirement | Priority |
|----|-------------|----------|
| F-RR-01 | Search referrable resources by name/region | P1 |
| F-RR-02 | Add resource referrals to contacts | P1 |
| F-RR-03 | Track referral date and resource details | P1 |
| F-RR-04 | Resource lookup with status (pending, found, not found) | P2 |

### 3.9 Webchat (End-User Facing)

| ID | Requirement | Priority |
|----|-------------|----------|
| F-WC-01 | Embeddable chat widget for websites | P0 |
| F-WC-02 | Pre-engagement form (configurable fields per helpline) | P0 |
| F-WC-03 | Real-time messaging with typing indicators and read receipts | P0 |
| F-WC-04 | File attachment support (configurable max size and accepted types) | P1 |
| F-WC-05 | Session persistence across page reloads (localStorage token) | P0 |
| F-WC-06 | Connectivity loss/recovery notifications | P1 |
| F-WC-07 | Operating hours check (show closed message outside hours) | P1 |
| F-WC-08 | Quick exit button (immediate navigation away for safety) | P0 |
| F-WC-09 | Multi-language support with language selection | P0 |
| F-WC-10 | Dark/light theme support | P2 |
| F-WC-11 | reCAPTCHA verification (optional) | P2 |

### 3.10 Teams & Queues View

| ID | Requirement | Priority |
|----|-------------|----------|
| F-TQ-01 | View all agents with status, skills, and current tasks | P1 |
| F-TQ-02 | Sort and filter agents by skills, status | P1 |
| F-TQ-03 | Queue status display with real-time counts | P1 |
| F-TQ-04 | Switchboarding: manual task pulling from queues | P2 |
| F-TQ-05 | Agent selection for task assignment | P2 |

### 3.11 Notifications & Alerts

| ID | Requirement | Priority |
|----|-------------|----------|
| F-NT-01 | New message sound notification (bell sound on `newMessage` event) | P1 |
| F-NT-02 | Reserved task notification (ringtone plays every 3 seconds until accepted) | P1 |
| F-NT-03 | Browser close confirmation when contact is active | P1 |
| F-NT-04 | Webchat file attachment error notifications (invalid size, invalid type, duplicate file) | P1 |
| F-NT-05 | Webchat connectivity loss/restored notification (on `connectionStateChanged` event) | P1 |
| F-NT-06 | Webchat session init failure notification with error details | P1 |

### 3.12 Analytics & Insights

| ID | Requirement | Priority |
|----|-------------|----------|
| F-AN-01 | Push contact/case data to analytics backend (Insights) | P2 |
| F-AN-02 | FullStory session recording integration | P2 |
| F-AN-03 | Datadog error reporting | P2 |

### 3.13 Localization

| ID | Requirement | Priority |
|----|-------------|----------|
| F-L1-01 | Multi-language UI strings with runtime switching | P0 |
| F-L1-02 | Per-helpline language configuration | P0 |
| F-L1-03 | Configurable Flex UI locale mapping | P1 |
| F-L1-04 | Custom string overrides per helpline | P1 |

### 3.14 AI / LLM Features

| ID | Requirement | Priority |
|----|-------------|----------|
| F-AI-01 | Generate contact summary using LLM from conversation transcript (POST to `{assistantBaseUrl}/summarize/{contactId}`) | P2 |
| F-AI-02 | LLM-supported entry fields (auto-fill from transcript via `llmSupportedEntries` in ContactRawJson) | P2 |

---

## 3B. Detailed Business Logic Requirements (Second Pass)

### 3B.1 Task Lifecycle Actions

The agent desktop executes specific actions at each stage of a task's lifecycle. These MUST be replicated:

| Lifecycle Event | Action | Details |
|----------------|--------|---------|
| `beforeAcceptTask` | Validate task readiness | Check task attributes, prepare contact state |
| `afterAcceptTask` | Create contact draft | Create/load Contact in Redux, set metadata (startMillis), initialize form routing |
| `hangupCall` | Record hangup source | Set `hangUpBy` to Agent/Customer/Consult/Transfer variant |
| `wrapupTask` | Finalize contact | Determine conversation media, save conversation media, finalize contact with `?finalize=true` |
| `completeTask` | Push insights data | Build insights attributes, update task attributes, complete task in TaskRouter |
| `afterCompleteTask` | Cleanup task state | Remove task from Redux, garbage-collect stale contacts (>120 min unreferenced, no draft) |

### 3B.2 Identifier Masking System

| ID | Requirement | Priority |
|----|-------------|----------|
| F-MK-01 | Mask PII identifiers globally when agent lacks `VIEW_IDENTIFIERS` permission | P1 |
| F-MK-02 | Apply masking to Flex channel templates (customer name, message content previews) | P1 |
| F-MK-03 | Apply masking to Flex manager strings (notification text) | P1 |
| F-MK-04 | Apply masking to notification content (reservedTask payload) | P1 |
| F-MK-05 | Unmask only when permission granted via role-based rules | P1 |

### 3B.3 Dual Write System (Brazil/SaferNet)

| ID | Requirement | Priority |
|----|-------------|----------|
| F-DW-01 | Save contact to HRM API AND to SaferNet external backend (when `enable_dual_write` flag on) | P2 |
| F-DW-02 | SaferNet payload sent via `POST /saveContactToSaferNet` serverless endpoint | P2 |
| F-DW-03 | On SaferNet save failure, enqueue to Twilio Sync Service for retry | P2 |
| F-DW-04 | SaferNet returns `postSurveyUrl` on success | P2 |

### 3B.4 Bot Detection

| ID | Requirement | Priority |
|----|-------------|----------|
| F-BD-01 | Detect bot conversations via identity regex pattern `/aselo.+.*techmatters/` | P1 |
| F-BD-02 | Suppress form rendering for bot-detected conversations | P1 |

### 3B.5 Contact Save Frequency

| ID | Requirement | Priority |
|----|-------------|----------|
| F-SF-01 | Support configurable contact save frequency: `onTabChange` (auto-save draft on tab switch) or `onFinalSaveAndTransfer` (save only at wrapup) | P1 |

### 3B.6 Operating Hours Enforcement

| ID | Requirement | Priority |
|----|-------------|----------|
| F-OH-01 | Webchat checks operating hours via `POST /operatingHours` before showing pre-engagement form | P1 |
| F-OH-02 | Display `closedHours` form definition when helpline is closed | P1 |
| F-OH-03 | Display `holidayHours` form definition on holidays | P1 |
| F-OH-04 | Response format: `'open'`, `'closed'`, `'holiday'`, or `{ status, message }` | P1 |
| F-OH-05 | Operating hours use shift-based JSON config per country/helpline with `DaysOfTheWeek` enum (Monday=1..Sunday=7) and `OperatingShift` (open/close in numeric HHMM format, e.g., 900=9AM, 1730=5:30PM) | P1 |
| F-OH-06 | Support multiple shifts per day (e.g., morning 900-1200, afternoon 1400-1700) | P1 |
| F-OH-07 | Holiday detection via `"MM/DD/YYYY"` → holiday name map per helpline | P1 |
| F-OH-08 | Support per-channel operating hours (different hours for web vs voice) | P1 |
| F-OH-09 | Multi-office support: per-office operating configs with root-level fallback (when `multipleOfficeSupport` flag enabled) | P2 |
| F-OH-10 | Timezone-aware: each office specifies timezone (e.g., "Pacific/Auckland") | P1 |
| F-OH-11 | 14+ country configs supported (as, br, ca, cl, co, et, in, jm, mt, mw, nz, ph, sg, th, tz, za, zm, zw) | P1 |
| F-OH-12 | Include localized message text in response (language-specific closed/holiday messages) | P2 |

### 3B.7 IP Access Control (Webchat)

| ID | Requirement | Priority |
|----|-------------|----------|
| F-IP-01 | Block webchat access from IPs in blocklist (legacy webchat `blockedIps.json`) | P2 |
| F-IP-02 | Optional IP capture via ipfind.co API for contact context | P2 |
| F-IP-03 | Contact identifier can be IP-based (`contactType: 'ip'`) or form-based | P2 |

### 3B.8 Bot Channel Capture & Post-Survey

| ID | Requirement | Priority |
|----|-------------|----------|
| F-BC-01 | Support bot channel capture via Amazon Lex chatbot for initial conversation handling | P2 |
| F-BC-02 | `CapturedChannelAttributes` tracks bot interaction state (userId, environment, helplineCode, botLanguage, botSuffix, controlTaskSid, releaseType, studioFlowSid, channelType) | P2 |
| F-BC-03 | Two release types: `triggerStudioFlow` (escalate to agent) and `postSurveyComplete` (end after survey) | P2 |
| F-BC-04 | Three-phase bot lifecycle: `captureChannelWithBot` → `chatbotCallback` → `chatbotCallbackCleanup` | P2 |
| F-PS-01 | Post-survey: when `enable_post_survey` flag is on, remove ALL conversation listeners on wrapup to let chatbot interact | P2 |
| F-PS-02 | When post-survey is OFF, remove only `participantLeft` listeners on wrapup to prevent premature chat history disappearance | P1 |
| F-PS-03 | On task completed for transferred tasks, deactivate conversation listeners to prevent ghost notifications | P1 |

### 3B.9 USCR Dispatch Integration

| ID | Requirement | Priority |
|----|-------------|----------|
| F-UD-01 | US Crisis Response (USCR) helpline has a custom DispatchIncidentButton component | P2 |
| F-UD-02 | Dispatch button triggers external dispatch service API with contact/case data | P2 |
| F-UD-03 | Only visible for USCR helpline configuration (not shared across helplines) | P2 |

### 3B.10 Chat Capacity Management

| ID | Requirement | Priority |
|----|-------------|----------|
| F-CC-01 | On chat task wrapup, increment worker's chat channel capacity by 1 (capped by `maxMessageCapacity`) | P1 |
| F-CC-02 | Allows agents to handle multiple concurrent chats up to their configured maximum | P1 |

### 3B.11 Notification System (Detailed)

| ID | Requirement | Priority |
|----|-------------|----------|
| F-NS-01 | Reserved task ringtone: per-reservation SID tracking, AudioPlayerManager lifecycle, repeats every 3 seconds | P1 |
| F-NS-02 | Sound URLs loaded from assets bucket (configurable per helpline) | P1 |
| F-NS-03 | Message alert subscription: 10 retries with 200ms exponential backoff (200, 400, 800, 1600ms...) | P1 |
| F-NS-04 | Conversation listener management: register/deactivate/reactivate per-conversation listeners | P1 |

### 3B.12 Prepopulate System

| ID | Requirement | Priority |
|----|-------------|----------|
| F-PP-01 | Legacy PrepopulateKeys: simple 1:1 mapping from pre-engagement data fields to form fields | P1 |
| F-PP-02 | New PrepopulateMappings: 2D array with AND/OR logic — outer array=OR conditions, inner array=AND conditions | P2 |
| F-PP-03 | Checkbox transform: "yes"/"no" strings → boolean true/false in prepopulate mappings | P2 |
| F-PP-04 | Feature flag `use_prepopulate_mappings` switches between legacy (false) and new (true) logic | P1 |

### 3B.13 Conversation Duration Tracking

| ID | Requirement | Priority |
|----|-------------|----------|
| F-CD-01 | Record `startMillis` on task accept and `endMillis` on task wrapup | P0 |
| F-CD-02 | Calculate conversation duration: `endMillis - startMillis` (in seconds) | P0 |
| F-CD-03 | Store in contact `conversationDuration` field | P0 |

---

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NF-01 | Form rendering performance | < 200ms for form field updates |
| NF-02 | Message delivery latency | < 1s for webchat messages |
| NF-03 | Session persistence | Token-based, survive page reloads |
| NF-04 | Accessibility | WCAG 2.1 AA compliance |
| NF-05 | Multi-helpline isolation | Data scoped by accountSid + helpline |
| NF-06 | Permission enforcement | Role-based (supervisor/agent/guest) + time-based + ownership conditions |
| NF-07 | Offline capability | Contactless tasks can be created offline |
| NF-08 | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NF-09 | Concurrent users | Support 50+ simultaneous agents per helpline |
| NF-10 | Data privacy | PII field marking, identifier masking, configurable per field |
| NF-11 | Garbage collection | Stale contacts/cases (>120 min unreferenced, no draft) cleaned from memory |
| NF-12 | Definition version caching | Form schemas cached per version after first load |
| NF-13 | Token refresh | Webchat JWT refreshed before expiry; agent token managed by Flex framework |
| NF-14 | Input sanitization | Webchat blacklists `<;&/` chars in chat input, `<>;:&/"` in name fields |
| NF-15 | HTML sanitization | Legacy webchat uses DOMPurify with `USE_PROFILES: { html: true }`, forces `target=_blank rel=noopener` on links |

---

## 5. Configuration & Multi-Tenancy

The system is designed for **multi-helpline, multi-environment** deployments:

- **Helpline:** Organization-specific configuration (forms, categories, languages, resources)
- **Environment:** development, staging, production
- **Definition Versions:** Form schemas are versioned; contacts/cases reference their creation version
- **Feature Flags:** 35+ flags controlling feature availability per deployment
- **Feature Flag Sources (priority):** Flex serviceConfiguration attributes → Environment variables (`REACT_APP_FF_*`)
- **Form Definitions:** Dynamic forms loaded from backend; no hardcoded fields; 17 input types
- **Custom Links:** Configurable sidebar navigation per helpline

---

## 6. Security Requirements

| ID | Requirement |
|----|-------------|
| S-01 | Flex token validation (JWT) for all authenticated API calls |
| S-02 | Twilio webhook HMAC-SHA1 signature verification |
| S-03 | Role-based access control with configurable permission rules |
| S-04 | Time-based access restrictions (e.g., cannot edit contacts older than X hours) |
| S-05 | PII field awareness in form definitions |
| S-06 | reCAPTCHA for public-facing webchat forms |
| S-07 | IP blocking capability for webchat |
| S-08 | DOMPurify sanitization for user-generated HTML |
| S-09 | git-secrets for credential leak prevention |
| S-10 | Input character blacklisting in webchat (prevent XSS via `<;&/` removal) |
| S-11 | Security headers on webchat API requests (`x-twilio-sec-usersettings`, `x-twilio-sec-webchatinfo`, `x-twilio-sec-decoders`) |
| S-12 | Flex token mode enforcement: `agent` (worker_sid starts with 'WK'), `supervisor` (roles includes 'supervisor'), `guest` (roles includes 'guest' or no worker_sid) |
| S-13 | Facebook App Secret HMAC-SHA1 validation for Instagram webhook payloads |
| S-14 | LINE webhook signature preservation and forwarding via `x-line-signature` header |
| S-15 | Facebook OAuth state parameter validation with SSM-stored random tokens (1-hour TTL) |

---

## 7. Glossary

| Term | Definition |
|------|-----------|
| **Contact** | A single interaction record (call, chat session, offline entry) |
| **Case** | A long-running tracking record that groups related contacts |
| **Case Section** | A typed sub-record within a case (note, referral, incident, etc.) |
| **Profile** | A client identity record that can span multiple contacts/cases |
| **Identifier** | A phone number, email, or other identity marker linked to a profile |
| **Helpline** | A specific organization/deployment using the system |
| **Definition Version** | A versioned schema defining forms, categories, case structure |
| **Switchboarding** | Manual queue management where supervisors pull/assign tasks |
| **CSAM** | Child Sexual Abuse Material — reporting feature |
| **IWF** | Internet Watch Foundation — external CSAM reporting service |
| **Contactless Task** | An offline data entry record not tied to a live interaction |
| **Pre-engagement Form** | The form shown to webchat users before starting a conversation |
| **Canned Response** | Pre-written message templates for quick agent replies |
| **Dual Write** | Pattern of saving to both HRM API and an external system (e.g., SaferNet for Brazil) simultaneously |
| **Switchboarding** | Manual queue management where supervisors pull/assign tasks |
| **Definition Version** | A versioned schema (e.g., `as-v1`, `za-v1`) defining all forms, categories, case structures for a helpline |
| **Working Copy** | A draft version of case data edited in memory before being committed to the API |
| **Garbage Collection** | Automatic cleanup of stale contact/case state entries (>120 min unreferenced, no unsaved drafts) |
| **Result Monad** | Error handling pattern: `Result<Error, Data>` used throughout the Lambda backend for explicit error propagation |
