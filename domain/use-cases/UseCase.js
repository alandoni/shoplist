export default class UseCase {
  run = async (product) => {
    // Override this method
  }

  execute = async (data) => {
    return this.run(data);
  }
}
