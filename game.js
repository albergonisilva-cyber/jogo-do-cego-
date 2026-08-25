const surdoBtn = document.getElementById("surdoBtn");
const cegoBtn = document.getElementById("cegoBtn");
const game = document.getElementById("game");
const modeTitle = document.getElementById("modeTitle");
const instruction = document.getElementById("instruction");
const progress = document.getElementById("progress");
const challenge = document.getElementById("challenge");
const controls = document.getElementById("controls");
const restart = document.getElementById("restart");
const back = document.getElementById("back");

const palavras = [
  "ÁGUA", "ÁRVORE", "CASA", "ESCOLA", "FLOR",
  "SOL", "LIVRO", "AMIGO", "BOLA", "ANIMAL"
];

const texturas = [
  { nome: "lisa", simbolo: "━━━", descricao: "superfície lisa" },
  { nome: "rugosa", simbolo: "▒▒▒", descricao: "superfície rugosa" },
  { nome: "ondulada", simbolo: "≈≈≈", descricao: "superfície ondulada" },
  { nome: "pontilhada", simbolo: "•••", descricao: "superfície com pontos" }
];

let modo = null;
let bandeira = 0;
let recompensas = 0;
let posicao = 0;
let caminho = [];

function falar(texto) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "pt-BR";
  voz.rate = 0.95;
  window.speechSynthesis.speak(voz);
}

function abrirModo(novoModo) {
  modo = novoModo;
  game.hidden = false;
  surdoBtn.parentElement.hidden = true;
  iniciar();
}

function iniciar() {
  bandeira = 0;
  recompensas = 0;
  posicao = 0;
  caminho = criarCaminho();

  if (modo === "surdo") iniciarSurdo();
  else iniciarCego();
}

function criarCaminho() {
  // Dez pontos, com três recompensas espalhadas pelo percurso.
  return [
    texturas[0], texturas[0], texturas[1], texturas[1],
    texturas[2], texturas[2], texturas[3], texturas[3],
    texturas[1], texturas[0]
  ];
}

function atualizarProgresso() {
  progress.innerHTML = `<strong>Progresso:</strong> ${bandeira}/10 bandeirinhas &nbsp; | &nbsp; <strong>Recompensas:</strong> ${recompensas}/3`;
}

function iniciarSurdo() {
  modeTitle.textContent = "Percurso para pessoa surda";
  instruction.textContent = "Em cada uma das 10 bandeirinhas, sorteie uma carta, veja a palavra e faça o sinal em Libras. Depois, confirme para continuar.";
  atualizarProgresso();
  mostrarBandeira();
}

function mostrarBandeira() {
  if (bandeira >= 10) {
    finalizar();
    return;
  }

  const palavra = palavras[bandeira];
  challenge.innerHTML = `
    <div class="flag">🚩</div>
    <h3>Bandeirinha ${bandeira + 1}</h3>
    <p>🎴 Carta sorteada:</p>
    <div class="card" tabindex="0" aria-label="Palavra da carta: ${palavra}">${palavra}</div>
    <p>Faça o sinal correspondente em Libras e pressione o botão abaixo.</p>
    <button id="confirmSign">Já fiz o sinal ✓</button>
  `;

  controls.innerHTML = "";
  document.getElementById("confirmSign").addEventListener("click", () => {
    bandeira++;
    atualizarProgresso();
    mostrarBandeira();
  });
}

function iniciarCego() {
  modeTitle.textContent = "Percurso para pessoa cega";
  instruction.textContent = "Use as setas ou os botões para seguir a trilha. Cada mudança de textura indica um novo trecho. Existem três recompensas ao longo do caminho.";
  atualizarProgresso();
  mostrarTextura();
  falar("Percurso para pessoa cega iniciado. Use as setas para avançar e descubra a textura de cada trecho.");
}

function mostrarTextura() {
  if (posicao >= 10) {
    finalizar();
    return;
  }

  const textura = caminho[posicao];
  const mudou = posicao === 0 || caminho[posicao - 1].nome !== textura.nome;

  challenge.innerHTML = `
    <div class="texture" aria-label="Textura atual: ${textura.descricao}">${textura.simbolo}</div>
    <h3>Trecho ${posicao + 1} de 10</h3>
    <p>${mudou ? "Mudança de textura! " : ""}${textura.descricao}.</p>
    <p>Escolha o caminho correto para avançar.</p>
  `;

  controls.innerHTML = `
    <button class="move" data-dir="esquerda">← Esquerda</button>
    <button class="move" data-dir="frente">↑ Frente</button>
    <button class="move" data-dir="direita">→ Direita</button>
  `;

  document.querySelectorAll(".move").forEach(button => {
    button.addEventListener("click", () => escolherCaminho(button.dataset.dir));
  });

  falar(`Trecho ${posicao + 1}. Textura ${textura.nome}. Escolha o caminho correto.`);
}

function escolherCaminho(direcao) {
  // A resposta correta varia a cada trecho, evitando decorar uma única sequência.
  const correto = ["frente", "direita", "esquerda", "frente", "direita", "frente", "esquerda", "direita", "frente", "frente"][posicao];

  if (direcao !== correto) {
    instruction.textContent = "Esse não é o caminho correto. Tente novamente, usando a textura como pista.";
    falar("Caminho incorreto. Tente novamente.");
    return;
  }

  posicao++;
  bandeira = posicao;

  if ([3, 6, 9].includes(posicao)) {
    recompensas++;
    falar(`Parabéns! Você encontrou a recompensa ${recompensas} de 3.`);
    instruction.textContent = `Você encontrou a recompensa ${recompensas} de 3! Continue pela trilha.`;
  }

  atualizarProgresso();
  mostrarTextura();
}

function finalizar() {
  challenge.innerHTML = `
    <div class="finish">🏆</div>
    <h3>Fim da trilha!</h3>
    <p>Você chegou ao final com <strong>${recompensas}/3 recompensas</strong>.</p>
    <p>${recompensas === 3 ? "Objetivo concluído! Você conquistou as três recompensas." : "Tente novamente para conquistar todas as três recompensas."}</p>
  `;
  controls.innerHTML = "";
  instruction.textContent = "Percurso concluído.";
  falar(recompensas === 3 ? "Parabéns! Você chegou ao final com as três recompensas." : "Percurso concluído. Você pode tentar novamente.");
}

function voltarMenu() {
  window.speechSynthesis?.cancel();
  modo = null;
  game.hidden = true;
  surdoBtn.parentElement.hidden = false;
}

surdoBtn.addEventListener("click", () => abrirModo("surdo"));
cegoBtn.addEventListener("click", () => abrirModo("cego"));
restart.addEventListener("click", iniciar);
back.addEventListener("click", voltarMenu);

document.addEventListener("keydown", event => {
  if (modo !== "cego" || game.hidden || posicao >= 10) return;

  const mapa = {
    ArrowLeft: "esquerda",
    ArrowUp: "frente",
    ArrowRight: "direita"
  };

  if (mapa[event.key]) {
    event.preventDefault();
    escolherCaminho(mapa[event.key]);
  }
});