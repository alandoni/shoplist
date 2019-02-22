import UseCase from './UseCase';

export default class SearchProductsByNameUseCase extends UseCase {
  constructor(productsRepository) {
    super();
    this.productsRepository = productsRepository;
  }

  async run(name) {
    return this.productsRepository.searchByName(name);
  }
}
