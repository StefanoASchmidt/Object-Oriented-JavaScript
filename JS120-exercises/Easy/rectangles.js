class Rectangle {
  constructor(width, length) {
    this.width = width;
    this.length = length;
  }

  getWidth() {
    return this.width;
  }

  getLength() {
    return this.length;
  }

  getArea() {
    return this.width * this.length;
  }
}

// example
let rect = new Rectangle(4,5);

console.log(rect.getWidth()); // logs 4
console.log(rect.getLength()); // logs 5
console.log(rect.getArea()); // logs 20