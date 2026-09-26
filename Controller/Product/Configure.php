<?php

namespace Kumar\DragActions\Controller\Product;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\Product;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\View\LayoutFactory;

class Configure extends Action implements HttpGetActionInterface
{
    public function __construct(
        Context $context,
        private readonly JsonFactory $resultJsonFactory,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly LayoutFactory $layoutFactory
    ) {
        parent::__construct($context);
    }

    public function execute()
    {
        $result = $this->resultJsonFactory->create();

        try {
            $id = (int) $this->getRequest()->getParam('product');

            $action = (string) $this->getRequest()->getParam('action');

            if (!$id) {
                throw new \RuntimeException(
                    __('Product is required.')->render()
                );
            }

            if (!$action) {
                throw new \RuntimeException(
                    __('Action is required.')->render()
                );
            }

            $allowedActions = [
                'cart',
                'wishlist',
                'save_later'
            ];

            if (!in_array($action, $allowedActions, true)) {
                throw new \RuntimeException(
                    __('Unsupported configuration action.')->render()
                );
            }

            $product = $this->productRepository->getById(
                $id,
                false,
                null,
                true
            );

            $type = $product->getTypeId();

            if (!in_array(
                $type,
                [
                    Product\Type::TYPE_SIMPLE,
                    'configurable',
                    'bundle',
                    'grouped'
                ],
                true
            )) {
                throw new \RuntimeException(
                    __('Unsupported product type.')->render()
                );
            }

            /*
             * Simple products do not need a configuration screen.
             *
             * IMPORTANT:
             * Preserve the requested action instead of always
             * falling back to cart.
             */
            if ($type === Product\Type::TYPE_SIMPLE) {
                return $result->setData([
                    'success' => true,
                    'html' =>
                        '<form data-action="' .
                        htmlspecialchars(
                            $action,
                            ENT_QUOTES,
                            'UTF-8'
                        ) .
                        '">' .
                        '<p>' .
                        __('Ready to continue.') .
                        '</p>' .
                        '<button type="submit" class="kumar-drag-actions__submit">' .
                        __('Continue') .
                        '</button>' .
                        '</form>'
                ]);
            }

            $block = $this->layoutFactory
                ->create()
                ->createBlock(
                    \Kumar\DragActions\Block\Product\Configure::class
                )
                ->setProduct($product)
                ->setTemplate(
                    'Kumar_DragActions::product/configure.phtml'
                )
                ->setAction($action);

            return $result->setData([
                'success' => true,
                'html' => $block->toHtml()
            ]);
        } catch (\Throwable $e) {
            return $result
                ->setHttpResponseCode(400)
                ->setData([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
        }
    }
}
