<?php

namespace Kumar\DragActions\Controller\Action;

use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Helper\Product\Compare as CompareHelper;
use Magento\Catalog\Model\Product;
use Magento\Checkout\Model\Cart;
use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Data\Form\FormKey\Validator as FormKeyValidator;
use Magento\Framework\Exception\LocalizedException;
use Magento\Wishlist\Model\WishlistFactory;

class Execute extends Action
{
    public function __construct(
        Context $context,
        private readonly JsonFactory $resultJsonFactory,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly Cart $cart,
        private readonly WishlistFactory $wishlistFactory,
        private readonly FormKeyValidator $formKeyValidator,
        private readonly CompareHelper $compareHelper
    ) {
        parent::__construct($context);
    }

    public function execute()
    {
        $result = $this->resultJsonFactory->create();
        $request = $this->getRequest();

        try {
            if (!$this->formKeyValidator->validate($request)) {
                throw new LocalizedException(
                    __('Invalid form key.')
                );
            }

            $action = (string) $request->getParam('action');
            $productId = (int) $request->getParam('product');

            if (!$productId) {
                throw new LocalizedException(
                    __('Product is required.')
                );
            }

            $product = $this->productRepository->getById(
                $productId
            );

            $response = match ($action) {
                'cart' => $this->addToCart($product),
                'wishlist' => $this->wishlist($product),
                'remove' => $this->remove(),
                'compare' => $this->compare($product),
                'save_later' => $this->saveLater($product),
                default => throw new LocalizedException(
                    __('Unsupported action.')
                )
            };

            $response['success'] = true;

            return $result->setData($response);
        } catch (\Throwable $e) {
            return $result
                ->setHttpResponseCode(400)
                ->setData([
                    'success' => false,
                    'message' => $e instanceof LocalizedException
                        ? $e->getMessage()
                        : __('Unable to complete the action.')->render()
                ]);
        }
    }

    private function addToCart(Product $product): array
    {
        $buyRequest = $this->getRequest()->getParams();

        unset(
            $buyRequest['form_key'],
            $buyRequest['action'],
            $buyRequest['product'],
            $buyRequest['item_id'],
            $buyRequest['sku']
        );

        $this->cart->addProduct(
            $product,
            $buyRequest
        );

        $this->cart->save();

        return [
            'message' => __('Product added to cart.')
        ];
    }

    private function wishlist(Product $product): array
    {
        $customerId = (int) $this->_getSession()->getCustomerId();

        if (!$customerId) {
            throw new LocalizedException(
                __('Please sign in to use Wishlist.')
            );
        }

        $wishlist = $this->wishlistFactory
            ->create()
            ->loadByCustomer(
                $customerId,
                true
            );

        if (!$wishlist->getId()) {
            throw new LocalizedException(
                __('Unable to load Wishlist.')
            );
        }

        $buyRequest = $this->getRequest()->getParams();

        unset(
            $buyRequest['form_key'],
            $buyRequest['action'],
            $buyRequest['product'],
            $buyRequest['item_id'],
            $buyRequest['sku']
        );

        $wishlistItem = $wishlist->addNewItem(
            $product,
            $buyRequest
        );

        if (!$wishlistItem) {
            throw new LocalizedException(
                __('Unable to add product to Wishlist.')
            );
        }

        $wishlist->save();

        return [
            'message' => __('Product added to Wishlist.')
        ];
    }

    private function remove(): array
    {
        $itemId = (int) $this->getRequest()->getParam(
            'item_id'
        );

        if (!$itemId) {
            throw new LocalizedException(
                __('A cart item is required for Remove.')
            );
        }

        $this->cart->removeItem($itemId);
        $this->cart->save();

        return [
            'message' => __('Product removed from cart.')
        ];
    }

    private function compare(Product $product): array
    {
        /*
         * Use Magento's native Compare helper.
         */
        $this->compareHelper->addProduct($product);

        return [
            'message' => __('Product added to Compare.')
        ];
    }

    private function saveLater(Product $product): array
    {
        /*
         * Save for Later uses Wishlist as the persistence
         * layer in this V1 implementation.
         */
        $customerId = (int) $this->_getSession()->getCustomerId();

        if (!$customerId) {
            throw new LocalizedException(
                __('Please sign in to use Save for Later.')
            );
        }

        $wishlist = $this->wishlistFactory
            ->create()
            ->loadByCustomer(
                $customerId,
                true
            );

        if (!$wishlist->getId()) {
            throw new LocalizedException(
                __('Unable to load Save for Later.')
            );
        }

        $buyRequest = $this->getRequest()->getParams();

        unset(
            $buyRequest['form_key'],
            $buyRequest['action'],
            $buyRequest['product'],
            $buyRequest['item_id'],
            $buyRequest['sku']
        );

        $wishlistItem = $wishlist->addNewItem(
            $product,
            $buyRequest
        );

        if (!$wishlistItem) {
            throw new LocalizedException(
                __('Unable to save product for later.')
            );
        }

        $wishlist->save();

        return [
            'message' => __('Product saved for later.')
        ];
    }
}