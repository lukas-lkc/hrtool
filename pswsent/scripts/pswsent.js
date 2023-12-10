const recoverPasswordButton = document.getElementById("recover-password-button");
const arrowContainer = document.getElementsByClassName("arrow-container")[0];

if (recoverPasswordButton) {
    recoverPasswordButton.addEventListener("click", function (event) {
        window.location.href = "../login/login.html";
    });
}

if (arrowContainer) {
    arrowContainer.addEventListener("click", function (event) {
        window.location.href = "../recoverpsw/recoverpsw.html";
    });
}
