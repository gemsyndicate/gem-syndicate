document.addEventListener('DOMContentLoaded', () => {
    // Select the modal and its core elements
    const orderModal = document.getElementById('orderModal');
    const closeButton = document.querySelector('#orderModal .close-button');
    const orderForm = document.getElementById('orderForm');
    const orderSuccessMessage = document.getElementById('orderSuccessMessage');
    const modalProductName = document.getElementById('modalProductName');
    const hiddenProductName = document.getElementById('hiddenProductName');
    const hiddenProductPrice = document.getElementById('hiddenProductPrice');

    // Select the "Buy Now" button.
    // IMPORTANT: This version assumes your "Buy Now" button might have an ID 'buyNowBtn'
    // OR a general class like 'buy-now-btn'. If your button has a different ID/class,
    // you'll need to update this line accordingly.
    const buyNowBtn = document.getElementById('buyNowBtn') || document.querySelector('.buy-now-btn');


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
        if (orderSuccessMessage) orderSuccessMessage.classList.add('hidden'); // Ensure success message is hidden
        if (orderForm) orderForm.style.display = 'block'; // Show form again for next use
    }


    // --- Event Listeners ---

    // Event listener for opening modal from the "Buy Now" button
    if (buyNowBtn) { // Check if the button exists on the page
        buyNowBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Stop default action (e.g., link navigation)

            // This part assumes product name and price might be found in other elements on the page,
            // or need to be hardcoded if your buttons don't use data-attributes.
            const productNameElement = document.querySelector('.product-detail h2'); // Adjust selector if needed
            const productPriceElement = document.querySelector('.product-detail .price'); // Adjust selector if needed

            const productName = productNameElement ? productNameElement.textContent.trim() : 'Unknown Product';
            const productPrice = productPriceElement ? productPriceElement.textContent.trim() : '$0';

            openModal(productName, productPrice);
        });
    }

    // Event listener for closing modal via close button
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
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
                    headers: { 'Accept': 'application/json' }
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

    // --- Cart Item Count (Placeholder) ---
    // This part should generally be handled separately from modal logic.
    const cartItemCountSpan = document.getElementById('cart-item-count');
    if (cartItemCountSpan) {
        // You'll need your actual cart item count logic here.
        // For now, it's just a placeholder.
        cartItemCountSpan.textContent = '0';
    }
});
