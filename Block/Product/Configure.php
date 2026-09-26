<?php
namespace Kumar\DragActions\Block\Product;

use Magento\Catalog\Block\Product\AbstractProduct;
use Magento\Catalog\Model\Product;

class Configure extends AbstractProduct
{
    private ?Product $productObject = null;

    public function setProduct(Product $product): self
    {
        $this->productObject = $product;
        return $this;
    }

    public function getProduct(): Product
    {
        return $this->productObject;
    }

    public function getAction(): string
    {
        return (string)$this->getData('action');
    }

    public function getOptions(): array
    {
        $product = $this->getProduct();
        if ($product->getTypeId() === 'configurable') {
            return $product->getTypeInstance()->getConfigurableAttributes($product);
        }
        return [];
    }

    public function getBundleOptions(): array
    {
        $product = $this->getProduct();
        if ($product->getTypeId() !== 'bundle') {
            return [];
        }
        return $product->getTypeInstance()->getOptionsCollection($product);
    }
}
