document.addEventListener('DOMContentLoaded', function () {

  // ─── 7. Current Year in Footer ───────────────────────────────────────────
  document.querySelectorAll('.current-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ─── 1. Scroll Reveal Animation ──────────────────────────────────────────
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('revealed');
      if (el.hasAttribute('data-reveal-stagger')) {
        var children = el.children;
        for (var i = 0; i < children.length; i++) {
          children[i].style.animationDelay = (i * 100) + 'ms';
        }
      }
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ─── 2. Mobile Navigation Toggle ─────────────────────────────────────────
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    function setMobileMenuState(isOpen) {
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    }

    function closeMobileMenu() {
      setMobileMenuState(false);
    }

    hamburger.addEventListener('click', function () {
      setMobileMenuState(!mobileMenu.classList.contains('open'));
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    document.addEventListener('click', function (e) {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  // ─── 3. Active Nav Link on Scroll ────────────────────────────────────────
  var sections = document.querySelectorAll('section[id]');

  if (sections.length > 0) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
          link.classList.remove('active');
        });
        var activeLink = document.querySelector('a[href="#' + id + '"]');
        if (activeLink) activeLink.classList.add('active');
      });
    }, { threshold: 0.3 });

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  // ─── 4. Interactive Terminal ──────────────────────────────────────────────
  var terminalInput  = document.getElementById('terminal-input');
  var terminalOutput = document.getElementById('terminal-output');
  var terminalBody   = document.querySelector('.terminal-body');
  var cmdHistory     = [];
  var historyIndex   = -1;

  function scrollToBottom() {
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  function getElementText(selector) {
    var el = document.querySelector(selector);
    return el ? normalizeText(el.innerText || el.textContent) : '';
  }

  function buildHelpLines() {
    return [
      { text: 'Available commands:', cls: 't-success' },
      { text: '' },
      { text: '  about           — About Me section' },
      { text: '  experience      — Experience section' },
      { text: '  education       — Education section' },
      { text: '  certifications  — Certifications section' },
      { text: '  contact         — Contact section' },
      { text: '  clear           — clear terminal' },
      { text: '' },
      { text: 'Tip: use ↑ ↓ to navigate history, Tab to autocomplete.', cls: 't-dim' },
    ];
  }

  function buildAboutLines() {
    var lines = [
      { text: '[ about ]', cls: 't-accent' },
      { text: '' },
    ];

    document.querySelectorAll('.about-text p').forEach(function (paragraph, index, items) {
      lines.push({ text: normalizeText(paragraph.textContent), cls: 't-copy' });
      if (index < items.length - 1) lines.push({ text: '' });
    });

    return lines;
  }

  function buildExperienceLines() {
    var lines = [
      { text: '[ experience ]', cls: 't-accent' },
      { text: '' },
    ];

    document.querySelectorAll('.timeline-item').forEach(function (item, itemIndex, items) {
      var company = getElementText('.timeline-item:nth-of-type(' + (itemIndex + 1) + ') .timeline-company');
      var period = getElementText('.timeline-item:nth-of-type(' + (itemIndex + 1) + ') .timeline-period');
      if (company || period) {
        lines.push({ text: company + (period ? '  ·  ' + period : ''), cls: 't-success' });
      }

      var roles = item.querySelector('.timeline-role');
      if (roles) {
        Array.prototype.forEach.call(roles.children, function (roleItem) {
          if (roleItem.tagName !== 'LI') return;
          var strong = roleItem.querySelector('strong');
          if (strong) {
            lines.push({ text: '  ' + normalizeText(strong.textContent), cls: 't-subhead' });
          }

          var nestedList = roleItem.querySelector('ul');
          if (nestedList) {
            Array.prototype.forEach.call(nestedList.children, function (bullet) {
              if (bullet.tagName !== 'LI') return;
              lines.push({ text: '  · ' + normalizeText(bullet.textContent), cls: 't-list' });
            });
          }
        });
      }

      if (itemIndex < items.length - 1) lines.push({ text: '' });
    });

    return lines;
  }

  function buildEducationLines() {
    var lines = [
      { text: '[ education ]', cls: 't-accent' },
      { text: '' },
    ];

    document.querySelectorAll('.edu-card').forEach(function (card) {
      var degree = normalizeText(card.querySelector('.edu-degree').textContent);
      var institution = normalizeText(card.querySelector('.edu-institution').textContent);
      lines.push({ text: degree, cls: 't-success' });
      lines.push({ text: '  ' + institution, cls: 't-subtext' });
      lines.push({ text: '' });
    });

    if (lines[lines.length - 1].text === '') lines.pop();
    return lines;
  }

  function buildCertificationLines() {
    var lines = [
      { text: '[ certifications ]', cls: 't-accent' },
      { text: '' },
    ];
    var groups = [];
    var seen = {};

    document.querySelectorAll('.cert-card').forEach(function (card) {
      var issuer = normalizeText(card.querySelector('.cert-badge').textContent);
      var name = normalizeText(card.querySelector('.cert-name').textContent);

      if (!seen[issuer]) {
        seen[issuer] = { issuer: issuer, names: [] };
        groups.push(seen[issuer]);
      }

      seen[issuer].names.push(name);
    });

    groups.forEach(function (group, groupIndex) {
      lines.push({ text: group.issuer, cls: 't-success' });
      group.names.forEach(function (name) {
        lines.push({ text: '  ' + name, cls: 't-subtext' });
      });
      if (groupIndex < groups.length - 1) lines.push({ text: '' });
    });

    return lines;
  }

  function buildContactLines() {
    var lines = [
      { text: '[ contact ]', cls: 't-accent' },
      { text: '' },
    ];

    document.querySelectorAll('.contact-card').forEach(function (card) {
      var label = normalizeText(card.querySelector('.contact-label').textContent).toLowerCase();
      var value = normalizeText(card.querySelector('.contact-value').textContent);
      lines.push({ text: '  ' + label.padEnd(9, ' ') + value, cls: 't-subtext' });
    });

    return lines;
  }

  var commands = {
    'help': buildHelpLines,
    'about': buildAboutLines,
    'experience': buildExperienceLines,
    'education': buildEducationLines,
    'certifications': buildCertificationLines,
    'contact': buildContactLines,
  };

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function appendLine(text, cls) {
    var el = document.createElement('span');
    el.className = 't-line' + (cls ? ' ' + cls : '');
    if (text === '') {
      el.textContent = '\u00a0';
    } else if (cls && cls.indexOf('t-banner-live') !== -1) {
      el.innerHTML =
        '<span class="t-banner-live-icon" aria-hidden="true">&gt;_</span>' +
        '<span class="t-banner-live-text">' + escHtml(text) + '</span>';
    } else {
      el.textContent = text;
    }
    terminalOutput.appendChild(el);
    scrollToBottom();
  }

  function showBanner() {
    var heroName = getElementText('.hero-name');
    var lines = [
      { text: '[*] Initializing portfolio...',              cls: 't-banner t-dim',     delay: 0   },
      { text: '[*] Target : ' + heroName,                  cls: 't-banner t-dim',     delay: 150 },
      { text: '',                                           cls: 't-banner-gap', delay: 300 },
      { text: 'Connection established...',                  cls: 't-banner t-banner-live t-success', delay: 440 },
      { text: '',                                           cls: '',          delay: 640 },
      { text: "Type 'help' to explore my profile.",        cls: 't-banner t-dim',     delay: 740 },
      { text: '',                                           cls: '',          delay: 790 },
    ];
    lines.forEach(function (l) {
      setTimeout(function () { appendLine(l.text, l.cls); }, l.delay);
    });
  }

  function processCommand(raw) {
    var input = raw.trim().toLowerCase();

    if (input !== '') {
      cmdHistory.unshift(raw);
      if (cmdHistory.length > 50) cmdHistory.pop();
    }
    historyIndex = -1;

    if (input === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    // Echo the typed command
    var echoWrap = document.createElement('span');
    echoWrap.className = 't-line t-echo';
    echoWrap.innerHTML = '<span class="t-prompt-sym">$ </span>' + escHtml(raw);
    terminalOutput.appendChild(echoWrap);

    if (input === '') {
      scrollToBottom();
      return;
    }

    if (Object.prototype.hasOwnProperty.call(commands, input)) {
      var lines = commands[input]();
      lines.forEach(function (line, i) {
        setTimeout(function () {
          var responseCls = line.text === '' ? '' : 't-response';
          var cls = (responseCls + (line.cls ? ' ' + line.cls : '')).trim();
          appendLine(line.text, cls);
          if (i === lines.length - 1) appendLine('');
        }, i * 22);
      });
    } else {
      setTimeout(function () {
        appendLine("command not found: '" + escHtml(raw) + "' — type 'help' for available commands", 't-response t-error');
        appendLine('');
      }, 0);
    }
  }

  if (terminalOutput) {
    showBanner();

    // Click anywhere in the terminal body to focus input
    if (terminalBody) {
      terminalBody.addEventListener('click', function () {
        if (terminalInput) terminalInput.focus();
      });
    }
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        processCommand(terminalInput.value);
        terminalInput.value = '';

      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < cmdHistory.length - 1) {
          historyIndex++;
          terminalInput.value = cmdHistory[historyIndex];
          // move cursor to end
          var len = terminalInput.value.length;
          terminalInput.setSelectionRange(len, len);
        }

      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = cmdHistory[historyIndex];
        } else {
          historyIndex = -1;
          terminalInput.value = '';
        }

      } else if (e.key === 'Tab') {
        e.preventDefault();
        var partial = terminalInput.value.trim().toLowerCase();
        if (!partial) return;
        var matches = Object.keys(commands).filter(function (cmd) {
          return cmd.indexOf(partial) === 0;
        });
        if (matches.length === 1) {
          terminalInput.value = matches[0];
        }

      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        terminalOutput.innerHTML = '';
      }
    });
  }

  // ─── 5. Smooth Scroll ────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ─── 6. Typing Effect on Hero ─────────────────────────────────────────────
  var heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    var typeText = 'Pentester & Science Communicator';
    heroSubtitle.textContent = '';
    var charIndex = 0;

    function typeNextChar() {
      if (charIndex < typeText.length) {
        heroSubtitle.textContent += typeText.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, 60);
      }
    }

    typeNextChar();
  }

});
