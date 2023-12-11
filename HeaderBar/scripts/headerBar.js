document.addEventListener("DOMContentLoaded", function () {
    //show and close sidebar
    var navHeader = document.getElementById('nav_header');
    var container = document.getElementById('container');
    var showSidebar = false;
    var btn = document.getElementById('showSidebar');
    var closeWindow = document.getElementById('container');

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
            // btn.click(); // Remova essa linha para impedir o fechamento ao clicar no botão
            showSidebar = false; // Adicione esta linha para garantir que a barra lateral seja fechada
            navHeader.style.transform = 'translateY(-100%)';
            navHeader.style.animation = '';
            container.style.filter = '';
        }
    }

    closeWindow.addEventListener('click', function () {
        closeSidebar();
    });
    // quando alterar o tamanho da tela
    window.addEventListener('resize', function (event) {
        if (window.innerWidth > 640 && showSidebar) {
            closeSidebar();
        }
    })
});