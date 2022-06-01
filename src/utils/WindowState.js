module.exports = class WindowState {
  constructor(onFocus) {
    this.onFocus = onFocus;
  }

  setFocus(onFocus) {
    this.onFocus = onFocus;
  }

  getFocus() {
    return this.onFocus;
  }
};
