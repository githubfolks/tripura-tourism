// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  // Close nav when clicking a link (on mobile)
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
    });
  });
}

// Dynamic year in footer
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Basic date validation for booking form
const bookingForm = document.getElementById('bookingForm');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

if (bookingForm && checkinInput && checkoutInput) {
  bookingForm.addEventListener('submit', function (e) {
    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);

    if (checkout <= checkin) {
      e.preventDefault();
      alert('Check-out date must be after check-in date.');
      return false;
    }
  });
}

// Slider Logic
function initSlider(sliderId, interval = 3000) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  if (slides.length === 0) return;

  let currentIndex = 0;

  // Ensure the first slide is active initially
  slides.forEach((slide, index) => {
    if (index === 0) slide.classList.add('active');
    else slide.classList.remove('active');
  });

  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, interval);
}

// Initialize sliders with slightly different intervals to look more organic
document.addEventListener('DOMContentLoaded', () => {
  initSlider('slider-destinations', 4000); // 4 seconds
  initSlider('slider-experiences', 5000);  // 5 seconds
});
