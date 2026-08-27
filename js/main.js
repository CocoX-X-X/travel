const btnGo = document.getElementById('btn-go');
const btnTheme = document.getElementById('btn-theme');
const hero = document.getElementById('hero');
const page = document.getElementById('page');
const galerie = document.getElementById('galerie');
const budget = document.getElementById('budget');
const storyNav = document.getElementById('story-nav');
const mapWrap = document.querySelector('.map-wrap');

const layers = { page, galerie, budget };
let currentLayer = null;

/* ---------- Photos réelles (Wikimedia Commons, hotlinkables) ---------- */

const photoFiles = {
    // Étape 1 : Kuala Lumpur & Malacca (Malaisie)
    'trip-1-a': 'Kuala Lumpur Malaysia Petronas-Twin-Towers-01.jpg',
    'trip-1-b': 'Gombak Selangor Batu-Caves-01.jpg',
    'trip-1-c': '2016 Malakka, Plac Holenderski (03).jpg',

    // Étape 2 : Sud de la Thaïlande (Thaïlande)
    'trip-2-a': 'Nopparat Thara Beach panorama 2.jpg',
    'trip-2-b': 'Playa Maya, Ko Phi Phi, Tailandia, 2013-08-19, DD 13.JPG',
    'trip-2-c': 'Unnamed island, Cheow Lan Lake.jpg',

    // Étape 3 : Bali & Java (Indonésie)
    'trip-3-a': 'Jatiluwih rice terraces SF0002.jpg',
    'trip-3-b': 'Tengger Caldera Panorama (27887761791).jpg',
    'trip-3-c': 'Borobudur in Misty Morning (Unsplash).jpg',

    // Étape 4 : Bornéo (Malaisie)
    'trip-4-a': 'Orangutan Kalimantan (Pongo pygmaeus).jpg',
    'trip-4-b': 'Orangutan - Kinabatangan river - Sabah - Borneo - Malaysia - panoramio - diego cue.jpg',
    'trip-4-c': 'Sandakan Sabah View-from-Harbour-Mall-01.jpg',

    // Étape 5 : Shanghai (Chine)
    'trip-5-a': 'Pudong CBD viewed from the North Bund in Shanghai.jpg',
    'trip-5-b': 'Yuyuan Garden 2.jpg',
    'trip-5-c': 'Nanjing Road, Shanghai, China (December 2015) - 30.JPG',

    // Étape 6 : Pékin (Chine)
    'trip-6-a': 'The Forbidden City - View from Coal Hill.jpg',
    'trip-6-b': 'The Mutianyu section of the Great Wall of China.jpg',
    'trip-6-c': 'Temple of Heaven, Beijing, China - 002.jpg',

    // Étape 7 : Séoul (Corée du Sud)
    'trip-7-a': 'Gyeonghoeru (Royal Banquet Hall) at Gyeongbokgung Palace, Seoul.jpg',
    'trip-7-b': 'Seoul Skyline Night 2018.jpg',
    'trip-7-c': 'Streets of Seoul - Flickr - Sergiy Galyonkin.jpg',

    // Étape 8 : Taïwan (Taïwan)
    'trip-8-a': 'Taipei skyline (36533407191).jpg',
    'trip-8-b': 'Alishan Taiwan Alishan-Forest-Railway-02.jpg',
    'trip-8-c': '鼻頭角燈塔FUJI4971.JPG',

    // Étape 9 : Hong Kong (Chine)
    'trip-9-a': 'Vista del Puerto de Victoria desde Sky100, Hong Kong, 2013-08-09, DD 10.JPG',
    'trip-9-b': "Dragon's Back, Hong Kong 01.jpg",
    'trip-9-c': 'Tian Tan Buddha 2023081302.jpg',

    // Étape 10 : Vietnam (Vietnam)
    'trip-10-a': 'Old Quarter street scene, Hanoi (1) (38464672752).jpg',
    'trip-10-b': 'Ha Long Bay 22.jpg',
    'trip-10-c': 'Ho Chi Minh City Skyline (night).jpg',

    // Étape 11 : Chiang Mai & Bangkok (Thaïlande)
    'trip-11-a': 'Wat Phra That Doi Suthep in Chiang Mai 02.jpg',
    'trip-11-b': 'Wat Rong Khun-001.jpg',
    'trip-11-c': 'A roof of a building at the Grand Palace, Bangkok, sunrise, 2017.jpg',

    // Étape 12 : Cambodge (Cambodge)
    'trip-12-a': '2014-Cambodge Angkor Wat (21).jpg',
    'trip-12-b': 'Ta Phrom, Angkor, Camboya, 2013-08-16, DD 02.JPG',
    'trip-12-c': '2016 Phnom Penh, Pałac Królewski, Srebrna Pagoda (02).jpg',

    // Étape 13 : Dubaï (Émirats Arabes Unis)
    'trip-13-a': 'Burj Khalifa from a ferry, Dubai.jpg',
    'trip-13-b': 'Jumeirah Palm-Dubai4067.JPG',
    'trip-13-c': 'UAE Dubai Marina img1 asv2018-01.jpg',

    // Bilan
    'bilan-1': 'Kuala Lumpur Malaysia Petronas-Twin-Towers-01.jpg',
    'bilan-2': 'Orangutan Kalimantan (Pongo pygmaeus).jpg',
    'bilan-3': 'Taipei skyline (36533407191).jpg',
    'bilan-4': 'Vista del Puerto de Victoria desde Sky100, Hong Kong, 2013-08-09, DD 10.JPG',
    'bilan-5': 'Ha Long Bay 22.jpg',
    'bilan-6': 'A roof of a building at the Grand Palace, Bangkok, sunrise, 2017.jpg',
};

const photo = (seed, w, h) => {
    if (photoFiles[seed]) {
        const name = encodeURIComponent(photoFiles[seed]);
        return `https://commons.wikimedia.org/wiki/Special:FilePath/${name}?width=${Math.min(w * 2, 2800)}`;
    }
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
};

/* ---------- Carrousel de la landing ---------- */

const heroPhotos = [
    photo('trip-3-b', 2400, 1350),
    photo('trip-2-b', 2400, 1350),
    photo('trip-6-b', 2400, 1350),
    photo('trip-7-b', 2400, 1350),
    photo('trip-13-a', 2400, 1350),
    photo('trip-12-a', 2400, 1350),
];

heroPhotos.forEach((url, i) => {
    const layer = document.createElement('div');
    layer.className = `hero-bg${i === 0 ? ' hero-bg--active' : ''}`;
    layer.style.backgroundImage = `url('${url}')`;
    hero.insertBefore(layer, hero.firstChild);
});

function brightnessOf(url, cb) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 48, 48);
        const data = ctx.getImageData(0, 0, 48, 48).data;
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
            sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        }
        cb(sum / (data.length / 4));
    };
    img.src = url;
}

function applyTextStyle(lum) {
    hero.classList.toggle('hero--dark', lum < 130);
}

brightnessOf(heroPhotos[0], applyTextStyle);

let photoIndex = 0;
const heroLayers = hero.querySelectorAll('.hero-bg');

setInterval(() => {
    photoIndex = (photoIndex + 1) % heroPhotos.length;
    heroLayers.forEach((layer, i) => layer.classList.toggle('hero-bg--active', i === photoIndex));
    brightnessOf(heroPhotos[photoIndex], applyTextStyle);
}, 6000);

/* ---------- Navigation entre vues ---------- */

function openLayer(name) {
    const layer = layers[name];
    if (!layer || currentLayer === layer) return;
    hero.classList.add('exit');
    if (currentLayer) currentLayer.classList.remove('enter');
    currentLayer = layer;
    layer.scrollTop = 0;
    layer.classList.add('enter');
    Object.entries(layers).forEach(([key, el]) => {
        el.setAttribute('aria-hidden', String(el !== currentLayer));
    });
    storyNav.classList.toggle('visible', currentLayer === page);
    if (currentLayer === page) updateStoryNav();
}

function goHome() {
    if (!currentLayer) return;
    currentLayer.classList.remove('enter');
    currentLayer.setAttribute('aria-hidden', 'true');
    currentLayer = null;
    hero.classList.remove('exit');
    storyNav.classList.remove('visible');
}

btnGo.addEventListener('click', () => openLayer('page'));
document.querySelectorAll('.btn-back[data-home]').forEach((b) => b.addEventListener('click', goHome));
document.querySelectorAll('.hero-menu button').forEach((b) => {
    b.addEventListener('click', () => openLayer(b.dataset.layer));
});

let touchStartY = null;

hero.addEventListener('wheel', (e) => {
    if (!currentLayer && e.deltaY > 30) openLayer('page');
});

hero.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

hero.addEventListener('touchend', (e) => {
    if (touchStartY === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if (!currentLayer && deltaY < -40) openLayer('page');
    touchStartY = null;
}, { passive: true });

window.addEventListener('keydown', (e) => {
    if (e.target.closest('button, a')) return;

    if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') navLightbox(-1);
        else if (e.key === 'ArrowRight') navLightbox(1);
        return;
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (currentLayer === page) {
            e.preventDefault();
            page.scrollBy({ top: 600, behavior: 'smooth' });
        } else if (!currentLayer) {
            openLayer('page');
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (currentLayer === page) {
            e.preventDefault();
            if (page.scrollTop <= 0) goHome();
            else page.scrollBy({ top: -600, behavior: 'smooth' });
        } else if (currentLayer) {
            goHome();
        }
    } else if (e.key === 'Escape') {
        if (currentLayer) goHome();
    }
});

/* ---------- Mode nuit ---------- */

const iconMoon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
const iconSun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

function updateThemeIcon() {
    const dark = document.body.classList.contains('theme-dark');
    btnTheme.innerHTML = dark ? iconSun : iconMoon;
    btnTheme.setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode nuit');
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('theme-dark');
}
updateThemeIcon();

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    updateThemeIcon();
});

/* ---------- Carte ---------- */

const countryColors = {
    'Malaisie': '#3d9970',
    'Thaïlande': '#f2b705',
    'Indonésie': '#e07a3f',
    'Chine': '#c0392b',
    'Corée du Sud': '#4a90d9',
    'Taïwan': '#9b59b6',
    'Vietnam': '#16a085',
    'Cambodge': '#a98467',
    'Émirats Arabes Unis': '#b8860b',
};

const colorOf = (step) => countryColors[step.country] || '#c8452e';

const eur = (n) => `${n.toLocaleString('fr-FR')} \u20ac`;

const bounds = L.latLngBounds(steps.map((s) => [s.lat, s.lng]));

const map = L.map('map', { scrollWheelZoom: false }).fitBounds(bounds, {
    padding: [36, 36],
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
}).addTo(map);

map.once('click', () => map.scrollWheelZoom.enable());

const pageStats = document.getElementById('page-stats');
if (pageStats) {
    const kmTotal = '27 500';
    const countries = new Set(steps.map((s) => s.country)).size;
    const days = steps.reduce((sum, s) => sum + parseInt(s.duration, 10), 0);
    const budgetTotal = steps.reduce((sum, s) => sum + parseInt(s.budget, 10), 0).toLocaleString('fr-FR');
    pageStats.innerHTML = `
        <span>${kmTotal}<i>km</i></span>
        <span>${countries}<i>pays</i></span>
        <span>${days}<i>jours</i></span>
        <span>${budgetTotal} €<i>budget</i></span>`;
}

function popupHtml(step) {
    return `
        <div class="popup-step">
            <img class="popup-photo" src="${photo(`trip-${step.number}-a`, 480, 240)}" alt="${step.name}">
            <div class="popup-head">
                <span class="popup-num" style="background:${colorOf(step)}">${step.number}</span>
                <strong>${step.name}</strong>
            </div>
            <div class="popup-row"><span>Durée</span>${step.duration}</div>
            <div class="popup-row"><span>Budget</span>${step.budget}</div>
            <p class="popup-note">${step.note}</p>
        </div>`;
}

steps.forEach((step) => {
    const icon = L.divIcon({
        className: 'pin-wrap',
        html: `<div class="pin" style="background:${colorOf(step)}"><span>${step.number}</span></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [15, -13],
    });

    L.marker([step.lat, step.lng], { icon })
        .addTo(map)
        .bindPopup(popupHtml(step), { className: 'custom-popup' });
});

/* ---------- Narration ---------- */

const storyContent = document.getElementById('story-content');

const stepItems = steps
    .map((step, i) => {
        const alternate = i % 2 === 1 ? ' story--alt' : '';
        return `
            <article class="story-item${alternate}" id="step-${step.number}">
                <div class="story-head">
                    <span class="story-num" style="background:${colorOf(step)}">${step.number}</span>
                    <div class="story-titles">
                        <h3>${step.name}</h3>
                        <span class="story-country">${step.country}</span>
                    </div>
                    <div class="story-meta">${step.duration} · ${step.budget}</div>
                </div>
                <div class="story-body">
                    <figure class="story-photo">
                        <img src="${photo(`trip-${step.number}-a`, 1200, 900)}" alt="${step.name}">
                    </figure>
                    <div class="story-text">
                        ${step.story.map((p) => `<p>${p}</p>`).join('')}
                    </div>
                </div>
                <figure class="story-photo-wide">
                    <img src="${photo(`trip-${step.number}-b`, 1800, 800)}" alt="">
                </figure>
            </article>`;
    })
    .join('');

function buildBilan() {
    const totalDays = steps.reduce((sum, s) => sum + parseInt(s.duration, 10), 0);
    const totalBudget = steps.reduce((sum, s) => sum + parseInt(s.budget, 10), 0);

    const longest = steps.reduce((a, b) => (parseInt(b.duration, 10) > parseInt(a.duration, 10) ? b : a));
    const shortest = steps.reduce((a, b) => (parseInt(b.duration, 10) < parseInt(a.duration, 10) ? b : a));
    const priciest = steps.reduce((a, b) => (parseInt(b.budget, 10) > parseInt(a.budget, 10) ? b : a));
    const cheapest = steps.reduce((a, b) => (parseInt(b.budget, 10) < parseInt(a.budget, 10) ? b : a));

    const countryCounts = {};
    steps.forEach((s) => {
        countryCounts[s.country] = (countryCounts[s.country] || 0) + 1;
    });
    const countriesHtml = Object.entries(countryCounts)
        .map(
            ([country, n]) => `
                <li>
                    <span class="country-dot" style="background:${countryColors[country]}"></span>
                    ${country}
                    <b>${n} étape${n > 1 ? 's' : ''}</b>
                </li>`
        )
        .join('');

    const top3 = [
        { number: 3, text: 'Le lever de soleil sur le mont Bromo, au-dessus de la mer de nuages.' },
        { number: 12, text: 'L\u2019aube sur Angkor Wat, les temples qui émergent de la brume.' },
        { number: 6, text: 'La Grande Muraille à Mutianyu, presque seuls au monde.' },
    ];

    const top3Html = top3
        .map((t) => {
            const step = steps.find((s) => s.number === t.number);
            return `
                <li>
                    <span class="top3-num" style="background:${colorOf(step)}">${t.number}</span>
                    <div>
                        <strong>${step.name}</strong>
                        <p>${t.text}</p>
                    </div>
                </li>`;
        })
        .join('');

    const recordsHtml = `
        <li class="record-item">
            <div class="record-header">
                <span class="record-tag">Étape la plus longue</span>
                <span class="record-badge">${longest.duration}</span>
            </div>
            <div class="record-main">
                <span class="country-dot" style="background:${colorOf(longest)}"></span>
                <strong>${longest.name}</strong>
                <span class="record-country">${longest.country}</span>
            </div>
        </li>
        <li class="record-item">
            <div class="record-header">
                <span class="record-tag">Plus gros budget</span>
                <span class="record-badge">${priciest.budget}</span>
            </div>
            <div class="record-main">
                <span class="country-dot" style="background:${colorOf(priciest)}"></span>
                <strong>${priciest.name}</strong>
                <span class="record-country">${priciest.country}</span>
            </div>
        </li>
        <li class="record-item">
            <div class="record-header">
                <span class="record-tag">La plus économique</span>
                <span class="record-badge">${cheapest.budget}</span>
            </div>
            <div class="record-main">
                <span class="country-dot" style="background:${colorOf(cheapest)}"></span>
                <strong>${cheapest.name}</strong>
                <span class="record-country">${cheapest.country}</span>
            </div>
        </li>
        <li class="record-item">
            <div class="record-header">
                <span class="record-tag">Séjour le plus court</span>
                <span class="record-badge">${shortest.duration}</span>
            </div>
            <div class="record-main">
                <span class="country-dot" style="background:${colorOf(shortest)}"></span>
                <strong>${shortest.name}</strong>
                <span class="record-country">${shortest.country}</span>
            </div>
        </li>`;

    return `
        <section class="bilan" id="bilan">
            <div class="bilan-head">
                <h2>Le bilan</h2>
                <p>Trois mois de route, en chiffres et en souvenirs.</p>
            </div>
            <div class="bilan-stats">
                <div class="bilan-stat"><span class="bilan-num">27 500</span><span class="bilan-label">km parcourus</span></div>
                <div class="bilan-stat"><span class="bilan-num">${Object.keys(countryCounts).length}</span><span class="bilan-label">pays</span></div>
                <div class="bilan-stat"><span class="bilan-num">${totalDays}</span><span class="bilan-label">jours</span></div>
                <div class="bilan-stat"><span class="bilan-num">${eur(totalBudget)}</span><span class="bilan-label">budget total</span></div>
            </div>
            <div class="bilan-grid">
                <div class="bilan-block">
                    <h3>Les trois moments forts</h3>
                    <ol class="top3">${top3Html}</ol>
                </div>
                <div class="bilan-block">
                    <h3>Les pays traversés</h3>
                    <ul class="country-list">${countriesHtml}</ul>
                </div>
                <div class="bilan-block">
                    <h3>Les records du voyage</h3>
                    <ul class="record-list">${recordsHtml}</ul>
                </div>
            </div>
            <p class="bilan-quote">« Treize étapes, neuf pays, trois mois de route : l\u2019Asie ne sera plus jamais un point sur la carte. »</p>
            <div class="bilan-photos">
                <img src="${photo('bilan-1', 900, 560)}" alt="Souvenir du voyage">
                <img src="${photo('bilan-2', 900, 560)}" alt="Souvenir du voyage">
                <img src="${photo('bilan-3', 900, 560)}" alt="Souvenir du voyage">
                <img src="${photo('bilan-4', 900, 560)}" alt="Souvenir du voyage">
                <img src="${photo('bilan-5', 900, 560)}" alt="Souvenir du voyage">
                <img src="${photo('bilan-6', 900, 560)}" alt="Souvenir du voyage">
            </div>
        </section>`;
}

storyContent.innerHTML = stepItems + buildBilan();

/* ---------- Suivi visuel de la narration ---------- */

const storyItems = steps.map((s) => document.getElementById(`step-${s.number}`));
const storyDots = [];

steps.forEach((step) => {
    const dot = document.createElement('button');
    dot.className = 'story-dot';
    dot.style.setProperty('--dot-color', colorOf(step));
    dot.setAttribute('aria-label', `${step.number} · ${step.name}`);
    dot.title = `${step.number} · ${step.name}`;
    dot.addEventListener('click', () => {
        const target = document.getElementById(`step-${step.number}`);
        page.scrollTo({ top: target.offsetTop - 24, behavior: 'smooth' });
    });
    storyNav.appendChild(dot);
    storyDots.push(dot);
});

function updateStoryNav() {
    const mapGone = mapWrap.getBoundingClientRect().bottom <= 0;
    storyNav.classList.toggle('visible', currentLayer === page && mapGone);
    if (!mapGone) return;
    const pos = page.scrollTop + page.clientHeight * 0.35;
    let idx = 0;
    storyItems.forEach((el, i) => {
        if (el.offsetTop <= pos) idx = i;
    });
    storyDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
}

page.addEventListener('scroll', updateStoryNav, { passive: true });
updateStoryNav();

/* ---------- Galerie ---------- */

const filtersEl = document.getElementById('filters');
const galleryEl = document.getElementById('gallery');

filtersEl.innerHTML = ['tous', ...Object.keys(countryColors)]
    .map((c) => `<button class="filter${c === 'tous' ? ' active' : ''}" data-country="${c}">${c}</button>`)
    .join('');

const galleryItems = [];

steps.forEach((step) => {
    [
        { seed: `trip-${step.number}-a`, w: 1200, h: 900 },
        { seed: `trip-${step.number}-b`, w: 1800, h: 800 },
        { seed: `trip-${step.number}-c`, w: 900, h: 1200 },
    ].forEach((p) => {
        const item = document.createElement('figure');
        item.className = 'gallery-item';
        item.dataset.country = step.country;
        item.innerHTML = `
            <img src="${photo(p.seed, p.w, p.h)}" alt="${step.number} · ${step.name}" loading="lazy">
            <figcaption class="gallery-cap">${step.number} · ${step.name}</figcaption>`;
        item.addEventListener('click', () => openLightbox(galleryItems.indexOf(item)));
        galleryEl.appendChild(item);
        galleryItems.push(item);
    });
});

filtersEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter');
    if (!chip) return;
    filtersEl.querySelectorAll('.filter').forEach((c) => c.classList.toggle('active', c === chip));
    const country = chip.dataset.country;
    galleryItems.forEach((item) => item.classList.toggle('hide', country !== 'tous' && item.dataset.country !== country));
});

/* ---------- Lightbox ---------- */

const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
let lbIndex = 0;
let lightboxOpen = false;

const visibleItems = () => galleryItems.filter((item) => !item.classList.contains('hide'));

function updateLightbox() {
    const items = visibleItems();
    const item = items[lbIndex];
    if (!item) return;
    const img = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = `${lbIndex + 1} / ${items.length} · ${img.alt}`;
}

function openLightbox(index) {
    const items = visibleItems();
    if (!items.length) return;
    lbIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxOpen = true;
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxOpen = false;
}

function navLightbox(dir) {
    const items = visibleItems();
    lbIndex = (lbIndex + dir + items.length) % items.length;
    updateLightbox();
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => navLightbox(-1));
document.getElementById('lb-next').addEventListener('click', () => navLightbox(1));

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

/* ---------- Page Budget ---------- */

const budgetContent = document.getElementById('budget-content');

const totalDays = steps.reduce((sum, s) => sum + parseInt(s.duration, 10), 0);
const totalBudget = steps.reduce((sum, s) => sum + parseInt(s.budget, 10), 0);
const maxBudget = Math.max(...steps.map((s) => parseInt(s.budget, 10)));
const avgStep = Math.round(totalBudget / steps.length);
const priciestStep = steps.reduce((a, b) => (parseInt(b.budget, 10) > parseInt(a.budget, 10) ? b : a));

const barsSvg = (() => {
    const W = 900;
    const H = 320;
    const padL = 8;
    const padB = 36;
    const innerW = W - padL * 2;
    const innerH = H - padB - 24;
    const bw = innerW / steps.length;
    return `
        <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Dépenses par étape">
            ${steps
                .map((s) => {
                    const val = parseInt(s.budget, 10);
                    const h = (val / maxBudget) * innerH;
                    const x = padL + bw * (s.number - 1) + bw * 0.18;
                    const w = bw * 0.64;
                    const y = padB + innerH - h;
                    return `
                        <g>
                            <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${colorOf(s)}">
                                <title>${s.name} — ${val} €</title>
                            </rect>
                            <text class="svg-label" x="${(x + w / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" font-size="9">${val}</text>
                            <text class="svg-label" x="${(x + w / 2).toFixed(1)}" y="${H - 10}" text-anchor="middle" font-size="10">${s.number}</text>
                        </g>`;
                })
                .join('')}
        </svg>`;
})();

const curveSvg = (() => {
    const W = 900;
    const H = 300;
    const padL = 20;
    const padT = 20;
    const padB = 40;
    const innerW = W - padL * 2;
    const innerH = H - padT - padB;
    let cum = 0;
    const pts = steps.map((s, i) => {
        cum += parseInt(s.budget, 10);
        const x = padL + (i / (steps.length - 1)) * innerW;
        const y = padT + innerH - (cum / totalBudget) * innerH;
        return { x, y, step: s, cum };
    });
    const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const baseline = (padT + innerH).toFixed(1);
    const area = `M${pts[0].x.toFixed(1)},${baseline} L${line.replace(/ /g, ' L')} L${pts[pts.length - 1].x.toFixed(1)},${baseline} Z`;
    const dots = pts
        .map(
            (p) =>
                `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${colorOf(p.step)}"><title>${p.step.name} — cumulé ${eur(p.cum)}</title></circle>`
        )
        .join('');
    return `
        <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Budget cumulé">
            <path d="${area}" class="chart-area"/>
            <polyline points="${line}" class="chart-line" fill="none"/>
            ${dots}
            <text class="svg-label" x="${padL}" y="${H - 10}">Départ</text>
            <text class="svg-label" x="${W - padL}" y="${H - 10}" text-anchor="end">${eur(totalBudget)}</text>
        </svg>`;
})();

const maxPerDay = Math.max(...steps.map((s) => Math.round(parseInt(s.budget, 10) / parseInt(s.duration, 10))));
const stepRowsHtml = steps
    .map((s) => {
        const val = parseInt(s.budget, 10);
        const days = parseInt(s.duration, 10);
        const perDay = Math.round(val / days);
        const pct = Math.round((perDay / maxPerDay) * 100);
        return `
            <div class="country-row">
                <span class="country-dot" style="background:${countryColors[s.country]}"></span>
                <span class="country-name">${s.number}. ${s.name}</span>
                <div class="country-bar"><i style="width:${pct}%;background:${countryColors[s.country]}"></i></div>
                <b class="country-total">${eur(val)}</b>
                <span class="country-day">${perDay} €/jour</span>
            </div>`;
    })
    .join('');

budgetContent.innerHTML = `
    <div class="budget-body">
        <div class="bilan-stats">
            <div class="bilan-stat"><span class="bilan-num">${eur(totalBudget)}</span><span class="bilan-label">budget total</span></div>
            <div class="bilan-stat"><span class="bilan-num">${Math.round(totalBudget / totalDays)} €</span><span class="bilan-label">par jour</span></div>
            <div class="bilan-stat"><span class="bilan-num">${avgStep} €</span><span class="bilan-label">moyenne par étape</span></div>
            <div class="bilan-stat"><span class="bilan-num">${parseInt(priciestStep.budget, 10)} €</span><span class="bilan-label">étape max · ${priciestStep.name}</span></div>
        </div>
        <div class="bilan-block chart-card">
            <h3>Dépenses par étape</h3>
            ${barsSvg}
        </div>
        <div class="bilan-block chart-card">
            <h3>Budget cumulé</h3>
            ${curveSvg}
        </div>
        <div class="bilan-block">
            <h3>Par étape</h3>
            <div class="country-rows">${stepRowsHtml}</div>
        </div>
    </div>`;
