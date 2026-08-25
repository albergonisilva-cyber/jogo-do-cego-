const secoes = document.querySelectorAll(".secao");
const botoesMenu = document.querySelectorAll(".menu button[data-section]");
const botoesOuvir = document.querySelectorAll(".ouvir");

// Mostra uma seção do aplicativo e esconde as outras.
function mostrarSecao(id) {
  secoes.forEach(secao => {
    secao.classList.toggle("oculto", secao.id !== id);
  });

  const secao = document.getElementById(id);

  if (secao) {
    secao.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Navegação entre as explicações.
botoesMenu.forEach(botao => {
  botao.addEventListener("click", () => {
    mostrarSecao(botao.dataset.section);
  });
});

// Leitura das regras em voz alta para facilitar o acesso ao conteúdo.
function falar(texto) {
  if (!("speechSynthesis" in window)) {
    alert("A leitura em voz alta não está disponível neste navegador.");
    return;
  }

  window.speechSynthesis.cancel();

  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "pt-BR";
  voz.rate = 0.9;
  voz.pitch = 1;

  window.speechSynthesis.speak(voz);
}

botoesOuvir.forEach(botao => {
  botao.addEventListener("click", () => {
    falar(botao.dataset.speak);
  });
});

// Atalho de teclado para parar a leitura.
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});
