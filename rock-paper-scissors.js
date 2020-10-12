/*
This is an attempt to write a version of the Rock, Paper, Scissors game using
and object oriented approach.

Textual Description of Rock, Paper, Scissors:
There are two players. Each player picks either Rock, Paper, or Scissors
(without telling/revealing their choice to the other player.) Both player
reveal their choice at the same time, at which point the winner is determined
according to the usual Rock, Paper, Scissors rules.

Nouns: player, choice, winner
Verbs: pick, reveal, determine
*/
let rlSync = require('readline-sync');

function createPlayer() {
  return {
    move: null,
  };
};


function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors'];
      let choice;

      while (true) {
        console.log("Please choose rock, paper, or scissors:");
        choice = rlSync.question();
        if (choices.includes(choice)) break;
        console.log("Sorry, invalid choice.");
      }
      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    probs: {r: 1/3, p: 1/3, s: 1/3},

    randomComputerChoice() {
      for (let i = 0; i < 3; i++) {
        if (this.probs[['r', 'p', 's'][i]] === 1) return i;
      }
    
      let alpha = 0.5 - this.probs['r'];
      let beta = 0.5 - (this.probs['p'] / (1 - this.probs['r']));
    
      return Math.round(Math.random() + alpha)*Math.round(Math.random() + beta + 1);
    },

    choose() {
      const CHOICES = ['rock', 'paper', 'scissors'];
      this.move = CHOICES[this.randomComputerChoice()];
    },

    updateProbabilities(history) {
      const WIN_PAIRS = {r: 's', p: 'r', s: 'p'};
      let latest = history[history.length - 1][1];

      let plays = history.filter(play => play[1] === latest);
      let winPlays = plays.filter(play => play[0] === WIN_PAIRS[latest]);
      let winProb = plays.length === 0 ? 0 : winPlays.length / plays.length;

      
      if (winProb > this.probs[latest]) {
        let lossProb = (1 - this.probs[latest]);
        let increment = lossProb*0.2;
        this.probs[latest] += increment;
        for (let i = 0; i < 3; i++) {
          let current = ['r', 'p', 's'][i];
          if (current !== latest) this.probs[current] = this.probs[current]*0.8;
        }
      } else {
        let lossProb = (1 - this.probs[latest]);
        let decrement = (this.probs[latest]*0.2)/lossProb;
        this.probs[latest] = this.probs[latest]*0.8;
        let incrementFactor = 1 + decrement;
        for (let i = 0; i < 3; i++) {
          let current = ['r', 'p', 's'][i];
          if (current !== latest) this.probs[current] = this.probs[current]*incrementFactor;
        }
      }
    },

  };

  return Object.assign(playerObject, computerObject);
}

function scoreTable(winScore) {
  return {
    humanScore: 0,
    computerScore: 0,
    winScore: winScore,

    updateScore(winner) {
      if (winner === 'human') {
        this.humanScore += 1;
      } else if (winner === 'computer') {
        this.computerScore += 1;
      }
    },

    isEndScore() {
      return this.humanScore === this.winScore || this.computerScore === this.winScore;
    },

    reset() {
      this.humanScore = 0;
      this.computerScore = 0;
    },

    showScore() {
      return `${this.humanScore} - ${this.computerScore}`;
    },
  };
};

function gameHistory() {
  return {
    history: [],

    update(humanMove, computerMove) {
      this.history.push([humanMove[0], computerMove[0]]);
    },

    display() {
      console.log(`HISTORY: ${this.history.map(arr => `${arr[0]}${arr[1]}`).join(', ')}`);
    },

    reset() {
      this.history = [];
    },
  };
};

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  score: scoreTable(5),
  history: gameHistory(),

  clearScreen() {
    console.clear();
  },

  pause() {
    const date = Date.now();
    let current;
    do {
      current = Date.now();
    } while (current - date < 1200);
  },

  displayWelcomeMessage() {
    console.log("Welcome to Rock, Paper, Scissors!");
  },

  displayScore() {
    console.log(`GAME SCORE: ${this.score.showScore()}`);
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
        (humanMove === 'paper' && computerMove === 'rock') ||
        (humanMove === 'scissors' && computerMove === 'paper')) {
      this.score.updateScore('human');
      console.log(`You Win!`);
    } else if (humanMove === computerMove) {
      console.log(`It's a tie!`);
    } else {
      this.score.updateScore('computer');
      console.log(`Computer wins!`);
    }
    console.log('\n');
  },

  displayGameWinner() {
    if (this.score.humanScore === this.score.winScore) {
      console.log(`You won the game! The final score was: ${this.score.showScore()}`);
    } else {
      console.log(`Computer won the game! The final score was: ${this.score.showScore()}`);
    }
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = rlSync.question();
    return answer.toLowerCase()[0] === 'y';
  },

  displayGoodbyeMessage() {
    console.log("Thanks for playing Rock, Paper, Scissors. Goodbye!");
  },

  playGame() {
    while (!this.score.isEndScore()) {
      this.clearScreen();
      this.displayScore();
      this.history.display();
      this.human.choose();
      this.computer.choose();
      this.history.update(this.human.move, this.computer.move);
      this.computer.updateProbabilities(this.history.history);
      this.displayWinner();
      this.pause();
    }
    this.clearScreen();
    this.displayGameWinner();
  },

  play() {
    this.clearScreen()
    this.displayWelcomeMessage();
    this.pause();
    while(true) {
      this.playGame();
      if (!this.playAgain()) break;
      this.score.reset();
    }
    this.clearScreen();
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();
