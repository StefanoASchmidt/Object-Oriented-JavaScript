/* eslint-disable max-lines-per-function */

const READLINE = require('readline-sync');
const WINNING_COMBOS = { rock: 'scissors', paper: 'rock', scissors: 'paper'};
const INDEXES = {human: 0, computer: 1, outcome: 2};
const MOVE_CHOICES = ['rock', 'paper', 'scissors']; // ['r', 'p', 's']
const ROUNDS_PER_GAME = 5;

function stats() {
  return {
    game: [],
    historic: [],

    getLastRound() {
      return this.game[this.game.length - 1];
    },

    getCurrentGame() {
      return this.game;
    },

    updateGame(human, computer, result) {
      this.game.push([human, computer, result]);
    },

    resetGame() {
      this.game = [];
    },

    updateHistoric() {
      this.historic.push(this.game);
    },

    gameWinner(gameArr = this.game) {
      let wins = this.getWins(gameArr);
      if (wins[0] >= ROUNDS_PER_GAME) {
        return 'human';
      } else if (wins[1] >= ROUNDS_PER_GAME) {
        return 'computer';
      } else {
        return undefined;
      }
    },

    getGameWinNums() {
      let humanWins = this.historic.filter(arr => {
        return this.gameWinner(arr) === 'human';
      }).length;

      let computerWins = this.historic.filter(arr => {
        return this.gameWinner(arr) === 'computer';
      }).length;

      return [humanWins, computerWins];
    },

    getWins(gameArr = this.game) {
      let humanWins = gameArr.filter(arr => {
        return arr[INDEXES.outcome] === 'human';
      }).length;

      let computerWins = gameArr.filter(arr => {
        return arr[INDEXES.outcome] === 'computer';
      }).length;

      return [humanWins, computerWins];
    },

    getTypeOfRounds(player, result = false) {
      if (result) {
        return this.historic.flat()
          .filter(arr => arr[INDEXES.outcome] === result)
          .map(arr => arr[player]);
      } else {
        return this.historic.flat()
          .map(arr => arr[player]);
      }
    },

    getMoveDistribution(moves) {
      let percentages = [0,0,0];

      moves.forEach(move => {
        if (move === 'rock') {
          percentages[0] += 1;
        } else if (move === 'paper') {
          percentages[1] += 1;
        } else {
          percentages[2] += 1;
        }
      });

      percentages = percentages.map(num => {
        return ((num / moves.length) * 100).toFixed(2);
      });

      return percentages;
    },

    playerStats(player) {
      let playerNum;
      if (player === 'You') {
        playerNum = INDEXES['human'];
      } else if (player === 'Computer') {
        playerNum = INDEXES['computer'];
      }

      let percent = this.getMoveDistribution(this.historic
        .flat()
        .map(arr => arr[playerNum]));

      percent.forEach((per, idx) => {
        console.log(`${player} played ${MOVE_CHOICES[idx]} ${per}%.`);
      });

      console.log('\n');
    },

    giveGameDetails() {
      let [human, computer] = this.getGameWinNums();
      console.log(`You played ${this.historic.length} game(s).`);
      console.log(`You won ${human} game(s), computer won ${computer} game(s)`);
      console.log('\n');

      this.playerStats('You');
      this.playerStats('Computer');
    },

    giveRoundStats() {
      console.log(``);
    }

  };
}

function createPlayer() {
  return {
    move: null,

    showMove() {
      return this.move;
    },

    resetPlayer() {
      this.move = null;
    }
  };
}

function createHuman() {
  let player = createPlayer();
  let human = {
    choose() {
      console.log("Please choose one of rock, paper, scissors! (r/p/s)");
      let choice = this.validateChoice(READLINE.question().toLowerCase());
      while (!MOVE_CHOICES.includes(choice)) {
        console.log("That is not a valid choice.");
        console.log("Please choose one of rock, paper, scissors! (r/p/s)");
        choice = this.validateChoice(READLINE.question().toLowerCase());
      }

      this.move = choice;
    },

    validateChoice(choice) {
      if (choice.length <= 0) return choice;

      for (let idx = 0; idx < MOVE_CHOICES.length; idx += 1) {
        if (MOVE_CHOICES[idx].startsWith(choice)) {
          return MOVE_CHOICES[idx];
        }
      }

      return choice;
    },
  };

  return Object.assign(player, human);
}

function createComputer() {
  let player = createPlayer();
  let computer = {
    probs: {rock: 1 / 3, paper: 1 / 3, scissors: 1 / 3},
    stategy: 0,

    randomComputerChoice() {
      let cummulative = [];
      let current = 0;
      for (let idx = 0; idx < 3; idx++) {
        current += this.probs[MOVE_CHOICES[idx]];
        cummulative.push(current);
      }

      let random = Math.random();

      if (random < cummulative[0]) {
        return 0;
      } else if (random < cummulative[1]) {
        return 1;
      } else {
        return 2;
      }
    },

    choose(game) {
      if (!this.move || this.strategy ||
        game[game.length - 1][0] === this.move) {
        this.move = MOVE_CHOICES[this.randomComputerChoice()];
      } else {
        this.move = WINNING_COMBOS[this.move];
      }
    },

    chooseStrategy() {
      this.strategy = Math.round(Math.random());
    },

    updateProbabilities(history) {
      const DECREMENT = 0.8;
      let latest = history[history.length - 1][INDEXES.computer];
      let plays = history.filter(play => play[INDEXES.computer] === latest);
      let winPlays = plays.filter(play => {
        return play[INDEXES.human] === WINNING_COMBOS[latest];
      });
      let winProb = plays.length === 0 ? 0 : winPlays.length / plays.length;

      if (winProb > this.probs[latest]) {
        let lossProb = (1 - this.probs[latest]);
        let increment = lossProb * (1 - DECREMENT);
        this.probs[latest] += increment;
        this.updateLatestByFactor(latest, DECREMENT);
      } else {
        let lossProb = (1 - this.probs[latest]);
        let decrement = (this.probs[latest] * (1 - DECREMENT)) / lossProb;
        this.probs[latest] *= DECREMENT;
        let incrementFactor = 1 + decrement;
        this.updateLatestByFactor(latest, incrementFactor);
      }
    },

    updateLatestByFactor(latest, factor) {
      for (let idx = 0; idx < MOVE_CHOICES.length; idx++) {
        let current = MOVE_CHOICES[idx];
        if (current !== latest) this.probs[current] *= factor;
      }
    },

  };

  return Object.assign(player, computer);
}

const RPSGAME = {
  human: createHuman(),
  computer: createComputer(),
  stats: stats(),

  clearScreen() {
    console.clear();
  },

  pressEnter() {
    console.log('Press ENTER to continue');
    READLINE.question();
    this.clearScreen();
  },

  displayWelcomeMessage() {
    console.log("Welcome to Rock, Paper, Scissors!\n");
    console.log('The rules of this game are:');
    console.log('- rock beats scissors');
    console.log('- scissors beats paper');
    console.log('- paper beats rock\n');
    console.log('You will be playing against a smart computer!');
    console.log('Each game is first to 5. ' +
    'You can play as many games as you like!');
    console.log('Have fun!\n');
  },

  displayGoodbyeMessage() {
    console.log("Thank you for playing Rock, Paper, Scissors! Goodbye!\n");
  },

  displayScore() {
    console.log("GAME SCORE");
    console.log(`you: ${this.stats.getWins()[INDEXES.human]}`);
    console.log(`computer: ${this.stats.getWins()[INDEXES.computer]}\n`);
  },

  displayGame() {
    console.log("GAME HISTORY");
    this.stats
      .getCurrentGame()
      .map(arr => {
        return [`you: ${arr[INDEXES.human]}`.padEnd(14,' '),
          `computer: ${arr[INDEXES.computer]}`.padEnd(19,' '),
          `result: ${arr[INDEXES.outcome] ===
            'human' ? 'you' : arr[INDEXES.outcome]}`];
      })
      .map(arr => arr.join('| '))
      .forEach(str => console.log(str));
    console.log('\n');
  },

  computeRoundWinner(humanMove, computerMove) {
    if (computerMove === humanMove) {
      return 'tie';
    } else if (computerMove === WINNING_COMBOS[humanMove]) {
      return 'human';
    } else {
      return 'computer';
    }
  },

  displayRoundWinner(roundArr) {
    console.log('\n');
    console.log(`You chose: ${roundArr[INDEXES.human]}`);
    console.log(`Computer chose: ${roundArr[INDEXES.computer]}`);
    let result = roundArr[INDEXES.outcome];
    if (result === 'tie') {
      console.log("This round is a tie!\n");
    } else if (result === 'human') {
      console.log("You win the round!\n");
    } else if (result === 'computer') {
      console.log("Computer wins the round!\n");
    }
  },

  displayGameWinner(roundArr) {
    let winner = roundArr[INDEXES.outcome];
    if (winner === 'human') {
      console.log("You win this game!");
    } else if (winner === 'computer') {
      console.log("Computer wins this game!");
    }
  },

  restartGame() {
    this.human.resetPlayer();
    this.computer.resetPlayer();
    this.stats.resetGame();
  },

  playAgain() {
    console.log('Do you want to play again? (y/n)');
    let answer = READLINE.question().toLowerCase();

    while (!['y', 'n'].includes(answer)) {
      console.log('That is not a valid answer.');
      console.log('Do you want to play again? (y/n)');
      answer = READLINE.question().toLowerCase();
    }

    return answer === 'y';
  },

  playRound() {
    this.human.choose();
    this.computer.choose(this.stats.getCurrentGame());

    this.stats.updateGame(this.human.showMove(), this.computer.showMove(),
      this.computeRoundWinner(this.human.showMove(), this.computer.showMove()));

    this.displayRoundWinner(this.stats.getLastRound());
  },

  playGame() {
    while (!this.stats.gameWinner()) {
      this.displayScore();
      this.displayGame();
      this.playRound();
      this.pressEnter();
    }

    this.displayScore();
    this.displayGameWinner(this.stats.getLastRound());
    this.stats.updateHistoric();
  },

  play() {
    this.clearScreen();
    this.displayWelcomeMessage();
    this.pressEnter();
    do {
      this.clearScreen();
      this.playGame();
      this.restartGame();
    } while (this.playAgain());
    this.clearScreen();
    this.stats.giveGameDetails();
    this.pressEnter();
    this.displayGoodbyeMessage();
  },
};

RPSGAME.play();
