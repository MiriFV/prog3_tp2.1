class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.currencies = [];
    }

    async getCurrencies() {
        const host = this.apiUrl;
        try{
            const response = await fetch(`${host}/currencies`);
            const data = await response.json();
            for(const code in data){
                const currency = new Currency(code, data[code]);
                this.currencies.push(currency);
            };

        }
        catch(error){
            console.error("No se pudieron procesar los datos"+error);
        }
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        if(fromCurrency.code != toCurrency.code){
        const host = this.apiUrl;
        try{
            const response = await fetch(`${host}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`);
            const data = await response.json();
            if (data.rates && data.rates[toCurrency.code]) {
                const convertedAmount = data.rates[toCurrency.code] * amount;
                return convertedAmount;
            } else {
                console.error("No se encontró la tasa de cambio.");
                return null;
            }
        }
        catch(Error){
            console.error("No se encontro taza de cambio: "+Error);
            return null;
        }  }  else{
            return amount;
        }
     }
     async getDateRates (fecha1, fecha2){
        try {
            const resp1 = await fetch(`${this.apiUrl}/${fecha1}`);
            const resp2 = await fetch(`${this.apiUrl}/${fecha2}`);
            const data1 = await resp1.json();
            const data2 = await resp2.json();
            const rate1 = data1.rates;
            const rate2 = data2.rates;
            const cambio = {};

            for (const code in rate1){
                if (rate2[code]){
                    cambio[code] = rate1[code] - rate2[code];
                } else {
                    console.log(`La moneda ${code} no se encuentra para ${fecha2}`)
                }
            }
            return cambio;
        } catch (error) {
            console.error("Error al obtener la diferencia de tasa de cambio: ", error);
            return null;
        }
    }
}

//DOM

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = parseFloat(document.getElementById("amount").value);
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${fromCurrency.code} son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
