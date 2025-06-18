document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const orderModal = document.getElementById('orderModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const orderForm = document.getElementById('orderForm');
    const orderSuccessMessage = document.getElementById('orderSuccessMessage');
    const modalProductName = document.getElementById('modalProductName');
    const hiddenProductNameInput = document.getElementById('hiddenProductName');
    const hiddenProductPriceInput = document.getElementById('hiddenProductPrice');
    const cartItemCountSpan = document.getElementById('cart-item-count'); // For header cart count

    // --- Modal / Formspree Logic (Reused for Buy Now and Cart Checkout) ---

    // Function to open the modal and populate with product details
    const openOrderModal = (productName, productPrice, isCartCheckout = false, cartItems = []) => {
        modalProductName.textContent = productName;
        hiddenProductNameInput.value = productName;
        hiddenProductPriceInput.value = productPrice; // For single product

        // If it's a cart checkout, we need to send ALL items
        if (isCartCheckout) {
            const allItemsText = cartItems.map(item => `${item.name} (${item.price}) x ${item.quantity}`).join(', ');
            const allItemsTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            
            modalProductName.textContent = `Multiple Items (${cartItems.length} products)`;
            hiddenProductNameInput.value = `Cart Checkout: ${allItemsText}`;
            hiddenProductPriceInput.value = `Total: Rs. ${allItemsTotal.toFixed(2)}`;
        }

        orderForm.reset(); // Clear previous form data
        orderForm.classList.remove('hidden'); // Ensure form is visible
        orderSuccessMessage.classList.add('hidden'); // Hide success message
        orderModal.style.display = 'flex'; // Show the modal
    };

    // Function to close the modal
    const closeOrderModal = () => {
        orderModal.style.display = 'none';
        orderForm.classList.remove('hidden'); // Reset form visibility
        orderSuccessMessage.classList.add('hidden'); // Hide success message
    };

    // Attach event listeners to all close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', closeOrderModal);
    });

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === orderModal) {
            closeOrderModal();
        }
    });

    // Handle Formspree submission for the order form
    if (orderForm) { // Ensure orderForm exists on the current page
        orderForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const form = event.target;
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    orderForm.classList.add('hidden'); // Hide the form
                    orderSuccessMessage.classList.remove('hidden'); // Show success message
                    // Optional: Clear the cart if this was a cart checkout
                    if (hiddenProductNameInput.value.startsWith('Cart Checkout')) {
                        clearCart(); // Clear the local storage cart
                    }
                } else {
                    alert('There was a problem submitting your order. Please try again or contact us directly.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('An error occurred. Please check your internet connection and try again.');
            }
        });
    }

    // --- Product Page Specific Logic ---
    if (document.querySelector('.product-item')) { // Check if we are on a product-like page
        // --- Carousel Logic ---
        document.querySelectorAll('.carousel-container').forEach(container => {
            const images = container.querySelector('.carousel-images');
            const prevBtn = container.querySelector('.prev-btn');
            const nextBtn = container.querySelector('.next-btn');
            let currentIndex = parseInt(images.dataset.currentIndex || 0);

            const updateCarousel = () => {
                images.style.transform = `translateX(-${currentIndex * 100}%)`;
            };

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex === 0) ? images.children.length - 1 : currentIndex - 1;
                updateCarousel();
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex === images.children.length - 1) ? 0 : currentIndex + 1;
                updateCarousel();
            });

            // Initial update
            updateCarousel();
        });

        // --- Buy Now Button on Product Pages ---
        document.querySelectorAll('.buy-now-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productName = button.dataset.productName;
                const productPrice = button.dataset.productPrice;
                openOrderModal(productName, productPrice, false); // Not a cart checkout
            });
        });

        // --- Share Options Logic ---
        document.querySelectorAll('.share-options').forEach(shareOptionDiv => {
            const productName = shareOptionDiv.closest('.product-item').querySelector('h3').textContent;
            const productUrl = window.location.href; // URL of the current product page

            shareOptionDiv.querySelector('.whatsapp-share').href = `https://wa.me/?text=${encodeURIComponent(`Check out this beautiful gemstone: ${productName} - ${productUrl}`)}`;
            shareOptionDiv.querySelector('.facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(`Discover ${productName} at GEM SYNDICATE!`)}`;
            shareOptionDiv.querySelector('.twitter-share').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${productName} from GEM SYNDICATE! ${productUrl}`)}`;
            // Add more share options here if you have them (e.g., LinkedIn, Pinterest)
        });
    }


    // --- Cart Logic (Handles Add to Cart and Cart Page functionality) ---

    let cart = JSON.parse(localStorage.getItem('gemSyndicateCart')) || [];

    const saveCart = () => {
        localStorage.setItem('gemSyndicateCart', JSON.stringify(cart));
        updateCartItemCount();
    };

    const updateCartItemCount = () => {
        const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
        if (cartItemCountSpan) {
            cartItemCountSpan.textContent = totalItems;
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        alert(`${product.name} added to cart!`); // Simple confirmation
    };

    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        if (document.getElementById('cart-items-container')) { // Only re-render if on cart page
            renderCart();
        }
    };

    const clearCart = () => {
        cart = [];
        saveCart();
        if (document.getElementById('cart-items-container')) { // Only re-render if on cart page
            renderCart();
        }
        alert('Your cart has been cleared.');
    };

    const renderCart = () => {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSummary = document.getElementById('cart-summary');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        const proceedToBuyBtn = document.getElementById('proceed-to-buy-btn'); // For cart page checkout

        if (!cartItemsContainer) return; // Exit if not on cart.html

        cartItemsContainer.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartSummary.classList.add('hidden');
        } else {
            emptyCartMessage.classList.add('hidden');
            cartSummary.classList.remove('hidden');
            let total = 0;

            cart.forEach(item => {
                const itemTotal = parseFloat(item.price) * item.quantity;
                total += itemTotal;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Price: Rs. ${parseFloat(item.price).toFixed(2)}</p>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <span class="cart-item-price">Rs. ${itemTotal.toFixed(2)}</span>
                    <button class="remove-item-btn" data-product-id="${item.id}">&times;</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });

            cartTotalAmount.textContent = `Rs. ${total.toFixed(2)}`;

            // Attach event listeners to newly created remove buttons
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = event.target.dataset.productId;
                    removeFromCart(productId);
                });
            });
        }
    };

    // Attach event listeners for Add to Cart buttons on product pages
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: button.dataset.productPrice,
                image: button.dataset.productImage
            };
            addToCart(product);
        });
    });

    // Event listener for "Proceed to Buy All" on cart.html
    const proceedToBuyAllBtn = document.querySelector('.proceed-to-buy-btn');
    if (proceedToBuyAllBtn) {
        proceedToBuyAllBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before proceeding to buy.');
                return;
            }
            // Populate modal with cart items summary
            const allItemsNames = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
            const allItemsTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            
            openOrderModal(`Cart Order (${cart.length} items)`, allItemsTotal.toFixed(2), true, cart);
        });
    }

    // Event listener for "Clear Cart" on cart.html
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // --- Initializations ---
    updateCartItemCount(); // Update cart count in header on page load
    if (document.getElementById('cart-items-container')) {
        renderCart(); // Render cart items if on the cart page
    }
});
