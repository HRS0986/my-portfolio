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
        document.getElementById('hero-first-name').textContent = `\u00A0${personal.firstName},`;
        document.getElementById('hero-sr-tagline').textContent = personal.heroTagline;
        document.getElementById('hero-about').textContent = personal.about;
        document.getElementById('mockup-name').textContent = `'${personal.firstName}'`;
        document.getElementById('contact-availability').textContent = personal.availability;
        document.getElementById('contact-email').textContent = personal.email;
        document.getElementById('contact-location').textContent = personal.location;
        document.getElementById('footer-first-name').textContent = personal.firstName;
        document.getElementById('footer-last-name').textContent = ` ${personal.lastName}`;
        document.getElementById('footer-copyright').textContent = `© ${personal.copyrightYear} ${personal.firstName} ${personal.lastName}. All rights reserved.`;

        // 1.1 Profile Photo
        if (personal.photo) {
            const profileContainer = document.getElementById('hero-profile-container');
            const profileImg = document.getElementById('hero-profile-img');

            if (profileContainer && profileImg) {
                profileImg.src = personal.photo;
                profileContainer.classList.remove('hidden');
            }
        }

        // 1.2 CV Download
        if (personal.cv) {
            const cvBtn = document.getElementById('download-cv');
            if (cvBtn) {
                cvBtn.href = personal.cv;
            }
        }

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
                    <p class="text-gray-500 dark:text-gray-400">${exp.type}</p>
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
                <div class="h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    ${project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">` : `
                    <div class="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400">
                        <i class="fas fa-laptop-code text-4xl"></i>
                    </div>`}
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
                        <div class="flex gap-3">
                            ${project.github.map((link, i) => `
                                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm font-medium flex items-center gap-1">
                                        <i class="fab fa-github"></i>${link.title}
                                    </a>
                                `).join('')}
                        </div>
                        ${project.live && project.live !== '#' ? `
                        <a href="${project.live}" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                            Live Demo <i class="fas fa-external-link-alt text-xs"></i>
                        </a>` : ''}
                    </div>
                </div>
            `;
            projectsList.appendChild(p);
        });

        // 8. Blog
        const blogList = document.getElementById('blog-list');
        data.blogs.forEach(blog => {
            const b = document.createElement('article');
            b.className = 'flex flex-col h-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group';
            b.innerHTML = `
                <div class="h-48 overflow-hidden relative">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <img src="${blog.thumbnail}" alt="${blog.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
                <div class="p-6 flex-1">
                    <div class="text-sm text-primary-500 mb-2 font-semibold">${blog.date}</div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-primary-500 transition-colors">
                        <a href="${blog.url}" target="_blank" rel="noopener noreferrer">${blog.title}</a>
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${blog.description}</p>
                </div>
                <div class="px-6 pb-6 mt-auto">
                    <a href="${blog.url}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-500 inline-flex items-center gap-1">
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

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Initialize EmailJS
    try {
        emailjs.init("XnWYYthFr7l2h5-aB");
    } catch (e) {
        console.error("EmailJS initialization failed:", e);
    }

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const originalContent = btn.innerHTML;

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // UI Loading State
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.classList.add('opacity-75', 'cursor-not-allowed');

        const params = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_name: "Hirusha Fernando" // Optional, adds context
        };

        emailjs.send('service_0x8rund', 'template_nqip39n', params, "XnWYYthFr7l2h5-aB")
            .then(() => {
                // Success State
                btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                btn.classList.remove('bg-primary-600', 'hover:bg-primary-700', 'opacity-75', 'cursor-not-allowed');
                btn.classList.add('bg-green-600', 'hover:bg-green-700');

                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                    btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                    btn.classList.add('bg-primary-600', 'hover:bg-primary-700');
                }, 3000);
            })
            .catch((error) => {
                console.error('Email sending failed:', error);

                // Error State
                btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to Send';
                btn.classList.remove('bg-primary-600', 'hover:bg-primary-700', 'opacity-75', 'cursor-not-allowed');
                btn.classList.add('bg-red-600', 'hover:bg-red-700');

                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                    btn.classList.remove('bg-red-600', 'hover:bg-red-700');
                    btn.classList.add('bg-primary-600', 'hover:bg-primary-700');
                }, 3000);
            });
    });
}


// ==========================================
// TERMINAL MODE & MODE SELECTION LOGIC
// ==========================================

const modeSelector = document.getElementById('mode-selector');
const terminalMode = document.getElementById('terminal-mode');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

// Initial State: Disable Scroll when Mode Selector is active
if (modeSelector) {
    document.body.style.overflow = 'hidden';
}

// Make selectMode global for HTML access
window.selectMode = function (mode) {
    if (!modeSelector) return;

    if (mode === 'gui') {
        modeSelector.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            modeSelector.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scroll
        }, 500);
    } else if (mode === 'terminal') {
        modeSelector.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            modeSelector.style.display = 'none';
        }, 500);

        terminalMode.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Keep scroll disabled for body
        if (terminalInput) terminalInput.focus();

        // Print welcome message
        print('Welcome to HirushaOS [Version 1.0.0]', 'system');
        print('Copyright (c) 2026 Hirusha Fernando. All rights reserved.', 'system');
        print('\nType "help" to see available commands.\n', 'system');
    }
};

// Terminal Input Handling
if (terminalInput) {
    terminalInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const command = this.value;
            this.value = '';
            print(`visitor@hirusha:~$ ${command}`, 'utils.input');
            handleCommand(command.trim().toLowerCase());

            // Keep focus
            this.focus();
            // Scroll to bottom
            const container = terminalMode.children[0]; // The div wrapper
            // Note: Since terminalMode fits screen, we scroll the wrapper or the body? 
            // The HTML structure has: div#terminal-mode (overflow-y-auto) > div.max-w-4xl (min-h-full)
            // So we scroll #terminal-mode
            terminalMode.scrollTo(0, terminalMode.scrollHeight);
        }
    });

    // Auto-focus input
    if (terminalMode) {
        terminalMode.addEventListener('click', () => {
            // Don't focus if user is selecting text
            if (window.getSelection().toString().length === 0) {
                terminalInput.focus();
            }
        });
    }
}

function print(text, type = '') {
    if (!terminalOutput) return;

    const line = document.createElement('div');

    if (type === 'utils.input') {
        line.className = 'text-[#cccccc] mb-1 opacity-70';
        line.textContent = text;
    } else if (type === 'system') {
        line.className = 'text-green-500 mb-1 font-bold';
        line.textContent = text;
    } else if (type === 'error') {
        line.className = 'text-red-500 mb-1';
        line.textContent = text;
    } else if (type === 'html') {
        line.className = 'text-[#cccccc] mb-1';
        line.innerHTML = text; // Be careful with XSS if input wasn't sanitized, but here source is internal data
    } else {
        line.className = 'text-[#cccccc] mb-1 whitespace-pre-wrap leading-relaxed';
        line.textContent = text;
    }

    terminalOutput.appendChild(line);
    if (terminalMode) terminalMode.scrollTo(0, terminalMode.scrollHeight);
}

function handleCommand(cmd) {
    const data = window.portfolioData;

    switch (cmd) {
        case 'help':
            print(`
Available commands:
  about       - Display information about me
  skills      - List technical skills
  experience  - List work experience
  education   - Show education history
  projects    - View featured projects
  blog        - List latest blog posts
  contact     - Display contact details
  clear       - Clear the terminal screen
  gui / exit  - Switch to standard visual mode
            `);
            break;

        case 'about':
            if (data && data.personal) {
                print(data.personal.about);
            } else {
                print('Error: Portfolio data not found.', 'error');
            }
            break;

        case 'skills':
            if (data && data.skills) {
                print('--- WEB DEVELOPMENT ---', 'system');
                print(data.skills.web.join(', '));
                print('\n--- ARTIFICIAL INTELLIGENCE ---', 'system');
                print(data.skills.ai.join(', '));
            } else {
                print('Error: Skills data not found.', 'error');
            }
            break;

        case 'experience':
            if (data && data.experience) {
                data.experience.forEach(exp => {
                    print(`\n[${exp.period}] ${exp.role} @ ${exp.company}`, 'system');
                    print(exp.description);
                    print(`[Tech]: ${exp.skills.join(', ')}`);
                });
            } else {
                print('Error: Experience data not found.', 'error');
            }
            break;

        case 'education':
            if (data && data.education) {
                data.education.forEach(edu => {
                    print(`\n[${edu.period}] ${edu.degree}`, 'system');
                    print(`${edu.university}`);
                    print(`Specialization: ${edu.specialization}`);
                });
            } else {
                print('Error: Education data not found.', 'error');
            }
            break;

        case 'projects':
            if (data && data.projects) {
                data.projects.forEach(p => {
                    print(`\n> ${p.title}`, 'system');
                    print(p.description);
                    print(`[Tech]: ${p.tags.join(', ')}`);

                    let links = [];
                    if (p.github) p.github.forEach(l => links.push(`${l.title}: ${l.url}`));
                    if (p.live && p.live !== '#') links.push(`Live: ${p.live}`);

                    if (links.length > 0) print(`[Links]: ${links.join(' | ')}`);
                });
            } else {
                print('Error: Projects data not found.', 'error');
            }
            break;

        case 'blog':
            if (data && data.blogs) {
                data.blogs.forEach(b => {
                    print(`\n[${b.date}] ${b.title}`, 'system');
                    print(b.description);
                    print(`Read more: ${b.url}`);
                });
            } else {
                print('Error: Blog data not found.', 'error');
            }
            break;

        case 'contact':
            if (data && data.personal) {
                print(`\nEmail: ${data.personal.email}`);
                print(`Location: ${data.personal.location}`);

                if (data.socials) {
                    print('\nConnect explicitly:', 'system');
                    data.socials.forEach(s => {
                        print(`  ${s.platform}: ${s.url}`);
                    });
                }
            }
            break;

        case 'clear':
            if (terminalOutput) terminalOutput.innerHTML = '';
            break;

        case 'gui':
        case 'exit':
            print('System shutting down...', 'system');
            print('Switching to Visual Interface...');
            setTimeout(() => {
                if (terminalMode) terminalMode.classList.add('hidden');
                document.body.style.overflow = 'auto';
                if (modeSelector) modeSelector.style.display = 'none';
            }, 1000);
            break;

        case '':
            break;

        default:
            print(`Command not found: "${cmd}". Type "help" for a list of commands.`, 'error');
    }
}
