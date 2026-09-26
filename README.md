# Kumar Drag Actions

A Magento 2 frontend module that adds **drag-and-drop and swipe-based product actions** without directly modifying Magento core templates.

The module provides a configurable floating product-action interface that allows customers to interact with products through desktop drag interactions and mobile swipe gestures.

Supported product actions include:

* Add to Cart
* Add to Wishlist
* Add to Compare
* Save for Later
* Remove from Cart

The module also provides custom configuration flows for products that require additional configuration, including:

* Configurable products
* Bundle products
* Grouped products

The module is designed as a standalone Magento 2 extension and uses Magento's existing frontend architecture, controllers, product models, cart functionality, wishlist functionality, and configuration system.

* <img width="345" height="366" alt="image" src="https://github.com/user-attachments/assets/b379496f-91c4-4c0a-a72d-c217f91b9090" />
* <img width="1061" height="942" alt="image" src="https://github.com/user-attachments/assets/4b37a881-02b8-4242-946e-7cebe80a9eb5" />
---

## Table of Contents

* [Overview](#overview)
* [Goals](#goals)
* [Key Features](#key-features)
* [How It Works](#how-it-works)
* [Supported Actions](#supported-actions)
* [Supported Product Types](#supported-product-types)
* [Product Action Flows](#product-action-flows)
* [Simple Product Flow](#simple-product-flow)
* [Configurable Product Flow](#configurable-product-flow)
* [Bundle Product Flow](#bundle-product-flow)
* [Grouped Product Flow](#grouped-product-flow)
* [Cart Remove Flow](#cart-remove-flow)
* [Wishlist Flow](#wishlist-flow)
* [Compare Flow](#compare-flow)
* [Save for Later Flow](#save-for-later-flow)
* [Desktop Drag Interaction](#desktop-drag-interaction)
* [Mobile Swipe Interaction](#mobile-swipe-interaction)
* [Full Page Loading Overlay](#full-page-loading-overlay)
* [Admin Configuration](#admin-configuration)
* [Installation](#installation)
* [Manual Installation](#manual-installation)
* [Composer Installation](#composer-installation)
* [Magento Setup](#magento-setup)
* [Module Configuration](#module-configuration)
* [Configuration Reference](#configuration-reference)
* [Frontend Architecture](#frontend-architecture)
* [Backend Architecture](#backend-architecture)
* [Module Structure](#module-structure)
* [Important Files](#important-files)
* [Magento Core Compatibility](#magento-core-compatibility)
* [Dependency Handling](#dependency-handling)
* [AJAX Architecture](#ajax-architecture)
* [Security](#security)
* [Caching](#caching)
* [Performance Considerations](#performance-considerations)
* [Accessibility](#accessibility)
* [Responsive Behavior](#responsive-behavior)
* [Known Limitations](#known-limitations)
* [Troubleshooting](#troubleshooting)
* [Development](#development)
* [Testing Checklist](#testing-checklist)
* [Production Deployment](#production-deployment)
* [Customization](#customization)
* [Future Improvements](#future-improvements)
* [Contributing](#contributing)
* [Bug Reports](#bug-reports)
* [License](#license)
* [Author](#author)
* [Disclaimer](#disclaimer)

---

# Overview

`Kumar_DragActions` is a Magento 2 frontend extension that introduces an alternative way for customers to perform common product actions.

Instead of relying exclusively on traditional buttons and links, customers can interact with a product using a floating action interface.

The module is intended to provide an interaction layer that can be added to an existing Magento storefront without replacing or modifying Magento's original product templates.

The implementation is based on Magento's extension architecture.

The module uses:

* Layout XML
* Custom Blocks
* Custom PHTML templates
* RequireJS
* JavaScript
* CSS
* Magento Controllers
* Magento Product Repository
* Magento Cart
* Magento Wishlist
* Magento Compare functionality
* Magento Admin Configuration
* Magento ACL

---

# Goals

The main goals of the module are:

1. Add drag-based product actions.
2. Add mobile-friendly swipe interaction.
3. Avoid modifying Magento core templates.
4. Keep functionality isolated inside a custom Magento module.
5. Allow administrators to enable or disable the complete module.
6. Allow administrators to enable or disable individual actions.
7. Support products that require configuration.
8. Provide configurable and bundle product flows.
9. Use Magento's existing backend functionality where possible.
10. Keep the module reusable across Magento projects.
11. Make the module suitable for GitHub and Composer-based distribution.

---

# Key Features

## Product Actions

The module supports the following actions:

* Add to Cart
* Wishlist
* Compare
* Save for Later
* Remove from Cart

Each action can be independently enabled or disabled from the Magento Admin.

---

## Desktop Drag

Desktop users can interact with the product action interface using drag interactions.

The desktop interaction can be enabled or disabled from:

```text
Stores
→ Configuration
→ Kumar
→ Drag Actions
→ Interaction
→ Desktop Drag
```

---

## Mobile Swipe

Mobile devices can use swipe-based interaction.

The mobile interaction can be enabled or disabled independently from desktop drag.

Configuration:

```text
Stores
→ Configuration
→ Kumar
→ Drag Actions
→ Interaction
→ Mobile Swipe
```

---

## Product Configuration

The module recognizes products that require additional configuration.

For example:

```text
Simple Product
     ↓
Direct Action
```

Whereas:

```text
Configurable Product
     ↓
Configuration Modal
     ↓
Attribute Selection
     ↓
Quantity
     ↓
Action
```

and:

```text
Bundle Product
     ↓
Configuration Modal
     ↓
Bundle Options
     ↓
Quantity
     ↓
Action
```

---

## Admin Configuration

The complete module can be controlled from Magento Admin.

Configuration includes:

* Module enable/disable
* Add to Cart enable/disable
* Wishlist enable/disable
* Compare enable/disable
* Save for Later enable/disable
* Remove enable/disable
* Desktop Drag enable/disable
* Mobile Swipe enable/disable
* Button color
* Button text/icon color

---

## Full Page Loading State

AJAX operations display a full-page loading overlay.

The loader is intentionally implemented outside the floating action panel.

This ensures that the loading state covers the complete viewport instead of being restricted to the dimensions of the floating Drag Actions component.

Example flow:

```text
Customer starts action
        ↓
Full-page loader appears
        ↓
AJAX request
        ↓
Magento processes action
        ↓
Response received
        ↓
Loader disappears
        ↓
UI updated
```

---

# How It Works

The module is injected through Magento's layout system.

No Magento core PHTML template needs to be modified.

High-level architecture:

```text
Magento Storefront
       │
       │
       ▼
Magento Layout XML
       │
       ▼
Kumar_DragActions Block
       │
       ▼
Custom PHTML
       │
       ├── Floating Action Button
       ├── Action Panel
       ├── Configuration Modal
       └── Full Page Loader
       │
       ▼
RequireJS
       │
       ▼
Custom JavaScript
       │
       ▼
AJAX Controller
       │
       ▼
Magento Services / Models
       │
       ├── Cart
       ├── Wishlist
       ├── Compare
       └── Product Configuration
```

---

# Supported Actions

| Action         | Description                       | Configuration Required    |
| -------------- | --------------------------------- | ------------------------- |
| Cart           | Adds product to cart              | Depending on product type |
| Wishlist       | Adds product to customer wishlist | Customer login            |
| Compare        | Adds product to Magento Compare   | No                        |
| Save for Later | Persists product for later use    | Customer login            |
| Remove         | Removes cart item                 | Cart item ID              |

---

# Supported Product Types

The current implementation supports the following product types at the interaction level:

| Product Type | Support                          |
| ------------ | -------------------------------- |
| Simple       | Yes                              |
| Configurable | Yes                              |
| Bundle       | Yes                              |
| Grouped      | Basic handling                   |
| Virtual      | Depends on product configuration |
| Downloadable | Depends on product configuration |

Product types with custom third-party option systems may require additional integration.

---

# Product Action Flows

## Simple Product

Simple products can generally be processed without opening a configuration modal.

```text
Product
   ↓
Drag / Swipe
   ↓
Select Action
   ↓
AJAX
   ↓
Magento Controller
   ↓
Action Completed
```

---

# Simple Product Flow

For a simple product:

```text
Customer
   │
   ▼
Product
   │
   ▼
Drag Actions
   │
   ├── Cart
   ├── Wishlist
   ├── Compare
   └── Save for Later
```

The requested action is passed to the backend controller.

The backend validates the action and product before processing it.

---

# Configurable Product Flow

Configurable products require a specific child product configuration before an action such as Add to Cart can be completed.

The module opens a custom configuration interface.

Example:

```text
Configurable Product
        │
        ▼
Drag Action
        │
        ▼
Configuration Modal
        │
        ├── Attribute 1
        ├── Attribute 2
        ├── Attribute 3
        │
        ▼
Quantity
        │
        ▼
Continue
        │
        ▼
AJAX
        │
        ▼
Magento Product Action
```

The configuration interface is rendered through:

```text
view/frontend/templates/product/configure.phtml
```

The module does not replace Magento's original configurable product page.

---

# Configurable Product Attributes

Configurable product attributes are loaded from Magento's configurable product data.

The configuration interface can display attribute selections such as:

```text
Color
Size
Material
Capacity
```

depending on the product configuration.

The selected values are submitted using Magento-compatible `super_attribute` parameters.

Example:

```text
super_attribute[93] = 12
super_attribute[144] = 8
```

The actual attribute IDs and values depend on the Magento catalog.

---

# Bundle Product Flow

Bundle products can contain multiple options and selections.

The module exposes bundle options through the custom configuration interface.

Example:

```text
Bundle Product
       │
       ▼
Drag Action
       │
       ▼
Bundle Configuration
       │
       ├── Option 1
       │      ├── Selection A
       │      └── Selection B
       │
       ├── Option 2
       │      ├── Selection A
       │      └── Selection B
       │
       ▼
Quantity
       │
       ▼
Continue
       │
       ▼
AJAX
       │
       ▼
Magento
```

Bundle selections are submitted using Magento-compatible bundle option parameters.

Example:

```text
bundle_option[12] = 45
bundle_option[13] = 51
```

The actual IDs depend on the Magento catalog.

---

# Grouped Product Flow

Grouped products are recognized by the module.

Grouped products have a different quantity model because multiple associated products can be configured independently.

The current module provides basic handling and does not attempt to completely reproduce every Magento grouped-product configuration scenario.

Stores requiring advanced grouped-product support may extend the configuration block and template.

---

# Cart Remove Flow

The Remove action is intended for cart items.

A product ID alone is not enough to identify a specific cart line.

The module therefore requires a valid cart item ID.

```text
Cart Item
    │
    ▼
Drag / Swipe
    │
    ▼
Remove
    │
    ▼
Cart Item ID
    │
    ▼
AJAX
    │
    ▼
Magento Cart
    │
    ▼
Item Removed
```

This is different from catalog product actions because the operation targets a cart item rather than a catalog product.

---

# Wishlist Flow

Wishlist functionality uses Magento Wishlist functionality.

For customer-specific wishlist operations, the customer needs to be authenticated.

The flow is:

```text
Product
   ↓
Wishlist Action
   ↓
Authentication Check
   ↓
Magento Wishlist
   ↓
Product Added
```

If the customer is not authenticated, the module returns an appropriate response instead of silently failing.

---

# Compare Flow

The Compare action uses Magento's native product compare functionality.

The module does not create a separate compare storage mechanism.

Flow:

```text
Product
   ↓
Compare
   ↓
Magento Compare Helper
   ↓
Compare Product Added
```

---

# Save for Later Flow

The current implementation provides Save for Later functionality using Magento Wishlist-based persistence.

This means that the current implementation should be understood as:

```text
Save for Later
       ↓
Customer-specific persistence
       ↓
Wishlist-based storage
```

It is not intended to be a complete replacement for a dedicated cart-based "Move to Save for Later" system.

A dedicated persistence layer can be implemented in a future version.

---

# Desktop Drag Interaction

When desktop drag interaction is enabled, customers can interact with the action interface using mouse-based drag behavior.

Configuration:

```text
Stores
→ Configuration
→ Kumar
→ Drag Actions
→ Interaction
→ Desktop Drag
```

Possible states:

```text
Enabled
Disabled
```

When disabled, the module does not initialize the desktop drag interaction.

---

# Mobile Swipe Interaction

Mobile devices can use touch-based swipe interaction.

Configuration:

```text
Stores
→ Configuration
→ Kumar
→ Drag Actions
→ Interaction
→ Mobile Swipe
```

This allows the module to support a different interaction model for touch devices.

---

# Full Page Loading Overlay

The module displays a loading overlay while an AJAX action is being processed.

The loader is attached to the page-level DOM rather than being constrained by the floating action component.

Conceptually:

```text
┌──────────────────────────────────────────────┐
│                                              │
│             FULL PAGE OVERLAY                │
│                                              │
│                    ◉                         │
│                 Loading                      │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

This prevents users from interacting with other page elements while an action is being processed.

The loader is automatically hidden when the AJAX request finishes.

Both success and failure states are handled so that the loader does not remain visible after an AJAX request completes.

---

# Admin Configuration

Navigate to:

```text
Stores
→ Configuration
→ Kumar
→ Drag Actions
```

The module contains multiple configuration groups.

---

## General

### Enable Drag Actions

Controls whether the module is enabled.

Possible values:

```text
Yes
No
```

When disabled, the frontend Drag Actions component is not rendered.

---

# Actions

The Actions section contains independent controls.

## Drag to Cart

Controls the Add to Cart action.

```text
Yes / No
```

---

## Drag to Wishlist

Controls the Wishlist action.

```text
Yes / No
```

---

## Drag to Compare

Controls the Compare action.

```text
Yes / No
```

---

## Drag to Save for Later

Controls Save for Later.

```text
Yes / No
```

---

## Drag to Remove

Controls the Remove action.

```text
Yes / No
```

---

# Interaction

## Desktop Drag

Controls desktop drag interaction.

```text
Yes / No
```

---

## Mobile Swipe

Controls mobile swipe interaction.

```text
Yes / No
```

---

# Appearance

## Button Color

Controls the primary action button color.

Example:

```text
#000000
```

---

## Button Text/Icon Color

Controls the text and icon color.

Example:

```text
#FFFFFF
```

---

# Configuration Reference

The configuration paths are:

```text
kumar_dragactions/general/enabled

kumar_dragactions/actions/cart

kumar_dragactions/actions/wishlist

kumar_dragactions/actions/compare

kumar_dragactions/actions/save_later

kumar_dragactions/actions/remove

kumar_dragactions/interaction/desktop_drag

kumar_dragactions/interaction/mobile_swipe

kumar_dragactions/appearance/button_color

kumar_dragactions/appearance/button_text_color
```

---

# Frontend Architecture

The frontend is implemented using Magento's standard frontend architecture.

Main components:

```text
Layout XML
    ↓
Block
    ↓
PHTML
    ↓
RequireJS
    ↓
JavaScript
    ↓
AJAX
    ↓
Controller
```

---

# Layout Integration

The module uses:

```text
view/frontend/layout/default.xml
```

The module injects its frontend block through the Magento layout system.

The implementation does not require modifying Magento core product templates.

The module can therefore be installed independently from Magento's core template files.

---

# Block Layer

Main frontend block:

```text
Block/DragActions.php
```

The block is responsible for exposing:

* Configuration state
* Action state
* Interaction state
* Action URL
* Configuration URL
* Form key
* Appearance configuration

Product configuration uses:

```text
Block/Product/Configure.php
```

This block provides product-specific configuration information.

---

# Template Layer

Main template:

```text
view/frontend/templates/drag-actions.phtml
```

Product configuration template:

```text
view/frontend/templates/product/configure.phtml
```

The templates are completely owned by the custom module.

Magento core PHTML files do not need to be edited.

---

# JavaScript Architecture

Main JavaScript:

```text
view/frontend/web/js/drag-actions.js
```

Drag source handling:

```text
view/frontend/web/js/drag-source.js
```

The module uses Magento RequireJS initialization.

The main frontend component is initialized through:

```text
text/x-magento-init
```

---

# CSS Architecture

Frontend styling is located under:

```text
view/frontend/web/css/drag-actions.css
```

The module uses its own CSS namespace:

```text
kumar-
```

Examples:

```text
kumar-drag-actions
kumar-drag-actions__trigger
kumar-drag-actions__panel
kumar-drag-action
kumar-drag-actions__modal
kumar-drag-actions-loader
```

This reduces the chance of accidentally targeting unrelated storefront components.

---

# Backend Architecture

The module provides two main controllers.

## Action Controller

```text
Controller/Action/Execute.php
```

This controller processes requested actions.

Supported action identifiers include:

```text
cart
wishlist
compare
save_later
remove
```

---

## Product Configuration Controller

```text
Controller/Product/Configure.php
```

This controller returns the configuration interface for products requiring additional configuration.

The frontend requests configuration through AJAX.

Example request concept:

```text
dragactions/product/configure
```

with parameters such as:

```text
product
action
```

---

# Module Structure

```text
Kumar_DragActions/
│
├── Block/
│   ├── DragActions.php
│   └── Product/
│       └── Configure.php
│
├── Controller/
│   ├── Action/
│   │   └── Execute.php
│   │
│   └── Product/
│       └── Configure.php
│
├── Helper/
│   └── Data.php
│
├── etc/
│   ├── acl.xml
│   ├── config.xml
│   ├── module.xml
│   ├── routes.xml
│   │
│   └── adminhtml/
│       └── system.xml
│
├── view/
│   └── frontend/
│       ├── layout/
│       │   └── default.xml
│       │
│       ├── templates/
│       │   ├── drag-actions.phtml
│       │   └── product/
│       │       └── configure.phtml
│       │
│       ├── web/
│       │   ├── css/
│       │   │   └── drag-actions.css
│       │   │
│       │   └── js/
│       │       ├── drag-actions.js
│       │       └── drag-source.js
│       │
│       └── requirejs-config.js
│
├── composer.json
├── registration.php
├── README.md
├── LICENSE
└── .gitignore
```

---

# Important Files

| File                               | Purpose                              |
| ---------------------------------- | ------------------------------------ |
| `registration.php`                 | Registers the Magento module         |
| `etc/module.xml`                   | Defines the module                   |
| `etc/config.xml`                   | Defines default configuration values |
| `etc/adminhtml/system.xml`         | Adds Admin configuration             |
| `etc/acl.xml`                      | Defines Admin permissions            |
| `etc/frontend/routes.xml`          | Defines frontend routes              |
| `Block/DragActions.php`            | Main frontend block                  |
| `Block/Product/Configure.php`      | Product configuration block          |
| `Controller/Action/Execute.php`    | Processes product actions            |
| `Controller/Product/Configure.php` | Returns configuration UI             |
| `Helper/Data.php`                  | Reads module configuration           |
| `view/frontend/layout/default.xml` | Injects module into frontend         |
| `drag-actions.phtml`               | Main frontend markup                 |
| `configure.phtml`                  | Product configuration markup         |
| `drag-actions.js`                  | Main interaction logic               |
| `drag-source.js`                   | Drag source behavior                 |
| `drag-actions.css`                 | Frontend styling                     |
| `requirejs-config.js`              | RequireJS configuration              |

---

# Magento Core Compatibility

One of the main architectural goals is to avoid modifying Magento core templates.

The module uses:

```text
Custom Module
     ↓
Magento Layout
     ↓
Custom Block
     ↓
Custom Template
```

rather than:

```text
Magento Core Template
     ↓
Direct Modification
```

This makes the implementation easier to maintain when Magento is upgraded.

---

# Dependency Handling

The module checks whether required Magento functionality is available before exposing related actions.

Examples:

```text
Cart
→ Magento_Checkout

Wishlist
→ Magento_Wishlist

Compare
→ Magento_Catalog

Remove
→ Magento_Checkout
```

This prevents unavailable functionality from being exposed unnecessarily.

The module also checks relevant configuration where applicable.

---

# AJAX Architecture

The module uses AJAX for action processing.

General request flow:

```text
Frontend
   │
   ▼
JavaScript
   │
   ▼
AJAX POST
   │
   ▼
Magento Controller
   │
   ▼
Validation
   │
   ▼
Magento Service / Model
   │
   ▼
JSON Response
   │
   ▼
Frontend
```

Example response:

```json
{
    "success": true,
    "message": "Product added to cart."
}
```

Error responses are returned in a structured JSON format.

---

# Form Key Validation

Action requests use Magento's form key validation.

The backend validates the request before performing state-changing operations.

This provides an additional layer of protection against invalid or forged requests.

---

# Security

The module follows Magento's standard request and backend architecture.

Security-related considerations include:

* Form key validation
* Product validation
* Action validation
* Customer authentication checks
* Magento ACL for Admin configuration
* Escaping frontend output
* Avoiding direct database manipulation
* Using Magento services/models where possible

Frontend output is escaped using Magento's escaping mechanisms.

---

# Customer Authentication

Some operations are customer-specific.

For example:

```text
Wishlist
Save for Later
```

require a customer context.

When the customer is not authenticated, the module returns an appropriate message.

---

# Caching

The module's main frontend block is configured to avoid stale state caused by store configuration and request-specific interaction data.

After changing Admin configuration, flush Magento cache:

```bash
php bin/magento cache:flush
```

If JavaScript or CSS changes are not visible, static content may also need to be redeployed.

---

# Performance Considerations

The module attempts to keep the initial frontend implementation lightweight.

The architecture separates:

* HTML
* CSS
* JavaScript
* AJAX configuration
* Backend action processing

Product configuration UI is requested when required rather than rendering every possible configuration interface on every page.

This helps avoid unnecessary HTML being added to the initial page.

---

# Responsive Behavior

The module is designed for both desktop and mobile interaction.

Desktop:

```text
Mouse
↓
Drag
↓
Action
```

Mobile:

```text
Touch
↓
Swipe
↓
Action
```

The module's CSS uses responsive rules for smaller viewport sizes.

---

# Accessibility

The module includes accessibility-oriented attributes such as:

```text
aria-label
aria-hidden
aria-live
role="dialog"
aria-modal
aria-labelledby
```

The configuration modal also provides a close control.

Further accessibility improvements can be added in future versions, particularly around:

* Keyboard-only interaction
* Focus trapping
* Focus restoration
* Screen-reader action announcements
* Reduced-motion support

---

# Installation

## Requirements

Recommended requirements:

* Magento Open Source 2.4.x
* Adobe Commerce 2.4.x
* PHP 8.1+
* Magento Catalog
* Magento Checkout
* Magento Customer
* Magento Wishlist

The exact supported version depends on the Magento APIs used by the installation.

Always test the module against the target Magento version before production deployment.

---

# Manual Installation

Copy the module into:

```text
app/code/Kumar/DragActions
```

Expected path:

```text
app/code/Kumar/DragActions/registration.php
```

Then enable the module:

```bash
php bin/magento module:enable Kumar_DragActions
```

Run:

```bash
php bin/magento setup:upgrade
```

Flush cache:

```bash
php bin/magento cache:flush
```

---

# Production Installation

For production mode:

```bash
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento setup:static-content:deploy -f
php bin/magento cache:flush
```

---

# Composer Installation

If the package is published to a Composer-compatible repository:

```bash
composer require kumar/module-drag-actions
```

Then:

```bash
php bin/magento module:enable Kumar_DragActions
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento cache:flush
```

---

# Verify Installation

Check module status:

```bash
php bin/magento module:status Kumar_DragActions
```

Expected:

```text
Kumar_DragActions
```

The Admin configuration should then be available at:

```text
Stores
→ Configuration
→ Kumar
→ Drag Actions
```

---

# Development

Clone the repository:

```bash
git clone <repository-url>
```

Copy the module into:

```text
app/code/Kumar/DragActions
```

Enable it:

```bash
php bin/magento module:enable Kumar_DragActions
```

Run:

```bash
php bin/magento setup:upgrade
php bin/magento cache:flush
```

For development:

```bash
php bin/magento deploy:mode:set developer
```

---

# Clearing Generated Files

If Magento reports dependency injection or generated class errors:

```bash
rm -rf generated/code/*
rm -rf generated/metadata/*
```

Then:

```bash
php bin/magento setup:di:compile
php bin/magento cache:flush
```

---

# Static Content

If CSS or JavaScript changes are not visible:

```bash
php bin/magento cache:flush
```

For production mode:

```bash
php bin/magento setup:static-content:deploy -f
```

Then perform a browser hard refresh.

---

# Troubleshooting

## Module Not Visible

Check:

```bash
php bin/magento module:status Kumar_DragActions
```

Then:

```bash
php bin/magento setup:upgrade
php bin/magento cache:flush
```

---

## Admin Configuration Missing

Check:

```text
Stores
→ Configuration
→ Kumar
→ Drag Actions
```

If it is not visible:

1. Verify `etc/adminhtml/system.xml`.
2. Verify `etc/acl.xml`.
3. Verify the module is enabled.
4. Flush cache.
5. Log out and back into Magento Admin if ACL permissions were changed.

---

## Dependency Injection Error

Clear generated classes:

```bash
rm -rf generated/code/*
rm -rf generated/metadata/*
```

Then:

```bash
php bin/magento setup:di:compile
```

---

## JavaScript Not Loading

Check:

```text
Browser DevTools
→ Console
```

and:

```text
Browser DevTools
→ Network
→ JS
```

Verify that:

```text
Kumar_DragActions/js/drag-actions
```

is loaded.

Then clear:

```bash
php bin/magento cache:flush
```

---

## CSS Not Updating

Run:

```bash
php bin/magento cache:flush
```

If production mode is enabled:

```bash
php bin/magento setup:static-content:deploy -f
```

Then hard refresh the browser.

---

## AJAX Request Fails

Check:

```text
Browser DevTools
→ Network
→ XHR / Fetch
```

Inspect:

* Request URL
* Request method
* Request payload
* Form key
* Product ID
* Action
* Response status
* JSON response

Also check Magento logs:

```text
var/log/system.log
var/log/exception.log
```

---

# Testing Checklist

Before publishing a release, test the following.

## Module

* [ ] Module enables successfully
* [ ] Module disables successfully
* [ ] Admin configuration loads
* [ ] ACL works
* [ ] Configuration values save
* [ ] Configuration values are read correctly

---

## Actions

### Cart

* [ ] Simple product
* [ ] Configurable product
* [ ] Bundle product
* [ ] Quantity
* [ ] AJAX response
* [ ] Cart refresh

### Wishlist

* [ ] Logged-in customer
* [ ] Guest customer
* [ ] Simple product
* [ ] Configurable product
* [ ] Correct configuration payload

### Compare

* [ ] Simple product
* [ ] Compare action
* [ ] Magento compare state

### Save for Later

* [ ] Logged-in customer
* [ ] Product persistence
* [ ] Error handling

### Remove

* [ ] Cart item
* [ ] Valid item ID
* [ ] Successful removal
* [ ] Cart refresh

---

# Configurable Product Testing

Test:

* [ ] Configuration modal opens
* [ ] Product name displayed
* [ ] Attributes displayed
* [ ] Attribute labels displayed
* [ ] Options displayed
* [ ] Required fields validated
* [ ] Quantity field works
* [ ] Cart action works
* [ ] Wishlist action works
* [ ] Save for Later action works
* [ ] Invalid configuration is handled

---

# Bundle Product Testing

Test:

* [ ] Bundle modal opens
* [ ] Bundle options displayed
* [ ] Required options displayed
* [ ] Optional options displayed
* [ ] Selections displayed
* [ ] Required option validation
* [ ] Quantity field works
* [ ] Add to Cart works
* [ ] Invalid selection is handled

---

# Responsive Testing

Test on:

### Desktop

* [ ] Chrome
* [ ] Firefox
* [ ] Edge
* [ ] Safari where applicable

### Mobile

* [ ] Android Chrome
* [ ] iOS Safari
* [ ] Small viewport
* [ ] Large viewport
* [ ] Touch interaction

---

# Browser Console Testing

Before publishing a release, check:

```text
Console
```

for:

* JavaScript errors
* RequireJS errors
* AJAX errors
* CSP errors
* Mixed content warnings

---

# Production Deployment

Before production deployment:

1. Test on staging.
2. Verify all Admin configuration.
3. Verify all actions.
4. Test simple products.
5. Test configurable products.
6. Test bundle products.
7. Test cart removal.
8. Test logged-in customer flows.
9. Test guest flows.
10. Check browser console.
11. Check Magento logs.
12. Deploy static content.
13. Compile dependency injection.
14. Flush cache.
15. Perform final smoke test.

Recommended production commands:

```bash
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento setup:static-content:deploy -f
php bin/magento cache:flush
```

---

# Customization

The module is intentionally separated into independent layers so developers can customize it without modifying Magento core.

## Frontend Markup

Modify:

```text
view/frontend/templates/drag-actions.phtml
```

---

## Product Configuration UI

Modify:

```text
view/frontend/templates/product/configure.phtml
```

---

## JavaScript

Modify:

```text
view/frontend/web/js/drag-actions.js
```

---

## Drag Source

Modify:

```text
view/frontend/web/js/drag-source.js
```

---

## Styling

Modify:

```text
view/frontend/web/css/drag-actions.css
```

---

## Admin Configuration

Modify:

```text
etc/adminhtml/system.xml
```

Default values:

```text
etc/config.xml
```

---

# Extending the Module

The module can be extended using standard Magento mechanisms.

Possible extension approaches include:

* Plugins
* Observers
* Layout XML
* RequireJS mixins
* Custom blocks
* Custom controllers
* Custom templates
* Service classes

Avoid modifying the module's core files directly when building project-specific functionality if the module is installed through Composer.

Instead, consider creating a separate integration module.

Example:

```text
Kumar_DragActions
        +
Kumar_DragActionsCustom
```

This keeps the base module reusable.

---

# Third-Party Theme Compatibility

Magento themes can modify:

* Product card markup
* Product forms
* Cart markup
* JavaScript initialization
* CSS
* RequireJS mappings

Therefore, third-party themes may require additional integration.

The module attempts to keep its own selectors namespaced under:

```text
kumar-
```

to reduce CSS conflicts.

However, complete compatibility with every third-party Magento theme cannot be guaranteed.

---

# Third-Party Extension Compatibility

Third-party extensions may modify:

* Add-to-cart behavior
* Configurable product selection
* Bundle configuration
* Wishlist
* Compare
* Cart item markup
* Customer-data sections

Such extensions may require custom integration.

---

# Known Limitations

## Save for Later

The current implementation uses Wishlist-based persistence.

A dedicated cart save-for-later system is not currently implemented.

---

## Grouped Products

Grouped products have more complex quantity handling because multiple associated products may have independent quantities.

The current implementation provides basic grouped-product handling.

Advanced grouped-product configuration may require additional implementation.

---

## Complex Custom Options

Products using third-party custom option systems may require additional handling.

---

## Cart Item Identification

Remove requires a valid cart item ID.

A catalog product ID cannot safely replace a cart item ID because the same product can appear in different cart lines.

---

## Custom Themes

Highly customized themes may require selector or integration changes.

---

# Future Improvements

Potential future releases may include:

## Save for Later

* Dedicated database table
* Dedicated customer collection
* Move cart item to Save for Later
* Move Save for Later item back to cart
* Dedicated customer-data section

---

## Product Configuration

* Native configurable product JSON configuration
* Better swatch support
* Dynamic dependent attribute validation
* Custom options
* Downloadable products
* Virtual products
* Advanced grouped product support

---

## UX

* Drag animation customization
* Swipe threshold configuration
* Action-specific animation
* Haptic feedback support where available
* Better mobile gestures
* Reduced motion support
* Keyboard accessibility

---

## Admin

Possible future settings:

```text
Swipe Threshold
Drag Distance
Animation Duration
Panel Position
Panel Size
Border Radius
Icon Size
Loader Style
Loader Text
```

---

## Developer Features

Potential future additions:

* Magento events
* Extension points
* JavaScript events
* PHP service contracts
* API support
* Automated unit tests
* Integration tests
* MFTF coverage
* CI/CD
* PHPStan
* PHPCS
* Magento Coding Standard validation

---

# Contributing

Contributions are welcome.

Before submitting a contribution:

1. Fork the repository.
2. Create a feature branch.
3. Make the required changes.
4. Follow Magento coding standards.
5. Test the module.
6. Verify existing functionality.
7. Update documentation if required.
8. Submit a pull request.

Example:

```bash
git checkout -b feature/improve-bundle-support
```

---

# Pull Request Guidelines

A pull request should include:

* Clear description
* Reason for the change
* Magento version tested
* PHP version tested
* Testing performed
* Screenshots for frontend changes
* Screenshots for Admin changes where appropriate
* Any compatibility considerations

Avoid unrelated changes in the same pull request.

---

# Bug Reports

When reporting an issue, provide:

* Magento version
* Adobe Commerce or Magento Open Source
* PHP version
* Module version
* Theme
* Browser
* Product type
* Customer login state
* Steps to reproduce
* Expected behavior
* Actual behavior
* Browser console errors
* Network request details
* Relevant Magento logs

Please remove sensitive information before posting logs.

Do not include:

* Passwords
* API keys
* Access tokens
* Customer personal information
* Payment information
* Production credentials
* Private infrastructure information

---

# Feature Requests

For feature requests, explain:

1. The problem.
2. The desired behavior.
3. Why the existing implementation is insufficient.
4. The Magento version.
5. Example frontend behavior.
6. Any compatibility considerations.

---

# Versioning

The project should use semantic versioning where practical.

Format:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.0.0
```

Meaning:

```text
MAJOR
Breaking changes

MINOR
Backward-compatible functionality

PATCH
Backward-compatible fixes
```

---

# Release Checklist

Before creating a release:

* [ ] Update version
* [ ] Update README
* [ ] Test module installation
* [ ] Test module removal
* [ ] Test Admin configuration
* [ ] Test simple products
* [ ] Test configurable products
* [ ] Test bundle products
* [ ] Test cart removal
* [ ] Test mobile interaction
* [ ] Test desktop interaction
* [ ] Test full-page loader
* [ ] Check PHP errors
* [ ] Check JavaScript console
* [ ] Check Magento logs
* [ ] Check generated files
* [ ] Check repository for secrets
* [ ] Check repository for temporary files
* [ ] Create Git tag
* [ ] Publish release notes

---

# Repository Hygiene

The repository should not contain:

```text
generated/
var/
pub/static/
pub/media/
vendor/
.env
app/etc/env.php
*.log
*:Zone.Identifier
```

Do not commit production configuration or credentials.

---

# Example Installation Structure

After installation:

```text
Magento Root/
│
├── app/
│   └── code/
│       └── Kumar/
│           └── DragActions/
│
├── bin/
│   └── magento
│
├── app/etc/
│
└── ...
```

---

# Module Namespace

Magento namespace:

```text
Kumar
```

Module name:

```text
DragActions
```

Full module name:

```text
Kumar_DragActions
```

PHP namespace:

```php
Kumar\DragActions
```

Composer package:

```text
kumar/module-drag-actions
```

---

# Routes

The module uses the frontend route:

```text
dragactions
```

Main action endpoint:

```text
dragactions/action/execute
```

Product configuration endpoint:

```text
dragactions/product/configure
```

These endpoints are used internally by the frontend JavaScript.

---

# Configuration Path

The module configuration root is:

```text
kumar_dragactions
```

Example:

```text
kumar_dragactions/general/enabled
```

---

# Admin ACL

The module defines a dedicated Admin ACL resource:

```text
Kumar_DragActions::dragactions
```

This controls access to the module's Admin configuration.

---

# Design Principles

The module follows several design principles.

## No Core Template Modification

Magento core PHTML files should not be modified.

---

## Configuration Driven

Frontend features should respect Admin configuration.

---

## Magento Native Functionality

Where appropriate, the module uses Magento's native functionality rather than implementing parallel systems.

---

## Separation of Concerns

Frontend, backend, configuration and presentation logic are kept in separate Magento layers.

---

## Reusability

The module is designed to be reusable across Magento installations.

---

# Why Use This Module?

Traditional Magento product interactions usually depend on buttons, forms and links.

This module adds another interaction model:

```text
Traditional:

Product
   ↓
Button
   ↓
Action


Drag Actions:

Product
   ↓
Drag / Swipe
   ↓
Action
```

The module can therefore be used as an experimental UX layer for Magento storefronts.

It can also be used as a foundation for further gesture-based ecommerce interactions.

---

# Compatibility Notice

Magento installations can differ significantly based on:

* Magento version
* Adobe Commerce modules
* Theme
* Customizations
* Third-party extensions
* Product configuration
* Checkout implementation

Always test the module on a staging environment before production deployment.

---

## License

This project is licensed under the MIT License.

Copyright (c) 2026 Kunal Kumar

See the [LICENSE](LICENSE) file for the complete license text.

### Third-Party Software

This module is designed to work with Magento 2 / Adobe Commerce and uses
Magento framework APIs and frontend libraries provided by the Magento platform.

Magento 2 / Adobe Commerce remains subject to its own licensing terms.
This license applies only to the Kumar_DragActions module and does not
modify or replace the license terms of Magento or any other third-party software.

---

# Author

**Kunal Kumar**

Magento / Adobe Commerce Frontend Developer

GitHub:

`https://github.com/mekkumar`

---

# Disclaimer

Kumar Drag Actions is an independent open-source Magento 2 module.

This project is not an official Magento or Adobe Commerce extension.

It is not affiliated with, endorsed by, or sponsored by Adobe Inc.

Magento and Adobe Commerce are trademarks of Adobe Inc.

Use the module at your own discretion and test it thoroughly in a development or staging environment before deploying it to a production store.

---

# Acknowledgements

This project is built using Magento 2's extension architecture and standard Magento frontend/backend mechanisms.

The module is intended to complement Magento rather than replace Magento's native product, cart, wishlist or catalog functionality.

---

# Project Status

Current implementation includes:

* Desktop drag interaction
* Mobile swipe interaction
* Add to Cart
* Wishlist
* Compare
* Save for Later
* Remove from Cart
* Simple product handling
* Configurable product configuration
* Bundle product configuration
* Basic grouped product handling
* Admin configuration
* ACL
* AJAX action processing
* Full-page loading overlay
* Magento core template isolation

The project is under active development and additional functionality may be added in future releases.
