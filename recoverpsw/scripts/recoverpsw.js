import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getAuth, sendPasswordResetEmail , fetchSignInMethodsForEmail} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

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

const recoverPasswordButton = document.getElementById("recover-password-button");
const arrowContainer = document.getElementsByClassName("arrow-container")[0];

const form = {
    email: () => document.getElementById("email"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    toastError: () => document.getElementById("toast-error"),
};

if (recoverPasswordButton) {
    recoverPasswordButton.addEventListener("click", function (event) {
        // Desativa o botão para evitar cliques repetidos
        recoverPasswordButton.disabled = true;

        // Agende a reativação do botão após 1 segundo (ajuste conforme necessário)
        setTimeout(() => {
            recoverPasswordButton.disabled = false;
        }, 1000);

        recoverPasswordClick();
    });
}

function recoverPasswordClick() {
    const email = form.email().value;

    // A verificação de e-mail deve ser movida para dentro da função recoverPassword
    recoverPassword(email);
}


function onChangeEmail() {
    toggleEmailErrors();
}

function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
}

function isEmailValid(email) {
    return /\S+@\S+\.\S+/.test(email);
}

if (arrowContainer) {
    arrowContainer.addEventListener("click", function (event) {
        window.location.href = "../login/login.html";
    });
}

function recoverPassword(email) {
    const toastError = form.toastError();
    toastError.style.display = "block";

    // Verifica se o e-mail é válido
    if (isEmailValid(email)) {
        // Tenta obter os métodos de sign-in associados ao e-mail
        fetchSignInMethodsForEmail(auth, email)
            .then(methods => {
                // Se a lista de métodos estiver vazia, o e-mail não está cadastrado
                if (methods.length === 0) {
                    // E-mail não existe no Firebase, exibir mensagem de erro
                    console.error('E-mail não cadastrado.');
                } else {
                    // E-mail cadastrado, continuar com o envio da redefinição de senha
                    sendPasswordResetEmail(auth, email)
                        .then(() => {
                            // Redefinição de senha enviada com sucesso
                            // Exibir mensagem de sucesso
                            console.log('Email enviado');
                            // Redirecionar para a página desejada
                            window.location.href = "../pswsent/pswsent.html";
                        })
                        .catch(error => {
                            // Ocorreu um erro ao enviar a redefinição de senha
                            // Exibir mensagem de erro
                            console.error(error);
                            // Exibir mensagem de erro no toast, se necessário
                            toastError.style.display = "block";
                        });
                }
            })
            .catch(error => {
                // Ocorreu um erro ao obter os métodos de sign-in
                // Exibir mensagem de erro
                console.error(error);
                // Exibir mensagem de erro no toast, se necessário
                toastError.style.display = "block";
            });
    } else {
        // Exibir mensagem de erro, pois o e-mail não é válido
        toastError.style.display = "block";
    }
}

form.email().addEventListener("change", onChangeEmail);