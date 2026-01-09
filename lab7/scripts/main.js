const listaProdutos = document.getElementById("produtos-lista");
const cestoContainer = document.getElementById("cesto-produtos");
const totalElemento = document.getElementById("total");
const totalApiElemento = document.getElementById("total-api");
const referenciaApiElemento = document.getElementById("referencia-api");

const selectCategoria = document.getElementById("filtro-categoria");
const selectOrdenacao = document.getElementById("ordenacao-preco");
const checkboxEstudante = document.getElementById("estudante");
const botaoCalcularTotal = document.getElementById("calcular-total");
const inputNome = document.getElementById("nome-cliente");
const inputCupao = document.getElementById("cupao");

let cestoProdutos = [];
let todosProdutos = [];


fetch("https://deisishop.pythonanywhere.com/products/")
  .then(res => res.json())
  .then(produtos => {
    todosProdutos = produtos;
    carregarCategorias(produtos);
    carregarProdutos(produtos);
  })
  .catch(() => {
    listaProdutos.innerHTML = "<p>Erro ao carregar produtos.</p>";
  });

function carregarCategorias(produtos) {
  const categorias = [...new Set(produtos.map(p => p.category))];

  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    selectCategoria.appendChild(option);
  });

  selectCategoria.onchange = aplicarFiltros;
  selectOrdenacao.onchange = aplicarFiltros;
}

function aplicarFiltros() {
  let produtos = [...todosProdutos];

  if (selectCategoria.value) {
    produtos = produtos.filter(p => p.category === selectCategoria.value);
  }

  if (selectOrdenacao.value === "asc") {
    produtos.sort((a, b) => a.price - b.price);
  } else if (selectOrdenacao.value === "desc") {
    produtos.sort((a, b) => b.price - a.price);
  }

  carregarProdutos(produtos);
}

function carregarProdutos(produtos) {
  listaProdutos.innerHTML = "";
  produtos.forEach(produto => {
    listaProdutos.appendChild(criarProduto(produto));
  });
}

function criarProduto(produto) {
  const article = document.createElement("article");
  article.innerHTML = `
    <img src="${produto.image}" alt="${produto.title}">
    <p class="categoria">Categoria: ${produto.category}</p>
    <p class="preco">${parseFloat(produto.price).toFixed(2)} €</p>
  `;

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao cesto";
  botao.onclick = () => adicionarAoCesto(produto);
  article.appendChild(botao);

  return article;
}

function adicionarAoCesto(produto) {
  cestoProdutos.push(produto);
  atualizaCesto();
}

function removerDoCesto(id) {
  const index = cestoProdutos.findIndex(p => p.id === id);
  if (index !== -1) {
    cestoProdutos.splice(index, 1);
    atualizaCesto();
  }
}

function atualizaCesto() {
  if (cestoProdutos.length === 0) {
    cestoContainer.innerHTML = "<p>O cesto está vazio</p>";
    totalElemento.textContent = "Subtotal: 0.00 €";
    return;
  }

  cestoContainer.innerHTML = "";
  let subtotal = 0;

  cestoProdutos.forEach(produto => {
    const article = document.createElement("article");
    article.innerHTML = `
      <h3>${produto.title}</h3>
      <img src="${produto.image}" alt="${produto.title}">
      <p class="preco">${parseFloat(produto.price).toFixed(2)} €</p>
    `;

    const botao = document.createElement("button");
    botao.textContent = "Remover";
    botao.onclick = () => removerDoCesto(produto.id);
    article.appendChild(botao);

    cestoContainer.appendChild(article);
    subtotal += parseFloat(produto.price);
  });

  totalElemento.textContent = `Subtotal: ${subtotal.toFixed(2)} €`;
}

function comprar() {
  if (cestoProdutos.length === 0) {
    alert("O cesto está vazio!");
    return;
  }

  const produtosIds = cestoProdutos.map(p => p.id);

  const body = {
    products: produtosIds,
    student: checkboxEstudante.checked,
    coupon: inputCupao.value.trim() || "",
    name: inputNome.value.trim() || ""
  };

  fetch("https://deisishop.pythonanywhere.com/buy/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      totalApiElemento.style.color = 'black'
      referenciaApiElemento.style.color = 'black'
      totalApiElemento.textContent = `Total final (Após descontos): ${data.totalCost} €`;
      referenciaApiElemento.textContent = `Referência: ${data.reference}`;
    })
    .catch(() => {
      alert("Erro ao comunicar com a API.");
    });
}

botaoCalcularTotal.onclick = comprar;
atualizaCesto();

