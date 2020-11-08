class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  info() {
    return `${this.make} ${this.model}`;
  }
}

class LandVehicle extends Vehicle {
  constructor(make, model, wheels) {
    super(make, model);
    this.wheels = wheels;
  }

  getWheels() {
    return this.wheels;
  }
}

class Car extends LandVehicle {
  constructor(make, model) {
    super(make, model, 4);
  }
}

class Motorcycle extends LandVehicle {
  constructor(make, model) {
    super(make, model, 2);
  }
}

class Truck extends LandVehicle {
  constructor(make, model, payload) {
    super(make, model, 6);
    this.payload = payload;
  }
}

let car = new Car('Toyota', 'Corolla');
let motorcycle = new Motorcycle('Ducati', 'Monster');
let truck = new Truck('Ford', 'F-150', 3325);

console.log(car.info());
console.log(car.getWheels());

console.log(motorcycle.info());
console.log(motorcycle.getWheels());

console.log(truck.info());
console.log(truck.getWheels());