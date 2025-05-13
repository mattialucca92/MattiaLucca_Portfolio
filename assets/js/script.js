window.addEventListener("load", function () {
  document.body.classList.add("loaded");
  typeWriter();
});

$(function () {
  const initializeNavbar = () => {
    const navbarToggle = $(".navbar-toggle");
    const mainMenu = $(".main-menu");

    navbarToggle.click(() => {
      navbarToggle.toggleClass("act");
      mainMenu.toggleClass("act", navbarToggle.hasClass("act"));
    });
  };

  const initializeSmoothScroll = () => {
    $(".page-scroll a").on("click", function (event) {
      event.preventDefault();
      const target = $(this.getAttribute("href"));

      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 50, // -50px per compensare l'header fisso
          },
          {
            duration: 1000,
            easing: "easeInOutExpo",
          }
        );

        // Chiude il menu mobile se aperto
        $(".navbar-toggle").removeClass("act");
        $(".main-menu").removeClass("act");
      }
    });
  };

  const initializeSkillsAnimation = () => {
    const skills = document.querySelectorAll(".progress-bar");
    const animationThreshold = window.innerHeight * 0.8;

    const animateSkills = () => {
      skills.forEach((bar) => {
        const goal = bar.dataset.transitiongoal;
        bar.style.width = `${goal}%`;
      });
    };

    window.addEventListener("scroll", () => {
      const section = document.querySelector(".section-skills");
      const sectionTop = section.getBoundingClientRect().top;

      if (sectionTop < animationThreshold) {
        animateSkills();
        window.removeEventListener("scroll", animateSkills);
      }
    });
  };

  const initializeCarousel = () => {
    const $carousel = $('#projectCarousel');
    
    // Configurazione base del carosello
    $carousel.carousel({
      interval: 5000,
      pause: 'hover',
      keyboard: true,
      wrap: true
    });

    // Gestione dei controlli
    $('.carousel-control-prev').click(function() {
      $carousel.carousel('prev');
      return false;
    });

    $('.carousel-control-next').click(function() {
      $carousel.carousel('next');
      return false;
    });

    // Gestione keyboard
    $(document).on('keydown', function(e) {
      if (e.keyCode === 37) {
        $carousel.carousel('prev');
      }
      if (e.keyCode === 39) {
        $carousel.carousel('next');
      }
    });

    // Gestione touch per mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const threshold = 50;

    $carousel.on('touchstart', function(e) {
      touchStartX = e.originalEvent.touches[0].clientX;
    });

    $carousel.on('touchmove', function(e) {
      touchEndX = e.originalEvent.touches[0].clientX;
    });

    $carousel.on('touchend', function() {
      const swipeLength = touchEndX - touchStartX;
      
      if (Math.abs(swipeLength) > threshold) {
        if (swipeLength > 0) {
          $carousel.carousel('prev');
        } else {
          $carousel.carousel('next');
        }
      }
    });
  };

  initializeNavbar();
  initializeSmoothScroll();
  initializeSkillsAnimation();
  initializeCarousel();

  $("body").scrollspy({
    target: ".site-header",
    offset: 10,
  });

  if ($(".section-counters .start").length > 0) {
    $(".section-counters .start").each(function () {
      const stat_item = $(this),
        offset = stat_item.offset().top;
      $(window).scroll(function () {
        if (
          $(window).scrollTop() > offset - 1000 &&
          !stat_item.hasClass("counting")
        ) {
          stat_item.addClass("counting");
          stat_item.countTo();
        }
      });
    });
  }

  $("#infinity").data("countToOptions", {
    onComplete: function (value) {
      count.call(this, {
        from: value,
        to: value + 1,
      });
    },
  });

  $("#infinity").each(count);

  function count(options) {
    const $this = $(this);
    options = $.extend({}, options || {}, $this.data("countToOptions") || {});
    $this.countTo(options);
  }

  const s = skrollr.init({
    forceHeight: false,
    smoothScrolling: false,
    mobileDeceleration: 0.004,
    mobileCheck: function () {
      return false;
    },
  });

  // Inizializza il carosello
  $('#projectCarousel').carousel({
    interval: 5000, 
    pause: "hover" 
  });

  // Gestione swipe su mobile
  $('#projectCarousel').on('touchstart', function(event){
    const xClick = event.originalEvent.touches[0].pageX;
    $(this).one('touchmove', function(event){
      const xMove = event.originalEvent.touches[0].pageX;
      const sensitivityInPx = 5;

      if(Math.floor(xClick - xMove) > sensitivityInPx){
        $(this).carousel('next');
      }
      else if(Math.floor(xClick - xMove) < -sensitivityInPx){
        $(this).carousel('prev');
      }
    });
    $(this).on('touchend', function(){
      $(this).off('touchmove');
    });
  });
});

// Debounce per scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.addEventListener(
  "scroll",
  debounce(() => {
  }, 20)
);

// Lazy loading delle immagini
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
});

function typeWriter() {
  const text = "Front-end Developer";
  const element = document.querySelector(".typewriter");
  let i = 0;

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    } else {
      setTimeout(() => {
        element.textContent = "";
        i = 0;
        type();
      }, 2000);
    }
  }

  type();
}
