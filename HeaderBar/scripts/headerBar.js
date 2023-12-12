document.addEventListener("DOMContentLoaded", function () {
    //show and close sidebar
    var navHeader = document.getElementById('nav_header');
    var navLinks = document.querySelectorAll('.nav_header a');
    var container = document.getElementById('container');
    var showSidebar = false;
    var btn = document.getElementById('showSidebar');
    var closeWindow = document.getElementById('container');

    const redirecionar = function (link) {
        // Defina os redirecionamentos para cada link aqui
        switch (link) {
            case 'login':
                return window.location.href = '../login/login.html';
            case 'cadastreSe':
                return window.location.href = '../Registro/registro.html';
            case 'sobreMim':
                return 'https://link-sobre-mim.com';
            case 'contato':
                return 'https://link-contato.com';
            default:
                return '#';
        }
    };

    const adicionarEventoRedirecionamento = function (linkElement, link) {
        linkElement.addEventListener('click', function (event) {
            // Impede o comportamento padrão do link (navegação para a href)
            event.preventDefault();

            // Remove a classe 'active' de todos os links
            navLinks.forEach(link => link.classList.remove('active'));

            // Adiciona a classe 'active' ao link clicado
            this.classList.add('active');

            // Obtem o link específico para redirecionar usando switch case
            const linkEspecifico = redirecionar(link);

            // Redireciona para o link específico
            window.location.href = linkEspecifico;
        });
    };

    navLinks.forEach(link => {
        const linkId = link.id;
        adicionarEventoRedirecionamento(link, linkId);
    });



    /////#3 side-bar//////
    btn.addEventListener('click', function () {
        showSidebar = !showSidebar;
        if (showSidebar) {
            navHeader.style.transform = 'translateY(0)';
            navHeader.style.animation = 'showSidebar 1s';
            container.style.filter = 'blur(2px)';
        } else {
            navHeader.style.transform = 'translateY(-100%)';
            navHeader.style.animation = '';
            container.style.filter = '';
        }
    });

    function closeSidebar() {
        if (showSidebar) {
            showSidebar = false;
            navHeader.style.transform = 'translateY(-100%)';
            navHeader.style.animation = '';
            container.style.filter = '';
        }
    }

    closeWindow.addEventListener('click', function () {
        closeSidebar();
    });
    window.addEventListener('resize', function (event) {
        if (window.innerWidth > 640 && showSidebar) {
            closeSidebar();
        }
    })
});