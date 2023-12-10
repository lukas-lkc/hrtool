// alterarPath.js
console.log('ola');
// Mapeia o nome da página para o novo caminho desejado
const pathMapping = {
  '/index.html': '/novo-caminho/pagina1',
  '/caminho/atual/pagina2/index.html': '/novo-caminho/pagina2',
  '/caminho/atual/pagina3/index.html': '/novo-caminho/pagina3',
  // Adicione mais páginas conforme necessário
};

// Função para obter o caminho mapeado com base no nome da página
function getMappedPath(pageName) {
  const mappedPath = pathMapping[pageName];
  return mappedPath ? mappedPath : pageName; // Se não houver mapeamento, use o nome da página como está
}

// Função para redirecionar para a página mapeada
function redirectToMappedPage(pageName) {
  const mappedPath = getMappedPath(pageName);
  window.location.href = `./${mappedPath}/index.html`; // Corrigido para adicionar uma barra antes de "index.html"
}
