import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBDykdiCuuMJksQvJ4y2tGkKKdIX3PprBw",
    authDomain: "hrtool-c763b.firebaseapp.com",
    databaseURL: "https://hrtool-c763b-default-rtdb.firebaseio.com",
    projectId: "hrtool-c763b",
    storageBucket: "hrtool-c763b.appspot.com",
    messagingSenderId: "443882727101",
    appId: "1:443882727101:web:54dd9ddd98ae6067d4f9d4",
    measurementId: "G-PGJTJVYZYN"
});

const auth = getAuth(firebaseApp);

auth.onAuthStateChanged(user => {
});

let form;

function recoverPasswordClick() {
    window.location.href = "../recoverpsw/recoverpsw.html";
}

function login() {
    // Obtenha os valores de e-mail e senha
    const email = form.email().value;
    const password = form.password().value;

    signInWithEmailAndPassword(auth, email, password)
        .then(response => {
            console.log("Login bem-sucedido:", response);
            window.location.href = "../index.html";
        })
        .catch(error => {
            console.error("Erro durante o login:", error);
            const toastError = document.getElementById("toast-error");
            toastError.style.display = "block";
        });
}

document.addEventListener('DOMContentLoaded', function () {
    form = {
        email: () => document.getElementById("email"),
        emailRequiredError: () => document.getElementById("email-required-error"),
        loginButton: () => document.getElementById("login-button"),
        password: () => document.getElementById("password"),
        passwordRequiredError: () => document.getElementById("password-required-error"),
        recoverPasswordButton: () => document.getElementById("recover-password-button"),
    };

    const recoverPasswordButton = document.getElementById("recover-password-button");

    if (recoverPasswordButton) {
        recoverPasswordButton.addEventListener("click", function (event) {
            event.preventDefault();
            recoverPasswordClick();
        });
    }

    const icon = document.getElementById("icon");
    if (icon) {
        icon.addEventListener('click', showHider);
    }

    const sairLink = document.querySelector(".registro");
    if (sairLink) {
        sairLink.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = '../Registro/registro.html';
        });
    }

    // Verifique se o botão de login está presente
    if (form.loginButton()) {
        form.loginButton().addEventListener("click", login);
    } 
});

function showHider() {
    const password = document.getElementById("password");
    const icon = document.getElementById("icon");

    if (password.type === "password") {
        password.setAttribute('type', 'text');
        icon.classList.add('hider');
    } else {
        password.setAttribute('type', 'password');
        icon.classList.remove('hider');
    }
}