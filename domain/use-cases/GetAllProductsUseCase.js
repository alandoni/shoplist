import UseCase from './UseCase';

export default class GetAllProductsUseCase extends UseCase {
  constructor(productsRepository) {
    super();
    this.productsRepository = productsRepository;
  }

  async run() {
    return this.productsRepository.getAll();
  }
}
