import UseCase from './UseCase';

export default class GetAllShopListsUseCase extends UseCase {
  constructor(shopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
  }

  async run() {
    return await this.shopListsRepository.getAll();
  }
}