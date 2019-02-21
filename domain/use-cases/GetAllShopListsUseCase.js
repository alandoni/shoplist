import UseCase from './UseCase';

export default class GetAllShopListsUseCase extends UseCase {
  constructor(shopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
  }

  async _execute() {
    return await this.shopListsRepository.getAll();
  }
}