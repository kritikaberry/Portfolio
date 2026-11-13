let nameBootUntil = 0;
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('name-boot')) return;
  try { localStorage.setItem('kb-name-glitch', '1'); } catch (e) {}
  nameBootUntil = performance.now() + 2800;
  window.setTimeout(function () {
    root.classList.remove('name-boot');
  }, 2800);
})();

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

  const work = document.getElementById('work');
  const expList = document.getElementById('expList');
  const expMap = document.getElementById('expMap');
  const expSwitch = document.querySelectorAll('[data-exp-view]');
  const mapPins = document.querySelectorAll('.map-pin');
  const mapPanels = document.querySelectorAll('.journey-panel');

  expSwitch.forEach(button => {
    button.addEventListener('click', () => {
      const showMap = button.dataset.expView === 'map';
      expSwitch.forEach(item => {
        const on = item === button;
        item.classList.toggle('is-active', on);
        item.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      work.classList.toggle('is-map', showMap);
      expList.hidden = showMap;
      expMap.hidden = !showMap;
      const journeyLead = expMap.querySelector('.journey-lead');
      if (showMap && journeyLead && !journeyLead.classList.contains('is-visible')) {
        window.requestAnimationFrame(() => {
          journeyLead.classList.add('is-visible', 'is-walking');
          window.setTimeout(() => journeyLead.classList.remove('is-walking'), 1400);
        });
      }
    });
  });

  const showPlace = (place) => {
    mapPins.forEach(pin => {
      const on = pin.dataset.place === place;
      pin.classList.toggle('is-active', on);
      pin.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    mapPanels.forEach(panel => {
      panel.hidden = panel.dataset.panel !== place;
    });
  };

  mapPins.forEach(pin => {
    pin.addEventListener('click', () => showPlace(pin.dataset.place));
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

let navTicking = false;
window.addEventListener('scroll', () => {
  if (navTicking) return;
  navTicking = true;
  window.requestAnimationFrame(() => {
    updateActiveNav();
    navTicking = false;
  });
}, { passive: true });

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.querySelector('.nav-links');

if (navToggle && navLinksContainer) {
  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const syncThemeToggle = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  syncThemeToggle();
  themeToggle.addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('kb-theme', next); } catch (e) {}
    syncThemeToggle();
  });
}

// Keep all sections and project cards immediately visible on load (no opacity-0 reveal stall)

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
    const target = parseInt(stat.textContent, 10);
    const suffix = stat.dataset.suffix || '';
    if (!isNaN(target)) {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = String(target) + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = String(Math.floor(current)) + suffix;
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
  
  card.addEventListener('click', function(event) {
    if (event.target.closest('.project-link')) return;
    const link = this.querySelector('.project-link');
    if (link) {
      link.click();
    }
  });
});

// Inline Hats Animation - Role Rotation (Next to Berry)
const roles = [
  { emoji: '🧭', text: 'Forward Deployed Engineer' },
  { emoji: '🧠', text: 'AI Engineer' },
  { emoji: '👩‍💻', text: 'Software Engineer' },
  { emoji: '📜', text: 'Research Specialist' }
];

let currentRoleIndex = 0;
let roleTimer = null;

function typeRole(text) {
  const roleDisplay = document.querySelector('.current-role-inline');
  if (!roleDisplay) return;
  if (roleTimer) window.clearTimeout(roleTimer);
  if (prefersReducedMotion) {
    roleDisplay.textContent = text;
    return;
  }
  roleDisplay.textContent = '';
  let i = 0;
  const tick = () => {
    i += 1;
    roleDisplay.textContent = text.slice(0, i);
    if (i < text.length) roleTimer = window.setTimeout(tick, 36);
  };
  tick();
}

function switchHat() {
  const roleDisplay = document.querySelector('.current-role-inline');
  if (!roleDisplay || roles.length === 0) return;
  currentRoleIndex = (currentRoleIndex + 1) % roles.length;
  typeRole(roles[currentRoleIndex].text);
}

window.addEventListener('load', () => {
  const roleDisplay = document.querySelector('.current-role-inline');
  if (!roleDisplay) return;
  const begin = () => {
    typeRole(roles[0].text);
    setInterval(switchHat, 4200);
  };
  const wait = Math.max(0, nameBootUntil - performance.now());
  if (wait) window.setTimeout(begin, wait);
  else begin();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  let flowQueued = false;
  const updateFlow = () => {
    flowQueued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    document.documentElement.style.setProperty('--flow', progress.toFixed(4));
  };
  window.addEventListener('scroll', () => {
    if (flowQueued) return;
    flowQueued = true;
    window.requestAnimationFrame(updateFlow);
  }, { passive: true });
  updateFlow();
}

const guideMarkup = `
  <span class="line-push-guide" aria-hidden="true">
    <svg class="guide-svg" viewBox="0 0 42 50">
      <circle class="guide-head" cx="15" cy="7.2" r="4.1"/>
      <path class="guide-body" d="M15 11.6v12.4"/>
      <path class="guide-arm-hold" d="M15 15.2c2.4 1.4 4.8 2.6 8.4 3.4"/>
      <path class="guide-arm-push" d="M15 16.4 34.4 20.6"/>
      <circle class="guide-hand" cx="35.1" cy="20.8" r="1.75"/>
      <g class="guide-leg guide-leg-a">
        <path d="M15 24 9 40.4"/>
        <path d="M9 40.4 4.6 40.8"/>
      </g>
      <g class="guide-leg guide-leg-b">
        <path d="M15 24 21.6 40.4"/>
        <path d="M21.6 40.4 26.2 40.8"/>
      </g>
    </svg>
  </span>
`;

document.querySelectorAll('.line-push[data-guide]').forEach(el => {
  if (!el.querySelector('.line-push-guide')) {
    el.insertAdjacentHTML('afterbegin', guideMarkup);
  }
});

const setPush = (el, value) => {
  const next = Math.max(0, Math.min(1, value));
  el.style.setProperty('--push', next.toFixed(3));
  el.classList.toggle('is-walking', next > 0.06 && next < 0.97);
  el.classList.toggle('is-visible', next > 0.92);
};

const heroInvite = document.getElementById('heroInvite');
if (heroInvite && !prefersReducedMotion) {
  const start = performance.now();
  const duration = 1500;
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = t * t * (3 - 2 * t);
    setPush(heroInvite, eased);
    if (t < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
} else if (heroInvite) {
  setPush(heroInvite, 1);
}

document.querySelectorAll('.line-push:not([data-push="scroll"])').forEach(el => {
  el.setAttribute('data-push', 'inview');
});

if (!prefersReducedMotion) {
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible', 'is-walking');
      window.setTimeout(() => el.classList.remove('is-walking'), 1400);
      lineObserver.unobserve(el);
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.line-push[data-push="inview"]').forEach(el => {
    lineObserver.observe(el);
  });
} else {
  document.querySelectorAll('.line-push[data-push="inview"]').forEach(el => {
    el.classList.add('is-visible');
  });
}

// After the experience has been read, offer the resume once.
const resumeNote = document.getElementById('resumeNote');
const resumeDismiss = document.getElementById('resumeDismiss');

if (resumeNote && sessionStorage.getItem('kb-resume-note') !== 'dismissed') {
  const showResumeNote = () => {
    resumeNote.classList.add('is-visible');
    resumeNote.setAttribute('aria-hidden', 'false');
    const line = resumeNote.querySelector('.line-push');
    if (line) {
      line.classList.add('is-visible', 'is-walking');
      window.setTimeout(() => line.classList.remove('is-walking'), 1400);
    }
  };

  const resumeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        showResumeNote();
        resumeObserver.disconnect();
      }
    });
  }, { threshold: 0.6 });

  resumeObserver.observe(resumeNote);

  if (resumeDismiss) {
    resumeDismiss.addEventListener('click', () => {
      sessionStorage.setItem('kb-resume-note', 'dismissed');
      resumeNote.classList.remove('is-visible');
      resumeNote.classList.add('is-dismissed');
      resumeNote.setAttribute('aria-hidden', 'true');
    });
  }
} else if (resumeNote) {
  resumeNote.classList.add('is-dismissed');
}

// Skills expander in About
document.addEventListener('DOMContentLoaded', () => {
  const skillsToggle = document.getElementById('skillsToggle');
  const aboutSkills = document.querySelector('.about-skills');
  if (skillsToggle && aboutSkills) {
    skillsToggle.addEventListener('click', () => {
      const expanded = aboutSkills.classList.toggle('is-expanded');
      skillsToggle.setAttribute('aria-expanded', String(expanded));
      skillsToggle.textContent = expanded ? 'Show fewer skills' : 'Show all skills';
    });
  }
});

// Projects Filter Dropdown Functionality — set up only when Projects nears the viewport
function initProjectsFilter() {
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
  
  // Populate filter options in a single fragment
  const frag = document.createDocumentFragment();
  sortedSkills.forEach(skill => {
    const option = document.createElement('div');
    option.className = 'filter-option';
    option.textContent = skill;
    option.setAttribute('data-filter', skill);
    frag.appendChild(option);
  });
  filterOptions.appendChild(frag);
  
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
      const show = filterValue === 'all' || (skills && skills.includes(filterValue));
      card.classList.toggle('filtered-out', !show);
    });
  }
}

let projectsFilterStarted = false;
function startProjectsFilter() {
  if (projectsFilterStarted) return;
  projectsFilterStarted = true;
  initProjectsFilter();
}

const filterToggleBtn = document.getElementById('filterToggle');
if (filterToggleBtn) {
  filterToggleBtn.addEventListener('pointerdown', startProjectsFilter, { once: true, passive: true });
}
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(startProjectsFilter, { timeout: 300 });
} else {
  window.setTimeout(startProjectsFilter, 0);
}

// Cursor ripple trail (short-lived wave on move, idle-zero CPU)
(function initCursorWave() {
  const canvas = document.querySelector('.cursor-wave-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const ripples = [];
  let lastX = 0;
  let lastY = 0;
  let lastSpawn = 0;
  let rafId = 0;
  const lifeMs = 680;
  const minGapMs = 36;
  const minDist = 10;

  const readWaveColor = () => {
    const styles = getComputedStyle(document.documentElement);
    const rgb = styles.getPropertyValue('--accent-rgb').trim() || '31, 78, 121';
    return `rgba(${rgb},`;
  };

  let waveColor = readWaveColor();

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const frame = (now) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = ripples.length - 1; i >= 0; i -= 1) {
      const ripple = ripples[i];
      const t = (now - ripple.born) / lifeMs;
      if (t >= 1) {
        ripples.splice(i, 1);
        continue;
      }
      const easeOut = 1 - Math.pow(1 - t, 2);
      const fade = 1 - t;
      const radius = 6 + easeOut * (56 + ripple.strength * 20);
      const alpha = fade * 0.38 * ripple.strength;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `${waveColor}${alpha})`;
      ctx.lineWidth = 1.5 * fade;
      ctx.stroke();

      if (t < 0.55) {
        const waveRadius = radius * 0.62;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, waveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${waveColor}${alpha * 0.65})`;
        ctx.lineWidth = 0.9 * fade;
        ctx.stroke();
      }
    }
    if (ripples.length > 0) {
      rafId = window.requestAnimationFrame(frame);
    } else {
      rafId = 0;
    }
  };

  const addRipple = (x, y, strength) => {
    ripples.push({
      x,
      y,
      born: performance.now(),
      strength
    });
    if (ripples.length > 48) ripples.splice(0, ripples.length - 48);
    if (!rafId) {
      rafId = window.requestAnimationFrame(frame);
    }
  };

  window.addEventListener(
    'mousemove',
    (event) => {
      const now = performance.now();
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      if (now - lastSpawn < minGapMs && dist < minDist) return;
      lastX = event.clientX;
      lastY = event.clientY;
      lastSpawn = now;
      const speed = Math.min(dist / 18, 1);
      addRipple(event.clientX, event.clientY, 0.55 + speed * 0.35);
    },
    { passive: true }
  );

  const themeObserver = new MutationObserver(() => {
    waveColor = readWaveColor();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  resize();
  window.addEventListener('resize', resize, { passive: true });
})();
