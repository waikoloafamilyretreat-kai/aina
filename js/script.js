// Optional: set min check-in date to today
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById('checkin').setAttribute('min', today);
  document.getElementById('checkout').setAttribute('min', today);
});

