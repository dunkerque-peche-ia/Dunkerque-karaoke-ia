// Database initialization and state management
const DEFAULT_EVENTS = [
  {
    id: "e1",
    title: "Le Car Podium des Flandres - Karaoké de l'Esplanade",
    city: "bray-dunes",
    venue: "Place de l'Esplanade",
    address: "Digue de Mer, Bray-Dunes",
    date: "2026-07-28",
    time: "18:00",
    description: "L'incontournable tournée des plages s'arrête à Bray-Dunes ! Venez chanter en plein air sur la digue face à la mer. Ambiance familiale, sono pro et écran géant.",
    vibe: "Plein Air / Populaire",
    lat: 51.0825,
    lng: 2.5188,
    type: "outdoor"
  },
  {
    id: "e2",
    title: "Soirée Chants et Pizza à La Dune à l'Envers",
    city: "bray-dunes",
    venue: "La Dune à l'Envers",
    address: "Digue de Mer, Bray-Dunes",
    date: "2026-07-24",
    time: "20:00",
    description: "Une délicieuse pizza croustillante face à la mer, une bière locale bien fraîche et un micro ouvert pour chanter tous vos tubes préférés !",
    vibe: "Convivial / Digue de Mer",
    lat: 51.0820,
    lng: 2.5190,
    type: "restaurant"
  },
  {
    id: "e3",
    title: "Soirée Moules-Frites & Karaoké",
    city: "gravelines",
    venue: "La Taverne du Jean-Bart",
    address: "Espace Tourville, Gravelines",
    date: "2026-07-25",
    time: "19:30",
    description: "Chaque week-end d'été, joignez-vous à l'équipage du Jean-Bart pour un repas festif animé par notre DJ Karaoké. Ambiance corsaire garantie !",
    vibe: "Taverne / Chaleureux",
    lat: 50.9856,
    lng: 2.1254,
    type: "restaurant"
  },
  {
    id: "e4",
    title: "Summer Pop Live & Karaoké",
    city: "gravelines",
    venue: "Le Palm Beach",
    address: "Boulevard de la Plage, Gravelines",
    date: "2026-07-31",
    time: "21:00",
    description: "Grand karaoké estival au bord de l'eau. Ambiance cocktail, pop, rock et variété française. Micro sans fil de qualité pro.",
    vibe: "Plage / Festif",
    lat: 51.0112,
    lng: 2.1150,
    type: "bar"
  },
  {
    id: "e5",
    title: "Session Karaoké Box 100% Privée",
    city: "dunkerque",
    venue: "Alkasar Bar Karaoke",
    address: "12 Rue de la Cunette, Dunkerque",
    date: "2026-07-26",
    time: "18:00",
    description: "L'Alkasar est le temple du karaoké à Dunkerque. Louez une box privative pour chanter en toute intimité entre amis ou rejoignez le bar principal.",
    vibe: "100% Karaoké / Privé",
    lat: 51.0375,
    lng: 2.3785,
    type: "bar"
  },
  {
    id: "e6",
    title: "Karaoké du Port & Burgers",
    city: "dunkerque",
    venue: "A l'Abordage",
    address: "Quai de la Citadelle, Dunkerque",
    date: "2026-07-24",
    time: "21:30",
    description: "Quoi de mieux qu'un bon burger au bord des quais avant de donner de la voix sur les plus grands hits des années 80 ? Rejoignez-nous ce vendredi !",
    vibe: "Port / Années 80",
    lat: 51.0335,
    lng: 2.3712,
    type: "restaurant"
  },
  {
    id: "e7",
    title: "Lundi Acoustique & Micro Ouvert",
    city: "gravelines",
    venue: "Café de la Marine",
    address: "Rue du Port, Gravelines",
    date: "2026-07-27",
    time: "20:30",
    description: "Démarrez la semaine en douceur avec notre soirée micro ouvert et acoustique. Chantez accompagné d'une guitare ou d'un piano !",
    vibe: "Acoustique / Chill",
    lat: 50.9902,
    lng: 2.1215,
    type: "bar"
  },
  {
    id: "e8",
    title: "Karaoké Kids & Familles de l'Albeck",
    city: "bray-dunes",
    venue: "Maison de Quartier de l'Albeck",
    address: "Rue Albert 1er, Bray-Dunes",
    date: "2026-07-29",
    time: "15:00",
    description: "Session spéciale de croque-karaoké l'après-midi pour les enfants et les parents. Crêpes, boissons et chansons Disney et Pop !",
    vibe: "Famille / Convivial",
    lat: 51.0725,
    lng: 2.5160,
    type: "outdoor"
  },
  {
    id: "e9",
    title: "Warmup Karaoké Jeudi Étudiant",
    city: "dunkerque",
    venue: "Le Ride",
    address: "Digue de Mer, Dunkerque",
    date: "2026-07-30",
    time: "21:00",
    description: "Le rendez-vous des étudiants et des jeunes chanteurs avant le week-end. Tarifs préférentiels sur les cocktails et micro ouvert non-stop.",
    vibe: "Jeune / Énergique",
    lat: 51.0485,
    lng: 2.3995,
    type: "bar"
  }
];

// Current Date representation: Friday, July 24, 2026
const CURRENT_DATE_STR = "2026-07-24";
const CURRENT_DATE = new Date(CURRENT_DATE_STR);

let events = [];
let map;
let markersGroup;
let activeFilters = {
  city: "all",
  date: "all"
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Global error listener to display errors in the chat for debugging
  window.onerror = function(message, source, lineno, colno, error) {
    console.error(message, error);
    addBotMessage(`⚠️ <b>Erreur Système (JS) :</b> ${message}<br><small>Fichier: ${source}:${lineno}</small>`);
    return false;
  };

  loadEvents();
  try {
    initMap();
  } catch (err) {
    console.error("Map initialization failed:", err);
    addBotMessage(`⚠️ <b>Erreur d'initialisation de la carte :</b> ${err.message}`);
  }
  setupUIEventListeners();
  renderEvents();
  updateGeminiStatus();
  
  // Recalculate map dimensions on browser window resize
  window.addEventListener("resize", () => {
    if (map) {
      map.invalidateSize();
    }
  });
  
  // Add initial welcome message
  addBotMessage("Salut ! 🎤 Je suis ton assistant IA Karaoké. Je peux t'aider à trouver les meilleures soirées pour chanter à Bray-Dunes, Gravelines et Dunkerque.<br><br>Pose-moi des questions comme :<br>• <i>\"Où chanter ce soir ?\"</i><br>• <i>\"Des soirées ce week-end à Gravelines ?\"</i><br>• <i>\"Quels sont les karaokés à Bray-Dunes ?\"</i>");
});

// Load Events from LocalStorage or Defaults
function loadEvents() {
  const stored = localStorage.getItem("karaoke_events");
  if (stored) {
    events = JSON.parse(stored);
    
    // Replace old closed La Maison de la Dune (e2) with the active La Dune à l'Envers
    const oldIndex = events.findIndex(e => e.id === "e2" && e.venue === "La Maison de la Dune");
    if (oldIndex !== -1) {
      events[oldIndex] = {
        id: "e2",
        title: "Soirée Chants et Pizza à La Dune à l'Envers",
        city: "bray-dunes",
        venue: "La Dune à l'Envers",
        address: "Digue de Mer, Bray-Dunes",
        date: "2026-07-24",
        time: "20:00",
        description: "Une délicieuse pizza croustillante face à la mer, une bière locale bien fraîche et un micro ouvert pour chanter tous vos tubes préférés !",
        vibe: "Convivial / Digue de Mer",
        lat: 51.0820,
        lng: 2.5190,
        type: "restaurant"
      };
      localStorage.setItem("karaoke_events", JSON.stringify(events));
    }
    
    // Dynamic merge: add any default event that is not present in the localStorage cache
    let changed = false;
    DEFAULT_EVENTS.forEach(defEv => {
      if (!events.some(e => e.id === defEv.id)) {
        events.push(defEv);
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem("karaoke_events", JSON.stringify(events));
    }
  } else {
    events = [...DEFAULT_EVENTS];
    localStorage.setItem("karaoke_events", JSON.stringify(events));
  }
}

// Save custom event
function saveCustomEvent(newEvent) {
  events.push(newEvent);
  localStorage.setItem("karaoke_events", JSON.stringify(events));
  renderEvents();
  try {
    updateMapMarkers();
  } catch (err) {
    addBotMessage(`⚠️ <b>Erreur de mise à jour de la carte :</b> ${err.message}`);
  }
}

// Map Initialization
function initMap() {
  // Center between Gravelines and Bray-Dunes (near Dunkirk)
  map = L.map('map', {
    center: [51.03, 2.32],
    zoom: 11,
    zoomControl: true
  });

  // Load OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  markersGroup = L.layerGroup().addTo(map);
  updateMapMarkers();
  
  // Force map layout computation after short delay (fixes size 0 issue in CSS grids)
  setTimeout(() => {
    map.invalidateSize();
  }, 250);
}

// Update Map Markers based on filtered events
function updateMapMarkers() {
  markersGroup.clearLayers();
  
  const filtered = getFilteredEvents();
  
  filtered.forEach(event => {
    // Define marker color based on city
    let colorClass = "neon-marker-purple";
    if (event.city === "bray-dunes") colorClass = "neon-marker-pink";
    if (event.city === "gravelines") colorClass = "neon-marker-cyan";

    const customIcon = L.divIcon({
      html: `<div class="map-neon-dot ${colorClass}"></div>`,
      className: 'custom-leaflet-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const popupContent = `
      <div style="font-family: 'Outfit', sans-serif; min-width: 180px;">
        <h3 style="margin: 0 0 5px 0; font-size: 1.05rem; color: #00f0ff;">${event.title}</h3>
        <p style="margin: 0 0 5px 0; font-weight: 500; font-size: 0.85rem;"><i class="fas fa-map-marker-alt" style="color: #ff007f;"></i> ${event.venue} (${event.city})</p>
        <p style="margin: 0 0 10px 0; font-size: 0.8rem; color: #a5a1b8;">📅 ${formatFrenchDate(event.date)} à ${event.time}</p>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}" target="_blank" style="color: #ff007f; text-decoration: none; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><i class="fas fa-directions"></i> Y aller (itinéraire)</a>
      </div>
    `;

    const marker = L.marker([event.lat, event.lng], { icon: customIcon })
      .bindPopup(popupContent);
    
    // Add custom field to easily reference markers later
    marker.eventId = event.id;
    markersGroup.addLayer(marker);
  });
}

// Format French Date
function formatFrenchDate(dateStr) {
  const d = new Date(dateStr);
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  let formatted = d.toLocaleDateString('fr-FR', options);
  // Capitalize first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Helper to filter events
function getFilteredEvents() {
  return events.filter(event => {
    // City filter
    if (activeFilters.city !== "all" && event.city !== activeFilters.city) {
      return false;
    }
    
    // Date filter
    if (activeFilters.date !== "all") {
      const eventDate = new Date(event.date);
      const diffTime = eventDate - CURRENT_DATE;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (activeFilters.date === "today") {
        if (event.date !== CURRENT_DATE_STR) return false;
      } else if (activeFilters.date === "weekend") {
        // Weekend is Friday (0 days diff), Saturday (1 day), Sunday (2 days)
        if (diffDays < 0 || diffDays > 2) return false;
      } else if (activeFilters.date === "summer") {
        // Summer 2026 (July and August)
        const month = eventDate.getMonth(); // 6 = July, 7 = August
        if (eventDate.getFullYear() !== 2026 || (month !== 6 && month !== 7)) return false;
      }
    }
    
    return true;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Render events in the grid
function renderEvents() {
  const container = document.getElementById("events-grid");
  const countSpan = document.getElementById("events-count");
  const filtered = getFilteredEvents();
  
  countSpan.textContent = `${filtered.length} soirée${filtered.length > 1 ? 's' : ''}`;
  container.innerHTML = "";
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-panel" style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-secondary);">
        <i class="fas fa-microphone-slash" style="font-size: 2rem; margin-bottom: 1rem; color: var(--neon-pink);"></i>
        <p>Aucune soirée karaoké ne correspond aux critères sélectionnés.</p>
        <button class="btn-primary" style="margin: 1rem auto 0 auto;" onclick="resetFilters()">Réinitialiser les filtres</button>
      </div>
    `;
    return;
  }
  
  filtered.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.id = `card-${event.id}`;
    
    const cityClass = event.city === "bray-dunes" ? "bray-dunes" : (event.city === "gravelines" ? "gravelines" : "dunkerque");
    const cityLabel = event.city === "bray-dunes" ? "Bray-Dunes" : (event.city === "gravelines" ? "Gravelines" : "Dunkerque");
    
    card.innerHTML = `
      <div class="event-card-header">
        <span class="event-city ${cityClass}">${cityLabel}</span>
        <span class="event-vibe">${event.vibe}</span>
      </div>
      <div class="event-card-body">
        <h3 class="event-title">${event.title}</h3>
        <div class="event-venue">
          <i class="fas fa-map-marker-alt"></i>
          <span>${event.venue} — <span style="font-size: 0.8rem; color: var(--text-secondary);">${event.address}</span></span>
        </div>
        <p class="event-desc">${event.description}</p>
      </div>
      <div class="event-card-footer">
        <span class="event-date">
          <i class="far fa-calendar-alt"></i>
          <span>${formatFrenchDate(event.date)}</span>
        </span>
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn-card-action" onclick="focusEventOnMap('${event.id}', ${event.lat}, ${event.lng})" title="Situer sur la carte">Voir</button>
          <a class="btn-card-action" href="https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}" target="_blank" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem;"><i class="fas fa-directions"></i> Y aller</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Helper to open a popup by event ID
function openMarkerPopup(eventId) {
  if (markersGroup) {
    markersGroup.eachLayer(layer => {
      if (layer.eventId === eventId) {
        layer.openPopup();
      }
    });
  }
}

// Focus on an event on map and scroll to its card
window.focusEventOnMap = function(eventId, lat, lng) {
  try {
    if (!map) {
      throw new Error("La carte n'est pas initialisée.");
    }
    
    const dashboard = document.querySelector(".dashboard-panel");
    const mapWasHidden = !dashboard.classList.contains("map-active");
    
    if (mapWasHidden) {
      dashboard.classList.add("map-active");
      map.invalidateSize();
    }
    
    const targetLatLng = L.latLng(lat, lng);
    
    // Brief timeout to let grid display transition/compute before animating Leaflet
    setTimeout(() => {
      map.invalidateSize();
      
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      
      // Check if map is already centered on target coordinates and zoom is 14 (within 20 meters)
      const isAlreadyCentered = currentCenter.distanceTo(targetLatLng) < 20 && currentZoom === 14;
      
      if (isAlreadyCentered) {
        // If already centered, open popup immediately
        openMarkerPopup(eventId);
      } else {
        // If not centered, wait for panning animation to end, then open popup
        map.once('moveend', () => {
          openMarkerPopup(eventId);
        });
        map.flyTo(targetLatLng, 14, {
          animate: true,
          duration: 1.2
        });
      }
    }, mapWasHidden ? 150 : 50);

    // Highlight card
    const cards = document.querySelectorAll(".event-card");
    cards.forEach(c => c.classList.remove("highlight"));
    
    const selectedCard = document.getElementById(`card-${eventId}`);
    if (selectedCard) {
      selectedCard.classList.add("highlight");
      selectedCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } catch (err) {
    console.error("focusEventOnMap error:", err);
    addBotMessage(`⚠️ <b>Erreur Système :</b> Impossible de situer l'événement. Détails: ${err.message}`);
  }
};

// Global action called from Gemini AI Chatbot HTML response
window.highlightEvent = function(eventId) {
  const event = events.find(e => e.id === eventId);
  if (event) {
    window.focusEventOnMap(event.id, event.lat, event.lng);
  }
};

// Reset all filters
window.resetFilters = function() {
  activeFilters.city = "all";
  activeFilters.date = "all";
  
  // Reset active UI state
  document.querySelectorAll("[data-filter-city]").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filterCity === "all");
  });
  document.querySelectorAll("[data-filter-date]").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filterDate === "all");
  });
  
  renderEvents();
  updateMapMarkers();
};

// UI Event Listeners setup
function setupUIEventListeners() {
  // Close map modal listener
  const mapModal = document.getElementById("map-modal");
  const closeMapModal = document.getElementById("close-map-modal");
  closeMapModal.addEventListener("click", () => {
    mapModal.classList.remove("active");
  });

  // Filter chips
  document.querySelectorAll("[data-filter-city]").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("[data-filter-city]").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilters.city = chip.dataset.filterCity;
      renderEvents();
      updateMapMarkers();
    });
  });

  document.querySelectorAll("[data-filter-date]").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("[data-filter-date]").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilters.date = chip.dataset.filterDate;
      renderEvents();
      updateMapMarkers();
    });
  });

  // Chat Submission
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addUserMessage(message);
    chatInput.value = "";
    
    // Trigger AI response
    triggerAIResponse(message);
  });

  // Modals open/close
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettings = document.getElementById("close-settings");
  
  settingsBtn.addEventListener("click", () => {
    document.getElementById("api-key-input").value = localStorage.getItem("gemini_api_key") || "";
    settingsModal.classList.add("active");
  });
  
  closeSettings.addEventListener("click", () => {
    settingsModal.classList.remove("active");
  });

  const saveSettingsBtn = document.getElementById("save-settings");
  saveSettingsBtn.addEventListener("click", () => {
    const key = document.getElementById("api-key-input").value.trim();
    if (key) {
      localStorage.setItem("gemini_api_key", key);
    } else {
      localStorage.removeItem("gemini_api_key");
    }
    updateGeminiStatus();
    settingsModal.classList.remove("active");
    addBotMessage("Paramètres enregistrés ! " + (key ? "Connexion active avec l'API Gemini 1.5. 🚀" : "Moteur IA configuré en local."));
  });

  // Event creation modal
  const addEventBtn = document.getElementById("add-event-btn");
  const eventModal = document.getElementById("event-modal");
  const closeEvent = document.getElementById("close-event");

  addEventBtn.addEventListener("click", () => {
    eventModal.classList.add("active");
  });

  closeEvent.addEventListener("click", () => {
    eventModal.classList.remove("active");
  });

  const eventForm = document.getElementById("event-form");
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title = document.getElementById("event-title-input").value.trim();
    const city = document.getElementById("event-city-select").value;
    const venue = document.getElementById("event-venue-input").value.trim();
    const address = document.getElementById("event-address-input").value.trim();
    const date = document.getElementById("event-date-input").value;
    const time = document.getElementById("event-time-input").value;
    const vibe = document.getElementById("event-vibe-input").value.trim();
    const description = document.getElementById("event-desc-input").value.trim();
    
    // Lat / Lng mocks based on cities
    let lat = 51.03;
    let lng = 2.32;
    if (city === "bray-dunes") {
      lat = 51.077 + (Math.random() - 0.5) * 0.01;
      lng = 2.521 + (Math.random() - 0.5) * 0.01;
    } else if (city === "gravelines") {
      lat = 50.99 + (Math.random() - 0.5) * 0.02;
      lng = 2.12 + (Math.random() - 0.5) * 0.01;
    } else { // dunkerque
      lat = 51.035 + (Math.random() - 0.5) * 0.02;
      lng = 2.37 + (Math.random() - 0.5) * 0.03;
    }

    const newEvent = {
      id: "custom-" + Date.now(),
      title,
      city,
      venue,
      address,
      date,
      time,
      description,
      vibe,
      lat,
      lng,
      type: "restaurant"
    };

    saveCustomEvent(newEvent);
    eventForm.reset();
    eventModal.classList.remove("active");
    
    addBotMessage(`Félicitations ! 🎉 La soirée <b>"${title}"</b> à ${city === "bray-dunes" ? "Bray-Dunes" : (city === "gravelines" ? "Gravelines" : "Dunkerque")} a bien été enregistrée et ajoutée sur la carte.`);
  });

  // Clicking outside modal closes it
  window.addEventListener("click", (e) => {
    if (e.target === settingsModal) settingsModal.classList.remove("active");
    if (e.target === eventModal) eventModal.classList.remove("active");
    if (e.target === mapModal) mapModal.classList.remove("active");
  });
}

// Update UI Gemini Status Connection
function updateGeminiStatus() {
  const statusDot = document.getElementById("chat-status-dot");
  const hasKey = !!localStorage.getItem("gemini_api_key");
  
  if (hasKey) {
    statusDot.classList.add("connected");
    statusDot.setAttribute("title", "Connecté à l'API Gemini");
  } else {
    statusDot.classList.remove("connected");
    statusDot.setAttribute("title", "IA Locale active");
  }
}

// Chat UI rendering helpers
function addUserMessage(text) {
  const messagesContainer = document.getElementById("chat-messages");
  const msg = document.createElement("div");
  msg.className = "message user";
  
  const time = new Date().toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
  msg.innerHTML = `${escapeHtml(text)}<span class="message-time">${time}</span>`;
  
  messagesContainer.appendChild(msg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addBotMessage(htmlContent) {
  const messagesContainer = document.getElementById("chat-messages");
  const msg = document.createElement("div");
  msg.className = "message bot";
  
  const time = new Date().toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
  msg.innerHTML = `${htmlContent}<span class="message-time">${time}</span>`;
  
  messagesContainer.appendChild(msg);
  
  // Smooth scroll to the start of the new bot response instead of the very bottom
  setTimeout(() => {
    messagesContainer.scrollTo({
      top: msg.offsetTop - 15,
      behavior: "smooth"
    });
  }, 50);
}

function showTypingIndicator() {
  const messagesContainer = document.getElementById("chat-messages");
  const indicator = document.createElement("div");
  indicator.className = "message bot typing-container";
  indicator.id = "typing-indicator";
  indicator.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messagesContainer.appendChild(indicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.remove();
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// AI Engine router
async function triggerAIResponse(userMessage) {
  showTypingIndicator();
  
  const apiKey = localStorage.getItem("gemini_api_key");
  
  if (apiKey) {
    try {
      await callGeminiAPI(userMessage, apiKey);
    } catch (err) {
      console.error(err);
      removeTypingIndicator();
      addBotMessage("⚠️ <i>Erreur lors de la communication avec l'API Gemini. Le moteur local prend le relais. Vérifie ta clé API dans les paramètres.</i>");
      showTypingIndicator();
      setTimeout(() => {
        runLocalAI(userMessage);
      }, 800);
    }
  } else {
    // Delay to make it feel natural
    setTimeout(() => {
      runLocalAI(userMessage);
    }, 1200);
  }
}

// Local Matcher IA Engine
function runLocalAI(userQuery) {
  removeTypingIndicator();
  const query = userQuery.toLowerCase();
  
  let response = "";
  let matches = [];
  
  // Analyse sémantique locale
  const isBrayDunes = query.includes("bray") || query.includes("dune");
  const isGravelines = query.includes("grave") || query.includes("jean");
  const isDunkerque = query.includes("dunk") || query.includes("alkasar") || query.includes("abordage");
  
  const isCeSoir = query.includes("soir") || query.includes("aujourd") || query.includes("vendredi");
  const isWeekend = query.includes("week") || query.includes("samedi") || query.includes("dimanche");
  
  // Search matching events
  events.forEach(e => {
    let matchCity = false;
    let matchDate = false;
    
    if (isBrayDunes && e.city === "bray-dunes") matchCity = true;
    if (isGravelines && e.city === "gravelines") matchCity = true;
    if (isDunkerque && e.city === "dunkerque") matchCity = true;
    
    // If no city mentioned, we match any city
    if (!isBrayDunes && !isGravelines && !isDunkerque) {
      matchCity = true;
    }
    
    // Dates mapping
    const eventDate = new Date(e.date);
    const diffTime = eventDate - CURRENT_DATE;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (isCeSoir && e.date === CURRENT_DATE_STR) matchDate = true;
    if (isWeekend && (diffDays >= 0 && diffDays <= 2)) matchDate = true;
    
    // If no date mentioned, we match any date
    if (!isCeSoir && !isWeekend) {
      matchDate = true;
    }
    
    if (matchCity && matchDate) {
      matches.push(e);
    }
  });

  // Build local reply
  if (query.includes("bonjour") || query.includes("salut") || query.includes("coucou") || query.includes("hello")) {
    response = "Bonjour ! Comment puis-je t'aider aujourd'hui ? Tu cherches une soirée à Bray-Dunes ou à Gravelines ?";
  } else if (matches.length > 0) {
    response = `J'ai trouvé <b>${matches.length} soirée(s)</b> correspondant à ta recherche :<br><br>`;
    
    matches.forEach(e => {
      const cityLabel = e.city === "bray-dunes" ? "Bray-Dunes" : (e.city === "gravelines" ? "Gravelines" : "Dunkerque");
      response += `• <b>${e.title}</b> à ${cityLabel} (${e.venue})<br>`;
      response += `📅 Le ${formatFrenchDate(e.date)} à ${e.time}<br>`;
      response += `<button class="btn-card-action" style="margin: 5px 2px 15px 0; padding: 2px 8px; font-size:0.75rem;" onclick="highlightEvent('${e.id}')">🎯 Voir</button> `;
      response += `<a class="btn-card-action" style="margin: 5px 2px 15px 0; padding: 2px 8px; font-size:0.75rem; text-decoration: none; display: inline-block;" href="https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}" target="_blank"><i class="fas fa-directions"></i> Y aller</a><br>`;
    });
    
    response += "Clique sur les boutons ci-dessus pour situer les événements sur la carte ou lancer un itinéraire.";
  } else {
    response = "Je n'ai pas trouvé d'événement correspondant précisément à tes critères. N'hésite pas à réinitialiser les filtres à droite ou à zoomer sur la carte pour voir toutes les soirées de la côte !<br><br><i>Astuce: Si tu es connecté à l'API Gemini via les paramètres (icône d'engrenage), je serai beaucoup plus intelligent dans mes réponses !</i>";
  }
  
  addBotMessage(response);
}

// Live Gemini API Connector
async function callGeminiAPI(userQuery, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  // Format local database of events for prompt context
  const dbContext = events.map(e => ({
    id: e.id,
    titre: e.title,
    ville: e.city,
    lieu: e.venue,
    adresse: e.address,
    date: e.date,
    heure: e.time,
    description: e.description,
    ambiance: e.vibe
  }));

  const systemInstructions = `
Tu es un assistant IA expert et enthousiaste en événementiel et karaoké dans la région de Dunkerque, Bray-Dunes et Gravelines.
La date actuelle de référence est : Vendredi 24 Juillet 2026.
Voici la base de données des soirées karaoké actuellement disponibles dans la région (au format JSON) :
${JSON.stringify(dbContext, null, 2)}

L'utilisateur te pose cette question : "${userQuery}"

Instructions impératives pour ta réponse :
1. Réponds en français avec un ton festif, dynamique, amical et accueillant. Tutoyez l'utilisateur si cela s'y prête.
2. Analyse la question : s'il cherche une ville (ex: Gravelines, Bray-Dunes) ou une date (ce soir, ce week-end, été 2026), mets en avant les événements correspondants.
3. Si un événement de la base de données correspond à sa recherche, tu DOIS ABSOLUMENT insérer dans ton texte les deux boutons HTML exacts côte à côte : 
   <button class="btn-card-action" style="margin: 5px 2px; font-size: 0.8rem; font-family: 'Outfit', sans-serif;" onclick="highlightEvent('ID_DE_LEVENEMENT')">🎯 Situer</button>
   <a class="btn-card-action" style="margin: 5px 2px; font-size: 0.8rem; font-family: 'Outfit', sans-serif; text-decoration: none; display: inline-block;" href="https://www.google.com/maps/dir/?api=1&destination=LATITUDE,LONGITUDE" target="_blank">🗺️ Y aller</a>
   Remplace ID_DE_LEVENEMENT par la valeur exacte du champ "id" de l'événement (ex: e1, e2, custom-12345...), et LATITUDE,LONGITUDE par la latitude et longitude de l'événement (ex: 51.0825,2.5188). C'est une fonctionnalité très premium de l'application !
4. Reste clair et utilise des puces ou du texte en gras pour structurer ta réponse.
5. Si aucun événement ne correspond précisément, suggère l'Alkasar à Dunkerque (qui est ouvert toute l'année) ou invite l'utilisateur à créer son propre événement en utilisant le bouton "Ajouter une soirée".
  `;

  const payload = {
    contents: [
      {
        parts: [
          { text: systemInstructions }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  let replyText = "";
  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
    replyText = data.candidates[0].content.parts[0].text;
  } else {
    throw new Error("Invalid response format from Gemini API");
  }
  
  removeTypingIndicator();
  
  // Format markdown lists and bold elements to HTML to display in bubble
  const formattedHtml = formatMarkdownToHtml(replyText);
  addBotMessage(formattedHtml);
}

// Simple parser to convert basic Markdown (Gemini response) to HTML for chat display
function formatMarkdownToHtml(mdText) {
  let html = mdText;
  
  // Convert double asterisks to strong
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert single asterisks to italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert newlines to breaks, avoiding breaks right after HTML tags if possible
  html = html.replace(/\n/g, '<br>');
  
  // Format markdown lists (ex: "* Item" or "- Item")
  html = html.replace(/(?:^|<br>)\s*[\*\-]\s+(.*?)(?=<br>|$)/g, '$&'); // Placeholder
  // Let's do a simpler bullet point replace
  html = html.replace(/<br>\s*[\*\-]\s+/g, '<br>• ');
  html = html.replace(/^[\*\-]\s+/g, '• ');
  
  return html;
}
