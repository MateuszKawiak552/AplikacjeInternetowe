  // Tu macie slowa ktore chcecie zeby byly do napisania ostatnie jest na sterydach 
const words = ["keyboard", "programming", "challenge", "javascript", "developer", "coding", "accuracy", "speed", "practice", "exercise","Two years ago my friends and I went to France. The weather was absolutely fantastic, so our trip showed very well While we were driving to Paris, our car broke down. We were put on the spot. Immediately I called for help, but when I was on the phone the battery went flat. Zapadał zmrok i nikogo nie było w pobliżu."];
let currentWordIndex = 0;
let startTime, endTime;
let totalTime = 0;
let wordTimes = [];

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    showNextWord();
    document.getElementById('user-input').focus();
    startTime = new Date().getTime();
}

function showNextWord() {
    const textToType = document.getElementById('text-to-type');
    textToType.textContent = words[currentWordIndex];
}

function checkInput() {
    const userInput = document.getElementById('user-input').value;
    const textToType = words[currentWordIndex];
    const accuracy = calculateAccuracy(userInput, textToType);
    document.getElementById('accuracy').textContent = `Poprawność: ${accuracy}%`;

    if (userInput === textToType) {
        const wordEndTime = new Date().getTime();
        const wordTime = (wordEndTime - startTime) / 1000;
        wordTimes.push({ word: textToType, time: wordTime });

        currentWordIndex++;
        if (currentWordIndex < words.length) {
            showNextWord();
            document.getElementById('user-input').value = '';
        } else {
            endGame();
        }
    }
}

function calculateAccuracy(userInput, correctText) {
    const minLength = Math.min(userInput.length, correctText.length);
    let correctCount = 0;

    for (let i = 0; i < minLength; i++) {
        if (userInput[i] === correctText[i]) {
            correctCount++;
        }
    }

    return (correctCount / correctText.length) * 100;
}
   //Po zakonczeniu zadania to daje wam informacje jak szybko to zrobiliscie i ilosc slow na sek 
function endGame() {
    endTime = new Date().getTime();
    totalTime = (endTime - startTime) / 1000;
    

    showWordTimes();

    const wordsPerMinute = (words.length / totalTime) * 60;
    alert(`Koniec gry!\nCzas: ${totalTime.toFixed(2)} sekundy\nSzybkość: ${wordsPerMinute.toFixed(2)} słów na minutę`);
    restartGame();
}

function showWordTimes() {
    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Słowo</th><th>Czas (s)</th></tr>';

    for (const wordTime of wordTimes) {
        const row = table.insertRow();
        row.insertCell(0).textContent = wordTime.word;
        row.insertCell(1).textContent = wordTime.time.toFixed(2);
    }

    document.body.appendChild(table);
}

function restartGame() {
    currentWordIndex = 0;
    startTime = 0;
    endTime = 0;
    totalTime = 0;
    wordTimes = [];
    
    const table = document.querySelector('table');
    if (table) {
        table.remove();
    }

    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}
