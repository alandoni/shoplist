import UseCase from './UseCase';

export default class GetAllCategoriesUseCase extends UseCase {
  constructor(categoriesRepository) {
    super();
    this.categoriesRepository = categoriesRepository;
  }

  run = async () => {
    return this.categoriesRepository.getAll();
  }
}
