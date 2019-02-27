import UseCase from './UseCase';

export default class GetAllShopListsUseCase extends UseCase {
  constructor(shopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
  }

  run = async () => {
    return this.shopListsRepository.getAll();
  }
}
