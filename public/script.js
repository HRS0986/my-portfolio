// DOM Elements
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

// Typewriter state
let roles = [];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;
const typewriterElement = document.getElementById('typewriter');

// Theme Handling
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize Theme
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Event Listeners for Theme
if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

// Mobile Menu Toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.add('hidden');
    });
});

// Navbar Blur Effect on Scroll
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }
    }
});

// Typewriter Animation logic
function type() {
    if (!typewriterElement || roles.length === 0) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Data Loading and DOM Population
function populatePortfolio(data) {
    try {
        // 1. Personal Info
        const { personal, socials } = data;
        document.getElementById('nav-first-name').textContent = personal.firstName;
        document.getElementById('nav-last-name').textContent = personal.lastName;
        document.getElementById('hero-first-name').textContent = `\u00A0${personal.firstName}`;
        document.getElementById('hero-sr-tagline').textContent = personal.heroTagline;
        document.getElementById('hero-about').textContent = personal.about;
        document.getElementById('mockup-name').textContent = `'${personal.firstName}'`;
        document.getElementById('contact-availability').textContent = personal.availability;
        document.getElementById('contact-email').textContent = personal.email;
        document.getElementById('contact-location').textContent = personal.location;
        document.getElementById('footer-first-name').textContent = personal.firstName;
        document.getElementById('footer-last-name').textContent = ` ${personal.lastName}`;
        document.getElementById('footer-copyright').textContent = `© ${personal.copyrightYear} ${personal.firstName} ${personal.lastName}. All rights reserved.`;

        // 2. Typewriter Roles
        roles = personal.typewriterRoles;
        setTimeout(type, 1000);

        // 3. Socials
        const heroSocials = document.getElementById('hero-socials');
        const contactSocials = document.getElementById('contact-socials');

        socials.forEach(social => {
            // Hero socials
            const heroLink = document.createElement('a');
            heroLink.href = social.url;
            heroLink.target = '_blank';
            heroLink.rel = 'noopener noreferrer';
            heroLink.className = `text-gray-400 ${social.color} transition-colors text-2xl`;
            heroLink.innerHTML = `<i class="${social.icon}"></i>`;
            heroSocials.appendChild(heroLink);

            // Contact socials
            const contactLink = document.createElement('a');
            contactLink.href = social.url;
            contactLink.target = '_blank';
            contactLink.rel = 'noopener noreferrer';
            contactLink.className = 'w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors';
            contactLink.innerHTML = `<i class="${social.icon}"></i>`;
            contactSocials.appendChild(contactLink);
        });

        // 4. Experience
        const expList = document.getElementById('experience-list');
        data.experience.forEach((exp, index) => {
            const expItem = document.createElement('div');
            expItem.className = 'md:flex items-start group';
            expItem.innerHTML = `
                <div class="absolute -left-[5px] mt-1.5 w-3 h-3 ${index === 0 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'} rounded-full border border-white dark:border-gray-900 md:hidden"></div>
                <div class="md:w-1/3 md:text-right md:pr-8 mb-2 md:mb-0">
                    <span class="text-sm font-semibold ${index === 0 ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'} tracking-wide uppercase">${exp.period}</span>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-1">${exp.role}</h3>
                    <p class="text-gray-500 dark:text-gray-400">${exp.company}</p>
                </div>
                <div class="hidden md:block absolute left-1/3 ml-[-6px] w-3 h-3 ${index === 0 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'} rounded-full border-2 border-white dark:border-gray-900 z-10 mt-1.5 ${index === 0 ? 'group-hover:scale-125 transition-transform' : ''}"></div>
                <div class="md:w-2/3 md:pl-8">
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                        <p class="text-gray-600 dark:text-gray-300">${exp.description}</p>
                        <div class="mt-4 flex flex-wrap gap-2">
                            ${exp.skills.map(s => `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md">${s}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            expList.appendChild(expItem);
        });

        // 5. Education
        const eduList = document.getElementById('education-list');
        data.education.forEach(edu => {
            const eduItem = document.createElement('div');
            eduItem.className = 'bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4';
            eduItem.innerHTML = `
                <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">${edu.degree}</h3>
                    <p class="text-primary-500 font-medium">${edu.university}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${edu.specialization}</p>
                </div>
                <span class="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full whitespace-nowrap">${edu.period}</span>
            `;
            eduList.appendChild(eduItem);
        });

        // 6. Skills
        const webSkills = document.getElementById('web-skills-list');
        data.skills.web.forEach(skill => {
            const s = document.createElement('span');
            s.className = 'px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 text-sm font-medium';
            s.textContent = skill;
            webSkills.appendChild(s);
        });

        const aiSkills = document.getElementById('ai-skills-list');
        data.skills.ai.forEach(skill => {
            const s = document.createElement('span');
            s.className = 'px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 text-sm font-medium';
            s.textContent = skill;
            aiSkills.appendChild(s);
        });

        // 7. Projects
        const projectsList = document.getElementById('projects-list');
        data.projects.forEach(project => {
            const p = document.createElement('div');
            p.className = 'group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1';
            p.innerHTML = `
                <div class="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <div class="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
                        <i class="${project.icon} text-4xl"></i>
                    </div>
                    <div class="absolute bottom-4 left-4 z-20">
                        <h3 class="text-white text-xl font-bold">${project.title}</h3>
                    </div>
                </div>
                <div class="p-6">
                    <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.tags.map(t => `<span class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded dark:bg-primary-900/30 dark:text-primary-300">${t}</span>`).join('')}
                    </div>
                    <div class="flex justify-between items-center pt-2">
                        <a href="${project.github}" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm font-medium flex items-center gap-1">
                            <i class="fab fa-github"></i> Code
                        </a>
                        <a href="${project.live}" class="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                            Live Demo <i class="fas fa-external-link-alt text-xs"></i>
                        </a>
                    </div>
                </div>
            `;
            projectsList.appendChild(p);
        });

        // 8. Blog
        const blogList = document.getElementById('blog-list');
        data.blogs.forEach(blog => {
            const b = document.createElement('article');
            b.className = 'flex flex-col h-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all';
            b.innerHTML = `
                <div class="p-6 flex-1">
                    <div class="text-sm text-primary-500 mb-2 font-semibold">${blog.date}</div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-primary-500 transition-colors">
                        <a href="${blog.url}">${blog.title}</a>
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${blog.description}</p>
                </div>
                <div class="px-6 pb-6 mt-auto">
                    <a href="${blog.url}" class="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-500 inline-flex items-center gap-1">
                        Read more <i class="fas fa-arrow-right text-xs"></i>
                    </a>
                </div>
            `;
            blogList.appendChild(b);
        });

    } catch (error) {
        console.error('Error populating portfolio data:', error);
    }
}

// Start everything
document.addEventListener('DOMContentLoaded', () => {
    if (window.portfolioData) {
        populatePortfolio(window.portfolioData);
    } else {
        console.error('Portfolio data not found!');
    }
});

// Contact Form Simulation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const originalContent = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.classList.add('opacity-75', 'cursor-not-allowed');

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
            btn.classList.remove('bg-primary-600', 'hover:bg-primary-700', 'opacity-75', 'cursor-not-allowed');
            btn.classList.add('bg-green-600', 'hover:bg-green-700');

            this.reset();

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                btn.classList.add('bg-primary-600', 'hover:bg-primary-700');
            }, 3000);
        }, 1500);
    });
}
