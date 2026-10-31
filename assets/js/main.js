/**
 * هلا النيل لإلحاق العمالة المصرية بالخارج
 * Main JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Initialize Hero Swiper Slider
  const heroSwiperEl = document.querySelector('.hero-swiper');
  if (heroSwiperEl && typeof Swiper !== 'undefined') {
    // Ken Burns layer: a zoomable copy of each slide's background image
    heroSwiperEl.querySelectorAll('.hero-slide').forEach(slide => {
      if (!slide.querySelector('.hero-bg-zoom')) {
        const zoomLayer = document.createElement('div');
        zoomLayer.className = 'hero-bg-zoom';
        zoomLayer.setAttribute('aria-hidden', 'true');
        slide.prepend(zoomLayer);
      }
    });

    // Thin autoplay progress line
    const heroProgress = document.createElement('div');
    heroProgress.className = 'hero-autoplay-progress';
    heroProgress.setAttribute('aria-hidden', 'true');
    heroSwiperEl.appendChild(heroProgress);

    const heroSwiper = new Swiper('.hero-swiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 1000,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          const titles = ['من نحن وتراخيصنا', 'مسافرونا في إيطاليا', 'الوظائف والعقود المتاحة', 'نظام فلوتسي الرسمي'];
          return '<span class="' + className + '"><span class="bullet-text">' + (titles[index] || (index + 1)) + '</span><span class="bullet-num">' + (index + 1) + '</span></span>';
        }
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      keyboard: {
        enabled: true,
      },
      on: {
        autoplayTimeLeft: function (swiper, timeLeft, progress) {
          // progress goes 1 -> 0 during each autoplay interval
          heroProgress.style.transform = 'scaleX(' + (1 - progress) + ')';
        }
      }
    });
  }

  // 2. Initialize Travelers / Testimonials Slider if present
  if (document.querySelector('.travelers-swiper') && typeof Swiper !== 'undefined') {
    new Swiper('.travelers-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false
      },
      pagination: {
        el: '.travelers-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.travelers-next',
        prevEl: '.travelers-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1.2,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 28
        }
      }
    });
  }

  // 3. Sticky Navbar, Scroll Progress & Active ScrollSpy
  const mainNavbar = document.getElementById('mainNavbar');
  const backToTop = document.getElementById('backToTop');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const navLinks = document.querySelectorAll('#navbarContent .nav-link');
  const spySections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Sticky navbar toggle
    if (scrollY > 70) {
      mainNavbar && mainNavbar.classList.add('navbar-scrolled');
      backToTop && backToTop.classList.add('show');
    } else {
      mainNavbar && mainNavbar.classList.remove('navbar-scrolled');
      backToTop && backToTop.classList.remove('show');
    }

    // Scroll progress line under header
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = Math.min(progress, 100) + '%';
    }

    // ScrollSpy: update active nav link
    const scrollPos = scrollY + 120; // offset for sticky header
    let currentId = '';

    spySections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + currentId) {
          link.classList.add('active');
        } else if (href && href.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }
  }

  // Throttle scroll work to one run per animation frame
  let scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(function () {
        handleScroll();
        scrollTicking = false;
      });
    }
  }, { passive: true });
  handleScroll(); // run once on load

  // Smooth scroll with offset when clicking header links
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          const navHeight = (mainNavbar ? mainNavbar.offsetHeight : 70) + 10;
          const elementPos = targetElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPos - navHeight,
            behavior: 'smooth'
          });
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        }
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Auto-collapse mobile navbar when clicking on links
  const navCollapse = document.getElementById('navbarContent');
  if (navCollapse) {
    navCollapse.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', function () {
        if (window.innerWidth < 1200 && navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  }

  // Eye-Pleasing Scroll Reveal Animation Observer
  if ('IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('is-revealed');
          observer.unobserve(el);
          // Cleanly clear stagger delay after entrance finishes so hover reacts immediately
          setTimeout(() => {
            el.classList.remove('stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5');
            el.style.transitionDelay = '';
          }, 900);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Old browsers: never leave content invisible
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
  }

  // 4. Render Jobs
  const jobsContainer = document.getElementById('jobsContainer');
  const jobFilterBtns = document.querySelectorAll('.job-filter-btn');
  const jobLiveSearch = document.getElementById('jobSearchInput');

  let currentCategory = 'all';
  let currentSearch = '';

  function renderJobsList() {
    if (!jobsContainer || typeof IT_JOBS === 'undefined') return;

    const filtered = filterJobs(currentCategory, currentSearch);

    if (filtered.length === 0) {
      jobsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="empty-state p-4 p-md-5 rounded-4 bg-white shadow-sm border">
            <i class="fa-solid fa-folder-open text-muted fs-1 mb-3"></i>
            <h4 class="fw-bold text-dark">لا توجد وظائف مطابقة لبحثك حالياً</h4>
            <p class="text-muted mb-4">يمكنك تقديم طلب توظيف عام وسيقوم فريق الاستقدام بالتواصل معك فور توفر الفرصة المناسبة.</p>
            <button class="btn btn-primary px-4 py-2 rounded-pill" data-bs-toggle="modal" data-bs-target="#quickApplyModal" onclick="prepareApplyModal('طلب توظيف عام في إيطاليا')">
              <i class="fa-solid fa-paper-plane me-2"></i> تقديم طلب عام
            </button>
          </div>
        </div>
      `;
      return;
    }

    jobsContainer.innerHTML = filtered.map((job, index) => `
      <div class="col-lg-4 col-md-6 mb-4 job-card-enter" style="--i: ${Math.min(index, 8)}">
        <div class="card h-100 job-card border-0 shadow-sm rounded-4 overflow-hidden position-relative">
          <div class="job-card-img-wrapper position-relative">
            <img src="${job.image}" class="card-img-top job-img" alt="${job.title}" loading="lazy" decoding="async">
            <div class="job-overlay-gradient"></div>
            <span class="badge bg-gold text-dark fw-bold position-absolute top-0 end-0 m-3 shadow-sm px-3 py-2 rounded-pill">
              <i class="fa-solid fa-star me-1"></i> ${job.badge}
            </span>
            <div class="job-city-tag position-absolute bottom-0 start-0 m-3 text-white fw-bold d-flex align-items-center gap-2">
              <i class="fa-solid fa-location-dot text-danger"></i>
              <span>${job.city}</span>
            </div>
          </div>
          
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="badge bg-light text-primary border px-3 py-1 rounded-pill fw-semibold">
                ${job.categoryName}
              </span>
              <span class="badge bg-soft-success text-success border-success-subtle px-2 py-1 rounded-2 small">
                ${job.type}
              </span>
            </div>

            <h5 class="card-title fw-bold text-dark my-2 job-title">
              ${job.title}
            </h5>

            <p class="card-text text-muted small line-clamp-2 mb-3">
              ${job.description}
            </p>

            <div class="job-meta-grid my-3 p-3 bg-light rounded-3">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="text-muted small"><i class="fa-solid fa-sack-dollar text-warning me-2"></i> الراتب الشهري:</span>
                <span class="fw-bold text-success font-monospace dir-ltr">${job.salary}</span>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="text-muted small"><i class="fa-solid fa-house-chimney text-info me-2"></i> السكن:</span>
                <span class="fw-semibold text-dark small">${job.housing.split(' ')[0]} ${job.housing.split(' ')[1] || ''}</span>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <span class="text-muted small"><i class="fa-solid fa-clock text-secondary me-2"></i> ساعات العمل:</span>
                <span class="fw-semibold text-dark small">${job.hours.split('-')[0]}</span>
              </div>
            </div>

            <div class="mt-auto pt-2 d-flex gap-2">
              <button class="btn btn-outline-primary w-50 py-2 rounded-pill fw-bold" onclick="viewJobDetails('${job.id}')">
                <i class="fa-solid fa-circle-info me-1"></i> التفاصيل
              </button>
              <button class="btn btn-primary w-50 py-2 rounded-pill fw-bold btn-apply" onclick="prepareApplyModal('${job.title}', '${job.id}')" data-bs-toggle="modal" data-bs-target="#quickApplyModal">
                <i class="fa-solid fa-paper-plane me-1"></i> قدّم الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Filter Buttons Listener
  jobFilterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      jobFilterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.getAttribute('data-filter') || 'all';
      renderJobsList();
    });
  });

  // Search Input Listener
  if (jobLiveSearch) {
    jobLiveSearch.addEventListener('input', function () {
      currentSearch = this.value;
      renderJobsList();
    });
  }

  // Initial jobs render
  renderJobsList();

  // 5. Job Details Modal Handler
  window.viewJobDetails = function (jobId) {
    const job = IT_JOBS.find(j => j.id === jobId);
    if (!job) return;

    const modalBody = document.getElementById('jobDetailsModalBody');
    const modalTitle = document.getElementById('jobDetailsModalLabel');
    if (!modalBody || !modalTitle) return;

    modalTitle.innerHTML = `<i class="fa-solid fa-briefcase text-primary me-2"></i> ${job.title}`;
    modalBody.innerHTML = `
      <div class="row g-4">
        <div class="col-md-5">
          <img src="${job.image}" class="img-fluid rounded-4 shadow-sm w-100" alt="${job.title}">
          <div class="mt-3 p-3 bg-light rounded-3 border">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">المدينة والمنطقة:</span>
              <strong class="text-dark">${job.city}</strong>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">الراتب الصافي:</span>
              <strong class="text-success dir-ltr">${job.salary}</strong>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">طبيعة العقد:</span>
              <strong class="text-dark">${job.type}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">ساعات الدوام:</span>
              <strong class="text-dark">${job.hours}</strong>
            </div>
          </div>
        </div>
        <div class="col-md-7">
          <h5 class="fw-bold text-dark mb-2">وصف فرصة العمل والمهام:</h5>
          <p class="text-secondary leading-relaxed mb-4">${job.description}</p>

          <h6 class="fw-bold text-dark mb-3"><i class="fa-solid fa-shield-halved text-success me-2"></i> المزايا والحقوق المكفولة:</h6>
          <ul class="list-unstyled mb-4">
            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i> <strong>السكن:</strong> ${job.housing}</li>
            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i> <strong>التأمين:</strong> ${job.insurance}</li>
            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i> <strong>الوجبات:</strong> ${job.meals}</li>
            <li class="mb-2"><i class="fa-solid fa-check text-success me-2"></i> <strong>الخبرة المطلوبة:</strong> ${job.experience}</li>
          </ul>

          <h6 class="fw-bold text-dark mb-3"><i class="fa-solid fa-file-circle-check text-primary me-2"></i> الأوراق والشروط المطلوبة:</h6>
          <ul class="list-unstyled mb-4">
            ${job.requirements.map(req => `<li class="mb-1"><i class="fa-solid fa-angle-left text-muted me-2"></i> ${req}</li>`).join('')}
          </ul>

          <div class="d-flex gap-2">
            <button class="btn btn-primary px-4 py-2 rounded-pill fw-bold flex-grow-1" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#quickApplyModal" onclick="prepareApplyModal('${job.title}', '${job.id}')">
              <i class="fa-solid fa-paper-plane me-1"></i> التقديم الفوري على هذه الوظيفة
            </button>
            <a href="https://wa.me/201018899770?text=${encodeURIComponent('السلام عليكم، استفسر بخصوص وظيفة: ' + job.title + ' في ' + job.city)}" target="_blank" rel="noopener noreferrer" class="btn btn-success px-3 py-2 rounded-pill fw-bold" aria-label="استفسار عبر واتساب">
              <i class="fa-brands fa-whatsapp fs-5"></i>
            </a>
          </div>
        </div>
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('jobDetailsModal'));
    modal.show();
  };

  // 6. Prepare Quick Apply Modal
  window.prepareApplyModal = function (jobTitle, jobId = '') {
    const inputJob = document.getElementById('applyJobTitleInput');
    const displayJob = document.getElementById('applyJobTitleDisplay');
    if (inputJob) inputJob.value = jobTitle || 'طلب توظيف عام';
    if (displayJob) displayJob.textContent = jobTitle || 'طلب توظيف عام في إيطاليا';
  };

  // 7. Quick Apply Form Submission
  const quickApplyForm = document.getElementById('quickApplyForm');
  if (quickApplyForm) {
    quickApplyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('applyName').value.trim();
      const phone = document.getElementById('applyPhone').value.trim();
      const job = document.getElementById('applyJobTitleInput').value.trim();
      const city = document.getElementById('applyGov').value;
      const notes = document.getElementById('applyNotes').value.trim();

      if (!name || !phone) {
        showNotification('تنبيه', 'يرجى كتابة الاسم ورقم الهاتف/الواتساب للمتابعة', 'warning');
        return;
      }

      // Close modal
      const modalEl = document.getElementById('quickApplyModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();

      // Show success feedback
      const applyMsg = `تم استلام طلبك بنجاح يا ${name}!\nكود الطلب المبدئي هو: HS-${Math.floor(100000 + Math.random() * 900000)}\nسيتواصل معك مستشار التوظيف الإيطالي خلال 24 ساعة عبر الهاتف والواتساب لتحديد موعد المقابلة.`;
      
      showNotification('تم إرسال طلبك بنجاح!', applyMsg, 'success', true, function() {
        // Optional redirect or trigger WhatsApp
        const waText = encodeURIComponent(`السلام عليكم، قمت بتقديم طلب توظيف لدى شركة هلا النيل:\n- الاسم: ${name}\n- الهاتف: ${phone}\n- الوظيفة المطلوبة: ${job}\n- المحافظة: ${city}\n- ملاحظات: ${notes}`);
        window.open(`https://wa.me/201018899770?text=${waText}`, '_blank');
      });

      quickApplyForm.reset();
    });
  }

  // 8. Contact Us Form Submission
  const mainContactForm = document.getElementById('mainContactForm');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !phone || !message) {
        showNotification('نقص بيانات', 'يرجى ملء جميع الحقول المطلوبة للتواصل معك بدقة.', 'warning');
        return;
      }

      const msgSuccess = `شكراً لتواصلك معنا يا ${name}. تم تسجيل رسالتك بنجاح وسيتواصل معك مستشار هلا النيل عبر الهاتف أو الواتساب فوراً.`;
      
      showNotification('شكراً لتواصلك مع هلا النيل!', msgSuccess, 'success', true, function() {
        const waMsg = encodeURIComponent(`مرحباً شركة هلا النيل، لدي استفسار:\n- الاسم: ${name}\n- الهاتف: ${phone}\n- الموضوع: ${subject}\n- الرسالة: ${message}`);
        window.open(`https://wa.me/201018899770?text=${waMsg}`, '_blank');
      });

      mainContactForm.reset();
    });
  }

  // 9. Interactive Contract & Visa Status Tracker
  const trackBtn = document.getElementById('btnTrackContract');
  const trackInput = document.getElementById('trackPassportInput');
  const trackResultContainer = document.getElementById('trackResultContainer');

  // Simulated Database for realistic query
  const sampleContracts = {
    'A12345678': {
      code: 'HS-78921',
      name: 'أحمد محمود السيد خليل',
      job: 'مساعد شيف - ميلانو',
      status: 'تم إصدار الموافقة الأمنية (Nulla Osta) بنجاح',
      step: 3,
      date: '2026-10-18',
      embassyAppointment: '15 نوفمبر 2026 - السفارة الإيطالية بجاردن سيتي',
      notes: 'يرجى إحضار أصل المؤهل والفيش الجنائي المصدق من الخارجية في موعد السفارة المحدد.'
    },
    'HS-99881': {
      code: 'HS-99881',
      name: 'محمود عبد الرحمن إبراهيم',
      job: 'فني تشييد وبناء - روما',
      status: 'تم استلام التأشيرة الإيطالية وتحديد موعد السفر',
      step: 4,
      date: '2026-10-25',
      flightDetails: 'رحلة مصر للطيران MS703 إلى مطار روما فيوميتشينو - 4 نوفمبر 2026',
      notes: 'مندوب شركة هلا النيل سيكون باستقبالك في صالة الوصول بمطار روما مع عقد العمل وبطاقة السكن.'
    }
  };

  if (trackBtn && trackInput) {
    trackBtn.addEventListener('click', function () {
      const query = trackInput.value.trim().toUpperCase();
      if (!query) {
        showNotification('تنبيه', 'يرجى إدخال رقم جواز السفر أو كود الطلب للاستعلام', 'info');
        return;
      }

      trackResultContainer.classList.remove('d-none');
      trackResultContainer.innerHTML = `
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted fw-semibold">جاري الاستعلام في البوابة الموحدة لعقود إيطاليا...</p>
        </div>
      `;

      setTimeout(() => {
        const found = sampleContracts[query] || {
          code: 'HS-' + Math.floor(10000 + Math.random() * 90000),
          name: 'صاحب المعاملة (الطلب قيد التدقيق)',
          job: 'عقد عمل بإيطاليا (ديكريتو فلوتسي)',
          status: 'الطلب قيد المراجعة والتدقيق بوزارة الداخلية الإيطالية (Prefettura)',
          step: 2,
          date: 'أكتوبر 2026',
          embassyAppointment: 'سيتم الإخطار فور صدور النولا أوستا (Nulla Osta)',
          notes: 'أوراقك مكتملة بنجاح وملفك مسجل رسمياً عبر البوابة الإيطالية بدون أي ملاحظات معلقة.'
        };

        const steps = [
          { title: 'تقديم الأوراق والفحص', icon: 'fa-id-card' },
          { title: 'تسجيل نظام فلوتسي', icon: 'fa-file-shield' },
          { title: 'صدور Nulla Osta', icon: 'fa-certificate' },
          { title: 'بصمة وتأشيرة السفارة', icon: 'fa-passport' },
          { title: 'تذكرة السفر والاستقبال', icon: 'fa-plane-arrival' }
        ];

        trackResultContainer.innerHTML = `
          <div class="card border-0 shadow rounded-4 p-4 mt-3 bg-white">
            <div class="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4">
              <div>
                <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill mb-2">
                  <i class="fa-solid fa-circle-check me-1"></i> طلب مسجل ومعتمد
                </span>
                <h5 class="fw-bold text-dark mb-0">${found.name}</h5>
                <small class="text-muted">الوظيفة: ${found.job} | كود المعاملة: <span class="font-monospace text-primary fw-bold">${found.code}</span></small>
              </div>
              <div class="text-md-end mt-2 mt-md-0">
                <span class="d-block text-muted small">آخر تحديث:</span>
                <span class="fw-bold text-dark">${found.date}</span>
              </div>
            </div>

            <!-- Steps Progress Bar -->
            <div class="tracker-steps-wrapper mb-4">
              <div class="row text-center g-2">
                ${steps.map((st, idx) => {
                  const stepNum = idx + 1;
                  const isDone = stepNum <= found.step;
                  const isCurrent = stepNum === found.step;
                  return `
                    <div class="col">
                      <div class="tracker-step ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                        <div class="step-icon-circle mx-auto mb-2 ${isDone ? 'bg-success text-white' : 'bg-light text-muted border'}">
                          <i class="fa-solid ${st.icon}"></i>
                        </div>
                        <div class="step-title small fw-bold ${isDone ? 'text-dark' : 'text-muted'}">${st.title}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div class="alert alert-info border-0 rounded-3 d-flex align-items-center gap-3 mb-3">
              <i class="fa-solid fa-circle-info fs-3 text-primary"></i>
              <div>
                <strong class="d-block text-dark">الحالة الحالية:</strong>
                <span class="text-secondary">${found.status}</span>
              </div>
            </div>

            <div class="p-3 bg-light rounded-3 small">
              <strong>ملاحظات مستشار هلا النيل:</strong>
              <p class="text-muted mb-0 mt-1">${found.notes} ${found.embassyAppointment ? `<br><strong>الموعد:</strong> ${found.embassyAppointment}` : ''}</p>
            </div>
          </div>
        `;
      }, 700);
    });
  }

  // 10. Animated Counters
  const counterElements = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function runCounters() {
    if (countersAnimated) return;
    const duration = 2000;
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let startTime = null;

      // requestAnimationFrame + ease-out: fast start, smooth landing on the final number
      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        counter.textContent = Math.floor(easeOutCubic(progress) * target).toLocaleString('ar-EG');
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          counter.textContent = target.toLocaleString('ar-EG');
        }
      }
      window.requestAnimationFrame(step);
    });
    countersAnimated = true;
  }

  // Intersection Observer for Counters
  const statsSection = document.getElementById('statsSection');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  } else {
    runCounters();
  }

  // 11. Helper Notification Function
  function showNotification(title, text, icon = 'success', hasWhatsApp = false, waCallback = null) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: title,
        html: `<div style="text-align: right; font-family: 'Cairo', sans-serif;">${text.replace(/\n/g, '<br>')}</div>`,
        icon: icon,
        confirmButtonText: hasWhatsApp ? 'متابعة عبر واتساب <i class="fa-brands fa-whatsapp ms-1"></i>' : 'تم، حسناً',
        confirmButtonColor: '#008c45',
        showCancelButton: hasWhatsApp,
        cancelButtonText: 'إغلاق',
        cancelButtonColor: '#6c757d',
        customClass: {
          popup: 'rounded-4'
        }
      }).then((result) => {
        if (result.isConfirmed && waCallback) {
          waCallback();
        }
      });
    } else {
      alert(`${title}\n\n${text}`);
      if (hasWhatsApp && waCallback && confirm('هل تود التحدث عبر واتساب الآن لمتابعة الطلب؟')) {
        waCallback();
      }
    }
  }
});
