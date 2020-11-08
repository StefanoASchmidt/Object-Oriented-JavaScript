class Owner {
  constructor(name) {
    this.name = name;
    this.pets = [];
  }

  adoptPet(pet) {
    if (!this.pets.includes(pet)) {
      this.pets.push(pet);
    }
  }

  numberOfPets() {
    return this.pets.length;
  }

  printPetDescriptions() {
    this.pets.forEach(pet => console.log(pet.description()));
  }
}

class Pet {
  constructor(species, name) {
    this.species = species;
    this.name = name;
  }

  description() {
    return `a ${this.species} named ${this.name}`;
  }
}

class Shelter {
  constructor() {
    this.unadopted = [];
    this.owners = [];
  }

  giveShelter(pet) {
    if (this.unadopted.includes(pet)) {
      console.log("This pet is already in the shelter");
      return;
    }

    this.unadopted.push(pet);
  }

  removeFromShelter(pet) {
    this.unadopted.splice(this.unadopted.indexOf(pet), 1);
  }

  printSheltered() {
    console.log("The Animal Shelter has the following unadopted pets:");
    this.unadopted.forEach(pet => console.log(pet.description()));
    console.log('\n');
  }

  numberOfSheltered() {
    return this.unadopted.length;
  }

  adopt(owner, pet) {
    if (!this.unadopted.includes(pet)) {
      console.log(`${pet.name} is not available for adoption.`);
      return;
    }

    if (!this.owners.includes(owner)) {
      this.owners.push(owner);
    } 

    owner.adoptPet(pet);
    this.removeFromShelter(pet);
  }

  numberOfAdopters() {
    return this.owners.length;
  }

  printAdoptions() {
    if (this.numberOfAdopters() > 0) {
      this.owners.forEach(owner => {
        console.log(`${owner.name} has adopted the following pets:`);
        owner.printPetDescriptions();
        console.log('\n');
      });
    } else {
      console.log('There have been no adoptions made from the shelter');
      console.log('\n');
    }
    
  }
}

/*
// Alternative implementation of Shelter class with Shelter inheriting from
// Owner class. Can potentially think of a "shelter" as a type of "owner" with
// added state and functionality, in some sense a "shelter" owns the animals it
// is sheltering. This implementation DRY's up our code slightly better than in
// the above implementation, where we have essentially duplicate methods in our
// classes.

class Shelter extends Owner {
  constructor(name) {
    super(name);
    this.owners = [];
  }

  giveShelter(pet) {
    super.adoptPet(pet);
  }

  adopt(owner, pet) {
    if (!this.pets.includes(pet)) {
      console.log(`${pet.name} is not available for adoption.`);
      return;
    }

    if (!this.owners.includes(owner)) {
      this.owners.push(owner);
    } 

    owner.adoptPet(pet);
    this.removeFromShelter(pet);
  }

  removeFromShelter(pet) {
    this.pets.splice(this.pets.indexOf(pet), 1);
  }

  printSheltered() {
    console.log(`${this.name} has the following unadopted pets:`);
    super.printPetDescriptions();
    console.log('\n');
  }

  printAdoptions() {
    this.owners.forEach(owner => {
      console.log(`${owner.name} has adopted the following pets:`);
      owner.printPetDescriptions();
      console.log('\n');
    });
  }
}
*/

let butterscotch = new Pet('cat', 'Butterscotch');
let pudding      = new Pet('cat', 'Pudding');
let darwin       = new Pet('bearded dragon', 'Darwin');
let kennedy      = new Pet('dog', 'Kennedy');
let sweetie      = new Pet('parakeet', 'Sweetie Pie');
let molly        = new Pet('dog', 'Molly');
let chester      = new Pet('fish', 'Chester');

let asta         = new Pet('dog', 'Asta');
let laddie       = new Pet('dog', 'Laddie');
let fluffy       = new Pet('cat', 'Fluffy');
let kat          = new Pet('cat', 'Kat');
let ben          = new Pet('cat', 'Ben');
let chatterbox   = new Pet('parakeet', 'Chatterbox');
let bluebell     = new Pet('parakeet', 'Bluebell');

let phanson = new Owner('P Hanson');
let bholmes = new Owner('B Holmes');
let shelter = new Shelter('The Animal Shelter');

shelter.giveShelter(butterscotch);
shelter.giveShelter(pudding);
shelter.giveShelter(darwin);
shelter.giveShelter(kennedy);
shelter.giveShelter(sweetie);
shelter.giveShelter(molly);
shelter.giveShelter(chester);
shelter.giveShelter(asta);
shelter.giveShelter(laddie);
shelter.giveShelter(fluffy);
shelter.giveShelter(kat);
shelter.giveShelter(ben);
shelter.giveShelter(chatterbox);
shelter.giveShelter(bluebell);

shelter.printAdoptions();
shelter.printSheltered();

shelter.adopt(phanson, butterscotch);
shelter.adopt(phanson, pudding);
shelter.adopt(phanson, darwin);
shelter.adopt(bholmes, kennedy);
shelter.adopt(bholmes, sweetie);
shelter.adopt(bholmes, molly);
shelter.adopt(bholmes, chester);


shelter.printAdoptions();
shelter.printSheltered();

console.log(`${phanson.name} has ${phanson.numberOfPets()} adopted pets.`);
console.log(`${bholmes.name} has ${bholmes.numberOfPets()} adopted pets.`);
console.log(`The Animal Shelter has ${shelter.numberOfSheltered()} unadopted pets.`);