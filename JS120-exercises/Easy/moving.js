class Person {
  constructor(name) {
    this.name = name;
  }

  gait() {
    return "strolls";
  }
}

class Cat {
  constructor(name) {
    this.name = name;
  }

  gait() {
    return "saunters";
  }
}

class Cheetah {
  constructor(name) {
    this.name = name;
  }

  gait() {
    return "runs";
  }
}

let walker = {
  walk() {
    return `${this.name} ${this.gait()} forward`;
  }
};

let mike = Object.assign(new Person("Mike"), walker);
console.log(mike.walk());
// "Mike strolls forward"

let kitty = Object.assign(new Cat("Kitty"), walker);
console.log(kitty.walk());
// "Kitty saunters forward"

let flash = Object.assign(new Cheetah("Flash"), walker);
console.log(flash.walk());
// "Flash runs forward"