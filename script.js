
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