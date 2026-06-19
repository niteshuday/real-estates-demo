import { BRAND_CONFIG, DUMMY_PROPERTIES_NOMENCLATURE } from './config.js';
import { PROPERTIES } from './propertiesData.js';
import { TRANSLATIONS } from './translations.js';

// SECURE STORAGE KEY NAMES
const STORAGE_LEADS_KEY = 'vortex_estates_leads';
const STORAGE_ENQUIRIES_KEY = 'vortex_estates_enquiries';

// INITIAL CORE SEED DATA
const DEFAULT_LEADS = [
  { id: 'lead-1', name: 'Ananya Singhania', email: 'a.singhania@singhaniatrust.com', phone: '+91 98110 55431', preferredType: 'villa', budget: '₹50 Cr+', date: '2026-06-19', status: 'new' },
  { id: 'lead-2', name: 'Vikramaditya Mehta', email: 'vikram@mehta-holdings.co.in', phone: '+91 99200 48482', preferredType: 'penthouse', budget: '₹20 Cr - ₹50 Cr', date: '2026-06-18', status: 'contacted' },
  { id: 'lead-3', name: 'Dr. Sandeep Nair', email: 'sandeep.nair@cardio-elite.in', phone: '+91 98300 11223', preferredType: 'apartment', budget: '₹10 Cr - ₹20 Cr', date: '2026-06-17', status: 'new' }
];

const DEFAULT_ENQUIRIES = [
  { 
    id: 'enq-1', 
    name: 'Karan Malhotra', 
    email: 'karan@malhotracorp.com', 
    phone: '+91 98200 11550', 
    message: 'Requesting a private physical walkthrough for Saturday. Need to verify heli-pad clearance details or speed-boat docking options nearby.', 
    propertyId: 'prop-1', 
    propertyTitle: DUMMY_PROPERTIES_NOMENCLATURE.prop1.title, 
    date: '2026-06-19', 
    status: 'unread' 
  }
];

// REACTIVE APPS STATE
let leads = JSON.parse(localStorage.getItem(STORAGE_LEADS_KEY)) || DEFAULT_LEADS;
let enquiries = JSON.parse(localStorage.getItem(STORAGE_ENQUIRIES_KEY)) || DEFAULT_ENQUIRIES;

let activeFilters = {
  search: '',
  beds: 0,
  maxBudget: 1000000000, // 100 Crore
  typology: 'all'
};

let currentlySelectedProperty = null;
let currentLang = localStorage.getItem('vortex_language') || 'en';

// SAVE TO BACKING LOCALSTORAGE
function saveState() {
  localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
  localStorage.setItem(STORAGE_ENQUIRIES_KEY, JSON.stringify(enquiries));
  updateAdminTerminalMetrics();
}

// FORMAT PRICE CURRENCY TO INR CR/LAKH REPRESENTATION
function formatPriceINR(price) {
  const crSuffix = currentLang === 'hi' ? ' करोड़' : currentLang === 'mr' ? ' कोटी' : ' Crore';
  const lakhSuffix = currentLang === 'hi' ? ' लाख' : currentLang === 'mr' ? ' लाख' : ' Lakh';

  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr.toFixed(1).replace('.0', '')}${crSuffix}`;
  } else {
    const lk = price / 100000;
    return `₹${lk.toFixed(1).replace('.0', '')}${lakhSuffix}`;
  }
}

// HYDRATE BRAND STYLES & CONFIG STRINGS ON DOCUMENT LOAD
function hydrateBrandAndGeneralConfig() {
  const dict = TRANSLATIONS[currentLang];
  
  // Elements hydration
  document.getElementById('header-brand-name').textContent = dict.brandName || BRAND_CONFIG.agencyName;
  document.getElementById('header-brand-subtitle').textContent = dict.brandSubtitle || BRAND_CONFIG.agencySubtitle;
  
  document.getElementById('hero-stat-volume').textContent = BRAND_CONFIG.volumeSettled;
  document.getElementById('hero-stat-keys').textContent = BRAND_CONFIG.keysCount;
  document.getElementById('hero-stat-selectivity').textContent = BRAND_CONFIG.exclusivitySelectivity;
  
  document.getElementById('footer-logo-name').textContent = dict.brandName || BRAND_CONFIG.agencyName;
  document.getElementById('footer-logo-subtitle').textContent = dict.brandSubtitle || BRAND_CONFIG.agencySubtitle;
  document.getElementById('footer-contact-address').textContent = dict.contactAddress || BRAND_CONFIG.contactAddress;
  document.getElementById('footer-contact-email').textContent = BRAND_CONFIG.contactEmail;
  document.getElementById('footer-contact-phone').textContent = BRAND_CONFIG.contactPhone;
  
  const licenseNum = dict.licensedReraNumber || BRAND_CONFIG.licensedReraNumber;
  const copyrightText = currentLang === 'hi' 
    ? `© ${new Date().getFullYear()} ${dict.brandName} ${dict.brandSubtitle} कंसोर्टियम। सर्वाधिकार सुरक्षित। ${licenseNum} के तहत पंजीकृत भारतीय ब्रोकरेज फर्म।`
    : currentLang === 'mr'
    ? `© ${new Date().getFullYear()} ${dict.brandName} ${dict.brandSubtitle} कन्सोर्टियम. सर्व हक्क राखीव. ${licenseNum} अंतर्गत नोंदणीकृत भारतीय ब्रोकरेज फर्म.`
    : `© ${new Date().getFullYear()} ${dict.brandName} ${dict.brandSubtitle} Consortium. All rights reserved. Registered Indian Brokerage Firm under ${licenseNum}.`;
    
  document.getElementById('footer-copyright-rera').innerHTML = copyrightText;
  document.getElementById('agent-rera-id').textContent = licenseNum;

  // Hydrate slider pricing text indicators
  const sliderMin = document.getElementById('slider-min-label');
  const sliderMax = document.getElementById('slider-max-label');
  const sliderPrice = document.getElementById('slider-price-label');
  if (sliderMin) sliderMin.textContent = formatPriceINR(50000000);
  if (sliderMax) sliderMax.textContent = formatPriceINR(1000000000);
  if (sliderPrice) sliderPrice.textContent = formatPriceINR(activeFilters.maxBudget);
}

// TRANSLATION ENGINE & LANGUAGE OVERLAY SWITCHER
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('vortex_language', lang);
  
  const dict = TRANSLATIONS[lang];
  
  // 1. Update the top level label
  const activeLabel = document.getElementById('active-lang-label');
  if (activeLabel) activeLabel.textContent = lang.toUpperCase();
  
  // 2. Highlight selected option in lang menu list
  const btnEn = document.getElementById('lang-select-en');
  const btnHi = document.getElementById('lang-select-hi');
  const btnMr = document.getElementById('lang-select-mr');
  
  [btnEn, btnHi, btnMr].forEach(btn => {
    if (!btn) return;
    btn.classList.remove('bg-neutral-50', 'font-semibold', 'text-neutral-900');
  });
  
  const activeBtn = document.getElementById(`lang-select-${lang}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-neutral-50', 'font-semibold', 'text-neutral-900');
  }
  
  // Highlight mobile language buttons
  const mobEn = document.getElementById('mob-lang-btn-en');
  const mobHi = document.getElementById('mob-lang-btn-hi');
  const mobMr = document.getElementById('mob-lang-btn-mr');
  
  [mobEn, mobHi, mobMr].forEach(btn => {
    if (!btn) return;
    btn.className = "px-2 py-1 border border-neutral-200 rounded text-xs font-mono uppercase text-neutral-600 hover:bg-neutral-50 bg-white";
  });
  
  const activeMob = document.getElementById(`mob-lang-btn-${lang}`);
  if (activeMob) {
    activeMob.className = "px-2 py-1 border border-neutral-900 rounded text-xs font-mono uppercase bg-neutral-900 text-white";
  }
  
  // 3. Translate all HTML elements with data-translate attribute
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(el => {
    const key = el.getAttribute('data-translate');
    if (dict[key]) {
      if (dict[key].includes('<span') || dict[key].includes('<br') || key === 'heroHeading') {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });
  
  // 4. Translate all placeholder inputs
  const inputs = document.querySelectorAll('[data-translate-placeholder]');
  inputs.forEach(input => {
    const key = input.getAttribute('data-translate-placeholder');
    if (dict[key]) {
      input.placeholder = dict[key];
    }
  });
  
  // 5. Re-hydrate brand configurations
  hydrateBrandAndGeneralConfig();
  
  // 6. Refresh properties grid & filter feedback labels if function exists
  if (typeof renderPropertiesGrid === 'function') {
    renderPropertiesGrid();
  }
  if (typeof updateFilterFeedbackRow === 'function') {
    updateFilterFeedbackRow();
  }
  if (typeof updateAdminTerminalMetrics === 'function') {
    updateAdminTerminalMetrics();
  }
  
  // Close language dropdown menu
  const dropMenu = document.getElementById('lang-dropdown-menu');
  if (dropMenu) dropMenu.classList.add('hidden');
}

// TOAST ALERT TRIGGER SYSTEM
function triggerToast(title, subtitle, type = 'success') {
  const container = document.getElementById('toast-container');
  const toastId = `toast-${Date.now()}`;
  
  const icon = type === 'success' ? 'check-circle' : 'sparkles';
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-neutral-900';
  
  const html = `
    <div id="${toastId}" class="flex items-start gap-4 p-4 bg-white border border-neutral-200/85 rounded-2xl shadow-xl max-w-sm w-80 transform translate-y-4 opacity-0 transition-all duration-300 pointer-events-auto">
      <div class="h-8 w-8 bg-neutral-100 flex items-center justify-center rounded-xl flex-shrink-0">
        <i data-lucide="${icon}" class="h-4 w-4 ${iconColor}"></i>
      </div>
      <div class="space-y-0.5 flex-grow">
        <h4 class="font-sans font-semibold text-neutral-900 text-xs">${title}</h4>
        <p class="font-sans text-[10px] text-neutral-500 font-light leading-relaxed">${subtitle}</p>
      </div>
      <button onclick="document.getElementById('${toastId}').remove()" class="text-neutral-400 hover:text-neutral-900 transition-colors">
        <i data-lucide="x" class="h-3.5 w-3.5"></i>
      </button>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', html);
  lucide.createIcons();
  
  const el = document.getElementById(toastId);
  setTimeout(() => {
    el.classList.remove('translate-y-4', 'opacity-0');
  }, 50);
  
  setTimeout(() => {
    if (el) {
      el.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => el.remove(), 300);
    }
  }, 5000);
}

// DYNAMICALLY RENDER THE MAIN PROPERTIES GRID
function renderPropertiesGrid() {
  const grid = document.getElementById('properties-grid');
  const emptyState = document.getElementById('properties-empty-state');
  
  // Filter property set
  const filtered = PROPERTIES.filter(prop => {
    // Get translations for location, title, etc.
    const propIdKey = prop.id.replace('-', '');
    const propLang = TRANSLATIONS[currentLang]?.[propIdKey] || TRANSLATIONS.en[propIdKey] || prop;
    const title = propLang.title || prop.title;
    const location = propLang.location || prop.location;
    const description = propLang.description || prop.description;
    const amenities = propLang.amenities || prop.amenities;

    // 1. Search term match (check english and translated)
    const searchLow = activeFilters.search.toLowerCase();
    const matchesSearch = !searchLow || 
      prop.title.toLowerCase().includes(searchLow) ||
      prop.location.toLowerCase().includes(searchLow) ||
      prop.description.toLowerCase().includes(searchLow) ||
      prop.amenities.some(am => am.toLowerCase().includes(searchLow)) ||
      title.toLowerCase().includes(searchLow) ||
      location.toLowerCase().includes(searchLow) ||
      description.toLowerCase().includes(searchLow) ||
      amenities.some(am => am.toLowerCase().includes(searchLow));
      
    // 2. Bedroom count
    const matchesBeds = prop.beds >= parseInt(activeFilters.beds);
    
    // 3. Price limit
    const matchesPrice = prop.price <= activeFilters.maxBudget;
    
    // 4. Typology
    const matchesTypology = activeFilters.typology === 'all' || prop.type === activeFilters.typology;
    
    return matchesSearch && matchesBeds && matchesPrice && matchesTypology;
  });
  
  // Toggle empty status
  if (filtered.length === 0) {
    grid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }
  
  grid.classList.remove('hidden');
  emptyState.classList.add('hidden');
  
  grid.innerHTML = '';
  
  filtered.forEach(prop => {
    const cardEl = document.createElement('div');
    cardEl.className = "bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer flex flex-col h-full";
    cardEl.id = `card-${prop.id}`;
    
    const propIdKey = prop.id.replace('-', '');
    const propLang = TRANSLATIONS[currentLang]?.[propIdKey] || TRANSLATIONS.en[propIdKey] || prop;
    const title = propLang.title || prop.title;
    const location = propLang.location || prop.location;
    const description = propLang.description || prop.description;

    const typLabel = prop.type === 'villa' ? (TRANSLATIONS[currentLang].signatureVilla || 'Signature Villa') : 
                     prop.type === 'penthouse' ? (TRANSLATIONS[currentLang].skyPenthouse || 'Sky Penthouse') :
                     prop.type === 'townhouse' ? (TRANSLATIONS[currentLang].boutiqueTownhouse || 'Boutique Townhouse') : 
                     (TRANSLATIONS[currentLang].boutiqueSuite || 'Boutique Suite');
                     
    const featuredText = currentLang === 'hi' ? 'विशेष' : (currentLang === 'mr' ? 'वैशिष्ट्यीकृत' : 'Featured');
    const detailsButtonText = TRANSLATIONS[currentLang].details || 'Details';

    const bedsText = TRANSLATIONS[currentLang].specBeds.replace('{beds}', prop.beds);
    const bathsText = TRANSLATIONS[currentLang].specBaths.replace('{baths}', prop.baths);
    const sqftText = TRANSLATIONS[currentLang].specSqft.replace('{sqft}', prop.sqft.toLocaleString());

    cardEl.innerHTML = `
      <!-- Image section with overlay -->
      <div class="relative aspect-16/10 bg-neutral-100 overflow-hidden group">
        <img src="${prop.image}" alt="${title}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-in-out select-none" referrerPolicy="no-referrer">
        <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent"></div>
        ${prop.featured ? `
          <span class="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-neutral-950 font-mono text-[9px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-lg border border-white/20 select-none">
            ${featuredText}
          </span>
        ` : ''}
        <span class="absolute top-4 right-4 bg-neutral-950/75 backdrop-blur-md text-white font-mono text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-lg border border-neutral-800 select-none">
          ${typLabel}
        </span>
      </div>
      
      <!-- Copy/Narrative context -->
      <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between items-start gap-4">
            <h3 class="font-display font-medium text-base text-neutral-950 line-clamp-1 flex-grow">${title}</h3>
            <span class="font-display font-semibold text-neutral-950 text-sm flex-shrink-0">${formatPriceINR(prop.price)}</span>
          </div>
          
          <div class="flex items-center gap-1 text-xs text-neutral-500 font-sans">
            <i data-lucide="map-pin" class="h-3.5 w-3.5 text-neutral-400"></i>
            <span class="line-clamp-1">${location}</span>
          </div>
          
          <p class="text-xs font-sans font-light text-neutral-600 line-clamp-2 leading-relaxed pt-1">
            ${description}
          </p>
        </div>
        
        <!-- Bottom specs layout -->
        <div class="pt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
          <div class="flex items-center gap-4">
            <span>${bedsText}</span>
            <span>•</span>
            <span>${bathsText}</span>
            <span>•</span>
            <span>${sqftText}</span>
          </div>
          <button class="text-neutral-950 font-bold group-hover:underline flex items-center gap-1">
            <span>${detailsButtonText}</span>
            <i data-lucide="arrow-right" class="h-3 w-3"></i>
          </button>
        </div>
      </div>
    `;
    
    // Modal open binding
    cardEl.addEventListener('click', () => {
      openPropertyModal(prop);
    });
    
    grid.appendChild(cardEl);
  });
  
  lucide.createIcons();
}

// HANDLE COMPREHENSIVE PROPERTY DETAIL MODAL OPENING
function openPropertyModal(prop) {
  currentlySelectedProperty = prop;
  
  const propIdKey = prop.id.replace('-', '');
  const propLang = TRANSLATIONS[currentLang]?.[propIdKey] || TRANSLATIONS.en[propIdKey] || prop;
  const title = propLang.title || prop.title;
  const location = propLang.location || prop.location;
  const description = propLang.description || prop.description;
  const amenities = propLang.amenities || prop.amenities;

  const modal = document.getElementById('property-modal');
  document.getElementById('modal-image').src = prop.image;
  document.getElementById('modal-price-badge').textContent = formatPriceINR(prop.price);
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-location').textContent = location;
  
  document.getElementById('modal-spec-beds').textContent = TRANSLATIONS[currentLang].specBeds.replace('{beds}', prop.beds);
  document.getElementById('modal-spec-baths').textContent = TRANSLATIONS[currentLang].specBaths.replace('{baths}', prop.baths);
  document.getElementById('modal-spec-sqft').textContent = TRANSLATIONS[currentLang].specSqft.replace('{sqft}', prop.sqft.toLocaleString());
  document.getElementById('modal-spec-year').textContent = TRANSLATIONS[currentLang].specYear.replace('{year}', prop.yearBuilt);
  
  document.getElementById('modal-description').textContent = description;
  
  const typLabel = prop.type === 'villa' ? (TRANSLATIONS[currentLang].signatureVilla || 'Signature Villa') : 
                   prop.type === 'penthouse' ? (TRANSLATIONS[currentLang].skyPenthouse || 'Sky Penthouse') :
                   prop.type === 'townhouse' ? (TRANSLATIONS[currentLang].boutiqueTownhouse || 'Boutique Townhouse') : 
                   (TRANSLATIONS[currentLang].boutiqueSuite || 'Boutique Suite');
                   
  const exPortfolioLabel = currentLang === 'hi' ? 'विशेष पोर्टफोलियो' : (currentLang === 'mr' ? 'खास संग्रह' : 'EXCLUSIVE PORTFOLIO');
  document.getElementById('modal-top-category').textContent = `${exPortfolioLabel} • ${typLabel}`;
  
  // Hydrate custom amenities badges
  const amenitiesContainer = document.getElementById('modal-amenities-container');
  amenitiesContainer.innerHTML = '';
  amenities.forEach(am => {
    const amBadge = document.createElement('div');
    amBadge.className = "flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-200/50 font-sans text-xs text-neutral-700";
    amBadge.innerHTML = `
      <i data-lucide="shield-check" class="h-3.5 w-3.5 text-neutral-900 flex-shrink-0"></i>
      <span>${am}</span>
    `;
    amenitiesContainer.appendChild(amBadge);
  });
  
  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  lucide.createIcons();
}

// CLOSE THE PROPERTY MODAL
function closePropertyModal() {
  const modal = document.getElementById('property-modal');
  modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  document.getElementById('modal-appraisal-form').reset();
  currentlySelectedProperty = null;
}

// UPDATE ACTIVE SEARCH AND SELECTOR BAR FEEDBACK CHIPS
function updateFilterFeedbackRow() {
  const row = document.getElementById('filter-feedback-row');
  const chipList = document.getElementById('active-chips-list');
  const dict = TRANSLATIONS[currentLang];
  
  chipList.innerHTML = '';
  let activeCount = 0;
  
  // Checking search
  if (activeFilters.search) {
    activeCount++;
    const searchLabel = dict.searchKeyword || 'Search';
    addFeedbackChip(searchLabel, `"${activeFilters.search}"`, () => {
      document.getElementById('filter-search-input').value = '';
      activeFilters.search = '';
      onFilterChanged();
    });
  }
  
  // Checking beds
  if (activeFilters.beds > 0) {
    activeCount++;
    const bedsLabel = dict.bedroomsIngress || 'Beds';
    const bedsValueLabel = (dict.bedsCount || '{count}+ Bedrooms').replace('{count}', activeFilters.beds);
    addFeedbackChip(bedsLabel, bedsValueLabel, () => {
      document.getElementById('filter-beds-select').value = '0';
      activeFilters.beds = 0;
      onFilterChanged();
    });
  }
  
  // Checking price limit
  if (activeFilters.maxBudget < 1000000000) {
    activeCount++;
    const budgetLabel = dict.maxBudget || 'Budget';
    const maxValText = currentLang === 'hi' ? `अधिकतम ${formatPriceINR(activeFilters.maxBudget)}` :
                       currentLang === 'mr' ? `जास्तीत जास्त ${formatPriceINR(activeFilters.maxBudget)}` :
                       `Max ${formatPriceINR(activeFilters.maxBudget)}`;
    addFeedbackChip(budgetLabel, maxValText, () => {
      document.getElementById('filter-price-slider').value = '1000000000';
      document.getElementById('slider-price-label').textContent = formatPriceINR(1000000000);
      activeFilters.maxBudget = 1000000000;
      onFilterChanged();
    });
  }
  
  // Checking typology
  if (activeFilters.typology !== 'all') {
    activeCount++;
    const typeLabel = dict.preferredTypologyLabel || 'Type';
    const label = activeFilters.typology === 'villa' ? (dict.villas || 'Villas') :
                  activeFilters.typology === 'penthouse' ? (dict.penthouses || 'Sky Penthouses') :
                  activeFilters.typology === 'townhouse' ? (dict.townhouses || 'Boutique Townhouses') : 
                  (dict.suites || 'Suites');
                  
    addFeedbackChip(typeLabel, label, () => {
      setSelectedTypologyChip('all');
    });
  }
  
  if (activeCount > 0) {
    row.classList.remove('hidden');
    row.classList.add('flex');
  } else {
    row.classList.remove('flex');
    row.classList.add('hidden');
  }
}

// FORMATTED FEEDBACK CHIP CREATOR FOR REMOVING FILTERS INSTANTLY
function addFeedbackChip(dimension, value, onRemove) {
  const chipList = document.getElementById('active-chips-list');
  const chip = document.createElement('div');
  chip.className = "flex items-center gap-1.5 px-2 py-1 bg-white border border-neutral-200 rounded-lg text-[10px] font-mono uppercase text-neutral-800 shadow-3xs";
  chip.innerHTML = `
    <span class="text-neutral-400 font-light">${dimension}:</span>
    <span class="font-semibold">${value}</span>
    <button class="text-neutral-450 hover:text-neutral-900 transition-colors ml-0.5">
      <i data-lucide="x" class="h-3 w-3"></i>
    </button>
  `;
  
  chip.querySelector('button').addEventListener('click', (e) => {
    e.stopPropagation();
    onRemove();
  });
  
  chipList.appendChild(chip);
  lucide.createIcons();
}

// CONVENIENT METHOD TO SET VISUAL TYPOLOGY CHIP SELECTION STATE
function setSelectedTypologyChip(typologyVal) {
  activeFilters.typology = typologyVal;
  
  const buttons = document.querySelectorAll('#typology-chips-container button');
  buttons.forEach(btn => {
    const type = btn.getAttribute('data-type');
    if (type === typologyVal) {
      btn.className = "px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 bg-neutral-900 text-white shadow-xs";
    } else {
      btn.className = "px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 bg-neutral-50 text-neutral-600 hover:bg-neutral-100/80 border border-neutral-200/50";
    }
  });
  
  onFilterChanged();
}

// COMPOSITE TRIGGER ON ANY CONTROL ALTERATION
function onFilterChanged() {
  renderPropertiesGrid();
  updateFilterFeedbackRow();
}

// RESET ALL SEARCH SELECTORS AT ONCE
function resetAllFilters() {
  document.getElementById('filter-search-input').value = '';
  document.getElementById('filter-beds-select').value = '0';
  document.getElementById('filter-price-slider').value = '1000000000';
  document.getElementById('slider-price-label').textContent = formatPriceINR(1000000000);
  
  activeFilters.search = '';
  activeFilters.beds = 0;
  activeFilters.maxBudget = 1000000000;
  
  setSelectedTypologyChip('all');
}


// --- EXECUTING THE ADMIN TERMINAL / INTEL PANEL CONTROLS ---

function toggleAdminTerminal() {
  const container = document.getElementById('agent-panel-container');
  const btn = document.getElementById('admin-toggle-btn');
  
  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
    // Smooth scroll down
    setTimeout(() => {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    btn.innerHTML = `
      <i data-lucide="x" class="h-3.5 w-3.5"></i>
      <span>Exit Terminal</span>
    `;
    renderAdminDatabaseTables();
  } else {
    container.classList.add('hidden');
    btn.innerHTML = `
      <i data-lucide="user-check" class="h-3.5 w-3.5"></i>
      <span>Admin Lounge</span>
    `;
  }
  lucide.createIcons();
}

// RECALCULATE DASHBOARD ANALYTICS COUNTS & LOAD PROGRESS GRAPHICS
function updateAdminTerminalMetrics() {
  const countLeads = document.getElementById('agent-count-leads');
  const countEnquiries = document.getElementById('agent-count-enquiries');
  const countElite = document.getElementById('agent-count-elitetier');
  
  countLeads.textContent = leads.length;
  countEnquiries.textContent = enquiries.length;
  
  // Count leads above 50 Crore or flagged as Tier 1
  const eliteCount = leads.filter(l => l.budget === '₹50 Cr+').length;
  countElite.textContent = eliteCount;
  
  // Unread badge toggles inside the head
  const unreadCount = enquiries.filter(enq => enq.status === 'unread').length;
  const badge = document.getElementById('unread-badge');
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
  
  renderStatisticalSVGs();
}

// RENDER REAL DYNAMIC HORIZONTAL SPARKBARS REPRESENTING DISTRIBUTIONS
function renderStatisticalSVGs() {
  const budgetContainer = document.getElementById('agent-budget-chart');
  const typologyContainer = document.getElementById('agent-typology-chart');
  
  // 1. Budget distributions math
  const tLeads = leads.length || 1;
  const bTiers = [
    { label: '₹50 Cr+ Elite', value: '₹50 Cr+', count: leads.filter(l => l.budget === '₹50 Cr+').length, color: 'bg-neutral-900 border border-neutral-800' },
    { label: '₹20 Cr - ₹50 Cr', value: '₹20 Cr - ₹50 Cr', count: leads.filter(l => l.budget === '₹20 Cr - ₹50 Cr').length, color: 'bg-neutral-750' },
    { label: '₹10 Cr - ₹20 Cr', value: '₹10 Cr - ₹20 Cr', count: leads.filter(l => l.budget === '₹10 Cr - ₹20 Cr').length, color: 'bg-neutral-450' },
    { label: 'Under ₹10 Cr', value: 'Under ₹10 Cr', count: leads.filter(l => l.budget === 'Under ₹10 Cr' || l.budget.toLowerCase().includes('under')).length, color: 'bg-neutral-250' }
  ];
  
  budgetContainer.innerHTML = '';
  bTiers.forEach(tier => {
    const percent = Math.round((tier.count / tLeads) * 100);
    budgetContainer.innerHTML += `
      <div class="space-y-1 text-xs">
        <div class="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase">
          <span>${tier.label}</span>
          <span>${tier.count} (${percent}%)</span>
        </div>
        <div class="w-full bg-neutral-100 h-2 rounded-full overflow-hidden border border-neutral-200/40">
          <div class="${tier.color} h-full rounded-full transition-all duration-700" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  });
  
  // 2. Typology interested math
  const totalSum = leads.length + enquiries.length || 1;
  // Let's count totals from preferences and inquiries
  const vCount = leads.filter(l => l.preferredType === 'villa').length + enquiries.filter(e => e.propertyId === 'prop-1' || e.propertyId === 'prop-4' || e.propertyId === 'prop-6').length;
  const pCount = leads.filter(l => l.preferredType === 'penthouse').length + enquiries.filter(e => e.propertyId === 'prop-2' || e.propertyId === 'prop-3').length;
  const tCount = leads.filter(l => l.preferredType === 'townhouse').length;
  const aCount = leads.filter(l => l.preferredType === 'apartment').length + enquiries.filter(e => e.propertyId === 'prop-5').length;
  
  const typDist = [
    { label: 'Signature Villas', count: vCount, color: 'bg-neutral-900' },
    { label: 'Sky Penthouses', count: pCount, color: 'bg-neutral-750' },
    { label: 'Boutique Townhouses', count: tCount, color: 'bg-neutral-450' },
    { label: 'Private Sanctuaries', count: aCount, color: 'bg-neutral-250' }
  ];
  
  typologyContainer.innerHTML = '';
  typDist.forEach(item => {
    const percent = Math.round((item.count / totalSum) * 100);
    typologyContainer.innerHTML += `
      <div class="space-y-1 text-xs">
        <div class="flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase">
          <span>${item.label}</span>
          <span>${item.count} (${percent}%)</span>
        </div>
        <div class="w-full bg-neutral-100 h-2 rounded-full overflow-hidden border border-neutral-200/40">
          <div class="${item.color} h-full rounded-full transition-all duration-700" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  });
}

// HYDRATE AND MANAGE EXECUTIVES TABLES
function renderAdminDatabaseTables() {
  const tableBody = document.getElementById('agent-leads-table-body');
  const enquiriesList = document.getElementById('agent-enquiries-list');
  
  // Leads table render
  tableBody.innerHTML = '';
  if (leads.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-12 text-center text-neutral-400 font-mono text-xs uppercase tracking-wider bg-neutral-50/20">
          No VIP leads currently on state. Simulate or register new enquiries.
        </td>
      </tr>
    `;
  } else {
    leads.forEach(lead => {
      const typeLabel = lead.preferredType === 'villa' ? 'Signature Villa' : 
                        lead.preferredType === 'penthouse' ? 'Sky Penthouse' :
                        lead.preferredType === 'townhouse' ? 'Townhouse' : 'Boutique Suite';
                        
      const tr = document.createElement('tr');
      tr.className = "hover:bg-neutral-50/50 transition-colors";
      tr.id = `lead-tr-${lead.id}`;
      
      tr.innerHTML = `
        <td class="px-6 py-4">
          <div class="font-sans font-semibold text-neutral-900">${lead.name}</div>
          <div class="font-mono text-[10px] text-neutral-400 mt-0.5 flex flex-col gap-0.5">
            <span>Email: ${lead.email}</span>
            <span>Tel: ${lead.phone}</span>
          </div>
        </td>
        <td class="px-6 py-4">
          <span class="inline-block bg-neutral-150 px-2 py-0.5 text-[9px] font-mono rounded text-neutral-700 uppercase tracking-wide mr-1">${typeLabel}</span>
          <span class="inline-block bg-neutral-900 text-white px-2 py-0.5 text-[9px] font-mono rounded uppercase tracking-wide mr-1">${lead.budget}</span>
        </td>
        <td class="px-6 py-4">
          <button data-lead-id="${lead.id}" class="lead-status-btn px-2 py-1 border rounded-lg text-[10px] font-mono uppercase cursor-pointer tracking-wider transition-all duration-200 ${
            lead.status === 'new' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-emerald-100' 
              : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
          }">
            ${lead.status}
          </button>
        </td>
        <td class="px-6 py-4 text-right">
          <button data-delete-lead="${lead.id}" class="text-neutral-400 hover:text-red-650 p-1 border border-transparent hover:border-neutral-200 rounded-lg transition-colors cursor-pointer">
            <i data-lucide="trash-2" class="h-3.5 w-3.5"></i>
          </button>
        </td>
      `;
      
      // Toggle client contacted status
      tr.querySelector('.lead-status-btn').addEventListener('click', () => {
        lead.status = lead.status === 'new' ? 'contacted' : 'new';
        saveState();
        renderAdminDatabaseTables();
      });
      
      // Delete client record
      tr.querySelector('[data-delete-lead]').addEventListener('click', () => {
        leads = leads.filter(l => l.id !== lead.id);
        saveState();
        renderAdminDatabaseTables();
        const dict = TRANSLATIONS[currentLang];
        triggerToast(dict.toastLeadDeleted || 'Lead Deleted', (dict.toastLeadDeletedSubtitle || 'Secure record of {name} was expunged.').replace('{name}', lead.name), 'success');
      });
      
      tableBody.appendChild(tr);
    });
  }

  // Enquiries listings render
  enquiriesList.innerHTML = '';
  if (enquiries.length === 0) {
    enquiriesList.innerHTML = `
      <div class="p-8 text-center text-neutral-400 font-mono text-xs uppercase tracking-smaller">
        No dynamic live walkthrough tour requests on file
      </div>
    `;
  } else {
    enquiries.forEach(enq => {
      const item = document.createElement('div');
      item.className = `p-5 sm:p-6 transition-colors ${enq.status === 'unread' ? 'bg-orange-50/45 border-l-2 border-orange-500' : 'bg-white'}`;
      item.id = `enq-item-${enq.id}`;
      
      item.innerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-sans font-bold text-neutral-900">${enq.name}</span>
              <span class="text-[10px] text-neutral-400">•</span>
              <span class="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">${enq.date}</span>
              ${enq.status === 'unread' ? `
                <span class="bg-orange-100 text-orange-700 text-[8px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded leading-none">Tour Unread</span>
              ` : ''}
            </div>
            
            <p class="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
              Asset: <span class="text-neutral-900 font-sans font-semibold normal-case">${enq.propertyTitle}</span>
            </p>
            
            <p class="text-xs text-neutral-700 italic border-l-2 border-neutral-250 pl-3 leading-relaxed py-1">
              "${enq.message}"
            </p>
            
            <div class="flex flex-col gap-0.5 pt-1 text-[10px] font-mono text-neutral-400 uppercase">
              <span>Coordinates: ${enq.email}</span>
              <span>Direct Link Line: ${enq.phone}</span>
            </div>
          </div>
          
          <div class="flex sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0 items-end">
            ${enq.status === 'unread' ? `
              <button data-read-enq="${enq.id}" class="w-full sm:w-auto px-2.5 py-1.5 bg-neutral-950 text-white hover:bg-neutral-850 text-[10px] font-mono uppercase rounded-lg transition-colors cursor-pointer">
                Commit Read
              </button>
            ` : `
              <span class="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
                <i data-lucide="check-circle" class="h-3 w-3 text-emerald-500"></i> Reviewed
              </span>
            `}
            <button data-delete-enq="${enq.id}" class="w-full sm:w-auto p-1.5 border border-neutral-200 text-neutral-400 hover:text-red-650 rounded-lg transition-all cursor-pointer">
              <i data-lucide="trash-2" class="h-3.5 w-3.5"></i>
            </button>
          </div>
        </div>
      `;
      
      // Click mark read
      const readBtn = item.querySelector('[data-read-enq]');
      if (readBtn) {
        readBtn.addEventListener('click', () => {
          enq.status = 'read';
          saveState();
          renderAdminDatabaseTables();
        });
      }
      
      // Click delete walkthrough
      item.querySelector('[data-delete-enq]').addEventListener('click', () => {
        enquiries = enquiries.filter(e => e.id !== enq.id);
        saveState();
        renderAdminDatabaseTables();
        const dict = TRANSLATIONS[currentLang];
        triggerToast(dict.toastRequestExpunged || 'Request Expunged', dict.toastRequestExpungedSubtitle || 'The selected tour coordination log has been archived.', 'success');
      });
      
      enquiriesList.appendChild(item);
    });
  }
  
  lucide.createIcons();
}

// SIMULATE INBOUND VIP LEADS TO SYSTEM
const SIMULATED_POOL = [
  { name: 'Aditya Birla', email: 'aditya.birla@familyoffice.com', phone: '+91 91000 85850', preferredType: 'villa', budget: '₹50 Cr+', message: 'Looking for coastal plot development recommendations, privacy is of utmost concern.' },
  { name: 'Radhika Jindal', email: 'radhika@jindal-global.co.in', phone: '+91 99343 12555', preferredType: 'penthouse', budget: '₹20 Cr - ₹50 Cr', message: 'Seeking an architectural sky deck penthouse suite ready-to-move for immediate relocation.' },
  { name: 'Dr. Sandeep Nair', email: 'dr.sandeep@nairheart.in', phone: '+91 92224 45678', preferredType: 'villa', budget: 'Under ₹10 Cr', message: 'Needs organic gardens layout with standard solar configuration.' },
  { name: 'Pankaj Kapur', email: 'pankaj@kapur-vistas.com', phone: '+91 97765 44000', preferredType: 'townhouse', budget: '₹10 Cr - ₹20 Cr', message: 'Direct inspection requested for modern loft style properties.' },
  { name: 'Meenakshi Iyer', email: 'meenakshi@iyer-capital.com', phone: '+91 98881 11330', preferredType: 'apartment', budget: '₹20 Cr - ₹50 Cr', message: 'Looking for family office asset diversification.' }
];

function triggerInboundSimulations() {
  const randLead = SIMULATED_POOL[Math.floor(Math.random() * SIMULATED_POOL.length)];
  
  // Verify if lead name is already on database
  if (leads.some(l => l.name === randLead.name)) {
    const dict = TRANSLATIONS[currentLang];
    triggerToast(dict.toastSimPoolExhausted || 'Secure Terminal Info', dict.toastSimPoolSubtitle || 'Simulated pool was exhausted. Register client inquiries directly.', 'info');
    return;
  }
  
  // Add lead
  const dateStr = new Date().toISOString().split('T')[0];
  const newLead = {
    id: `lead-sim-${Date.now()}`,
    name: randLead.name,
    email: randLead.email,
    phone: randLead.phone,
    preferredType: randLead.preferredType,
    budget: randLead.budget,
    date: dateStr,
    status: 'new'
  };
  
  leads.unshift(newLead);
  
  // Optional add walkthrough enquiry matching random property
  const randProp = PROPERTIES[Math.floor(Math.random() * PROPERTIES.length)];
  const newEnq = {
    id: `enq-sim-${Date.now()}`,
    name: randLead.name,
    email: randLead.email,
    phone: randLead.phone,
    message: randLead.message,
    propertyId: randProp.id,
    propertyTitle: randProp.title,
    date: dateStr,
    status: 'unread'
  };
  
  enquiries.unshift(newEnq);
  saveState();
  renderAdminDatabaseTables();
  
  const dict = TRANSLATIONS[currentLang];
  triggerToast(dict.toastInboundCapture || 'Live Inbound Capture', (dict.toastInboundSubtitle || 'Simulated record for {name} captured successfully!').replace('{name}', randLead.name), 'success');
}


// --- FORM SUBMISSIONS HANDLERS ---

// Hero Form Capture
function handleHeroFormSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('hero-form-name').value.trim();
  const email = document.getElementById('hero-form-email').value.trim();
  const phone = document.getElementById('hero-form-phone').value.trim();
  const preferredType = document.getElementById('hero-form-type').value;
  const budget = document.getElementById('hero-form-budget').value;
  
  const newLead = {
    id: `lead-usr-${Date.now()}`,
    name,
    email,
    phone,
    preferredType,
    budget,
    date: new Date().toISOString().split('T')[0],
    status: 'new'
  };
  
  leads.unshift(newLead);
  saveState();
  
  // Reset
  document.getElementById('hero-inquiry-form').reset();
  const dict = TRANSLATIONS[currentLang];
  triggerToast(dict.toastInquiryCatalogued || 'Inquiry Catalogued', (dict.toastInquirySubtitle || 'Thank you {name}. Representative coordinates are locked.').replace('{name}', name), 'success');
}

// Newsletter Gated Form
function handleNewsletterSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('newsletter-email-input').value.trim();
  const name = email.split('@')[0];
  
  const newLead = {
    id: `lead-news-${Date.now()}`,
    name: `Registry Recipient (${name})`,
    email,
    phone: 'Direct Newsletter Signup',
    preferredType: 'villa',
    budget: 'Under ₹20 Cr',
    date: new Date().toISOString().split('T')[0],
    status: 'new'
  };
  
  leads.unshift(newLead);
  saveState();
  
  document.getElementById('newsletter-form').reset();
  const dict = TRANSLATIONS[currentLang];
  triggerToast(dict.toastGatedCleared || 'Gated Access Cleared', (dict.toastGatedSubtitle || 'Gated PDF brochure will be delivered to {email}.').replace('{email}', email), 'success');
}

// Modal Walkthrough Appraisal Form
function handleModalAppraisalSubmit(e) {
  e.preventDefault();
  
  if (!currentlySelectedProperty) return;
  
  const name = document.getElementById('modal-form-name').value.trim();
  const email = document.getElementById('modal-form-email').value.trim();
  const phone = document.getElementById('modal-form-phone').value.trim();
  const message = document.getElementById('modal-form-message').value.trim();
  
  const dateStr = new Date().toISOString().split('T')[0];
  const itemID = `enq-usr-${Date.now()}`;
  
  // Save walkthrough enquiry
  const newEnq = {
    id: itemID,
    name,
    email,
    phone,
    message,
    propertyId: currentlySelectedProperty.id,
    propertyTitle: currentlySelectedProperty.title,
    date: dateStr,
    status: 'unread'
  };
  
  enquiries.unshift(newEnq);
  
  // Also list to general database leads table
  const newLead = {
    id: `lead-usr-${Date.now()}`,
    name,
    email,
    phone,
    preferredType: currentlySelectedProperty.type,
    // Formulating estimated bracket
    budget: currentlySelectedProperty.price >= 500000000 ? '₹50 Cr+' : 
            currentlySelectedProperty.price >= 200000000 ? '₹20 Cr - ₹50 Cr' : '₹10 Cr - ₹20 Cr',
    date: dateStr,
    status: 'new'
  };
  
  leads.unshift(newLead);
  saveState();
  
  // Close and success reset
  closePropertyModal();
  const dict = TRANSLATIONS[currentLang];
  const propTitle = TRANSLATIONS[currentLang]?.[currentlySelectedProperty.id]?.title || currentlySelectedProperty.title;
  triggerToast(dict.toastAppraisalRegistered || 'Appraisal Registered', (dict.toastAppraisalSubtitle || 'Your secure tour itinerary requested for {title} is queued.').replace('{title}', propTitle), 'success');
}


// --- DOM EVENT HOOKUPS & INIT ---

document.addEventListener('DOMContentLoaded', () => {
  // Initialize to last set language (calls rendering grids, configurations and metrics)
  setLanguage(currentLang);
  
  // Bind Language selector toggle
  const langMenuBtn = document.getElementById('lang-menu-btn');
  const langDropMenu = document.getElementById('lang-dropdown-menu');
  if (langMenuBtn && langDropMenu) {
    langMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropMenu.classList.toggle('hidden');
    });
    // Click outside to close language menu
    window.addEventListener('click', () => {
      langDropMenu.classList.add('hidden');
    });
  }

  // Desktop Lang Select
  const btnEn = document.getElementById('lang-select-en');
  if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
  const btnHi = document.getElementById('lang-select-hi');
  if (btnHi) btnHi.addEventListener('click', () => setLanguage('hi'));
  const btnMr = document.getElementById('lang-select-mr');
  if (btnMr) btnMr.addEventListener('click', () => setLanguage('mr'));

  // Mobile Lang Select
  const mobEn = document.getElementById('mob-lang-btn-en');
  if (mobEn) mobEn.addEventListener('click', () => setLanguage('en'));
  const mobHi = document.getElementById('mob-lang-btn-hi');
  if (mobHi) mobHi.addEventListener('click', () => setLanguage('hi'));
  const mobMr = document.getElementById('mob-lang-btn-mr');
  if (mobMr) mobMr.addEventListener('click', () => setLanguage('mr'));
  
  // Bind form submissions
  document.getElementById('hero-inquiry-form').addEventListener('submit', handleHeroFormSubmit);
  document.getElementById('newsletter-form').addEventListener('submit', handleNewsletterSubmit);
  document.getElementById('modal-appraisal-form').addEventListener('submit', handleModalAppraisalSubmit);
  
  // Bind simple Search and Dropdowns
  document.getElementById('filter-search-input').addEventListener('input', (e) => {
    activeFilters.search = e.target.value.trim();
    onFilterChanged();
  });
  
  document.getElementById('filter-beds-select').addEventListener('change', (e) => {
    activeFilters.beds = parseInt(e.target.value);
    onFilterChanged();
  });
  
  // Slider pricing bind
  document.getElementById('filter-price-slider').addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    activeFilters.maxBudget = val;
    
    // Label formatting
    const priceText = formatPriceINR(val);
    document.getElementById('slider-price-label').textContent = priceText;
    onFilterChanged();
  });
  
  // Bind Typology selector buttons
  const typoButtons = document.querySelectorAll('#typology-chips-container button');
  typoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      setSelectedTypologyChip(type);
    });
  });
  
  // Reset control
  document.getElementById('reset-filters-btn').addEventListener('click', resetAllFilters);
  document.getElementById('active-chips-reset').addEventListener('click', resetAllFilters);
  document.getElementById('empty-state-reset-btn').addEventListener('click', resetAllFilters);
  
  // Modal close trigger
  document.getElementById('modal-close-btn').addEventListener('click', closePropertyModal);
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('property-modal');
    if (e.target === modal) {
      closePropertyModal();
    }
  });
  
  // Admin triggers bind
  document.getElementById('admin-toggle-btn').addEventListener('click', toggleAdminTerminal);
  document.getElementById('agent-close-btn').addEventListener('click', toggleAdminTerminal);
  document.getElementById('agent-generate-leads-btn').addEventListener('click', triggerInboundSimulations);
  
  // Mobile drop nav trigger
  const mobBtn = document.getElementById('mobile-menu-btn');
  const mobDrop = document.getElementById('mobile-dropdown-nav');
  const openIcon = document.getElementById('menu-icon-open');
  const closeIcon = document.getElementById('menu-icon-close');
  
  mobBtn.addEventListener('click', () => {
    if (mobDrop.classList.contains('hidden')) {
      mobDrop.classList.remove('hidden');
      openIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    } else {
      mobDrop.classList.add('hidden');
      openIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }
  });
  
  // Clean viewport triggers
  const mobLinks = mobDrop.querySelectorAll('a');
  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobDrop.classList.add('hidden');
      openIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });
  
  // Render Lucide icons on start
  lucide.createIcons();
});
