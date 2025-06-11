; (function ($) {

  $(document).ready(function () {

    showform();
    //========== HEADER ACTIVE STRATS ============= //
    var windowOn = $(window);
    windowOn.on('scroll', function () {
      var scroll = windowOn.scrollTop();
      if (scroll < 100) {
        $(".vl-header-area").removeClass("header-sticky");
      } else {
        $(".vl-header-area").addClass("header-sticky");
      }
    });

    //========== HEADER ACTIVE ENDS ============= //

    //========== MOBILE MENU STARTS ============= //
    var vlMenuWrap = $('.vl-mobile-menu-active > ul').clone();
    var vlSideMenu = $('.vl-offcanvas-menu nav');
    vlSideMenu.append(vlMenuWrap);
    if ($(vlSideMenu).find('.sub-menu, .vl-mega-menu').length != 0) {
      $(vlSideMenu).find('.sub-menu, .vl-mega-menu').parent().append('<button class="vl-menu-close"><i class="fas fa-chevron-right"></i></button>');
    }

    var sideMenuList = $('.vl-offcanvas-menu nav > ul > li button.vl-menu-close, .vl-offcanvas-menu nav > ul li.has-dropdown > a');
    $(sideMenuList).on('click', function (e) {
      console.log(e);
      e.preventDefault();
      if (!($(this).parent().hasClass('active'))) {
        $(this).parent().addClass('active');
        $(this).siblings('.sub-menu, .vl-mega-menu').slideDown();
      } else {
        $(this).siblings('.sub-menu, .vl-mega-menu').slideUp();
        $(this).parent().removeClass('active');
      }
    });


    $(".vl-offcanvas-toggle").on('click', function () {
      $(".vl-offcanvas").addClass("vl-offcanvas-open");
      $(".vl-offcanvas-overlay").addClass("vl-offcanvas-overlay-open");
    });

    $(".vl-offcanvas-close-toggle,.vl-offcanvas-overlay").on('click', function () {
      $(".vl-offcanvas").removeClass("vl-offcanvas-open");
      $(".vl-offcanvas-overlay").removeClass("vl-offcanvas-overlay-open");
    });

    //========== MOBILE MENU ENDS ============= //


    //========== SIDEBAR/SEARCH AREA ============= //
    $(".header-search-btn").on("click", function (e) {
      e.preventDefault();
      $(".header-search-form-wrapper").addClass("open");
      $('.header-search-form-wrapper input[type="search"]').focus();
      $('.body-overlay').addClass('active');
    });
    $(".tx-search-close").on("click", function (e) {
      e.preventDefault();
      $(".header-search-form-wrapper").removeClass("open");
      $("body").removeClass("active");
      $('.body-overlay').removeClass('active');
    });

    $('#mobile-menu-active').metisMenu();
    $('#mobile-menu-active .dropdown > a').on('click', function (e) {
      e.preventDefault();
    });
    $(".hamburger_menu").on("click", function (e) {
      e.preventDefault();
      $(".slide-bar").toggleClass("show");
      $("body").addClass("on-side");
      $('.body-overlay').addClass('active');
      $(this).addClass('active');
    });
    $(".close-mobile-menu > a").on("click", function (e) {
      e.preventDefault();
      $(".slide-bar").removeClass("show");
      $("body").removeClass("on-side");
      $('.body-overlay').removeClass('active');
      $('.hamburger_menu').removeClass('active');
    });
    //========== SIDEBAR/SEARCH AREA ============= //

    //========== PAGE PROGRESS STARTS ============= // 
    var progressPath = document.querySelector(".progress-wrap path");
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      "none";
    progressPath.style.strokeDasharray = pathLength + " " + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition =
      "stroke-dashoffset 10ms linear";
    var updateProgress = function () {
      var scroll = $(window).scrollTop();
      var height = $(document).height() - $(window).height();
      var progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = progress;
    };
    updateProgress();
    $(window).scroll(updateProgress);
    var offset = 50;
    var duration = 550;
    jQuery(window).on("scroll", function () {
      if (jQuery(this).scrollTop() > offset) {
        jQuery(".progress-wrap").addClass("active-progress");
      } else {
        jQuery(".progress-wrap").removeClass("active-progress");
      }
    });
    jQuery(".progress-wrap").on("click", function (event) {
      event.preventDefault();
      jQuery("html, body").animate({ scrollTop: 0 }, duration);
      return false;
    });
    //========== PAGE PROGRESS STARTS ============= // 

    //========== VIDEO POPUP STARTS ============= //
    if ($(".popup-youtube").length > 0) {
      $(".popup-youtube").magnificPopup({
        type: "iframe",
      });
    }
    //========== VIDEO POPUP ENDS ============= //

    //========== AOS_ANIMATION STARTS ============= //
    AOS.init;
    AOS.init({ disable: 'mobile' });
    //========== AOS_ANIMATION ENDS ============= //

    //========== NICE SELECT ============= //
    $('select').niceSelect();

    //========== CASE IMAGE ============= //
    $('.cs_hover_active').hover(function () {
      $(this).addClass('active').siblings().removeClass('active');
    });

  });
  //========== COUNTER UP============= //
  // const ucounter = $('.counter');
  // if (ucounter.length > 0) {
  //   ucounter.countUp();
  // };


  //========== COUNTER UP============= //

  //========== CLICK ============= //
  const color = $(".heart");
  color.on("click", function () {
    $(".heart");
    $(this).addClass("active");
  });
  //========== CLICK ============= //

  //========== SLIDER ============= //
  $('.property-list-img-area').owlCarousel({
    loop: true,
    margin: 30,
    nav: false,
    dots: true,
    items: 6,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    autoplay: true,
    smartSpeed: 2000,
    autoplayTimeout: 3000,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  });
  //========== SLIDER ============= //
  var swiper = new Swiper(".slide-content", {
    slidesPerView: 6,
    spaceBetween: 8,
    loop: true,
    centerSlide: true,
    fade: true,
    grabCursor: true,
    speed: 1000,
    parallax: true,
    autoplay: {
      delay: 6500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    breakpoints: {
      0: { slidesPerView: 1, },
      520: { slidesPerView: 2 },
      950: { slidesPerView: 6 },
    },
  })
  //========== SLIDER ============= //
  var swiper = new Swiper(".mySwiper", {
    loop: true,
    centerSlide: true,
    fade: true,
    grabCursor: true,
    autoplay: {
      delay: 6500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  //========== SLIDER ============= //
  // Initialize Swiper
  var swiper = new Swiper(".swiper-container", {
    slidesPerView: 3,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // Function to Change Main Image
  function changeImage(src) {
    document.getElementById("displayedImage").src = src;
  }

  //========== SLIDER ============= //
  $('.property-listing-area').owlCarousel({
    loop: true,
    margin: 30,
    nav: false,
    dots: true,
    items: 6,
    autoplay: true,
    smartSpeed: 2000,
    autoplayTimeout: 3000,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      }
    }
  });
  //========== SLIDER ============= //
  $(".all-galler-images").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    loop: true,
    focusOnSelect: true,
    vertical: false,
    asNavFor: ".bottom-galler-images",
    infinite: true,
    fade: true,
  });

  $(".bottom-galler-images").slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: ".all-galler-images",
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    loop: true,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  });
  //========== SLIDER ============= //
  var swiper = new Swiper(".myswiper1", {
    loop: true,
    slidesPerView: 1,
    grabCursor: true,
    speed: 1000,
    fadeEffect: {
      crossFade: true
    },
    watchSlidesProgress: true,
    autoplay: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
  //========== SLIDER ============= //
  $('.slider-galeria').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    infinite: false,
    infinite: true,
    asNavFor: '.slider-galeria-thumbs',
    prevArrow: $('.testimonial-next-arrow'),
    nextArrow: $('.testimonial-prev-arrow'),
  });
  $('.slider-galeria-thumbs').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    items: 15,
    arrows: true,
    asNavFor: '.slider-galeria',
    vertical: true,
    infinite: true,
    verticalSwiping: true,
    focusOnSelect: true,
    infinite: false,
    prevArrow: $('.testimonial-next-arrow'),
    nextArrow: $('.testimonial-prev-arrow'),
  });

  //========== SLIDER ============= //
  $('.listing-slider-area').owlCarousel({
    loop: true,
    margin: 30,
    nav: true,
    dots: false,
    items: 10,
    autoplay: true,
    navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
    smartSpeed: 2000,
    autoplayTimeout: 3000,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 2,
      }
    }
  });
  //========== SLIDER ============= //
  $(".hero4-slider-sectionarea").slick({
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    asNavFor: ".hero4-small-img",
    dots: false,
    arrows: false,
    pauseOnDotsHover: true,
    cssEase: 'linear',
    fade: true,
    draggable: true,
  });

  $(".hero4-small-img").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    vertical: true,
    verticalSwiping: true,
    autoplaySpeed: 2000,
    loop: true,
    focusOnSelect: true,
    asNavFor: ".hero4-slider-sectionarea",
    infinite: true,
  });
  //========== SLIDER ============= //

  $('.testimonial4-slider-box').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 1500,
    arrows: true,
    infinite: true,
    prevArrow: $('.testimonial-next-arrow'),
    nextArrow: $('.testimonial-prev-arrow'),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
  //========== SLIDER ============= //
  $(".all-galler-images2").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    loop: true,
    focusOnSelect: true,
    vertical: false,
    asNavFor: ".bottom-galler-images2",
    infinite: true,
    fade: true,
  });

  $(".bottom-galler-images2").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".all-galler-images2",
    dots: true,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    loop: true,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  });
  //========== SLIDER ============= //

  //========== SLIDER ============= //

  //========== SWIPER SLIDER ============= //
  document.addEventListener("DOMContentLoaded", function () {
    var swiper3 = new Swiper(".swiper-thumb2", {
      spaceBetween: 10,
      slidesPerView: 6,
      freeMode: true,
      watchSlidesProgress: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    });
    var swiper4 = new Swiper(".swiper-testimonial-2", {
      spaceBetween: 10,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      thumbs: {
        swiper: swiper3,
      },
    });
  });
  //========== SWIPER SLIDER ============= //

  //========== PRELOADER ============= //
  $(window).on("load", function (event) {
    setTimeout(function () {
      $(".preloader").fadeToggle();
    }, 200);

  });
  //========== PRELOADER BAR AREA ============= //

})(jQuery);

//========== TEXT_ANIMATION AREA ============= //
if ($('.text-anime-style-1').length) {
  let staggerAmount = 0.05,
    translateXValue = 0,
    delayValue = 0.5,
    animatedTextElements = document.querySelectorAll('.text-anime-style-1');

  animatedTextElements.forEach((element) => {
    let animationSplitText = new SplitText(element, { type: "chars, words" });
    gsap.from(animationSplitText.words, {
      duration: 1,
      delay: delayValue,
      x: 20,
      autoAlpha: 0,
      stagger: staggerAmount,
      scrollTrigger: { trigger: element, start: "top 85%" },
    });
  });
}

if ($('.text-anime-style-2').length) {
  let staggerAmount = 0.05,
    translateXValue = 20,
    delayValue = 0.2,
    easeType = "power2.out",
    animatedTextElements = document.querySelectorAll('.text-anime-style-2');

  animatedTextElements.forEach((element) => {
    let animationSplitText = new SplitText(element, { type: "chars, words" });
    gsap.from(animationSplitText.chars, {
      duration: 0.5,
      delay: delayValue,
      x: translateXValue,
      autoAlpha: 0,
      stagger: staggerAmount,
      ease: easeType,
      scrollTrigger: { trigger: element, start: "top 85%" },
    });
  });
}

if ($('.text-anime-style-3').length) {
  let animatedTextElements = document.querySelectorAll('.text-anime-style-3');

  animatedTextElements.forEach((element) => {
    if (element.animation) {
      element.animation.progress(1).kill();
      element.split.revert();
    }

    element.split = new SplitText(element, {
      type: "lines,words,chars",
      linesClass: "split-line",
    });
    gsap.set(element, { perspective: 400 });

    gsap.set(element.split.chars, {
      opacity: 0,
      x: "50",
    });

    element.animation = gsap.to(element.split.chars, {
      scrollTrigger: { trigger: element, start: "top 90%" },
      x: "0",
      y: "0",
      rotateX: "0",
      opacity: 1,
      duration: 1,
      ease: Back.easeOut,
      stagger: 0.02,
    });
  });
}
//========== TEXT_ANIMATION AREA ============= //

//========== IMAGE ANIMATION ============= //
if ($('.reveal').length) {
  gsap.registerPlugin(ScrollTrigger);

  let revealContainers = document.querySelectorAll(".reveal");

  revealContainers.forEach((container) => {
    let image = container.querySelector("img");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        toggleActions: "play none none none"
      }
    });

    tl.set(container, { autoAlpha: 1 });
    tl.from(container, 1.5, { xPercent: -120, ease: Power2.out });
    tl.from(image, 1.5, {
      xPercent: 100,
      scale: 1.1,
      delay: -1.5,
      ease: Power2.out
    });
  });
}

//========== IMAGE ANIMATION ============= //

//========== RENT_SALE TAB ============= //
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content1");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    tabContents.forEach((content) => (content.style.display = "none"));

    const tabId = button.getAttribute("data-tab");
    document.getElementById(tabId).style.display = "block";
  });
});
//========== RENT_SALE TAB ============= //

//========== SHOW FORM ============= //
var showform = function () {
  if ($(".show-form").length > 0) {
    $(".show-form").on("click", function (e) {
      e.preventDefault();
      $(this).toggleClass("click");
      $(".wd-search-form").toggleClass("show-box");
    });
  }
};
//========== SHOW FORM ============= //

//========== RANGE SLDIER ============= //
function initializeSlider(minId, maxId, fillClass, outputId, formatCallback) {
  const minRange = document.getElementById(minId);
  const maxRange = document.getElementById(maxId);
  const output = document.getElementById(outputId);

  // Ensure all required elements exist before proceeding
  if (!minRange || !maxRange || !output) return;

  const sliderFill = minRange.parentElement?.querySelector(`.${fillClass}`);

  // Stop execution if .slider-fill is missing
  if (!sliderFill) return;

  function updateSlider() {
    let minValue = parseInt(minRange.value, 10);
    let maxValue = parseInt(maxRange.value, 10);
    const totalRange = maxRange.max - minRange.min;

    if (minValue > maxValue) {
      [minValue, maxValue] = [maxValue, minValue]; // Swap values if needed
    }

    const minPercent = ((minValue - minRange.min) / totalRange) * 100;
    const maxPercent = ((maxValue - minRange.min) / totalRange) * 100;

    sliderFill.style.left = `${minPercent}%`;
    sliderFill.style.width = `${maxPercent - minPercent}%`;

    output.textContent = formatCallback(minValue, maxValue);
  }

  minRange.addEventListener("input", updateSlider);
  maxRange.addEventListener("input", updateSlider);

  updateSlider(); // Initial update
}

// Initialize sliders after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeSlider(
    "price-range-min",
    "price-range-max",
    "slider-fill",
    "price-output",
    (min, max) => `$${min.toLocaleString()} - $${max.toLocaleString()}`
  );

  initializeSlider(
    "size-range-min",
    "size-range-max",
    "slider-fill",
    "size-output",
    (min, max) => `${min} SqFt - ${max} SqFt`
  );
});



//========== RANGE SLIDER ============= //

/* Show Pass
  -------------------------------------------------------------------------------------*/
function togglePasswordVisibility(passwordSelector, toggleSelector) {
  const passwordField = document.querySelector(passwordSelector);
  const toggleButton = document.querySelector(toggleSelector);

  if (passwordField && toggleButton) {
    toggleButton.addEventListener('click', () => {
      passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
      toggleButton.classList.toggle('active');
    });
  }
}

// Applying the function for multiple password fields
togglePasswordVisibility('.password-field', '.show-pass');
togglePasswordVisibility('.password-field2', '.show-pass2');
togglePasswordVisibility('.password-field3', '.show-pass3');

//========== odometer ============= //
function odometerCounter() {
  if ($('.odometer').length > 0) {
    $('.odometer').appear(function (e) {
      var odo = $('.odometer');
      odo.each(function () {
        var countNumber = $(this).attr('data-count');
        $(this).html(countNumber);
      });
    });
  }
}

$(document).ready(function () {
  odometerCounter();
});

