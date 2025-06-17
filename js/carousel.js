document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.product-item'); // Find all product items

    carousels.forEach(carousel => {
        const container = carousel.querySelector('.carousel-container');
        const images = carousel.querySelectorAll('.carousel-images img');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');

        let imageIndex = 0;

        if (images.length <= 1) { // If there's only one image, hide the buttons
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return; // Skip to the next carousel
        }

        function updateCarousel() {
            images.forEach((img, index) => {
                img.classList.toggle('active', index === imageIndex);
            });
            // Update transform to show the correct image
            container.querySelector('.carousel-images').style.transform = translateX(${-imageIndex * 100}%);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent the click from activating the product link
                imageIndex = (imageIndex - 1 + images.length) % images.length;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent the click from activating the product link
                imageIndex = (imageIndex + 1) % images.length;
                updateCarousel();
            });
        }

        updateCarousel(); // Show the first image initially
    });
});