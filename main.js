//espera que o DOM seja carregado
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { app } from "/firebaseConfig.js"; // Importa o objeto 'app' do firebaseConfig.js
document.addEventListener('DOMContentLoaded', function () {
    //firebase
    const db = getFirestore(app);
    const nomeFunc = document.getElementById("nomeFuncionario");
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

    //////////////////////make to work sliders
    //slider 1
    const slider = document.querySelectorAll('.slide_escala');
    const btnPrev = document.getElementById('prev_btn');
    const btnNext = document.getElementById('next_btn');

    let currentSlide = 0;

    function hideSlider() {
        Array.from(slider).forEach(item => item.classList.remove('on'));
    }

    function showSlider() {
        slider[currentSlide].classList.add('on');
    }

    function nextSlider() {
        hideSlider();
        if (currentSlide == slider.length - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        showSlider();
    }

    function prevSlider() {
        hideSlider();
        if (currentSlide == 0) {
            currentSlide = slider.length - 1;
        } else {
            currentSlide--;
        }
        showSlider();
    }

    btnNext.addEventListener('click', nextSlider);
    btnPrev.addEventListener('click', prevSlider);

    //////////////////////
    /////salvar dados/////
    /////campoFuncionario////

    nomeFunc.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            salvarNomeNoFirestore(nomeFunc.value);
        }
    });

    function salvarNomeNoFirestore(nome) {
        if (nome.trim() !== "") {
            // Salva o nome no Firestore
            addDoc(collection(db, "funcionarios"), {
                nome: nome
            })
                .then((docRef) => {
                    console.log("Nome do funcionário salvo com ID:", docRef.id);
                })
                .catch((error) => {
                    console.error("Erro ao salvar nome do funcionário:", error);
                });
        }
    }

    /*
    //captura o horário de almoço a partir do enter 
    const nomeInput = document.getElementById("nomeFuncionario");
    
    nomeInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita o envio do formulário ao pressionar Enter
            // Aqui você pode realizar a ação desejada ao pressionar Enter
            console.log("Hora almoço:", nomeInput.value);
        }
    });
    //ou ao clicar fora
    nomeInput.addEventListener("blur", function () {
        // Ação ao sair do campo
        console.log("Hora almoço:", nomeInput.value);
    });
    */
});