import UseCase from './UseCase';

export default class GetAllProductsUseCase extends UseCase {
  constructor(productsRepository) {
    super();
    this.productsRepository = productsRepository;
  }

  run = async () => {
    return this.productsRepository.getAll();
  }
}
