document.addEventListener("DOMContentLoaded", function () {
    //show and close sidebar
    var headerBar = document.getElementById('header_bar');
    var navHeader = document.getElementById('nav_header');
    var container = document.getElementById('container');
    var showSidebar = false;
    var btn = document.getElementById('showSidebar');
    var closeBtn = document.getElementById('closeSidebar');
    var closeWindow = document.getElementById('container');

    btn.addEventListener('click', function () {
        showSidebar = !showSidebar;
        if (showSidebar) {
            navHeader.style.marginLeft = '-10vw';
            navHeader.style.animationName = 'showSidebar';
            container.style.filter = 'blur(2px)';
        } else {
            navHeader.style.marginLeft = '-100vw';
            navHeader.style.animationName = '';
            container.style.filter = '';
        }
    });

    function closeSidebar() {
        if (showSidebar) {
            btn.click(); // Chama a função btn() para fechar a barra lateral
        }
    }

    closeBtn.addEventListener('click', function () {
        closeSidebar();
    });

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