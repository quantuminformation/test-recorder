import ShoppingCart from './shoppingCart.js'

export class Main {
  constructor() {
    //todo look at a way to run this code after all dom is loaded
    //document.addEventListener("DOMContentLoaded", function (event) {
    //});

    //check if cart has stored items otherwise init with default items
    let cart;
    let items = localStorage.getItem("items");
    console.log(items);
    let parsedItems = JSON.parse(localStorage.getItem("items"));

    if (parsedItems === null) {
      cart = new ShoppingCart(['Ferrari F40', 'S Class', 'Tesla'], document.querySelector('#app'))
      //
    } else if (parsedItems === "") { //its been saved before but is empty (user deleted all items)
      cart = new ShoppingCart([], document.querySelector('#app'))
      //
    } else { // has user saved items
      cart = new ShoppingCart(parsedItems, document.querySelector('#app'))
    }
  }
}
