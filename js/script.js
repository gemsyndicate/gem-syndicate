document.addEventListener('DOMContentLoaded', () => {
    // Get modal elements
    const orderModal = document.getElementById('orderModal');
    const closeButtons = document.querySelectorAll('.modal .close-button'); // Select all close buttons within modals
    const orderForm = document.getElementById('orderForm');
    const orderSuccessMessage = document.getElementById('orderSuccessMessage');
    const modalProductName = document.getElementById('modalProductName');
    const hiddenProductName = document.getElementById('hiddenProductName');
    const hiddenProductPrice = document.getElementById('hiddenProductPrice');

    // Select all buttons that should trigger the modal
    // IMPORTANT: Ensure your "Order Now" buttons on individual gemstone pages have the class 'order-button'
    const orderButtons = document.querySelectorAll('.order-button');

    // --- Modal Functions ---

    // Function to open the modal
    function openModal(productName = '', productPrice = '') {
        if (modalProductName) modalProductName.textContent = productName;
        if (hiddenProductName) hiddenProductName.value = productName;
        if (hiddenProductPrice) hiddenProductPrice.value = productPrice;

        if (orderModal) {
            orderModal.style.display = 'block'; // Show the modal
            document.body.classList.add('no-scroll'); // Add class to prevent body scrolling
        }
        if (orderForm) orderForm.style.display = 'block'; // Ensure form is visible
        if (orderSuccessMessage) orderSuccessMessage.classList.add('hidden'); // Ensure success message is hidden
    }

    // Function to close the modal
    function closeModal() {
        if (orderModal) {
            orderModal.style.display = 'none'; // Hide the modal
            document.body.classList.remove('no-scroll'); // Remove no-scroll class
        }
        if (orderForm) orderForm.reset(); // Reset form fields
    }

    // --- Event Listeners ---

    // Event listeners for opening modal from buttons (on individual gemstone pages)
    if (orderButtons.length > 0) {
        orderButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Stop default action (e.g., link navigation)
                const productName = button.dataset.productName || 'Unknown Product';
                const productPrice = button.dataset.productPrice || '$0';
                openModal(productName, productPrice);
            });
        });
    }

    // Event listeners for closing modal (all close buttons)
    if (closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
    }

    // Close modal if clicking directly on the modal background
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
            event.preventDefault(); // Prevent default browser form submission

            const form = event.target;
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree AJAX
                    }
                });

                if (response.ok) {
                    if (orderForm) orderForm.style.display = 'none'; // Hide form
                    if (orderSuccessMessage) orderSuccessMessage.classList.remove('hidden'); // Show success message
                } else {
                    alert('There was an issue submitting your order. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please check your internet connection and try again.');
            }
        });
    }

    // --- Cart Item Count (if you have this functionality) ---
    // Example: Update cart item count on load
    // const cartItemCountSpan = document.getElementById('cart-item-count');
    // if (cartItemCountSpan) {
    //     // You'll need logic here to get the actual cart item count
    //     // For now, let's assume it's set elsewhere or always 0 unless implemented
    //     cartItemCountSpan.textContent = localStorage.getItem('cartCount') || '0';
    // }
});
