# UI Components Inventory

## Aselo Platform — Complete Component Hierarchy for .NET MAUI Rebuild

**Source:** Reverse-engineered from `techmatters/flex-plugins`  
**Date:** 2026-03-30

---

## 1. Agent Desktop (plugin-hrm-form) — ~695+ Files

### 1.1 Top-Level Component Structure

```
HrmFormPlugin (Flex Plugin Entry Point)
├── MaterialUI Theme Provider
├── Redux Store Provider
├── Localization Context Provider
└── HrmForm (Root Component)
    ├── TabbedFormsRouter (per-task routing)
    │   ├── TabbedFormsTabs (tab navigation)
    │   ├── TabbedFormsContact (contact workflow)
    │   ├── TabbedFormsCase (case workflow)
    │   └── TabbedFormsSearch (search workflow)
    ├── CaseList (standalone view)
    ├── TeamsView (agents overview)
    └── Router (route stack handler)
```

### 1.2 Contact Flow Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **CallTypeButtons** | `components/CallTypeButtons/` | Select contact type (child/caller/non-data) | `CollectionView` with button items |
| **TabbedFormsTabs** | `components/tabbedForms/TabbedFormsTabs` | Tab bar for form sections | `TabBar` / `TabbedPage` |
| **Dynamic Form Renderer** | `components/forms/inputGenerator` | Generate form fields from definition | Custom `ContentView` builder |
| **CategoryGrid** | (via categories state) | Grid of issue categories with checkboxes | `CollectionView` with grouped sections |
| **ContactDetails** | `components/contact/ContactDetails` | View saved contact details | `ScrollView` with sections |
| **ContactDetailsSection** | `components/contact/ContactDetailsSection` | Individual section within contact details | `Frame` / `Border` content |
| **EditContactSection** | `components/contact/EditContactSection` | Edit mode for contact sections | Form editor panel |
| **GenerateSummaryButton** | `components/contact/GenerateSummaryButton/` | Trigger AI summary generation | `Button` with loading state |
| **MediaSection** | `components/contact/MediaSection/` | View recordings and transcripts | Media player / list |
| **ResourceReferralList** | `components/contact/ResourceReferralList/` | List of referred resources | `CollectionView` |

### 1.3 Case Management Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **Case** | `components/case/Case` | Root case view wrapper | `ContentPage` |
| **CaseHome** | `components/case/CaseHome` | Case overview with sections | `ScrollView` layout |
| **CaseOverview** | `components/case/caseOverview/` | Edit case summary, follow-up, risk flag | Form with date picker |
| **CaseTimeline** | `components/case/timeline/` | Chronological view of contacts + sections | `CollectionView` timeline |
| **CaseSectionListRow** | `components/case/CaseSectionListRow` | Single row in case section list | `SwipeView` row |
| **CasePrint** | `components/case/casePrint/` | PDF export of case | PDF generator service |
| **ActionHeader** | `components/case/ActionHeader` | Header bar with action buttons | `NavigationBar` / toolbar |
| **openNewCase** | `components/case/openNewCase` | Logic to create and navigate to new case | Command/handler |

### 1.4 Case List Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **CaseList** | `components/caseList/CaseList` | Filterable, sortable list of cases | `CollectionView` with header |
| **CaseListItem** | `components/caseList/CaseListItem` | Single case row | `DataTemplate` |
| **CaseListFilters** | (within CaseList) | Filter controls (counselor, status, dates) | Picker + DatePicker controls |

### 1.5 Search Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **SearchForm** | `components/search/SearchForm/` | Search input form | Form with `Entry` fields |
| **SearchResults** | `components/search/SearchResults/` | Results container | `CollectionView` |
| **CasePreview** | `components/search/CasePreview/` | Case result preview card | `Frame` card |
| **ContactPreview** | `components/search/ContactPreview/` | Contact result preview card | `Frame` card |

### 1.6 Profile Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **ProfileRouter** | `components/profile/ProfileRouter` | Profile navigation | `Shell` routing |
| **ProfileTabs** | `components/profile/ProfileTabs` | Profile tab navigation (cases/contacts/details) | `TabbedPage` |
| **ProfileDetails** | `components/profile/ProfileDetails` | Profile detail view | `ScrollView` |
| **ProfileEdit** | `components/profile/ProfileEdit` | Profile edit form | Modal form |
| **ProfileCases** | `components/profile/ProfileCases` | Cases linked to profile | `CollectionView` |
| **ProfileContacts** | `components/profile/ProfileContacts` | Contacts linked to profile | `CollectionView` |
| **IdentifierBanner** | `components/profile/IdentifierBanner/` | Banner showing linked identifiers | Top bar / info strip |
| **ProfileFlag** | `components/profile/profileFlag/` | Flag management UI | Badge / tag component |
| **ProfileSection** | `components/profile/section/` | Profile section editor | Expandable editor |

### 1.7 Transfer Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **TransferContainer** | `components/transfer/TransferContainer` | Transfer mode selection & target picker | Modal with list |
| **TransferActions** | `transfer/setUpTransferActions` | Transfer action handlers | Command handlers |

### 1.8 Conference Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **ConferenceComponents** | `conference/setUpConferenceComponents` | Conference participant management | Participant list with controls |
| **ConferenceActions** | `conference/setUpConferenceActions` | Conference action handlers | Command handlers |

### 1.9 Teams & Queues Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **AgentColumn** | `components/teamsView/AgentColumn` | Agent name display | `Label` in grid |
| **StatusColumn** | `components/teamsView/StatusColumn` | Agent status indicator | `Badge` / colored indicator |
| **SkillsColumn** | `components/teamsView/SkillsColumn` | Agent skills display | Tag list |
| **SelectAgentColumn** | `components/teamsView/SelectAgentColumn` | Selectable agent for assignment | `CheckBox` in grid |
| **QueueItem** | `components/queuesView/QueueItem` | Queue with task count | Expandable list item |
| **QueuesStatus** | `components/queuesStatus/QueuesStatus` | Queue status dashboard | Stat cards |

### 1.10 CSAM Report Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **CSAMReport** | `components/CSAMReport/CSAMReport` | Report creation form | Modal form |
| **CSAMReportButton** | `components/CSAMReport/CSAMReportButton` | Trigger button for report | `Button` |

### 1.11 Utility Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **NavigableContainer** | `components/NavigableContainer/` | Breadcrumb navigation | Back button + title |
| **CannedResponses** | `components/cannedResponses/` | Quick message template picker — select dropdown triggers `SetInputText` Flex action | `Picker` / popup list |
| **EmojiPicker** | `components/emojiPicker/` | Emoji input using `@emoji-mart/react` with `blockedEmojis` filtering from DefinitionVersion, canvas resize utility, `concatEmoji` at cursor position | Emoji grid popup |
| **CustomSideLinks** | `components/customSideLinks/` | Sidebar navigation links — "new-window" type shows ConfirmDialog then `window.open`, "embedded" type navigates to embedded iframe; icon map: {info: InfoIcon, map: MapIcon} | Shell sidebar items |
| **Modals** | `components/design-system/modals/` | Modal dialog system with dirty-state confirmation, back button (if history depth > 1), loading state disables close | `Popup` / modal pages |

### 1.12 Case Merging Banner Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **AddToCaseBanner** | `components/caseMergingBanners/` | Prompt to add current contact to a case (permission: `addContactToCase`) | Top banner with action button |
| **ContactAddedToCaseBanner** | same | Confirmation after contact added | Success banner |
| **ContactRemovedFromCaseBanner** | same | Confirmation after contact removed (permission: `removeContactFromCase`) | Info banner |
| **CaseCreatedBanner** | same | Confirmation after new case created | Success banner |

### 1.13 Standalone Search Component

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **StandaloneSearch** | `components/standaloneSearch/` | Non-task search using `standalone-task-sid` + `StandaloneITask`; registered in `flex.ViewCollection "standalone-search"` | Separate search page |

### 1.14 USCR Custom Components

| Component | Path | Purpose | MAUI Equivalent |
|-----------|------|---------|-----------------|
| **DispatchIncidentButton** | `components/uscr/` | US Crisis Response — dispatch incident to external service; only visible for USCR helpline | `Button` with service call |

### 1.15 PDF Generation Components (Case Print)

Uses `@react-pdf/renderer` 3.4.4 with 12 components:

| Component | Purpose | Key Details |
|-----------|---------|-------------|
| **CasePrintView** | Root PDF document | Max 100 sections/contacts, fixed headers/footers |
| **CasePrintHeader** | Page header | Helpline logo (base64 image), case ID, print date |
| **CasePrintSummary** | Case overview section | Summary, follow-up date, risk flag |
| **CasePrintCategories** | Categories section | Grid of selected categories/subcategories |
| **CasePrintContact** | Single contact section | All form fields laid out per LayoutVersion |
| **CasePrintDetails** | Contact detail fields | Key-value pairs from contact form data |
| **CasePrintSections** | Case sections list | Notes, referrals, incidents by type |
| **CasePrintCSAMReports** | CSAM report section | Report details if any attached |
| **CasePrintTimeline** | Timeline in PDF | Chronological activities |

**PDF Features:**
- Thai font support (via `layoutVersion.thaiCharacterPdfSupport` flag)
- Base64-encoded images for logos
- Max 100 sections/contacts per PDF (performance guard)
- Fixed headers/footers per page

### 1.12 Dynamic Form Components (`components/forms/`)

| Component | Purpose | MAUI Equivalent |
|-----------|---------|-----------------|
| **inputGenerator** | Factory that renders correct input for FormInputType | Switch-based builder |
| **Text Input** | Standard text input | `Entry` |
| **Search Input** | Text with search icon | `SearchBar` |
| **Numeric Input** | Number-only input | `Entry` with `Keyboard.Numeric` |
| **Email Input** | Email-validated input | `Entry` with `Keyboard.Email` |
| **Radio Input** | Radio button group | `RadioButton` group |
| **Listbox Multiselect** | Multi-select dropdown | Custom `CollectionView` with checkboxes |
| **Select** | Dropdown picker | `Picker` |
| **DependentSelect** | Cascading dropdown | Two `Picker` controls with dependency |
| **Checkbox** | Boolean checkbox | `CheckBox` |
| **MixedCheckbox** | Tri-state checkbox (true/false/mixed) | Custom tri-state control |
| **Textarea** | Multi-line text | `Editor` |
| **Date Input** | Date picker | `DatePicker` |
| **Time Input** | Time picker | `TimePicker` |
| **File Upload** | File selection | `FilePicker` |
| **CopyTo** | Copy field value to another field | `Button` + handler |
| **CustomContactComponent** | Plugin-registered custom component | Custom `ContentView` |

---

## 2. Webchat Widget (aselo-webchat-react-app) — Modern

### Component Hierarchy

```
WebchatWidget
├── CustomizationProvider (Twilio Paste theme)
├── Redux Provider
└── RootContainer
    ├── LoadingPhase
    │   └── Spinner
    ├── PreEngagementFormPhase
    │   ├── Header (helpline name + logo)
    │   ├── NotificationBar (connectivity alerts)
    │   ├── Dynamic Form (from hrm-form-definitions)
    │   │   └── generateForm() → field components
    │   └── Submit Button
    └── MessagingCanvasPhase
        ├── Header (with minimize/close)
        ├── NotificationBar
        ├── AttachFileDropArea
        ├── MessageList
        │   ├── MessageListSeparator (unread divider)
        │   └── MessageBubble (per message)
        │       ├── Text content
        │       ├── File attachment preview
        │       ├── Timestamp
        │       └── Read receipt indicator
        ├── MessageInput
        │   ├── Text input area
        │   ├── AttachFileButton
        │   ├── FilePreview (selected files)
        │   └── Send Button
        ├── ConversationEnded (post-chat state)
        └── CloseChatButtons
            ├── End Chat
            └── Quick Exit
```

### MAUI Mapping for Webchat

| React Component | MAUI Equivalent |
|----------------|----------------|
| WebchatWidget | `ContentPage` or embedded `ContentView` |
| RootContainer | `ContentView` with phase state |
| PreEngagementFormPhase | `ScrollView` form |
| MessagingCanvasPhase | `CollectionView` + `Entry` |
| MessageList | `CollectionView` with `DataTemplate` |
| MessageBubble | Custom `ContentView` with alignment |
| MessageInput | `Grid` with `Editor` + `Button` |
| AttachFileDropArea | `DropGestureRecognizer` |
| FilePreview | `HorizontalStackLayout` with thumbnails |
| NotificationBar | `Frame` banner at top |
| Header | `NavigationBar` or custom header |

### Webchat UI Details (Modern)

**Phase System:** RootContainer switches between 3 phases based on `SessionState.currentPhase`:
- `Loading` — Spinner while initializing
- `PreEngagementForm` — Dynamic form + language selector + optional reCAPTCHA
- `MessagingCanvas` — Active chat with messages, input, file attachments

**MessageList:** Supports infinite scroll (load older messages on scroll-up), unread message separator (`MessageListSeparator`), and auto-scroll to bottom on new messages.

**MessageBubble:** Displays text content, file attachment preview, timestamp, and read receipt indicator. Outbound vs inbound alignment determined by message author.

**AttachFileDropArea:** Drag-and-drop file attachment zone. Validates against `FileAttachmentConfig`:
- Max file size check
- Accepted extensions via `mime-types` library
- Duplicate file detection (by name+size)

**FilePreview:** Horizontal row of attached files with remove buttons before sending.

**useSanitizer Hook:** Webchat-specific input sanitization:
- Chat message blacklist: specific dangerous characters/patterns
- Name field blacklist: different character set for friendly names
- Applied before sending messages and during pre-engagement form

**URL Detection:** MessageBubble parses text for URLs using regex, converts to clickable `Anchor` components.

**Session Persistence:** Token + conversationSid stored in `localStorage` under key `TWILIO_WEBCHAT_WIDGET`. On page reload, `sessionDataHandler.tryResumeExistingSession()` checks token expiry and resumes.

### Webchat Security Architecture

```
Security Headers (sent with every API call):
├── x-twilio-sec-usersettings → { language, cookieEnabled, userTimezone }
├── x-twilio-sec-webchatinfo → { loginTimestamp }
├── x-twilio-sec-decoders → { audio: MediaCapabilitiesInfo, video: MediaCapabilitiesInfo }
├── ui-version → APP_VERSION env var
└── webchat-version → WEBCHAT_VERSION env var

Purpose: Browser fingerprinting for bot detection & analytics.
Request format: application/x-www-form-urlencoded (NOT JSON).
```

---

## 3. Legacy Webchat Widget (webchat/) — Detailed

Built on `@twilio/flex-webchat-ui` (higher-level, less customization):

```
FlexWebChat Instance
├── PreEngagementCanvas (built-in + custom form overlay)
│   ├── PreEngagementForm (custom)
│   │   ├── Dynamic form fields (react-hook-form 7.43.7)
│   │   ├── ReCaptcha (optional)
│   │   └── Language selector
│   └── Submit button
├── MessagingCanvas
│   ├── ChannelInfo/Header (branding overrides)
│   ├── MessageList
│   │   └── Custom MessageBubble (DOMPurify sanitized HTML)
│   ├── MessageInput
│   │   ├── EmojiPicker (optional)
│   │   └── Custom send button
│   └── End Chat / Quick Exit buttons
└── Custom Overlays
    ├── Operating Hours message (open/closed/holiday with custom forms)
    ├── Branding overrides (logo, colors, fonts)
    └── IP Blocked message (if IP in blocked list)
```

**DOMPurify Integration:**
- `afterSanitizeAttributes` hook forces `target=_blank` and `rel=noopener noreferrer` on all links
- Removes dangerous HTML from chat messages
- Applied to all inbound messages before rendering

**IP Tracking:**
- Uses `ipfind.co` API to detect user IP on load
- Checks against helpline-specific blocked IP JSON list
- Blocks access with custom message if IP is blocked

**Operating Hours:**
- `GET /operatingHours` called on load
- Three states: `open` (show normal form), `closed` (show closed message + custom form), `holiday` (show holiday message)
- Custom forms per operating state defined in helpline config

**DOM Utilities:**
- `MutationObserver` manages z-index of webchat container
- Ensures widget stays above page content

**39 Helpline Configurations:**
- Located in `webchat/configurations/`
- Each file exports config for a helpline-environment combination
- Merged at build time via `getCurrentConfig()`

---

## 3B. Agent Desktop Hooks & Utilities

### Custom React Hooks

| Hook | Purpose | MAUI Equivalent |
|------|---------|-----------------|
| `useExpandableOnOverflow` | Detects content overflow and enables expand/collapse | Measure content, toggle `IsVisible` |
| `useFocus` | Programmatic focus management | `VisualElement.Focus()` |
| `useIsOverflowing` | Returns boolean if content exceeds container | Measure with `SizeChanged` event |

### Component Registration (setUpComponents — Complete List)

The plugin registers 23+ custom components into Flex:

```
1. CustomCRMContainer → flex.CRMContainer
   - THE main HRM form component — replaces Flex's default CRM panel
   - Contains all contact form, case, search, profile UI
   
2. QueuesStatus → flex.ViewCollection "queue-statuses"
   - Custom queue status display (per-channel task counts, longest waiting)
   - Uses Flex Insights liveQuery for real-time updates

3. CaseList → flex.ViewCollection "case-list"
   - Standalone case list page, registered as sidebar item

4. StandaloneSearch → flex.ViewCollection "standalone-search"
   - Non-task search context using standalone-task-sid + StandaloneITask

5. Transfer UI components
   - TransferContainer: mode selection & target picker
   - TransferActions: transfer action handlers

6. Conference components (if enableConferencing)
   - Participant management, hold/mute/remove controls

7. Custom sidebar links (if enable_custom_links)
   - Rendered from DefinitionVersion.customLinks config
   - "new-window": ConfirmDialog then window.open(url, '_blank')
   - "embedded": Navigate to embedded iframe in desktop

8. Client profiles list (if enableClientProfiles)
   - Registered as profile browsing entry point

9. Case merging banners (4 banner types)
   - AddToCaseBanner, ContactAddedToCaseBanner,
     ContactRemovedFromCaseBanner, CaseCreatedBanner

10. LLM notification handler (if enable_llm_summary)
    - Handles LLM summary completion events

11. Keyboard shortcut: 'V' → toggleDialpad (throttle: 100ms)

12. MUI StylesProvider({ seed: 'plugin-hrm-form' })
    - CSS class name isolation to prevent Flex conflicts
```

---

## 4. Styling Approach

### Current System
| App | Styling | Theme System |
|-----|---------|-------------|
| plugin-hrm-form | Material-UI 4 + Emotion CSS-in-JS + `HrmTheme.ts` | MUI theme + custom tokens |
| aselo-webchat-react-app | Twilio Paste + Emotion + component `.styles.ts` files | Paste CustomizationProvider |
| webchat (legacy) | flex-webchat-ui + Emotion + branding overrides | Flex theme colorTheme |

### HrmTheme.ts — Complete Color System (100+ tokens)

```
Base Colors: base1 (lightest) through base11 (darkest)
  → Used for backgrounds, borders, text throughout the app

Agent Colors: Array of colors for agent display in teams view

Button Color Schemes (4 variants × 5 states):
  Variants: primary, secondary, outlined, text
  States: default, hover, active, disabled, focus
  Example: buttonColors.primary.default = "#1976D2"

Notification Colors (per severity):
  notificationBackgroundColor: { success, warning, error, info }
  notificationIconColor: { success, warning, error, info }

Category Grid Colors: Array of colors for category sections

Accent Colors:
  hyperlinkColor: active link color
  tabSelectedColor: selected tab indicator color

Component Overrides (6 Flex components):
  MainHeader: custom background/text colors
  SideNav: custom background/border
  TaskList: custom item colors
  AgentDesktopView: panel backgrounds
  CRMContainer: custom padding/borders
  TaskCanvasHeader: custom title colors
```

### Channel Icons & Colors

| Channel | Icon Component | Color | Number Extraction |
|---------|---------------|-------|-------------------|
| Voice | `CallIcon` | `#a0a8bd` | Remove spaces + hyphens |
| SMS | `SmsIcon` | `#A8C2FC` | Remove spaces + hyphens |
| Web | (default) | `#737373` | `preEngagementData.contactIdentifier` |
| Facebook | `FacebookIcon` | `#4267B2` | Remove "messenger:" prefix |
| WhatsApp | `WhatsappIcon` | `#25D366` | Remove "whatsapp:" prefix |
| Telegram | `TelegramIcon` | `#1DA1F2` | Format as "@{handle}" |
| Instagram | `InstagramIcon` | `#833AB4` | Direct from task attributes |
| LINE | `LineIcon` | `#00C300` | Direct from task attributes |

### .NET MAUI Equivalent
- **Material-UI 4** → Use `MaterialFrame`, Community Toolkit, or custom styles
- **Emotion CSS** → MAUI `Style` resources + `VisualStateManager`
- **Theme tokens** → `ResourceDictionary` with `DynamicResource`
- **Dark/Light theme** → `AppThemeBinding` or `Application.UserAppTheme`
- **Channel colors** → Static `Color` constants in `ChannelColors` class
- **Channel icons** → SVG/PNG resources or font icons (e.g., Material Design Icons)

### MUI Provider Setup

```
StylesProvider with generateClassName({ seed: 'plugin-hrm-form' })
  → Ensures CSS class name uniqueness to avoid conflicts with Flex's own MUI
```

---

## 4B. Queues Status Monitoring Architecture

### QueuesStatus Components

```
QueuesStatus (Reader)
  ├── Renders QueueCard for each queue
  └── Maps queuesStatus state → QueueCard components

QueuesStatusWriter
  ├── Uses Flex Insights liveQuery for real-time task/worker updates
  ├── Subscribes to tasks in counselor's queues
  ├── Filters for waiting (pending/reserved) status
  ├── Updates Redux: queuesStatusUpdate(queuesStatus)
  └── On error: queuesStatusFailure(error)

Helpers:
  ├── initializeQueuesStatus(queues[]) → QueuesStatus map
  ├── addPendingTasks(acc, task) → updated QueuesStatus
  ├── getNewQueuesStatus(cleanStatus, tasks[]) → fresh QueuesStatus
  ├── isAnyChatPending(queuesStatus) → boolean
  ├── getChannel(task) → CoreChannelTypes (handles Modica SMS variants)
  └── Status predicates: isPending, isReserved, isAssigned, isCanceled
```

### QueueEntry Shape (per-channel task counts)

```
QueueEntry:
  facebook, sms, voice, web, whatsapp, telegram, instagram, line: number
  longestWaitingDate: Date | null
  isChatPending: boolean
```

---

## 5. Component Communication Patterns

| Pattern | React Implementation | MAUI Equivalent |
|---------|---------------------|-----------------|
| Parent → Child props | React props | `BindableProperty` |
| Global state | Redux store + selectors | MVVM with `ObservableObject` or `CommunityToolkit.Mvvm` |
| Async actions | redux-promise-middleware-actions | `AsyncRelayCommand` |
| Event handling | Flex action listeners | `MessagingCenter` or `WeakReferenceMessenger` |
| Context | React Context | `DependencyInjection` |
| Navigation | Route stack in Redux per task | `Shell` navigation with `NavigationStack` |
| Modals | Route stack with modal routes | `Shell.Current.GoToAsync("modal")` |
| Form state | Redux + react-hook-form | MVVM `ObservableProperty` + `IDataErrorInfo` |

---

## 6. Key UI Patterns to Preserve

### Per-Task Navigation Stack
Each active task (conversation) has its own independent navigation history. When the agent switches tasks, the navigation state restores to where they left off. This is critical for multi-tasking.

**MAUI approach:** Maintain a `Dictionary<string, Stack<Page>>` keyed by TaskSID. Swap visible navigation stack when active task changes.

### Dynamic Form Rendering
Forms are not hardcoded — they are defined by `DefinitionVersion` JSON schemas. The UI must dynamically render inputs based on `FormItemDefinition[]` arrays.

**MAUI approach:** Create a `FormRenderer` that maps `FormInputType` enums to MAUI controls, builds layouts from definition arrays, and binds to a `Dictionary<string, object>` model.

### Working Copy Pattern
Case edits are made on a "working copy" draft in Redux. The user can make changes without immediately persisting. Save commits the working copy to the API.

**MAUI approach:** Clone the model into an editable ViewModel. Commit changes on save. Discard on cancel.

### Category Grid
Categories are displayed in an expandable grid with checkbox subcategories. Multiple categories can be open simultaneously. There's a maximum selections constraint.

**MAUI approach:** `CollectionView` with `BindableLayout` for subcategories, using `IsExpanded` binding per category group.
