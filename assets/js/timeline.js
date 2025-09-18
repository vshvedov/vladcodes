document.addEventListener('DOMContentLoaded', function() {
    const timeline = document.getElementById('career-timeline');
    if (!timeline) return;

    const timelineItems = timeline.querySelectorAll('.timeline-item');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all timeline items
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Add staggered animation delay
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Add click interaction for mobile
    timelineItems.forEach(item => {
        const content = item.querySelector('.timeline-content');
        const marker = item.querySelector('.timeline-marker');

        item.addEventListener('click', function() {
            // Remove active class from all items
            timelineItems.forEach(otherItem => {
                otherItem.classList.remove('timeline-active');
            });

            // Add active class to clicked item
            this.classList.add('timeline-active');

            // Add a pulse effect to the marker
            marker.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                marker.style.animation = '';
            }, 600);
        });
    });

    // Smooth scroll to timeline when page loads with hash
    if (window.location.hash === '#career-timeline') {
        setTimeout(() => {
            timeline.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
});

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.4); }
        100% { transform: translateX(-50%) scale(1); }
    }

    .timeline-active .timeline-content {
        border-color: var(--link-color);
        box-shadow: 0 5px 25px rgba(107, 163, 245, 0.2);
    }

    .timeline-active .timeline-marker {
        background: var(--link-color);
        transform: translateX(-50%) scale(1.1);
        box-shadow: 0 0 20px rgba(107, 163, 245, 0.4);
    }
`;
document.head.appendChild(style);