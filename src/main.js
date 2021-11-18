'use strict';

import Popup from './popup';
const CARROT__SIZE = 80;
const CARROT__COUNT = 5;
const BUG__COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gamescore = document.querySelector('.game__score');
const gametimer = document.querySelector('.game__timer');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');
let started = false; //시작은 정지상태이기 때문에 false로 시작한다.
let score = 0;
let timer = undefined;

const gameFinishBanner = new Popup();
gameFinishBanner.addEventListener(() => {
  startGame();
});
field.addEventListener('click', onFieldClick);
gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  gameFinishBanner.showPopUpWithText('Replay?');
  playSound(alertSound);
  stopSound(bgSound);
}
function startGame() {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function finishGame(win) {
  started = false;
  hideGameButton();
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopSound(bgSound);
  stopGameTimer(timer);
  gameFinishBanner.showPopUpWithText(win ? 'You won!' : 'You lost');
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}
function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gamescore.style.visibility = 'visible';
  gametimer.style.visibility = 'visible';
}
function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT__COUNT);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}
function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gametimer.innerText = `${minutes}:${seconds}`;
}
function initGame() {
  //초기화
  field.innerHTML = '';
  score = 0;
  gamescore.innerText = 5;
  //벌레와 당근을 만들어 field에 넣음
  addItem('carrot', 5, 'img/carrot.png');
  addItem('bug', 5, 'img/bug.png');
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT__SIZE;
  const y2 = fieldRect.height - CARROT__SIZE;

  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    playSound(carrotSound);
    if (score === CARROT__COUNT) {
      finishGame(true);
    }
    updateScoreBoard();
  } else if (target.matches('.bug')) {
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
function stopSound(sound) {
  sound.pause();
}
function updateScoreBoard() {
  gamescore.innerText = CARROT__COUNT - score;
}
