import UseCase from './UseCase';

export default class RemoveShopListUseCase extends UseCase {
  constructor(shopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
  }

  run = async (id) => {
    return this.shopListsRepository.remove(id);
  }
}
