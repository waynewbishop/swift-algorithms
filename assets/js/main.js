/**
 * Apple Developer Documentation Theme
 * Main JavaScript
 */

(function() {
  'use strict';

  // Mobile sidebar toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (sidebarToggle && sidebar && sidebarOverlay) {
    // Toggle sidebar
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });

    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close sidebar when clicking a link
    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove('active');
          sidebarOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add copy button to code blocks
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(function(codeBlock) {
    const pre = codeBlock.parentElement;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="4" width="8" height="8" stroke="currentColor" stroke-width="1.5" fill="none" rx="1"/>
        <path d="M6 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1" stroke="currentColor" stroke-width="1.5" fill="none"/>
      </svg>
      <span>Copy</span>
    `;

    copyButton.addEventListener('click', function() {
      const code = codeBlock.textContent;
      navigator.clipboard.writeText(code).then(function() {
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Copied!</span>
        `;
        copyButton.classList.add('copied');

        setTimeout(function() {
          copyButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="4" y="4" width="8" height="8" stroke="currentColor" stroke-width="1.5" fill="none" rx="1"/>
              <path d="M6 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            <span>Copy</span>
          `;
          copyButton.classList.remove('copied');
        }, 2000);
      });
    });

    wrapper.appendChild(copyButton);
  });

  // Add styles for code wrapper and copy button
  const style = document.createElement('style');
  style.textContent = `
    .code-wrapper {
      position: relative;
      margin: 24px 0;
    }

    .copy-button {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #d2d2d7;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #1d1d1f;
      cursor: pointer;
      transition: all 150ms ease;
      opacity: 0;
    }

    .code-wrapper:hover .copy-button {
      opacity: 1;
    }

    .copy-button:hover {
      background: #ffffff;
      border-color: #0066cc;
      color: #0066cc;
    }

    .copy-button.copied {
      background: #34c759;
      border-color: #34c759;
      color: white;
    }

    .copy-button svg {
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);

  // Highlight current section in sidebar on scroll
  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            const currentLink = document.querySelector('.nav-link.active');
            if (currentLink) {
              currentLink.classList.remove('active');
            }
            const newLink = document.querySelector(`.nav-link[href*="${id}"]`);
            if (newLink) {
              newLink.classList.add('active');
            }
          }
        }
      });
    },
    {
      rootMargin: '-100px 0px -66%',
      threshold: 0
    }
  );

  // Observe all headings
  document.querySelectorAll('h2[id], h3[id]').forEach(function(heading) {
    observer.observe(heading);
  });

})();
