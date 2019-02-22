export default class StateObservable {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }

  notifyObservers() {
    this.observers.forEach((observer) => {
      observer.update(this.state);
    });
  }
}
