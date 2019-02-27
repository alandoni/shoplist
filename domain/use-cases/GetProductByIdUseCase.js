import UseCase from './UseCase';

export default class GetProductByIdUseCase extends UseCase {
  constructor(productsRepository) {
    super();
    this.productsRepository = productsRepository;
  }

  run = async (id) => {
    return this.productsRepository.getById(id);
  }
}
