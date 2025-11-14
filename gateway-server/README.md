# Gateway Server (TypeScript)

A TypeScript-based Node.js server for serving payment gateway zip files and providing gateway information for growfund applications.

## Features

- ✅ Download payment gateway zip files via GET endpoint
- ✅ List all available payment gateways with metadata
- ✅ Serve gateway logos and static assets
- ✅ File validation (only .zip files allowed for download)
- ✅ CORS enabled for cross-origin requests
- ✅ Full TypeScript support with strict typing
- ✅ Error handling and validation
- ✅ Secure static file serving (only images allowed)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Start the Server

```bash
# Production (requires build first)
npm start

# Development (with TypeScript compilation and auto-reload)
npm run dev

# Development with watch mode
npm run dev:watch
```

The server will start on `http://localhost:8080` by default.

## API Endpoints

### Health Check

```
GET /
```

Returns server status and available endpoints.

**Response:**

```json
{
  "message": "Zip File Server is running!",
  "endpoints": {
    "download": "GET /download/:filename",
    "payment-gateways": "GET /payment-gateways",
    "static-assets": "GET /gateways/:gateway/:file (for logos and assets)"
  }
}
```

### Get Payment Gateways

```
GET /payment-gateways
```

Get a list of all available payment gateways with their metadata.

**Response:**

```json
[
  {
    "name": "growfund-gateway-stripe",
    "download_url": "https://example.com/download/growfund-gateway-stripe.zip",
    "type": "online-payment",
    "supports_future_payments": true,
    "frontend_script": "",
    "form_file": "",
    "class": "Growfund\\Gateways\\Stripe\\Stripe",
    "config": {
      "label": "Stripe",
      "logo": "https://example.com/gateways/growfund-gateway-stripe/logo.png"
    },
    "is_installed": false,
    "is_enabled": false,
    "fields": [
      {
        "name": "secret_key",
        "label": "Secret Key",
        "placeholder": "sk_1234...",
        "type": "text"
      }
    ]
  }
]
```

### Download Zip File

```
GET /download/:filename
```

Download a specific zip file.

**Parameters:**

- `filename`: Name of the zip file to download

**cURL Example:**

```bash
curl -O http://localhost:8080/download/growfund-gateway-stripe.zip
```

**Response:**

- Content-Type: `application/zip`
- Content-Disposition: `attachment; filename="example.zip"`
- Body: Binary zip file data

### Serve Gateway Assets

```
GET /gateways/:gateway/:file
```

Serve static assets (logos, images) for payment gateways. Only image files are allowed for security.

**Parameters:**

- `gateway`: Gateway directory name
- `file`: Image file name (must have image extension)

**Allowed Extensions:** .png, .jpg, .jpeg, .gif, .svg, .webp, .ico

**cURL Example:**

```bash
curl http://localhost:8080/gateways/growfund-gateway-stripe/logo.png
```

## Usage Examples

### TypeScript Client Example

```typescript
import axios from 'axios';
import fs from 'fs';

const serverUrl = 'http://localhost:8080';

interface Gateway {
  name: string;
  download_url: string;
  type: string;
  config: {
    label: string;
    logo: string;
  };
  fields: Array<{
    name: string;
    label: string;
    type: string;
  }>;
}

// Get all payment gateways
async function getPaymentGateways(): Promise<Gateway[]> {
  try {
    const response = await axios.get<Gateway[]>(`${serverUrl}/payment-gateways`);
    console.log('Available gateways:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to get gateways:', error);
    return [];
  }
}

// Download a gateway file
async function downloadGateway(filename: string, outputPath: string): Promise<void> {
  try {
    const response = await axios.get(`${serverUrl}/download/${filename}`, {
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}

// Example usage
async function main() {
  const gateways = await getPaymentGateways();

  if (gateways.length > 0) {
    const stripeGateway = gateways.find((g) => g.name.includes('stripe'));
    if (stripeGateway) {
      await downloadGateway('growfund-gateway-stripe.zip', './stripe-gateway.zip');
      console.log('Downloaded Stripe gateway');
    }
  }
}
```

### Python Client Example

```python
import requests

server_url = 'http://localhost:3000'

# Upload a file
def upload_file(file_path):
    with open(file_path, 'rb') as f:
        files = {'zipfile': f}
        response = requests.post(f'{server_url}/upload', files=files)
        print(response.json())

# List all files
def list_files():
    response = requests.get(f'{server_url}/files')
    print(response.json())

# Download a file
def download_file(filename, output_path):
    response = requests.get(f'{server_url}/download/{filename}')
    with open(output_path, 'wb') as f:
        f.write(response.content)
    print(f'Downloaded {filename} to {output_path}')
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 8080)

### File Storage

- Gateway files are stored in the `gateways/` directory
- Each gateway has its own subdirectory with manifest.json and assets
- Only `.zip` files are accepted for download
- Only image files can be served via `/gateways/` endpoint

### TypeScript Configuration

- Source files are in `src/` directory
- Compiled output goes to `dist/` directory
- Strict TypeScript checking enabled
- Full type definitions for all APIs

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

Common error codes:

- `400`: Bad request (invalid file, file too large, wrong file type)
- `404`: File not found
- `500`: Internal server error

## Security Considerations

- Only `.zip` files are accepted
- File size is limited to 100MB
- Files are validated before storage
- CORS is enabled (configure as needed for production)

## Development

### Project Structure

```
gateway-server/
├── src/
│   ├── server.ts      # Main TypeScript server file
│   └── types.ts       # Type definitions
├── dist/              # Compiled JavaScript output
├── gateways/          # Payment gateway files
│   ├── growfund-gateway-stripe/
│   │   ├── manifest.json
│   │   ├── logo.png
│   │   └── growfund-gateway-stripe.zip
│   └── growfund-gateway-paypal/
│       ├── manifest.json
│       ├── logo.png
│       └── growfund-gateway-paypal.zip
├── uploads/           # Upload directory (created automatically)
├── tsconfig.json      # TypeScript configuration
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

### Dependencies

**Runtime:**

- `express`: Web framework
- `multer`: File upload middleware
- `cors`: Cross-origin resource sharing

**Development:**

- `typescript`: TypeScript compiler
- `ts-node`: TypeScript execution for development
- `nodemon`: Development auto-reload
- `@types/*`: Type definitions for all dependencies

### Development Scripts

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Build gateway zip files
npm run build:gateways

# Gateway development sync (watch mode)
npm run sync:gateways

# Gateway development sync (one-time)
npm run sync:gateways:once

# Start production server (requires build)
npm start

# Start development server with TypeScript
npm run dev

# Start development server with auto-reload
npm run dev:watch

# Full development mode (server + gateway sync)
npm run dev:full

# Clean build directory
npm run clean
```

### Gateway Management

#### Building Gateway Packages

Create zip files for all payment gateways:

```bash
# Create zip files for all gateway folders
npm run build:gateways
```

This script will:

- Scan the `gateways/` directory for folders matching `growfund-gateway-*`
- Create a zip file for each gateway folder with the same name
- Include all contents of the folder (source code, dependencies, assets)
- Place the zip file inside the respective gateway folder
- Skip existing zip files (removes and recreates them)

#### Development Sync

For gateway development, you can sync changes from `gateway-server/gateways/` to `wordpress/wp-content/plugins/`:

```bash
# Start watching for changes (recommended for development)
npm run sync:gateways

# Perform one-time sync
npm run sync:gateways:once

# Full development mode (server + sync)
npm run dev:full
```

**How it works:**

- 🔍 **Auto-discovers** all `growfund-gateway-*` directories
- 📂 **Creates WordPress plugin directories** if they don't exist
- 👁️ **Watches for file changes** in gateway-server directories
- 🔄 **Instantly syncs** changes to WordPress plugins directory
- ⚡ **Excludes** vendor/ directories and .zip files (development only)
- 🚫 **Smart filtering** ignores .DS_Store and other system files

**Example output:**

```
🔍 Discovering gateway plugins...

📦 Found gateway: growfund-gateway-stripe
   📁 Source: /path/to/gateway-server/gateways/growfund-gateway-stripe
   🎯 Target: /path/to/wordpress/wp-content/plugins/growfund-gateway-stripe
   ✅ Target exists

🔄 Initial sync for growfund-gateway-stripe...
✅ Initial sync completed for growfund-gateway-stripe

👁️  Watching growfund-gateway-stripe for changes...
✅ Sync started for 1 gateway(s)
👁️  Watching for changes... (Press Ctrl+C to stop)

📝 Synced: growfund-gateway-stripe/manifest.json
📝 Synced: growfund-gateway-stripe/src/Stripe.php
```

**Use Cases:**

- 🛠️ **Development**: Edit files in `gateway-server/gateways/` and see changes instantly in WordPress
- 🧪 **Testing**: Test gateway functionality in WordPress without manual copying
- 🔄 **Hot Reload**: Changes reflect immediately for faster development cycles

**Original Build Output:**

```
📁 Found 2 gateway folder(s):

1. Processing: growfund-gateway-paypal
   ♻️  Removed existing growfund-gateway-paypal.zip
   📦 Creating growfund-gateway-paypal.zip...
   ✅ Created growfund-gateway-paypal.zip (287.53 KB)

2. Processing: growfund-gateway-stripe
   ♻️  Removed existing growfund-gateway-stripe.zip
   📦 Creating growfund-gateway-stripe.zip...
   ✅ Created growfund-gateway-stripe.zip (768.23 KB)
```

## License

MIT License
