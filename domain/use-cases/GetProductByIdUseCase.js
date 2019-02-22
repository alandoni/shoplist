import UseCase from './UseCase';

export default class GetProductByIdUseCase extends UseCase {
  constructor(productsRepository) {
    super();
    this.productsRepository = productsRepository;
  }

  async run(id) {
    return this.productsRepository.getById(id);
  }
}
