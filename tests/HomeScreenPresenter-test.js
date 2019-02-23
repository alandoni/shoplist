import HomeScreenPresenter from '../presentation/presenters/HomeScreenPresenter';

jest.mock('../data/repositories/ShopListsRepositoryImpl');
const observer = {
  update: jest.fn()
}

describe('Test HomeScreenPresenter', () => {
  let presenter;

  beforeAll(() => {
    presenter = new HomeScreenPresenter(observer);
  });

  it('State on constructor', () => {
    expect(presenter.state.isLoading).toBeTruthy();
    expect(presenter.state.refresh).toBeFalsy();
    expect(presenter.state.error).toBeNull();
    expect(presenter.state.shopLists).toBeNull();
  });

  it('State on getAllShopLists', async () => {
    const spy = jest.spyOn(presenter, 'notifyObservers');
    const currentState = presenter.state;
    await presenter.getAllShopLists();
    expect(spy).toBeCalledWith({ 
      ...currentState,
      isLoading: false,
      refresh: true});
    expect(spy).toBeCalledTimes(2);
    spy.mockRestore();
  });
});
