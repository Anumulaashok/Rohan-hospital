import './styles.css';
import { initNav } from './ui/nav.js';
import { initTreatments } from './ui/accordion.js';
import { initTariffTabs } from './ui/tabs.js';
import { initLightbox } from './ui/lightbox.js';
import { initBookingForm } from './booking/form.js';
import { MAP_EMBED_URL, MAP_DIRECTIONS_URL } from './config/hospital.js';

initNav();
initTreatments();
initTariffTabs();
initLightbox();
initBookingForm(document.getElementById('booking-form'));

document.getElementById('map-frame')?.setAttribute('src', MAP_EMBED_URL);
document.querySelectorAll('[data-directions]').forEach((a) => a.setAttribute('href', MAP_DIRECTIONS_URL));
document.getElementById('year').textContent = new Date().getFullYear();
