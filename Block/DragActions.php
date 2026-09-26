<?php
namespace Kumar\DragActions\Block;

use Kumar\DragActions\Helper\Data as Helper;
use Magento\Framework\View\Element\Template;
use Magento\Framework\UrlInterface;

class DragActions extends Template
{
    public function __construct(
        Template\Context $context,
        private readonly Helper $helper,
        private readonly UrlInterface $urlBuilder,
        private readonly \Magento\Framework\Data\Form\FormKey $formKey,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    public function isEnabled(): bool { return $this->helper->isEnabled(); }
    public function isActionEnabled(string $action): bool { return $this->helper->isActionEnabled($action); }
    public function isInteractionEnabled(string $interaction): bool { return $this->helper->isInteractionEnabled($interaction); }

    public function getActionUrl(): string { return $this->urlBuilder->getUrl('dragactions/action/execute'); }
    public function getConfigureUrl(): string { return $this->urlBuilder->getUrl('dragactions/product/configure'); }
    public function getFormKey(): string { return $this->formKey->getFormKey(); }
    public function getButtonColor(): string { return $this->helper->getButtonColor();}
    public function getButtonTextColor(): string { return $this->helper->getButtonTextColor();}

}
