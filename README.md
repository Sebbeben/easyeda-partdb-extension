# EasyEDA Pro Part-DB Integration

An EasyEDA Pro extension that connects to your [Part-DB](https://github.com/Part-DB/Part-DB-server) inventory management system, letting you search parts, check stock levels, view supplier info, and browse datasheets — all from within EasyEDA Pro.

## Features

- **Search parts** by name, description, or MPN
- **Browse by category** with full category tree
- **View stock levels** with color-coded indicators
- **Supplier info** with part numbers and pricing
- **Part parameters** and specifications
- **Datasheets** and attachments (direct links)
- **Storage locations** for quick physical lookup
- **Direct links** back to Part-DB for full details

## Requirements

- **EasyEDA Pro** v2.3 or later (desktop or web)
- **Part-DB** instance with API access enabled
- **API Token** created in Part-DB (User Settings → API Tokens, minimum READ_ONLY level)

## Installation

### From .eext file

1. Download the latest `.eext` file from [Releases](https://github.com/Sebbeben/easyeda-partdb-extension/releases)
2. In EasyEDA Pro, go to **Extensions** → **Extension Manager**
3. Click **Import** and select the `.eext` file
4. Enable the **"External Interactions"** permission for the extension

### Build from source

```bash
git clone https://github.com/Sebbeben/easyeda-partdb-extension.git
cd easyeda-partdb-extension
npm install
npm run build
```

The packaged extension will be at `build/dist/partdb-integration_v*.eext`.

## Setup

1. In EasyEDA Pro, go to **Part-DB → Settings** (from the header menu)
2. Enter your Part-DB server URL (e.g., `https://partdb.example.com`)
3. Enter your API token (starts with `tcp_...`)
4. Click **Test Connection** to verify
5. Click **Save**

## Usage

### Searching Parts

1. Go to **Part-DB → Search Parts** from the header menu
2. Type a search term and press Enter, or select a category from the dropdown
3. Click any part row to see full details

### Part Details

The detail view shows:
- General info (name, description, category, manufacturer, MPN, footprint)
- Stock levels per storage location
- Supplier info with part numbers, prices, and links
- Technical parameters
- Attachments and datasheets
- Direct link to open the part in Part-DB

## Part-DB API

This extension uses the Part-DB REST API (built on API Platform). Key endpoints used:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/tokens/current` | Test connection / validate token |
| `GET /api/parts` | Search and list parts |
| `GET /api/parts/{id}` | Get full part details |
| `GET /api/categories` | List categories for browsing |

Authentication is via Bearer token: `Authorization: Bearer tcp_...`

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript (watch mode)
npm run watch

# Build and package .eext
npm run build
```

### Project Structure

```
├── src/
│   └── index.ts              # Extension entry point (menu handlers)
├── iframe/
│   ├── search.html           # Main search/browse/detail UI
│   ├── settings.html         # Connection settings UI
│   ├── css/styles.css        # Shared dark theme styles
│   └── js/api.js             # Part-DB API client
├── locales/
│   └── en.json               # English translations
├── extension.json            # Extension manifest
├── config/                   # esbuild config
└── build/                    # Packaging script
```

## License

MIT
