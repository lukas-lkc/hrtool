//espera que o DOM seja carregado
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
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
    // Declaração da variável para armazenar o ID do funcionário
    let funcionarioId;

    // Função assíncrona para verificar se um funcionário já existe com o mesmo nome e sobrenome
    async function verificarFuncionarioExistente(nome, sobrenome) {
        // Referência à coleção "funcionarios"
        const funcionariosRef = collection(db, "funcionarios");

        // Consulta para verificar se há um funcionário com o mesmo nome e sobrenome
        const queryFuncionario = query(funcionariosRef, where("nome", "==", nome), where("sobrenome", "==", sobrenome));

        // Obtém o snapshot da consulta
        const querySnapshot = await getDocs(queryFuncionario);

        // Retorna true se já existe um funcionário com o mesmo nome e sobrenome
        return !querySnapshot.empty;
    }

    // Função assíncrona para salvar o nome do funcionário e o horário de almoço
    async function salvarNome() {
        // Obtém os valores dos campos de entrada
        const nomeFunc = document.getElementById("nomeFuncionario").value;
        const sobrenomeFunc = document.getElementById("sobrenomeFuncionario").value;
        const horaAlmoco = document.getElementById("horaAlmoco").value;

        // Verifica se o nome do funcionário e o horário de almoço foram informados
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
                alert("Este funcionário já existe."); // Mensagem de alerta se o funcionário já existir
            }
        } else {
            // Mensagem de alerta se o nome ou horário de almoço não foram informados
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

    // Obtém referência para o botão de registro
    const registrarBtn2 = document.getElementById("registrarBtn2");

    // Adiciona um ouvinte de evento de clique ao botão
    registrarBtn2.addEventListener("click", function () {
        salvarNome(); // Chama a função para salvar o nome e o horário de almoço
        // Não é necessário chamar salvarHorarioAlmoco aqui, pois essa função já é chamada dentro de salvarNome
    });
    */
    let funcionarioId;

    async function verificarFuncionarioExistente(nome, sobrenome) {
        const funcionariosRef = collection(db, "funcionarios");
        const queryFuncionario = query(funcionariosRef, where("nome", "==", nome), where("sobrenome", "==", sobrenome));

        const querySnapshot = await getDocs(queryFuncionario);
        return !querySnapshot.empty;
    }

    // Função para salvar o horário de almoço em uma subcoleção "horarios"
    function salvarHorarios(funcionarioId, diaDaSemana, hrEntrada, hrSaida) {
        addDoc(collection(db, `funcionarios/${funcionarioId}/horarios`), {
            [diaDaSemana]: {
                entrada: hrEntrada,
                saida: hrSaida
            }
        })
            .then((docRef) => {
                console.log("Horários salvos com ID:", docRef.id);
            })
            .catch((error) => {
                console.error("Erro ao salvar horários:", error);
            });
        alert(`Funcionário e horários registrados! :)`);
    }

    async function salvarNome() {
        const nomeFunc = document.getElementById("nomeFuncionario").value;
        const sobrenomeFunc = document.getElementById("sobrenomeFuncionario").value;

        if (nomeFunc.trim() !== "" && sobrenomeFunc.trim() !== "" && diasAtivos.length > 0) {
            const funcionarioJaExiste = await verificarFuncionarioExistente(nomeFunc, sobrenomeFunc);
            if (!funcionarioJaExiste) {
                const funcionarioRef = await addDoc(collection(db, "funcionarios"), {
                    nome: nomeFunc,
                    sobrenome: sobrenomeFunc
                });
                funcionarioId = funcionarioRef.id;

                // Itera sobre todos os dias ativos
                for (const diaAtivo of diasAtivos) {
                    // Obtém os valores dos campos de entrada e saída para o dia ativo
                    const hrEntrada = document.getElementById(`entrada${diaAtivo}`);
                    const hrSaida = document.getElementById(`saida${diaAtivo}`);

                    if (hrEntrada && hrSaida) {
                        const hrEntradaValue = hrEntrada.value;
                        const hrSaidaValue = hrSaida.value;

                        if (hrEntradaValue.trim() !== "" && hrSaidaValue.trim() !== "") {
                            salvarHorarios(funcionarioId, diaAtivo, hrEntradaValue, hrSaidaValue);
                        } else {
                            alert(`Os campos de entrada/saída são obrigatórios para o dia ${diaAtivo}.`);
                        }
                    } else {
                        alert(`Campos de entrada/saída não encontrados para o dia ${diaAtivo}.`);
                    }
                }
            } else {
                alert("Este funcionário já foi cadastrado antes.");
            }
        } else {
            alert("O nome, sobrenome e pelo menos um dia ativo são obrigatórios.");
        }
    }

    // Restante do código permanece inalterado

    const registrarBtn2 = document.getElementById("registrarBtn2");
    registrarBtn2.addEventListener("click", function () {
        salvarNome();
    });

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
            registrarBtn2.style.display = "none";
        }

        var allLists = document.querySelectorAll('.dias_semana_campos');
        allLists.forEach(function (list) {
            var listDay = list.id.split('-')[0];
            if (diasAtivos.includes(listDay)) {
                list.classList.add('active');
                registrarBtn2.style.display = "block";
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