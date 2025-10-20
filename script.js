// Video Player Management
class VideoManager {
    constructor() {
        this.players = new Map();
        this.initFeaturedVideo();
        this.initGridVideos();
    }

    // Load featured video automatically
    initFeaturedVideo() {
        const featuredWrapper = document.querySelector('.featured-video-wrapper');
        if (!featuredWrapper) return;

        const container = featuredWrapper.querySelector('.featured-video-container');
        const vimeoId = featuredWrapper.dataset.vimeoId;

        this.loadFeaturedVideo(container, vimeoId).then(player => {
            this.players.set('featured-' + vimeoId, player);
            // Auto-play the featured video
            player.play();
        });
    }

    loadFeaturedVideo(container, vimeoId) {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${vimeoId}?background=0&autoplay=1&loop=1&byline=0&title=0&portrait=0&muted=0`;
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';

            container.appendChild(iframe);

            const player = new Vimeo.Player(iframe);

            player.ready().then(() => {
                player.setVolume(0.8);
                resolve(player);
            }).catch(error => {
                console.error('Error loading featured video:', error);
                reject(error);
            });
        });
    }

    // Initialize grid videos with hover-to-play
    initGridVideos() {
        this.attachVideoListeners();
    }

    attachVideoListeners() {
        const videoItems = document.querySelectorAll('.video-grid .video-item');

        videoItems.forEach(item => {
            // Skip if already initialized
            if (item.dataset.initialized) return;
            item.dataset.initialized = 'true';

            const wrapper = item.querySelector('.video-wrapper');
            const container = item.querySelector('.video-container');
            const vimeoId = item.dataset.vimeoId;

            // Load thumbnail
            this.loadThumbnail(wrapper, vimeoId);

            let hoverTimeout;
            let player = null;
            let isLoaded = false;

            // Hover to load and play
            wrapper.addEventListener('mouseenter', () => {
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

    loadThumbnail(wrapper, vimeoId) {
        // Use Vimeo's thumbnail API
        const thumbnailUrl = `https://vumbnail.com/${vimeoId}.jpg`;
        wrapper.style.backgroundImage = `url(${thumbnailUrl})`;
    }

    loadVideo(container, vimeoId) {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${vimeoId}?background=0&autoplay=0&loop=1&byline=0&title=0&portrait=0&muted=0`;
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture';
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            container.appendChild(iframe);

            const player = new Vimeo.Player(iframe);

            player.ready().then(() => {
                player.setVolume(0.7);
                resolve(player);
            }).catch(error => {
                console.error('Error loading video:', error);
                reject(error);
            });
        });
    }

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

// Infinite Scroll
class InfiniteScroll {
    constructor(videoManager) {
        this.videoManager = videoManager;
        this.hiddenVideosContainer = document.querySelector('.hidden-videos');
        this.videoGrid = document.querySelector('.video-grid');
        this.loadingIndicator = document.querySelector('.loading-indicator');
        this.isLoading = false;
        this.videosPerLoad = 3;
        this.currentIndex = 0;

        if (this.hiddenVideosContainer) {
            this.hiddenVideos = Array.from(this.hiddenVideosContainer.querySelectorAll('.video-item'));
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            this.checkScroll();
        });
    }

    checkScroll() {
        if (this.isLoading || this.currentIndex >= this.hiddenVideos.length) return;

        const scrollPosition = window.innerHeight + window.pageYOffset;
        const triggerPoint = document.body.offsetHeight - 800;

        if (scrollPosition > triggerPoint) {
            this.loadMoreVideos();
        }
    }

    loadMoreVideos() {
        if (this.currentIndex >= this.hiddenVideos.length) return;

        this.isLoading = true;
        this.showLoading();

        setTimeout(() => {
            const videosToLoad = this.hiddenVideos.slice(
                this.currentIndex,
                this.currentIndex + this.videosPerLoad
            );

            videosToLoad.forEach((video, index) => {
                const clonedVideo = video.cloneNode(true);
                clonedVideo.style.opacity = '0';
                this.videoGrid.appendChild(clonedVideo);

                setTimeout(() => {
                    clonedVideo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    clonedVideo.style.transform = 'translateY(0)';
                    clonedVideo.style.opacity = '1';
                }, index * 100);
            });

            this.currentIndex += videosToLoad.length;

            // Re-attach video listeners for new videos
            this.videoManager.attachVideoListeners();

            this.hideLoading();
            this.isLoading = false;

            // Check if all videos are loaded
            if (this.currentIndex >= this.hiddenVideos.length) {
                this.loadingIndicator.remove();
            }
        }, 600);
    }

    showLoading() {
        this.loadingIndicator.classList.add('active');
    }

    hideLoading() {
        this.loadingIndicator.classList.remove('active');
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const videoManager = new VideoManager();
    const infiniteScroll = new InfiniteScroll(videoManager);

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
