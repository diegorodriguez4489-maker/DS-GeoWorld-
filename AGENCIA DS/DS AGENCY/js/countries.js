const Countries = (() => {
  const BASE_URL = 'https://restcountries.com/v3.1';

  async function searchCountry(name) {
    const res = await fetch(`${BASE_URL}/name/${encodeURIComponent(name)}?fullText=false`);
    if (!res.ok) throw new Error('País no encontrado. Verifica el nombre e intenta nuevamente.');
    const data = await res.json();
    return data[0];
  }

  function getCurrencies(currencies) {
    if (!currencies) return 'No disponible';
    return Object.values(currencies)
      .map(c => `${c.name} (${c.symbol || ''})`)
      .join(', ');
  }

  function getLanguages(languages) {
    if (!languages) return 'No disponible';
    return Object.values(languages).join(', ');
  }

  function formatPopulation(pop) {
    return pop.toLocaleString('es-CO');
  }

  function renderCountryCard(country, isFavorite) {
    const currencies = getCurrencies(country.currencies);
    const languages = getLanguages(country.languages);
    const population = formatPopulation(country.population);
    const capital = country.capital ? country.capital[0] : 'No disponible';
    const favBtn = isFavorite
      ? `<button class="btn btn-danger btn-sm" onclick="App.removeFavCountry('${country.cca3}')">
          <span class="icon">✕</span> Quitar de favoritos
        </button>`
      : `<button class="btn btn-accent btn-sm" onclick="App.addFavCountry('${country.cca3}')">
          <span class="icon">♥</span> Agregar a favoritos
        </button>`;

    return `
      <div class="country-card card" data-cca3="${country.cca3}">
        <div class="country-flag-wrap">
          <img src="${country.flags?.svg || ''}" class="country-flag" alt="Bandera de ${country.name.common}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="img-placeholder flag-placeholder" style="display:none">
            <span>🏳</span>
          </div>
        </div>
        <div class="country-info">
          <h2 class="country-name">${country.name.common}</h2>
          <p class="country-official">${country.name.official}</p>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Capital</span>
              <span class="info-value">${capital}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Región</span>
              <span class="info-value">${country.region || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Subregión</span>
              <span class="info-value">${country.subregion || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Población</span>
              <span class="info-value">${population}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Moneda</span>
              <span class="info-value">${currencies}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Idiomas</span>
              <span class="info-value">${languages}</span>
            </div>
          </div>
          <div class="card-actions">
            ${favBtn}
          </div>
        </div>
      </div>
    `;
  }

  return { searchCountry, renderCountryCard, getCurrencies, getLanguages };
})();
