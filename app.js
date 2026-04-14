const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}
function wishMe(username) {
    var day = new Date();
    var hour = day.getHours();
    if (hour >= 0 && hour < 12) {
        speak(`Good Morning ${username}, mein apki seva me hajir hu`);
    } else if (hour >= 12 && hour < 17) {
        speak(`Good Afternoon ${username}, mein apki seva me hajir hu`);
    } else {
        speak(`Good Evening ${username}, mein apki seva me hajir hu`);
    }
}
window.addEventListener('load', () => {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('greeting').textContent = `Welcome, ${username}!`;
        speak(`Initializing JARVIS...`);
        wishMe(username); 
    } else {
        window.location.href = 'login.html';
    }
});
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});
async function takeCommand(message) {
    const userId = localStorage.getItem('userId'); 
    const response = await fetch('http://localhost:3000/command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, command: message }),
    });
    const data = await response.json();
    content.textContent = data.reply;
    speak(data.reply);
}
