const readline = require("readline-sync");

class Card {
  static SUIT_CODES = {Hearts: 9829, Diamonds: 9830, Clubs: 9827, Spades: 9824};
  static CARD_SIZE = 9;
  static BACK_CARD_DATA = function () {
    let borderStr = ` +${'-'.repeat(Card.CARD_SIZE)}+ `;
    let spaceStr = ` |${' '.repeat(Card.CARD_SIZE)}| `;
    let backStr = ` |${'-'.repeat(Card.CARD_SIZE)}| `;

    return [borderStr, backStr, spaceStr,
      backStr, spaceStr, backStr, borderStr];
  };

  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  getPoints(points) {
    return points[this.rank];
  }

  cardDisplayData() {
    // STUB
    let borderStr = ` +${'-'.repeat(Card.CARD_SIZE)}+ `;
    let spaceStr = ` |${' '.repeat(Card.CARD_SIZE)}| `;

    let suitCode = String.fromCharCode(Card.SUIT_CODES[this.suit]);
    let suitStr1 = ` |${suitCode}        | `;
    let suitStr2 = suitStr1.split('').reverse().join('');

    let rankPad = this.rank.length +
    Math.floor((Card.CARD_SIZE - this.rank.length) / 2);
    let rankStr = ` |${this.rank.padStart(rankPad, ' ')
      .padEnd(Card.CARD_SIZE, ' ')}| `;

    return [borderStr, suitStr1, spaceStr,
      rankStr, spaceStr, suitStr2, borderStr];
  }

  getRank() {
    return this.rank;
  }

  isFaceCard() {
    return ['Jack', 'Queen', 'King'].includes(this.rank);
  }
}

class Deck {
  static RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10',
    'Jack', 'Queen', 'King', 'Ace'];
  static SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

  constructor() {
    this.reset();
  }

  shuffle() {
    for (let fir = 0; fir < this.cards.length; fir += 1) {
      let sec = Math.floor((Math.random() * (this.cards.length - fir)) + fir);
      [this.cards[fir], this.cards[sec]] = [this.cards[sec], this.cards[fir]];
    }
  }

  dealCard() {
    return this.cards.pop();
  }

  reset() {
    this.cards = [];

    Deck.RANKS.forEach(rank => {
      Deck.SUITS.forEach(suit => {
        this.cards.push(new Card(rank, suit));
      });
    });

    this.shuffle();
  }
}

class Participant {
  static MAX_SCORE = 21;
  static FACE_CARD_POINTS = 10;
  static ACES_MAX = 11;
  static ACES_MIN = 1;

  constructor() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.hand = [];
    this.bust = false;
  }

  isBust() {
    return this.bust;
  }

  showCards() {
    let handDisplay = this.hand.map(card => card.cardDisplayData());

    let handDisplayStrings = this.getHandDisplayStrings(handDisplay);

    handDisplayStrings.forEach(str => {
      console.log(str);
    });
  }

  showAllCardsHidden() {
    let handDisplay = [Card.BACK_CARD_DATA(), Card.BACK_CARD_DATA()];

    let handDisplayStrings = this.getHandDisplayStrings(handDisplay);

    handDisplayStrings.forEach(str => {
      console.log(str);
    });
  }

  getHandDisplayStrings(handDisplay) {
    let handDisplayStrings = Array(handDisplay[0].length).fill('');
    for (let fir = 0; fir < handDisplay.length; fir += 1) {
      for (let sec = 0; sec < handDisplay[fir].length; sec += 1) {
        handDisplayStrings[sec] += handDisplay[fir][sec];
      }
    }

    return handDisplayStrings;
  }

  updateBust() {
    // STUB
    this.bust = (this.score > Participant.MAX_SCORE);
  }

  updateHand() {
    this.hand.push(...arguments);
  }

  updateScore() {
    let aces = this.hand.filter(elem => elem.getRank() === 'Ace');
    let notAces = this.hand.filter(elem => elem.getRank() !== 'Ace');

    let score = notAces.reduce((acc, elem) => {
      if (elem.isFaceCard()) {
        return acc + Participant.FACE_CARD_POINTS;
      } else {
        return acc + Number(elem.getRank());
      }
    }, 0);

    for (let idx = 0; idx < aces.length; idx += 1) {
      if (score + ((aces.length - idx) * Participant.ACES_MIN) >
      Participant.ACES_MAX) {
        score += Participant.ACES_MIN;
      } else {
        score += Participant.ACES_MAX;
      }
    }

    this.score = score;
  }
}

class Player extends Participant {
  static STARTING_CHIPS = 10;

  constructor() {
    super();
    this.chips = Player.STARTING_CHIPS;
    this.bet = 0;
  }

  wantCard() {
    // STUB
    console.log(`Your current score is ${this.score}.`);
    console.log('Do you want to hit or stay? (h/s)');
    let answer = readline.question().toLowerCase();

    while (!['h','s'].includes(answer)) {
      console.log('That is not a valid answer.');
      console.log('Do you want to hit or stay? (h/s)');
      answer = readline.question().toLowerCase();
    }

    return answer === 'h';
  }

  isBroke() {
    return this.chips <= 0;
  }

  resetBet() {
    this.bet = 0;
  }

  updateChips(result) {
    if (result === 'win') {
      this.chips += this.bet;
    } else if (result === 'loss') {
      this.chips -= this.bet;
    }
  }

  makeBet() {
    console.log(`How many chips do you want to bet? (1 to ${this.chips}).`);
    let bet = parseInt(readline.question().trim(), 10);

    while (!Number.isInteger(bet) || bet <= 0 || bet > this.chips) {
      console.log('That is not a valid amount.');
      console.log(`Pick an integer (1 to ${this.chips}).`);
      bet = parseInt(readline.question().trim(), 10);
    }

    this.bet = bet;
  }
}

class Dealer extends Participant {
  static DEALER_HIT_SCORE = 17;

  constructor() {
    super();
  }

  hit() {
    return this.score < Dealer.DEALER_HIT_SCORE;
  }

  showCardsHidden() {
    let hiddenHandData = this.hand.map((card,idx) => {
      if (idx === 0) {
        return Card.BACK_CARD_DATA();
      } else {
        return card.cardDisplayData();
      }
    });

    let hiddenHandStrings = this.getHandDisplayStrings(hiddenHandData);

    hiddenHandStrings.forEach(str => {
      console.log(str);
    });
  }
}

class TwentyOneGame {

  constructor() {
    this.deck = new Deck();
    this.player = new Player();
    this.dealer = new Dealer();
  }

  play() {
    this.welcomeMessage();

    while (true) {
      this.playRound();

      if (this.player.isBroke()) {
        console.log('Sorry you are out of chips!');
        break;
      }

      if (!this.playAgain()) break;

      this.reset();
    }

    this.goodbyeMessage();
  }

  playAgain() {
    console.log('Do you want to keep playing? (y/n)');
    let answer = readline.question().toLowerCase();

    while (!['y','n'].includes(answer)) {
      console.log('That is not a valid answer.');
      console.log('Do you want to keep playing? (y/n)');
      answer = readline.question().toLowerCase();
    }

    return answer === 'y';
  }

  welcomeMessage() {
    console.clear();
    console.log('WELCOME TO TWENTY-ONE!\n');
    console.log('The goal of Twenty-One is to try to get as close' +
    ' to 21 as possible without going over.');
    console.log("If you go over 21, it's a bust, and you lose.\n");
    console.log("The cards with numbers 2 through 10" +
    " are worth their face value.");
    console.log("The Jack, Queen, and King are each worth 10.");
    console.log("The Ace can be worth 1 or 11 " +
    "depending on circumstances.\n");
    console.log("In each round you will always go first " +
    "and can decide to hit or stay.");
    console.log("A hit means that you want to be dealt an additional card.");
    console.log("If you bust the game is over and the dealer won.\n");
    console.log("If you stay, the dealer must hit " +
    "until their score is at least 17.");
    console.log("If the dealer busts, then you win.\n");
    console.log("If both you and the dealer stay, " +
    "whoever has the highest score wins.\n");
    console.log("You will start the game with 10 chips.");
    console.log("At the start of each round, " +
    "you will be asked to bet some chips.");
    console.log("If you win the round your total chips " +
    "will increase by the bet amount.");
    console.log("If you lose the round your total chips " +
    "will decrease by the bet amount.");
    console.log("If at any point your chip amount falls to 0, " +
    "you lose the game.\n");
    console.log("You can decide to leave the game after any round.\n");
    console.log("Good luck and have fun!");
    this.pressEnter();
  }

  goodbyeMessage() {
    console.log('Thank you for playing Twenty One! Goodbye!');
  }

  pressEnter() {
    console.log('\nPress ENTER to continue: ');
    readline.question();
  }

  playRound() {
    this.playerBet();
    this.dealCards();
    this.playerMove();
    if (!this.player.isBust()) {
      this.dealerMove();
    }
    this.showResult();
  }

  dealCards() {
    this.player.updateHand(this.deck.dealCard(), this.deck.dealCard());
    this.player.updateScore();
    this.player.updateBust();

    this.dealer.updateHand(this.deck.dealCard(), this.deck.dealCard());
    this.dealer.updateScore();
    this.dealer.updateBust();

    this.showGameScreen('dealer');
  }

  dealerMove() {
    // STUB
    while (this.dealer.hit()) {
      this.dealer.updateHand(this.deck.dealCard());
      this.dealer.updateScore();
      this.dealer.updateBust();
    }
    this.showGameScreen();
  }

  playerBet() {
    this.showGameScreen('all');
    this.player.makeBet();
  }

  playerMove() {
    while (!this.player.isBust() && this.player.wantCard()) {
      this.player.updateHand(this.deck.dealCard());
      this.showGameScreen('dealer');
      this.player.updateScore();
      this.player.updateBust();
    }
  }

  showResult() {
    if (this.player.isBust()) {
      this.updateBetFromResult('loss');
      this.showGameScreen();
      console.log(`You went bust! Dealer wins!`);
    } else if (this.dealer.isBust()) {
      this.updateBetFromResult('win');
      this.showGameScreen();
      console.log(`Dealer went bust! You win!`);
    } else if (this.player.score > this.dealer.score) {
      this.updateBetFromResult('win');
      this.showGameScreen();
      console.log(`You scored ${this.player.score}. Dealer scored ${this.dealer.score}. You win!`);
    } else if (this.player.score < this.dealer.score) {
      this.updateBetFromResult('loss');
      this.showGameScreen();
      console.log(`You scored ${this.player.score}. Dealer scored ${this.dealer.score}. Dealer wins!`);
    } else {
      this.updateBetFromResult('tie');
      this.showGameScreen();
      console.log(`You scored ${this.player.score}. Dealer scored ${this.dealer.score}. It's a tie!`);
    }
  }

  showStakes() {
    console.log(`CHIPS: ${this.player.chips}`);
    console.log(`BET: ${this.player.bet}`);
  }

  updateBetFromResult(result) {
    this.player.updateChips(result);
    this.player.resetBet();
  }

  showCards() {
    console.log('DEALER:');
    this.dealer.showCards();
    console.log('');
    console.log('YOU:');
    this.player.showCards();
    console.log('');
  }

  showCardsHidden() {
    console.log('DEALER:');
    this.dealer.showCardsHidden();
    console.log('');
    console.log('YOU:');
    this.player.showCards();
    console.log('');
  }

  showAllCardsHidden() {
    console.log('DEALER:');
    this.dealer.showAllCardsHidden();
    console.log('');
    console.log('YOU:');
    this.player.showAllCardsHidden();
    console.log('');
  }

  showGameScreen(whichTypeHidden) {
    console.clear();
    this.showStakes();
    console.log('\n');
    if (whichTypeHidden === 'all') {
      this.showAllCardsHidden();
    } else  if (whichTypeHidden === 'dealer') {
      this.showCardsHidden();
    } else {
      this.showCards();
    }
    console.log('\n');
  }

  reset() {
    this.deck.reset();
    this.player.reset();
    this.dealer.reset();
  }
}

let game = new TwentyOneGame();
game.play();

