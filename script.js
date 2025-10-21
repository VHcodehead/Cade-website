// Video Player Management
class VideoManager {
    constructor() {
        this.players = new Map();
        // Featured video now uses hardcoded iframe in HTML
        // this.initFeaturedVideo();
        this.initGridVideos();
    }

    // Load featured video automatically
    initFeaturedVideo() {
        const featuredWrapper = document.querySelector('.featured-video-wrapper');
        if (!featuredWrapper) {
            console.error('Featured video wrapper not found!');
            return;
        }

        const container = featuredWrapper.querySelector('.featured-video-container');
        const vimeoId = featuredWrapper.dataset.vimeoId;

        console.log('Loading featured video with ID:', vimeoId);

        this.loadFeaturedVideo(container, vimeoId).then(player => {
            this.players.set('featured-' + vimeoId, player);
            console.log('Featured video loaded successfully');
            // Auto-play the featured video
            player.play().then(() => {
                console.log('Featured video playing');
            }).catch(err => {
                console.error('Autoplay failed:', err);
            });
        }).catch(err => {
            console.error('Failed to load featured video:', err);
        });
    }

    loadFeaturedVideo(container, vimeoId) {
        return new Promise((resolve, reject) => {
            console.log('Creating iframe for video:', vimeoId);

            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&autopause=0&muted=1&controls=1&byline=0&title=0&portrait=0`;
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';

            console.log('Appending iframe to container');
            container.appendChild(iframe);

            console.log('Initializing Vimeo player');
            const player = new Vimeo.Player(iframe);

            player.ready().then(() => {
                console.log('Vimeo player ready');
                // Start muted for autoplay compliance
                player.setVolume(0);
                player.play().then(() => {
                    console.log('Video started playing');
                }).catch(err => {
                    console.error('Play failed:', err);
                });
                resolve(player);
            }).catch(error => {
                console.error('Player ready failed:', error);
                reject(error);
            });
        });
    }

    // Initialize grid videos with hover-to-play
    initGridVideos() {
        this.attachVideoListeners();
        this.addUnmuteButtons();
    }

    // Add unmute buttons to all grid videos
    addUnmuteButtons() {
        const videoItems = document.querySelectorAll('.video-grid .video-item');
        videoItems.forEach(item => {
            const vimeoId = item.dataset.vimeoId;
            const wrapper = item.querySelector('.video-wrapper');

            if (!wrapper.querySelector('.unmute-button')) {
                const button = document.createElement('div');
                button.className = 'unmute-button';
                button.dataset.videoId = vimeoId;
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="muted-icon">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="unmuted-icon" style="display: none;">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                `;
                wrapper.appendChild(button);
            }
        });
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
        // Use Vimeo's oEmbed API to get thumbnail
        fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`)
            .then(response => response.json())
            .then(data => {
                if (data.thumbnail_url) {
                    // Get larger thumbnail (replace _640 with _1280)
                    const largeThumb = data.thumbnail_url.replace('_640', '_1280');
                    wrapper.style.backgroundImage = `url(${largeThumb})`;
                    console.log('Thumbnail loaded for video:', vimeoId);
                }
            })
            .catch(err => {
                console.error('Failed to load thumbnail for', vimeoId, err);
                // Fallback to vumbnail.com
                wrapper.style.backgroundImage = `url(https://vumbnail.com/${vimeoId}.jpg)`;
            });
    }

    loadVideo(container, vimeoId) {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${vimeoId}?controls=0&autoplay=0&loop=1&byline=0&title=0&portrait=0&muted=1&autopause=0`;
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture';
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            container.appendChild(iframe);

            const player = new Vimeo.Player(iframe);

            player.ready().then(() => {
                player.setVolume(0);
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

// Parallax effect on scroll - DISABLED for cleaner experience
function initParallax() {
    // Disabled parallax effect
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
            this.videoManager.addUnmuteButtons();

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

// Unmute Button Handler
function initUnmuteButtons() {
    // Handle featured video unmute
    const featuredButton = document.querySelector('.unmute-button[data-video-id="featured"]');
    if (featuredButton) {
        const iframe = document.getElementById('featured-video-iframe');
        const player = new Vimeo.Player(iframe);
        let isMuted = true;

        featuredButton.addEventListener('click', () => {
            const mutedIcon = featuredButton.querySelector('.muted-icon');
            const unmutedIcon = featuredButton.querySelector('.unmuted-icon');

            if (isMuted) {
                player.setVolume(0.7);
                mutedIcon.style.display = 'none';
                unmutedIcon.style.display = 'block';
            } else {
                player.setVolume(0);
                mutedIcon.style.display = 'block';
                unmutedIcon.style.display = 'none';
            }
            isMuted = !isMuted;
        });
    }

    // Handle grid video unmute buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.unmute-button') && !e.target.closest('[data-video-id="featured"]')) {
            const button = e.target.closest('.unmute-button');
            const vimeoId = button.dataset.videoId;
            const mutedIcon = button.querySelector('.muted-icon');
            const unmutedIcon = button.querySelector('.unmuted-icon');

            // Find the player for this video (will be created on hover)
            const videoItem = button.closest('.video-item');
            const container = videoItem.querySelector('.video-container');

            if (container.querySelector('iframe')) {
                const iframe = container.querySelector('iframe');
                const player = new Vimeo.Player(iframe);

                player.getVolume().then((volume) => {
                    if (volume === 0) {
                        player.setVolume(0.7);
                        mutedIcon.style.display = 'none';
                        unmutedIcon.style.display = 'block';
                    } else {
                        player.setVolume(0);
                        mutedIcon.style.display = 'block';
                        unmutedIcon.style.display = 'none';
                    }
                });
            }
        }
    });
}

// Bouncing Logo Animation
function initBouncingLogo() {
    const bouncingLogo = document.getElementById('bouncing-logo');
    const headerLogo = document.getElementById('header-logo');

    if (!bouncingLogo) return;

    // Start position (center of screen)
    let x = window.innerWidth / 2 - 50;
    let y = window.innerHeight / 2 - 20;

    // Random velocity
    let vx = (Math.random() - 0.5) * 10;
    let vy = (Math.random() - 0.5) * 10;

    const speed = 2; // Slower speed for more graceful animation
    vx = vx > 0 ? speed : -speed;
    vy = vy > 0 ? speed : -speed;

    let bounceCount = 0;
    const maxBounces = 8; // Bounce 8 times before landing
    let rotation = 0;

    function animate() {
        if (bounceCount >= maxBounces) {
            // Land in header center
            landInHeader();
            return;
        }

        x += vx;
        y += vy;
        rotation += 3; // Slower spin for more graceful animation

        const logoWidth = bouncingLogo.offsetWidth;
        const logoHeight = bouncingLogo.offsetHeight;

        // Bounce off edges
        if (x <= 0 || x + logoWidth >= window.innerWidth) {
            vx = -vx;
            bounceCount++;
        }
        if (y <= 0 || y + logoHeight >= window.innerHeight) {
            vy = -vy;
            bounceCount++;
        }

        // Keep within bounds
        x = Math.max(0, Math.min(x, window.innerWidth - logoWidth));
        y = Math.max(0, Math.min(y, window.innerHeight - logoHeight));

        bouncingLogo.style.left = x + 'px';
        bouncingLogo.style.top = y + 'px';
        bouncingLogo.style.transform = `rotate(${rotation}deg)`;

        requestAnimationFrame(animate);
    }

    function landInHeader() {
        const header = document.querySelector('.header');
        const headerRect = header.getBoundingClientRect();
        const targetX = window.innerWidth / 2 - bouncingLogo.offsetWidth / 2;
        const targetY = headerRect.top + headerRect.height / 2 - bouncingLogo.offsetHeight / 2;

        bouncingLogo.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1), transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
        bouncingLogo.style.left = targetX + 'px';
        bouncingLogo.style.top = targetY + 'px';
        bouncingLogo.style.transform = 'rotate(0deg)'; // Stop rotation

        setTimeout(() => {
            bouncingLogo.style.opacity = '0';
            headerLogo.style.opacity = '1';
            headerLogo.style.transition = 'opacity 0.5s ease';

            setTimeout(() => {
                bouncingLogo.remove();
            }, 500);
        }, 1000);
    }

    animate();
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const videoManager = new VideoManager();
    const infiniteScroll = new InfiniteScroll(videoManager);

    initSmoothScroll();
    initScrollAnimations();
    initParallax();
    initHeaderScroll();
    initUnmuteButtons();
    initBouncingLogo();

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
