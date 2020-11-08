class Animal {
  constructor(name, age, legs, species, status) {
    this.name = name;
    this.age = age;
    this.legs = legs;
    this.species = species;
    this.status = status;
  }

  introduce() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old and ${this.status}.`;
  }
}

class Cat extends Animal {
  constructor(name, age, status) {
    super(name, age, 4, 'cat', status);
  }

  // we can use the 'super' keyword to reference a method in an objects parent
  // class:
  introduce() {
    return `${super.introduce()} Meow meow!`;
  }
}

class Dog extends Animal {
  constructor(name, age, status, master) {
    super(name, age, 4, 'dog', status);
    this.master = master;
  }

  greetMaster() {
    return `Hello ${this.master}! Woof woof!`;
  }
}

let cat = new Cat('Pepe', 2, 'happy');
console.log(cat.introduce());

let dog = new Dog('Fred', 5, 'excited', 'Stefano');
console.log(dog.greetMaster());
console.log(dog.introduce());
