// Expandable Experience Cards
document.addEventListener('DOMContentLoaded', function() {
  const experienceCards = document.querySelectorAll('[data-card]');
  
  experienceCards.forEach(card => {
    const toggle = card.querySelector('.exp-toggle');
    const content = card.querySelector('.exp-content');
    const headerMain = card.querySelector('.exp-header-main');
    
    const handleToggle = (e) => {
      e.stopPropagation();
      const isExpanded = card.classList.contains('expanded');
      
      if (isExpanded) {
        card.classList.remove('expanded');
        content.style.display = 'none';
      } else {
        card.classList.add('expanded');
        content.style.display = 'block';
      }
    };
    
    // Toggle on button click
    if (toggle) {
      toggle.addEventListener('click', handleToggle);
    }
    
    // Toggle on card header click
    if (headerMain) {
      headerMain.addEventListener('click', handleToggle);
    }
  });
});

// Smooth Scroll Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update active nav link
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      this.classList.add('active');
    }
  });
});

// Active Navigation on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll('.project-card, .timeline-item, .stat-item, .skill-category');
  
  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
});

// Parallax Effect for Hero Background
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroBefore = hero.querySelector('::before');
    if (heroBefore) {
      hero.style.setProperty('--scroll', `${scrolled * 0.5}px`);
    }
  }
});

// Add subtle animation to floating elements
const floatingElements = document.querySelectorAll('.float-element');
floatingElements.forEach((el, index) => {
  el.style.animationDelay = `${index * 0.5}s`;
});

// Form handling (if contact form is added later)
function handleSubmit(event) {
  event.preventDefault();
  // Form submission logic here
  console.log('Form submitted');
}

// Add active class to first nav link on load
window.addEventListener('load', () => {
  const firstNavLink = document.querySelector('.nav-link[href="#home"]');
  if (firstNavLink) {
    firstNavLink.classList.add('active');
  }
  
  // Trigger initial animations
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.animation = 'fadeInUp 0.8s ease-out';
  }
});

// Smooth reveal for stats
function animateStats() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = parseInt(stat.textContent);
    if (!isNaN(target)) {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target + '+';
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current) + '+';
        }
      }, 30);
    }
  });
}

// Trigger stats animation when about section is visible
const aboutSection = document.querySelector('#about');
if (aboutSection) {
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  aboutObserver.observe(aboutSection);
}

// Add cursor effect on project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.cursor = 'pointer';
  });
  
  card.addEventListener('click', function() {
    const link = this.querySelector('.project-link');
    if (link) {
      link.click();
    }
  });
});

// Inline Hats Animation - Role Rotation (Next to Berry)
const roles = [
  { emoji: '👨‍💻', text: 'Full Stack Engineer' },
  { emoji: '🎩', text: 'DevOps Specialist' },
  { emoji: '🎓', text: 'AI Engineer' },
  { emoji: '🎯', text: 'Product Manager' }
];

let currentRoleIndex = 0;

function switchHat() {
  const hatElements = document.querySelectorAll('.hat-inline');
  const roleDisplay = document.querySelector('.current-role-inline');
  
  if (hatElements.length === 0 || !roleDisplay) return;
  
  // Smooth fade out current hat
  const currentHat = document.querySelector('.hat-inline-active');
  if (currentHat) {
    currentHat.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    currentHat.classList.remove('hat-inline-active');
  }
  
  // Update role text with smooth fade
  roleDisplay.style.transition = 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
  roleDisplay.style.opacity = '0';
  roleDisplay.style.transform = 'translateX(-8px)';
  
  // After fade out, switch to next hat
  setTimeout(() => {
    currentRoleIndex = (currentRoleIndex + 1) % roles.length;
    const nextHat = hatElements[currentRoleIndex];
    
    // Update role text first (while hidden)
    roleDisplay.textContent = roles[currentRoleIndex].text;
    
    // Add active class to next hat with smooth animation
    nextHat.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    nextHat.classList.add('hat-inline-active');
    
    // Fade in role text smoothly
    setTimeout(() => {
      roleDisplay.style.opacity = '1';
      roleDisplay.style.transform = 'translateX(0)';
    }, 200);
  }, 700);
}

// Initialize: Set first hat as active when page loads
window.addEventListener('load', () => {
  const hatElements = document.querySelectorAll('.hat-inline');
  const roleDisplay = document.querySelector('.current-role-inline');
  
  if (hatElements.length > 0 && roleDisplay) {
    hatElements[0].classList.add('hat-inline-active');
    // Switch hat every 3.5 seconds for smoother transitions
    setInterval(switchHat, 3500);
  }
});

// Projects Filter Dropdown Functionality
document.addEventListener('DOMContentLoaded', () => {
  const filterToggle = document.getElementById('filterToggle');
  const filterMenu = document.getElementById('filterMenu');
  const filterSearch = document.getElementById('filterSearch');
  const filterOptions = document.getElementById('filterOptions');
  const projectCards = document.querySelectorAll('.project-card');
  const filterSelected = document.querySelector('.filter-selected');
  
  // Collect all unique skills from projects
  const allSkills = new Set();
  projectCards.forEach(card => {
    const skills = card.getAttribute('data-skills');
    if (skills) {
      skills.split(',').forEach(skill => {
        allSkills.add(skill.trim());
      });
    }
  });
  
  // Sort skills alphabetically
  const sortedSkills = Array.from(allSkills).sort();
  
  // Populate filter options
  sortedSkills.forEach(skill => {
    const option = document.createElement('div');
    option.className = 'filter-option';
    option.textContent = skill;
    option.setAttribute('data-filter', skill);
    filterOptions.appendChild(option);
  });
  
  let currentFilter = 'all';
  
  // Get all options after populating
  const allOptions = filterOptions.querySelectorAll('.filter-option');
  
  // Toggle dropdown
  filterToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    filterMenu.classList.toggle('active');
    filterToggle.classList.toggle('active');
    
    if (filterMenu.classList.contains('active')) {
      filterSearch.focus();
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!filterToggle.contains(e.target) && !filterMenu.contains(e.target)) {
      filterMenu.classList.remove('active');
      filterToggle.classList.remove('active');
    }
  });
  
  // Search functionality
  filterSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    allOptions.forEach(option => {
      const text = option.textContent.toLowerCase();
      if (text.includes(searchTerm) || searchTerm === '') {
        option.style.display = 'block';
      } else {
        option.style.display = 'none';
      }
    });
  });
  
  // Filter option selection
  allOptions.forEach(option => {
    option.addEventListener('click', () => {
      const filterValue = option.getAttribute('data-filter');
      currentFilter = filterValue || 'all';
      
      // Update selected text
      if (currentFilter === 'all' || !filterValue) {
        filterSelected.textContent = 'All Projects';
      } else {
        filterSelected.textContent = option.textContent;
      }
      
      // Update active state
      allOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      // Filter projects
      filterProjects(currentFilter);
      
      // Close dropdown
      filterMenu.classList.remove('active');
      filterToggle.classList.remove('active');
      filterSearch.value = '';
      
      // Reset search results
      allOptions.forEach(opt => opt.style.display = 'block');
    });
  });
  
  // Set "All Projects" as active by default
  const allProjectsOption = filterOptions.querySelector('.filter-option[data-filter="all"]') || filterOptions.querySelector('.filter-option');
  if (allProjectsOption) {
    allProjectsOption.classList.add('active');
  }
  
  // Filter projects function
  function filterProjects(filterValue) {
    projectCards.forEach(card => {
      const skills = card.getAttribute('data-skills');
      
      if (filterValue === 'all' || (skills && skills.includes(filterValue))) {
        card.classList.remove('filtered-out');
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.classList.add('filtered-out');
        }, 300);
      }
    });
  }
});
