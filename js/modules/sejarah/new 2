const timeline = document.getElementById('timeline');
const slides = document.querySelectorAll('.timeline-slide');
const dotsContainer = document.getElementById('dots');
let index = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');

  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function updateDots() {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

function updateSlides() {
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === index);
  });
}

function goToSlide(i) {
  index = i;
  timeline.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
  updateSlides();
}

document.getElementById('nextBtn').onclick = () => {
  if (index < slides.length - 1) index++;
  goToSlide(index);
};

document.getElementById('prevBtn').onclick = () => {
  if (index > 0) index--;
  goToSlide(index);
};

// swipe mobile
let startX = 0;

timeline.addEventListener('touchstart', e => startX = e.touches[0].clientX);

timeline.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50 && index < slides.length - 1) index++;
  if (endX - startX > 50 && index > 0) index--;
  goToSlide(index);
});