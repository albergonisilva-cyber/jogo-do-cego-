const startButton = document.getElementById("start");
const repeatButton = document.getElementById("repeat");
const statusText = document.getElementById("status");
const timerText = document.getElementById("timer");

let playerX = 5;
let playerY = 5;

let targetX;
let targetY;

let timeLeft = 60;
let timer;
let playing = false;

let audioContext;

// Fala usando o leitor de voz do navegador
function falar(texto) {
  window.speechSynthesis.cancel();

  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "pt-BR";
  voz.rate = 1;

  window.speechSynthesis.speak(voz);
}

// Cria um som
function som(frequencia = 440, duracao = 0.12, volume = 0.15) {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.frequency.value = frequencia;
  oscillator.type = "sine";

  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duracao
  );

  oscillator.stop(audioContext.currentTime + duracao);
}

// Começa uma partida
function iniciarJogo() {
  playing = true;

  playerX = 5;
  playerY = 5;

  targetX = Math.floor(Math.random() * 10);
  targetY = Math.floor(Math.random() * 10);

  timeLeft = 60;

  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;

    timerText.textContent = `Tempo: ${timeLeft}`;

    if (timeLeft <= 0) {
      finalizarJogo(false);
    }
  }, 1000);

  startButton.disabled = true;
  repeatButton.disabled = false;

  falar(
    "Jogo iniciado. Use as setas do teclado para encontrar o alvo. " +
    "Quanto mais perto você estiver, mais rápido ficará o som."
  );

  atualizarSom();
}

// Calcula a distância até o alvo
function distancia() {
  const dx = targetX - playerX;
  const dy = targetY - playerY;

  return Math.sqrt(dx * dx + dy * dy);
}

// Atualiza o som de acordo com a distância
function atualizarSom() {
  if (!playing) return;

  const d = distancia();

  if (d === 0) {
    som(1000, 0.3, 0.3);
    finalizarJogo(true);
    return;
  }

  // Quanto menor a distância, maior a frequência
  const frequencia = Math.max(200, 1000 - d * 70);

  som(frequencia, 0.12, 0.15);
}

// Movimento do jogador
function mover(dx, dy) {
  if (!playing) return;

  playerX += dx;
  playerY += dy;

  // Mantém o jogador dentro do mapa
  playerX = Math.max(0, Math.min(9, playerX));
  playerY = Math.max(0, Math.min(9, playerY));

  atualizarSom();
}

// Finaliza o jogo
function finalizarJogo(vitoria) {
  playing = false;

  clearInterval(timer);

  startButton.disabled = false;

  if (vitoria) {
    statusText.textContent = "Você encontrou o alvo!";
    falar("Parabéns! Você encontrou o alvo. Você venceu!");
    som(1000, 0.3, 0.3);

    setTimeout(() => som(1300, 0.3, 0.3), 250);
  } else {
    statusText.textContent = "O tempo acabou.";
    falar("O tempo acabou. Tente novamente.");
  }
}

// Teclado
document.addEventListener("keydown", (event) => {
  if (!playing) return;

  switch (event.key) {
    case "ArrowUp":
      event.preventDefault();
      mover(0, -1);
      break;

    case "ArrowDown":
      event.preventDefault();
      mover(0, 1);
      break;

    case "ArrowLeft":
      event.preventDefault();
      mover(-1, 0);
      break;

    case "ArrowRight":
      event.preventDefault();
      mover(1, 0);
      break;

    case " ":
      event.preventDefault();

      const d = Math.round(distancia());

      falar(
        `Você está a aproximadamente ${d} casas do alvo.`
      );

      break;
  }
});

// Botão iniciar
startButton.addEventListener("click", () => {
  iniciarJogo();
});

// Repetir instruções
repeatButton.addEventListener("click", () => {
  falar(
    "Use as setas para se movimentar. " +
    "O som fica mais agudo quando você se aproxima do alvo. " +
    "Pressione espaço para saber sua distância."
  );
});