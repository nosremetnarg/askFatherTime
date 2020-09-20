const API_URL = "https://api.adviceslip.com/advice";
function get(url) { return fetch(url).then(resp => resp.json()) }
const API = { get }

const reloadButton = document.querySelector("button#reload")


const fontType = ["Roboto Mono", "Roboto Slab", "Abril Fatface", "Notable", "Bungee"]
const colours = ["#FFCDD2", "#FCE4EC", "#F3E5F5", "#8C9EFF", "#90CAF9", "#80D8FF", "#80DEEA", "#B2DFDB", "#69F0AE", "#AED581", "#AED581", "#FFC400", "#BCAAA4", "#90A4AE"]
const quoteP = document.querySelector("h2#quote")
const bground = document.querySelector("body")

function getQuotes() {
    API.get(API_URL).then(data => addQuote(data['slip']['advice']))
}

function addQuote(quote) {
    quoteP.innerText = quote;
    let fontsNum = Math.floor(Math.random() * fontType.length);
    let coloursNum = Math.floor(Math.random() * colours.length);
    quoteP.style.fontFamily = fontType[fontsNum];
    bground.style.backgroundColor = colours[coloursNum];
}

reloadButton.addEventListener("click", ()=> getQuotes())
document.body.onload = getQuotes
