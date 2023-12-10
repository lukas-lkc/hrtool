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
    toastError.style.display = "none";

    // Verifica se o e-mail é válido
    if (isEmailValid(email)) {
        // Tenta enviar o e-mail de redefinição de senha
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                // Redefinição de senha enviada com sucesso
                // Exibir mensagem de sucesso
                console.log('Email enviado com sucesso');
                // Redirecionar para a página desejada
                window.location.href = "../pswsent/pswsent.html";
            })
            .catch(error => {
                // Verifica se o erro é relacionado ao e-mail não existir
                if (error.code === 'auth/user-not-found') {
                    // E-mail não existe no Firebase, exibir mensagem de erro
                    console.error('E-mail não cadastrado.');
                } else {
                    // Ocorreu um erro ao enviar a redefinição de senha
                    // Exibir mensagem de erro
                    console.error(error);
                    // Exibir mensagem de erro no toast, se necessário
                    toastError.style.display = "block";
                }
            });
    } else {
        // Exibir mensagem de erro, pois o e-mail não é válido
        toastError.style.display = "block";
    }
}

form.email().addEventListener("change", onChangeEmail);