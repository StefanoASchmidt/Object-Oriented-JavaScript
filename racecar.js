function createCar(make, fuelLevel, engineOn) {
  let racecar = {
    make: make,
    fuelLevel: fuelLevel,
    engineOn: engineOn,
  
    startEngine() {
      this.engineOn = true;
    },
  
    stopEngine() {
      this.engineOn = false;
    },
  
    drive() {
      this.fuelLevel -= 0.1;
    },
  
    refuel(percent) {
      if ((this.fuelLevel + (percent/100)) <= 1) {
        this.fuelLevel += percent/100;
      } else {
        this.fuelLevel = 1;
      }
    },
  };

  return racecar;
}

let racecar = createCar('BMW', 0.5, false);
let jag = createCar('Jaguar', 0.4, false);

racecar.drive();
racecar.drive();
console.log(racecar.fuelLevel); // 0.3
racecar.refuel(100);
console.log(racecar.fuelLevel); // 1.0
racecar.drive();
racecar.drive();
racecar.drive();
racecar.drive();
console.log(racecar.fuelLevel); // 0.6
racecar.refuel(20);
console.log(racecar.fuelLevel); // 0.8
racecar.fuelLevel = 0.2;
console.log(racecar.fuelLevel); // 0.2 
// NOTE: this is one of the problems with JavaScript OOP: can access and modify object properties
// externally (i.e. without using an objects methods or public interface (publically accessible 
// methods...))



