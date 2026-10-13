/**
 * ELITE ROOFING SHOWCASE & PROSPECT PERSONALIZATION ENGINE
 * Vanilla JavaScript • High-Converting Sales Preview Platform
 * 
 * Truthful, verifiable US roofing business presentation.
 * Supports static hosting on GitHub Pages with zero build step.
 */

(function () {
  'use strict';

  // State
  let currentConfig = {};
  let currentPresetKey = 'default';

  /* ========================================================================
     1. UTILITIES & COLOR COMPUTATION
     ======================================================================== */

  function getUrlParams() {
    return new URLSearchParams(window.location.search);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function sanitizeColor(hex, fallback) {
    if (!hex) return fallback;
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex.trim()) ? hex.trim() : fallback;
  }

  function calculateHoverColor(hex) {
    try {
      let c = hex.replace('#', '');
      if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      }
      const num = parseInt(c, 16);
      let r = (num >> 16) - 25;
      let g = ((num >> 8) & 0x00FF) - 25;
      let b = (num & 0x0000FF) - 25;
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    } catch (e) {
      return hex;
    }
  }

  function formatPhoneForTel(phoneStr) {
    if (!phoneStr) return 'tel:';
    const cleaned = phoneStr.replace(/[^\d+]/g, '');
    return 'tel:' + (cleaned.startsWith('+') ? cleaned : cleaned);
  }

  function getMonogramInitials(name) {
    if (!name) return 'RF';
    const words = name.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  /* ========================================================================
     2. CONFIGURATION RESOLUTION
     ======================================================================== */

  function resolveConfiguration() {
    const params = getUrlParams();
    const presets = window.ROOFING_PRESETS || {};
    
    // 1. Identify base preset
    const requestedBusiness = (params.get('business') || 'default').trim().toLowerCase();
    const businessSlug = Object.keys(presets).find(key =>
      key.toLowerCase() === requestedBusiness ||
      String(presets[key].slug || '').trim().toLowerCase() === requestedBusiness ||
      String(presets[key].name || '').trim().toLowerCase() === requestedBusiness
    ) || 'default';
    const basePreset = presets[businessSlug] || presets['default'] || {};
    currentPresetKey = businessSlug;

    // 2. Clone preset as baseline
    const config = JSON.parse(JSON.stringify(basePreset));

    // 3. Apply Explicit Query Parameter Overrides
    if (params.has('name')) {
      config.name = params.get('name').trim();
      if (!params.has('description') && basePreset.description && basePreset.name) {
        config.description = basePreset.description.split(basePreset.name).join(config.name);
      }
    }
    if (params.has('phone')) config.phone = params.get('phone').trim();
    if (params.has('email')) config.email = params.get('email').trim();
    if (params.has('city')) config.city = params.get('city').trim();
    if (params.has('state')) config.state = params.get('state').trim();
    if (params.has('province')) config.state = params.get('province').trim();
    if (params.has('country')) config.country = params.get('country').trim();
    if (params.has('address')) config.address = params.get('address').trim();
    if (params.has('zip')) config.zip = params.get('zip').trim();
    if (params.has('postalCode')) config.zip = params.get('postalCode').trim();
    if (params.has('logo')) config.logo = params.get('logo').trim();
    if (params.has('accent')) config.accent = sanitizeColor(params.get('accent'), config.accent || '#D97736');
    if (params.has('headline')) config.headline = params.get('headline').trim();
    if (params.has('description')) config.description = params.get('description').trim();
    if (params.has('cta')) config.cta = params.get('cta').trim();
    if (params.has('businessType')) config.businessType = params.get('businessType').trim().toLowerCase();
    if (params.has('freeEstimates')) config.freeEstimates = params.get('freeEstimates') === 'true';
    if (params.has('website')) config.website = params.get('website').trim();
    if (params.has('heroImage')) config.heroImage = params.get('heroImage').trim();

    // Map Location Query (supports ?location=City,ST or ?mapQuery=City,ST or ?location=Toronto, ON, Canada)
    if (params.has('location') || params.has('mapQuery')) {
      const locVal = (params.get('location') || params.get('mapQuery')).trim();
      config.location = locVal;
      config.mapQuery = locVal;

      // Smart auto-parse if city/state not explicitly supplied:
      // e.g. "Toronto, ON, Canada" -> city: Toronto, state: ON, country: Canada
      // e.g. "Miami, FL" -> city: Miami, state: FL
      if (!params.has('city') && locVal) {
        const parts = locVal.split(',').map(p => p.trim()).filter(Boolean);
        if (parts.length > 0) {
          config.city = parts[0];
          config.cityFromLocation = true;
        }
        if (!params.has('state') && !params.has('province') && parts.length > 1) {
          config.state = parts[1];
        }
        if (!params.has('country') && parts.length > 2) {
          config.country = parts[2];
        }
      }
    }

    // Service Areas Override (supports ?serviceAreas=... or ?areas=...)
    // Supports comma, semicolon, or pipe delimiters: e.g. Downtown,North York,Scarborough
    config.hasCustomAreas = false;
    if (params.has('serviceAreas') || params.has('areas')) {
      const areasStr = (params.get('serviceAreas') || params.get('areas')).trim();
      if (areasStr) {
        config.serviceAreas = areasStr.split(/[,;|]/).map(s => s.trim()).filter(Boolean);
        config.hasCustomAreas = true;
      }
    }

    // Enabled Services Override (comma-separated IDs)
    if (params.has('services')) {
      const servicesStr = params.get('services');
      config.enabledServices = servicesStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    }

    // Reviews Override
    if (params.has('googleRating')) config.googleRating = params.get('googleRating').trim();
    if (params.has('reviewCount')) config.reviewCount = params.get('reviewCount').trim();

    return config;
  }

  /* ========================================================================
     3. DOM APPLICATION & PERSONALIZATION
     ======================================================================== */

  function applyBrandTheme(colorHex) {
    const validHex = sanitizeColor(colorHex, '#D97736');
    const hoverHex = calculateHoverColor(validHex);
    document.documentElement.style.setProperty('--accent', validHex);
    document.documentElement.style.setProperty('--accent-hover', hoverHex);
    document.documentElement.style.setProperty('--accent-subtle', validHex + '1F');
    document.documentElement.style.setProperty('--accent-glow', validHex + '40');
  }

  function applyConfigurationToDOM(config) {
    currentConfig = config;

    // Apply Brand Accent Color
    applyBrandTheme(config.accent);

    // Document Title & Meta
    const typeLabel = config.businessType === 'commercial' ? 'Commercial Roofing' : (config.businessType === 'residential' ? 'Residential Roofing' : 'Roofing Solutions');
    const cityStr = config.city ? ` in ${config.city}${config.state ? ', ' + config.state : ''}` : '';
    document.title = `${config.name} | ${typeLabel}${cityStr}`;

    const shareTitle = `${config.name} | ${typeLabel}${cityStr}`;
    const shareDescription = config.description || `Explore roofing services and request an estimate from ${config.name}.`;
    const socialMeta = (selector, value) => {
      const meta = document.querySelector(selector);
      if (meta) meta.setAttribute('content', value);
    };
    socialMeta('meta[property="og:title"]', shareTitle);
    socialMeta('meta[property="og:description"]', shareDescription);
    socialMeta('meta[property="og:image"]', new URL('assets/images/optimized/Hero_Image.webp', window.location.href).href);
    socialMeta('meta[name="twitter:title"]', shareTitle);
    socialMeta('meta[name="twitter:description"]', shareDescription);

    // Top Bar Tagline
    const topBarTagline = document.getElementById('topBarTagline');
    if (topBarTagline) {
      if (config.city) {
        topBarTagline.textContent = `Serving ${config.city} & Surrounding Communities`;
      } else {
        topBarTagline.textContent = `Serving Our Local Community & Surrounding Areas`;
      }
    }

    // Phone Link Handling
    const hasPhone = Boolean(config.phone && config.phone.trim() !== '');
    const telHref = formatPhoneForTel(config.phone);

    document.querySelectorAll('.phone-link').forEach(el => {
      if (hasPhone) {
        el.setAttribute('href', telHref);
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    document.querySelectorAll('.phone-text').forEach(el => {
      if (hasPhone) {
        el.textContent = config.phone;
      }
    });

    // Header Phone CTA visibility
    const headerPhoneCta = document.querySelector('.header-phone-cta');
    if (headerPhoneCta) {
      headerPhoneCta.style.display = hasPhone ? '' : 'none';
    }

    // Hero secondary call button visibility
    const heroSecondaryPhoneBtn = document.getElementById('heroSecondaryPhoneBtn');
    if (heroSecondaryPhoneBtn) {
      heroSecondaryPhoneBtn.style.display = hasPhone ? 'inline-flex' : 'none';
    }

    // Brand Name and Monogram
    const monogramInitials = getMonogramInitials(config.name);
    ['brandMonogram', 'footerMonogram'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = monogramInitials;
    });

    ['brandName', 'drawerBrandName', 'footerBrandName', 'copyrightBrand', 'previewClientLabel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = config.name;
    });

    // Header Tagline
    const brandTagline = document.getElementById('brandTagline');
    if (brandTagline) {
      if (config.businessType === 'residential') brandTagline.textContent = 'RESIDENTIAL ROOFING';
      else if (config.businessType === 'commercial') brandTagline.textContent = 'COMMERCIAL ROOFING';
      else brandTagline.textContent = 'ROOFING SOLUTIONS';
    }

    // Logo Handling (with graceful fallback)
    const brandLogoImg = document.getElementById('brandLogoImg');
    const brandMonogram = document.getElementById('brandMonogram');
    const footerLogoImg = document.getElementById('footerLogoImg');
    const footerMonogram = document.getElementById('footerMonogram');

    if (config.logo && config.logo.trim() !== '') {
      const testImg = new Image();
      testImg.onload = function () {
        if (brandLogoImg) {
          brandLogoImg.src = config.logo;
          brandLogoImg.style.display = 'block';
        }
        if (brandMonogram) brandMonogram.style.display = 'none';
        if (footerLogoImg) {
          footerLogoImg.src = config.logo;
          footerLogoImg.style.display = 'block';
        }
        if (footerMonogram) footerMonogram.style.display = 'none';
      };
      testImg.onerror = function () {
        if (brandLogoImg) brandLogoImg.style.display = 'none';
        if (brandMonogram) brandMonogram.style.display = 'flex';
        if (footerLogoImg) footerLogoImg.style.display = 'none';
        if (footerMonogram) footerMonogram.style.display = 'flex';
      };
      testImg.src = config.logo;
    } else {
      if (brandLogoImg) brandLogoImg.style.display = 'none';
      if (brandMonogram) brandMonogram.style.display = 'flex';
      if (footerLogoImg) footerLogoImg.style.display = 'none';
      if (footerMonogram) footerMonogram.style.display = 'flex';
    }

    // Hero Section Content
    const heroEyebrowText = document.getElementById('heroEyebrowText');
    if (heroEyebrowText) {
      if (config.city) {
        heroEyebrowText.textContent = `ROOFING SERVICES IN ${config.city.toUpperCase()}${config.state ? ', ' + config.state.toUpperCase() : ''}`;
      } else {
        heroEyebrowText.textContent = `ROOFING SERVICES & PROPERTY PROTECTION`;
      }
    }

    const heroHeadline = document.getElementById('heroHeadline');
    if (heroHeadline) {
      heroHeadline.textContent = config.headline || "Roofing Solutions to Protect What Matters Most.";
    }

    const heroDescription = document.getElementById('heroDescription');
    if (heroDescription) {
      heroDescription.textContent = config.description || 
        `From targeted roof repairs and inspections to seamless gutters and commercial systems, ${config.name} helps property owners protect their investment with dependable craftsmanship and clear communication.`;
    }

    const heroPrimaryCtaText = document.getElementById('heroPrimaryCtaText');
    if (heroPrimaryCtaText) {
      heroPrimaryCtaText.textContent = config.cta || (config.freeEstimates ? "Request a Free Estimate" : "Request an Estimate");
    }

    const headerCtaText = document.getElementById('headerCtaText');
    if (headerCtaText) {
      headerCtaText.textContent = config.freeEstimates ? "Get Free Estimate" : "Request Estimate";
    }

    const drawerCtaText = document.getElementById('drawerCtaText');
    if (drawerCtaText) {
      drawerCtaText.textContent = config.freeEstimates ? "Get Free Estimate" : "Request Estimate";
    }

    // Hero Trust Items
    const heroTrustItem1 = document.getElementById('heroTrustItem1');
    if (heroTrustItem1) {
      heroTrustItem1.textContent = config.freeEstimates ? "Free Itemized Estimates" : "Clear, Itemized Estimates";
    }

    const heroTrustItem2 = document.getElementById('heroTrustItem2');
    if (heroTrustItem2) {
      if (config.businessType === 'residential') heroTrustItem2.textContent = "Residential Roofing Specialists";
      else if (config.businessType === 'commercial') heroTrustItem2.textContent = "Commercial Roofing Specialists";
      else heroTrustItem2.textContent = "Targeted Roof Repairs & Diagnostics";
    }

    const heroTrustItem3 = document.getElementById('heroTrustItem3');
    if (heroTrustItem3) {
      heroTrustItem3.textContent = config.city ? `Serving ${config.city} & Nearby Communities` : "Serving Our Local Community";
    }

    // Hero Tag Badge (Image overlay)
    const heroTagBadgeText = document.getElementById('heroTagBadgeText');
    if (heroTagBadgeText) {
      if (config.businessType === 'residential') heroTagBadgeText.textContent = "Residential Roofing Specialists";
      else if (config.businessType === 'commercial') heroTagBadgeText.textContent = "Commercial Roofing Specialists";
      else heroTagBadgeText.textContent = "Local Roofing Specialists";
    }

    // Floating Social Proof Badge (Hero)
    const heroSocialProofBadge = document.getElementById('heroSocialProofBadge');
    const heroRatingValue = document.getElementById('heroRatingValue');
    const heroReviewCount = document.getElementById('heroReviewCount');
    const hasVerifiedReviews = Array.isArray(config.verifiedReviews) && config.verifiedReviews.length > 0;

    if (hasVerifiedReviews) {
      if (heroSocialProofBadge) heroSocialProofBadge.style.display = 'flex';
      if (heroRatingValue) heroRatingValue.textContent = config.googleRating || "5.0";
      if (heroReviewCount) heroReviewCount.textContent = (config.reviewCount || config.verifiedReviews.length) + "+";
    } else {
      if (heroSocialProofBadge) heroSocialProofBadge.style.display = 'none';
    }

    // Hero Main Image
    const heroMainImg = document.getElementById('heroMainImg');
    if (heroMainImg && config.heroImage) {
      heroMainImg.style.backgroundImage = `url("${config.heroImage.replace(/["\\]/g, '')}")`;
    }

    // Service Areas Heading & Subtitle
    const areasHeading = document.getElementById('areasHeading');
    if (areasHeading) {
      if (config.city) {
        areasHeading.textContent = `Roofing Services Across ${config.city} and Surrounding Areas.`;
      } else {
        areasHeading.textContent = `Roofing Services Across Our Community & Surrounding Areas.`;
      }
    }

    const areasSubtitle = document.getElementById('areasSubtitle');
    if (areasSubtitle) {
      const locScope = config.city || 'our primary operating area';
      areasSubtitle.textContent = `We provide residential and commercial roofing services across ${locScope} and all surrounding neighborhoods. Contact our team to confirm service availability for your property.`;
    }

    // Footer Details (Dummy default fallback)
    const footerAddressRow = document.getElementById('footerAddressRow');
    const footerAddressText = document.getElementById('footerAddressText');
    if (footerAddressRow && footerAddressText) {
      const displayAddress = config.address || "100 Main Street, Suite 200";
      const displayCity = config.city || "City";
      const displayState = config.state || "";
      const displayZip = config.zip || "";
      const stateZip = [displayState, displayZip].filter(Boolean).join(' ');
      const displayCountry = config.country ? ` (${config.country})` : '';
      footerAddressText.textContent = `${displayAddress}, ${displayCity}${stateZip ? ', ' + stateZip : ''}${displayCountry}`;
      footerAddressRow.style.display = 'flex';
    }

    const footerEmailRow = document.getElementById('footerEmailRow');
    const footerEmailLink = document.getElementById('footerEmailLink');
    if (footerEmailRow && footerEmailLink) {
      const displayEmail = config.email || "contact@roofingcompany.com";
      footerEmailLink.href = 'mailto:' + displayEmail;
      footerEmailLink.textContent = displayEmail;
      footerEmailRow.style.display = 'flex';
    }

    const footerBrandDesc = document.getElementById('footerBrandDesc');
    if (footerBrandDesc) {
      const locStr = config.city ? `${config.city}'s` : "Your";
      footerBrandDesc.textContent = `${locStr} dependable roofing team. Specializing in residential roofing, targeted leak repairs, commercial systems, and seamless gutters with quality workmanship.`;
    }

    // Render Data Components
    renderTrustStrip(config);
    renderServices(config);
    renderEducation();
    renderReviews(config);
    renderMap(config);
    renderProcess();
    renderFAQs();
  }

  /* ========================================================================
     4. DATA RENDERING: TRUST STRIP, SERVICES, EDUCATION, MAP, PROCESS, FAQS
     ======================================================================== */

  function renderTrustStrip(config) {
    const container = document.getElementById('trustStripGrid');
    if (!container) return;

    const highlights = config.trustHighlights || [
      { 
        title: config.freeEstimates ? "Free Itemized Estimates" : "Clear Estimates", 
        desc: "Understand the recommended work and next steps before making a decision." 
      },
      { 
        title: "Targeted Roof Repairs", 
        desc: "Resolve active leaks, damaged flashing, and worn shingles efficiently." 
      },
      { 
        title: config.businessType === 'residential' ? "Residential Focus" : (config.businessType === 'commercial' ? "Commercial Systems" : "Residential & Commercial"), 
        desc: "Practical roofing services for homeowners and commercial property owners." 
      },
      { 
        title: "Local Service", 
        desc: `Serving our primary metropolitan area and all surrounding neighborhoods.` 
      }
    ];

    const icons = [
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`,
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`
    ];

    container.innerHTML = '';
    highlights.slice(0, 4).forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'trust-strip-card';
      card.innerHTML = `
        <div class="trust-strip-icon">${icons[idx % icons.length]}</div>
        <div>
          <div class="trust-strip-title">${escapeHTML(item.title)}</div>
          <div class="trust-strip-desc">${escapeHTML(item.desc)}</div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function renderServices(config) {
    const container = document.getElementById('servicesGridContainer');
    const catalog = window.MASTER_SERVICES_CATALOG || {};
    const bType = config.businessType || 'both';
    const enabledKeys = config.enabledServices;

    // Filter active services (storm damage, replacement, insurance removed)
    let activeServices = [];
    if (Array.isArray(enabledKeys) && enabledKeys.length > 0) {
      activeServices = enabledKeys
        .map(key => catalog[key])
        .filter(Boolean);
    } else {
      activeServices = Object.values(catalog).filter(s => {
        if (!s.forTypes) return true;
        return s.forTypes.includes(bType) || s.forTypes.includes('both');
      });
    }

    if (activeServices.length === 0) {
      activeServices = Object.values(catalog);
    }

    // Render Grid Cards
    if (container) {
      container.innerHTML = '';
      activeServices.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = `service-card ${index === 0 ? 'service-card-featured' : ''}`;

        let featuresHtml = '';
        if (service.features && service.features.length) {
          featuresHtml = `
            <div class="service-features-list">
              ${service.features.map(f => `
                <div class="service-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${escapeHTML(f)}</span>
                </div>
              `).join('')}
            </div>
          `;
        }

        card.innerHTML = `
          <div class="service-img-wrap">
            <img src="${escapeHTML(service.image)}" alt="${escapeHTML(service.title)}" class="service-img" loading="lazy" decoding="async">
          </div>
          <div class="service-body">
            <h3 class="service-title">${escapeHTML(service.title)}</h3>
            <p class="service-desc">${escapeHTML(service.shortDesc)}</p>
            ${featuresHtml}
            <div class="service-action">
              <button class="service-btn-link open-modal-btn" data-service="${escapeHTML(service.title)}">
                <span>${escapeHTML(service.ctaText || 'Request Estimate')}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    }

    // Populate Estimate Form Select Options
    ['inlineService', 'modalService'].forEach(selectId => {
      const selectEl = document.getElementById(selectId);
      if (selectEl) {
        selectEl.innerHTML = '<option value="">Select a roofing service...</option>';
        activeServices.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.title;
          opt.textContent = s.title;
          selectEl.appendChild(opt);
        });
      }
    });

    // Update Footer Services Links
    const footerServicesList = document.getElementById('footerServicesList');
    if (footerServicesList) {
      footerServicesList.innerHTML = '';
      activeServices.slice(0, 5).forEach(s => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#services">${escapeHTML(s.title)}</a>`;
        footerServicesList.appendChild(li);
      });
    }
  }

  function renderEducation() {
    const container = document.getElementById('educationGridContainer');
    if (!container) return;
    const topics = window.EDUCATIONAL_TOPICS || [];

    const icons = [
      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`,
      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
    ];

    container.innerHTML = '';
    topics.forEach((t, idx) => {
      const card = document.createElement('div');
      card.className = 'transformation-card';
      card.innerHTML = `
        <div class="transformation-icon-wrap">${icons[idx % icons.length]}</div>
        <h3 class="transformation-title">${escapeHTML(t.title)}</h3>
        <p class="transformation-desc">${escapeHTML(t.desc)}</p>
      `;
      container.appendChild(card);
    });
  }

  function renderReviews(config) {
    const container = document.getElementById('reviewsGridContainer');
    const summaryBar = document.getElementById('reviewsSummaryBar');
    if (!container) return;

    const reviews = config.verifiedReviews || [];

    if (Array.isArray(reviews) && reviews.length > 0) {
      if (summaryBar) {
        summaryBar.style.display = 'flex';
        const scoreEl = document.getElementById('reviewSummaryScore');
        const countEl = document.getElementById('reviewSummaryCount');
        if (scoreEl) scoreEl.textContent = config.googleRating || "5.0";
        if (countEl) countEl.textContent = (config.reviewCount || reviews.length) + "+";
      }

      container.className = 'reviews-grid';
      container.innerHTML = '';
      reviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-card';
        const initials = r.author ? r.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'HO';

        card.innerHTML = `
          <div class="review-rating-row">
            <div class="review-stars">★★★★★</div>
            <span class="review-source-tag">${escapeHTML(r.source || 'Verified Client')}</span>
          </div>
          <h4 class="review-title">"${escapeHTML(r.title || 'Exceptional craftsmanship')}"</h4>
          <p class="review-text">${escapeHTML(r.text)}</p>
          <div class="review-author-block">
            <div class="author-avatar">${escapeHTML(initials)}</div>
            <div class="author-info">
              <span class="author-name">${escapeHTML(r.author)}</span>
              <span class="author-loc">${escapeHTML(r.location)} • ${escapeHTML(r.date || 'Verified')}</span>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    } else {
      if (summaryBar) summaryBar.style.display = 'none';

      const targetCity = config.city || 'Your Area';
      container.className = '';
      container.innerHTML = `
        <div class="neutral-inquiry-box">
          <h3 class="neutral-inquiry-title">Looking for Dependable Roofing in ${escapeHTML(targetCity)}?</h3>
          <p class="neutral-inquiry-desc">
            Whether you are dealing with an active roof leak, need a thorough roof inspection, or want to explore seamless gutter solutions, ${escapeHTML(config.name)} provides straightforward recommendations and itemized estimates with zero high-pressure sales tactics.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a href="#estimate" class="btn btn-primary">${config.freeEstimates ? 'Request a Free Estimate' : 'Request an Estimate'}</a>
            ${config.phone ? `
              <a href="${formatPhoneForTel(config.phone)}" class="btn btn-outline-dark phone-link" style="color: var(--text-light-primary) !important; background: #FFFFFF; font-weight: 700;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>Call <strong class="phone-text">${escapeHTML(config.phone)}</strong></span>
              </a>
            ` : ''}
          </div>
        </div>
      `;
    }
  }

  function renderMap(config) {
    // Render Service Area Tags
    const tagsContainer = document.getElementById('areasTagsWrap');
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      let areas = [];

      // Priority 1: User explicitly passed custom service areas (via URL ?serviceAreas=, ?areas=, or editor input)
      if (config.hasCustomAreas && Array.isArray(config.serviceAreas) && config.serviceAreas.length > 0) {
        areas = config.serviceAreas;
      } 
      // Priority 2: Inferred or customized city (e.g. Toronto, Vancouver, Calgary, Miami, Denver)
      else if (config.cityFromLocation || (config.city && config.city !== 'Dallas')) {
        areas = [
          `Greater ${config.city} Metro`,
          `${config.city} Central & Downtown`,
          `${config.city} North`,
          `${config.city} South`,
          `${config.city} Westside`,
          `${config.city} East District`,
          "Surrounding Communities"
        ];
      } 
      // Priority 3: Base preset areas
      else if (Array.isArray(config.serviceAreas) && config.serviceAreas.length > 0) {
        areas = config.serviceAreas;
      } 
      // Fallback: Generic neutral regional tags
      else {
        areas = [
          "Central Metro & Downtown",
          "North District",
          "West Hills",
          "South County",
          "East Valley",
          "Surrounding Communities"
        ];
      }

      areas.forEach(area => {
        const pill = document.createElement('div');
        pill.className = 'area-tag-pill';
        pill.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${escapeHTML(area)}</span>
        `;
        tagsContainer.appendChild(pill);
      });
    }

    // Free Google Maps Dynamic Iframe Embed
    // Supports Canadian cities (e.g. Toronto, ON, Canada), any US state (e.g. Miami, FL), or international queries
    const mapIframe = document.getElementById('serviceAreaMap');
    const directionsLink = document.getElementById('mapDirectionsLink');
    const locationLabel = document.getElementById('mapLocationLabel');

    let targetLocation = config.location || config.mapQuery;
    if (!targetLocation) {
      if (config.city) {
        const parts = [config.city, config.state, config.country].filter(Boolean);
        targetLocation = parts.join(', ');
      } else {
        targetLocation = 'Dallas, TX';
      }
    }

    if (mapIframe) {
      mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(targetLocation)}&t=&z=11&ie=UTF8&iwloc=&output=embed`;
    }

    if (directionsLink) {
      directionsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(targetLocation)}`;
    }

    if (locationLabel) {
      locationLabel.textContent = `📍 Service Area: ${escapeHTML(targetLocation)}`;
    }
  }

  function renderProcess() {
    const container = document.getElementById('processGridContainer');
    if (!container) return;
    const steps = window.PROCESS_STEPS || [];

    container.innerHTML = '';
    steps.forEach(step => {
      const card = document.createElement('div');
      card.className = 'process-card';
      card.innerHTML = `
        <div class="process-number">${escapeHTML(step.num)}</div>
        <h3 class="process-title">${escapeHTML(step.title)}</h3>
        <p class="process-desc">${escapeHTML(step.desc)}</p>
      `;
      container.appendChild(card);
    });
  }

  function renderProjects(filter = 'all') {
    const container = document.getElementById('projectsGridContainer');
    if (!container) return;
    const projects = window.DEFAULT_PROJECTS || [];

    container.innerHTML = '';

    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-image-wrap">
          <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}" class="project-image" loading="lazy" decoding="async">
          <span class="project-badge">${escapeHTML(p.categoryLabel)}</span>
        </div>
        <div class="project-info">
          <div class="project-meta-row">
            <span>📍 ${escapeHTML(p.location)}</span>
            <span style="color: var(--accent); font-weight: 700;">${escapeHTML(p.badge)}</span>
          </div>
          <h3 class="project-title">${escapeHTML(p.title)}</h3>
          <p class="project-desc">${escapeHTML(p.desc)}</p>
          <div class="project-specs">
            <div class="spec-item">
              <span>System:</span>
              <strong>${escapeHTML(p.system)}</strong>
            </div>
            <div class="spec-item">
              <span>Materials:</span>
              <strong>${escapeHTML(p.material)}</strong>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function renderFAQs() {
    const container = document.getElementById('faqAccordionContainer');
    if (!container) return;
    const faqs = window.DEFAULT_FAQS || [];

    container.innerHTML = '';

    faqs.forEach((faq, index) => {
      const item = document.createElement('div');
      item.className = `faq-item ${index === 0 ? 'active' : ''}`;
      item.innerHTML = `
        <button class="faq-trigger" aria-expanded="${index === 0 ? 'true' : 'false'}" id="faqTrigger${index}">
          <span>${escapeHTML(faq.q)}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="faq-content" id="faqContent${index}">
          <p class="faq-answer">${escapeHTML(faq.a)}</p>
        </div>
      `;

      // Accordion Click
      const trigger = item.querySelector('.faq-trigger');
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        if (isActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          // Close other items
          container.querySelectorAll('.faq-item').forEach(other => {
            other.classList.remove('active');
            const ot = other.querySelector('.faq-trigger');
            if (ot) ot.setAttribute('aria-expanded', 'false');
          });
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      container.appendChild(item);
    });
  }

  /* ========================================================================
     5. ESTIMATE MODAL CONTROLLER
     ======================================================================== */

  function initEstimateModal() {
    const modal = document.getElementById('estimateModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const modalSelect = document.getElementById('modalService');
    if (!modal) return;

    function openModal(preselectedService) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      if (modalSelect && preselectedService) {
        for (let i = 0; i < modalSelect.options.length; i++) {
          if (modalSelect.options[i].value.toLowerCase() === preselectedService.toLowerCase()) {
            modalSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Bind all buttons with .open-modal-btn
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.open-modal-btn');
      if (btn) {
        e.preventDefault();
        const service = btn.getAttribute('data-service') || '';
        openModal(service);
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ========================================================================
     6. FORM VALIDATION & CONFIRMATION
     ======================================================================== */

  function setupFormValidation(formId, successBoxId, firstNameId, isModal) {
    const form = document.getElementById(formId);
    const successBox = document.getElementById(successBoxId);
    if (!form || !successBox) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // First Name
      const firstNameInput = document.getElementById(firstNameId);
      const firstGroup = firstNameInput ? firstNameInput.closest('.form-group') : null;
      if (firstNameInput && firstNameInput.value.trim() === '') {
        if (firstGroup) firstGroup.classList.add('has-error');
        isValid = false;
      } else if (firstGroup) {
        firstGroup.classList.remove('has-error');
      }

      // Phone
      const phoneInput = form.querySelector('input[type="tel"]');
      const phoneGroup = phoneInput ? phoneInput.closest('.form-group') : null;
      const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
      if (!phoneInput || phoneDigits.length < 10) {
        if (phoneGroup) phoneGroup.classList.add('has-error');
        isValid = false;
      } else if (phoneGroup) {
        phoneGroup.classList.remove('has-error');
      }

      // ZIP / Address
      const zipInput = form.querySelector('input[id*="Zip"]');
      const zipGroup = zipInput ? zipInput.closest('.form-group') : null;
      if (zipInput && zipInput.value.trim() === '') {
        if (zipGroup) zipGroup.classList.add('has-error');
        isValid = false;
      } else if (zipGroup) {
        zipGroup.classList.remove('has-error');
      }

      // Service Select
      const serviceSelect = form.querySelector('select[id*="Service"]');
      const serviceGroup = serviceSelect ? serviceSelect.closest('.form-group') : null;
      if (serviceSelect && serviceSelect.value.trim() === '') {
        if (serviceGroup) serviceGroup.classList.add('has-error');
        isValid = false;
      } else if (serviceGroup) {
        serviceGroup.classList.remove('has-error');
      }

      if (isValid) {
        const customerName = firstNameInput ? firstNameInput.value.trim() : 'there';
        const successNameTarget = document.getElementById('successCustomerName');
        if (successNameTarget) successNameTarget.textContent = customerName;

        if (isModal) {
          const formWrapper = document.getElementById('modalFormContainer');
          if (formWrapper) formWrapper.style.display = 'none';
        } else {
          form.style.display = 'none';
        }

        successBox.classList.add('active');
        showToast('Estimate request received! (Frontend validated)');
      }
    });

    // Real-time error clearance
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  /* ========================================================================
     7. NAVIGATION & HEADER CONTROLLER
     ======================================================================== */

  function initHeaderAndNav() {
    const siteHeader = document.getElementById('siteHeader');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');

    // Sticky Header Scroll Detection
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });

    // Mobile Drawer Open
    if (mobileNavToggle && mobileDrawer) {
      mobileNavToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    // Mobile Drawer Close
    function closeDrawer() {
      if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    if (mobileDrawer) {
      mobileDrawer.addEventListener('click', (e) => {
        if (e.target === mobileDrawer) closeDrawer();
      });
    }

    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Filter Buttons in Portfolio
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter') || 'all';
        renderProjects(filter);
      });
    });
  }

  /* ========================================================================
     8. PROSPECT LINK GENERATOR DRAWER (?editor=1)
     ======================================================================== */

  function showToast(msg) {
    const toast = document.getElementById('toastNotice');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function initProspectEditor(config) {
    const params = getUrlParams();
    const hasEditorParam = params.get('editor') === '1' || params.get('editor') === 'true';

    const editorContainer = document.getElementById('agencyEditorContainer');
    const drawerPanel = document.getElementById('agencyDrawerPanel');
    const toggleBtn = document.getElementById('agencyEditorToggleBtn');
    const closeBtn = document.getElementById('agencyDrawerCloseBtn');

    if (!editorContainer || !drawerPanel) return;

    if (hasEditorParam) {
      editorContainer.classList.add('active');
    } else {
      editorContainer.classList.remove('active');
      return;
    }

    toggleBtn.addEventListener('click', () => {
      drawerPanel.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
      drawerPanel.classList.remove('open');
    });

    // Editor Input Controls
    const edPresetSelect = document.getElementById('edPresetSelect');
    const edBusinessName = document.getElementById('edBusinessName');
    const edBusinessType = document.getElementById('edBusinessType');
    const edPhone = document.getElementById('edPhone');
    const edEmail = document.getElementById('edEmail');
    const edCity = document.getElementById('edCity');
    const edState = document.getElementById('edState');
    const edAddress = document.getElementById('edAddress');
    const edZip = document.getElementById('edZip');
    const edMapQuery = document.getElementById('edMapQuery');
    const edFreeEstimates = document.getElementById('edFreeEstimates');
    const edAccentColor = document.getElementById('edAccentColor');
    const edAccentColorPicker = document.getElementById('edAccentColorPicker');
    const edLogoUrl = document.getElementById('edLogoUrl');
    const edHeadline = document.getElementById('edHeadline');
    const edServiceAreas = document.getElementById('edServiceAreas');
    const edLinkDisplay = document.getElementById('edGeneratedLinkDisplay');
    const edCopyLinkBtn = document.getElementById('edCopyLinkBtn');
    const edResetBtn = document.getElementById('edResetBtn');
    const edViewLiveBtn = document.getElementById('edViewLiveBtn');

    function populateEditorFields(cfg, presetKey) {
      if (edPresetSelect) edPresetSelect.value = presetKey;
      if (edBusinessName) edBusinessName.value = cfg.name || '';
      if (edBusinessType) edBusinessType.value = cfg.businessType || 'both';
      if (edPhone) edPhone.value = cfg.phone || '(555) 019-2834';
      if (edEmail) edEmail.value = cfg.email || 'contact@roofingcompany.com';
      if (edCity) edCity.value = cfg.city || 'Dallas';
      if (edState) edState.value = cfg.state || 'TX';
      if (edAddress) edAddress.value = cfg.address || '100 Main Street, Suite 200';
      if (edZip) edZip.value = cfg.zip || '75201';
      if (edMapQuery) edMapQuery.value = cfg.mapQuery || cfg.location || (cfg.city ? `${cfg.city}, ${cfg.state || ''}` : '');
      if (edFreeEstimates) edFreeEstimates.value = cfg.freeEstimates !== false ? 'true' : 'false';
      if (edAccentColor) edAccentColor.value = cfg.accent || '#D97736';
      if (edAccentColorPicker) edAccentColorPicker.value = cfg.accent || '#D97736';
      if (edLogoUrl) edLogoUrl.value = cfg.logo || '';
      if (edHeadline) edHeadline.value = cfg.headline || '';
      if (edServiceAreas) {
        edServiceAreas.value = Array.isArray(cfg.serviceAreas) ? cfg.serviceAreas.join(', ') : (cfg.serviceAreas || '');
      }

      updateGeneratedLink();
    }

    populateEditorFields(config, currentPresetKey);

    function buildProspectUrl() {
      const baseUrl = window.location.origin + window.location.pathname;
      const urlParams = new URLSearchParams();

      const selectedPreset = edPresetSelect ? edPresetSelect.value : 'default';
      if (selectedPreset && selectedPreset !== 'default') {
        urlParams.set('business', selectedPreset);
      }

      const presets = window.ROOFING_PRESETS || {};
      const baseObj = presets[selectedPreset] || presets['default'] || {};

      if (edBusinessName && edBusinessName.value.trim() && edBusinessName.value.trim() !== baseObj.name) {
        urlParams.set('name', edBusinessName.value.trim());
      }
      if (edBusinessType && edBusinessType.value !== baseObj.businessType) {
        urlParams.set('businessType', edBusinessType.value);
      }
      if (edCity && edCity.value.trim() && edCity.value.trim() !== baseObj.city) {
        urlParams.set('city', edCity.value.trim());
      }
      if (edState && edState.value.trim() && edState.value.trim() !== baseObj.state) {
        urlParams.set('state', edState.value.trim());
      }
      if (edPhone && edPhone.value.trim() && edPhone.value.trim() !== baseObj.phone) {
        urlParams.set('phone', edPhone.value.trim());
      }
      if (edEmail && edEmail.value.trim() && edEmail.value.trim() !== baseObj.email) {
        urlParams.set('email', edEmail.value.trim());
      }
      if (edAddress && edAddress.value.trim() && edAddress.value.trim() !== baseObj.address) {
        urlParams.set('address', edAddress.value.trim());
      }
      if (edZip && edZip.value.trim() && edZip.value.trim() !== baseObj.zip) {
        urlParams.set('zip', edZip.value.trim());
      }
      if (edMapQuery && edMapQuery.value.trim() && edMapQuery.value.trim() !== baseObj.mapQuery) {
        urlParams.set('location', edMapQuery.value.trim());
      }
      if (edFreeEstimates && (edFreeEstimates.value === 'true') !== baseObj.freeEstimates) {
        urlParams.set('freeEstimates', edFreeEstimates.value);
      }
      if (edLogoUrl && edLogoUrl.value.trim() && edLogoUrl.value.trim() !== baseObj.logo) {
        urlParams.set('logo', edLogoUrl.value.trim());
      }
      if (edAccentColor && edAccentColor.value.trim() && edAccentColor.value.trim() !== baseObj.accent) {
        urlParams.set('accent', edAccentColor.value.trim());
      }
      if (edHeadline && edHeadline.value.trim() && edHeadline.value.trim() !== baseObj.headline) {
        urlParams.set('headline', edHeadline.value.trim());
      }

      if (edServiceAreas) {
        const areasVal = edServiceAreas.value.trim();
        const baseAreasStr = Array.isArray(baseObj.serviceAreas) ? baseObj.serviceAreas.join(', ') : '';
        if (areasVal && areasVal !== baseAreasStr) {
          urlParams.set('serviceAreas', areasVal);
        }
      }

      const queryString = urlParams.toString();
      return baseUrl + (queryString ? '?' + queryString : '');
    }

    function updateGeneratedLink() {
      const fullUrl = buildProspectUrl();
      if (edLinkDisplay) edLinkDisplay.textContent = fullUrl;
    }

    function onFieldChange() {
      const rawAreas = edServiceAreas ? edServiceAreas.value.trim() : '';
      const parsedAreas = rawAreas ? rawAreas.split(/[,;|]/).map(s => s.trim()).filter(Boolean) : [];

      const updatedConfig = {
        name: edBusinessName.value.trim() || currentConfig.name,
        businessType: edBusinessType.value || currentConfig.businessType,
        phone: edPhone.value.trim() || currentConfig.phone,
        email: edEmail.value.trim() || currentConfig.email,
        city: edCity.value.trim() || currentConfig.city,
        state: edState.value.trim() || currentConfig.state,
        address: edAddress.value.trim() || currentConfig.address,
        zip: edZip.value.trim() || currentConfig.zip,
        location: edMapQuery.value.trim(),
        mapQuery: edMapQuery.value.trim(),
        hasCustomAreas: parsedAreas.length > 0,
        serviceAreas: parsedAreas,
        freeEstimates: edFreeEstimates.value === 'true',
        accent: sanitizeColor(edAccentColor.value, currentConfig.accent),
        logo: edLogoUrl.value.trim(),
        headline: edHeadline.value.trim() || currentConfig.headline,
        description: currentConfig.description,
        cta: currentConfig.cta,
        heroImage: currentConfig.heroImage,
        enabledServices: currentConfig.enabledServices,
        verifiedReviews: currentConfig.verifiedReviews,
        trustHighlights: currentConfig.trustHighlights
      };

      applyConfigurationToDOM(updatedConfig);
      updateGeneratedLink();
    }

    // Attach Input Event Listeners
    [
      edBusinessName, edBusinessType, edPhone, edEmail, edCity, edState, 
      edAddress, edZip, edMapQuery, edFreeEstimates, edLogoUrl, edHeadline, edServiceAreas
    ].forEach(input => {
      if (input) input.addEventListener('input', onFieldChange);
      if (input) input.addEventListener('change', onFieldChange);
    });

    // Quick Location Buttons (Toronto, Vancouver, Calgary, Miami, Los Angeles, New York)
    document.querySelectorAll('.quick-loc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const city = btn.getAttribute('data-city') || '';
        const state = btn.getAttribute('data-state') || '';
        const loc = btn.getAttribute('data-location') || '';
        const areas = btn.getAttribute('data-areas') || '';

        if (edCity) edCity.value = city;
        if (edState) edState.value = state;
        if (edMapQuery) edMapQuery.value = loc;
        if (edServiceAreas) edServiceAreas.value = areas;

        onFieldChange();
        showToast(`Target set to ${loc}`);
      });
    });

    if (edAccentColor) {
      edAccentColor.addEventListener('input', () => {
        if (edAccentColorPicker) edAccentColorPicker.value = edAccentColor.value;
        onFieldChange();
      });
    }

    if (edAccentColorPicker) {
      edAccentColorPicker.addEventListener('input', () => {
        if (edAccentColor) edAccentColor.value = edAccentColorPicker.value;
        onFieldChange();
      });
    }

    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.getAttribute('data-color');
        if (edAccentColor) edAccentColor.value = c;
        if (edAccentColorPicker) edAccentColorPicker.value = c;
        onFieldChange();
      });
    });

    if (edPresetSelect) {
      edPresetSelect.addEventListener('change', () => {
        const slug = edPresetSelect.value;
        const presets = window.ROOFING_PRESETS || {};
        const pObj = presets[slug] || presets['default'];
        currentPresetKey = slug;
        populateEditorFields(pObj, slug);
        applyConfigurationToDOM(pObj);
        showToast(`Loaded preset: ${pObj.name}`);
      });
    }

    if (edCopyLinkBtn) {
      edCopyLinkBtn.addEventListener('click', () => {
        const link = buildProspectUrl();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(() => {
            showToast('Prospect link copied to clipboard!');
          }).catch(() => {
            prompt('Copy prospect link:', link);
          });
        } else {
          prompt('Copy prospect link:', link);
        }
      });
    }

    if (edResetBtn) {
      edResetBtn.addEventListener('click', () => {
        const presets = window.ROOFING_PRESETS || {};
        const pObj = presets[edPresetSelect.value] || presets['default'];
        populateEditorFields(pObj, edPresetSelect.value);
        applyConfigurationToDOM(pObj);
        showToast('Reset to preset defaults.');
      });
    }

    if (edViewLiveBtn) {
      edViewLiveBtn.addEventListener('click', () => {
        const link = buildProspectUrl();
        window.open(link, '_blank');
      });
    }
  }

  /* ========================================================================
     9. INITIALIZATION
     ======================================================================== */

  function initApp() {
    const config = resolveConfiguration();

    renderProjects('all');
    applyConfigurationToDOM(config);

    initHeaderAndNav();
    initEstimateModal();

    setupFormValidation('inlineEstimateForm', 'inlineSuccessBox', 'inlineFirstName', false);
    setupFormValidation('modalEstimateForm', 'modalSuccessBox', 'modalFirstName', true);

    initProspectEditor(config);

    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
