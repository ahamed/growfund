# Growfund Plugin - Developer Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [WordPress Backend (PHP)](#wordpress-backend-php)
4. [React Frontend (TypeScript)](#react-frontend-typescript)
5. [Payment Gateway System](#payment-gateway-system)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Development Setup](#development-setup)
9. [Deployment](#deployment)
10. [Contributing Guidelines](#contributing-guidelines)

---

## Overview

The Growfund Plugin is a comprehensive WordPress plugin that enables dual-mode fundraising operations:

- **Campaign Mode**: Traditional growfund with rewards/pledges
- **Donation Mode**: Direct donations with tribute functionality

### Key Features

- Dual-mode operation (campaigns vs donations)
- Multi-role user management (Admin, Fundraiser, Backer, Donor)
- Multiple payment gateways with extensible architecture
- Modern React.js admin interface
- Comprehensive analytics and reporting
- Email notification system
- Campaign collaboration system
- Reward management with shipping
- PDF receipt generation

### Technology Stack

- **Backend**: WordPress, PHP 7.4+, MySQL/MariaDB
- **Frontend**: React 19.1, TypeScript, Tailwind CSS, Radix UI
- **Build Tools**: Vite, ESLint, PostCSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v7
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Payment Processing**: Extensible gateway system (Stripe, PayPal)

---

## Architecture

The plugin follows a modern architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     WordPress Admin                        │
├─────────────────────────────────────────────────────────────┤
│                   React SPA (TypeScript)                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐  │
│  │   Dashboards    │ │    Features     │ │  Components   │  │
│  │                 │ │                 │ │               │  │
│  │ • Admin         │ │ • Campaigns     │ │ • UI Library  │  │
│  │ • Fundraiser    │ │ • Analytics     │ │ • Forms       │  │
│  │ • Backer/Donor  │ │ • Settings      │ │ • Charts      │  │
│  └─────────────────┘ └─────────────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    REST API Layer                          │
├─────────────────────────────────────────────────────────────┤
│                 WordPress PHP Backend                      │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐  │
│  │   Controllers   │ │    Services     │ │   Data Layer  │  │
│  │                 │ │                 │ │               │  │
│  │ • API           │ │ • Campaign      │ │ • Models      │  │
│  │ • Site          │ │ • Payment       │ │ • Migrations  │  │
│  │ • AJAX          │ │ • Email         │ │ • Query Builder│ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│               Payment Gateway System                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐  │
│  │    Registry     │ │    Contracts    │ │   Gateways    │  │
│  │                 │ │                 │ │               │  │
│  │ • Discovery     │ │ • Interface     │ │ • Stripe      │  │
│  │ • Management    │ │ • DTOs          │ │ • PayPal      │  │
│  │ • Config        │ │ • Events        │ │ • Custom      │  │
│  └─────────────────┘ └─────────────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Database Layer                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐  │
│  │   WP Tables     │ │  Custom Tables  │ │   Meta Data   │  │
│  │                 │ │                 │ │               │  │
│  │ • wp_posts      │ │ • gf_pledges    │ │ • Post Meta   │  │
│  │ • wp_users      │ │ • gf_donations  │ │ • User Meta   │  │
│  │ • wp_terms      │ │ • gf_funds      │ │ • Term Meta   │  │
│  └─────────────────┘ └─────────────────┘ └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Separation of Concerns**: Clear boundaries between frontend and backend
2. **Service-Oriented Architecture**: Business logic encapsulated in services
3. **Event-Driven Design**: Loose coupling through events and listeners
4. **Extensible Payment System**: Plugin-based payment gateway architecture
5. **Type Safety**: Full TypeScript coverage on frontend
6. **Modern PHP Practices**: PSR-4 autoloading, dependency injection, contracts

---

## WordPress Backend (PHP)

### Directory Structure

```
wordpress/wp-content/plugins/growfund/
├── bootstrap/
│   ├── app.php                 # Application bootstrap
│   ├── providers.php           # Service providers
│   ├── aliases.php            # Container aliases
│   └── events.php             # Event listeners
├── configs/
│   ├── migrations.php         # Migration configuration
│   ├── hooks.php             # WordPress hooks
│   └── capabilities.php      # User capabilities
├── src/
│   ├── Application.php        # Main application class
│   ├── Container.php         # Dependency injection
│   ├── Controllers/          # API and site controllers
│   ├── Services/            # Business logic services
│   ├── Models/              # Data models (DTOs)
│   ├── Migrations/          # Database migrations
│   ├── PostTypes/           # Custom post types
│   ├── Taxonomies/          # Custom taxonomies
│   ├── Hooks/               # WordPress hook handlers
│   ├── Policies/            # Authorization policies
│   ├── Validation/          # Request validation
│   └── Templates/           # Frontend templates
├── payments/                 # Payment gateway framework
├── routes/                  # Route definitions
└── resources/              # Assets and frontend
```

### Application Bootstrap

The plugin follows a Laravel-inspired architecture with a central application container:

```php
// bootstrap/app.php
$app = Application::configure();
$app->boot();
```

The `Application` class extends a custom `Container` that provides:

- Service registration and resolution
- Singleton management
- Alias registration
- Event system integration

### Service Providers

Service providers organize and register services:

```php
// Example: AppServiceProvider
class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(CampaignService::class);
        $this->app->singleton(PaymentService::class);
    }

    public function boot()
    {
        // Boot-time initialization
    }
}
```

### Controllers

Controllers handle HTTP requests and return responses:

```php
// Controllers/API/CampaignController.php
class CampaignController
{
    public function paginated(Request $request): Response
    {
        $filters = CampaignFiltersDTO::from_array($request->all());
        $campaigns = $this->campaign_service->paginated($filters);

        return Response::success($campaigns);
    }
}
```

### Services

Services encapsulate business logic:

```php
// Services/CampaignService.php
class CampaignService
{
    public function create(): int
    {
        $post_id = wp_insert_post([
            'post_type' => Campaign::NAME,
            'post_title' => 'Untitled',
            'post_status' => Campaign::DEFAULT_POST_STATUS,
        ]);

        PostMeta::add($post_id, 'status', CampaignStatus::DRAFT);

        return $post_id;
    }
}
```

### Data Transfer Objects (DTOs)

DTOs provide type-safe data structures:

```php
// DTO/Campaign/CampaignDTO.php
class CampaignDTO
{
    public string $id;
    public string $title;
    public string $description;
    public array $images;
    public string $status;
    public float $fund_raised;
    // ... other properties

    public static function from_array(array $data): self
    {
        // Factory method implementation
    }
}
```

### Database Layer

#### Custom Tables

The plugin creates custom tables for core entities:

1. **gf_pledges**: Stores campaign pledges with payment information
2. **gf_donations**: Stores donations with tribute functionality
3. **gf_funds**: Manages donation funds/categories
4. **gf_campaign_collaborators**: Campaign collaboration relationships
5. **gf_bookmarks**: User bookmarks for campaigns
6. **gf_activities**: Activity logging system

#### Migrations

Database migrations ensure consistent schema:

```php
// Migrations/CreatePledgeTable.php
class CreatePledgeTable extends BaseMigration
{
    public function up()
    {
        $sql = "CREATE TABLE IF NOT EXISTS {$this->get_table_name()} (
            `ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `campaign_id` BIGINT UNSIGNED NOT NULL,
            `user_id` BIGINT UNSIGNED NULL,
            `status` VARCHAR(255) NOT NULL,
            `amount` INT UNSIGNED NOT NULL DEFAULT 0,
            `created_at` DATETIME NOT NULL,
            -- Additional columns...
            FOREIGN KEY (`campaign_id`) REFERENCES `{$wpdb->posts}`(`ID`)
        )";

        $this->add_table($sql);
    }
}
```

#### Query Builder

Custom query builder for complex database operations:

```php
// Usage example
$pledges = QueryBuilder::query()
    ->table(Tables::PLEDGES)
    ->join(WP::POSTS_TABLE, 'posts.ID', 'pledges.campaign_id')
    ->where('pledges.status', PledgeStatus::CONFIRMED)
    ->where_date('pledges.created_at', '>=', $start_date)
    ->get();
```

### WordPress Integration

#### Custom Post Types

```php
// PostTypes/Campaign.php
class Campaign implements Registrable
{
    const NAME = 'gf_campaign';

    public function register()
    {
        register_post_type(self::NAME, [
            'public' => false,
            'publicly_queryable' => true,
            'hierarchical' => true,
            'supports' => ['title'],
            'rewrite' => ['slug' => 'campaigns'],
        ]);
    }
}
```

#### Custom Taxonomies

```php
// Taxonomies/Category.php
class Category implements Registrable
{
    const NAME = 'gf_campaign_category';

    public function register()
    {
        register_taxonomy(self::NAME, [Campaign::NAME], [
            'hierarchical' => true,
            'public' => true,
            'rewrite' => ['slug' => 'campaign-category'],
        ]);
    }
}
```

#### WordPress Hooks

```php
// Hooks/Actions/EnqueueAssets.php
class EnqueueAssets extends BaseHook
{
    public function handle()
    {
        wp_enqueue_script(
            'growfund-admin',
            GF_REACT_APP_URL . 'dist/main.js',
            [],
            GF_VERSION,
            true
        );
    }
}
```

### Event System

Events enable decoupled communication:

```php
// Events/CampaignStatusUpdateEvent.php
class CampaignStatusUpdateEvent implements Event
{
    public function __construct(
        public CampaignDTO $campaign,
        public string $new_status
    ) {}
}

// Listeners/SendCampaignStatusEmail.php
class SendCampaignStatusEmail implements Listener
{
    public function handle(CampaignStatusUpdateEvent $event)
    {
        // Send email notification
    }
}

// Usage
gf_event(new CampaignStatusUpdateEvent($campaign, $status));
```

---

## React Frontend (TypeScript)

### Directory Structure

```
resources/ts/src/
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── form/                 # Form components
│   ├── charts/               # Chart components
│   └── layouts/              # Layout components
├── features/                 # Feature-specific modules
│   ├── campaigns/           # Campaign management
│   ├── analytics/           # Analytics and reporting
│   ├── settings/            # Settings management
│   ├── donations/           # Donation functionality
│   └── pledges/             # Pledge management
├── dashboards/              # Role-specific dashboards
│   ├── shared/              # Shared dashboard components
│   ├── backers/             # Backer dashboard
│   ├── donors/              # Donor dashboard
│   └── fundraisers/         # Fundraiser dashboard
├── contexts/                # React contexts
├── hooks/                   # Custom React hooks
├── services/                # API services
├── utils/                   # Utility functions
├── types/                   # TypeScript type definitions
└── lib/                     # Library configurations
```

### Application Architecture

#### Main Application

```tsx
// App.tsx
function App() {
  useEffect(() => {
    // Signal WordPress that React app is loaded
    window.dispatchEvent(new Event('OnGrowfundAppLoaded'));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <AppConfigProvider>
          <CampaignModeProvider>
            <RouterProvider router={routes} />
          </CampaignModeProvider>
        </AppConfigProvider>
      </CurrentUserProvider>
    </QueryClientProvider>
  );
}
```

#### Routing System

```tsx
// app/routes.tsx
export const routes = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'campaigns',
        children: [
          { index: true, element: <CampaignsPage /> },
          { path: ':id', element: <CampaignDetailsPage /> },
        ],
      },
      // ... other routes
    ],
  },
]);
```

#### State Management

The application uses TanStack Query for server state and React Context for global state:

```tsx
// contexts/app-config.tsx
export const AppConfigProvider = ({ children }: PropsWithChildren) => {
  const { data: appConfig } = useQuery({
    queryKey: ['app-config'],
    queryFn: () => api.get('/app-config'),
    staleTime: Infinity,
  });

  return <AppConfigContext.Provider value={appConfig}>{children}</AppConfigContext.Provider>;
};
```

#### API Integration

```tsx
// lib/api.ts
const api = axios.create({
  baseURL: '/wp-json/growfund/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': window.growfund.nonce,
  },
});

// Usage in components
const { data: campaigns, isLoading } = useQuery({
  queryKey: ['campaigns', filters],
  queryFn: () => api.get('/campaigns', { params: filters }),
});
```

### Feature Modules

#### Campaign Management

```tsx
// features/campaigns/campaign-form.tsx
export const CampaignForm = ({ campaignId }: CampaignFormProps) => {
  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CampaignFormData) =>
      campaignId ? api.put(`/campaigns/${campaignId}`, data) : api.post('/campaigns', data),
    onSuccess: () => {
      toast.success('Campaign saved successfully');
      queryClient.invalidateQueries(['campaigns']);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(mutation.mutate)}>{/* Form fields */}</form>
    </Form>
  );
};
```

#### Data Tables

```tsx
// components/table/data-table.tsx
export const DataTable = <TData,>({ columns, data, pagination }: DataTableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // ... other table configuration
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>{/* Table body implementation */}</TableBody>
      </Table>
    </div>
  );
};
```

#### Charts and Analytics

```tsx
// features/analytics/revenue-chart.tsx
export const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

### Build System

#### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), svgr()],
  base: '',
  define: {
    __PLUGIN_URL__: JSON.stringify('/wp-content/plugins/growfund'),
    __ENV_MODE__: JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  build: {
    outDir: '../dist',
    manifest: true,
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router', '@tanstack/react-query'],
          'ui-radix': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          charts: ['recharts'],
          utils: ['axios', 'clsx', 'tailwind-merge', 'date-fns'],
        },
      },
    },
  },
});
```

#### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Payment Gateway System

The payment gateway system is designed for extensibility and supports multiple payment processors.

### Gateway Server Architecture

```
gateway-server/
├── src/
│   ├── server.ts             # Express server
│   └── types.ts              # Type definitions
├── gateways/                 # Payment gateway packages
│   ├── growfund-gateway-stripe/
│   │   ├── manifest.json     # Gateway metadata
│   │   ├── src/Stripe.php   # Implementation
│   │   ├── composer.json     # PHP dependencies
│   │   └── logo.png         # Gateway logo
│   └── growfund-gateway-paypal/
│       ├── manifest.json
│       ├── src/Paypal.php
│       └── ...
└── package.json
```

### Gateway Contracts

All payment gateways must implement the `PaymentGatewayContract`:

```php
// payments/Contracts/PaymentGatewayContract.php
interface PaymentGatewayContract
{
    public function create_payment(PaymentPayloadDTO $payload): PaymentResponseDTO;
    public function handle_webhook(WebhookPayloadDTO $payload): WebhookResponseDTO;
    public function refund_payment(string $transaction_id, int $amount): RefundResponseDTO;
    public function get_customer(string $customer_id): CustomerDTO;
    public function create_customer(CustomerDTO $customer): CustomerDTO;
}
```

### Gateway Registration

```php
// Gateway discovery and registration
class GatewayDiscovery
{
    public static function discover_gateways(): array
    {
        $gateways = [];
        $gateway_dirs = glob(WP_CONTENT_DIR . '/plugins/growfund-gateway-*');

        foreach ($gateway_dirs as $dir) {
            $manifest_path = $dir . '/manifest.json';
            if (file_exists($manifest_path)) {
                $manifest = json_decode(file_get_contents($manifest_path), true);
                $gateways[] = $manifest;
            }
        }

        return $gateways;
    }
}
```

### Gateway Implementation Example

```php
// Stripe Gateway Implementation
class Stripe implements PaymentGatewayContract
{
    private $stripe_client;

    public function __construct(array $config)
    {
        $this->stripe_client = new \Stripe\StripeClient($config['secret_key']);
    }

    public function create_payment(PaymentPayloadDTO $payload): PaymentResponseDTO
    {
        $intent = $this->stripe_client->paymentIntents->create([
            'amount' => $payload->amount,
            'currency' => $payload->currency,
            'customer' => $payload->customer_id,
            'metadata' => $payload->metadata,
        ]);

        return PaymentResponseDTO::from_array([
            'transaction_id' => $intent->id,
            'status' => $this->map_stripe_status($intent->status),
            'client_secret' => $intent->client_secret,
        ]);
    }
}
```

### Gateway Management API

```typescript
// Frontend gateway management
const usePaymentGateways = () => {
  return useQuery({
    queryKey: ['payment-gateways'],
    queryFn: async () => {
      const response = await api.get('/payment-gateways');
      return response.data;
    },
  });
};

const useInstallGateway = () => {
  return useMutation({
    mutationFn: async (gatewayName: string) => {
      return api.post('/payment-gateways/install', { name: gatewayName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-gateways']);
      toast.success('Gateway installed successfully');
    },
  });
};
```

---

## Database Schema

### WordPress Core Tables

The plugin extends WordPress core tables:

#### wp_posts

- Stores campaigns as custom post type `gf_campaign`
- Stores campaign updates as `gf_campaign_post`
- Stores rewards as `gf_reward`
- Stores reward items as `gf_reward_item`

#### wp_postmeta

- Campaign settings and metadata
- Reward configurations
- Custom field data

#### wp_users

- Fundraisers, backers, donors
- Extended with custom capabilities

#### wp_usermeta

- User preferences
- Notification settings
- Profile information

### Custom Tables

#### gf_pledges

```sql
CREATE TABLE gf_pledges (
    ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    status VARCHAR(255) NOT NULL,
    pledge_option VARCHAR(255) NOT NULL,
    reward_id BIGINT NULL,
    amount INT UNSIGNED NOT NULL DEFAULT 0,
    bonus_support_amount INT UNSIGNED NOT NULL DEFAULT 0,
    shipping_cost INT UNSIGNED NOT NULL DEFAULT 0,
    recovery_fee INT UNSIGNED NOT NULL DEFAULT 0,
    processing_fee INT UNSIGNED NOT NULL DEFAULT 0,
    should_deduct_fee_recovery TINYINT NOT NULL DEFAULT 0,
    notes TEXT NULL,
    transaction_id VARCHAR(255) NULL,
    payment_engine VARCHAR(255) NULL,
    payment_method VARCHAR(255) NULL,
    payment_status VARCHAR(255) NULL,
    is_manual TINYINT NOT NULL DEFAULT 0,
    reward_info TEXT NULL,
    user_info TEXT,
    created_at DATETIME NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_at DATETIME NULL,
    updated_by BIGINT UNSIGNED NULL
);
```

#### gf_donations

```sql
CREATE TABLE gf_donations (
    ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT UNSIGNED NOT NULL,
    fund_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    amount INT UNSIGNED NOT NULL,
    recovery_fee INT UNSIGNED NOT NULL DEFAULT 0,
    processing_fee INT UNSIGNED NOT NULL DEFAULT 0,
    should_deduct_fee_recovery TINYINT NOT NULL DEFAULT 0,
    tribute_type VARCHAR(255) NULL,
    tribute_salutation VARCHAR(255) NULL,
    tribute_to VARCHAR(255) NULL,
    tribute_notification_type VARCHAR(255) NULL,
    tribute_notification_recipient_name VARCHAR(255) NULL,
    tribute_notification_recipient_phone VARCHAR(255) NULL,
    tribute_notification_recipient_email VARCHAR(255) NULL,
    tribute_notification_recipient_address TEXT NULL,
    notes TEXT NULL,
    status VARCHAR(255) NOT NULL,
    transaction_id VARCHAR(255) NULL,
    payment_engine VARCHAR(255) NULL,
    payment_method VARCHAR(255) NULL,
    payment_status VARCHAR(255) NULL,
    is_anonymous TINYINT NOT NULL DEFAULT 0,
    is_manual TINYINT NOT NULL DEFAULT 0,
    user_info TEXT,
    created_at DATETIME NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_at DATETIME NULL,
    updated_by BIGINT UNSIGNED NULL
);
```

#### gf_funds

```sql
CREATE TABLE gf_funds (
    ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    updated_at DATETIME NULL,
    updated_by BIGINT UNSIGNED NULL
);
```

#### gf_campaign_collaborators

```sql
CREATE TABLE gf_campaign_collaborators (
    ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    campaign_id BIGINT UNSIGNED NOT NULL,
    collaborator_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL
);
```

#### gf_bookmarks

```sql
CREATE TABLE gf_bookmarks (
    ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    campaign_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL
);
```

#### gf_activities

```sql
CREATE TABLE gf_activities (
    ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(255) NOT NULL,
    entity_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT NULL,
    metadata TEXT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL
);
```

---

## API Reference

### Authentication

All API requests require WordPress authentication and nonce verification:

```javascript
// Headers required for all requests
{
  'X-WP-Nonce': window.growfund.nonce,
  'Content-Type': 'application/json'
}
```

### Base URL

```
/wp-json/growfund/v1
```

### Campaign Endpoints

#### Get Campaigns

```http
GET /campaigns
```

Query Parameters:

- `limit` (int): Number of campaigns per page (default: 20)
- `page` (int): Page number (default: 1)
- `search` (string): Search term
- `status` (string): Campaign status filter
- `author_id` (int): Filter by author ID
- `start_date` (string): Filter by start date
- `end_date` (string): Filter by end date

Response:

```json
{
  "success": true,
  "data": {
    "results": [...],
    "total": 150,
    "count": 20,
    "per_page": 20,
    "current_page": 1,
    "has_more": true
  }
}
```

#### Create Campaign

```http
POST /campaigns
```

Response:

```json
{
  "success": true,
  "data": {
    "id": 123,
    "message": "Campaign created successfully"
  }
}
```

#### Update Campaign

```http
PUT /campaigns/{id}
```

Request Body:

```json
{
  "title": "Campaign Title",
  "description": "Campaign description",
  "story": "Campaign story",
  "goal_amount": 10000,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "category": "1",
  "tags": ["tag1", "tag2"],
  "status": "published"
}
```

#### Delete Campaign

```http
DELETE /campaigns/{id}
```

#### Bulk Actions

```http
PATCH /campaigns/bulk-actions
```

Request Body:

```json
{
  "action": "delete|restore|featured|non-featured",
  "ids": [1, 2, 3],
  "force": false
}
```

### Pledge Endpoints

#### Get Pledges

```http
GET /pledges
```

#### Create Pledge

```http
POST /pledges
```

#### Update Pledge Status

```http
PATCH /pledges/{id}
```

### Donation Endpoints

#### Get Donations

```http
GET /donations
```

#### Create Donation

```http
POST /donations
```

#### Update Donation Status

```http
PATCH /donations/{id}
```

### Analytics Endpoints

#### Get Analytics

```http
GET /analytics/{type}
```

Types:

- `metrics`: Overall metrics
- `revenue-chart`: Revenue chart data
- `top-campaigns`: Top performing campaigns
- `top-backers`: Top backers
- `top-donors`: Top donors
- `revenue-breakdown`: Revenue breakdown

Query Parameters:

- `start_date` (string): Start date for analytics
- `end_date` (string): End date for analytics
- `campaign_id` (int): Filter by specific campaign

### Payment Gateway Endpoints

#### Get Available Gateways

```http
GET /payment-gateways
```

#### Install Gateway

```http
POST /payment-gateways/install
```

#### Configure Gateway

```http
PUT /payment-gateways/{name}
```

### Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

HTTP Status Codes:

- `200`: Success
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ and Yarn
- PHP 7.4+ and Composer
- Git

### Installation

1. **Clone the Repository**

   ```bash
   git clone git@github.com:themeum/growfund.git
   cd growfund
   ```

2. **Start Docker Environment**

   ```bash
   docker-compose up --build -d
   ```

   This starts:

   - WordPress (http://localhost:8081)
   - MariaDB database
   - phpMyAdmin (http://localhost:8181)

3. **Install WordPress**

   - Navigate to http://localhost:8081
   - Complete WordPress installation
   - Install and activate the growfund plugin

4. **Install PHP Dependencies**

   ```bash
   cd wordpress/wp-content/plugins/growfund
   composer install
   ```

5. **Install and Build Frontend**
   ```bash
   cd resources/ts
   yarn install
   yarn dev  # For development
   # OR
   yarn build  # For production
   ```

### Development Workflow

#### Backend Development

1. **File Structure**: Follow PSR-4 autoloading standards
2. **Coding Standards**: Use WordPress Coding Standards
3. **Testing**: Write unit tests for services and controllers
4. **Database Changes**: Create migrations for schema changes

#### Frontend Development

1. **Start Development Server**

   ```bash
   cd resources/ts
   yarn dev
   ```

2. **Code Organization**:

   - Components in `components/`
   - Features in `features/`
   - Utilities in `utils/`
   - Types in `types/`

3. **Styling**: Use Tailwind CSS with shadcn/ui components

4. **State Management**: Use React Query for server state, Context for app state

### Gateway Development

1. **Start Gateway Server**

   ```bash
   cd gateway-server
   npm install
   npm run dev
   ```

2. **Create New Gateway**

   ```bash
   # Copy existing gateway as template
   cp -r gateways/growfund-gateway-stripe gateways/growfund-gateway-newgateway

   # Update manifest.json and implementation
   # Build the gateway
   npm run build:gateways
   ```

3. **Sync to WordPress**
   ```bash
   # Watch for changes and sync to WordPress
   npm run sync:gateways
   ```

### Environment Configuration

#### WordPress Configuration

```php
// wp-config.php
define('GF_ENV_MODE', 'development');
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

#### Frontend Environment

```typescript
// Available environment variables
declare global {
  const __ENV_MODE__: 'development' | 'production';
  const __PLUGIN_URL__: string;
  const __VERSION__: string;
}
```

### Testing

#### PHP Testing

```bash
# Run PHP CodeSniffer
composer run compat-check

# Custom testing (implement as needed)
phpunit tests/
```

#### TypeScript Testing

```bash
cd resources/ts

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Type checking
yarn typecheck
```

#### Linting

```bash
cd resources/ts

# ESLint
yarn lint
yarn lint:fix
```

---

## Deployment

### Production Build

1. **Build Frontend Assets**

   ```bash
   cd resources/ts
   yarn build
   ```

2. **Optimize PHP**

   ```bash
   composer install --no-dev --optimize-autoloader
   ```

3. **Build Gateway Packages**
   ```bash
   cd gateway-server
   npm run build:gateways
   ```

### Environment Variables

#### Production WordPress Configuration

```php
// wp-config.php
define('GF_ENV_MODE', 'production');
define('WP_DEBUG', false);
define('WP_CACHE', true);
```

### Server Requirements

- **PHP**: 7.4 or higher
- **WordPress**: 5.9 or higher
- **MySQL**: 5.7 or higher / MariaDB 10.3 or higher
- **Memory Limit**: 256MB minimum
- **Max Execution Time**: 300 seconds minimum

### Performance Optimization

1. **Frontend Optimization**:

   - Code splitting with Vite
   - Image optimization
   - Bundle analysis with `yarn build:analyze`

2. **Backend Optimization**:

   - Query optimization
   - Caching strategies
   - Database indexing

3. **Asset Delivery**:
   - CDN integration
   - Gzip compression
   - Browser caching

### Security Considerations

1. **Input Validation**: All user inputs are validated and sanitized
2. **Nonce Verification**: All AJAX/API requests require valid nonces
3. **Capability Checks**: User permissions verified for all operations
4. **SQL Injection Prevention**: Prepared statements and query builder
5. **XSS Prevention**: Output escaping and Content Security Policy

---

## Contributing Guidelines

### Code Standards

#### PHP Standards

- Follow WordPress Coding Standards
- Use PSR-4 autoloading
- Document all public methods
- Write descriptive commit messages

#### TypeScript Standards

- Use strict TypeScript configuration
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries

### Git Workflow

1. **Branch Naming**:

   - `feature/description`
   - `bugfix/description`
   - `hotfix/description`

2. **Commit Messages**:

   ```
   type: Short description

   Longer description if needed

   Closes #issue-number
   ```

3. **Pull Request Process**:
   - Create feature branch from `main`
   - Implement changes with tests
   - Update documentation
   - Submit PR with description
   - Address review feedback
   - Squash and merge

### Code Review Checklist

#### Backend (PHP)

- [ ] Follows WordPress coding standards
- [ ] Proper error handling
- [ ] Security considerations addressed
- [ ] Database queries optimized
- [ ] Documentation updated

#### Frontend (TypeScript)

- [ ] TypeScript strict mode compliant
- [ ] Responsive design implemented
- [ ] Accessibility features included
- [ ] Performance considerations
- [ ] Error boundaries implemented

### Documentation

- Update relevant documentation for any changes
- Include inline code comments for complex logic
- Update API documentation for endpoint changes
- Add examples for new features

### Issue Reporting

When reporting issues:

1. Provide clear reproduction steps
2. Include environment details
3. Attach relevant logs/screenshots
4. Suggest potential solutions if possible

---

## Conclusion

This documentation provides a comprehensive overview of the Growfund Plugin architecture and development practices. The plugin is built with modern technologies and follows industry best practices for maintainability, scalability, and security.

For additional support or questions:

- Create issues in the repository
- Review existing documentation
- Consult inline code comments
- Reach out to the development team

The plugin's modular architecture enables easy extension and customization while maintaining code quality and performance standards.
