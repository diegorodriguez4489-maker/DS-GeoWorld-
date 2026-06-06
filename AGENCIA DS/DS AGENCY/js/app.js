
const App = (() => {
  let currentCountry = null;
  let currentAttractions = [];
 
  function init() {
    const darkMode = Storage.getDarkMode();
    if (darkMode) document.body.classList.add('dark');
 
    const user = Storage.getUser();
    if (!user) {
      showModal('register-modal');
    } else {
      renderDashboard();
      renderHistory();
      renderFavorites();
    }
 
    document.getElementById('dark-toggle').addEventListener('click', toggleDarkMode);
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSearch();
    });
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('convert-btn').addEventListener('click', handleCurrencyConvert);
 
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.dataset.section;
        navigateTo(target);
      });
    });
 
    document.getElementById('hamburger').addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('open');
    });
 
    navigateTo('search-section');
  }
 
  function navigateTo(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');
    const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (link) link.classList.add('active');
    document.querySelector('.nav-links').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    Storage.setDarkMode(isDark);
    document.getElementById('dark-toggle').textContent = isDark ? '☀️' : '🌙';
  }
 
  function showModal(id) {
    document.getElementById(id).classList.add('visible');
  }
 
  function hideModal(id) {
    document.getElementById(id).classList.remove('visible');
  }
 
  function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const country = document.getElementById('reg-country').value.trim();
    if (!name || !email || !country) {
      showError('reg-error', 'Por favor completa todos los campos.');
      return;
    }
    Storage.saveUser({ name, email, country });
    hideModal('register-modal');
    renderDashboard();
    renderHistory();
    renderFavorites();
  }
 
  async function handleSearch() {
    const input = document.getElementById('search-input').value.trim();
    if (!input) {
      showNotification('Por favor ingresa el nombre de un país.', 'warning');
      return;
    }
    showLoader(true);
    clearResults();
    try {
      const country = await Countries.searchCountry(input);
      currentCountry = country;
      Storage.addHistory(country.name.common);
 
      const favCountries = Storage.getFavoriteCountries();
      const isFav = favCountries.some(f => f.cca3 === country.cca3);
 
      document.getElementById('country-result').innerHTML = Countries.renderCountryCard(country, isFav);
 
      const lat = country.latlng?.[0] || 0;
      const lon = country.latlng?.[1] || 0;
      const capital = country.capital?.[0] || country.name.common;
 
      const [weatherData, attractionsData] = await Promise.allSettled([
        Weather.getWeather(lat, lon, capital),
        Tourism.getAttractions(lat, lon, country.cca2, country.name.common, capital),
      ]);
 
      if (weatherData.status === 'fulfilled') {
        document.getElementById('weather-result').innerHTML = Weather.renderWeatherCard(weatherData.value);
      } else {
        document.getElementById('weather-result').innerHTML = errorCard(weatherData.reason.message);
      }
 
      if (attractionsData.status === 'fulfilled') {
        currentAttractions = attractionsData.value;
        renderAttractions(currentAttractions);
      } else {
        document.getElementById('tourism-result').innerHTML = errorCard(attractionsData.reason.message);
      }
 
      renderDashboard();
      renderHistory();
      navigateTo('search-section');
      showNotification(`✈️ ${country.name.common} cargado exitosamente.`, 'success');
    } catch (err) {
      document.getElementById('country-result').innerHTML = errorCard(err.message);
    } finally {
      showLoader(false);
    }
  }
 
  function renderAttractions(attractions) {
    const favAttractions = Storage.getFavoriteAttractions();
    const html = attractions.map(a => {
      const isFav = favAttractions.some(f => f.xid === a.xid);
      return Tourism.renderAttractionCard(a, isFav);
    }).join('');
    document.getElementById('tourism-result').innerHTML = `
      <h3 class="section-subtitle">🗺️ Atracciones Turísticas</h3>
      <div class="attractions-grid">${html}</div>
    `;
  }
 
  function clearResults() {
    document.getElementById('country-result').innerHTML = '';
    document.getElementById('weather-result').innerHTML = '';
    document.getElementById('tourism-result').innerHTML = '';
    document.getElementById('currency-result').innerHTML = '';
  }
 
  function renderDashboard() {
    const user = Storage.getUser();
    if (!user) return;
    document.getElementById('dash-name').textContent = user.name;
    document.getElementById('dash-searches').textContent = Storage.getSearchCount();
    document.getElementById('dash-fav-countries').textContent = Storage.getFavoriteCountries().length;
    document.getElementById('dash-fav-attractions').textContent = Storage.getFavoriteAttractions().length;
    document.getElementById('user-greeting').textContent = `Bienvenido, ${user.name}`;
    document.getElementById('user-greeting').style.display = 'block';
  }
 
  function renderHistory() {
    const history = Storage.getHistory();
    const container = document.getElementById('history-list');
    if (!history.length) {
      container.innerHTML = '<p class="empty-msg">No hay búsquedas registradas aún.</p>';
      return;
    }
    container.innerHTML = history.map(h => `
      <div class="history-item">
        <span class="history-country">🌍 ${h.country}</span>
        <span class="history-meta">${h.date} — ${h.time}</span>
      </div>
    `).join('');
  }
 
  function renderFavorites() {
    const favCountries = Storage.mostrarFavoritos('country');
    const favAttractions = Storage.mostrarFavoritos('attraction');
 
    const countriesContainer = document.getElementById('fav-countries-list');
    if (!favCountries.length) {
      countriesContainer.innerHTML = '<p class="empty-msg">No tienes países favoritos aún.</p>';
    } else {
      countriesContainer.innerHTML = favCountries.map(c => `
        <div class="fav-item card">
          <div class="fav-flag-wrap">
            <img src="${c.flags?.svg || ''}" alt="${c.name.common}" class="fav-flag" onerror="this.style.display='none'">
          </div>
          <div class="fav-info">
            <strong>${c.name.common}</strong>
            <span>${c.capital?.[0] || ''} · ${c.region || ''}</span>
          </div>
          <button class="btn btn-danger btn-xs" onclick="App.removeFavCountry('${c.cca3}')">✕</button>
        </div>
      `).join('');
    }
 
    const attractionsContainer = document.getElementById('fav-attractions-list');
    if (!favAttractions.length) {
      attractionsContainer.innerHTML = '<p class="empty-msg">No tienes atracciones guardadas aún.</p>';
    } else {
      attractionsContainer.innerHTML = favAttractions.map(a => `
        <div class="fav-item card">
          <img src="" class="img-placeholder fav-attraction-img" alt="${a.name || 'Atracción'}">
          <div class="fav-info">
            <strong>${a.name || 'Sin nombre'}</strong>
            <span>${Tourism.getCategoryLabel(a.kinds)}</span>
          </div>
          <button class="btn btn-danger btn-xs" onclick="App.removeFavAttraction('${a.xid}')">✕</button>
        </div>
      `).join('');
    }
  }
 
  function addFavCountry(cca3) {
    if (!currentCountry || currentCountry.cca3 !== cca3) return;
    const added = Storage.agregarFavorito('country', currentCountry);
    if (added) {
      showNotification('País agregado a favoritos ♥', 'success');
    } else {
      showNotification('Este país ya está en favoritos.', 'warning');
    }
    const favCountries = Storage.getFavoriteCountries();
    const isFav = favCountries.some(f => f.cca3 === currentCountry.cca3);
    document.getElementById('country-result').innerHTML = Countries.renderCountryCard(currentCountry, isFav);
    renderFavorites();
    renderDashboard();
  }
 
  function removeFavCountry(cca3) {
    Storage.eliminarFavorito('country', cca3);
    showNotification('País eliminado de favoritos.', 'info');
    if (currentCountry && currentCountry.cca3 === cca3) {
      document.getElementById('country-result').innerHTML = Countries.renderCountryCard(currentCountry, false);
    }
    renderFavorites();
    renderDashboard();
  }
 
  function addFavAttraction(xid) {
    const attraction = currentAttractions.find(a => a.xid === xid);
    if (!attraction) return;
    const added = Storage.agregarFavorito('attraction', attraction);
    if (added) {
      showNotification('Atracción guardada ♥', 'success');
    } else {
      showNotification('Esta atracción ya está guardada.', 'warning');
    }
    renderAttractions(currentAttractions);
    renderFavorites();
    renderDashboard();
  }
 
  function removeFavAttraction(xid) {
    Storage.eliminarFavorito('attraction', xid);
    showNotification('Atracción eliminada de favoritos.', 'info');
    renderAttractions(currentAttractions);
    renderFavorites();
    renderDashboard();
  }
 
  async function handleCurrencyConvert() {
    const amount = parseFloat(document.getElementById('currency-amount').value);
    const from = document.getElementById('currency-from').value;
    const to = document.getElementById('currency-to').value;
    if (isNaN(amount) || amount <= 0) {
      showError('currency-error', 'Ingresa una cantidad válida mayor a 0.');
      return;
    }
    document.getElementById('currency-error').textContent = '';
    showLoader(true);
    try {
      const result = await Currency.convert(amount, from, to);
      document.getElementById('currency-result').innerHTML = Currency.renderConverterResult(result);
    } catch (err) {
      showError('currency-error', err.message);
    } finally {
      showLoader(false);
    }
  }
 
  function showLoader(visible) {
    document.getElementById('global-loader').style.display = visible ? 'flex' : 'none';
  }
 
  function showNotification(msg, type = 'info') {
    const n = document.getElementById('notification');
    n.textContent = msg;
    n.className = `notification visible ${type}`;
    clearTimeout(n._timeout);
    n._timeout = setTimeout(() => n.classList.remove('visible'), 3500);
  }
 
  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
 
  function errorCard(msg) {
    return `<div class="error-card"><span class="error-icon">⚠️</span><p>${msg}</p></div>`;
  }
 
  return {
    init,
    addFavCountry,
    removeFavCountry,
    addFavAttraction,
    removeFavAttraction,
    navigateTo,
  };
})();
 
document.addEventListener('DOMContentLoaded', App.init);
