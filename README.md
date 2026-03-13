# EasyEDA Pro Part-DB Integration

An [EasyEDA Pro](https://pro.easyeda.com/) extension that connects to your [Part-DB](https://github.com/Part-DB/Part-DB-server) electronic parts inventory, letting you search parts, check stock levels, view supplier info, and browse datasheets — all without leaving your EDA workspace.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Download Pre-built Extension](#download-pre-built-extension)
  - [Build from Source](#build-from-source)
- [Configuration](#configuration)
  - [Part-DB API Token](#1-create-a-part-db-api-token)
  - [Extension Settings](#2-configure-the-extension)
  - [CORS Configuration](#3-cors-configuration-important)
- [Usage](#usage)
  - [Searching Parts](#searching-parts)
  - [Browsing by Category](#browsing-by-category)
  - [Part Detail View](#part-detail-view)
- [Part-DB API Reference](#part-db-api-reference)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Building](#building)
  - [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Changelog](#changelog)
- [License](#license)

---

## Features

- **Search parts** by name with substring matching
- **Browse by category** using a dropdown with all Part-DB categories
- **View stock levels** with color-coded indicators (green/yellow/red)
- **Supplier info** with supplier part numbers, pricing, and direct links
- **Part parameters** and technical specifications
- **Datasheets and attachments** with direct download links
- **Storage locations** for quick physical lookup
- **Paginated results** for large inventories
- **Direct links** to open any part in Part-DB's web interface
- **Dark theme** UI that matches EasyEDA Pro's aesthetic
- **Available everywhere** — menu entries in Home, Schematic, and PCB editors

## Screenshots

*Coming soon — screenshots will be added after initial testing.*

## Requirements

| Requirement | Minimum Version | Notes |
|-------------|----------------|-------|
| EasyEDA Pro | v2.3+ | Desktop app or web version |
| Part-DB | v1.x+ | Must have API access enabled |
| API Token | READ_ONLY level | Created in Part-DB user settings |

> **Note:** This extension requires the **EasyEDA Pro** edition (not EasyEDA Standard/Free), as only Pro supports the extension API needed for external server communication.

## Installation

### Download Pre-built Extension

1. Go to the [Releases](https://github.com/Sebbeben/easyeda-partdb-extension/releases) page
2. Download the latest `partdb-integration_v*.eext` file
3. Open **EasyEDA Pro**
4. Navigate to **Extensions** → **Extension Manager**
5. Click **Import** and select the downloaded `.eext` file
6. **Important:** After importing, click the gear icon next to the extension and enable **"External Interactions"** — this allows the extension to communicate with your Part-DB server

### Build from Source

Prerequisites: [Node.js](https://nodejs.org/) 18+ and npm.

```bash
# Clone the repository
git clone https://github.com/Sebbeben/easyeda-partdb-extension.git
cd easyeda-partdb-extension

# Install dependencies
npm install

# Build and package the extension
npm run build
```

The packaged extension file will be created at:
```
build/dist/partdb-integration_v0.1.0.eext
```

Import this `.eext` file into EasyEDA Pro as described above.

## Configuration

### 1. Create a Part-DB API Token

1. Log in to your Part-DB instance
2. Go to **User Settings** (click your username → Settings)
3. Navigate to the **API Tokens** section
4. Click **Create Token**
5. Set a name (e.g., "EasyEDA Extension")
6. Set the token level to at least **READ_ONLY**
7. Set an expiration date (or leave default)
8. Click **Create** and **copy the token** (starts with `tcp_...`)

> **Security note:** The token is stored locally in EasyEDA Pro's extension storage on your machine. It is sent only to your Part-DB server. Use a READ_ONLY token unless you plan to use write features in future versions.

### 2. Configure the Extension

Once the extension is installed, a new **"Part-DB"** menu appears in the top header bar of EasyEDA Pro (visible in the Home screen, Schematic editor, and PCB editor).

1. Click the **Part-DB** menu in the EasyEDA Pro header bar
2. Select **Settings...**
3. In the settings dialog that opens, fill in:
   - **Server URL** — The full URL to your Part-DB instance (e.g., `https://partdb.example.com`). No trailing slash. This must be reachable from your browser — if you're using the EasyEDA Pro web version, a `localhost` URL won't work.
   - **API Token** — Paste the token you created in step 1 (starts with `tcp_...`)
4. Click **Test Connection** — if everything is correct, you'll see a green status indicator showing "Connected" along with your token name and permission level
5. Click **Save** to store the settings

> The settings are saved locally in EasyEDA Pro's extension storage and persist across sessions. You only need to configure this once.

### 3. CORS Configuration (Important)

If your Part-DB server and EasyEDA Pro are on different domains (which they almost certainly are), you need to configure CORS (Cross-Origin Resource Sharing) on your Part-DB server.

Add the following to your Part-DB `.env.local` file:

```env
# Allow EasyEDA Pro to make API requests
CORS_ALLOW_ORIGIN='^https?://.*$'
```

Or for a more restrictive setup, allow only EasyEDA's domains:

```env
CORS_ALLOW_ORIGIN='^https://(pro\.easyeda\.com|easyeda\.com)$'
```

After changing, clear the cache:
```bash
php bin/console cache:clear
```

## Usage

### Searching Parts

1. Open the search panel: **Part-DB → Search Parts** (available from Home, Schematic, or PCB editor menus)
2. Type a search term in the search box (matches part names)
3. Press **Enter** or click **Search**
4. Results appear in a table showing: Name, Description, Category, Manufacturer, MPN, Stock, and Storage Location

### Browsing by Category

1. Open the search panel
2. Use the **category dropdown** to select a category
3. All parts in that category are displayed
4. You can combine category selection with a search term to narrow results

### Part Detail View

Click any row in the search results to open the detail view, which shows:

| Section | Information |
|---------|-------------|
| **General** | Name, description, category, manufacturer, MPN, footprint, IPN, tags, notes |
| **Stock** | Total stock with color indicator, per-location breakdown, minimum amount threshold |
| **Suppliers** | Supplier names, supplier part numbers (SPN), pricing at different quantities, links to supplier pages |
| **Parameters** | Technical specifications (resistance, capacitance, voltage rating, etc.) with values and units |
| **Attachments** | Datasheets, images, and other files with direct download links |
| **Link** | Direct "Open in Part-DB" link for full editing |

Click **← Back to results** to return to the search results.

## Part-DB API Reference

This extension uses the [Part-DB REST API](https://docs.part-db.de/) (built on [API Platform](https://api-platform.com/)). The following endpoints are used:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tokens/current` | GET | Validate token and test connection |
| `/api/parts` | GET | Search and list parts (with filters) |
| `/api/parts/{id}` | GET | Get full part details including lots, suppliers, parameters |
| `/api/categories` | GET | List all categories for the browse dropdown |

### Authentication

All requests use Bearer token authentication:
```
Authorization: Bearer tcp_<your-token-here>
```

### Response Format

The extension requests `application/json` responses. Part-DB also supports `application/ld+json` (JSON-LD) and `application/vnd.api+json` (JSON:API).

### Filtering

Part search supports these query parameters:
- `name` — substring match on part name
- `category` — filter by category IRI (e.g., `/api/categories/5`)
- `page` — pagination page number
- `itemsPerPage` — results per page (default: 30)
- `order[name]` — sort order (`asc` or `desc`)

## Development

### Project Structure

```
easyeda-partdb-extension/
├── src/
│   └── index.ts              # Extension entry point — exports menu handler functions
├── iframe/
│   ├── search.html           # Main UI: search, results table, part detail view
│   ├── settings.html         # Settings UI: server URL, API token, connection test
│   ├── css/
│   │   └── styles.css        # Shared dark theme stylesheet
│   └── js/
│       └── api.js            # PartDBClient class — API wrapper with auth, helpers
├── locales/
│   └── en.json               # English UI translations
├── images/
│   └── logo.png              # Extension icon (TODO)
├── config/
│   ├── esbuild.common.ts     # Shared esbuild configuration
│   ├── esbuild.prod.ts       # Production build script
│   └── esbuild.watch.ts      # Watch mode for development
├── build/
│   └── packaged.ts           # .eext packaging script (zip with manifest)
├── extension.json            # EasyEDA Pro extension manifest
├── .edaignore                # Files excluded from .eext package
├── package.json              # Node.js dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

### Building

```bash
# Install dependencies
npm install

# Compile TypeScript only
npm run compile

# Compile + package into .eext
npm run build

# Watch mode (auto-recompile on changes)
npm run watch
```

### Debugging

1. Open EasyEDA Pro desktop app
2. Press **F12** to open Chrome DevTools
3. Check the Console for extension logs and errors
4. For debug mode, append `?cll=debug` to the editor URL
5. The global `eda` object is available in the console for testing API calls

### Key Development Notes

- Extensions run as sandboxed IIFE scripts — the esbuild config (`format: 'iife'`, `globalName: 'edaEsbuildExportName'`) is required by the EDA runtime and must not be changed
- HTTP requests are made via standard `fetch()` inside iframe HTML files
- The `eda` global object provides access to all EasyEDA Pro APIs (storage, dialogs, iframes, etc.)
- Extension settings are persisted via `eda.sys_Storage.getExtensionUserConfig()` / `setExtensionUserConfig()`

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Not configured" status** | Open Part-DB → Settings and enter your server URL and API token |
| **"Authentication failed"** | Your API token is invalid or expired. Create a new one in Part-DB user settings |
| **"Access denied"** | Your token lacks the required permission level. Use at least READ_ONLY |
| **Connection test hangs / fails** | Check that your Part-DB URL is correct and accessible from your browser. Check CORS configuration (see above) |
| **No categories in dropdown** | The token user may not have `@categories.read` permission in Part-DB |
| **Extension not appearing in menu** | Make sure the extension is enabled in Extension Manager. Restart EasyEDA Pro if needed |
| **"External Interactions" error** | Enable the "External Interactions" permission for this extension in Extension Manager settings |
| **CORS errors in console** | Add `CORS_ALLOW_ORIGIN` to your Part-DB `.env.local` file (see Configuration section) |
| **Stock shows "?"** | The part has lots marked as "in stock unknown" — this is a Part-DB feature, not a bug |

## Roadmap

Future features under consideration:

- [ ] **LCSC part number linking** — auto-match Part-DB supplier entries to LCSC numbers for JLCPCB assembly
- [ ] **BOM sync** — compare schematic BOM against Part-DB inventory, highlight missing/low-stock parts
- [ ] **Part creation** — create new Part-DB entries from within EasyEDA (requires EDIT token level)
- [ ] **Stock reservation** — reserve stock for a project's BOM
- [ ] **Footprint/symbol search** — search by EasyEDA-compatible footprint identifiers
- [ ] **Multi-language support** — Chinese (zh-Hans) localization
- [ ] **Extension marketplace** — publish to the EasyEDA extensions marketplace when it launches globally

## Changelog

### v0.1.0 (2025-03-13) — Initial Release

**Features:**
- Part search with name substring matching via Part-DB REST API
- Category dropdown for browsing parts by category
- Paginated search results (30 parts per page)
- Part detail view with:
  - General info (name, description, category, manufacturer, MPN, footprint, IPN, tags)
  - Stock levels with color-coded badges (green/yellow/red) and per-location breakdown
  - Supplier info with part numbers, pricing, and external links
  - Technical parameters with values, units, and groups
  - Attachments and datasheets with direct links
  - Direct "Open in Part-DB" link
- Settings panel with server URL and API token configuration
- Connection test with token validation (shows token name and permission level)
- Dark theme UI matching EasyEDA Pro's aesthetic
- Menu entries in Home, Schematic, and PCB editors
- Bearer token authentication via Part-DB API tokens

**Technical:**
- TypeScript entry point compiled with esbuild
- Iframe-based UI with vanilla HTML/CSS/JS
- `PartDBClient` API wrapper class with connection management
- `.eext` packaging for EasyEDA Pro extension manager

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**Part-DB** is an open-source project by [Jan Böhmer](https://github.com/jbtronics) and contributors.
**EasyEDA Pro** is a product of [JLCEDA / LCEDA](https://easyeda.com/).
This extension is an independent community project and is not affiliated with either project.
