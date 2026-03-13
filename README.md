# EasyEDA Pro Part-DB Integration

An [EasyEDA Pro](https://pro.easyeda.com/) extension that connects to your [Part-DB](https://github.com/Part-DB/Part-DB-server) electronic parts inventory, letting you search parts, check stock levels, view supplier info, place LCSC-linked components, check BOM stock, and sync BOMs to Part-DB projects — all without leaving your EDA workspace.

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
  - [Place in Schematic](#place-in-schematic)
  - [BOM Stock Check](#bom-stock-check)
  - [BOM to Part-DB Project Sync](#bom-to-part-db-project-sync)
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

- **Multi-field search** — search by name, description, MPN, IPN, LCSC number, or tags
- **Category tree** — browse parts using a collapsible sidebar category tree with recursive filtering
- **Filters** — toggle In Stock and Favorites filters, combine with search and category
- **Part images** — thumbnails in results table and full images in detail view
- **LCSC integration** — shows LCSC part numbers, links to LCSC product pages and datasheets
- **Place in Schematic** — place LCSC-linked components directly into your schematic from Part-DB
- **BOM Stock Check** — read all schematic components, match against Part-DB, show stock levels with shortage highlighting
- **BOM → Project Sync** — sync your schematic BOM to a Part-DB project (create/update BOM entries)
- **CSV Export** — export BOM stock check results as CSV
- **Stock levels** — color-coded badges (green/yellow/red) with per-location breakdown
- **Supplier info** — supplier part numbers, pricing, and direct links
- **Part parameters** — technical specifications with values and units
- **Datasheets** — direct links from Part-DB or LCSC fallback
- **Storage locations** — quick physical lookup in results
- **Paginated results** — for large inventories
- **Copy to clipboard** — click any MPN, IPN, LCSC, or SPN to copy
- **Direct Part-DB links** — open any part in Part-DB's web interface
- **Dark theme** — UI matches EasyEDA Pro's aesthetic
- **Zebra striping** — alternating row colors for readability
- **Available everywhere** — menu entries in Home, Schematic, and PCB editors

## Screenshots

*Coming soon — screenshots will be added after initial testing.*

## Requirements

| Requirement | Minimum Version | Notes |
| ----------- | --------------- | ----- |
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

```text
build/dist/partdb-integration_v0.4.0.eext
```

Import this `.eext` file into EasyEDA Pro as described above.

## Configuration

### 1. Create a Part-DB API Token

1. Log in to your Part-DB instance
2. Go to **User Settings** (click your username → Settings)
3. Navigate to the **API Tokens** section
4. Click **Create Token**
5. Set a name (e.g., "EasyEDA Extension")
6. Set the token level to at least **READ_ONLY** (use **EDIT** if you want BOM sync to work)
7. Set an expiration date (or leave default)
8. Click **Create** and **copy the token** (starts with `tcp_...`)

> **Security note:** The token is stored locally in EasyEDA Pro's extension storage on your machine. It is sent only to your Part-DB server. Use a READ_ONLY token for search-only access, or EDIT for BOM sync features.

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
2. Type a search term in the search box — it searches across name, description, MPN, IPN, and tags simultaneously
3. Press **Enter** or click **Search**
4. Results appear in a table showing: image thumbnail, name, description, category, LCSC/MPN, stock, and storage location
5. Click any LCSC or MPN number to copy it to clipboard

### Browsing by Category

1. Open the search panel
2. Use the **category tree** on the left sidebar to browse — click a category to filter parts
3. Click the expand arrow to show subcategories
4. Categories filter recursively (selecting "Resistors" shows parts in all sub-categories)
5. The active category appears as a chip in the filter bar — click the × to clear it
6. Combine with the **In Stock** or **Favorites** filter chips

### Part Detail View

Click any row in the search results to open the detail view, which shows:

| Section | Information |
| ------- | ----------- |
| **General** | Name, description, category, manufacturer, MPN, footprint, IPN, LCSC number, tags, notes |
| **Stock** | Total stock with color indicator, per-location breakdown, minimum amount threshold |
| **Suppliers** | Supplier names, supplier part numbers (SPN), pricing at different quantities, links to supplier pages |
| **Parameters** | Technical specifications (resistance, capacitance, voltage rating, etc.) with values and units |
| **Attachments** | Datasheets, images, and other files with direct download links |
| **Actions** | Place in Schematic, open datasheet, view on LCSC, open in Part-DB |

Click the **← Back** button to return to the search results.

### Place in Schematic

For parts that have an LCSC number (e.g., C12345) linked through a supplier entry in Part-DB:

1. Open a part's detail view
2. Click the **⚡ Place in Schematic** button
3. The extension looks up the LCSC part in EasyEDA's component library
4. The component attaches to your mouse cursor for placement
5. Click to place it in your schematic

> This requires the part to have a valid LCSC number in its supplier/order details in Part-DB.

### BOM Stock Check

Available from the Schematic editor: **Part-DB → BOM Stock Check...**

1. Open a schematic in EasyEDA Pro
2. Open the BOM Stock Check panel
3. Click **Refresh** to read all schematic components
4. The extension groups components by LCSC number (or value+footprint), then checks each against Part-DB
5. Results show: designators, value, LCSC number, matched Part-DB name, quantity needed, stock available, and status
6. Summary cards at top show total lines, in stock, low stock, out of stock, and not found counts
7. Click **Export CSV** to download the results

Status indicators:

- **OK** (green) — sufficient stock for the required quantity
- **Low** (yellow) — stock is below the required quantity
- **Out of Stock** (red) — zero stock in Part-DB
- **Not in Part-DB** (grey) — no matching part found

### BOM to Part-DB Project Sync

After running a BOM Stock Check:

1. Select a Part-DB project from the **Sync to Project** dropdown
2. Click **Sync BOM**
3. The extension creates or updates BOM entries in the Part-DB project with quantities and designators
4. Existing entries (matched by part) are updated; new ones are created

> Requires an API token with EDIT permission level.

## Part-DB API Reference

This extension uses the [Part-DB REST API](https://docs.part-db.de/) (built on [API Platform](https://api-platform.com/)). The following endpoints are used:

| Endpoint | Method | Purpose |
| -------- | ------ | ------- |
| `/api/tokens/current` | GET | Validate token and test connection |
| `/api/parts` | GET | Search and list parts (with filters) |
| `/api/parts/{id}` | GET | Get full part details including lots, suppliers, parameters |
| `/api/categories` | GET | List all categories for the sidebar tree |
| `/api/projects` | GET | List projects for BOM sync |
| `/api/project_bom_entries` | GET/POST/PATCH | Manage project BOM entries |

### Authentication

All requests use Bearer token authentication:

```text
Authorization: Bearer tcp_<your-token-here>
```

### Response Format

The extension requests `application/json` responses. Part-DB also supports `application/ld+json` (JSON-LD) and `application/vnd.api+json` (JSON:API).

### Filtering

Part search supports these query parameters:

- `name` — substring match on part name (LikeFilter with `%` wildcards)
- `description` — substring match on description
- `manufacturer_product_number` — match MPN
- `ipn` — match internal part number
- `tags` — match tags
- `category` — filter by category ID (append `++` for recursive)
- `favorite` — boolean filter for favorite parts
- `orderdetails.supplierpartnr` — match supplier part number (LCSC)
- `page` — pagination page number
- `itemsPerPage` — results per page (default: 30)
- `order[name]` — sort order (`asc` or `desc`)

## Development

### Project Structure

```text
easyeda-partdb-extension/
├── src/
│   └── index.ts              # Extension entry point — exports menu handler functions
├── iframe/
│   ├── search.html           # Search UI: category tree, results table, part detail, Place in Schematic
│   ├── bom.html              # BOM Stock Check: read schematic, match Part-DB, export CSV, project sync
│   ├── settings.html         # Settings UI: server URL, API token, connection test
│   ├── css/
│   │   └── styles.css        # Shared dark theme stylesheet
│   └── js/
│       └── api.js            # PartDBClient class (reference only — inlined in HTML due to sandbox)
├── images/
│   └── logo.png              # Extension icon
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

> **Note:** Due to EasyEDA Pro's iframe sandbox, external `<script src>` tags are blocked. All JavaScript (including the `PartDBClient` class) is inlined directly in each HTML file.

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
- The `eda` global object provides access to all EasyEDA Pro APIs (storage, dialogs, iframes, components, etc.)
- Extension settings are persisted via `eda.sys_Storage.getExtensionUserConfig()` / `setExtensionUserConfig()`
- Schematic components are read via `eda.sch_PrimitiveComponent.getAll()`
- LCSC parts are looked up via `eda.lib_Device.getByLcscIds()`
- Component placement uses `eda.sch_PrimitiveComponent.placeComponentWithMouse()`

## Troubleshooting

| Problem | Solution |
| ------- | -------- |
| **"Not configured" status** | Open Part-DB → Settings and enter your server URL and API token |
| **"Authentication failed"** | Your API token is invalid or expired. Create a new one in Part-DB user settings |
| **"Access denied"** | Your token lacks the required permission level. Use at least READ_ONLY (EDIT for BOM sync) |
| **Connection test hangs / fails** | Check that your Part-DB URL is correct and accessible from your browser. Check CORS configuration (see above) |
| **No categories in tree** | The token user may not have category read permission in Part-DB |
| **Extension not appearing in menu** | Make sure the extension is enabled in Extension Manager. Restart EasyEDA Pro if needed |
| **"External Interactions" error** | Enable the "External Interactions" permission for this extension in Extension Manager settings |
| **CORS errors in console** | Add `CORS_ALLOW_ORIGIN` to your Part-DB `.env.local` file (see Configuration section) |
| **Stock shows "?"** | The part has lots marked as "in stock unknown" — this is a Part-DB feature, not a bug |
| **BOM shows "Not in Part-DB"** | The LCSC number on the schematic component doesn't match any supplier part number in Part-DB |
| **Place in Schematic not available** | The part needs an LCSC number (C-number) in its Part-DB supplier/order details |
| **BOM Sync fails** | Your API token needs EDIT permission level. Check Part-DB user settings |
| **Search returns no results** | Try shorter search terms. The search uses substring matching with `%` wildcards |

## Roadmap

Future features under consideration:

- [ ] **Part creation** — create new Part-DB entries from within EasyEDA (requires EDIT token level)
- [ ] **Stock reservation** — reserve stock for a project's BOM
- [ ] **Multi-language support** — Chinese (zh-Hans) localization
- [ ] **Extension marketplace** — publish to the EasyEDA extensions marketplace when it launches globally
- [ ] **PCB BOM check** — read BOM from PCB editor in addition to schematic
- [ ] **Batch placement** — place multiple LCSC components in sequence

## Changelog

### v0.4.0 — BOM Stock Check & Project Sync

**Features:**

- BOM Stock Check — read all schematic components, match against Part-DB by LCSC number or name, show stock comparison with status indicators (OK/Low/Out/Not Found)
- BOM summary cards showing total lines, in stock, low stock, out of stock, and not found counts
- BOM → Part-DB Project sync — create or update project BOM entries with quantities and designators
- CSV export of BOM stock check results
- BOM Stock Check menu entry in Schematic editor

**Improvements:**

- Larger default window size (1000×700 for search, 1000×650 for BOM)

### v0.3.0 — LCSC Integration & Place in Schematic

**Features:**

- Place in Schematic — place LCSC-linked components directly from Part-DB search results
- LCSC number extraction from Part-DB supplier/order details
- LCSC column in results table (shows LCSC number if available, falls back to MPN)
- LCSC product page and datasheet links in part detail view
- Part images — thumbnails in results table, full images in detail view
- Copy to clipboard — click any MPN, IPN, LCSC, or SPN to copy

**Improvements:**

- Zebra striping (alternating row colors) for better readability
- Proper back button in part detail view
- Scroll-to-top after search results load
- Detail view closes when clicking a category in the tree

### v0.2.0 — Category Tree & Multi-field Search

**Features:**

- Category tree sidebar with collapsible hierarchy and recursive filtering
- Multi-field search across name, description, MPN, IPN, and tags
- In Stock filter chip — show only parts with stock > 0
- Favorites filter — show only favorite parts
- Active category chip with clear button in filter bar
- Connection status badge (green/red) in status bar footer

**Improvements:**

- Settings button removed from search (use menu instead)
- Report Issue link in status bar footer

### v0.1.0 — Initial Release

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
