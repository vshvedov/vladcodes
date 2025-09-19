document.addEventListener('DOMContentLoaded', function() {
    const timeline = document.getElementById('career-timeline');

    // Enhanced Intersection Observer for all animated elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Add special handling for different element types
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.style.animationPlayState = 'running';
                } else if (entry.target.tagName === 'LI') {
                    entry.target.style.animationPlayState = 'running';
                } else if (entry.target.tagName === 'P') {
                    entry.target.style.animationPlayState = 'running';
                }
            }
        });
    }, observerOptions);

    // Observe timeline items if timeline exists
    if (timeline) {
        const timelineItems = timeline.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Observe all animatable elements on the page
    const animatableElements = document.querySelectorAll(
        '.about__content h2, .about__content p, .about__content ul li, .about__content'
    );

    animatableElements.forEach(element => {
        // Pause animations initially for scroll-triggered reveal
        if (element.tagName === 'LI' || element.tagName === 'P') {
            element.style.animationPlayState = 'paused';
        }
        observer.observe(element);
    });

    // Add staggered animation delay for timeline items
    if (timeline) {
        const timelineItems = timeline.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.05}s`;
        });
    }

    // Add click interaction for mobile (timeline only)
    if (timeline) {
        const timelineItems = timeline.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');

            item.addEventListener('click', function() {
                // Remove active class from all items
                timelineItems.forEach(otherItem => {
                    otherItem.classList.remove('timeline-active');
                });

                // Add active class to clicked item
                this.classList.add('timeline-active');

                // Add a pulse effect to the content
                content.style.animation = 'contentPulse 0.6s ease-out';
                setTimeout(() => {
                    content.style.animation = '';
                }, 600);
            });
        });
    }

    // Smooth scroll to timeline when page loads with hash
    if (timeline && window.location.hash === '#career-timeline') {
        setTimeout(() => {
            timeline.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    // Add parallax effect to page title
    const pageTitle = document.querySelector('.about__title');
    if (pageTitle) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            pageTitle.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add hover effects to skill cards
    const skillCards = document.querySelectorAll('.about__content ul:first-of-type li');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05) rotateY(5deg)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
        });
    });

    // Add typing effect to section headers
    const headers = document.querySelectorAll('.about__content h2');
    headers.forEach((header, index) => {
        const text = header.textContent;
        header.textContent = '';
        header.style.borderRight = '2px solid var(--link-color)';

        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                header.textContent += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        header.style.borderRight = 'none';
                    }, 500);
                }
            }, 50);
        }, index * 200);
    });
});

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes contentPulse {
        0% { transform: translateY(-8px) scale(1.02); }
        50% { transform: translateY(-12px) scale(1.05); }
        100% { transform: translateY(-8px) scale(1.02); }
    }

    .timeline-active .timeline-content {
        border-color: var(--link-color);
        box-shadow: 0 8px 30px rgba(107, 163, 245, 0.3);
        transform: translateY(-8px) scale(1.02);
    }
`;
document.head.appendChild(style);