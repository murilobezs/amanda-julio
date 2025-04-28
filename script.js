document.addEventListener('DOMContentLoaded', () => {
    // Existing animation code
    const messages = document.querySelectorAll('.message p');
    messages.forEach((message, index) => {
        message.style.opacity = '0';
        message.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            message.style.transition = 'all 0.5s ease';
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, index * 500);
    });

    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    let currentIndex = 0;
    let autoplayInterval;

    const moveToSlide = (index) => {
        const slideWidth = window.innerWidth <= 414 ? 350 : 310; // Image width + gap
        let offset;
        
        if (index >= slides.length) {
            index = 0;
            offset = 0;
        } else if (index < 0) {
            index = slides.length - 1;
            offset = -(slideWidth * index);
        } else {
            offset = -(slideWidth * index);
        }
        
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(${offset}px)`;
        currentIndex = index;
        currentTranslate = offset;
        prevTranslate = offset;
    };

    const startAutoplay = () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 3000); // 3 seconds
    };

    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    };

    nextButton.addEventListener('click', () => {
        stopAutoplay();
        moveToSlide(currentIndex + 1);
        startAutoplay();
    });

    prevButton.addEventListener('click', () => {
        stopAutoplay();
        moveToSlide(currentIndex - 1);
        startAutoplay();
    });

    // Start autoplay and show first slide as active
    moveToSlide(0);
    startAutoplay();

    // Stop autoplay on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    // Touch handling variables
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let lastX = 0;

    // Touch event handlers
    track.addEventListener('touchstart', dragStart);
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('touchmove', drag);

    // Mouse event handlers for testing
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('mouseleave', dragEnd);
    track.addEventListener('mousemove', drag);

    function dragStart(e) {
        stopAutoplay();
        isDragging = true;
        startPos = getPositionX(e);
        prevTranslate = currentTranslate;
        track.style.transition = 'none';
    }

    function drag(e) {
        if (isDragging) {
            const currentPosition = getPositionX(e);
            const diff = currentPosition - startPos;
            currentTranslate = prevTranslate + diff;
            track.style.transform = `translateX(${currentTranslate}px)`;
        }
    }

    function dragEnd() {
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        const threshold = window.innerWidth <= 414 ? 50 : 100;
        
        if (Math.abs(movedBy) > threshold) {
            if (movedBy < 0) {
                moveToSlide(currentIndex + 1);
            } else {
                moveToSlide(currentIndex - 1);
            }
        } else {
            moveToSlide(currentIndex);
        }
        
        startAutoplay(); // Restart autoplay after interaction
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImage = modal.querySelector('.modal-image');
    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');

    function openModal(imageSrc) {
        modalImage.src = imageSrc;
        modal.classList.add('active');
        stopAutoplay(); // Stop carousel when modal is open
    }

    function closeModal() {
        modal.classList.remove('active');
        startAutoplay(); // Resume carousel
    }

    // Add click handlers for images
    slides.forEach(slide => {
        slide.addEventListener('click', () => openModal(slide.src));
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
