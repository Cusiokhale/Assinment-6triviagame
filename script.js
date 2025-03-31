
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const expiresDate = new Date();
        expiresDate.setTime(expiresDate.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + expiresDate.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    const cookieName = name + "=";
    const cookieArray = document.cookie.split(';');
    for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(cookieName) === 0) {
            return decodeURIComponent(cookie.substring(cookieName.length));
        }
    }
    return "";

}

function checkUsername() {
    const usernameInput = document.getElementById('username');
    const username = getCookie('username');

    if (username !== "") {
        usernameInput.value = username;
        usernameInput.disabled = true;
        usernameInput.style.display = 'none';
        greetUser(username);
    } else {
        usernameInput.value = '';
        usernameInput.disabled = false;
        usernameInput.style.display = 'block';
    }
}

function greetUser(username) {
    const triviaForm = document.getElementById('trivia-form');
    let greetingElement = document.getElementById('user-greeting');

    if (!greetingElement) {
        greetingElement = document.createElement('p');
        greetingElement.id = 'user-greeting';
        greetingElement.style.fontWeight = 'bold';
        triviaForm.prepend(greetingElement);
    }

    greetingElement.textContent = `Welcome back, ${username}! Good luck!`;
}

function fetchQuestions() {
    showLoading(true);

    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
        .then((response) => response.json())
        .then((data) => {
            displayQuestions(data.results);
            showLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching questions:", error);
            showLoading(false);
        });
}

function showLoading(isLoading) {
    document.getElementById("loading-container").classList.toggle("hidden", !isLoading);
    document.getElementById("question-container").classList.toggle("hidden", isLoading);
}

function displayQuestions(questions) {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add('question-box');
        questionDiv.innerHTML = `
            <p>${question.question}</p>
            ${createAnswerOptions(question.correct_answer, question.incorrect_answers, index)}
        `;
        questionContainer.appendChild(questionDiv);
    });
}

function createAnswerOptions(correctAnswer, incorrectAnswers, questionIndex) {
    const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
    return allAnswers.map(answer => `
        <label>
            <input type="radio" name="answer${questionIndex}" value="${answer}" ${answer === correctAnswer ? 'data-correct="true"' : ''}>
            ${answer}
        </label>
    `).join('');
}

function handleFormSubmit(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    let username = getCookie('username');

    if (!username) {
        username = usernameInput.value.trim();
        if (username === "") {
            alert("Please enter your name to continue.");
            return;
        }
        setCookie('username', username, 7);
        usernameInput.disabled = true;
        usernameInput.style.display = 'none';
        greetUser(username);
    }

    const score = calculateScore();
    saveScore(username, score);
    displayScores();
    highlightAnswers();

    alert(`${username}, your score is ${score}/10!`);

    document.getElementById('new-player').classList.remove('hidden');

    setTimeout(fetchQuestions, 5000);
}

function calculateScore() {
    let score = 0;
    const questions = document.querySelectorAll('#question-container > .question-box');

    questions.forEach((questionDiv, index) => {
        const selectedOption = questionDiv.querySelector(`input[name="answer${index}"]:checked`);
        if (selectedOption && selectedOption.dataset.correct === "true") {
            score += 1;
        }
    });

    return score;
}

function highlightAnswers() {
    const questions = document.querySelectorAll('#question-container > .question-box');

    questions.forEach((questionDiv, index) => {
        const options = questionDiv.querySelectorAll(`input[name="answer${index}"]`);
        options.forEach(option => {
            const label = option.parentElement;
            if (option.dataset.correct === "true") {
                label.classList.add('correct-answer');
            } else if (option.checked && option.dataset.correct !== "true") {
                label.classList.add('incorrect-answer');
            }
        });
    });
}

function saveScore(username, score) {
    let scores = JSON.parse(localStorage.getItem('triviaScores')) || [];
    scores.push({ username, score });
    localStorage.setItem('triviaScores', JSON.stringify(scores));
}

function displayScores() {
    const scores = JSON.parse(localStorage.getItem('triviaScores')) || [];
    const tbody = document.querySelector('#score-table tbody');
    tbody.innerHTML = '';

    scores.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${entry.username}</td><td>${entry.score}/10</td>`;
        tbody.appendChild(row);
    });
}

function newPlayer() {
    setCookie('username', '', -1);
    location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    checkUsername();
    fetchQuestions();
    displayScores();
    document.getElementById('trivia-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('new-player').addEventListener('click', newPlayer);
});
