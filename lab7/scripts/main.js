const listaProdutos = document.getElementById("produtos-lista");
const cestoContainer = document.getElementById("cesto-produtos");
const totalElemento = document.getElementById("total");


const CHAVE_CESTO = "produtos-selecionados";
if (!localStorage.getItem(CHAVE_CESTO)) {
    localStorage.setItem(CHAVE_CESTO, JSON.stringify([]));
}

function fetchProdutos() {

  fetch("https://deisishop.pythonanywhere.com/api/products/")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar produtos");
      }
      return response.json();
    })
    .then(produtos => {
      console.log("Produtos recebidos da API:", produtos);
      carregarProdutos(produtos);
    })
    .catch(error => {
      console.error("Erro:", error);
    });
}

function carregarProdutos(produtos) {

    produtos.forEach(produto => {

        /*console.log(produto);
        console.log(produto.id);
        console.log(produto.title);*/

        const artigoProduto = criarProduto(produto);

        listaProdutos.appendChild(artigoProduto);
    });
}

function criarProduto(produto) {

    const article = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const descricao = document.createElement("p");
    descricao.textContent = produto.description;
    descricao.classList.add("descricao");

    const preco = document.createElement("p");
    preco.textContent = `${produto.price.toFixed(2)} €`;
    preco.classList.add("preco");

    const botaoAdicionar = document.createElement("button");
    botaoAdicionar.textContent = "+ Adicionar ao cesto";

    botaoAdicionar.addEventListener("click", function () {
    adicionarAoCesto(produto);
    });

    article.appendChild(titulo);
    article.appendChild(imagem);
    article.appendChild(descricao);
    article.appendChild(preco);
    article.appendChild(botaoAdicionar);

    return article;
}

function adicionarAoCesto(produto) {
    const cesto = JSON.parse(localStorage.getItem(CHAVE_CESTO));

    cesto.push(produto);

    localStorage.setItem(CHAVE_CESTO, JSON.stringify(cesto));

    atualizaCesto();
}

function atualizaCesto() {

    const produtosCesto = JSON.parse(localStorage.getItem(CHAVE_CESTO));

    cestoContainer.innerHTML = "";

    let total = 0;


    produtosCesto.forEach(produto => {
        const artigoCesto = criaProdutoCesto(produto);
        cestoContainer.appendChild(artigoCesto);

        total += produto.price;
    });

    totalElemento.textContent = `Custo total: ${total.toFixed(2)} €`;
}

function criaProdutoCesto(produto) {

    const article = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const preco = document.createElement("p");
    preco.textContent = `${produto.price.toFixed(2)} €`;
    preco.classList.add("preco");

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";

    botaoRemover.addEventListener("click", function () {
        removerDoCesto(produto.id);
    });

    article.appendChild(titulo);
    article.appendChild(imagem);
    article.appendChild(preco);
    article.appendChild(botaoRemover);

    return article;
}

function removerDoCesto(idProduto) {

  const produtosCesto = JSON.parse(localStorage.getItem(CHAVE_CESTO));

  const index = produtosCesto.findIndex(
    produto => produto.id === idProduto
  );

  if (index !== -1) {
    produtosCesto.splice(index, 1);
  }

  localStorage.setItem(CHAVE_CESTO, JSON.stringify(produtosCesto));

  atualizaCesto();
}


document.addEventListener("DOMContentLoaded", function () {
    fetchProdutos();
    atualizaCesto();
});