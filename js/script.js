document.addEventListener('DOMContentLoaded', () => {
    // Get modal elements
    const orderModal = document.getElementById('orderModal');
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const orderForm = document.getElementById('orderForm');
    const orderSuccessMessage = document.getElementById('orderSuccessMessage');
    const modalProductName = document.getElementById('modalProductName');
    const hiddenProductName = document.getElementById('hiddenProductName');
    const hiddenProductPrice = document.getElementById('hiddenProductPrice');

    // Select all "Buy Now" and "Add to Cart" buttons
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

    // --- Event Listeners for Modal ---

    // "Buy Now" buttons open the modal with product info
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

    // Close modal when clicking any close button
    if (closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
    }

    // Close modal if clicking on the modal background
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
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (orderForm) orderForm.style.display = 'none';
                    if (orderSuccessMessage) orderSuccessMessage.classList.remove('hidden');
                } else {
                    alert('There was an issue submitting your order. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please check your internet connection and try again.');
            }
        });
    }

    // --- "Add to Cart" Button Logic ---
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                let count = parseInt(localStorage.getItem('cartCount') || '0', 10);
                localStorage.setItem('cartCount', count + 1);
                const cartItemCountSpan = document.getElementById('cart-item-count');
                if (cartItemCountSpan) {
                    cartItemCountSpan.textContent = (count + 1).toString();
                }
                alert('Added to cart!');
            });
        });
    }

    // --- Update cart count on page load ---
    const cartItemCountSpan = document.getElementById('cart-item-count');
    if (cartItemCountSpan) {
        cartItemCountSpan.textContent = localStorage.getItem('cartCount') || '0';
    }

    // --- Carousel Functionality (Optional, if present in your HTML) ---
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