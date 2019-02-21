import UseCase from './UseCase';

export default class RemoveShopListUseCase extends UseCase {
  constructor(shopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
  }

  async _execute(id) {
    return await this.shopListsRepository.remove(id);
  }
}