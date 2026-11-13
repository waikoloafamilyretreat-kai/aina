const availability = { confirmedFrom: null, confirmedThrough: null, bookings: [] };
const parts = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Pacific/Honolulu', year: 'numeric', month: '2-digit', day: '2-digit',
}).formatToParts(new Date());
const part = (type) => parts.find((entry) => entry.type === type).value;
const today = `${part('year')}-${part('month')}-${part('day')}`;
const firstMonth = new Date(`${today.slice(0, 7)}-01T12:00:00Z`);
let monthOffset = 0;
const previous = document.getElementById('previous-month');
const next = document.getElementById('next-month');

function statusFor(date) {
  if (date < today) return 'past';
  if (availability.bookings.some(({ checkin, checkout }) => date >= checkin && date < checkout)) return 'booked';
  if (availability.confirmedFrom && availability.confirmedThrough &&
      date >= availability.confirmedFrom && date <= availability.confirmedThrough) return 'available';
  return 'unconfirmed';
}

function renderCalendar() {
  const month = new Date(Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + monthOffset, 1));
  document.getElementById('calendar-month').textContent = new Intl.DateTimeFormat('en-US', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(month);
  const days = document.getElementById('calendar-days');
  days.replaceChildren();
  const count = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
  const offset = month.getUTCDay();
  const labels = { past: 'Past date', booked: 'Booked', available: 'Available', unconfirmed: 'Not confirmed' };
  for (let cell = 0; cell < Math.ceil((offset + count) / 7) * 7; cell++) {
    if (cell % 7 === 0) days.appendChild(document.createElement('tr'));
    const td = document.createElement('td');
    const day = cell - offset + 1;
    if (day > 0 && day <= count) {
      const date = `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const status = statusFor(date);
      td.textContent = day;
      td.className = status;
      td.title = `${date}: ${labels[status]}`;
      td.setAttribute('aria-label', td.title);
      if (date === today) {
        td.classList.add('today');
        td.setAttribute('aria-current', 'date');
      }
    }
    days.lastElementChild.appendChild(td);
  }
  previous.disabled = monthOffset === 0;
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

function validateAvailability(data) {
  const noWindow = data.confirmedFrom === null && data.confirmedThrough === null;
  const validWindow = validDate(data.confirmedFrom) && validDate(data.confirmedThrough) && data.confirmedFrom <= data.confirmedThrough;
  if ((!noWindow && !validWindow) || !Array.isArray(data.bookings) ||
      !data.bookings.every((stay) => stay && validDate(stay.checkin) && validDate(stay.checkout) && stay.checkin < stay.checkout)) {
    throw new Error('Invalid availability dates');
  }
  return data;
}

previous.addEventListener('click', () => { if (monthOffset > 0) { monthOffset--; renderCalendar(); } });
next.addEventListener('click', () => { monthOffset++; renderCalendar(); });
renderCalendar();
fetch('availability.json', { cache: 'no-store' })
  .then((response) => {
    if (!response.ok) throw new Error('Availability could not be loaded');
    return response.json();
  })
  .then((data) => {
    Object.assign(availability, validateAvailability(data));
    renderCalendar();
    if (availability.confirmedFrom) {
      document.getElementById('calendar-note').textContent = 'Booked dates represent overnight stays. Please email us to confirm your reservation.';
    }
  })
  .catch(() => {
    document.getElementById('calendar-note').textContent = 'Availability is currently unavailable. Please email us for dates.';
  });
