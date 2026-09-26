<?php

namespace Kumar\DragActions\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Framework\App\Helper\Context;
use Magento\Framework\Module\Manager as ModuleManager;
use Magento\Store\Model\ScopeInterface;

class Data extends AbstractHelper
{
    private const XML_PREFIX = 'kumar_dragactions/';

    public function __construct(
        Context $context,
        private readonly ModuleManager $moduleManager
    ) {
        parent::__construct($context);
    }

    public function isEnabled(): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PREFIX . 'general/enabled',
            ScopeInterface::SCOPE_STORE
        );
    }

    public function isActionEnabled(string $action): bool
    {
        /*
         * First check Kumar Drag Actions configuration.
         */
        $dragActionEnabled = $this->scopeConfig->isSetFlag(
            self::XML_PREFIX . 'actions/' . $action,
            ScopeInterface::SCOPE_STORE
        );

        if (!$dragActionEnabled) {
            return false;
        }

        /*
         * Then check whether the required Magento functionality
         * is available.
         */
        return $this->isMagentoActionAvailable($action);
    }

    private function isMagentoActionAvailable(string $action): bool
    {
        switch ($action) {
            case 'cart':
                return $this->moduleManager->isEnabled('Magento_Checkout');

            case 'wishlist':
                return $this->moduleManager->isEnabled('Magento_Wishlist')
                    && $this->scopeConfig->isSetFlag(
                        'wishlist/general/active',
                        ScopeInterface::SCOPE_STORE
                    );

            case 'compare':
                return $this->moduleManager->isEnabled('Magento_Catalog');

            case 'save_later':
                /*
                 * Save for Later is currently controlled
                 * by Kumar Drag Actions configuration.
                 */
                return true;

            case 'remove':
                return $this->moduleManager->isEnabled('Magento_Checkout');

            default:
                return false;
        }
    }

    public function isInteractionEnabled(string $interaction): bool
    {
        return $this->scopeConfig->isSetFlag(
            self::XML_PREFIX . 'interaction/' . $interaction,
            ScopeInterface::SCOPE_STORE
        );
    }

    public function getButtonColor(): string
    {
        return (string) $this->scopeConfig->getValue(
            self::XML_PREFIX . 'appearance/button_color',
            ScopeInterface::SCOPE_STORE
        );
    }

    public function getButtonTextColor(): string
    {
        return (string) $this->scopeConfig->getValue(
            self::XML_PREFIX . 'appearance/button_text_color',
            ScopeInterface::SCOPE_STORE
        );
    }
}
