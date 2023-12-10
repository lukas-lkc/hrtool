//espera que o DOM seja carregado
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { app, auth } from "./firebaseConfig.js";
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

    ///////// #1 Verificar autenticação do user
    onAuthStateChanged(auth, function (user) {
        if (user) {
            //O usuário está autenticado
            console.log('Logado com email:', user.email);
        } else {
            //O usuário não está autenticado
            console.log('Deslogado');
            window.location.href = './login/login.html';
        }
    });

    //////// #2 sair////////
    // Adicione um ouvinte de evento de clique ao link "Sair"
    const sairLink = document.querySelector(".sair");
    sairLink.addEventListener('click', function (event) {
        event.preventDefault(); // Evite o comportamento padrão do link

        // Faça logout do usuário
        signOut(auth).then(() => {
            console.log('Usuário deslogado com sucesso.');
            //cai na verificação de autenticação #1
        }).catch((error) => {
            console.error('Erro ao deslogar:', error);
        });
    });
    ///////////////////
    /////#3 side-bar//////
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

    //////////#4 slider/////////
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
    /////#5 salvar dados/////
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
                // Obtém o ID do usuário autenticado
                const user = auth.currentUser;
                const userId = user ? user.uid : null;

                if (userId) {
                    // Adiciona o funcionário à coleção "funcionarios"
                    const funcionarioRef = await addDoc(collection(db, "funcionarios"), {
                        nome: nomeFunc,
                        sobrenome: sobrenomeFunc,
                        escala: hrEscala,
                    });

                    funcionarioId = funcionarioRef.id;

                    // Cria um documento na coleção "tasks" para associar o usuário ao funcionário
                    await addDoc(collection(db, "tasks"), {
                        userId: userId,
                        funcionarioId: funcionarioId,
                    });

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
                    console.error("Usuário não autenticado.");
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
    ////#6 disa semana/////

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
    ////#7 calcular hora extra////
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

    /////////////////////////
    ///#8 Função para obter todos os IDs dos funcionários associados ao usuário logado
    async function obterTodosIdsFuncionariosDoUsuarioLogado(userId) {
        const idsFuncionarios = [];

        const tasksRef = collection(db, "tasks");
        const queryTasks = query(tasksRef, where("userId", "==", userId));

        const querySnapshot = await getDocs(queryTasks);

        querySnapshot.forEach((doc) => {
            idsFuncionarios.push(doc.data().funcionarioId);
        });

        return idsFuncionarios;
    }

    // Função para carregar detalhes dos funcionários associados ao usuário logado
    async function carregarDetalhesFuncionariosDoUsuarioLogado(userId, detalhesFuncionariosDiv) {
        try {
            const idsFuncionarios = await obterTodosIdsFuncionariosDoUsuarioLogado(userId);

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
    }

    const detalhesFuncionariosDiv = document.getElementById("detalhesFuncionarios");
    registrarBtn3.addEventListener("click", async function () {
        try {
            const user = auth.currentUser;
            const userId = user ? user.uid : null;

            if (userId) {
                await carregarDetalhesFuncionariosDoUsuarioLogado(userId, detalhesFuncionariosDiv);
            } else {
                console.error("Usuário não autenticado.");
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes dos funcionários: ', error);
        }
    });


    ////////////////////////////////////
    // #8 Função para excluir um funcionário do Firestore
    async function deleteCollection(collectionRef) {
        const snapshot = await getDocs(collectionRef);

        if (snapshot.size === 0) {
            // Quando não há mais documentos para excluir, a função pode retornar
            return;
        }

        // Excluir documentos em lotes
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Recursivamente excluir o próximo lote
        return deleteCollection(collectionRef);
    }

    async function excluirFuncionario(funcionarioId) {
        try {
            // Consultar a coleção "tasks" para encontrar a tarefa associada ao usuário e ao funcionário
            const tasksQuery = query(collection(db, 'tasks'), where('funcionarioId', '==', funcionarioId));
            const tasksSnapshot = await getDocs(tasksQuery);

            // Excluir a tarefa se ela existir
            if (!tasksSnapshot.empty) {
                const taskId = tasksSnapshot.docs[0].id;
                const taskDocRef = doc(db, 'tasks', taskId);
                await deleteDoc(taskDocRef);
            }

            // Referência para a coleção horarios do funcionário
            const funcionarioHorariosRef = collection(db, `funcionarios/${funcionarioId}/horarios`);
            // Excluir horarios do funcionário
            await deleteCollection(funcionarioHorariosRef);

            // Referência para o documento específico do funcionário
            const funcionarioDocRef = doc(db, 'funcionarios', funcionarioId);
            // Excluir funcionário
            await deleteDoc(funcionarioDocRef);

            console.log(`Funcionário com ID ${funcionarioId} excluído com sucesso.`);
        } catch (error) {
            console.error('Erro ao excluir a subcoleção "horarios" do funcionário:', error);
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