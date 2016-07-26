export default class ShoppingCart {
  /**
   *
   * @param defaultsItems default items
   * @param element the element to control
   */
  constructor(defaultsItems, element) {
    this.state = {};
    this.setInitialState({items: defaultsItems, element: element})
    this.listDisplay = this.element.querySelector('#listDisplay');
    this.initObservers();

    //borrow idea from  react
  }

  setInitialState(items) {
    Object.keys(items).forEach(i=>this.state[i] = items[i])
  }

  setState() {

  }

  initObservers() {
    let self = this;
    Object.observe(this.items, (changes)=> {
      self.render();
      console.log(changes);
      //save changes to local storage
      localStorage.setItem("items", JSON.stringify(self.items));
    });
    this.element.querySelector('#addBtn').addEventListener("click", (e)=> {
      self.addItem(self.element.querySelector('#newItem').value);
    });
    //initial render if we have items + save
    if (this.items.length) {
      self.render();
      localStorage.setItem("items", JSON.stringify(self.items));
    }
  }

  /**
   * @param item
   */
  addItem(item) {
    this.items.push(item);
  }

  removeItem(index) {
    //  let index = this.items.indexOf(item);
    //if (index > -1) {
    this.items.splice(index, 1);
    //}
  }

  render() {
    let self = this;
    let template = ""
    this.items.forEach(function (item, i) {
      template += '<li>' + item + '<button data-id="' + i + '">Delete</button></li> '
    })
    this.listDisplay.innerHTML = template;
    let result = this.listDisplay.querySelectorAll('button');

    Array.prototype.map.call(result, (el)=> {
      el.addEventListener("click", (e)=> {
        self.removeItem(e.target.getAttribute("data-id"));
      })
    });

    this.element.querySelector('#total').innerHTML = this.items.length + " items in list";
  }
}
