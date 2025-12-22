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
