function makeBook(title, author, read = false) {
  let obj = {
    title,
    author,
    read,

    getDescription() {
      return `${this.title} was written by ${this.author}.` + 
             ` I ${this.read ? 'have' : "haven't"} read it.`;
    },

    readBook() {
      this.read = true;
    },
  };

  return obj;
}

let book1 = makeBook('Mythos', 'Stephen Fry');
let book2 = makeBook('Me Talk Pretty One Day', 'David Sedaris');
let book3 = makeBook("Aunts aren't Gentlemen", 'PG Wodehouse');

console.log(book1.getDescription()); // logs 'Mythos was written by Stephen Fry. I haven't read it.'
book1.readBook();
console.log(book1.getDescription()); // logs 'Mythos was written by Stephen Fry. I have read it.'


