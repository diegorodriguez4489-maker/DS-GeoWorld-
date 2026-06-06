const Weather = (() => {
  async function getWeather(lat, lon, cityName) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se pudo obtener el clima para este país.');
    const data = await res.json();
    return { ...data.current, cityName };
  }

  function describeWeatherCode(code) {
    const codes = {
      0: 'Despejado ☀️',
      1: 'Mayormente despejado 🌤️',
      2: 'Parcialmente nublado ⛅',
      3: 'Nublado ☁️',
      45: 'Neblina 🌫️',
      48: 'Neblina con helada 🌫️',
      51: 'Llovizna ligera 🌦️',
      53: 'Llovizna moderada 🌦️',
      55: 'Llovizna densa 🌧️',
      61: 'Lluvia ligera 🌧️',
      63: 'Lluvia moderada 🌧️',
      65: 'Lluvia intensa 🌧️',
      71: 'Nevada ligera ❄️',
      73: 'Nevada moderada ❄️',
      75: 'Nevada intensa ❄️',
      80: 'Chubascos ligeros 🌦️',
      81: 'Chubascos moderados 🌧️',
      82: 'Chubascos violentos ⛈️',
      95: 'Tormenta eléctrica ⛈️',
      99: 'Tormenta con granizo ⛈️',
    };
    return codes[code] || 'Clima variable 🌈';
  }

  function renderWeatherCard(w) {
    const desc = describeWeatherCode(w.weather_code);
    return `
      <div class="weather-card card">
        <div class="weather-header">
          <h3 class="section-subtitle">🌍 Clima en ${w.cityName}</h3>
        </div>
        <div class="weather-grid">
          <div class="weather-item">
            <div class="weather-icon">🌡️</div>
            <div class="weather-value">${w.temperature_2m}°C</div>
            <div class="weather-label">Temperatura</div>
          </div>
          <div class="weather-item">
            <div class="weather-icon">💧</div>
            <div class="weather-value">${w.relative_humidity_2m}%</div>
            <div class="weather-label">Humedad</div>
          </div>
          <div class="weather-item">
            <div class="weather-icon">💨</div>
            <div class="weather-value">${w.wind_speed_10m} km/h</div>
            <div class="weather-label">Viento</div>
          </div>
          <div class="weather-item weather-desc">
            <div class="weather-icon">🌤️</div>
            <div class="weather-value weather-desc-text">${desc}</div>
            <div class="weather-label">Condición</div>
          </div>
        </div>
      </div>
    `;
  }

  return { getWeather, renderWeatherCard };
})();
