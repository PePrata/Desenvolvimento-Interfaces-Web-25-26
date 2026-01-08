const listaProdutos = document.getElementById("produtos-lista");
const cestoContainer = document.getElementById("cesto-produtos");
const totalElemento = document.getElementById("total");

let cestoProdutos = [];

function fetchProdutos() {
  fetch("https://deisishop.pythonanywhere.com/products/")
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
      listaProdutos.innerHTML = "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
    });
}

function carregarProdutos(produtos) {
  listaProdutos.innerHTML = "";
  
  produtos.forEach(produto => {
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

  const categoria = document.createElement("p");
  categoria.textContent = `Categoria: ${produto.category}`;
  categoria.classList.add("categoria");

  const preco = document.createElement("p");
  preco.textContent = `${parseFloat(produto.price).toFixed(2)} €`;
  preco.classList.add("preco");

  const botaoAdicionar = document.createElement("button");
  botaoAdicionar.textContent = "+ Adicionar ao cesto";

  botaoAdicionar.addEventListener("click", function () {
    adicionarAoCesto(produto);
  });

  article.appendChild(titulo);
  article.appendChild(imagem);
  article.appendChild(descricao);
  article.appendChild(categoria);
  article.appendChild(preco);
  article.appendChild(botaoAdicionar);

  return article;
}

function adicionarAoCesto(produto) {
  cestoProdutos.push(produto);
  atualizaCesto();
  console.log("Produto adicionado:", produto);
}

function atualizaCesto() {
  cestoContainer.innerHTML = "";

  let total = 0;

  if (cestoProdutos.length === 0) {
    cestoContainer.innerHTML = "<p>O cesto está vazio</p>";
    totalElemento.textContent = "Custo total: 0.00 €";
    return;
  }

  cestoProdutos.forEach(produto => {
    const artigoCesto = criaProdutoCesto(produto);
    cestoContainer.appendChild(artigoCesto);
    total += parseFloat(produto.price);
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
  preco.textContent = `${parseFloat(produto.price).toFixed(2)} €`;
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
  const index = cestoProdutos.findIndex(
    produto => produto.id === idProduto
  );

  if (index !== -1) {
    cestoProdutos.splice(index, 1);
  }

  atualizaCesto();
}

function finalizarCompra(nomeCliente, isEstudante = false, cupom = "") {
  const produtosIds = cestoProdutos.map(produto => produto.id);

  const dadosCompra = {
    products: produtosIds,
    student: isEstudante,
    coupon: cupom,
    name: nomeCliente
  };

  fetch("https://deisishop.pythonanywhere.com/buy/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dadosCompra)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao finalizar compra");
      }
      return response.json();
    })
    .then(resultado => {
      console.log("Compra finalizada:", resultado);
      alert(`Compra realizada com sucesso!\nTotal: ${resultado.totalCost} €\nReferência: ${resultado.reference}\n${resultado.message}`);
      
      cestoProdutos = [];
      atualizaCesto();
    })
    .catch(error => {
      console.error("Erro ao finalizar compra:", error);
      alert("Erro ao finalizar a compra. Tente novamente.");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchProdutos();
  atualizaCesto();
});