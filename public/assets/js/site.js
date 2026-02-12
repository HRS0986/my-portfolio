// Main initialization function
let initRetries = 0;
const MAX_RETRIES = 50; // 5 seconds total

function init() {
    try {
        const data = window.portfolioData;

        if (!data) {
            initRetries++;
            if (initRetries < MAX_RETRIES) {
                console.warn(`Portfolio data not found during init (attempt ${initRetries})! Retrying in 100ms...`);
                setTimeout(init, 100);
            } else {
                console.error('Failed to load portfolio data after maximum retries.');
                hideLoader();
            }
            return;
        }

        console.log('Portfolio data loaded successfully. Updating sections...');

        // Update Hero Section
        updateHeroSection(data);

        // Update Skills Section
        updateSkillsSection(data);

        // Update Projects Section
        updateProjectsSection(data);

        // Update Resume Section
        updateResumeSection(data);

        // Update Blog Section
        updateBlogSection(data);

        // Update Contact Section
        updateContactSection(data);

        // Update Footer
        updateFooter(data);

        // Update Sidebar
        updateSidebar(data);

        console.log('Portfolio sections updated.');
    } catch (error) {
        console.error('Error during portfolio initialization:', error);
        // Ensure loader is hidden even if there's a runtime error
        hideLoader();
    }
}

// Ensure init runs after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Small delay to ensure any subsequent scripts like data.js have parsed
    setTimeout(init, 10);
}

function updateHeroSection(data) {
    const personal = data.personal;

    // Update name
    const nameElement = document.querySelector('.font-serif.text-5xl.font-bold.text-white.mb-2');
    if (nameElement) {
        nameElement.innerHTML = `${personal.firstName}<br>${personal.lastName}`;
    }

    // Update social links in hero section
    const heroSocialLinks = document.getElementById('hero-social-links');
    if (heroSocialLinks && data.socials && data.socials.length > 0) {
        heroSocialLinks.innerHTML = '';

        data.socials.forEach(social => {
            const link = document.createElement('a');
            link.href = social.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'text-gray-400 hover:text-neon-green transition-colors text-xl';
            link.setAttribute('aria-label', social.platform);
            link.innerHTML = `<i class="${social.icon}"></i>`;
            heroSocialLinks.appendChild(link);
        });
    }

    // Update email
    const emailElement = document.querySelector('.text-textGrey.font-sans.text-sm p.hover\\:text-neon-green');
    if (emailElement && personal.email) {
        emailElement.textContent = personal.email;
    }

    // Update location
    const locationElement = document.querySelector('.text-textGrey.font-sans.text-sm p:not(.hover\\:text-neon-green)');
    if (locationElement && personal.location) {
        locationElement.textContent = `Based in ${personal.location}`;
    }

    // Update hero title
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        heroTitle.textContent = personal.heroHeadline || "Hey, It’s Hirusha,";
    }

    // Update hero role with typewriter animation
    const heroRole = document.getElementById('typewriter');
    if (heroRole && data.personal.typewriterRoles && data.personal.typewriterRoles.length > 0) {
        console.log('Starting typewriter with roles:', data.personal.typewriterRoles);
        // Small delay to ensure smooth transition after loader
        setTimeout(() => {
            startTypewriter(heroRole, data.personal.typewriterRoles);
        }, 500);
    }

    // Update hero description
    const heroDesc = document.querySelector('.text-textGrey.text-lg.max-w-2xl');
    if (heroDesc && personal.about) {
        heroDesc.textContent = personal.about;
    }

    // Update CV download button
    const cvDownloadBtn = document.getElementById('cv-download-btn');
    if (cvDownloadBtn && personal.cv) {
        cvDownloadBtn.href = personal.cv;
    }
}

function updateSkillsSection(data) {
    if (!data.skills) return;

    const categoriesContainer = document.getElementById('skills-categories-container');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = '';

    // Category display names
    const categoryNames = {
        'web': 'Web Development',
        'ai': 'AI & Machine Learning'
    };

    // Iterate through each category
    Object.keys(data.skills).forEach((category, index) => {
        const skills = data.skills[category];
        if (!skills || skills.length === 0) return;

        // Create category container
        const categoryDiv = document.createElement('div');
        categoryDiv.className = index < Object.keys(data.skills).length - 1 ? 'mb-12' : '';

        // Create category header
        const categoryHeader = document.createElement('h3');
        categoryHeader.className = 'text-2xl font-serif text-white mb-6';
        categoryHeader.innerHTML = `<span class="text-neon-green">${categoryNames[category] || category}</span>`;
        categoryDiv.appendChild(categoryHeader);

        // Create skills grid
        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4';

        // Add skills to grid
        skills.forEach(skill => {
            const skillBadge = document.createElement('div');
            skillBadge.className = 'bg-dark-lighter border border-white/10 px-6 py-3 rounded-lg hover:border-neon-green/50 hover:bg-white/5 transition-all duration-300 group flex items-center justify-center';
            skillBadge.innerHTML = `
                <span class="text-gray-300 font-mono text-sm group-hover:text-neon-green transition-colors">${skill}</span>
            `;
            skillsGrid.appendChild(skillBadge);
        });

        categoryDiv.appendChild(skillsGrid);
        categoriesContainer.appendChild(categoryDiv);
    });
}

function updateProjectsSection(data) {
    if (!data.projects || data.projects.length === 0) return;

    const projectsGrid = document.querySelector('#projects .grid.grid-cols-1.md\\:grid-cols-2');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    data.projects.forEach(project => {
        const projectCard = document.createElement('article');
        projectCard.className = 'bg-dark-lighter border border-white/10 p-8 rounded-sm hover:border-neon-green/50 transition-all group flex flex-col h-full hover:-translate-y-2 duration-300';

        const tagsString = project.tags ? `[${project.tags.join(', ')}]` : '';

        let githubLinks = '';
        if (project.github && project.github.length > 0) {
            githubLinks = project.github.map(gh =>
                `<a href="${gh.url}" class="text-white text-sm font-semibold flex items-center gap-2 hover:text-neon-green"><i class="fa-brands fa-github"></i> ${gh.title}</a>`
            ).join('');
        }

        const liveLink = project.live && project.live !== '#'
            ? `<a href="${project.live}" class="text-white text-sm font-semibold flex items-center gap-2 hover:text-neon-green"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>`
            : '';

        projectCard.innerHTML = `
            <h2 class="font-serif text-3xl font-bold text-white mb-2 group-hover:text-neon-green transition-colors">
                ${project.title}
            </h2>
            <p class="text-xs text-neon-green font-mono mb-4">${tagsString}</p>
            <p class="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                ${project.description}
            </p>
            <div class="flex items-center gap-6 mt-auto pt-4 border-t border-white/5">
                ${liveLink}
                ${githubLinks}
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });
}

function updateResumeSection(data) {
    // Update Experience
    if (data.experience && data.experience.length > 0) {
        const experienceContainer = document.querySelector('#resume .grid.grid-cols-1.lg\\:grid-cols-2 > div:first-child .flex.flex-col.space-y-12');
        if (experienceContainer) {
            experienceContainer.innerHTML = '';

            data.experience.forEach(exp => {
                const expItem = document.createElement('article');
                expItem.className = 'timeline-item relative pl-8';
                expItem.innerHTML = `
                    <div class="timeline-line"></div>
                    <div class="absolute left-0 top-[6px] w-4 h-4 rounded-full bg-neon-green border-4 border-dark z-10"></div>
                    <div class="flex flex-col gap-1">
                        <span class="text-gray-500 text-xs tracking-widest font-medium uppercase font-mono">${exp.period}</span>
                        <h3 class="text-xl text-white font-normal uppercase tracking-wide mt-1 font-serif">${exp.role}</h3>
                        <p class="text-gray-400 text-sm uppercase tracking-wider font-mono">${exp.company}</p>
                    </div>
                `;
                experienceContainer.appendChild(expItem);
            });
        }
    }

    // Update Education
    if (data.education && data.education.length > 0) {
        const educationContainer = document.querySelector('#resume .grid.grid-cols-1.lg\\:grid-cols-2 > div:last-child .flex.flex-col.space-y-12');
        if (educationContainer) {
            educationContainer.innerHTML = '';

            data.education.forEach(edu => {
                const eduItem = document.createElement('article');
                eduItem.className = 'timeline-item relative pl-8';
                eduItem.innerHTML = `
                    <div class="timeline-line"></div>
                    <div class="absolute left-0 top-[6px] w-4 h-4 rounded-full bg-neon-green border-4 border-dark z-10"></div>
                    <div class="flex flex-col gap-1">
                        <span class="text-gray-500 text-xs tracking-widest font-medium uppercase font-mono">${edu.period}</span>
                        <h3 class="text-xl text-white font-normal uppercase tracking-wide mt-1 font-serif">${edu.degree}</h3>
                        <p class="text-gray-400 text-sm uppercase tracking-wider font-mono">${edu.university}</p>
                    </div>
                `;
                educationContainer.appendChild(eduItem);
            });
        }
    }
}

function updateBlogSection(data) {
    if (!data.blogs || data.blogs.length === 0) return;

    const blogContainer = document.querySelector('#blog .flex.flex-col.gap-10');
    if (!blogContainer) return;

    blogContainer.innerHTML = '';

    data.blogs.forEach((blog, index) => {
        const blogArticle = document.createElement('article');
        const borderClass = index < data.blogs.length - 1 ? 'border-b border-white/10' : '';
        blogArticle.className = `group pb-10 ${borderClass}`;

        blogArticle.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div class="flex-1 space-y-3 max-w-3xl">
                    <span class="font-mono text-sm tracking-wider block text-neon-green opacity-80">${blog.date}</span>
                    <h2 class="text-3xl md:text-4xl font-serif text-white group-hover:text-neon-green transition-colors font-bold leading-tight cursor-pointer">
                        <a href="${blog.url}" target="_blank">${blog.title}</a>
                    </h2>
                    <p class="text-lg leading-relaxed font-light text-gray-400">
                        ${blog.description}
                    </p>
                </div>
                <div class="w-full md:w-[280px] shrink-0 overflow-hidden rounded-lg">
                    <a href="${blog.url}" target="_blank">
                        <img src="${blog.thumbnail}" alt="${blog.title}" 
                            class="w-full h-[160px] object-cover hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                    </a>
                </div>
            </div>
        `;

        blogContainer.appendChild(blogArticle);
    });
}

function updateContactSection(data) {
    const personal = data.personal;

    // Update email in contact section
    const contactEmail = document.querySelector('#contact a[href^="mailto:"]');
    if (contactEmail && personal.email) {
        contactEmail.href = `mailto:${personal.email}`;
        contactEmail.textContent = personal.email;
    }

    // Update social links in contact section
    const contactSocialLinks = document.getElementById('contact-social-links');
    if (contactSocialLinks && data.socials && data.socials.length > 0) {
        contactSocialLinks.innerHTML = '';

        data.socials.forEach(social => {
            const link = document.createElement('a');
            link.href = social.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'text-gray-400 hover:text-neon-green transition-colors text-3xl';
            link.setAttribute('aria-label', social.platform);
            link.innerHTML = `<i class="${social.icon}"></i>`;
            contactSocialLinks.appendChild(link);
        });
    }
}

function updateFooter(data) {
    const personal = data.personal;

    // Update copyright year
    const copyrightText = document.querySelector('footer .text-gray-600.text-sm.font-mono');
    if (copyrightText && personal.copyrightYear) {
        copyrightText.textContent = `© ${personal.copyrightYear} ${personal.firstName}. All Rights Reserved`;
    }

    // Update social links in footer
    if (data.socials && data.socials.length > 0) {
        const socialContainer = document.querySelector('footer .flex.gap-6.text-2xl');
        if (socialContainer) {
            socialContainer.innerHTML = '';

            // Only show first 3 socials in footer
            data.socials.slice(0, 3).forEach(social => {
                const link = document.createElement('a');
                link.href = social.url;
                link.target = '_blank';
                link.className = 'hover:text-neon-green transition-transform hover:-translate-y-1';
                link.innerHTML = `<i class="${social.icon}"></i>`;
                socialContainer.appendChild(link);
            });
        }
    }
}

function updateSidebar(data) {
    // Update sidebar brand initial
    const brandInitial = document.querySelector('nav .font-serif.font-bold.text-2xl.text-neon-green');
    if (brandInitial && data.personal.firstName) {
        brandInitial.textContent = data.personal.firstName.charAt(0).toUpperCase();
    }

    // Update sidebar bottom social icon
    if (data.socials && data.socials.length > 0) {
        const githubSocial = data.socials.find(s => s.platform === 'GitHub');
        if (githubSocial) {
            const sidebarGithub = document.querySelector('nav .mt-auto a');
            if (sidebarGithub) {
                sidebarGithub.href = githubSocial.url;
                sidebarGithub.target = '_blank';
            }
        }
    }
}

// Typewriter animation function
function startTypewriter(element, roles) {
    if (element.dataset.typewriterStarted) return;
    element.dataset.typewriterStarted = 'true';

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Delete characters
            element.innerHTML = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            // Type characters
            element.innerHTML = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        // Logic for pausing and switching roles
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at the end of a word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    // Clear contents and start
    element.innerHTML = '';
    type();
}

// Contact Form Email Sending
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        // Initialize EmailJS
        try {
            emailjs.init("XnWYYthFr7l2h5-aB");
        } catch (e) {
            console.error("EmailJS initialization failed:", e);
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = document.getElementById('contact-submit-btn');
            const originalContent = btn.innerHTML;

            // Get form values
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;

            // UI Loading State
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.classList.add('opacity-75', 'cursor-not-allowed');

            const params = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_name: "Hirusha Fernando"
            };

            emailjs.send('service_0x8rund', 'template_nqip39n', params, "XnWYYthFr7l2h5-aB")
                .then(() => {
                    // Success State
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
                    btn.classList.remove('bg-neon-green', 'hover:bg-[#00cc7d]', 'opacity-75', 'cursor-not-allowed');
                    btn.classList.add('bg-green-600', 'hover:bg-green-700');

                    contactForm.reset();

                    setTimeout(() => {
                        btn.innerHTML = originalContent;
                        btn.disabled = false;
                        btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                        btn.classList.add('bg-neon-green', 'hover:bg-[#00cc7d]');
                    }, 3000);
                })
                .catch((error) => {
                    console.error('Email sending failed:', error);

                    // Error State
                    btn.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> Failed to Send';
                    btn.classList.remove('bg-neon-green', 'hover:bg-[#00cc7d]', 'opacity-75', 'cursor-not-allowed');
                    btn.classList.add('bg-red-600', 'hover:bg-red-700');

                    setTimeout(() => {
                        btn.innerHTML = originalContent;
                        btn.disabled = false;
                        btn.classList.remove('bg-red-600', 'hover:bg-red-700');
                        btn.classList.add('bg-neon-green', 'hover:bg-[#00cc7d]');
                    }, 3000);
                });
        });
    }
});
