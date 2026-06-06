const Tourism = (() => {
 
  // Lista estática de atracciones famosas por país (cca2 code)
  // Usada como fallback si Wikipedia no devuelve resultados
  const KNOWN_ATTRACTIONS = {
    FR: ['Eiffel Tower', 'Louvre Museum', 'Palace of Versailles', 'Notre-Dame Cathedral', 'Mont Saint-Michel'],
    JP: ['Mount Fuji', 'Fushimi Inari Shrine', 'Tokyo Skytree', 'Hiroshima Peace Memorial', 'Senso-ji Temple'],
    IT: ['Colosseum', 'Leaning Tower of Pisa', 'Vatican Museums', 'Trevi Fountain', 'Uffizi Gallery'],
    ES: ['Sagrada Familia', 'Alhambra', 'Park Güell', 'Prado Museum', 'Plaza Mayor Madrid'],
    DE: ['Brandenburg Gate', 'Neuschwanstein Castle', 'Cologne Cathedral', 'Berlin Wall Memorial', 'Hofbräuhaus Munich'],
    GB: ['Big Ben', 'Tower of London', 'Stonehenge', 'Buckingham Palace', 'Edinburgh Castle'],
    US: ['Statue of Liberty', 'Grand Canyon', 'Yellowstone National Park', 'Golden Gate Bridge', 'Niagara Falls'],
    CN: ['Great Wall of China', 'Forbidden City', 'Terracotta Army', 'West Lake', 'Li River'],
    IN: ['Taj Mahal', 'Red Fort', 'Jaipur City Palace', 'Varanasi Ghats', 'Hampi'],
    BR: ['Christ the Redeemer', 'Iguazu Falls', 'Amazon Rainforest', 'Copacabana Beach', 'Pantanal'],
    MX: ['Chichen Itza', 'Teotihuacan', 'Palenque', 'Guanajuato Historic City', 'Copper Canyon'],
    EG: ['Pyramids of Giza', 'Sphinx', 'Valley of the Kings', 'Karnak Temple', 'Abu Simbel'],
    GR: ['Acropolis of Athens', 'Santorini', 'Meteora', 'Delphi', 'Olympia'],
    PE: ['Machu Picchu', 'Nazca Lines', 'Cusco Historic Center', 'Lake Titicaca', 'Chan Chan'],
    AR: ['Iguazu Falls', 'Perito Moreno Glacier', 'Recoleta Cemetery', 'Ushuaia', 'Buenos Aires Obelisk'],
    CO: ['Cartagena Walled City', 'Ciudad Perdida', 'Coffee Cultural Landscape', 'Caño Cristales', 'Salt Cathedral of Zipaquirá'],
    TH: ['Wat Phra Kaew', 'Ayutthaya', 'Phi Phi Islands', 'Chiang Mai Old City', 'Khao Yai National Park'],
    AU: ['Sydney Opera House', 'Great Barrier Reef', 'Uluru', 'Sydney Harbour Bridge', 'Great Ocean Road'],
    ZA: ['Table Mountain', 'Kruger National Park', 'Cape of Good Hope', 'Robben Island', 'Garden Route'],
    TR: ['Hagia Sophia', 'Cappadocia', 'Ephesus', 'Pamukkale', 'Topkapi Palace'],
    PT: ['Belém Tower', 'Pena Palace', 'Jerónimos Monastery', 'Douro Valley', 'Algarve Cliffs'],
    NL: ['Rijksmuseum', 'Anne Frank House', 'Keukenhof Gardens', 'Van Gogh Museum', 'Windmills of Kinderdijk'],
    RU: ['Red Square', 'Hermitage Museum', 'Trans-Siberian Railway', 'Lake Baikal', 'Peterhof Palace'],
    BO: ['Salar de Uyuni', 'Tiwanaku', 'Lake Titicaca', 'Valle de la Luna', 'Potosí Historic City'],
    CL: ['Torres del Paine', 'Easter Island', 'Atacama Desert', 'Valle de la Luna Chile', 'Chiloé Island'],
    VE: ['Angel Falls', 'Roraima', 'Los Roques Archipelago', 'Mérida Cable Car', 'Canaima National Park'],
    EC: ['Galápagos Islands', 'Quito Historic Center', 'Ingapirca', 'Quilotoa Lagoon', 'Cotopaxi Volcano'],
    CU: ['Old Havana', 'Viñales Valley', 'Trinidad Historic Center', 'Varadero Beach', 'Cienfuegos'],
    MA: ['Medina of Marrakech', 'Fes el-Bali', 'Sahara Desert', 'Atlas Mountains', 'Chefchaouen'],
    KE: ['Maasai Mara', 'Amboseli National Park', 'Mount Kenya', 'Lamu Old Town', 'Tsavo National Park'],
    ID: ['Borobudur', 'Komodo Island', 'Ubud Bali', 'Prambanan', 'Raja Ampat'],
    NZ: ['Fiordland National Park', 'Rotorua', 'Queenstown', 'Bay of Islands', 'Abel Tasman'],
    CA: ['Niagara Falls', 'Banff National Park', 'CN Tower', 'Old Quebec City', 'Whistler'],
    SE: ['Vasa Museum', 'ABBA Museum', 'Gamla Stan Stockholm', 'Icehotel Jukkasjärvi', 'Drottningholm Palace'],
    NO: ['Fjords of Norway', 'Northern Lights Tromsø', 'Bryggen Bergen', 'Viking Ship Museum', 'Preikestolen'],
    IS: ['Blue Lagoon', 'Golden Circle', 'Northern Lights', 'Jökulsárlón Glacier Lagoon', 'Geysir'],
  };
 
  const CATEGORY_BY_KEYWORD = [
    { keywords: ['museum', 'gallery', 'art'], label: '🖼️ Museo' },
    { keywords: ['temple', 'shrine', 'cathedral', 'mosque', 'church', 'monastery', 'chapel'], label: '⛪ Religioso' },
    { keywords: ['castle', 'palace', 'fort', 'fortress', 'tower'], label: '🏰 Histórico' },
    { keywords: ['park', 'garden', 'forest', 'nature', 'lake', 'river', 'mountain', 'volcano', 'lagoon', 'falls', 'glacier'], label: '🌿 Natural' },
    { keywords: ['beach', 'island', 'coast', 'bay', 'coral', 'reef'], label: '🏖️ Playa/Isla' },
    { keywords: ['ruins', 'archaeological', 'ancient', 'historic', 'heritage', 'wall', 'pyramid'], label: '🏛️ Histórico' },
    { keywords: ['bridge', 'tower', 'building', 'architecture', 'skyscraper'], label: '🏗️ Arquitectura' },
    { keywords: ['desert', 'canyon', 'cave', 'valley', 'cliff'], label: '🌄 Paisaje' },
  ];
 
  function getCategoryLabel(name) {
    if (!name) return '📍 Atracción';
    const lower = name.toLowerCase();
    for (const { keywords, label } of CATEGORY_BY_KEYWORD) {
      if (keywords.some(k => lower.includes(k))) return label;
    }
    return '📍 Lugar de interés';
  }
 
  // Busca artículos de Wikipedia relacionados con atracciones del país
  async function searchWikipediaAttractions(countryName, capital) {
    const queries = [
      `tourist attractions ${countryName}`,
      `landmarks ${capital}`,
    ];
 
    const allTitles = new Set();
 
    for (const q of queries) {
      try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=10&format=json&origin=*`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        (data.query?.search || []).forEach(r => allTitles.add(r.title));
      } catch { /* ignorar */ }
    }
 
    return [...allTitles].slice(0, 8);
  }
 
  // Obtiene resumen de Wikipedia para un título
  async function getWikiSummary(title) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.type === 'disambiguation' || !data.extract) return null;
      return {
        xid: title.replace(/\s+/g, '_'),
        name: data.title,
        kinds: title, // usamos el título para detectar categoría
        wikipedia_extracts: { text: data.extract },
        preview: data.thumbnail ? { source: data.thumbnail.source } : null,
        image: data.originalimage?.source || null,
      };
    } catch {
      return null;
    }
  }
 
  async function getAttractions(lat, lon, countryCode, countryName, capital) {
    // 1. Intentar con Wikipedia search
    try {
      const titles = await searchWikipediaAttractions(countryName || '', capital || '');
      if (titles.length > 0) {
        const details = await Promise.allSettled(titles.map(t => getWikiSummary(t)));
        const valid = details
          .filter(r => r.status === 'fulfilled' && r.value)
          .map(r => r.value)
          .filter(a => a.name && a.name.trim() !== '');
        if (valid.length >= 3) return valid.slice(0, 8);
      }
    } catch { /* continuar con fallback */ }
 
    // 2. Fallback: lista estática conocida
    const known = KNOWN_ATTRACTIONS[countryCode] || KNOWN_ATTRACTIONS[countryCode?.toUpperCase()];
    if (known && known.length > 0) {
      const details = await Promise.allSettled(known.map(t => getWikiSummary(t)));
      const valid = details
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => r.value)
        .filter(a => a.name && a.name.trim() !== '');
      if (valid.length > 0) return valid.slice(0, 8);
    }
 
    // 3. Búsqueda genérica por nombre de país
    try {
      const fallbackTitles = await searchWikipediaAttractions(countryName || '', '');
      if (fallbackTitles.length > 0) {
        const details = await Promise.allSettled(fallbackTitles.map(t => getWikiSummary(t)));
        const valid = details
          .filter(r => r.status === 'fulfilled' && r.value)
          .map(r => r.value)
          .filter(a => a.name && a.name.trim() !== '');
        if (valid.length > 0) return valid.slice(0, 8);
      }
    } catch { /* ignorar */ }
 
    throw new Error('No se encontraron atracciones para este destino.');
  }
 
  function getImageUrl(attr) {
    if (attr.preview?.source) return attr.preview.source;
    if (attr.image) return attr.image;
    return null;
  }
 
  function renderAttractionCard(attr, isFav) {
    const name = attr.name || 'Sin nombre';
    const category = getCategoryLabel(attr.name);
    const desc = attr.wikipedia_extracts?.text
      ? attr.wikipedia_extracts.text.substring(0, 220) + '...'
      : 'Sin descripción disponible.';
    const xid = attr.xid;
    const imgUrl = getImageUrl(attr);
 
    const imgTag = imgUrl
      ? `<img src="${imgUrl}" class="attraction-real-img" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    const placeholder = `<div class="img-placeholder attraction-placeholder" style="${imgUrl ? 'display:none' : ''}"><span>🏛️</span></div>`;
 
    const favBtn = isFav
      ? `<button class="btn btn-danger btn-xs" onclick="App.removeFavAttraction('${xid}')">✕ Quitar</button>`
      : `<button class="btn btn-accent btn-xs" onclick="App.addFavAttraction('${xid}')">♥ Guardar</button>`;
 
    return `
      <div class="attraction-card card" data-xid="${xid}">
        <div class="attraction-img-wrap">
          ${imgTag}
          ${placeholder}
          <span class="attraction-category-badge">${category}</span>
        </div>
        <div class="attraction-body">
          <h4 class="attraction-name">${name}</h4>
          <p class="attraction-desc">${desc}</p>
          <div class="card-actions">
            ${favBtn}
          </div>
        </div>
      </div>
    `;
  }
 
  return { getAttractions, renderAttractionCard, getCategoryLabel };
})();