document.addEventListener('DOMContentLoaded', function () {

    const recoverPasswordButton = document.getElementById("recover-password-button");
    const form = {
        email: () => document.getElementById("email"),
        emailRequiredError: () => document.getElementById("email-required-error"),
        loginButton: () => document.getElementById("login-button"),
        password: () => document.getElementById("password"),
        passwordRequiredError: () => document.getElementById("password-required-error"),
        recoverPasswordButton: () => document.getElementById("recover-password-button"),
    };

    if (recoverPasswordButton) {
        recoverPasswordButton.addEventListener("click", function (event) {
            event.preventDefault(); // Evita que o link execute o comportamento padrão de recarregar a página
            recoverPasswordClick(); // Chama a função que verifica a validade do e-mail
        });
    }

    function recoverPasswordClick() {
        //window.location.href = "https://lukas-lkc.github.io/recoverPassHrTool/";
        window.location.href = "../recoverpsw/recoverpsw.html";
    }

    function onChangeEmail() {
        toggleButtonsDisable();
        toggleEmailErrors();
    }
    function onChangePassword() {
        toggleButtonsDisable();
        togglePasswordErrors();
    }
    function login() {
        firebase.auth().signInWithEmailAndPassword(form.email().value, form.password().value
        ).then(response => {
            //window.location.href = "https://lukas-lkc.github.io/hrtool/";
            window.location.href = "../index.html";
        }).catch(error => {
            console.log(getErrorMessage(error));
            const toastError = document.getElementById("toast-error");
            toastError.style.display = "block";
        });
    }
    function getErrorMessage(error) {
        if (error.code == "auth/invalid-login-credentials") {
            return "Email ou senha incorretos";
        }
        return error.message;
    }
    /*
    function register() {
        window.location.href = "https://lukas-lkc.github.io/registerHrTool/";
    }
    */
    function toggleEmailErrors() {
        const email = form.email().value;
        form.emailRequiredError().style.display = email ? "none" : "block";
    }
    function togglePasswordErrors() {
        const password = form.password().value;
        form.passwordRequiredError().style.display = password ? "none" : "block";
    }
    function toggleButtonsDisable() {
        const emailValid = isEmailValid();
        form.recoverPasswordButton().disabled = !emailValid;

        const passwordValid = isPasswordValid();
        form.loginButton().disabled = !emailValid || !passwordValid;
    }


    function recoverPassword() {
        const email = form.email().value;

        // Esconde o toast-error antes de tentar recuperar a senha
        const toastError = document.getElementById("toast-error");
        toastError.style.display = "none";

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                // Redefinição de senha enviada com sucesso
                // Exibir mensagem de sucesso
                const toastSuccess = document.getElementById("toast-success");
                toastSuccess.style.display = "block";
            })
            .catch(error => {
                // Ocorreu um erro ao enviar a redefinição de senha
                // Exibir mensagem de erro
                const toastError = document.getElementById("toast-error");
                toastError.style.display = "block";
                console.error(error);
            });
    }

    function isEmailValid() {
        const email = form.email().value;
        if (!email) {
            return false;
        }
        return validateEmail(email);
    }

    function isPasswordValid() {
        return form.password().value ? true : false;
    }
    function validateEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }
    form.email().addEventListener("change", onChangeEmail);

    /*senha*/
    const password = document.getElementById("password");
    const icon = document.getElementById("icon");
    function showHider() {
        if (password.type === "password") {
            password.setAttribute('type', 'text');
            icon.classList.add('hider')
        } else {
            password.setAttribute('type', 'password');
            icon.classList.remove('hider')
        }
    }

    const sairLink = document.querySelector(".registro");
    if (sairLink) {
        sairLink.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('deveria')
            window.location.href = '../Registro/registro.html';
        });
    }
});