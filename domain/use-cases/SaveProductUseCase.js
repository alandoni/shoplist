import UseCase from './UseCase';
import ValidationError from '../ValidationError';

export default class SaveProductUseCase extends UseCase {
  constructor(productsRepository) {
    super();
    this.productsRepository = productsRepository;
  }

  async run(product) {
    if (product.name.length < 2) {
      throw new ValidationError('Por favor, digite um nome válido!' );
    }
    if (product.value <= 0) {
      throw new ValidationError('Por favor, digite um valor válido!' );
    }

    let storedProduct;
    if (product.id) {
      storedProduct = await this.productsRepository.update(product.id, product);
    } else {
      storedProduct = await this.productsRepository.save(product);
    }

    return storedProduct;
  }
}
