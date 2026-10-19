const cards = [...document.querySelectorAll('.gallery-card')];
const viewer = document.querySelector('.photo-viewer');
const photo = viewer.querySelector('.viewer-image');
let currentIndex = 0;
let opener;
let previousOverflow;

function showPhoto(index) {
  currentIndex = (index + cards.length) % cards.length;
  const card = cards[currentIndex];
  const image = card.querySelector('img');
  photo.src = image.src;
  photo.alt = image.alt;
  viewer.querySelector('#viewer-title').textContent = card.querySelector('h3').textContent;
  viewer.querySelector('#viewer-description').textContent = card.querySelector('p').textContent;
  viewer.querySelector('#viewer-count').textContent = `${currentIndex + 1} / ${cards.length}`;
}

cards.forEach((card, index) => {
  card.setAttribute('role', 'button');
  card.setAttribute('aria-haspopup', 'dialog');
  card.setAttribute('aria-label', `Enlarge photo: ${card.querySelector('h3').textContent}`);
  const open = () => {
    opener = card;
    showPhoto(index);
    previousOverflow = document.body.style.overflow;
    viewer.showModal();
    document.body.style.overflow = 'hidden';
  };
  card.addEventListener('click', open);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
});

viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.querySelector('.viewer-previous').addEventListener('click', () => showPhoto(currentIndex - 1));
viewer.querySelector('.viewer-next').addEventListener('click', () => showPhoto(currentIndex + 1));
viewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
viewer.addEventListener('click', (event) => {
  const bounds = viewer.getBoundingClientRect();
  if (event.target === viewer && (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom)) viewer.close();
});
viewer.addEventListener('close', () => {
  document.body.style.overflow = previousOverflow;
  opener?.focus();
});
