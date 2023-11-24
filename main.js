//espera que o DOM seja carregado
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
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
    /*
        //////////////////////
        /////salvar dados/////
        /////campoFuncionario////
    // Variável global para armazenar o ID do funcionário
    // Função para salvar o horário de almoço em uma subcoleção "horarios"
    // Variável global para armazenar o ID do funcionário
    let funcionarioId;
    
    // Função para verificar se um funcionário já existe com o mesmo nome e sobrenome
    async function verificarFuncionarioExistente(nome, sobrenome) {
      const funcionariosRef = collection(db, "funcionarios");
      const queryFuncionario = query(funcionariosRef, where("nome", "==", nome), where("sobrenome", "==", sobrenome));
      const querySnapshot = await getDocs(queryFuncionario);
      return !querySnapshot.empty; // Retorna true se já existe um funcionário com o mesmo nome e sobrenome
    }
    
    // Função para salvar o horário de almoço em uma subcoleção "horarios"
    async function salvarNome() {
      const nomeFunc = document.getElementById("nomeFuncionario").value;
      const sobrenomeFunc = document.getElementById("sobrenomeFuncionario").value;
      const horaAlmoco = document.getElementById("horaAlmoco").value;
    
      if (nomeFunc.trim() !== "" && horaAlmoco.trim() !== "") {
        // Verifica se o funcionário já existe
        const funcionarioJaExiste = await verificarFuncionarioExistente(nomeFunc, sobrenomeFunc);
    
        if (!funcionarioJaExiste) {
          // Adiciona o documento para a coleção "funcionarios"
          const funcionarioRef = await addDoc(collection(db, "funcionarios"), {
            nome: nomeFunc,
            sobrenome: sobrenomeFunc
            // Adicione mais campos conforme necessário
          });
    
          // Obtém o ID do documento recém-criado
          funcionarioId = funcionarioRef.id;
    
          // Adiciona o horário de almoço à subcoleção "horarios"
          salvarHorarioAlmoco(funcionarioId, horaAlmoco);
        } else {
          alert("Este funcionário já existe."); // Trate conforme necessário
        }
      } else {
        // Nome ou horário de almoço não foram informados, exibir pop-up
        alert("O nome e o horário de almoço são obrigatórios. Por favor, informe ambos.");
      }
    }
    
    // Função para salvar o horário de almoço em uma subcoleção "horarios"
    function salvarHorarioAlmoco(funcionarioId, horaAlmoco) {
      // Adiciona o horário de almoço à subcoleção "horarios"
      addDoc(collection(db, `funcionarios/${funcionarioId}/horarios`), {
        horaAlmoco: horaAlmoco
        // Adicione mais campos de horário conforme necessário
      })
        .then((docRef) => {
          console.log("Horário de almoço salvo com ID:", docRef.id);
        })
        .catch((error) => {
          console.error("Erro ao salvar horário de almoço:", error);
        });
    }
    
    // Obtém referência para o botão
    const registrarBtn2 = document.getElementById("registrarBtn2");
    
    // Adiciona o ouvinte de evento de clique ao botão
    registrarBtn2.addEventListener("click", function () {
      salvarNome();
      // Não é necessário chamar salvarHorarioAlmoco aqui, pois essa função já é chamada dentro de salvarNome
    });
    */
    /////////////////////////
    ////disa semana/////

    function toggleClass(element) {
        element.classList.toggle("active");
    }

    var diasAtivos = [];

    function toggleDay(day) {
        var index = diasAtivos.indexOf(day);

        if (index === -1) {
            diasAtivos.push(day);
        } else {
            diasAtivos.splice(index, 1);
        }

        var allLists = document.querySelectorAll('.dias_semana_campos');
        allLists.forEach(function (list) {
            var listDay = list.id.split('-')[0];
            if (diasAtivos.includes(listDay)) {
                list.classList.add('active');
            } else {
                list.classList.remove('active');
            }
        });

        console.log(diasAtivos);
    }

    var links = document.querySelectorAll(".dia-link");

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            toggleClass(this);
            toggleDay(this.dataset.day);
        });
    });

});