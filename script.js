// Custom Cursor
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    // Add trailing effect to outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: 'forwards' });
});

// Cursor Hover Effects
const interactables = document.querySelectorAll('a, button, .project-card, .dash-card, .partner-logo, .social-links a');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovered');
        cursorOutline.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovered');
        cursorOutline.classList.remove('hovered');
    });
});

// Interactive hover effects for cursor
const interactiveElements = document.querySelectorAll('a, button, .project-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// Dark/Light Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Typing Text Effect
const typingText = document.querySelector('.typing-text');
const phrases = ['Data Science Intern', 'Machine Learning Enthusiast', 'Software Developer'];
let phraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, letterIndex - 1);
        letterIndex--;
        typingDelay = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, letterIndex + 1);
        letterIndex++;
        typingDelay = 150;
    }

    if (!isDeleting && letterIndex === currentPhrase.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at the end
    } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingDelay = 500; // Pause before starting next word
    }

    setTimeout(type, typingDelay);
}

// Start typing effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Spotlight Hover Effect
document.querySelectorAll('.glass-card, .edu-item, .skill-category, .timeline-content, .project-card, .info-item').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Live Dashboard Fetching (GitHub)
async function fetchGitHubData() {
    const username = 'rahulrai-02';
    try {
        // Fetch User Data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (userRes.ok) {
            const userData = await userRes.json();
            document.getElementById('github-stats-container').innerHTML = `
                <div class="stat-item"><span class="stat-value">${userData.public_repos}</span><span class="stat-label">Repos</span></div>
                <div class="stat-item"><span class="stat-value">${userData.followers}</span><span class="stat-label">Followers</span></div>
                <div class="stat-item"><span class="stat-value">${userData.following}</span><span class="stat-label">Following</span></div>
            `;
        }

        // Fetch Repos
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`);
        if (reposRes.ok) {
            const reposData = await reposRes.json();
            const reposHtml = reposData.map(repo => `
                <a href="${repo.html_url}" target="_blank" class="repo-card">
                    <div class="repo-header">
                        <h4>${repo.name}</h4>
                        <span class="repo-lang">${repo.language || 'Code'}</span>
                    </div>
                    <p>${repo.description ? repo.description.substring(0, 50) + '...' : 'No description provided.'}</p>
                </a>
            `).join('');
            document.getElementById('github-repos-container').innerHTML = reposHtml;
        }
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
    }
}

// Reverse Building Scroll Animation
function initBuildAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const buildingBlocks = document.querySelectorAll('.glass-card, .edu-item, .stat-box, .skill-category, .dash-card, .timeline-item, .project-card, .info-item, .section-title, .build-in');
    
    buildingBlocks.forEach((el, index) => {
        el.classList.add('build-in');
        el.style.transitionDelay = `${(index % 4) * 0.15}s`;
        observer.observe(el);
    });
}

// Generate Floating Gems and Pearls
function createGems() {
    const container = document.getElementById('gem-container');
    if (!container) return;

    const colors = ['#ff007f', '#00ffff', '#39ff14', '#bf00ff']; // Gen Alpha colors

    for (let i = 0; i < 40; i++) {
        const el = document.createElement('div');
        const isPearl = Math.random() > 0.4;
        
        el.className = isPearl ? 'pearl' : 'gem';
        
        // Randomize size
        const size = Math.random() * 25 + 10; // 10px to 35px
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        
        // Randomize position
        el.style.left = `${Math.random() * 100}vw`;
        
        // Randomize animation
        const delay = Math.random() * 20;
        const duration = Math.random() * 15 + 15; // 15s to 30s
        el.style.animationDelay = `-${delay}s`;
        el.style.animationDuration = `${duration}s`;
        
        // Give gems glowing gradient colors
        if (!isPearl) {
            const c1 = colors[Math.floor(Math.random() * colors.length)];
            const c2 = colors[Math.floor(Math.random() * colors.length)];
            el.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
        }
        
        container.appendChild(el);
    }
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubData();
    createGems();
    initBuildAnimation();
});
