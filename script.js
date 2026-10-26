"use strict";


/* -------------------------------------------------- */
/* MOT DE PASSE : SEULE LIGNE À COMPLÉTER               */
/* -------------------------------------------------- */

// À COMPLÉTER : écris ton mot de passe entre les guillemets.
const PASSWORD = "котик";

// INFO : tant que les guillemets sont vides, l’accès reste bloqué.

// INFO : ce mot de passe est consultable dans le code du site.
// Il sert de filtre visuel et ne protège pas un contenu confidentiel.


/* -------------------------------------------------- */
/* RÉCUPÉRATION DES ÉLÉMENTS DU FICHIER HTML            */
/* -------------------------------------------------- */

// INFO : ces noms correspondent aux identifiants de ton HTML.
// Conserve toutes les lignes de cette partie.

const gate = document.querySelector("#gate");
const letterPage = document.querySelector("#letter-page");

const passwordForm = document.querySelector("#password-form");
const passwordInput = document.querySelector("#password");
const passwordMessage = document.querySelector("#password-message");

const letterTitle = document.querySelector("#letter-title");
const particlesContainer = document.querySelector(".particles");

const music = document.querySelector("#music");
const playButton = document.querySelector("#play-button");
const mediaMessage = document.querySelector("#media-message");

const lockButton = document.querySelector("#lock-button");


/* -------------------------------------------------- */
/* CRÉATION DES PARTICULES                             */
/* -------------------------------------------------- */

// INFO : les mouvements eux-mêmes sont définis dans style.css.
// Ce script crée les particules et varie leur vitesse.

// PERSONNALISATION FACULTATIVE : nombre de particules.
const PARTICLE_COUNT = 32;

// INFO : évite de créer des particules si le visiteur
// a demandé une réduction des mouvements sur son appareil.
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (!reducedMotion.matches) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";

    // INFO : position horizontale aléatoire.
    particle.style.left = `${Math.random() * 100}%`;

    // INFO : chaque particule traverse l’écran en 15 à 35 secondes.
    particle.style.animationDuration =
      `${15 + Math.random() * 20}s`;

    // INFO : répartit les particules dans l’écran dès le départ.
    particle.style.animationDelay =
      `${-Math.random() * 35}s`;

    particlesContainer.appendChild(particle);
  }
}


/* -------------------------------------------------- */
/* VÉRIFICATION DU MOT DE PASSE                        */
/* -------------------------------------------------- */

// INFO : fonctionne avec le bouton "Entrer"
// et avec la touche Entrée du clavier.

passwordForm.addEventListener("submit", function (event) {
  // INFO : empêche le formulaire de recharger la page.
  event.preventDefault();

  // INFO : bloque l’ouverture si tu n’as pas choisi de mot de passe.
  if (PASSWORD === "") {
    passwordMessage.textContent =
      "Ajoute d’abord ton mot de passe dans script.js.";

    return;
  }

  // INFO : affiche un message si le mot de passe est incorrect.
  if (passwordInput.value !== PASSWORD) {
    passwordMessage.textContent = "Mot de passe incorrect.";

    passwordInput.setAttribute("aria-invalid", "true");
    passwordInput.focus();

    return;
  }

  // INFO : efface le message et le mot de passe saisi.
  passwordMessage.textContent = "";
  passwordInput.removeAttribute("aria-invalid");
  passwordInput.value = "";

  // INFO : masque le premier écran et affiche la lettre.
  gate.hidden = true;
  letterPage.hidden = false;

  // INFO : revient en haut de la page et place le clavier sur le titre.
  window.scrollTo(0, 0);
  letterTitle.focus({ preventScroll: true });
});


// INFO : retire le message d’erreur lorsque le visiteur
// commence à saisir une nouvelle réponse.

passwordInput.addEventListener("input", function () {
  passwordMessage.textContent = "";
  passwordInput.removeAttribute("aria-invalid");
});


/* -------------------------------------------------- */
/* APPARENCE DU BOUTON MUSICAL                         */
/* -------------------------------------------------- */

// INFO : adapte le texte du bouton à l’état de la musique.

function updatePlayerButton() {
  const isPlaying = !music.paused && !music.ended;

  if (isPlaying) {
    playButton.textContent = "Pause Me Ⅱ";
  } else {
    playButton.textContent = "Play Me ▷";
  }

  playButton.setAttribute("aria-pressed", String(isPlaying));
}


/* -------------------------------------------------- */
/* LECTURE ET PAUSE DE LA MUSIQUE                      */
/* -------------------------------------------------- */

// INFO : le chemin du fichier musical est déjà indiqué
// dans index.html : assets/musique.mp4.

// INFO : la musique démarre uniquement après un clic.
// Elle ne se lance pas automatiquement à l’ouverture de la lettre.

playButton.addEventListener("click", async function () {
  // INFO : met en pause si la musique est déjà en cours.
  if (!music.paused) {
    music.pause();
    return;
  }

  mediaMessage.textContent = "";

  // INFO : évite plusieurs clics pendant le démarrage de la lecture.
  playButton.disabled = true;
  playButton.textContent = "Chargement…";

  try {
    await music.play();

    mediaMessage.textContent = "";
  } catch (error) {
    // INFO : une fermeture de la lettre peut interrompre
    // normalement le démarrage de la musique.
    if (error.name !== "AbortError" && !letterPage.hidden) {
      mediaMessage.textContent =
        "Lecture impossible. Vérifie le fichier " +
        "assets/musique.mp4 et son format audio.";
    }
  } finally {
    playButton.disabled = false;
    updatePlayerButton();
  }
});


// INFO : garde le bouton synchronisé avec la lecture.

music.addEventListener("play", updatePlayerButton);
music.addEventListener("pause", updatePlayerButton);
music.addEventListener("ended", updatePlayerButton);


// INFO : prévient le visiteur si le fichier ne peut pas être lu.

music.addEventListener("error", function () {
  if (!letterPage.hidden) {
    mediaMessage.textContent =
      "Le fichier musical est introuvable " +
      "ou son format est incompatible.";
  }

  playButton.disabled = false;
  updatePlayerButton();
});


/* -------------------------------------------------- */
/* FERMETURE DE LA LETTRE                              */
/* -------------------------------------------------- */

lockButton.addEventListener("click", function () {
  // INFO : arrête la musique.
  music.pause();

  // INFO : remet la musique au début si elle a déjà été chargée.
  if (music.readyState > 0) {
    music.currentTime = 0;
  }

  // INFO : masque la lettre et réaffiche le premier écran.
  letterPage.hidden = true;
  gate.hidden = false;

  // INFO : réinitialise les messages et les boutons.
  mediaMessage.textContent = "";
  passwordMessage.textContent = "";
  passwordInput.value = "";
  passwordInput.removeAttribute("aria-invalid");

  playButton.disabled = false;
  updatePlayerButton();

  // INFO : revient en haut et permet de saisir le mot de passe.
  window.scrollTo(0, 0);
  passwordInput.focus({ preventScroll: true });
});
