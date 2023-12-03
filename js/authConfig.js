import { db } from "/firebaseConfig.js";

db.auth().onAuthStateChanged(function(user) {
    if (user) {
        // O usuário está autenticado
        // user.email contém o e-mail do usuário

        // Atualizar o HTML com o e-mail do usuário
        /** var emailUsuarioElemento = document.getElementById('emailUsuario');
        emailUsuarioElemento.textContent = user.email;*/
        
        close.log(user.email);
    } else {
        // O usuário não está autenticado, redirecionar para a página de login, por exemplo
        //window.location.href = 'pagina_de_login.html';
        close.log('sem login');
    }
});
