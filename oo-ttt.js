const readline = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  } 
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[String(counter)] = new Square();
    }
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }

  display() {
    console.log("");
    console.log("       |       |");
    console.log(`   ${this.squares["1"]}   |` + `   ${this.squares["2"]}   |`
                + `   ${this.squares["3"]}`);
    console.log("       |       |");
    console.log("-------+-------+-------");
    console.log("       |       |");
    console.log(`   ${this.squares["4"]}   |` + `   ${this.squares["5"]}   |`
                + `   ${this.squares["6"]}`);
    console.log("       |       |");
    console.log("-------+-------+-------");
    console.log("       |       |");
    console.log(`   ${this.squares["7"]}   |` + `   ${this.squares["8"]}   |`
                + `   ${this.squares["9"]}`);
    console.log("       |       |");
    console.log("");
  }

  displayWelcomeBoard() {
    console.log("");
    console.log("       |       |");
    console.log(`   1   |   2   |   3`);
    console.log("       |       |");
    console.log("-------+-------+-------");
    console.log("       |       |");
    console.log(`   4   |   5   |   6`);
    console.log("       |       |");
    console.log("-------+-------+-------");
    console.log("       |       |");
    console.log(`   7   |   8   |   9`);
    console.log("       |       |");
    console.log("");
  }

  displayWithClear() {
    console.clear();
    console.log("");
    this.display();
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  reset() {
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[String(counter)].setMarker(Square.UNUSED_SQUARE);
    }
  }
  
  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.wins = 0;
  }

  getMarker() {
    return this.marker;
  }

  getWins() {
    return this.wins;
  }

  incrementWins() {
    this.wins += 1;
  }

  reset() {
    this.wins = 0;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  static POSSIBLE_WINNING_ROWS = [
    ["1", "2", "3"], 
    ["4", "5", "6"], 
    ["7", "8", "9"], 
    ["1", "4", "7"], 
    ["2", "5", "8"], 
    ["3", "6", "9"], 
    ["1", "5", "9"], 
    ["3", "5", "7"] 
  ];
  
  static WINNING_SCORE = 3;

  static joinOr = function(arr, sep = ', ', last = 'or') {
    if (arr.length < 2) return arr.join();

    let joined = "";
    for (let idx = 0; idx < arr.length - 2; idx += 1) {
      joined += `${arr[idx]}${sep}`;
    }
    joined += `${arr[arr.length - 2]} ${last} ${arr[arr.length - 1]}`;

    return joined;
  };

  static randomPickArray = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.rounds = 0;
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let attackChoices = this.threatSquares(validChoices, this.computer);
    let defenseChoices = this.threatSquares(validChoices, this.human);
    let choice;

    if (attackChoices.length > 0) {
      choice = TTTGame.randomPickArray(attackChoices);
    } else if (defenseChoices.length > 0) {
      choice = TTTGame.randomPickArray(defenseChoices);
    } else if (validChoices.includes("5")) {
      choice = "5";
    } else {
      choice = TTTGame.randomPickArray(validChoices);
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  displayGameWinner() {
    if (this.human.getWins() === this.computer.getWins()) {
      console.log('The game was a tie!\n');
    } else  if (this.human.getWins() < this.computer.getWins()) {
      console.log('Computer won the game!\n');
    } else {
      console.log('You won the game!\n');
    }
  }

  displayGoodbyeMessage() {
    console.log("");
    console.log('Thanks for playing Tic Tac Toe! Goodbye!');
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won the round!\n");
    } else if (this.isWinner(this.computer)) {
      console.log("Computer won the round!\n");
    } else {
      console.log("The round was a tie!\n");
    }
  }

  displayScore() {
    let score = `You ${this.human.getWins()} - ${this.computer.getWins()} Computer`;
    console.log("SCORE: " + score);
  }

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Tic Tac Toe!\n');
    console.log('Tic Tac Toe is a game played on a 3x3 grid.');
    console.log('To win a round mark 3 consecutive squares as follows:');
    console.log('- 3 vertically aligned squares');
    console.log('- 3 horizontally aligned squares');
    console.log('- 3 diagonally aligned squares\n');
    console.log('You will be playing against a smart computer.');
    console.log('Your squares are marked "X", the computers are marked "O"');
    console.log('You can mark a square by entering an appropriate number.');
    console.log('The grid squares are numbered as follows:');
    this.board.displayWelcomeBoard();
    console.log("The winner of the game will be the first to win 3 rounds.");
    console.log("Good luck and have fun!\n");
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${TTTGame.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) {
        break;
      }

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  incrementRounds() {
    this.rounds += 1;
  }

  isHumanFirstRound() {
    return this.rounds % 2 === 0;
  }

  isThreatSquare(squareNum, player) {
    let squareRows = TTTGame.POSSIBLE_WINNING_ROWS.filter(row => {
      return row.includes(squareNum);
    });
    return this.isWinner(player, squareRows, 2);
  }

  isWinner(player, rows = TTTGame.POSSIBLE_WINNING_ROWS, winNum = 3) {
    return rows.some(row => {
      return this.board.countMarkersFor(player, row) === winNum;
    });
  }

  play() {
    this.displayWelcomeMessage();
    this.pressEnter();

    do {
      this.resetGame();
      this.playGame();
    } while (this.playAgain());

    this.displayGoodbyeMessage();
  }

  playAgain() {
    let choice = readline.question('Do you want to play again? (y/n) ')
      .toLowerCase();

    while (!['y','n'].includes(choice)) {
      console.log('That is not a valid choice.');
      choice = readline.question('Do you want to play again? (y/n) ')
        .toLowerCase();
    }

    return choice === 'y';
  }

  playComputerFirstRound() {
    while (true) {
      this.computerMoves();
      if (this.gameOver()) break;

      console.clear();
      this.displayScore();
      this.board.display();

      this.humanMoves();
      if (this.gameOver()) break;

      console.clear();
      this.displayScore();
      this.board.display();
    }
  }

  playGame() {
    while (true) {
      console.clear();
      this.displayScore();
      this.board.reset();
      this.board.display();
      this.playRound();
      if (this.someoneWonGame()) break;
      this.pressEnter();
    }

    this.displayGameWinner();
  }

  playHumanFirstRound() {
    while (true) {
      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;

      console.clear();
      this.displayScore();
      this.board.display();
    }
  }

  playRound() {
    if (this.isHumanFirstRound()) {
      this.playHumanFirstRound();
    } else {
      this.playComputerFirstRound();
    }

    console.clear();
    this.incrementRounds();
    this.updateResults();
    this.displayScore();
    this.board.display();
    this.displayResults();
  }

  pressEnter() {
    console.log("Press ENTER to continue");
    readline.question();
    console.clear();
  }

  resetGame() {
    this.board.reset();
    this.human.reset();
    this.computer.reset();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  someoneWonGame() {
    return (this.human.getWins() === TTTGame.WINNING_SCORE ||
           this.computer.getWins() === TTTGame.WINNING_SCORE);
  }
  
  threatSquares(validChoices, player) {
    return validChoices.filter(choice => this.isThreatSquare(choice, player));
  }

  updateResults() {
    if (this.isWinner(this.human)) {
      this.human.incrementWins();
    } else if (this.isWinner(this.computer)) {
      this.computer.incrementWins();
    }
  }
}

let game = new TTTGame();
game.play();


