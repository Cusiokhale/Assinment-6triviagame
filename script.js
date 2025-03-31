
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