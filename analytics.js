(function () {
  var STORE = 'kb-insights-v1';
  var SESSION = 'kb-session-v1';
  var VISITOR = 'kb-visitor-v1';
  var SKIP = 'kb-insights-skip';
  var onInsights = /insights\.html$/.test(location.pathname);

  function skipped() {
    try { return localStorage.getItem(SKIP) === '1'; }
    catch (e) { return false; }
  }

  function blank() {
    return {
      visits: 0,
      newVisitors: 0,
      returning: 0,
      sources: {},
      sections: {},
      clicks: {},
      devices: {},
      languages: {},
      timezones: {},
      days: {},
      updated: 0
    };
  }

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(STORE));
      if (!data || typeof data !== 'object') return blank();
      data.sources = data.sources || {};
      data.sections = data.sections || {};
      data.clicks = data.clicks || {};
      data.devices = data.devices || {};
      data.languages = data.languages || {};
      data.timezones = data.timezones || {};
      data.days = data.days || {};
      return data;
    } catch (e) {
      return blank();
    }
  }

  function save(data) {
    data.updated = Date.now();
    try {
      localStorage.setItem(STORE, JSON.stringify(data));
    } catch (e) {}
  }

  function localDay(date) {
    var d = date || new Date();
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + month + '-' + day;
  }

  function bump(map, key, by) {
    var name = String(key || 'Unknown').replace(/\s+/g, ' ').trim().slice(0, 72) || 'Unknown';
    map[name] = (map[name] || 0) + (by || 1);
  }

  function sourceLabel() {
    try {
      var params = new URLSearchParams(location.search);
      var utm = params.get('utm_source') || params.get('source');
      if (utm) return utm;
      if (!document.referrer) return 'Direct';
      var host = new URL(document.referrer).hostname.replace(/^www\./, '');
      if (!host || host === location.hostname) return 'Direct';
      return host;
    } catch (e) {
      return 'Direct';
    }
  }

  function clickLabel(el) {
    if (el.classList.contains('nav-link')) return 'Tab · ' + el.textContent.trim();
    if (el.dataset && el.dataset.expView) return 'Work · ' + (el.dataset.expView === 'map' ? 'Map' : 'List');
    if (el.id === 'themeToggle') return 'Theme';
    if (el.id === 'skillsToggle') return 'Skills · show all';
    if (el.id === 'filterToggle') return 'Projects · filter';
    if (el.classList.contains('filter-option')) return 'Filter · ' + el.textContent.trim();
    if (el.classList.contains('map-pin') || el.closest('.map-pin')) {
      var pin = el.classList.contains('map-pin') ? el : el.closest('.map-pin');
      var pinName = pin.querySelector('.map-pin-name');
      return 'Map · ' + ((pinName && pinName.textContent.trim()) || pin.dataset.place || 'place');
    }
    if (el.classList.contains('btn')) return 'Button · ' + el.textContent.trim();
    if (el.classList.contains('contact-card')) {
      var title = el.querySelector('.contact-card-title');
      return 'Contact · ' + (title ? title.textContent.trim() : 'card');
    }
    if (el.classList.contains('project-link')) {
      var card = el.closest('.project-card');
      var heading = card && card.querySelector('h3');
      var kind = el.getAttribute('aria-label') || 'Open';
      return 'Project · ' + (heading ? heading.textContent.trim() : 'project') + ' · ' + kind;
    }
    var blog = el.closest('.blog-card');
    if (blog) {
      var blogTitle = blog.querySelector('.blog-title');
      return 'Blog · ' + (blogTitle ? blogTitle.textContent.trim() : 'story');
    }
    return '';
  }

  function renderInsights() {
    var root = document.getElementById('insights');
    if (!root) return;
    var data = load();
    var today = localDay();
    var topSource = topKey(data.sources);
    var topSection = topSectionKey(data.sections);

    root.innerHTML =
      '<section class="insights-stats">' +
        stat('Visits', data.visits) +
        stat('Today', data.days[today] || 0) +
        stat('New', data.newVisitors) +
        stat('Returning', data.returning) +
      '</section>' +
      '<section class="insights-grid">' +
        panel('Where they came from', Object.keys(data.sources).length ? bars(data.sources, formatCount) : emptyCopy('Sources show up after a visit.'), topSource ? 'Top source · ' + topSource : '') +
        panel('Where attention stayed', topSection ? sectionBars(data.sections) : emptyCopy('Scroll the portfolio and time in each section collects here.'), topSection ? 'Most time · ' + labelSection(topSection) : '') +
        panel('What got clicked', emptyOrBars(data.clicks, 'Tabs, buttons, projects, and contact clicks land here.', formatCount), '') +
        panel('Who visited', visitorCopy(data), '') +
      '</section>' +
      '<section class="insights-days">' +
        '<p class="insights-kicker">Last 14 days</p>' +
        dayBars(data.days) +
      '</section>';
  }

  function stat(label, value) {
    return '<div class="insights-stat"><span class="insights-stat-value">' + value + '</span><span class="insights-stat-label">' + label + '</span></div>';
  }

  function panel(title, body, note) {
    return '<article class="insights-panel"><header class="insights-panel-head"><h2>' + title + '</h2>' +
      (note ? '<p>' + escapeHtml(note) + '</p>' : '') +
      '</header>' + body + '</article>';
  }

  function emptyCopy(text) {
    return '<p class="insights-empty">' + text + '</p>';
  }

  function emptyOrBars(map, emptyText, format) {
    if (!Object.keys(map).length) return emptyCopy(emptyText);
    return bars(map, format);
  }

  function bars(map, format) {
    var rows = Object.keys(map).map(function (key) {
      return { key: key, value: map[key] };
    }).sort(function (a, b) { return b.value - a.value; }).slice(0, 6);
    var max = rows[0] ? rows[0].value : 1;
    return '<ul class="insights-bars">' + rows.map(function (row) {
      var width = Math.max(6, Math.round((row.value / max) * 100));
      return '<li><span class="insights-bar-label">' + escapeHtml(row.key) + '</span>' +
        '<span class="insights-bar-track"><span class="insights-bar-fill" style="width:' + width + '%"></span></span>' +
        '<span class="insights-bar-value">' + format(row.value) + '</span></li>';
    }).join('') + '</ul>';
  }

  function sectionBars(map) {
    var rows = Object.keys(map).map(function (key) {
      return { key: key, ms: map[key].ms || 0, views: map[key].views || 0 };
    }).filter(function (row) { return row.ms > 0; })
      .sort(function (a, b) { return b.ms - a.ms; });
    if (!rows.length) return '';
    var max = rows[0].ms || 1;
    return '<ul class="insights-bars">' + rows.map(function (row) {
      var width = Math.max(6, Math.round((row.ms / max) * 100));
      return '<li><span class="insights-bar-label">' + labelSection(row.key) + '</span>' +
        '<span class="insights-bar-track"><span class="insights-bar-fill" style="width:' + width + '%"></span></span>' +
        '<span class="insights-bar-value">' + formatDuration(row.ms) + '</span></li>';
    }).join('') + '</ul>';
  }

  function visitorCopy(data) {
    if (!data.visits) return emptyCopy('A visit records device, language, and timezone. No name and no address.');
    return '<div class="insights-mix">' +
      mix('Device', data.devices) +
      mix('Language', data.languages) +
      mix('Timezone', data.timezones) +
      '</div>';
  }

  function mix(label, map) {
    var rows = Object.keys(map).sort(function (a, b) { return map[b] - map[a]; }).slice(0, 3);
    var text = rows.length ? rows.map(function (key) { return key + ' ' + map[key]; }).join(' · ') : '—';
    return '<p><span>' + label + '</span><strong>' + escapeHtml(text) + '</strong></p>';
  }

  function dayBars(days) {
    var labels = [];
    var now = new Date();
    for (var i = 13; i >= 0; i--) {
      var date = new Date(now);
      date.setDate(now.getDate() - i);
      labels.push(localDay(date));
    }
    var max = 1;
    labels.forEach(function (day) { max = Math.max(max, days[day] || 0); });
    return '<div class="insights-daybars" aria-hidden="true">' + labels.map(function (day) {
      var count = days[day] || 0;
      var height = count ? Math.max(12, Math.round((count / max) * 100)) : 6;
      return '<span title="' + day + ': ' + count + '" style="height:' + height + '%"></span>';
    }).join('') + '</div>';
  }

  function topKey(map) {
    var best = '';
    var bestValue = 0;
    Object.keys(map).forEach(function (key) {
      if (map[key] > bestValue) {
        best = key;
        bestValue = map[key];
      }
    });
    return best;
  }

  function topSectionKey(map) {
    var best = '';
    var bestValue = 0;
    Object.keys(map).forEach(function (key) {
      var ms = map[key] && map[key].ms || 0;
      if (ms > bestValue) {
        best = key;
        bestValue = ms;
      }
    });
    return best;
  }

  function labelSection(id) {
    var names = {
      home: 'Home',
      about: 'About',
      work: 'Work',
      achievements: 'Achievements',
      projects: 'Projects',
      blogs: 'Blogs',
      contact: 'Contact'
    };
    return names[id] || id;
  }

  function formatCount(value) {
    return String(value);
  }

  function formatDuration(ms) {
    var seconds = Math.round(ms / 1000);
    if (seconds < 60) return seconds + 's';
    var minutes = Math.floor(seconds / 60);
    var remain = seconds % 60;
    if (minutes < 60) return remain ? minutes + 'm ' + remain + 's' : minutes + 'm';
    var hours = Math.floor(minutes / 60);
    return hours + 'h ' + (minutes % 60) + 'm';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  if (onInsights) {
    try {
      if (localStorage.getItem(SKIP) !== '1') {
        localStorage.setItem(SKIP, '1');
        localStorage.removeItem(STORE);
        localStorage.removeItem(VISITOR);
      }
    } catch (e) {}
    renderInsights();
    window.addEventListener('storage', renderInsights);
    setInterval(renderInsights, 4000);
    return;
  }

  if (skipped()) return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.webdriver) return;

  if (!sessionStorage.getItem(SESSION)) {
    sessionStorage.setItem(SESSION, '1');
    var data = load();
    data.visits += 1;
    if (localStorage.getItem(VISITOR)) data.returning += 1;
    else {
      data.newVisitors += 1;
      localStorage.setItem(VISITOR, '1');
    }
    bump(data.sources, sourceLabel());
    bump(data.devices, window.matchMedia('(max-width: 768px)').matches ? 'Mobile' : 'Desktop');
    bump(data.languages, navigator.language || 'Unknown');
    var timezone = 'Unknown';
    try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || timezone; } catch (e) {}
    bump(data.timezones, timezone);
    bump(data.days, localDay());
    save(data);
  }

  var sections = ['home', 'about', 'work', 'achievements', 'projects', 'blogs', 'contact'];
  var active = '';
  var activeAt = 0;
  var seen = {};

  function flush() {
    if (!active || !activeAt) return;
    var elapsed = Date.now() - activeAt;
    activeAt = Date.now();
    if (elapsed < 500) return;
    var stored = load();
    if (!stored.sections[active]) stored.sections[active] = { ms: 0, views: 0 };
    stored.sections[active].ms += elapsed;
    save(stored);
  }

  function setActive(id) {
    if (!id || id === active) return;
    flush();
    active = id;
    activeAt = Date.now();
    if (seen[id]) return;
    seen[id] = true;
    var stored = load();
    if (!stored.sections[id]) stored.sections[id] = { ms: 0, views: 0 };
    stored.sections[id].views += 1;
    save(stored);
  }

  if ('IntersectionObserver' in window) {
    var ratios = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      var best = '';
      var bestRatio = 0;
      sections.forEach(function (id) {
        if ((ratios[id] || 0) > bestRatio) {
          best = id;
          bestRatio = ratios[id];
        }
      });
      if (best && bestRatio >= 0.4) setActive(best);
    }, { threshold: [0, 0.4, 0.65] });
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush();
    else activeAt = Date.now();
  });
  window.addEventListener('pagehide', flush);
  setInterval(function () {
    if (document.visibilityState === 'visible') flush();
  }, 15000);

  document.addEventListener('click', function (event) {
    var el = event.target.closest('a, button');
    if (!el) return;
    var label = clickLabel(el);
    if (!label) return;
    var stored = load();
    bump(stored.clicks, label);
    save(stored);
  }, true);
})();
