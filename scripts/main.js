//espera que o DOM seja carregado
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { app } from "./firebaseConfig.js"; // Importa o objeto 'app' do firebaseConfig.js
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

    //////////////////////slider
    //slider 1
    const slider = document.querySelectorAll('.slide_escala');
    const btnPrev = document.getElementById('prev_btn');
    const btnNext = document.getElementById('next_btn');

    let currentSlide = 0;
    const hoursMap = [6, 8, 12];

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
    // Declaração da variável para armazenar o ID do funcionário
    let funcionarioId;

    async function verificarFuncionarioExistente(nome, sobrenome) {
        const funcionariosRef = collection(db, "funcionarios");
        const queryFuncionario = query(funcionariosRef, where("nome", "==", nome), where("sobrenome", "==", sobrenome));

        const querySnapshot = await getDocs(queryFuncionario);
        return !querySnapshot.empty;
    }

    // Função para salvar horários na subcoleção "horarios"
    async function salvarHorarios(funcionarioId, diaDaSemana, hrEntrada, hrSaida) {
        return new Promise((resolve, reject) => {
            addDoc(collection(db, `funcionarios/${funcionarioId}/horarios`), {
                [diaDaSemana]: {
                    entrada: hrEntrada,
                    saida: hrSaida,
                }
            })
                .then((docRef) => {
                    console.log("Horários salvos com ID:", docRef.id);
                    resolve();
                })
                .catch((error) => {
                    console.error("Erro ao salvar horários:", error);
                    reject(error);
                });
        });
    }

    async function salvarNome() {
        const nomeFunc = document.getElementById("nomeFuncionario").value;
        const sobrenomeFunc = document.getElementById("sobrenomeFuncionario").value;
        const hrEscala = hoursMap[currentSlide];
        if (nomeFunc.trim() !== "" && sobrenomeFunc.trim() !== "" && diasAtivos.length > 0) {
            const funcionarioJaExiste = await verificarFuncionarioExistente(nomeFunc, sobrenomeFunc);
            if (!funcionarioJaExiste) {
                const funcionarioRef = await addDoc(collection(db, "funcionarios"), {
                    nome: nomeFunc,
                    sobrenome: sobrenomeFunc,
                    escala: hrEscala
                });
                funcionarioId = funcionarioRef.id;

                // Itera sobre todos os dias ativos
                const promises = diasAtivos.map(async (diaAtivo) => {
                    // Obtém os valores dos campos de entrada e saída para o dia ativo
                    const hrEntrada = document.getElementById(`entrada${diaAtivo}`);
                    const hrSaida = document.getElementById(`saida${diaAtivo}`);

                    if (hrEntrada && hrSaida) {
                        const hrEntradaValue = hrEntrada.value;
                        const hrSaidaValue = hrSaida.value;

                        if (hrEntradaValue.trim() !== "" && hrSaidaValue.trim() !== "") {
                            return salvarHorarios(funcionarioId, diaAtivo, hrEntradaValue, hrSaidaValue);
                        } else {
                            return Promise.reject(`Os campos de entrada/saída são obrigatórios para o dia ${diaAtivo}.`);
                        }
                    } else {
                        return Promise.reject(`Campos de entrada/saída não encontrados para o dia ${diaAtivo}.`);
                    }
                });

                if (promises.length > 0) {
                    try {
                        await Promise.all(promises);
                        alert("Clique em Recarregar! :)"); // Exibir alerta após todas as promessas serem cumpridas
                    } catch (error) {
                        console.error("Erro ao salvar horários:", error);
                        // Trate o erro conforme necessário
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
    }

    var links = document.querySelectorAll(".dia-link");

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            toggleClass(this);
            toggleDay(this.dataset.day);
        });
    });

    ///////////////////////////
    ////calcular hora extra////
    //////////////////////////
    function calcularHorasTotais(horarios, escala) {
        let horasTotais = 0;
        let horasExtras = 0;

        // Iterar sobre os horários e calcular a diferença de horas para cada dia
        horarios.forEach((horario) => {
            const entrada = new Date(`2000-01-01T${horario.entrada}`);
            const saida = new Date(`2000-01-01T${horario.saida}`);
            const diffMillis = saida - entrada;
            let diffHoras = diffMillis / (1000 * 60 * 60);

            // Subtrair uma hora de almoço do dia atual
            diffHoras -= 1; // Subtrai 1 hora de almoço

            // Garantir que a diferença de horas não seja negativa
            diffHoras = Math.max(diffHoras, 0);

            // Adicionar as horas totais do dia (sem subtrair a escala)
            horasTotais += diffHoras;

            // Subtrair a escala do dia atual para calcular as horas extras do dia
            const horasExtrasDia = Math.max(diffHoras - escala, 0);
            horasExtras += horasExtrasDia;
        });

        // Converter horasTotais para o formato HH:MM
        const horasInteirasTotais = Math.floor(horasTotais);
        const minutosDecimaisTotais = (horasTotais - horasInteirasTotais) * 60;
        const minutosInteirosTotais = Math.round(minutosDecimaisTotais);

        // Formatar as horas totais como HH:MM
        const horasFormatadasTotais = `${String(horasInteirasTotais).padStart(2, '0')}:${String(minutosInteirosTotais).padStart(2, '0')}`;

        // Converter horasExtras para o formato HH:MM
        const horasInteirasExtras = Math.floor(horasExtras);
        const minutosDecimaisExtras = (horasExtras - horasInteirasExtras) * 60;
        const minutosInteirosExtras = Math.round(minutosDecimaisExtras);

        // Formatar as horas extras como HH:MM
        const horasFormatadasExtras = `${String(horasInteirasExtras).padStart(2, '0')}:${String(minutosInteirosExtras).padStart(2, '0')}`;

        return {
            horasTotais: horasFormatadasTotais,
            horasExtras: horasFormatadasExtras
        };
    }


    // Função para obter o ID do funcionário com base no nome e sobrenome
    const detalhesFuncionariosDiv = document.getElementById("detalhesFuncionarios");
    //const detalhesFuncionariosDiv = document.getElementById("infoFuncionarios");
    registrarBtn3.addEventListener("click", async function () {
        try {
            const idsFuncionarios = await obterTodosIdsFuncionarios();

            // Limpar o conteúdo existente
            detalhesFuncionariosDiv.innerHTML = "";

            // Para cada ID de funcionário, obter detalhes e exibir na página
            for (const funcionarioId of idsFuncionarios) {
                const detalhes = await obterDetalhesFuncionario(funcionarioId);

                // Criar uma div para cada funcionário e adicionar a classe 'funcionario'
                const divInfoFuncionarios = document.createElement("div");
                divInfoFuncionarios.classList.add("infoFuncionarios");
                
                const pNome = document.createElement("p");
                pNome.textContent = `${detalhes.nome} ${detalhes.sobrenome}`;
                
                const pEscala = document.createElement("p");
                pEscala.textContent = `${detalhes.escala}`;

                const resultado = calcularHorasTotais(detalhes.horarios, detalhes.escala);

                const pHorasTotais = document.createElement("p");
                pHorasTotais.textContent = `${resultado.horasTotais}`;

                const pHorasExtras = document.createElement("p");
                pHorasExtras.textContent = `${resultado.horasExtras}`;

                // Criar um link de "excluir" e adicionar um evento de clique
                const linkExcluir = document.createElement("a");
                linkExcluir.href = "#"; // Pode ser "#" ou um link de confirmação/exclusão
                linkExcluir.textContent = "excluir";
                //chama função de exclusão
                linkExcluir.addEventListener("click", async (event) => {
                    event.preventDefault(); // Impedir o comportamento padrão do link
                    console.log("Excluir funcionário com ID:", detalhes.id);
                    await excluirFuncionario(funcionarioId);
                });
                // Adicionar os parágrafos e o link à div
                divInfoFuncionarios.appendChild(pNome);
                divInfoFuncionarios.appendChild(pEscala);
                divInfoFuncionarios.appendChild(pHorasTotais);
                divInfoFuncionarios.appendChild(pHorasExtras);
                divInfoFuncionarios.appendChild(linkExcluir);

                // Adicionar a div à seção de detalhes dos funcionários
                detalhesFuncionariosDiv.appendChild(divInfoFuncionarios);
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes dos funcionários: ', error);
        }
    });

    // Função para excluir um funcionário
    // Função para excluir um funcionário do Firestore
    async function excluirFuncionario(funcionarioId) {
        try {
            // Excluir as subcoleções aninhadas, se existirem. Quando existe, o funcionario não é excluído totalmente
            //motivo da issue #14 no GitHub
            const subCollections = await getDocs(collection(db, 'funcionarios', funcionarioId, 'horarios'));
            subCollections.forEach(async (subCollection) => {
                const docs = await getDocs(subCollection.ref);
                docs.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
                await deleteDoc(subCollection.ref);
            });
            // Referência para a coleção de funcionários
            const funcionariosCollectionRef = collection(db, 'funcionarios');
    
            // Excluir o documento do funcionário usando o ID
            await deleteDoc(doc(funcionariosCollectionRef, funcionarioId));
    
            console.log(`Funcionário com ID ${funcionarioId} excluído com sucesso.`);
            // Recarregar os detalhes dos funcionários após a exclusão
            await registrarBtn3.click();
        } catch (error) {
            console.error('Erro ao excluir funcionário: ', error);
        }
    }

    /////////////////////////////
    ////////////////////////////
    async function obterTodosIdsFuncionarios() {
        // Referência para a coleção de funcionários
        const funcionariosRef = collection(db, 'funcionarios');

        // Retornar uma nova Promise para envolver a lógica assíncrona
        return new Promise(async (resolve, reject) => {
            try {
                // Executar a consulta e obter os documentos
                const querySnapshot = await getDocs(funcionariosRef);

                // Criar um array para armazenar todos os IDs dos funcionários
                const idsFuncionarios = [];

                // Iterar sobre os documentos e extrair os IDs
                querySnapshot.forEach((doc) => {
                    // Adicionar o ID do documento ao array
                    idsFuncionarios.push(doc.id);
                });

                // Resolver a Promise com os IDs dos funcionários
                resolve(idsFuncionarios);
            } catch (error) {
                // Rejeitar a Promise se ocorrer um erro
                console.error('Erro ao obter IDs dos funcionários: ', error);
                reject(error);
            }
        });
    }

    async function obterDetalhesFuncionario(funcionarioId) {
        try {
            // Referência para o documento específico do funcionário
            const funcionarioDocRef = doc(db, 'funcionarios', funcionarioId);

            // Obter o documento do funcionário
            const docSnapshot = await getDoc(funcionarioDocRef);

            // Verificar se o documento existe
            if (docSnapshot.exists()) {
                // Obter os dados do documento
                const dadosFuncionario = docSnapshot.data();

                // Obter os horários associados ao funcionário
                const horariosRef = collection(db, `funcionarios/${funcionarioId}/horarios`);
                const horariosSnapshot = await getDocs(horariosRef);

                // Mapear os dados dos horários
                const horarios = [];
                horariosSnapshot.forEach((doc) => {
                    const horarioDia = doc.data();
                    Object.values(horarioDia).forEach((horario) => {
                        if (horario) {
                            horarios.push(horario);
                        }
                    });
                });
                // Retornar os detalhes do funcionário e os horários
                return {
                    nome: dadosFuncionario.nome,
                    sobrenome: dadosFuncionario.sobrenome,
                    escala: dadosFuncionario.escala,
                    horarios: horarios
                };
            } else {
                throw new Error(`Funcionário com ID ${funcionarioId} não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao obter detalhes do funcionário: ', error);
            throw error; // Propagar o erro para quem chama a função, se necessário
        }
    }

});