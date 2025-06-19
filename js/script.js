document.addEventListener('DOMContentLoaded', () => {
    // --- Modal Elements ---
    const orderModal = document.getElementById('orderModal');
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const orderForm = document.getElementById('orderForm');
    const orderSuccessMessage = document.getElementById('orderSuccessMessage');
    const modalProductName = document.getElementById('modalProductName');
    const hiddenProductName = document.getElementById('hiddenProductName');
    const hiddenProductPrice = document.getElementById('hiddenProductPrice');

    // --- Product Buttons ---
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // --- Modal Functions ---
    function openModal(productName = '', productPrice = '') {
        if (modalProductName) modalProductName.textContent = productName;
        if (hiddenProductName) hiddenProductName.value = productName;
        if (hiddenProductPrice) hiddenProductPrice.value = productPrice;
        if (orderModal) {
            orderModal.style.display = 'block';
            document.body.classList.add('no-scroll');
        }
        if (orderForm) orderForm.style.display = 'block';
        if (orderSuccessMessage) orderSuccessMessage.classList.add('hidden');
    }
    function closeModal() {
        if (orderModal) {
            orderModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
        if (orderForm) orderForm.reset();
        if (orderSuccessMessage) orderSuccessMessage.classList.add('hidden');
    }

    // --- Buy Now Button Modal Trigger ---
    if (buyNowButtons.length > 0) {
        buyNowButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const productName = button.dataset.productName || 'Unknown Product';
                const productPrice = button.dataset.productPrice || '$0';
                openModal(productName, productPrice);
            });
        });
    }

    // --- Modal Close Buttons ---
    if (closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
    }
    if (orderModal) {
        orderModal.addEventListener('click', (event) => {
            if (event.target === orderModal) {
                closeModal();
            }
        });
    }

    // --- Formspree Submission Handling ---
    if (orderForm) {
        orderForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    orderForm.style.display = 'none';
                    orderSuccessMessage.classList.remove('hidden');
                } else {
                    alert('There was an issue submitting your order. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please check your internet connection and try again.');
            }
        });
    }

    // --- Add to Cart Functionality ---
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                // Gather product info
                const productId = button.dataset.productId;
                const productName = button.dataset.productName;
                const productPrice = button.dataset.productPrice;
                const productImage = button.dataset.productImage;

                // Read and update cart from localStorage
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push({ productId, productName, productPrice, productImage });
                localStorage.setItem('cart', JSON.stringify(cart));
                localStorage.setItem('cartCount', cart.length);

                // Update cart count in header
                const cartItemCountSpan = document.getElementById('cart-item-count');
                if (cartItemCountSpan) {
                    cartItemCountSpan.textContent = cart.length.toString();
                }
                alert('Added to cart!');
            });
        });
    }

    // --- Update Cart Count on Page Load ---
    const cartItemCountSpan = document.getElementById('cart-item-count');
    if (cartItemCountSpan) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemCountSpan.textContent = cart.length.toString();
    }

    // --- Carousel Functionality (Optional) ---
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.carousel-images img');
        let currentIndex = 0;
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');

        function showImage(index) {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        }
        showImage(currentIndex);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            });
        }
    });
});