import UseCase from './UseCase';

export default class RemoveProductUseCase extends UseCase {
  constructor(productsRepository) {
    super();
    this.productsRepository = productsRepository;
  }

  async run(id) {
    await this.productsRepository.remove(id);
  }
}
