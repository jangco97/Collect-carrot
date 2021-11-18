'use strict';
import Popup from './popup.js';
import Field from './field.js';
const CARROT__COUNT = 6;
const BUG__COUNT = 6;
const GAME_DURATION_SEC = 10;

const gameBtn = document.querySelector('.game__button');
const gamescore = document.querySelector('.game__score');
const gametimer = document.querySelector('.game__timer');

const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');
let started = false; //시작은 정지상태이기 때문에 false로 시작한다.
let score = 0;
let timer = undefined;

const gameFinishBanner = new Popup();
gameFinishBanner.setClickListener(() => {
  startGame();
});
const gamefield = new Field(CARROT__COUNT, BUG__COUNT);
gamefield.setClickListener(onItemClick);

function onItemClick(item) {
  if (!started) {
    return;
  }
  if (item === 'carrot') {
    score++;
    updateScoreBoard();
    if (score === CARROT__COUNT) {
      finishGame(true);
    }
  } else if (item === 'bug') {
    finishGame(false);
  }
}

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
  score = 0;
  gamescore.innerText = CARROT__COUNT;
  gamefield.init();
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
