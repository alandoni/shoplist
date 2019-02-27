import UseCase from './UseCase';

export default class RemoveProductUseCase extends UseCase {
  constructor(productsRepository) {
    super();
    this.productsRepository = productsRepository;
  }

  run = async (id) => {
    await this.productsRepository.remove(id);
  }
}
