let Turtle = {
  name: 'Turtleton',

  makeNoise() {
    console.log('Click! Click! Cluck!');
  },
};

let Snake = {
  name: 'Basil',

  makeNoise() {
    console.log('Hiss! Hiss! Hiss!');
  },
}

let Elif = {
  name: 'Elif',
  pets: [],
  heroes: ['Inspector Gadget', 'Chuck', 'Crush'],
  cash: {ones: 12, fives: 2, tens: 0, twenties: 2, hundreds: 0},

  printName() {
    console.log(`My name is ${this.name}`);
  },

  cashOnHand() {
    let obj = this.cash;
    return obj.ones + (obj.fives*5) + (obj.tens*10) + (obj.twenties*20) + (obj.hundreds*100);
  },

  allHeroes() {
    return this.heroes.join(', ');
  },
};

Elif.pets.push(Turtle, Snake);
console.log(Elif.pets.map(pet => pet.name));
