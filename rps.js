const READLINE = require('readline-sync');
const WORD_KEY = { r: 'rock', p: 'paper', s: 'scissors', h: 'you', c: 'computer', t: 'tie' };
const WINNING_COMBOS = { r: 's', p: 'r', s: 'p'};
const MOVE_CHOICES = ['r', 'p', 's'];
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

    winner(gameArr = this.game) {
      let wins = this.getWins(gameArr);
      if (wins[0] >= ROUNDS_PER_GAME) {
        return 'h';
      } else if (wins[1] >= ROUNDS_PER_GAME) {
        return 'c';
      } else {
        return undefined;
      }
    },

    getGameWinNums() {
      let humanWins = this.historic.filter(arr => this.winner(arr) === 'h').length;
      let computerWins = this.historic.filter(arr => this.winner(arr) === 'c').length;

      return [humanWins, computerWins];
    },

    getWins(gameArr = this.game) {
      let humanWins = gameArr.filter(arr => arr[2] === 'h').length;
      let computerWins = gameArr.filter(arr => arr[2] === 'c').length;
      return [humanWins, computerWins];
    },

    getTypeOfRounds(player, outcome = false) {
      if (outcome) {
        return this.historic.flat()
                            .filter(arr => arr[2] === outcome)
                            .map(arr => arr[player]);
      } else {
        return this.historic.flat()
                            .map(arr => arr[player]);
      }
    },

    getMoveDistribution(moves) {
      let percentages = [0,0,0];

      moves.forEach(move => {
        if (move === 'r') {
          percentages[0] += 1;
        } else if (move === 'p') {
          percentages[1] += 1;
        } else {
          percentages[2] += 1;
        }
      });

      percentages = percentages.map(num => ((num / moves.length) * 100).toFixed(2));
      return percentages;
    },

    playerStats(player) {
      if (player === 'You') {
        playerNum = 0;
      } else if (player === 'Computer') {
        playerNum = 1;
      }
    
      let percent = this.getMoveDistribution(this.historic
        .flat()
        .map(arr => arr[playerNum]));

      percent.forEach((per, idx) => {
        console.log(`${player} played ${WORD_KEY[MOVE_CHOICES[idx]]} ${per}%.`);
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
      console.log(``)
    }

  };
};

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
};

function createHuman() {
  let player = createPlayer();
  let human = {
    choose() {
      let choice;

      while (true) {
        console.log(`Please choose one of rock, paper, scissors! (r/p/s) `);
        choice = READLINE.question().toLowerCase()[0];
        if (MOVE_CHOICES.includes(choice)) break;
        console.log("Sorry, invalid choice.");
      }

      this.move = choice;
    },
  };

  return Object.assign(player, human);
};

function createComputer() {
  let player = createPlayer();
  let computer = {
    probs: {r: 1/3, p: 1/3, s: 1/3},
    stategy: 0,

    randomComputerChoice() {
      let cummulative = [];
      let current = 0;
      for (let i = 0; i < 3; i++) {
        current += this.probs[MOVE_CHOICES[i]];
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
      if (!this.move || this.strategy || game[game.length - 1][0] === this.move) {
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
      let latest = history[history.length - 1][1];

      let plays = history.filter(play => play[1] === latest);
      let winPlays = plays.filter(play => play[0] === WINNING_COMBOS[latest]);
      let winProb = plays.length === 0 ? 0 : winPlays.length / plays.length;

      
      if (winProb > this.probs[latest]) {
        let lossProb = (1 - this.probs[latest]);
        let increment = lossProb*(1 - DECREMENT);
        this.probs[latest] += increment;
        this.updateLatestByFactor(latest, DECREMENT);
      } else {
        let lossProb = (1 - this.probs[latest]);
        let decrement = (this.probs[latest]*(1 - DECREMENT))/lossProb;
        this.probs[latest] = this.probs[latest]*DECREMENT;
        let incrementFactor = 1 + decrement;
        this.updateLatestByFactor(latest, incrementFactor);
      }
    },

    updateLatestByFactor(latest, factor) {
      for (let i = 0; i < MOVE_CHOICES.length; i++) {
        let current = MOVE_CHOICES[i];
        if (current !== latest) this.probs[current] = this.probs[current]*factor;
      }
    },

  };

  return Object.assign(player, computer);
};

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
    console.log("Welcome to Rock, Paper, Scissors!");
    console.log('\n');
    console.log('The rules of this game are:');
    console.log('- rock beats scissors');
    console.log('- scissors beats paper');
    console.log('- paper beats rock');
    console.log('\n');
    console.log('You will be playing against a smart computer!');
    console.log('Each game is first to 5. You can play as many games as you like!');
    console.log('Have fun!');
    console.log('\n');
  },

  displayGoodbyeMessage() {
    console.log("Thank you for playing Rock, Paper, Scissors! Goodbye!");
  },

  displayScore() {
    console.log("GAME SCORE")
    console.log(`you: ${this.stats.getWins()[0]}`);
    console.log(`computer: ${this.stats.getWins()[1]}`);
    console.log('\n');
  },

  displayGame() {
    console.log("GAME HISTORY");
    this.stats
        .getCurrentGame()
        .map(arr => {
          let [you, computer, result] = arr.map(elem => WORD_KEY[elem]);
          return [`you: ${you}`.padEnd(14,' '), 
          `computer: ${computer}`.padEnd(19,' '), `result: ${result}`];
        })
        .map(arr => arr.join('| '))
        .forEach(str => console.log(str));
    console.log('\n');
  },

  computeWinner(humanMove, computerMove) {
    if (computerMove === humanMove) {
      return 't';
    } else if (computerMove === WINNING_COMBOS[humanMove]) {
      return 'h';
    } else {
      return 'c';
    }
  },

  displayRoundWinner(roundArr) {
    console.log('\n');
    console.log(`You chose: ${WORD_KEY[roundArr[0]]}`);
    console.log(`Computer chose: ${WORD_KEY[roundArr[1]]}`);
    let winner = roundArr[2];
    if (winner === 't') {
      console.log("This round is a tie!");
    } else if (winner === 'h') {
      console.log("You win the round!");
    } else if (winner === 'c') {
      console.log("Computer wins the round!");
    }
    console.log('\n');
  },

  displayGameWinner(roundArr) {
    let winner = roundArr[2];
    if (winner === 'h') {
      console.log("You win this game!");
    } else if (winner === 'c') {
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
    let answer = READLINE.question().toLowerCase()[0];

    while (!['y', 'n'].includes(answer)) {
      console.log('That is not a valid answer.');
      console.log('Do you want to play again? (y/n)');
      answer = READLINE.question().toLowerCase()[0];
    }

    return answer === 'y';
  },

  playRound() {
    this.human.choose();
    this.computer.choose(this.stats.getCurrentGame());

    this.stats.updateGame(this.human.showMove(), this.computer.showMove(), 
    this.computeWinner(this.human.showMove(), this.computer.showMove()));

    this.displayRoundWinner(this.stats.getLastRound());
  },

  playGame() {
    while(!this.stats.winner()) {
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
