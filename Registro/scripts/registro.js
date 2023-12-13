import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
//acima conecta o app ao projeto.
//import {} from 'firebase/<service>';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

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


document.addEventListener("DOMContentLoaded", function () {

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    document.getElementById("register-button").addEventListener("click", register);

    const form = {
        email: document.getElementById("email"),
        emailRequiredError: document.getElementById("email-required-error"),
        name: document.getElementById("name"),
        nameRequiredError: document.getElementById("name-required-error"),
        registerButton: document.getElementById("register-button"),
        password: document.getElementById("password"),
        passwordRequiredError: document.getElementById("password-required-error"),
        recoverPasswordButton: document.getElementById("recover-password-button"),
    };

    form.email.addEventListener("input", onChangeEmail);
    form.password.addEventListener("input", onChangePassword);
    form.name.addEventListener("input", onChangeName);
    //inicio registrar
    function register() {

        if (!isEmailValid() || !isPasswordValid() || !isNameValid()) {
            console.log('email, senha ou nome invalidos');
            return;
        }

        console.log('btn clicado');
        const email = form.email.value;
        const password = form.password.value;
        const name = form.name.value;


        // Cria um novo usuário no Firebase Authentication
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                const userRef = doc(db, 'users', user.uid);
                return setDoc(userRef, {
                    name: name,
                    email: email,
                });
            })
            .then(() => {
                console.log("Informações adicionais salvas no Firestore</link");
                window.location.href = "../index.html";
            })
            .catch((error) => {
                console.error(getErrorMessage(error));
                //const toastError = document.getElementById("toast-error");
                //toastError.style.display = "block";
            });
    }

    // Restante do seu código...

    function onChangeEmail() {
        toggleEmailErrors();
    }

    function onChangePassword() {
        togglePasswordErrors();
    }

    function onChangeName() {
        toggleNameErrors();
    }


    //fim registrar

    //caso surja algum ero
    function getErrorMessage(error) {
        const toastError = document.getElementById("toast-error");
        if (error.code == "auth/invalid-login-credentials") {
            return "Email ou senha incorretos";
        }
        if (error.code == "auth/email-already-in-use") {
            return toastError.style.display = "block";
        }
        if (error.code == "auth/missing-password") {
            return "Senha é obrigatória";
        }
        return error.message;
    }
    //nome é obrigatório
    function toggleNameErrors() {
        const name = form.name.value;
        form.nameRequiredError.style.display = name ? "none" : "block";
    }
    //estados do aviso de email em diferentes situações
    function toggleEmailErrors() {
        const email = form.email.value;
        if (email && isEmailValid()) {
            form.emailRequiredError.style.display = "none";
        } else if (email && !isEmailValid()) {
            mudarMensagemErro('email-required-error', "Digite um endereço de email válido");
            form.emailRequiredError.style.display = "block";
        } else {
            mudarMensagemErro('email-required-error', "Email é obrigatório");
            form.emailRequiredError.style.display = "block";
        }
    }
    function togglePasswordErrors() {
        const password = form.password.value;
        form.passwordRequiredError.style.display = password ? "none" : "block";
        if (password && isPasswordValid()) {
            form.passwordRequiredError.style.display = "none";
        } else if (password && !isPasswordValid()) {
            mudarMensagemErro('password-required-error', "No mínimo 7 caracteres");
            form.passwordRequiredError.style.display = "block";
        } else {
            mudarMensagemErro('password-required-error', "Senha é obrigatória");
            form.passwordRequiredError.style.display = "block";
        }
    }

    function mudarMensagemErro(idElemento, novaMensagem) {
        // Encontra o elemento com o ID "email-required-error"
        //var elementoErro = document.getElementById("email-required-error");
        var elementoErro = document.getElementById(idElemento);
        // Atualiza o conteúdo do elemento com a nova mensagem
        elementoErro.innerHTML = novaMensagem;
    }

    // Verifica se os campos são válidos



    function isEmailValid() {
        const email = form.email.value;
        if (!email) {
            return false;
        }
        return validateEmail(email);
    }

    function isNameValid() {
        return form.name.value.trim() !== "";
    }
    function isPasswordValid() {
        return form.password.value.length >= 7;
    }
    function validateEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    // Adiciona ouvintes de evento para os campos de e-mail, senha e nome

    /*senha*/
    const icon = document.getElementById("icon");
    if (icon) {
        icon.addEventListener('click', showHider);
    }
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

    linksLogin.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = '../login/login.html';
        });
    });

});