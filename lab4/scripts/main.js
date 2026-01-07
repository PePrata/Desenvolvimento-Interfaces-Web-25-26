let texto = document.getElementById('texto');
let imagem = document.getElementById('imagem');
let btn1 = document.getElementById('btn1');
let btn2 = document.getElementById('btn2');
let btn3 = document.getElementById('btn3');
let caixa = document.getElementById('caixa');
let contador = document.getElementById('contador');
let btnContador = document.getElementById('btnContador');

let numero = 0;

btn1.addEventListener('click', function() {
    texto.textContent = 'Clicaste no Botão 1!';
    texto.style.color = 'red';
});

btn2.addEventListener('click', function() {
    texto.textContent = 'Clicaste no Botão 2!';
    texto.style.color = 'blue';
});

btn3.addEventListener('dblclick', function() {
    texto.textContent = 'Fizeste duplo clique no Botão 3!';
    texto.style.color = 'green';
});

caixa.addEventListener('mouseover', function() {
    caixa.style.backgroundColor = 'yellow';
    caixa.textContent = 'Rato em cima!';
});

caixa.addEventListener('mouseout', function() {
    caixa.style.backgroundColor = 'lightblue';
    caixa.textContent = 'Passa o rato aqui!';
});

imagem.addEventListener('mousemove', function() {
    imagem.style.border = '5px solid orange';
});

imagem.addEventListener('mouseout', function() {
    imagem.style.border = '2px solid #333';
});

btnContador.addEventListener('click', function() {
    numero++;
    contador.textContent = numero;
});
