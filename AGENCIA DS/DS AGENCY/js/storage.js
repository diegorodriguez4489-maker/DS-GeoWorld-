const Storage = (() => {
  const KEYS = {
    USER: 'tpp_user',
    FAVORITES_COUNTRIES: 'tpp_fav_countries',
    FAVORITES_ATTRACTIONS: 'tpp_fav_attractions',
    HISTORY: 'tpp_history',
    DARK_MODE: 'tpp_dark_mode',
  };

  function getUser() {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  function saveUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  function getFavoriteCountries() {
    const data = localStorage.getItem(KEYS.FAVORITES_COUNTRIES);
    return data ? JSON.parse(data) : [];
  }

  function agregarFavorito(type, item) {
    if (type === 'country') {
      const favs = getFavoriteCountries();
      const exists = favs.find(f => f.cca3 === item.cca3);
      if (!exists) {
        favs.push(item);
        localStorage.setItem(KEYS.FAVORITES_COUNTRIES, JSON.stringify(favs));
        return true;
      }
      return false;
    } else if (type === 'attraction') {
      const favs = getFavoriteAttractions();
      const exists = favs.find(f => f.xid === item.xid);
      if (!exists) {
        favs.push(item);
        localStorage.setItem(KEYS.FAVORITES_ATTRACTIONS, JSON.stringify(favs));
        return true;
      }
      return false;
    }
  }

  function eliminarFavorito(type, id) {
    if (type === 'country') {
      let favs = getFavoriteCountries();
      favs = favs.filter(f => f.cca3 !== id);
      localStorage.setItem(KEYS.FAVORITES_COUNTRIES, JSON.stringify(favs));
    } else if (type === 'attraction') {
      let favs = getFavoriteAttractions();
      favs = favs.filter(f => f.xid !== id);
      localStorage.setItem(KEYS.FAVORITES_ATTRACTIONS, JSON.stringify(favs));
    }
  }

  function getFavoriteAttractions() {
    const data = localStorage.getItem(KEYS.FAVORITES_ATTRACTIONS);
    return data ? JSON.parse(data) : [];
  }

  function mostrarFavoritos(type) {
    if (type === 'country') return getFavoriteCountries();
    if (type === 'attraction') return getFavoriteAttractions();
    return [];
  }

  function getHistory() {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  }

  function addHistory(countryName) {
    const history = getHistory();
    const now = new Date();
    history.unshift({
      country: countryName,
      date: now.toLocaleDateString('es-CO'),
      time: now.toLocaleTimeString('es-CO'),
    });
    if (history.length > 20) history.pop();
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  }

  function getDarkMode() {
    return localStorage.getItem(KEYS.DARK_MODE) === 'true';
  }

  function setDarkMode(val) {
    localStorage.setItem(KEYS.DARK_MODE, val);
  }

  function getSearchCount() {
    return getHistory().length;
  }

  return {
    getUser,
    saveUser,
    getFavoriteCountries,
    getFavoriteAttractions,
    agregarFavorito,
    eliminarFavorito,
    mostrarFavoritos,
    getHistory,
    addHistory,
    getDarkMode,
    setDarkMode,
    getSearchCount,
  };
})();
