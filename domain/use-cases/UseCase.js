export default class UseCase {
  run = async () => {
    // Override this method
  }

  async execute(data) {
    return this.run(data);
  }
}
