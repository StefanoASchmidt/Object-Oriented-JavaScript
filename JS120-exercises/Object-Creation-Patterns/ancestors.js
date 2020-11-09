Object.prototype.ancestors = function() {
  let ancestorsArr = [];
  let current = this;

  while (current !== Object.prototype) {
    current = Object.getPrototypeOf(current);
    if (!current.hasOwnProperty('name')) {
      ancestorsArr.push('Object.prototype');
    } else {
      ancestorsArr.push(current.name);
    }
  }
    
  return ancestorsArr;
}

// name property added to make objects easier to identify
let foo = {name: 'foo'};
let bar = Object.create(foo);
bar.name = 'bar';
let baz = Object.create(bar);
baz.name = 'baz';
let qux = Object.create(baz);
qux.name = 'qux';

console.log(qux.ancestors());  // returns ['baz', 'bar', 'foo', 'Object.prototype']
console.log(baz.ancestors());  // returns ['bar', 'foo', 'Object.prototype']
console.log(bar.ancestors());  // returns ['foo', 'Object.prototype']
console.log(foo.ancestors());  // returns ['Object.prototype']