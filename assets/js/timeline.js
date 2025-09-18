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