export interface ManifestField {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'switch' | 'email' | 'number' | 'password';
}

export interface ManifestConfig {
  label: string;
  logo: string;
}

export interface GatewayManifest {
  name: string;
  download_url: string;
  type: string;
  supports_future_payments: boolean;
  frontend_script: string;
  form_file: string;
  class: string;
  config: ManifestConfig;
  is_installed: boolean;
  is_enabled: boolean;
  fields: ManifestField[];
}

export interface ProcessedGateway extends GatewayManifest {
  config: ManifestConfig & {
    logo: string; // Will contain full URL after processing
  };
  download_url: string; // Will contain full URL after processing
}

export interface ApiResponse {
  message?: string;
  endpoints?: Record<string, string>;
  error?: string;
}

export interface HealthCheckResponse extends ApiResponse {
  message: string;
  endpoints: {
    download: string;
    'payment-gateways': string;
    'static-assets': string;
  };
}
