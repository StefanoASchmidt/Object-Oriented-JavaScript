/*
class Pet {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Cat extends Pet {
  constructor(name, age, colors) {
    super(name, age);
    this.colors = colors;
  }

  info() {
    return `My cat ${this.name} is ${this.age} years old` + 
    ` and has ${this.colors} fur.`;
  }
}

let pudding = new Cat('Pudding', 7, 'black and white');
let butterscotch = new Cat('Butterscotch', 10, 'tan and white');

console.log(pudding.info()); 
console.log(butterscotch.info());
*/

// FURTHER EXPLORATION
// An alternative is to modify the Pet class constructor to accept a 'fur'
// parameter. We then do not need to supply a constructor to the Cat class:
// when we call Cat with `new` the implied constructor will be the Pet 
// constructor. It is probably a good idea to to modify Pet, since 'colors'
// is probably a property that would be present in all/any instances or sub-
// classes of Pet.

class Pet {
  constructor(name, age, colors) {
    this.name = name;
    this.age = age;
    this.colors = colors
  }
}

class Cat extends Pet {
  info() {
    return `My cat ${this.name} is ${this.age} years old` +
    ` and has ${this.colors} fur.`;
  }
}

let pudding = new Cat('Pudding', 7, 'black and white');
let butterscotch = new Cat('Butterscotch', 10, 'tan and white');

console.log(pudding.info()); 
console.log(butterscotch.info());


