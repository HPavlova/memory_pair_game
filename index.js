const images = [
  "clover.png",
  "duck.png",
  "eye.png",
  "fish.png",
  "flower.png",
  "frog.png",
  "mushroom.png",
  "sun.png",
];

const backImg = "back.png";

const playingField = [
  [4, 2],
  [4, 3],
  [4, 4],
];

const levelButtons = document.querySelectorAll("#level-buttons button");
const gameBoard = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");

let selectedLevel = null;
let firstCard = null;
let secondCard = null;
let shuffleImages = [];

let numMatches = 0;

function shuffle(array) {
  array.sort(function () {
    return 0.5 - Math.random();
  });

  return array;
}

function init(rows, columns) {
  const cardsQuantity = (rows * columns) / 2;
  const newImages = [];

  while (newImages.length < cardsQuantity) {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    if (!newImages.includes(randomImage)) {
      newImages.push(randomImage);
    }
  }

  shuffleImages = shuffle(newImages.concat(newImages));

  gameBoard.innerHTML = "";
  numMatches = 0;

  for (let i = 0; i < shuffleImages.length; i++) {
    let card = document.createElement("div");
    let cardFront = document.createElement("div");
    let cardBack = document.createElement("div");

    let image = document.createElement("img");
    image.src = `./images/${shuffleImages[i]}`;
    image.alt = `${shuffleImages[i]}`.split('.')[0];

    let backImage = document.createElement("img");
    backImage.src = `./images/${backImg}`;
    backImage.alt = `${backImg}`.split('.')[0];

    card.classList.add("card");
    card.dataset.image = shuffleImages[i];
    card.addEventListener("click", handleCardClick);

    cardFront.classList.add("card-front");
    cardFront.appendChild(backImage);

    cardBack.classList.add("card-back");
    cardBack.appendChild(image);

    card.appendChild(cardFront);
    card.appendChild(cardBack);

    gameBoard.appendChild(card);
  }
}

levelButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    selectedLevel = index;
  });
});

resetButton.addEventListener("click", () => {
  if (selectedLevel !== null) {
    const rows = playingField[selectedLevel][0];
    const columns = playingField[selectedLevel][1];

    resetButton.classList.add("button-disabled");

    init(rows, columns);
  } else {
    alert("Select a level!");
  }
});

function handleCardClick() {
  if (
    this.classList.contains("is-flipped") ||
    this.classList.contains("is-matched")
  ) {
    return;
  }

  this.classList.add("is-flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  if (firstCard.dataset.image === secondCard.dataset.image) {
    disableCards();
    numMatches++;

    if (numMatches === shuffleImages.length / 2) {
      setTimeout(function () {
        alert("You win!");
        gameBoard.innerHTML = "";
        selectedLevel = null;
        resetButton.classList.remove("button-disabled");
      }, 1000);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add("is-matched");
  secondCard.classList.add("is-matched");

  firstCard.removeEventListener("click", handleCardClick);
  secondCard.removeEventListener("click", handleCardClick);

  resetBoard();
}

function unflipCards() {
  setTimeout(function () {
    firstCard.classList.remove("is-flipped");
    secondCard.classList.remove("is-flipped");

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
}
