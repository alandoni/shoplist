import UseCase from './UseCase';
import ValidationError from '../ValidationError';

export default class SaveCategoryUseCase extends UseCase {
  constructor(categoryRepository) {
    super();
    this.categoryRepository = categoryRepository;
  }

  run = async (category) => {
    if (category.name.length < 2) {
      throw new ValidationError('Por favor, digite um nome válido!' );
    }

    let storedCategory;
    if (category.id) {
      storedCategory = await this.categoryRepository.update(category.id, category);
    } else {
      storedCategory = await this.categoryRepository.save(category);
    }

    return storedCategory;
  }
}
