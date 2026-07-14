const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const amount = document.querySelector(".amount input");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector(".swap");

// Populate Dropdowns
for (let select of dropdowns) {

    for (let currCode in countryList) {

        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }
        else if (select.name === "to" && currCode === "PKR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    updateFlag(select);

    select.addEventListener("change", (evt) => {

        updateFlag(evt.target);

        localStorage.setItem("from", fromCurr.value);
        localStorage.setItem("to", toCurr.value);

    });

}

// Restore last selected currencies
window.addEventListener("load", () => {

    const savedFrom = localStorage.getItem("from");
    const savedTo = localStorage.getItem("to");

    if (savedFrom) fromCurr.value = savedFrom;
    if (savedTo) toCurr.value = savedTo;

    updateFlag(fromCurr);
    updateFlag(toCurr);

});

// Update Flag
function updateFlag(element) {

    let currCode = element.value;
    let countryCode = countryList[currCode];

    let img = element.parentElement.querySelector("img");

    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;

}

// Fetch Exchange Rate
async function updateExchangeRate() {

    let amtValue = amount.value;

    if (amtValue === "" || amtValue <= 0 || isNaN(amtValue)) {

        msg.innerText = "Please enter a valid amount.";
        amount.value = "1";
        return;

    }

    btn.disabled = true;
    btn.innerText = "Loading...";

    msg.innerText = "Fetching exchange rate...";

    try {

        const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

        let response = await fetch(URL);

        let data = await response.json();

        let rate =
            data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

        let finalAmount = amtValue * rate;

        let time = new Date().toLocaleTimeString();

        msg.innerText =
            `${amtValue} ${fromCurr.value} = ${finalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} ${toCurr.value}

Last Updated: ${time}`;

    }

    catch (error) {

        msg.innerText = "Unable to fetch exchange rate.";

    }

    btn.disabled = false;
    btn.innerText = "Get Exchange Rate";

}

// Button Click
btn.addEventListener("click", (evt) => {

    evt.preventDefault();

    updateExchangeRate();

});

// Press Enter
amount.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        e.preventDefault();

        updateExchangeRate();

    }

});

// Swap Currencies
swapBtn.addEventListener("click", () => {

    let temp = fromCurr.value;

    fromCurr.value = toCurr.value;
    toCurr.value = temp;

    updateFlag(fromCurr);
    updateFlag(toCurr);

    localStorage.setItem("from", fromCurr.value);
    localStorage.setItem("to", toCurr.value);

    updateExchangeRate();

});