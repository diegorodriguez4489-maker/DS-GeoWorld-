const Currency = (() => {
  const APIS = [
    {
      name: 'frankfurter',
      fetch: async (amount, from, to) => {
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
        if (!res.ok) throw new Error('Frankfurter error');
        const data = await res.json();
        return { amount, from, to, result: data.rates[to], rate: data.rates[to] / amount };
      }
    },
    {
      name: 'exchangerate',
      fetch: async (amount, from, to) => {
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        if (!res.ok) throw new Error('ExchangeRate error');
        const data = await res.json();
        if (!data.rates[to]) throw new Error('Moneda no disponible');
        const rate = data.rates[to];
        return { amount, from, to, result: rate * amount, rate };
      }
    },
    {
      name: 'fxrates',
      fetch: async (amount, from, to) => {
        const res = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`);
        if (!res.ok) throw new Error('FXRates error');
        const data = await res.json();
        const rate = data[from.toLowerCase()][to.toLowerCase()];
        if (!rate) throw new Error('Moneda no disponible');
        return { amount, from, to, result: rate * amount, rate };
      }
    }
  ];

  async function convert(amount, from, to) {
    if (from === to) return { amount, from, to, result: amount, rate: 1 };
    let lastError;
    for (const api of APIS) {
      try {
        return await api.fetch(amount, from, to);
      } catch (e) {
        lastError = e;
      }
    }
    throw new Error('No se pudo obtener la tasa de cambio. Verifica tu conexión a internet.');
  }

  function renderConverterResult(data) {
    return `
      <div class="conversion-result">
        <div class="conversion-from">${Number(data.amount).toLocaleString('es-CO')} <strong>${data.from}</strong></div>
        <div class="conversion-arrow">→</div>
        <div class="conversion-to">${Number(data.result).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <strong>${data.to}</strong></div>
        <div class="conversion-rate">Tasa: 1 ${data.from} = ${(data.result / data.amount).toFixed(4)} ${data.to}</div>
      </div>
    `;
  }

  return { convert, renderConverterResult };
})();
