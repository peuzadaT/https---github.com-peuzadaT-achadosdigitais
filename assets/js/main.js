/*
 * SCRIPT: Lógica do Carrossel 3D
 * PROPÓSITO: Controlar a interatividade, rotação e eventos do carrossel na página inicial.
 */

// Garante que o script só rode após o carregamento completo do HTML.
document.addEventListener("DOMContentLoaded", function () {
    
    // Seleciona os elementos do DOM apenas se eles existirem na página.
    const carousel = document.getElementById("memory-carousel");
    if (!carousel) return; // Se o carrossel não está na página, não faz nada.

    const cards = document.querySelectorAll(".memory-card");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    let currentIndex = 0;
    let startX;
    let isDragging = false;
    let theta = 0;
    const totalCards = cards.length;
    let radius = getCarouselRadius();

    function getCarouselRadius() {
        if (window.innerWidth <= 576) return 250;
        if (window.innerWidth <= 768) return 300;
        return 400;
    }

    function arrangeCards() {
        const angle = 360 / totalCards;
        cards.forEach((card, index) => {
            const cardAngle = angle * index;
            card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
            card.dataset.index = index;
        });
    }

    function rotateCarousel() {
        carousel.style.transform = `rotateY(${theta}deg)`;
        const anglePerCard = 360 / totalCards;
        currentIndex = Math.round(Math.abs(theta / anglePerCard)) % totalCards;
        if (currentIndex >= totalCards) currentIndex = 0;
    }

    function nextCard() {
        theta -= 360 / totalCards;
        rotateCarousel();
    }

    function prevCard() {
        theta += 360 / totalCards;
        rotateCarousel();
    }

    function flipCard(e) {
        const card = e.currentTarget;
        const cardIndex = parseInt(card.dataset.index);
        if (cardIndex === currentIndex) {
            card.classList.toggle("flipped");
        }
    }

    function dragStart(e) {
        e.preventDefault();
        isDragging = true;
        startX = e.pageX || e.touches[0].pageX;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.pageX || (e.touches ? e.touches[0].pageX : startX);
        const diffX = currentX - startX;
        const sensitivity = 0.5;
        const newTheta = theta + diffX * sensitivity;
        carousel.style.transform = `rotateY(${newTheta}deg)`;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        const currentX = e.pageX || (e.changedTouches ? e.changedTouches[0].pageX : startX);
        const diffX = currentX - startX;
        
        const anglePerCard = 360 / totalCards;
        const currentTheta = parseFloat(carousel.style.transform.replace(/[^0-9-.]/g, ''));
        
        if (Math.abs(diffX) > 50) { // Threshold de swipe
            if (diffX > 0) {
                theta += anglePerCard; // Swipe para a direita
            } else {
                theta -= anglePerCard; // Swipe para a esquerda
            }
        }
        
        // Snap para o card mais próximo
        theta = Math.round(theta / anglePerCard) * anglePerCard;
        rotateCarousel();
    }

    function handleKeyDown(e) {
        if (e.key === "ArrowLeft") {
            nextCard();
        } else if (e.key === "ArrowRight") {
            prevCard();
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const currentCard = document.querySelector(`.memory-card[data-index="${currentIndex}"]`);
            if (currentCard) {
                currentCard.classList.toggle("flipped");
            }
        }
    }

    // Inicialização
    function init() {
        arrangeCards();
        prevBtn.addEventListener("click", prevCard);
        nextBtn.addEventListener("click", nextCard);
        cards.forEach((card) => card.addEventListener("click", flipCard));
        carousel.addEventListener("mousedown", dragStart);
        carousel.addEventListener("touchstart", dragStart, { passive: true });
        document.addEventListener("mousemove", drag);
        document.addEventListener("touchmove", drag, { passive: false });
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);
        document.addEventListener("keydown", handleKeyDown);
        
        window.addEventListener("resize", () => {
            radius = getCarouselRadius();
            arrangeCards();
            rotateCarousel();
        });
    }

    init();
});