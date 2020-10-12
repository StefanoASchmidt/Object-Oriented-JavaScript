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
    choose() {
      const choices = ['rock', 'paper', 'scissors'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
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

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  score: scoreTable(5),

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

  play() {
    this.clearScreen()
    this.displayWelcomeMessage();
    this.pause();
    while(true) {
      while (!this.score.isEndScore()) {
        this.clearScreen();
        this.displayScore();
        this.human.choose();
        this.computer.choose();
        this.displayWinner();
        this.pause();
      }
      this.clearScreen();
      this.displayGameWinner();
      if (!this.playAgain()) break;
      this.score.reset();
    }
    this.clearScreen();
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();