define([
    'jquery',
    'mage/url',
    'Magento_Customer/js/customer-data'
], function ($, urlBuilder, customerData) {
    'use strict';

    return function (config, element) {
        var root = $(element);
        var trigger = root.find('.kumar-drag-actions__trigger');
        var panel = root.find('.kumar-drag-actions__panel');
        var modal = root.find('.kumar-drag-actions__modal');
        var configBox = root.find('.kumar-drag-actions__config');
        var status = root.find('.kumar-drag-actions__status');
        var current = null;

        /*
         * Stores the action for which product configuration
         * was opened.
         *
         * Example:
         * cart       -> cart
         * wishlist   -> wishlist
         * save_later -> save_later
         */
        var configuredAction = null;

        /*
         * ---------------------------------------------------------
         * Action availability
         * ---------------------------------------------------------
         */

        function isActionEnabled(action) {
            return root.find(
                '.kumar-drag-action[data-action="' + action + '"]'
            ).length > 0;
        }

        var draggingProduct = false;
        var dockDragging = false;
        var dockMoved = false;

        var dockStartX = 0;
        var dockStartY = 0;
        var dockStartLeft = 0;
        var dockStartTop = 0;

        var startPoint = null;

        /*
         * ---------------------------------------------------------
         * Product selectors
         * ---------------------------------------------------------
         */

        var productFormSelector =
            'form[data-role="tocart-form"], ' +
            'form[action*="/checkout/cart/add"]';

        var productItemSelector =
            '.product-item, ' +
            '.product-item-info, ' +
            '[data-product-item-id]';

        /*
         * ---------------------------------------------------------
         * Helpers
         * ---------------------------------------------------------
         */

        function setStatus(message, error) {
            status
                .text(message || '')
                .toggleClass('is-error', !!error);
        }

        /*
         * ---------------------------------------------------------
         * Panel positioning
         *
         * Keeps the action panel inside the viewport.
         *
         * Right edge  -> panel opens to left
         * Left edge   -> panel opens to right
         * Bottom edge -> panel opens upward
         * Top edge    -> panel opens downward
         * ---------------------------------------------------------
         */

        function positionPanel() {
            if (!panel.length || !trigger.length) {
                return;
            }

            var panelElement = panel[0];
            var triggerElement = trigger[0];

            if (!panelElement || !triggerElement) {
                return;
            }

            var gap = 10;
            var viewportWidth = window.innerWidth;
            var viewportHeight = window.innerHeight;

            /*
             * Panel must be fixed relative to viewport.
             */
            panelElement.style.position = 'fixed';

            /*
             * Reset previous position.
             */
            panelElement.style.left = 'auto';
            panelElement.style.right = 'auto';
            panelElement.style.top = 'auto';
            panelElement.style.bottom = 'auto';

            /*
             * Make panel visible temporarily so
             * getBoundingClientRect() can calculate size.
             */
            var wasHidden = panel.is('[hidden]');

            if (wasHidden) {
                panel.removeAttr('hidden');
            }

            var triggerRect =
                triggerElement.getBoundingClientRect();

            var panelRect =
                panelElement.getBoundingClientRect();

            var panelWidth =
                panelRect.width;

            var panelHeight =
                panelRect.height;

            /*
             * -----------------------------------------------------
             * Horizontal positioning
             * -----------------------------------------------------
             */

            var left;

            /*
             * Enough room on the right.
             */
            if (
                triggerRect.right +
                gap +
                panelWidth <=
                viewportWidth
            ) {
                left =
                    triggerRect.right +
                    gap;
            }

            /*
             * Otherwise open to the left.
             */
            else if (
                triggerRect.left -
                gap -
                panelWidth >=
                0
            ) {
                left =
                    triggerRect.left -
                    panelWidth -
                    gap;
            }

            /*
             * If panel is wider than available space,
             * keep it inside viewport.
             */
            else {
                left =
                    Math.max(
                        gap,
                        Math.min(
                            triggerRect.left,
                            viewportWidth -
                            panelWidth -
                            gap
                        )
                    );
            }

            /*
             * -----------------------------------------------------
             * Vertical positioning
             * -----------------------------------------------------
             */

            var top;

            /*
             * Enough room below.
             */
            if (
                triggerRect.top +
                panelHeight <=
                viewportHeight -
                gap
            ) {
                top =
                    triggerRect.top;
            }

            /*
             * Otherwise open upward.
             */
            else if (
                triggerRect.bottom -
                panelHeight >=
                gap
            ) {
                top =
                    triggerRect.bottom -
                    panelHeight;
            }

            /*
             * If there is not enough room either side,
             * clamp inside viewport.
             */
            else {
                top =
                    Math.max(
                        gap,
                        Math.min(
                            triggerRect.top,
                            viewportHeight -
                            panelHeight -
                            gap
                        )
                    );
            }

            /*
             * Final viewport safety.
             */
            left =
                Math.max(
                    gap,
                    Math.min(
                        left,
                        viewportWidth -
                        panelWidth -
                        gap
                    )
                );

            top =
                Math.max(
                    gap,
                    Math.min(
                        top,
                        viewportHeight -
                        panelHeight -
                        gap
                    )
                );

            panelElement.style.left =
                left + 'px';

            panelElement.style.top =
                top + 'px';

            /*
             * Restore hidden state.
             */
            if (wasHidden) {
                panel.attr(
                    'hidden',
                    'hidden'
                );
            }
        }

        function showLoader() {
            var loader = document.getElementById('kumar-drag-actions-loader');

            if (!loader) {
                return;
            }

            loader.hidden = false;
            loader.setAttribute('aria-hidden', 'false');
        }

        function hideLoader() {
            var loader = document.getElementById('kumar-drag-actions-loader');

            if (!loader) {
                return;
            }

            loader.hidden = true;
            loader.setAttribute('aria-hidden', 'true');
        }

        function expand() {
            panel.removeAttr('hidden');

            /*
             * Wait until browser has rendered the panel,
             * then calculate its real dimensions.
             */
            window.requestAnimationFrame(
                function () {
                    positionPanel();
                }
            );
        }

        function collapse() {
            panel.attr(
                'hidden',
                'hidden'
            );
        }

        function openModal(html) {
            configBox.html(html);
            modal.removeAttr('hidden');
        }

        function closeModal() {
            modal.attr(
                'hidden',
                'hidden'
            );

            configBox.empty();
        }

        /*
         * ---------------------------------------------------------
         * Loading state
         * ---------------------------------------------------------
         */

        function setLoading(isLoading, action) {
            var buttons =
                root.find(
                    '.kumar-drag-action'
                );

            root.toggleClass(
                'is-loading',
                isLoading
            );

            buttons.prop(
                'disabled',
                isLoading
            );

            if (
                isLoading &&
                action === 'cart'
            ) {
                var cartButton =
                    root.find(
                        '.kumar-drag-action[data-action="cart"]'
                    );

                if (cartButton.length) {
                    if (
                        !cartButton.data(
                            'original-content'
                        )
                    ) {
                        cartButton.data(
                            'original-content',
                            cartButton.html()
                        );
                    }

                    cartButton.html(
                        '<span class="kumar-drag-actions__loader" aria-hidden="true"></span>' +
                        '<span class="kumar-drag-action__text">' +
                        'Adding to Cart...' +
                        '</span>'
                    );
                }
            }

            if (
                !isLoading &&
                action === 'cart'
            ) {
                var cartButton =
                    root.find(
                        '.kumar-drag-action[data-action="cart"]'
                    );

                var originalContent =
                    cartButton.data(
                        'original-content'
                    );

                if (originalContent) {
                    cartButton.html(
                        originalContent
                    );

                    cartButton.removeData(
                        'original-content'
                    );
                }
            }
        }

        /*
         * ---------------------------------------------------------
         * Minicart
         * ---------------------------------------------------------
         */

        function openMiniCart() {
            var miniCartButton =
                $(
                    '.minicart-wrapper .action.showcart'
                ).first();

            if (!miniCartButton.length) {
                return;
            }

            miniCartButton.trigger(
                'click'
            );
        }

        function refreshCart(response) {
            if (
                response &&
                response.sections &&
                response.sections.cart
            ) {
                customerData.set(
                    'cart',
                    response.sections.cart
                );

                return;
            }

            customerData.invalidate([
                'cart'
            ]);

            return customerData.reload(
                ['cart'],
                true
            );
        }

        /*
         * ---------------------------------------------------------
         * Product detection
         * ---------------------------------------------------------
         */

        function getProductFromElement(el) {
            var element = $(el);

            var item =
                element.closest(
                    '.product-item, ' +
                    '.product-item-info, ' +
                    '[data-product-item-id]'
                );

            var form =
                element.is('form')
                    ? element
                    : item.find(
                        productFormSelector
                    ).first();

            var productId =
                form.find(
                    'input[name="product"]'
                )
                    .first()
                    .val();

            if (!productId) {
                productId =
                    item.attr(
                        'data-product-item-id'
                    );
            }

            if (!productId) {
                productId =
                    element.attr(
                        'data-product-id'
                    );
            }

            if (!productId) {
                productId =
                    item.attr(
                        'data-product-id'
                    );
            }

            if (!productId) {
                return null;
            }

            var itemId =
                element.attr(
                    'data-cart-item-id'
                ) ||
                item.attr(
                    'data-cart-item-id'
                ) ||
                null;

            var sku =
                form.attr(
                    'data-product-sku'
                ) ||
                element.attr(
                    'data-product-sku'
                ) ||
                null;

            return {
                product: String(productId),
                itemId: itemId,
                sku: sku,
                element: element[0]
            };
        }

        /*
         * ---------------------------------------------------------
         * Native drag data
         * ---------------------------------------------------------
         */

        function setDragData(event, product) {
            var dataTransfer =
                event.originalEvent.dataTransfer;

            if (
                !dataTransfer ||
                !product
            ) {
                return;
            }

            dataTransfer.effectAllowed =
                'copy';

            dataTransfer.setData(
                'text/kumar-drag-product',
                JSON.stringify(product)
            );

            dataTransfer.setData(
                'text/plain',
                product.product
            );
        }

        function sourceFromDragEvent(event) {
            var originalEvent =
                event.originalEvent ||
                event;

            var dataTransfer =
                originalEvent.dataTransfer;

            if (!dataTransfer) {
                return null;
            }

            var raw =
                dataTransfer.getData(
                    'text/kumar-drag-product'
                );

            if (raw) {
                try {
                    return JSON.parse(raw);
                } catch (e) {
                    return null;
                }
            }

            var productId =
                dataTransfer.getData(
                    'text/plain'
                );

            if (productId) {
                return {
                    product: productId,
                    itemId: null,
                    sku: null,
                    element: null
                };
            }

            return null;
        }

        /*
         * ---------------------------------------------------------
         * Current product
         * ---------------------------------------------------------
         */

        function beginProduct(product) {
            if (
                !product ||
                !product.product
            ) {
                setStatus(
                    'Product could not be detected.',
                    true
                );

                return false;
            }

            current = product;

            root.addClass(
                'has-product'
            );

            root.addClass(
                'is-active'
            );

            expand();

            setStatus(
                'Product selected.'
            );

            return true;
        }

        function clearProduct() {
            current = null;

            root.removeClass(
                'has-product'
            );

            root.removeClass(
                'is-active'
            );
        }

        /*
         * ---------------------------------------------------------
         * Configuration requirement
         * ---------------------------------------------------------
         */

        function requiresConfiguration(action) {
            return [
                'cart',
                'wishlist',
                'save_later'
            ].indexOf(action) !== -1;
        }

        /*
         * ---------------------------------------------------------
         * Product configuration
         * ---------------------------------------------------------
         */

        function configure(action) {
            if (!current) {
                setStatus(
                    'Drag or select a product first.',
                    true
                );

                return;
            }

            /*
             * IMPORTANT:
             * Remember exactly which action opened
             * the configuration modal.
             *
             * This prevents Wishlist / Save for Later
             * from falling back to Cart.
             */
            configuredAction = action;

            setStatus(
                'Loading…'
            );

            $.get(
                root.data(
                    'configure-url'
                ),
                {
                    product:
                        current.product,

                    action:
                        action,

                    form_key:
                        root.data(
                            'form-key'
                        )
                }
            )
                .done(function (response) {
                    if (
                        !response ||
                        !response.success
                    ) {
                        configuredAction = null;

                        setStatus(
                            response &&
                            response.message
                                ? response.message
                                : 'Unable to load configuration.',
                            true
                        );

                        return;
                    }

                    openModal(
                        response.html
                    );
                })
                .fail(function () {
                    configuredAction = null;

                    setStatus(
                        'Unable to load product configuration.',
                        true
                    );
                });
        }

        /*
         * ---------------------------------------------------------
         * Execute action
         * ---------------------------------------------------------
         */

        function execute(action, payload) {
            if (!current) {
                setStatus(
                    'Drag or select a product first.',
                    true
                );

                return;
            }

            payload =
                payload || {};

            payload.form_key =
                root.data(
                    'form-key'
                );

            payload.action =
                action;

            payload.product =
                current.product;

            if (current.itemId) {
                payload.item_id =
                    current.itemId;
            }

            if (current.sku) {
                payload.sku =
                    current.sku;
            }

            setLoading(
                true,
                action
            );

            setStatus(
                action === 'cart'
                    ? 'Adding to Cart…'
                    : 'Processing…'
            );

            showLoader();

            $.ajax({
                url: root.data(
                    'action-url'
                ),

                type: 'POST',

                data: payload,

                dataType: 'json'
            })
                .done(function (response) {
                    if (
                        response &&
                        response.success
                    ) {
                        var cartRefresh =
                            null;

                        /*
                         * Cart data only needs to be refreshed
                         * when the action actually changes cart.
                         */
                        if (
                            action === 'cart' ||
                            action === 'remove'
                        ) {
                            cartRefresh =
                                refreshCart(
                                    response
                                );
                        }

                        if (
                            action === 'cart'
                        ) {
                            setStatus(
                                response.message ||
                                'Added to cart.'
                            );

                            if (
                                cartRefresh &&
                                typeof cartRefresh.always ===
                                'function'
                            ) {
                                cartRefresh.always(
                                    function () {
                                        setTimeout(
                                            function () {
                                                openMiniCart();
                                            },
                                            150
                                        );
                                    }
                                );
                            } else {
                                setTimeout(
                                    function () {
                                        openMiniCart();
                                    },
                                    300
                                );
                            }
                        } else {
                            setStatus(
                                response.message ||
                                'Done.'
                            );
                        }

                        $(document).trigger(
                            'kumar:dragactions:success',
                            [
                                response,
                                payload
                            ]
                        );

                        window.dispatchEvent(
                            new CustomEvent(
                                'kumar:dragactions:success',
                                {
                                    detail:
                                        response
                                }
                            )
                        );
                    } else {
                        setStatus(
                            response &&
                            response.message
                                ? response.message
                                : 'Action failed.',
                            true
                        );

                        $(document).trigger(
                            'kumar:dragactions:error',
                            [
                                response,
                                payload
                            ]
                        );
                    }
                })
                .fail(function (xhr) {
                    var message =
                        'Action failed.';

                    if (
                        xhr.responseJSON &&
                        xhr.responseJSON.message
                    ) {
                        message =
                            xhr.responseJSON.message;
                    }

                    setStatus(
                        message,
                        true
                    );

                    $(document).trigger(
                        'kumar:dragactions:error',
                        [
                            {
                                success: false,
                                message: message
                            },
                            payload
                        ]
                    );
                })
                .always(function () {
                    hideLoader();
                    setLoading(
                        false,
                        action
                    );
                });
        }

        /*
         * ---------------------------------------------------------
         * Run action
         * ---------------------------------------------------------
         */

        function runAction(
            action,
            product,
            payload
        ) {
            if (
                !action ||
                !isActionEnabled(action)
            ) {
                return;
            }

            if (product) {
                if (
                    !beginProduct(
                        product
                    )
                ) {
                    return;
                }
            }

            if (!current) {
                setStatus(
                    'Drag or select a product first.',
                    true
                );

                return;
            }

            if (
                requiresConfiguration(
                    action
                )
            ) {
                configure(
                    action
                );

                return;
            }

            execute(
                action,
                payload || {}
            );
        }

        /*
         * ---------------------------------------------------------
         * Floating window drag
         * ---------------------------------------------------------
         */

        function startDockDrag(event) {
            if (
                event.pointerType === 'mouse' &&
                event.button !== 0
            ) {
                return;
            }

            var rect =
                root[0]
                    .getBoundingClientRect();

            dockDragging = true;
            dockMoved = false;

            dockStartX =
                event.clientX;

            dockStartY =
                event.clientY;

            dockStartLeft =
                rect.left;

            dockStartTop =
                rect.top;

            root.css({
                right: 'auto',
                bottom: 'auto',
                left:
                    rect.left + 'px',
                top:
                    rect.top + 'px'
            });

            if (
                trigger[0].setPointerCapture
            ) {
                try {
                    trigger[0].setPointerCapture(
                        event.pointerId
                    );
                } catch (e) {
                    // Ignore pointer capture errors.
                }
            }

            event.preventDefault();
        }

        function moveDockDrag(event) {
            if (!dockDragging) {
                return;
            }

            var deltaX =
                event.clientX -
                dockStartX;

            var deltaY =
                event.clientY -
                dockStartY;

            if (
                Math.abs(deltaX) > 5 ||
                Math.abs(deltaY) > 5
            ) {
                dockMoved = true;
            }

            var newLeft =
                dockStartLeft +
                deltaX;

            var newTop =
                dockStartTop +
                deltaY;

            var maxLeft =
                window.innerWidth -
                root.outerWidth();

            var maxTop =
                window.innerHeight -
                root.outerHeight();

            newLeft =
                Math.max(
                    0,
                    Math.min(
                        newLeft,
                        maxLeft
                    )
                );

            newTop =
                Math.max(
                    0,
                    Math.min(
                        newTop,
                        maxTop
                    )
                );

            root.css({
                left:
                    newLeft + 'px',

                top:
                    newTop + 'px'
            });

            /*
             * If panel is currently open,
             * keep it attached to trigger.
             */
            if (
                !panel.is('[hidden]')
            ) {
                positionPanel();
            }
        }

        function stopDockDrag(event) {
            if (!dockDragging) {
                return;
            }

            dockDragging = false;

            if (
                trigger[0].releasePointerCapture
            ) {
                try {
                    trigger[0].releasePointerCapture(
                        event.pointerId
                    );
                } catch (e) {
                    // Ignore pointer capture errors.
                }
            }

            /*
             * Recalculate panel position after
             * dock movement finishes.
             */
            if (
                !panel.is('[hidden]')
            ) {
                positionPanel();
            }
        }

        trigger.on(
            'pointerdown',
            startDockDrag
        );

        trigger.on(
            'pointermove',
            moveDockDrag
        );

        trigger.on(
            'pointerup pointercancel',
            stopDockDrag
        );

        /*
         * ---------------------------------------------------------
         * Trigger click
         * ---------------------------------------------------------
         */

        trigger.on(
            'click',
            function (event) {
                if (dockMoved) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    dockMoved = false;

                    return;
                }

                if (
                    panel.is('[hidden]')
                ) {
                    expand();
                } else {
                    collapse();
                }
            }
        );

        /*
         * ---------------------------------------------------------
         * Reposition on window resize / scroll
         * ---------------------------------------------------------
         */

        $(window).on(
            'resize.kumarDragActions',
            function () {
                if (
                    !panel.is('[hidden]')
                ) {
                    positionPanel();
                }
            }
        );

        $(window).on(
            'scroll.kumarDragActions',
            function () {
                if (
                    !panel.is('[hidden]')
                ) {
                    positionPanel();
                }
            }
        );

        /*
         * ---------------------------------------------------------
         * Product drag support
         * ---------------------------------------------------------
         */

        if (
            root.data(
                'desktop-drag'
            ) === 1 ||
            root.data(
                'desktop-drag'
            ) === '1'
        ) {
            function makeProductsDraggable() {
                $(productFormSelector).each(
                    function () {
                        $(this).attr(
                            'draggable',
                            'true'
                        );
                    }
                );

                $(productItemSelector).each(
                    function () {
                        var item =
                            $(this);

                        if (
                            item.find(
                                productFormSelector
                            ).length
                        ) {
                            item.attr(
                                'draggable',
                                'true'
                            );
                        }
                    }
                );
            }

            makeProductsDraggable();

            $(document).on(
                'dragstart',
                productFormSelector,
                function (event) {
                    var product =
                        getProductFromElement(
                            this
                        );

                    if (!product) {
                        return;
                    }

                    draggingProduct =
                        true;

                    setDragData(
                        event,
                        product
                    );

                    root.addClass(
                        'is-dragging'
                    );

                    expand();
                }
            );

            $(document).on(
                'dragstart',
                '.product-item, [data-product-item-id]',
                function (event) {
                    if (
                        $(event.target).closest(
                            productFormSelector
                        ).length
                    ) {
                        return;
                    }

                    var product =
                        getProductFromElement(
                            this
                        );

                    if (!product) {
                        return;
                    }

                    draggingProduct =
                        true;

                    setDragData(
                        event,
                        product
                    );

                    root.addClass(
                        'is-dragging'
                    );

                    expand();
                }
            );

            /*
             * -----------------------------------------------------
             * Action button drop target
             * -----------------------------------------------------
             */

            root.on(
                'dragenter',
                '.kumar-drag-action',
                function (event) {
                    if (!draggingProduct) {
                        return;
                    }

                    event.preventDefault();
                    event.stopPropagation();

                    if (
                        !isActionEnabled(
                            $(this).data(
                                'action'
                            )
                        )
                    ) {
                        return;
                    }

                    $(this).addClass(
                        'is-drop-target'
                    );
                }
            );

            root.on(
                'dragover',
                '.kumar-drag-action',
                function (event) {
                    if (!draggingProduct) {
                        return;
                    }

                    event.preventDefault();
                    event.stopPropagation();

                    var action =
                        $(this).data(
                            'action'
                        );

                    if (
                        !isActionEnabled(
                            action
                        )
                    ) {
                        return;
                    }

                    if (
                        event.originalEvent
                            .dataTransfer
                    ) {
                        event.originalEvent
                            .dataTransfer
                            .dropEffect =
                            'copy';
                    }

                    $(this).addClass(
                        'is-drop-target'
                    );
                }
            );

            root.on(
                'dragleave',
                '.kumar-drag-action',
                function (event) {
                    if (!draggingProduct) {
                        return;
                    }

                    if (
                        event.target === this ||
                        !$.contains(
                            this,
                            event.relatedTarget
                        )
                    ) {
                        $(this).removeClass(
                            'is-drop-target'
                        );
                    }
                }
            );

            root.on(
                'drop',
                '.kumar-drag-action',
                function (event) {
                    if (!draggingProduct) {
                        return;
                    }

                    event.preventDefault();
                    event.stopPropagation();

                    var actionButton =
                        $(this);

                    var action =
                        actionButton.data(
                            'action'
                        );

                    if (
                        !action ||
                        !isActionEnabled(
                            action
                        )
                    ) {
                        actionButton.removeClass(
                            'is-drop-target'
                        );

                        return;
                    }

                    var product =
                        sourceFromDragEvent(
                            event
                        );

                    draggingProduct =
                        false;

                    root.removeClass(
                        'is-dragging'
                    );

                    root.removeClass(
                        'is-drag-over'
                    );

                    root.find(
                        '.kumar-drag-action'
                    ).removeClass(
                        'is-drop-target'
                    );

                    if (!product) {
                        setStatus(
                            'Product could not be detected.',
                            true
                        );

                        return;
                    }

                    runAction(
                        action,
                        product
                    );
                }
            );

            /*
             * -----------------------------------------------------
             * Main panel drop zone
             * -----------------------------------------------------
             */

            root.on(
                'dragenter',
                function (event) {
                    if (!draggingProduct) {
                        return;
                    }

                    if (
                        $(event.target).closest(
                            '.kumar-drag-action'
                        ).length
                    ) {
                        return;
                    }

                    event.preventDefault();

                    root.addClass(
                        'is-drag-over'
                    );
                }
            );

            root.on(
                'dragover',
                function (event) {
                    if (!draggingProduct) {
                        return;
                    }

                    if (
                        $(event.target).closest(
                            '.kumar-drag-action'
                        ).length
                    ) {
                        return;
                    }

                    event.preventDefault();

                    if (
                        event.originalEvent
                            .dataTransfer
                    ) {
                        event.originalEvent
                            .dataTransfer
                            .dropEffect =
                            'copy';
                    }

                    root.addClass(
                        'is-drag-over'
                    );
                }
            );

            root.on(
                'dragleave',
                function (event) {
                    if (!draggingProduct) {
                        return;
                    }

                    if (
                        event.target ===
                        root[0] ||
                        !$.contains(
                            root[0],
                            event.relatedTarget
                        )
                    ) {
                        root.removeClass(
                            'is-drag-over'
                        );
                    }
                }
            );

            root.on(
                'drop',
                function (event) {
                    if (!draggingProduct) {
                        return;
                    }

                    if (
                        $(event.target).closest(
                            '.kumar-drag-action'
                        ).length
                    ) {
                        return;
                    }

                    event.preventDefault();
                    event.stopPropagation();

                    var product =
                        sourceFromDragEvent(
                            event
                        );

                    draggingProduct =
                        false;

                    root.removeClass(
                        'is-dragging'
                    );

                    root.removeClass(
                        'is-drag-over'
                    );

                    root.find(
                        '.kumar-drag-action'
                    ).removeClass(
                        'is-drop-target'
                    );

                    beginProduct(
                        product
                    );
                }
            );

            /*
             * -----------------------------------------------------
             * Drag finished
             * -----------------------------------------------------
             */

            $(document).on(
                'dragend',
                productFormSelector +
                ', .product-item, [data-product-item-id]',
                function () {
                    draggingProduct =
                        false;

                    root.removeClass(
                        'is-dragging'
                    );

                    root.removeClass(
                        'is-drag-over'
                    );

                    root.find(
                        '.kumar-drag-action'
                    ).removeClass(
                        'is-drop-target'
                    );
                }
            );

            /*
             * -----------------------------------------------------
             * Dynamic products
             * -----------------------------------------------------
             */

            if (
                window.MutationObserver
            ) {
                var observer =
                    new MutationObserver(
                        function () {
                            makeProductsDraggable();
                        }
                    );

                observer.observe(
                    document.body,
                    {
                        childList: true,
                        subtree: true
                    }
                );
            }
        }

        /*
         * ---------------------------------------------------------
         * Mobile swipe / pointer support
         * ---------------------------------------------------------
         */

        if (
            root.data(
                'mobile-swipe'
            ) === 1 ||
            root.data(
                'mobile-swipe'
            ) === '1'
        ) {
            $(document).on(
                'pointerdown',
                productItemSelector,
                function (event) {
                    if (
                        event.pointerType ===
                        'mouse'
                    ) {
                        return;
                    }

                    var product =
                        getProductFromElement(
                            this
                        );

                    if (!product) {
                        return;
                    }

                    startPoint = {
                        x:
                            event.clientX,

                        y:
                            event.clientY,

                        el:
                            this,

                        product:
                            product,

                        time:
                            Date.now()
                    };
                }
            );

            $(document).on(
                'pointerup',
                productItemSelector,
                function (event) {
                    if (
                        !startPoint ||
                        event.pointerType ===
                        'mouse'
                    ) {
                        return;
                    }

                    var dx =
                        event.clientX -
                        startPoint.x;

                    var dy =
                        event.clientY -
                        startPoint.y;

                    var distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );

                    var elapsed =
                        Date.now() -
                        startPoint.time;

                    if (
                        distance > 70 &&
                        elapsed < 1200
                    ) {
                        beginProduct(
                            startPoint.product
                        );
                    }

                    startPoint = null;
                }
            );
        }

        /*
         * ---------------------------------------------------------
         * Normal action button click
         * ---------------------------------------------------------
         */

        root.on(
            'click',
            '.kumar-drag-action',
            function () {
                var action =
                    $(this).data(
                        'action'
                    );

                runAction(
                    action
                );
            }
        );

        /*
         * ---------------------------------------------------------
         * Configuration modal close
         * ---------------------------------------------------------
         */

        root.on(
            'click',
            '.kumar-drag-actions__modal-close, ' +
            '.kumar-drag-actions__modal-backdrop',
            function () {
                configuredAction = null;
                closeModal();
            }
        );

        /*
         * ---------------------------------------------------------
         * Configuration form submit
         * ---------------------------------------------------------
         */

        root.on(
            'submit',
            '.kumar-drag-actions__config form',
            function (event) {
                event.preventDefault();

                var form =
                    $(this);

                var data =
                    form.serializeArray();

                var payload = {};

                $.each(
                    data,
                    function (_, field) {
                        if (
                            payload[
                                field.name
                            ] !== undefined
                        ) {
                            if (
                                !Array.isArray(
                                    payload[
                                        field.name
                                    ]
                                )
                            ) {
                                payload[
                                    field.name
                                ] = [
                                    payload[
                                        field.name
                                    ]
                                ];
                            }

                            payload[
                                field.name
                            ].push(
                                field.value
                            );
                        } else {
                            payload[
                                field.name
                            ] =
                                field.value;
                        }
                    }
                );

                /*
                 * -------------------------------------------------
                 * IMPORTANT ACTION RESOLUTION
                 *
                 * Priority:
                 *
                 * 1. Form data-action
                 * 2. Action remembered when modal opened
                 * 3. Cart fallback
                 *
                 * The first option allows configurable/bundle
                 * templates to explicitly provide the action.
                 *
                 * The second option protects us if the template
                 * does not provide data-action.
                 * -------------------------------------------------
                 */

                var action =
                    form.data(
                        'action'
                    ) ||
                    configuredAction ||
                    'cart';

                configuredAction = null;

                closeModal();

                execute(
                    action,
                    payload
                );
            }
        );
    };
});