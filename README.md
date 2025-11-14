# Growfund Plugin

A comprehensive WordPress plugin for growfund and donation management with dual-mode operation, modern React admin interface, and extensible payment gateway system.

## 🌟 Features

- **Dual-Mode Operation**: Campaign mode (growfund/pledge-based) and Donation mode (direct donations)
- **Multi-Role System**: Administrator, Fundraiser, Backer, Donor roles with specific capabilities
- **Modern Admin Interface**: Built with React 19.1, TypeScript, and Tailwind CSS
- **Payment Gateway Integration**: Extensible system supporting Stripe, PayPal, and custom gateways
- **Campaign Management**: Full-featured creation, collaboration, and status management
- **Analytics & Reporting**: Comprehensive revenue tracking and performance metrics
- **Reward System**: Campaign rewards with shipping calculation and management
- **Email Notifications**: 40+ email types with customizable templates
- **PDF Receipts**: Automated receipt generation for donations and pledges
- **User Dashboards**: Role-specific interfaces for all user types

## 🛠 Technology Stack

- **Backend**: WordPress, PHP 7.4+, MySQL/MariaDB
- **Frontend**: React 19.1, TypeScript, Tailwind CSS, Radix UI
- **Build Tools**: Vite, ESLint, PostCSS
- **State Management**: TanStack Query (React Query)
- **Payment Processing**: Extensible gateway architecture

## 📋 Requirements

- **PHP**: 7.4 or higher
- **WordPress**: 5.9 or higher
- **MySQL**: 5.7+ or MariaDB 10.3+
- **Node.js**: 18+ (for development)
- **Memory Limit**: 256MB minimum

## 🚀 Quick Start

### Development Setup

1. **Clone the Repository**

   ```bash
   git clone git@github.com:themeum/growfund.git
   cd growfund
   ```

2. **Start Docker Environment**

   ```bash
   docker-compose up --build -d
   ```

3. **Install WordPress**

   - Navigate to http://localhost:8081
   - Complete WordPress installation
   - Activate the growfund plugin

4. **Install Dependencies**

   ```bash
   # PHP dependencies
   cd wordpress/wp-content/plugins/growfund
   composer install

   # Frontend dependencies
   cd resources/ts
   yarn install
   yarn dev
   ```

5. **PHPCS for development**

   - Install `haruncox.php-sniffer-tool` extension in vscode
   - Search with `@ext:haruncox.php-sniffer-tool` in vscode settings and find `PHP Sniffer: Executables Folder`
   - Add `.vendor/bin` as `PHP Sniffer: Executables Folder`
   - Use `"editor.defaultFormatter": "haruncox.php-sniffer-tool"` as php default formatter.

6. **PHPCS Manual Checking**

   - Run `composer cs` to check issues
   - Run `composer fix-cs` for fixing issues automatically.

7. **Access the Application**
   - WordPress: http://localhost:8081
   - phpMyAdmin: http://localhost:8181

### Production Installation

1. Upload the plugin to your WordPress site
2. Install PHP dependencies: `composer install --no-dev`
3. Build frontend assets: `yarn build`
4. Activate the plugin in WordPress admin

## 📚 Documentation

- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Comprehensive technical documentation
- **[API Reference](docs/DEVELOPER_GUIDE.md#api-reference)** - REST API documentation
- **[Payment Gateways](docs/DEVELOPER_GUIDE.md#payment-gateway-system)** - Gateway development guide

## 🏗 Architecture

The plugin follows a modern architecture with clear separation of concerns:

- **React SPA Frontend** with TypeScript and modern tooling
- **WordPress PHP Backend** with service-oriented architecture
- **Extensible Payment System** with plugin-based gateways
- **Custom Database Tables** for optimized data storage
- **Event-Driven Design** for loose coupling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/DEVELOPER_GUIDE.md#contributing-guidelines) for details.

## 📄 License

This project is licensed under the GPLv2 or later - see the plugin header for details.

## 🐛 Issues & Support

- Create issues in the repository for bugs and feature requests
- Check existing documentation before reporting issues
- Provide detailed reproduction steps for bug reports

---

**Note**: This README provides basic installation instructions. For comprehensive development documentation, architecture details, and API reference, please refer to the [Developer Guide](docs/DEVELOPER_GUIDE.md).


### Changes
- Change 1