# Kumar_DragActions

A Magento 2 frontend UX module that adds an independent floating product-action window.

## V1

- Drag → Cart
- Drag → Wishlist
- Drag → Compare (integration hook)
- Drag → Save for Later (adapter placeholder)
- Drag → Remove
- Configurable product configuration popup
- Bundle product configuration popup
- AJAX action layer
- Magento customer-data cart refresh
- Touch/swipe fallback
- Admin enable/disable per action
- No Magento core/vendor PHTML modifications
- Custom module layout + PHTML
- JS/PHP events for integrations

## Design principle

Magento remains the source of truth for cart/customer data. The module does not maintain a second cart and does not replace the Magento minicart.

## Install

Copy to:

`app/code/Kumar/DragActions`

Then:

```bash
bin/magento module:enable Kumar_DragActions
bin/magento setup:upgrade
bin/magento cache:flush
```

Production mode:

```bash
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f
```

## Admin

`Stores > Configuration > Kumar > Drag Actions`

If the `Kumar` tab is not present in your build, Magento may place the section under the general configuration area depending on the admin configuration layout.

## Important V1 notes

This repository intentionally avoids overriding existing Magento product, cart, or minicart templates.

Before publishing to production, wire the Compare and Save for Later actions to the exact Magento edition/custom modules used by the target store. Bundle option rendering also needs to be extended for multi-select, checkbox, radio, and per-selection quantities when those product configurations are used.

The module is designed as a foundation and should be tested against the exact Magento version/theme/custom checkout stack of the target store.
