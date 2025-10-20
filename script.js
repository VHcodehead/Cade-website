// Video Player Management
class VideoManager {
    constructor() {
        this.players = new Map();
        this.init();
    }

    init() {
        const videoItems = document.querySelectorAll('.video-item');

        videoItems.forEach(item => {
            const wrapper = item.querySelector('.video-wrapper');
            const container = item.querySelector('.video-container');
            const vimeoId = item.dataset.vimeoId;

            let hoverTimeout;
            let player = null;
            let isLoaded = false;

            // Hover to load and play
            wrapper.addEventListener('mouseenter', () => {
                // Delay loading slightly to avoid accidental hovers
                hoverTimeout = setTimeout(() => {
                    if (!isLoaded) {
                        this.loadVideo(container, vimeoId).then(newPlayer => {
                            player = newPlayer;
                            isLoaded = true;
                            this.players.set(vimeoId, player);
                            player.play();
                        });
                    } else if (player) {
                        player.play();
                    }
                }, 200);
            });

            // Pause on mouse leave
            wrapper.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);

                if (player && isLoaded) {
                    player.pause();
                }
            });
        });
    }

    loadVideo(container, vimeoId) {
        return new Promise((resolve, reject) => {
            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${vimeoId}?background=0&autoplay=0&loop=1&byline=0&title=0&portrait=0&muted=0`;
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture';
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            container.appendChild(iframe);

            // Initialize Vimeo player
            const player = new Vimeo.Player(iframe);

            player.ready().then(() => {
                // Set volume
                player.setVolume(0.7);
                resolve(player);
            }).catch(error => {
                console.error('Error loading video:', error);
                reject(error);
            });
        });
    }

    // Pause all videos except the one playing
    pauseAllExcept(exceptId) {
        this.players.forEach((player, id) => {
            if (id !== exceptId) {
                player.pause();
            }
        });
    }
}

// Smooth scroll for navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.video-item').forEach(item => {
        observer.observe(item);
    });
}

// Parallax effect on scroll
function initParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero');

                if (hero && scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                    hero.style.opacity = 1 - (scrolled / window.innerHeight);
                }

                ticking = false;
            });

            ticking = true;
        }
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const videoManager = new VideoManager();
    initSmoothScroll();
    initScrollAnimations();
    initParallax();
    initHeaderScroll();

    console.log('VLACOVISION website loaded');
});

// Performance optimization: Preload Vimeo player on first interaction
let vimeoPreloaded = false;
document.addEventListener('mousemove', () => {
    if (!vimeoPreloaded) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://player.vimeo.com';
        document.head.appendChild(link);
        vimeoPreloaded = true;
    }
}, { once: true });
