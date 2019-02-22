import UseCase from './UseCase';

export default class GetAllCategoriesUseCase extends UseCase {
  constructor(categoriesRepository) {
    super();
    this.categoriesRepository = categoriesRepository;
  }

  async run() {
    return this.categoriesRepository.getAll();
  }
}
