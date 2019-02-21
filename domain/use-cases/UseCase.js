export default class UseCase {
  async _execute(data) {
    // Override this method
  }

  async execute(data) {
    return await this._execute(data);
  }
}