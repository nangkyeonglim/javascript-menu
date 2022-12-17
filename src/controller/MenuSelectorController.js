const Coach = require('../models/Coach');
const MenuSelector = require('../models/MenuSelector');
const InputView = require('../views/InputView');
const OutputView = require('../views/OutputView');

class MenuSelectorController {
  #menuSelector;
  #tempDislikeMenu = [];

  start() {
    OutputView.printInitialMessage();
    this.#readCoachNamesPhase();
  }

  #readCoachNamesPhase() {
    InputView.readCoachNames(this.#registerCoachPhase.bind(this));
  }

  //["토미,제임스" Coach(토미), Coach(제임스), ..]
  #registerCoachPhase(names) {
    this.#menuSelector = new MenuSelector(
      names.split(',').map((name) => {
        return new Coach(name);
      })
    );
    this.#startReadingDislikePhase(this.#menuSelector.getCoachs());
  }

  #startReadingDislikePhase(coachs) {
    this.personNumber = 0;
    this.#readDislikeMenuPhase(coachs[0].getName());
  }

  #readDislikeMenuPhase(name) {
    InputView.readDislikeMenu(name, this.#registerDislikeMenuPhase.bind(this));
  }

  #registerDislikeMenuPhase(menu) {
    this.#tempDislikeMenu.push(menu);
    this.personNumber += 1;
    if (this.personNumber !== this.#menuSelector.getCoachs().length) {
      return this.#readDislikeMenuPhase(
        this.#menuSelector.getCoachs()[this.personNumber].getName()
      );
    }
    return this.#resultphase();
  }

  #resultphase() {
    this.#menuSelector
      .getCoachs()
      .forEach((coach, index) =>
        coach.setDislikeMenu(this.#tempDislikeMenu[index])
      );
  }
}

module.exports = MenuSelectorController;
