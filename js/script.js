// Check sessionStorage to decide if we should show the loader
(function() {
  const isHomepage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname === '/' || 
                     window.location.pathname.endsWith('/');
  
  const isFirstLoad = !sessionStorage.getItem("schoolLoader");

  if (isHomepage && isFirstLoad) {
    // 1. Create the loader HTML structure
    const loaderHtml = `
      <div id="school-loader">
        <div class="loader-content">
          <div class="loader-logo-wrapper">
            <img src="images/logo.jpeg" alt="Sujnana National Public School Logo" class="loader-logo">
          </div>
          <h1 class="loader-heading">SUJNANA<br><span class="highlight">NATIONAL PUBLIC SCHOOL</span></h1>
          <p class="loader-tagline">Nurturing Minds, Building Futures</p>
          <div class="loader-progress-container">
            <span class="loader-text">PREPARING YOUR EXPERIENCE…</span>
            <div class="loader-bar-track">
              <div class="loader-bar-fill" id="loader-progress-bar"></div>
            </div>
            <span class="loader-small-text">Please wait while we load the school website.</span>
          </div>
        </div>
      </div>
    `;

    // 2. Function to inject the loader
    const injectLoader = () => {
      if (document.body) {
        // Prepend the loader HTML to body
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = loaderHtml.trim();
        const loaderElement = tempDiv.firstChild;
        document.body.insertBefore(loaderElement, document.body.firstChild);
        
        // Ensure html.loading-active is set
        document.documentElement.classList.add("loading-active");

        // Preload background image and logo to ensure no layout jumps or empty images
        const bgImg = new Image();
        const logoImg = new Image();
        let loadedCount = 0;
        
        const startProgressBar = () => {
          const progressBar = document.getElementById('loader-progress-bar');
          if (!progressBar) return;
          
          let progress = 0;
          const duration = 800; // 0.8 seconds total loading duration
          const intervalTime = 15; // smooth updates every 15ms
          const step = (intervalTime / duration) * 100;
          
          const interval = setInterval(() => {
            progress += step;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              
              // End loader
              setTimeout(() => {
                const loader = document.getElementById('school-loader');
                if (loader) {
                  loader.classList.add('fade-out');
                  
                  // After transition ends, remove loader completely and clear classes
                  setTimeout(() => {
                    loader.remove();
                    document.documentElement.classList.remove('loading-active');
                    sessionStorage.setItem("schoolLoader", "true");
                  }, 400); // 400ms matching CSS transition
                }
              }, 100); // short delay at 100% for premium feel
            }
            progressBar.style.width = progress + '%';
          }, intervalTime);
        };

        const imageLoaded = () => {
          loadedCount++;
          if (loadedCount === 2) {
            startProgressBar();
          }
        };

        bgImg.onload = imageLoaded;
        bgImg.onerror = imageLoaded; // fallback
        logoImg.onload = imageLoaded;
        logoImg.onerror = imageLoaded; // fallback

        bgImg.src = 'images/hero-school.jpg';
        logoImg.src = 'images/logo.jpeg';
      } else {
        setTimeout(injectLoader, 10);
      }
    };
    
    // Inject as early as possible
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", injectLoader);
    } else {
      injectLoader();
    }
  } else {
    // If not homepage, or already loaded/not refreshed, ensure we are not hiding the body
    document.documentElement.classList.remove("loading-active");
    if (isHomepage) {
      sessionStorage.setItem("schoolLoader", "true");
    }
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initStickyHeader();
  initHomeHero();
  initFacilitiesSlider();
  initAchievementsSlider();
  initGalleryFilter();
  initGalleryTabs();
  initVideoGallery();
  initFormValidations();
  initSmoothScroll();
  initBackToTop();
  initLightbox();
  initToppersPage();
  initScrollReveal();
  initFooterLinks();
  initAchievementsPageFilters();
  initAchievementsToppersSlider();
  initNewsEventsPage();
});

// 1. Highlight Active Page in Navbar
function initNavbar() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  // Desktop menu links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile menu links
  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 2. Mobile Hamburger Menu Toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav-overlay');
  
  if (hamburger && mobileNav && overlay) {
    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      overlay.classList.toggle('active');
      
      // Toggle body scroll lock
      if (mobileNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    const links = document.querySelectorAll('.mobile-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }
}

// 3. Sticky Header scroll behavior
function initStickyHeader() {
  const header = document.querySelector('.navbar-wrapper');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }
}

// 4. Home Facilities Slider (auto-changes every 5 seconds on Mobile)
function initFacilitiesSlider() {
  const slides = document.querySelectorAll('.facility-slide');
  const dots = document.querySelectorAll('.facility-dot');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }
    };

    const nextSlide = () => {
      showSlide(currentSlide + 1);
    };

    // Auto-slide starts
    const startAutoSlide = () => {
      slideInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
      clearInterval(slideInterval);
    };

    // Dot click controls
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(index);
        startAutoSlide();
      });
    });

    // Start auto slide
    startAutoSlide();

    // Pause on hover
    const sliderContainer = document.querySelector('.facility-mobile-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopAutoSlide);
      sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
  }
}

// 5. Achievement slider on mobile
function initAchievementsSlider() {
  const slides = document.querySelectorAll('.achievement-slide');
  const dots = document.querySelectorAll('.achievement-dot');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }
    };

    const nextSlide = () => {
      showSlide(currentSlide + 1);
    };

    const startAutoSlide = () => {
      slideInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
      clearInterval(slideInterval);
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(index);
        startAutoSlide();
      });
    });

    startAutoSlide();

    const sliderContainer = document.querySelector('.achievement-mobile-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopAutoSlide);
      sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
  }
}

// 6. Gallery Photo Category Filter
function initGalleryFilter() {
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  
  if (filters.length > 0 && items.length > 0) {
    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        // Remove active class from all filters
        filters.forEach(btn => btn.classList.remove('active'));
        // Add active to clicked
        filter.classList.add('active');
        
        const category = filter.getAttribute('data-filter');
        
        items.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (category === 'all' || category === itemCategory) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
}

// 7. Gallery Tabs Switch (Photos vs Videos)
function initGalleryTabs() {
  const photoTabBtn = document.getElementById('tab-photos');
  const videoTabBtn = document.getElementById('tab-videos');
  const photoGallery = document.querySelector('.photos-tab-content');
  const videoGallery = document.querySelector('.videos-tab-content');
  
  if (photoTabBtn && videoTabBtn && photoGallery && videoGallery) {
    photoTabBtn.addEventListener('click', () => {
      photoTabBtn.classList.add('active');
      videoTabBtn.classList.remove('active');
      
      photoGallery.style.display = 'block';
      videoGallery.style.display = 'none';
    });
    
    videoTabBtn.addEventListener('click', () => {
      videoTabBtn.classList.add('active');
      photoTabBtn.classList.remove('active');
      
      videoGallery.style.display = 'grid';
      photoGallery.style.display = 'none';
    });
  }
}

// 7.5. Render Videos Dynamically
function initVideoGallery() {
  const container = document.getElementById('video-gallery-container');
  if (container) {
    const schoolVideos = [
      {
        title: "Annual Day Celebrations 2025-26",
        thumbnail: "images/video-thumb-1.jpg",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        date: "Jan 12, 2026"
      },
      {
        title: "Independence Day Parade & Events",
        thumbnail: "images/video-thumb-2.jpg",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        date: "Aug 15, 2025"
      },
      {
        title: "Sujnana Sci-Quest Exhibition",
        thumbnail: "images/video-thumb-3.jpg",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        date: "May 28, 2026"
      },
      {
        title: "Inter-school Volleyball Championship Finals",
        thumbnail: "images/video-thumb-4.jpg",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        date: "Oct 22, 2025"
      }
    ];

    container.innerHTML = schoolVideos.map(video => `
      <div class="video-card">
        <div class="video-thumb-wrapper" data-video="${video.videoUrl}">
          <img src="${video.thumbnail}" alt="${video.title}" class="video-thumb">
          <div class="video-play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="video-info">
          <h4 class="video-title">${video.title}</h4>
          <span class="video-date"><i class="far fa-calendar-alt"></i> ${video.date}</span>
        </div>
      </div>
    `).join('');
  }
}

// 8. Contact Form and Enquiry Form validations
function initFormValidations() {
  // Common error validation function
  const validateField = (input, regex, errorMsg) => {
    const errorEl = input.nextElementSibling;
    if (!regex.test(input.value.trim())) {
      input.style.borderColor = '#dc2626';
      if (errorEl && errorEl.classList.contains('error-message')) {
        errorEl.textContent = errorMsg;
        errorEl.style.display = 'block';
      }
      return false;
    } else {
      input.style.borderColor = '';
      if (errorEl && errorEl.classList.contains('error-message')) {
        errorEl.style.display = 'none';
      }
      return true;
    }
  };

  // Helper patterns
  const namePattern = /^[a-zA-Z\s]{2,50}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^[0-9]{10}$/;

  // Setup Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const phoneInput = document.getElementById('contactPhone');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');
      
      let isValid = true;
      
      if (nameInput) {
        isValid = validateField(nameInput, namePattern, 'Please enter a valid name (letters only, min 2 chars)') && isValid;
      }
      if (emailInput) {
        isValid = validateField(emailInput, emailPattern, 'Please enter a valid email address') && isValid;
      }
      if (phoneInput) {
        isValid = validateField(phoneInput, phonePattern, 'Please enter a valid 10-digit phone number') && isValid;
      }
      if (subjectInput) {
        const errorEl = subjectInput.nextElementSibling;
        if (subjectInput.value === '') {
          subjectInput.style.borderColor = '#dc2626';
          if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.textContent = 'Please select a subject';
            errorEl.style.display = 'block';
          }
          isValid = false;
        } else {
          subjectInput.style.borderColor = '';
          if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.style.display = 'none';
          }
        }
      }
      if (messageInput) {
        const errorEl = messageInput.nextElementSibling;
        if (messageInput.value.trim().length < 10) {
          messageInput.style.borderColor = '#dc2626';
          if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.textContent = 'Message must be at least 10 characters long';
            errorEl.style.display = 'block';
          }
          isValid = false;
        } else {
          messageInput.style.borderColor = '';
          if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.style.display = 'none';
          }
        }
      }

      if (isValid) {
        alert('Thank you! Your message has been sent successfully. We will get back to you shortly.');
        contactForm.reset();
      }
    });
  }

  // Setup Home/Footer Enquiry Form
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('enqName');
      const emailInput = document.getElementById('enqEmail');
      const phoneInput = document.getElementById('enqPhone');
      const gradeInput = document.getElementById('enqGrade');
      
      let isValid = true;
      
      if (nameInput) {
        isValid = validateField(nameInput, namePattern, 'Please enter a valid name (letters only)') && isValid;
      }
      if (emailInput) {
        isValid = validateField(emailInput, emailPattern, 'Please enter a valid email address') && isValid;
      }
      if (phoneInput) {
        isValid = validateField(phoneInput, phonePattern, 'Please enter a valid 10-digit phone number') && isValid;
      }
      if (gradeInput) {
        const errorEl = gradeInput.nextElementSibling;
        if (gradeInput.value === '') {
          gradeInput.style.borderColor = '#dc2626';
          if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.textContent = 'Please select a grade/class';
            errorEl.style.display = 'block';
          }
          isValid = false;
        } else {
          gradeInput.style.borderColor = '';
          if (errorEl && errorEl.classList.contains('error-message')) {
            errorEl.style.display = 'none';
          }
        }
      }

      if (isValid) {
        alert('Admission Enquiry submitted successfully. Our admissions team will contact you.');
        enquiryForm.reset();
      }
    });
  }
}

// 9. Smooth Scroll to anchors
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// 10. Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// 11. Photo / Video Lightbox
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  const videoThumbnails = document.querySelectorAll('.video-thumb-wrapper');

  if (lightbox && closeBtn) {
    // Open image lightbox
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title');
        
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.style.display = 'block';
          lightboxVideo.style.display = 'none';
          lightboxCaption.textContent = title ? title.textContent : 'School Gallery';
          lightbox.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Open video lightbox (mocking video player since these are demo links)
    videoThumbnails.forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const card = wrapper.closest('.video-card');
        const title = card ? card.querySelector('.video-title').textContent : 'School Video';
        
        // In a real application, you'd insert a youtube/vimeo/cloudinary iframe.
        // We will insert a placeholder video player or show a alert for demo URL.
        const videoUrl = wrapper.getAttribute('data-video');
        
        lightboxVideo.src = videoUrl;
        lightboxVideo.style.display = 'block';
        lightboxImg.style.display = 'none';
        lightboxCaption.textContent = title;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    // Close lightbox
    const closeLightbox = () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      lightboxVideo.src = '';
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
}

// 12. Home Hero background video and photo slider sequence
function initHomeHero() {
  const video = document.getElementById('hero-video');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-nav-arrow.prev');
  const nextBtn = document.querySelector('.hero-nav-arrow.next');
  const sliderNav = document.querySelector('.hero-slider-nav');
  const heroContent = document.querySelector('.hero-content-container');
  const heroOverlay = document.querySelector('.hero-overlay');

  if (video && slides.length > 0) {
    let currentPhotoIndex = 0;
    let photoTimeout = null;
    let isPlayingVideo = true;

    // Helper: Show current slide and update active dot
    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      currentPhotoIndex = index;
      slides[currentPhotoIndex].classList.add('active');
      if (dots[currentPhotoIndex]) {
        dots[currentPhotoIndex].classList.add('active');
      }
    };

    // Helper: Start the video playback state
    const playVideo = () => {
      isPlayingVideo = true;
      
      // Stop and clear photo sliders
      clearTimeout(photoTimeout);
      slides.forEach(slide => slide.classList.remove('active'));
      if (sliderNav) sliderNav.classList.remove('active');

      // Show hero text content and overlay
      if (heroContent) heroContent.classList.remove('hidden');
      if (heroOverlay) heroOverlay.classList.remove('hidden');

      // Show and play video
      video.classList.add('active');
      video.currentTime = 0;
      
      // Play the video programmatically
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play was prevented by browser policies. Triggering slideshow...");
          startPhotoSlider();
        });
      }
    };

    // Helper: Transition to Photo Slideshow
    const startPhotoSlider = () => {
      isPlayingVideo = false;
      
      // Fade out video
      video.classList.remove('active');
      video.pause();

      // Hide hero text content and overlay
      if (heroContent) heroContent.classList.add('hidden');
      if (heroOverlay) heroOverlay.classList.add('hidden');

      // Show first photo and navigation controls
      showSlide(0);
      if (sliderNav) sliderNav.classList.add('active');

      // Start 5-second rotation timer
      startPhotoTimer();
    };

    // Helper: Handle the 5-second automatic sliding timeout
    const startPhotoTimer = () => {
      clearTimeout(photoTimeout);
      photoTimeout = setTimeout(() => {
        if (!isPlayingVideo) {
          if (currentPhotoIndex < slides.length - 1) {
            showSlide(currentPhotoIndex + 1);
            startPhotoTimer();
          } else {
            // All photos completed, loop back to video
            playVideo();
          }
        }
      }, 5000);
    };

    // Action handlers for manual arrows
    const handleNext = () => {
      if (isPlayingVideo) return; // ignore during video
      clearTimeout(photoTimeout);
      if (currentPhotoIndex < slides.length - 1) {
        showSlide(currentPhotoIndex + 1);
        startPhotoTimer();
      } else {
        playVideo();
      }
    };

    const handlePrev = () => {
      if (isPlayingVideo) return; // ignore during video
      clearTimeout(photoTimeout);
      if (currentPhotoIndex > 0) {
        showSlide(currentPhotoIndex - 1);
      } else {
        showSlide(slides.length - 1);
      }
      startPhotoTimer();
    };

    // Wire up event listeners
    video.addEventListener('ended', startPhotoSlider);

    if (nextBtn) nextBtn.addEventListener('click', handleNext);
    if (prevBtn) prevBtn.addEventListener('click', handlePrev);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (isPlayingVideo) return;
        clearTimeout(photoTimeout);
        showSlide(index);
        startPhotoTimer();
      });
    });

    // Start sequence by displaying video
    playVideo();
  }
}

// 17. SSLC Toppers page filtering and search logic
function initToppersPage() {
  const searchInput = document.getElementById('topper-search');
  const tabs = document.querySelectorAll('.topper-tab');
  const yearGroups = document.querySelectorAll('.topper-year-group');
  const noResults = document.querySelector('.toppers-no-results');
  const btnExport = document.getElementById('btn-export-pdf');

  // Check if we are on the toppers page
  if (!searchInput && tabs.length === 0) return;

  let activeFilter = 'all';
  let searchQuery = '';

  // Helper function to apply both tab and search filter
  const applyFilters = () => {
    let totalVisibleToppers = 0;

    yearGroups.forEach(group => {
      const year = group.getAttribute('data-year');
      const cards = group.querySelectorAll('.topper-row-card');
      let visibleInGroup = 0;

      // Filter individual cards in the group based on search query
      cards.forEach(card => {
        const name = card.querySelector('.topper-name').textContent.toLowerCase();
        const matchesSearch = name.includes(searchQuery);

        if (matchesSearch) {
          card.classList.remove('hidden');
          visibleInGroup++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Filter the year group container based on selected tab and visible cards inside it
      const matchesTab = (activeFilter === 'all' || activeFilter === year);

      if (matchesTab && visibleInGroup > 0) {
        group.classList.remove('hidden');
        totalVisibleToppers += visibleInGroup;
      } else {
        group.classList.add('hidden');
      }
    });

    // Toggle "No results" message
    if (noResults) {
      if (totalVisibleToppers === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
    }
  };

  // Tab click event listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      applyFilters();
    });
  });

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Export PDF / Print listener
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      window.print();
    });
  }
}

// 18. Viewport Scroll Reveal animations
function initScrollReveal() {
  const reveals = document.querySelectorAll('.fade-up-reveal');
  
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // trigger animation once
      }
    });
  }, {
    threshold: 0.15 // trigger when 15% of the element is visible
  });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

// 19. Highlight Active Footer Legal Links
function initFooterLinks() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  const footerLinks = document.querySelectorAll('.footer-legal-link');
  footerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}



// 21. Achievements Page Category Filter
function initAchievementsPageFilters() {
  const filterBtns = document.querySelectorAll('.filter-ach-btn');
  const cards = document.querySelectorAll('.recent-ach-card');
  
  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 22. Achievements Page Toppers Slider on Mobile
function initAchievementsToppersSlider() {
  const slides = document.querySelectorAll('.topper-slide-ach');
  const dots = document.querySelectorAll('.topper-dot-ach');
  
  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval;

  const showSlide = (n) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const startAutoSlide = () => {
    slideInterval = setInterval(nextSlide, 4000);
  };

  const stopAutoSlide = () => {
    clearInterval(slideInterval);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      showSlide(index);
      startAutoSlide();
    });
  });

  if (dots.length > 0) {
    showSlide(0);
    startAutoSlide();

    const sliderContainer = document.querySelector('.toppers-mobile-slider-ach');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopAutoSlide);
      sliderContainer.addEventListener('mouseleave', startAutoSlide);
      
      let startX = 0;
      let endX = 0;
      
      sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoSlide();
      }, { passive: true });
      
      sliderContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
          showSlide(currentSlide + 1);
        } else if (endX - startX > 50) {
          showSlide(currentSlide - 1);
        }
        startAutoSlide();
      }, { passive: true });
    }
  }
}

// 23. Latest News & Events Page Functionality
// Mock Database for Events Details & Gallery images
const EVENTS_DB = {
  "up-1": {
    title: "Science Exhibition 2026",
    date: "May 25, 2026",
    time: "10:00 AM – 2:00 PM",
    venue: "School Auditorium",
    guest: "Dr. K. Sivan (Ex-Chairman, ISRO)",
    desc: "Students will showcase innovative science projects, working models, and robotics designs. The theme of this year's exhibition is 'Sustainable Futures & AI Technology'. Visiting parents and external school delegates will interact with the young innovators.",
    images: ["images/achievement-1.jpg", "images/gallery-2.jpg", "images/gallery-8.jpg"]
  },
  "up-2": {
    title: "Annual Sports Day",
    date: "November 15, 2026",
    time: "09:00 AM – 4:00 PM",
    venue: "School Sports Ground",
    guest: "Shri Venkatesh Prasad (Former Indian Cricketer)",
    desc: "A day filled with competitive track and field events including sprints, relays, long jump, shot put, and inter-house volleyball tournaments. The event will commence with a magnificent march-past and torch-lighting ceremony.",
    images: ["images/facility-4.jpg", "images/gallery-7.jpg", "images/gallery-3.jpg"]
  },
  "up-3": {
    title: "Inter School Debate",
    date: "July 10, 2026",
    time: "11:00 AM – 1:00 PM",
    venue: "Seminar Hall",
    guest: "Dr. Arundhati Roy (Eminent Author & Speaker)",
    desc: "A battle of wits where speakers from across 15 regional schools debate critical current topics, focusing on 'The Impact of Social Media on Child Psychology'. Winners will receive cash awards and the rotating school trophy.",
    images: ["images/gallery-3.jpg", "images/gallery-6.jpg", "images/video-thumb-1.jpg"]
  },
  "up-4": {
    title: "International Yoga Day",
    date: "June 21, 2026",
    time: "07:30 AM – 9:00 AM",
    venue: "Open Assembly Area",
    guest: "Yogi Anand Swaroop (Yoga Practitioner & Philosopher)",
    desc: "A peaceful morning assembly with all classes and teachers participating in general posturing, breathing exercises, and meditation workshops. Special focus on postures that improve posture, attention span, and reduce academic stress.",
    images: ["images/yoga.jpeg", "images/gallery-4.jpg"]
  },
  "up-5": {
    title: "Drawing Competition",
    date: "August 12, 2026",
    time: "10:30 AM – 12:30 PM",
    venue: "Drawing Hall",
    guest: "Smt. Roopa Sen (Visual Artist & Painter)",
    desc: "Coloring and sketch contest divided into junior, sub-junior, and senior blocks. Students will express creative viewpoints on 'Environmental Protection and Tree Conservations'. High-grade coloring materials will be provided.",
    images: ["images/gallery-5.jpg", "images/gallery-6.jpg"]
  },
  "up-6": {
    title: "Parent Orientation",
    date: "June 05, 2026",
    time: "09:30 AM – 11:30 AM",
    venue: "Conference Room",
    guest: "Mrs. Meera Nadgoud (Child Psychologist & Counselor)",
    desc: "Interaction assembly explaining academic schedules, child guidance guidelines, evaluations, and smart classes procedures. Highly recommended for parents of newly admitted students to coordinate home-school synergy.",
    images: ["images/gallery-8.jpg", "images/gallery-1.jpg"]
  },
  "up-7": {
    title: "Environment Day",
    date: "June 05, 2026",
    time: "08:00 AM – 10:00 AM",
    venue: "Campus Grounds",
    guest: "Shri Salumarada Thimmakka (Environmental Activist)",
    desc: "Active plantation drive where students plant herbal and shady saplings in campus blocks. Special address on conservation, recycling, and keeping a plastic-free surrounding.",
    images: ["images/gallery-4.jpg", "images/gallery-5.jpg"]
  },
  "up-8": {
    title: "Computer Workshop",
    date: "October 18, 2026",
    time: "10:00 AM – 01:00 PM",
    venue: "Computer Lab",
    guest: "Dr. Rajesh Patil (Professor of Computer Applications)",
    desc: "Hands-on tech session covering block programming, basic HTML structures, and introduction to artificial intelligence algorithms. Targeted for grades 8 to 10 to encourage coding fluency.",
    images: ["images/video-thumb-3.jpg", "images/video-thumb-4.jpg"]
  },
  "comp-1": {
    title: "Annual Day Celebration",
    images: ["images/gallery-6.jpg", "images/gallery-4.jpg", "images/gallery-2.jpg", "images/gallery-8.jpg"]
  },
  "comp-2": {
    title: "Science Exhibition",
    images: ["images/gallery-2.jpg", "images/achievement-1.jpg", "images/gallery-1.jpg"]
  },
  "comp-3": {
    title: "Teachers Day",
    images: ["images/gallery-4.jpg", "images/gallery-8.jpg", "images/logo.jpeg"]
  },
  "comp-4": {
    title: "Children's Day",
    images: ["images/gallery-8.jpg", "images/gallery-5.jpg", "images/gallery-6.jpg"]
  },
  "comp-5": {
    title: "Sports Meet",
    images: ["images/gallery-7.jpg", "images/gallery-3.jpg", "images/facility-4.jpg"]
  },
  "comp-6": {
    title: "Kannada Rajyotsava",
    images: ["images/gallery-1.jpg", "images/logo.jpeg", "images/gallery-4.jpg"]
  },
  "comp-7": {
    title: "Quiz Competition",
    images: ["images/gallery-2.jpg", "images/achievement-1.jpg", "images/gallery-3.jpg"]
  },
  "comp-8": {
    title: "Farewell Ceremony",
    images: ["images/gallery-8.jpg", "images/gallery-6.jpg", "images/gallery-1.jpg"]
  }
};

let sliderImages = [];
let currentSliderIndex = 0;

function initNewsEventsPage() {
  const btnSwitchUpcoming = document.getElementById('btn-switch-upcoming');
  const btnSwitchCompleted = document.getElementById('btn-switch-completed');
  const sectionUpcoming = document.getElementById('section-upcoming');
  const sectionCompleted = document.getElementById('section-completed');
  const scrollContainer = document.querySelector('.month-scroll-container');
  
  if (!btnSwitchUpcoming && !btnSwitchCompleted && !scrollContainer) return;

  let currentTab = 'upcoming';
  let searchQuery = '';
  let selectedCategory = 'all';
  let selectedYear = 'all';
  let selectedMonth = 'all';

  // Toggle sections
  if (btnSwitchUpcoming && btnSwitchCompleted) {
    btnSwitchUpcoming.addEventListener('click', () => {
      btnSwitchUpcoming.classList.add('active');
      btnSwitchCompleted.classList.remove('active');
      if (sectionUpcoming) sectionUpcoming.style.display = 'block';
      if (sectionCompleted) sectionCompleted.style.display = 'none';
      currentTab = 'upcoming';
      applyFilters();
    });

    btnSwitchCompleted.addEventListener('click', () => {
      btnSwitchCompleted.classList.add('active');
      btnSwitchUpcoming.classList.remove('active');
      if (sectionCompleted) sectionCompleted.style.display = 'block';
      if (sectionUpcoming) sectionUpcoming.style.display = 'none';
      currentTab = 'completed';
      applyFilters();
    });
    
    [btnSwitchUpcoming, btnSwitchCompleted].forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  // Month Scroll arrow buttons
  const btnPrev = document.querySelector('.month-scroll-wrapper .btn-prev');
  const btnNext = document.querySelector('.month-scroll-wrapper .btn-next');
  if (scrollContainer) {
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
      });
    }
  }

  // Search & Filter event bindings
  const searchInput = document.getElementById('event-search');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  const yearFilter = document.getElementById('filter-year');
  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
  }

  const upcomingCategory = document.getElementById('upcoming-category');
  if (upcomingCategory) {
    upcomingCategory.addEventListener('change', applyFilters);
  }

  const completedCategory = document.getElementById('completed-category');
  if (completedCategory) {
    completedCategory.addEventListener('change', applyFilters);
  }

  // Month buttons click binding
  const monthButtons = document.querySelectorAll('.month-filter-btn');
  monthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      monthButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMonth = btn.getAttribute('data-month');
      applyFilters();
    });
  });

  // Main filter function
  function applyFilters() {
    searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    selectedYear = yearFilter ? yearFilter.value : 'all';
    
    const activeCategorySelect = (currentTab === 'upcoming') ? upcomingCategory : completedCategory;
    selectedCategory = activeCategorySelect ? activeCategorySelect.value : 'all';

    const cards = document.querySelectorAll(
      currentTab === 'upcoming' 
        ? '#upcoming-events-grid .event-card-fancy' 
        : '#completed-events-grid .event-card-fancy'
    );

    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.querySelector('.event-title-fancy').textContent.toLowerCase();
      const desc = card.querySelector('.event-desc-fancy').textContent.toLowerCase();
      const category = card.getAttribute('data-category');
      const year = card.getAttribute('data-year');
      const month = card.getAttribute('data-month');

      const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);
      const matchesCategory = (selectedCategory === 'all' || category === selectedCategory);
      const matchesYear = (selectedYear === 'all' || year === selectedYear);
      const matchesMonth = (selectedMonth === 'all' || month === selectedMonth);

      if (matchesSearch && matchesCategory && matchesYear && matchesMonth) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const upcomingNoResults = document.getElementById('upcoming-no-results');
    const completedNoResults = document.getElementById('completed-no-results');

    if (currentTab === 'upcoming' && upcomingNoResults) {
      upcomingNoResults.style.display = (visibleCount === 0) ? 'block' : 'none';
    } else if (currentTab === 'completed' && completedNoResults) {
      completedNoResults.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  }

  // Backdrop modal close
  const detailsModal = document.getElementById('details-modal');
  if (detailsModal) {
    detailsModal.addEventListener('click', (e) => {
      if (e.target === detailsModal) closeDetailsModal();
    });
  }

  const galleryModal = document.getElementById('gallery-modal');
  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) closeGalleryModal();
    });
  }
}

// Modal actions (declared globally so inline html onclick can invoke them)
window.openDetailsModal = function(id) {
  const eventData = EVENTS_DB[id];
  if (!eventData) return;

  const modal = document.getElementById('details-modal');
  const img = document.getElementById('modal-details-img');
  const title = document.getElementById('modal-details-title');
  const date = document.getElementById('modal-details-date');
  const time = document.getElementById('modal-details-time');
  const venue = document.getElementById('modal-details-venue');
  const guest = document.getElementById('modal-details-guest');
  const desc = document.getElementById('modal-details-desc');
  const galleryContainer = document.getElementById('modal-details-gallery');

  if (modal && img && title && date && time && venue && guest && desc && galleryContainer) {
    img.src = eventData.images[0] || 'images/logo.jpeg';
    title.textContent = eventData.title;
    date.textContent = eventData.date;
    time.textContent = eventData.time;
    venue.textContent = eventData.venue;
    guest.textContent = eventData.guest;
    desc.textContent = eventData.desc;

    galleryContainer.innerHTML = '';
    eventData.images.forEach(src => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = eventData.title;
      thumb.addEventListener('click', () => {
        img.src = src;
      });
      galleryContainer.appendChild(thumb);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeDetailsModal = function() {
  const modal = document.getElementById('details-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.openGalleryModal = function(id) {
  const eventData = EVENTS_DB[id];
  if (!eventData || !eventData.images) return;

  sliderImages = eventData.images;
  currentSliderIndex = 0;

  const modal = document.getElementById('gallery-modal');
  const title = document.getElementById('modal-gallery-title');

  if (modal && title) {
    title.textContent = eventData.title;
    updateSliderImage();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

function updateSliderImage() {
  const img = document.getElementById('modal-gallery-img');
  const counter = document.getElementById('modal-gallery-counter');
  if (img && counter && sliderImages.length > 0) {
    img.src = sliderImages[currentSliderIndex];
    counter.textContent = `Image ${currentSliderIndex + 1} of ${sliderImages.length}`;
  }
}

window.changeSlide = function(direction) {
  if (sliderImages.length === 0) return;
  currentSliderIndex = (currentSliderIndex + direction + sliderImages.length) % sliderImages.length;
  updateSliderImage();
};

window.closeGalleryModal = function() {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  sliderImages = [];
};

