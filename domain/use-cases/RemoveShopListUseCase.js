import UseCase from './UseCase';

export default class RemoveShopListUseCase extends UseCase {
  constructor(shopListsRepository) {
    this.shopListsRepository = shopListsRepository;
  }

  async run(id) {
    return await this.shopListsRepository.remove(id);
  }
}