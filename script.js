// ========================
// SEARCH TOGGLE (FIX STABIL)
// ========================
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const searchClose = document.getElementById('search-close');

if (searchIcon && searchBar) {
    searchIcon.addEventListener('click', () => {
        searchBar.classList.toggle('active');
    });
}

if (searchClose && searchBar) {
    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('active');
    });
}


// ========================
// NAV TOGGLE (MOBILE)
// ========================
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});


// ========================
// DROPDOWN MOBILE (FIX HALUS)
// ========================
document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', function (e) {

        if (window.innerWidth <= 768) {
            e.preventDefault();

            const parent = this.parentElement;

            // Tutup dropdown lain (biar rapi)
            document.querySelectorAll('.has-dropdown').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                }
            });

            parent.classList.toggle('active');
        }

    });
});

// ========================
// HERO SLIDER AUTO
// ========================
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

setInterval(() => {
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
}, 5000);

const header = document.querySelector('.main-header');

function setHeaderHeight() {
    const height = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', height + 'px');
}

setHeaderHeight();
window.addEventListener('resize', setHeaderHeight);

