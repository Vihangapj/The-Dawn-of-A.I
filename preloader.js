// Enhanced Blue Preloader JavaScript
class BluePreloader {
    constructor() {
        this.progress = 0;
        this.isComplete = false;
        this.loadingStages = [
            { text: 'Initializing...', range: [0, 15] },
            { text: 'Loading assets...', range: [15, 40] },
            { text: 'Connecting to server...', range: [40, 60] },
            { text: 'Preparing interface...', range: [60, 80] },
            { text: 'Finalizing...', range: [80, 95] },
            { text: 'Almost ready...', range: [95, 100] }
        ];
        
        this.elements = {
            preloader: null,
            percentage: null,
            progressBar: null,
            statusText: null,
            particles: null,
            loadingText: null,
            loaderContainer: null
        };

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.createParticles();
            this.startLoading();
            this.setupInteractions();
            this.setupTypewriter();
        });
    }

    setupElements() {
        this.elements.preloader = document.getElementById('preloader');
        this.elements.percentage = document.getElementById('percentage');
        this.elements.progressBar = document.getElementById('progress-bar');
        this.elements.statusText = document.getElementById('status-text');
        this.elements.particles = document.getElementById('particles');
        this.elements.loadingText = document.querySelector('.loading-text');
        this.elements.loaderContainer = document.querySelector('.loader-container');

        // Add loading class to body
        document.body.classList.add('loading');
    }

    createParticles() {
        if (!this.elements.particles) return;

        const particleCount = window.innerWidth <= 768 ? 12 : 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 6 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            
            const animationDelay = Math.random() * 10;
            const animationDuration = Math.random() * 4 + 6;
            
            particle.style.animationDelay = animationDelay + 's';
            particle.style.animationDuration = animationDuration + 's';
            particle.style.animation = `float ${animationDuration}s linear infinite`;
            particle.style.animationDelay = animationDelay + 's';
            
            this.elements.particles.appendChild(particle);
        }
    }

    updateProgress() {
        if (this.progress >= 100 || this.isComplete) {
            this.completeLoading();
            return;
        }

        // Find current stage
        const currentStage = this.loadingStages.find(stage => 
            this.progress >= stage.range[0] && this.progress <= stage.range[1]
        );
        
        if (currentStage && this.elements.statusText) {
            this.elements.statusText.textContent = currentStage.text;
        }

        // Update UI elements
        if (this.elements.percentage) {
            this.elements.percentage.textContent = Math.floor(this.progress) + '%';
        }
        
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = this.progress + '%';
        }
        
        // Variable progress speed for realism
        let increment;
        if (this.progress < 30) {
            increment = Math.random() * 2 + 1; // Fast start
        } else if (this.progress < 70) {
            increment = Math.random() * 1.5 + 0.5; // Medium
        } else if (this.progress < 95) {
            increment = Math.random() * 1 + 0.3; // Slower near end
        } else {
            increment = Math.random() * 0.5 + 0.1; // Very slow finish
        }
        
        this.progress += increment;
        
        setTimeout(() => this.updateProgress(), 150);
    }

    startLoading() {
        // Start progress animation
        this.updateProgress();

        // Alternative: Use real page loading
        this.trackRealLoading();
    }

    trackRealLoading() {
        // Track actual resource loading
        const images = document.images;
        const stylesheets = document.styleSheets;
        
        let assetsLoaded = 0;
        let totalAssets = images.length;

        // Track image loading
        Array.from(images).forEach(img => {
            if (img.complete) {
                assetsLoaded++;
            } else {
                img.addEventListener('load', () => {
                    assetsLoaded++;
                    this.updateRealProgress(assetsLoaded, totalAssets);
                });
                img.addEventListener('error', () => {
                    assetsLoaded++;
                    this.updateRealProgress(assetsLoaded, totalAssets);
                });
            }
        });

        // Fallback for when window loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (!this.isComplete) {
                    this.progress = 100;
                }
            }, 15000); // Minimum display time
        });
    }

    updateRealProgress(loaded, total) {
        if (total > 0) {
            const realProgress = (loaded / total) * 100;
            this.progress = Math.max(this.progress, realProgress);
        }
    }

    completeLoading() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        
        if (this.elements.statusText) {
            this.elements.statusText.textContent = 'Complete!';
        }

        // Fade out animation
        setTimeout(() => {
            if (this.elements.preloader) {
                this.elements.preloader.classList.add('fade-out');
            }
            
            document.body.classList.remove('loading');
            
            // Remove preloader from DOM after animation
            setTimeout(() => {
                if (this.elements.preloader && this.elements.preloader.parentNode) {
                    this.elements.preloader.remove();
                }
                
                // Trigger custom event for when loading is complete
                document.dispatchEvent(new CustomEvent('preloaderComplete'));
            }, 600);
        }, 500);
    }

    setupTypewriter() {
        if (!this.elements.loadingText) return;

        const text = "Loading";
        let i = 0;
        
        const typeEffect = () => {
            if (i <= text.length) {
                this.elements.loadingText.textContent = text.substring(0, i);
                i++;
            } else {
                i = 0;
            }
            
            if (!this.isComplete) {
                setTimeout(typeEffect, 300);
            }
        };
        
        typeEffect();
    }

    setupInteractions() {
        // Mouse interaction for 3D effect
        document.addEventListener('mousemove', (e) => {
            if (!this.elements.loaderContainer || this.isComplete) return;
            
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            
            this.elements.loaderContainer.style.transform = 
                `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        });

        // Reset transform on mouse leave
        document.addEventListener('mouseleave', () => {
            if (this.elements.loaderContainer && !this.isComplete) {
                this.elements.loaderContainer.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
            }
        });
    }

    // Public method to manually complete loading
    forceComplete() {
        this.progress = 100;
        this.completeLoading();
    }

    // Public method to update progress manually
    setProgress(value) {
        if (value >= 0 && value <= 100) {
            this.progress = value;
            
            if (this.elements.percentage) {
                this.elements.percentage.textContent = Math.floor(value) + '%';
            }
            
            if (this.elements.progressBar) {
                this.elements.progressBar.style.width = value + '%';
            }
        }
    }

    // Public method to update status text
    setStatus(text) {
        if (this.elements.statusText) {
            this.elements.statusText.textContent = text;
        }
    }
}

// Initialize preloader
const preloader = new BluePreloader();

// Expose preloader instance for manual control
window.BluePreloader = preloader;

// Example usage for manual control:
// window.BluePreloader.setProgress(50);
// window.BluePreloader.setStatus('Custom loading message...');
// window.BluePreloader.forceComplete();

// Listen for preloader completion
document.addEventListener('preloaderComplete', function() {
    console.log('Preloader animation completed!');
    // Add your custom code here for when loading is done
});

// Alternative simple initialization (uncomment if you want basic auto-hide)
/*
document.addEventListener('DOMContentLoaded', function() {
    // Simple auto-hide after page load
    window.addEventListener('load', function() {
        setTimeout(function() {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('fade-out');
                document.body.classList.remove('loading');
                
                setTimeout(function() {
                    preloader.remove();
                }, 600);
            }
        }, 2000); // Minimum display time
    });
});
*/