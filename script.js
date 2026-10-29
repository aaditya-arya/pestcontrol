/* ==========================================================================
   ID PEST CONTROL & ECOMAX — INTERACTIVE ENGINE & MICRO-INTERACTIONS (2026)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. GLOBAL TOAST NOTIFICATION CONTAINER
  // --------------------------------------------------------------------------
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  window.showToast = (message, iconType = 'check') => {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    const iconSvg = iconType === 'check'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 350);
    }, 3600);
  };

  // --------------------------------------------------------------------------
  // 2. STARTING INTRO REVEAL (RUNS ONLY ONCE ON INITIAL VISIT, SETTLES UNDER 2.5s)
  // --------------------------------------------------------------------------
  const introPreloader = document.getElementById('introPreloader');
  if (introPreloader) {
    // If the visitor has already seen the intro in this session, remove immediately with zero delay
    if (sessionStorage.getItem('idpc_intro_seen') === 'true') {
      introPreloader.remove();
    } else {
      const introProgressFill = document.getElementById('introProgressFill');
      const introPercent = document.getElementById('introPercent');
      const introStatusText = document.getElementById('introStatusText');
      const introSkipBtn = document.getElementById('introSkipBtn');

      let isSettled = false;
      const settleIntro = () => {
        if (isSettled) return;
        isSettled = true;
        try {
          sessionStorage.setItem('idpc_intro_seen', 'true');
        } catch (e) {}

        if (introProgressFill) introProgressFill.style.width = '100%';
        if (introPercent) introPercent.textContent = '100%';
        if (introStatusText) introStatusText.textContent = 'BIO-PROTECTION READY';
        
        introPreloader.classList.add('settled');
        setTimeout(() => {
          introPreloader.remove();
        }, 500);
      };

      // Animate progress smoothly from 0 to 100% over ~1.4 seconds
      const startTime = performance.now();
      const duration = 1400;

      const animateProgress = (now) => {
        if (isSettled) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentPct = Math.floor(eased * 100);

        if (introProgressFill) introProgressFill.style.width = `${currentPct}%`;
        if (introPercent) introPercent.textContent = `${currentPct}%`;

        if (progress < 1) {
          requestAnimationFrame(animateProgress);
        } else {
          if (introStatusText) introStatusText.textContent = 'STANDARDS CERTIFIED';
          setTimeout(settleIntro, 250);
        }
      };

      requestAnimationFrame(animateProgress);

      // Instant bypass on skip button, Escape key, or clicking preloader
      if (introSkipBtn) {
        introSkipBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          settleIntro();
        });
      }

      introPreloader.addEventListener('click', () => {
        settleIntro();
      });

      document.addEventListener('keydown', (e) => {
        if (!isSettled && (e.key === 'Escape' || e.key === ' ')) {
          settleIntro();
        }
      });

      // Hard safety timeout: guaranteed settle before 2.2s
      setTimeout(settleIntro, 2200);
    }
  }

  // --------------------------------------------------------------------------
  // 3. SNAPPY BUTTON CLICK RIPPLES (NON-BLOCKING)
  // --------------------------------------------------------------------------
  const rippleElements = document.querySelectorAll('.btn, .nav-link, .preset-pill, .verify-cert-trigger, .amc-size-btn, .map-hub-btn');
  rippleElements.forEach(el => {
    el.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      const maxDim = Math.max(rect.width, rect.height);
      ripple.style.width = `${maxDim}px`;
      ripple.style.height = `${maxDim}px`;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 450);
    });
  });

  // --------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  const menuIconSVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  const closeIconSVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

  if (mobileToggle && navMenu) {
    const closeDrawer = () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = menuIconSVG;
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      mobileToggle.innerHTML = isActive ? closeIconSVG : menuIconSVG;
    });

    navMenu.querySelectorAll('.nav-link, a').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeDrawer();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeDrawer();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. STICKY HEADER & BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollPos > 24);
    }
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrollPos > 320);
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // --------------------------------------------------------------------------
  // 7. ANIMATED STAT COUNTERS
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetStr = el.getAttribute('data-target') || el.innerText;
          const targetNum = parseInt(targetStr.replace(/[^0-9]/g, ''), 10);
          const suffix = targetStr.replace(/[0-9,]/g, '');

          if (!isNaN(targetNum)) {
            const duration = 1400;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(easeOut * targetNum);

              el.innerText = (targetNum >= 1000 ? current.toLocaleString() : current) + suffix;
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                el.innerText = (targetNum >= 1000 ? targetNum.toLocaleString() : targetNum) + suffix;
              }
            };
            requestAnimationFrame(updateCount);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(stat => countObserver.observe(stat));
  }

  // --------------------------------------------------------------------------
  // 8. FAQ ACCORDION
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active', !isOpen);
      });
    }
  });

  // --------------------------------------------------------------------------
  // 9. LIVE INTERACTIVE TELEMETRY & QUOTE CONFIGURATOR
  // --------------------------------------------------------------------------
  const calcService = document.getElementById('calcService');
  const calcHub = document.getElementById('calcHub');
  const calcCargo = document.getElementById('calcCargo');
  const presetPills = document.querySelectorAll('#quoteCalculatorForm .preset-pill, .quote-form-card .preset-pill');

  const telStandard = document.getElementById('telStandard');
  const telExposure = document.getElementById('telExposure');
  const telDispatch = document.getElementById('telDispatch');
  const telCert = document.getElementById('telCert');

  const serviceSpecsMap = {
    '20ft Container Fumigation': {
      standard: 'NSPM-12 • MBr 48g/m³ or ALP',
      exposure: '24h Exposure + 4h Aeration',
      cert: 'Same-Day QR Phytosanitary Cert',
      dosePct: 82,
      doseLabel: '48.0',
      doseUnit: 'g/m³ MBr',
      doseDesc: 'Optimal Maritime Quarantine Gas Saturation'
    },
    '40ft Container Fumigation': {
      standard: 'NSPM-12 • High-Cube Gastight',
      exposure: '24h Exposure + 4h Aeration',
      cert: 'Same-Day QR Phytosanitary Cert',
      dosePct: 94,
      doseLabel: '54.0',
      doseUnit: 'g/m³ MBr',
      doseDesc: 'High-Cube Volumetric Active Recirculation'
    },
    'ISPM-15 Pallet / Wood Box Treatment': {
      standard: 'ISPM-15 IPPC Wheat Stamp',
      exposure: '24h Chamber / Tarpaulin',
      cert: 'IPPC Stamping + Treatment Cert',
      dosePct: 76,
      doseLabel: '56°C',
      doseUnit: 'Core Temp',
      doseDesc: 'ISPM-15 IPPC Thermal / Chemical Penetration'
    },
    'Warehouse Stack Fumigation (Spices/Grains)': {
      standard: 'NSPM-11 • Phosphine (ALP) 3g/m³',
      exposure: '5–7 Days Controlled Enclosure',
      cert: 'Zero-Residue Stack Report',
      dosePct: 65,
      doseLabel: '3.0',
      doseUnit: 'g/m³ ALP',
      doseDesc: 'Slow-Diffusion Zero-Residue Commodity Protocol'
    },
    'Industrial Pest Control AMC': {
      standard: 'HACCP / ISO 22000 IPM Grid',
      exposure: 'Zero Facility Downtime',
      cert: 'Audit Log + Compliance Dossier',
      dosePct: 98,
      doseLabel: '100%',
      doseUnit: 'IPM Safe',
      doseDesc: 'CIB-Approved Bio-Gels & Mechanical Traps'
    },
    'Anti-Termite Treatment': {
      standard: 'IS 6313 Soil Barrier Protocol',
      exposure: 'Single-Day Execution',
      cert: '5-Year Structural Warranty Bond',
      dosePct: 88,
      doseLabel: 'IS 6313',
      doseUnit: 'Standard',
      doseDesc: 'Pre/Post Drill-Fill-Seal Soil Barrier Saturation'
    }
  };

  const hubDispatchMap = {
    'Ahmedabad (HQ / ICD)': 'HQ Squad • ~40 mins to ICD/GIDC',
    'Mundra Port / CFS': 'Port Squad • ~25 mins to CFS Gate',
    'Morbi Ceramic Belt': 'NH-8A Squad • ~30 mins On-Site',
    'Unjha Agro Hub': 'APMC Squad • ~20 mins to Godown',
    'Other Gujarat Location': 'Mobile Unit • Same-Day Dispatch'
  };

  function updateTelemetry() {
    if (!calcService || !telStandard) return;
    const spec = serviceSpecsMap[calcService.value] || serviceSpecsMap['20ft Container Fumigation'];
    const hubEta = hubDispatchMap[calcHub?.value] || 'Rapid Mobile Unit Dispatch';

    telStandard.textContent = spec.standard;
    telExposure.textContent = spec.exposure;
    telCert.textContent = spec.cert;
    telDispatch.textContent = hubEta;

    // Update Animated Gauge Dial
    const gaugeCircle = document.getElementById('telGaugeCircle');
    const gaugeVal = document.getElementById('telGaugeValue');
    const gaugeUnit = document.getElementById('telGaugeUnit');
    const gaugeSub = document.getElementById('telGaugeSub');

    if (gaugeCircle && spec.dosePct) {
      const circ = 213.6; // 2 * Math.PI * 34
      const offset = circ - (spec.dosePct / 100) * circ;
      gaugeCircle.style.strokeDashoffset = offset;
    }
    if (gaugeVal && spec.doseLabel) gaugeVal.textContent = spec.doseLabel;
    if (gaugeUnit && spec.doseUnit) gaugeUnit.textContent = spec.doseUnit;
    if (gaugeSub && spec.doseDesc) gaugeSub.textContent = spec.doseDesc;
  }

  if (calcService) calcService.addEventListener('change', updateTelemetry);
  if (calcHub) calcHub.addEventListener('change', updateTelemetry);
  updateTelemetry();

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (calcCargo) {
        calcCargo.value = pill.getAttribute('data-val') || pill.textContent;
        calcCargo.focus();
      }
    });
  });

  const quoteForm = document.getElementById('quoteCalculatorForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = calcService?.value || 'Industrial Fumigation';
      const hub = calcHub?.value || 'Ahmedabad';
      const cargo = calcCargo?.value || 'Not specified';
      const phone = document.getElementById('calcPhone')?.value || '';

      window.showToast('Generating technical dispatch brief & opening WhatsApp...', 'check');

      const messageText = `*New Service Inquiry via ID Pest Control Website*%0A%0A` +
        `*Service Required:* ${encodeURIComponent(service)}%0A` +
        `*Operational Hub:* ${encodeURIComponent(hub)}%0A` +
        `*Volume / Premises:* ${encodeURIComponent(cargo)}%0A` +
        `*Contact Phone:* ${encodeURIComponent(phone)}%0A%0A` +
        `Please provide quotation & earliest available slot.`;

      setTimeout(() => {
        window.open(`https://wa.me/918401137910?text=${messageText}`, '_blank');
      }, 350);
    });
  }

  // --------------------------------------------------------------------------
  // 10. CONTACT FORM HANDLER
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name')?.value || 'Customer';
      const phone = document.getElementById('phone')?.value || '';
      const service = document.getElementById('service')?.value || 'General Inquiry';
      const notes = document.getElementById('message')?.value || 'Standard slot request';

      window.showToast('Routing request to on-duty technical officer...', 'check');

      const messageText = `*Service Booking — ID Pest Control & Ecomax*%0A%0A` +
        `*Name / Company:* ${encodeURIComponent(name)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Service:* ${encodeURIComponent(service)}%0A` +
        `*Details:* ${encodeURIComponent(notes)}%0A`;

      setTimeout(() => {
        window.open(`https://wa.me/918401137910?text=${messageText}`, '_blank');
      }, 350);
    });
  }

  // --------------------------------------------------------------------------
  // 11. INTERACTIVE AMC FACILITY SIZE SWITCHER (PEST-CONTROL PAGE)
  // --------------------------------------------------------------------------
  const amcSizeBtns = document.querySelectorAll('.amc-size-btn');
  if (amcSizeBtns.length > 0) {
    const amcData = {
      small: {
        qCov: 'Up to 5,000 sq.ft • 8 Bait Stations',
        bCov: 'Up to 5,000 sq.ft • 14 Bait Stations',
        mCov: 'Up to 5,000 sq.ft • 20 Bait Stations + Fly Grid'
      },
      medium: {
        qCov: '5,000–25,000 sq.ft • 22 Bait Stations',
        bCov: '5,000–25,000 sq.ft • 35 Bait Stations',
        mCov: '5,000–25,000 sq.ft • 50 Bait Stations + Audit Log'
      },
      large: {
        qCov: '25,000+ sq.ft • Perimeter Grid',
        bCov: '25,000+ sq.ft • 75+ Tamper-Proof Stations',
        mCov: 'Full Industrial Plant • Dedicated Resident Squad'
      }
    };

    amcSizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amcSizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sizeKey = btn.getAttribute('data-size') || 'medium';
        const info = amcData[sizeKey];

        const qEl = document.getElementById('amcCovQuarterly');
        const bEl = document.getElementById('amcCovBimonthly');
        const mEl = document.getElementById('amcCovMonthly');

        if (qEl && info) qEl.textContent = info.qCov;
        if (bEl && info) bEl.textContent = info.bCov;
        if (mEl && info) mEl.textContent = info.mCov;

        window.showToast(`Updated AMC specifications for ${btn.textContent.trim()}`, 'check');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 12. INTERACTIVE GOOGLE MAP HUB SWITCHER (CONTACT & BRANCHES)
  // --------------------------------------------------------------------------
  const mapHubBtns = document.querySelectorAll('.map-hub-btn');
  const mapIframe = document.getElementById('hubMapIframe');

  const mapLocations = {
    ahmedabad: 'https://maps.google.com/maps?q=Tryksha%20Desire%2C%20Opp.%20Shivshakti%20Nagar%20BRTS%2C%20Chandkheda%2C%20Ahmedabad%20382424&t=&z=15&ie=UTF8&iwloc=&output=embed',
    mundra: 'https://maps.google.com/maps?q=Adani%20Port%20Mundra%20Kutch%20Gujarat&t=&z=13&ie=UTF8&iwloc=&output=embed',
    morbi: 'https://maps.google.com/maps?q=8A%20National%20Highway%20Ceramic%20Zone%20Morbi%20Gujarat&t=&z=13&ie=UTF8&iwloc=&output=embed',
    unjha: 'https://maps.google.com/maps?q=APMC%20Market%20Yard%20Unjha%20Gujarat%20384170&t=&z=15&ie=UTF8&iwloc=&output=embed'
  };

  if (mapHubBtns.length > 0 && mapIframe) {
    mapHubBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mapHubBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const hubKey = btn.getAttribute('data-hub') || 'ahmedabad';
        if (mapLocations[hubKey]) {
          mapIframe.src = mapLocations[hubKey];
          window.showToast(`Switched map view to ${btn.textContent.trim()}`, 'check');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 13. GLOBAL CERTIFICATE VERIFICATION MODAL
  // --------------------------------------------------------------------------
  const modalHTML = `
    <div class="modal-backdrop" id="certVerifyModal" role="dialog" aria-modal="true" aria-labelledby="certModalTitle">
      <div class="modal-card">
        <div class="modal-header">
          <h3 id="certModalTitle" style="color: #0f172a; font-weight: 700; font-size: 1.25rem; display: flex; align-items: center; gap: 0.6rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            Verify Fumigation Certificate
          </h3>
          <button class="modal-close" id="closeCertModal" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.92rem; color: #475569; margin-bottom: 1.15rem; line-height: 1.55;">
            Enter the Certificate Serial No. or Container ID printed on your Ecomax / ID Pest Control Phytosanitary Dossier to verify customs clearance status.
          </p>
          <div class="form-group">
            <label for="certInputId" style="color: #0f172a; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.45rem; display: block;">Certificate / Container Reference</label>
            <div style="display: flex; gap: 0.6rem;">
              <input type="text" id="certInputId" class="form-control" placeholder="e.g. IDPC-2026-8841" value="IDPC-2026-8841" />
              <button type="button" class="btn btn-primary btn-sm" id="runCertCheckBtn">Verify</button>
            </div>
            <div class="preset-pills" style="margin-top: 0.75rem;">
              <span style="font-size: 0.74rem; font-weight: 600; color: #64748b; align-self: center;">Sample IDs:</span>
              <button type="button" class="preset-pill cert-sample-btn" data-cert="IDPC-2026-8841">IDPC-2026-8841 (40ft MBr)</button>
              <button type="button" class="preset-pill cert-sample-btn" data-cert="ECOMAX-MND-4092">ECOMAX-MND-4092 (ISPM-15)</button>
              <button type="button" class="preset-pill cert-sample-btn" data-cert="UNJHA-ALP-7720">UNJHA-ALP-7720 (Stack)</button>
            </div>
          </div>

          <div class="cert-result-card active" id="certResultBox" style="margin-top: 1.25rem; padding: 1.25rem; border-radius: 10px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <span class="mono-tag" id="certResCode">CERT // IDPC-2026-8841</span>
              <span style="background: #059669; color: #ffffff; font-family: var(--font-mono, monospace); font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.7rem; border-radius: 99px; letter-spacing: 0.03em; display: inline-flex; align-items: center; gap: 0.3rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ACTIVE QUARANTINE PASS
              </span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem; color: #0f172a;">
              <div style="background: #ffffff; padding: 0.6rem 0.75rem; border-radius: 6px; border: 1px solid #f1f5f9;"><strong style="color: #64748b; font-size: 0.74rem; display: block; text-transform: uppercase;">Treatment:</strong> <span id="certResType" style="font-weight: 600;">40ft HC Container (MBr 48g/m³)</span></div>
              <div style="background: #ffffff; padding: 0.6rem 0.75rem; border-radius: 6px; border: 1px solid #f1f5f9;"><strong style="color: #64748b; font-size: 0.74rem; display: block; text-transform: uppercase;">Hub Issued:</strong> <span id="certResHub" style="font-weight: 600;">Mundra Port CFS Terminal</span></div>
              <div style="background: #ffffff; padding: 0.6rem 0.75rem; border-radius: 6px; border: 1px solid #f1f5f9;"><strong style="color: #64748b; font-size: 0.74rem; display: block; text-transform: uppercase;">Standard:</strong> <span id="certResStd" style="font-weight: 600;">NSPM-12 &amp; ISPM-15 Compliant</span></div>
              <div style="background: #ffffff; padding: 0.6rem 0.75rem; border-radius: 6px; border: 1px solid #f1f5f9;"><strong style="color: #64748b; font-size: 0.74rem; display: block; text-transform: uppercase;">TLV Aeration:</strong> <span id="certResTlv" style="font-weight: 600;">Passed (&lt; 5 ppm Safe Release)</span></div>
            </div>
            <div style="margin-top: 0.75rem; padding-top: 0.6rem; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; font-size: 0.74rem; color: #64748b;">
              <span>Status: <strong style="color: #059669;">VERIFIED phytosanitary record</strong></span>
              <span>Authority: Directorate of PPQ&amp;S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const certModal = document.getElementById('certVerifyModal');
  const closeCertModal = document.getElementById('closeCertModal');
  const certInputId = document.getElementById('certInputId');
  const runCertCheckBtn = document.getElementById('runCertCheckBtn');

  const certRecords = {
    'IDPC-2026-8841': {
      type: '40ft HC Container (MBr 48g/m³)',
      hub: 'Mundra Port CFS Terminal',
      std: 'NSPM-12 & IPPC Quarantine',
      tlv: 'Passed (< 5 ppm Safe Release)'
    },
    'ECOMAX-MND-4092': {
      type: 'ISPM-15 Wooden Pallets (320 Units)',
      hub: 'Morbi NH-8A Export Cluster',
      std: 'ISPM-15 Heat / MB Stamped',
      tlv: 'Certified • Wheat Mark Applied'
    },
    'UNJHA-ALP-7720': {
      type: 'Cumin & Fennel Bulk Stack (180 MT)',
      hub: 'Unjha APMC Godown Sector',
      std: 'NSPM-11 Phosphine (3g/m³)',
      tlv: 'Zero-Residue Export Cleared'
    }
  };

  function verifyCert(code) {
    const clean = (code || 'IDPC-2026-8841').trim().toUpperCase();
    const rec = certRecords[clean] || {
      type: 'Export Quarantine Fumigation',
      hub: 'Ahmedabad Central Command HQ',
      std: 'ISPM-15 / NSPM-11/12 Accredited',
      tlv: 'Verified Active Dossier'
    };
    document.getElementById('certResCode').textContent = `CERT // ${clean}`;
    document.getElementById('certResType').textContent = rec.type;
    document.getElementById('certResHub').textContent = rec.hub;
    document.getElementById('certResStd').textContent = rec.std;
    document.getElementById('certResTlv').textContent = rec.tlv;
    const box = document.getElementById('certResultBox');
    box.classList.remove('active');
    void box.offsetWidth;
    box.classList.add('active');
  }

  document.querySelectorAll('.verify-cert-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      certModal.classList.add('active');
    });
  });

  if (closeCertModal) {
    closeCertModal.addEventListener('click', () => certModal.classList.remove('active'));
  }

  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) certModal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
      certModal.classList.remove('active');
    }
  });

  if (runCertCheckBtn) {
    runCertCheckBtn.addEventListener('click', () => {
      verifyCert(certInputId.value);
      window.showToast('Certificate authenticity verified against quarantine log', 'check');
    });
  }

  document.querySelectorAll('.cert-sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-cert');
      certInputId.value = code;
      verifyCert(code);
    });
  });

  // --------------------------------------------------------------------------
  // 14. KINETIC ROTATING WORDS FOR HERO HEADLINES
  // --------------------------------------------------------------------------
  const rotatingContainers = document.querySelectorAll('.rotating-word-container');
  rotatingContainers.forEach(container => {
    const words = container.querySelectorAll('.rotating-word');
    if (words.length > 1) {
      let activeIndex = 0;
      setInterval(() => {
        words[activeIndex].classList.remove('active');
        activeIndex = (activeIndex + 1) % words.length;
        words[activeIndex].classList.add('active');
      }, 2800);
    }
  });

  // --------------------------------------------------------------------------
  // 15. INTERACTIVE BEFORE / AFTER TREATMENT COMPARISON SLIDER
  // --------------------------------------------------------------------------
  const comparisonSliders = document.querySelectorAll('.comparison-slider');
  comparisonSliders.forEach(slider => {
    const afterBox = slider.querySelector('.comparison-image.after');
    const innerImg = afterBox ? afterBox.querySelector('img') : null;
    const handle = slider.querySelector('.comparison-handle');
    if (!afterBox || !handle) return;

    const syncImageWidth = () => {
      const width = slider.offsetWidth;
      if (innerImg) {
        innerImg.style.width = `${width}px`;
      }
    };
    syncImageWidth();
    window.addEventListener('resize', syncImageWidth, { passive: true });

    let isSliding = false;

    const updateSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let pos = (clientX - rect.left) / rect.width;
      if (pos < 0.04) pos = 0.04;
      if (pos > 0.96) pos = 0.96;
      const pct = (pos * 100).toFixed(1);
      afterBox.style.width = `${pct}%`;
      handle.style.left = `${pct}%`;
      slider.setAttribute('aria-valuenow', pct);
    };

    slider.addEventListener('mousedown', (e) => {
      isSliding = true;
      slider.classList.add('is-dragging');
      updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isSliding) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      if (isSliding) {
        isSliding = false;
        slider.classList.remove('is-dragging');
      }
    });

    slider.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        isSliding = true;
        updateSlider(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isSliding || !e.touches || e.touches.length === 0) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isSliding = false;
    });

    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-label', 'Phytosanitary Treatment Before and After Interactive Split');
    slider.setAttribute('aria-valuenow', '50');

    slider.addEventListener('keydown', (e) => {
      let currentVal = parseFloat(slider.getAttribute('aria-valuenow') || '50');
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        currentVal = Math.max(4, currentVal - 5);
        afterBox.style.width = `${currentVal}%`;
        handle.style.left = `${currentVal}%`;
        slider.setAttribute('aria-valuenow', currentVal);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        currentVal = Math.min(96, currentVal + 5);
        afterBox.style.width = `${currentVal}%`;
        handle.style.left = `${currentVal}%`;
        slider.setAttribute('aria-valuenow', currentVal);
        e.preventDefault();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 16. SMOOTH HASH LINK SCROLLING
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#') && targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

});
