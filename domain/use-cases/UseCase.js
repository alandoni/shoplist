export default class UseCase {
  async run(data) {
    // Override this method
  }

  async execute(data) {
    return await this.run(data);
  }
}