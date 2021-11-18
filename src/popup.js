'use strict';

export default class Popup {
  constructor() {
    this.popup = document.querySelector('.pop-up');
    this.refresh = document.querySelector('.pop-up__refresh');
    this.message = document.querySelector('.pop-up__message');
    this.refresh.addEventListener('click', () => {
      this.onClick && this.onClick();
      hide();
    });
  }
  setClickListener(onClick) {
    this.onClick = onClick;
  }
  hide() {
    this.popup.classList.add('.pop-up--hidden');
  }
  showPopUpWithText(text) {
    this.message.innerText = text;
    this.popup.classList.remove('pop-up--hidden');
  }
}
