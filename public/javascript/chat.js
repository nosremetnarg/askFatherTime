const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// =================================== advice code ==============
const API_URL_TWO = "https://api.adviceslip.com/advice";
function get(url) { return fetch(url).then(resp => resp.json()) }
const API_TWO = { get }

const loadButton = document.querySelector("button#quoteBtn")

const fontTypeTwo = ["Roboto Mono", "Roboto Slab", "Abril Fatface", "Notable", "Bungee"]
const coloursTwo = ["#FFCDD2", "#FCE4EC", "#F3E5F5", "#8C9EFF", "#90CAF9", "#80D8FF", "#80DEEA", "#B2DFDB", "#69F0AE", "#AED581", "#AED581", "#FFC400", "#BCAAA4", "#90A4AE"]
const quotePTwo = document.querySelector("#quoteBox")
const bgroundTwo = document.querySelector("#quoteBox")
// =================================== advice code ==============


// Get username and room from URL
const { username, room }  = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room })

// Message from Server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get message text
    const msg = e.target.elements.msg.value;

    // emit message to server
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
} // use join method b/c users are an array and turn it into a string


// =================================== advice code ==============
function getQuotesTwo() {
    API_TWO.get(API_URL_TWO).then(data => addQuoteTwo(data['slip']['advice']))
}

function addQuoteTwo(quote) {
    console.log(quote)
    quotePTwo.innerText = quote;
    let fontsNum = Math.floor(Math.random() * fontTypeTwo.length);
    let coloursNum = Math.floor(Math.random() * coloursTwo.length);
    quotePTwo.style.fontFamily = fontTypeTwo[fontsNum];
    bgroundTwo.style.backgroundColor = coloursTwo[coloursNum];
    // let quoteBox = document.createElement('h2');
    // quoteBox.innerText = quote;
    
}

loadButton.addEventListener("click", ()=> getQuotesTwo())
