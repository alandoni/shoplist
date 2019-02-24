import HomeScreenPresenter from '../presentation/presenters/HomeScreenPresenter';
import GetAllShopListsUseCase from '../domain/use-cases/GetAllShopListsUseCase';
import RemoveShopListUseCase from '../domain/use-cases/RemoveShopListUseCase';
import ShopList from '../presentation/entities/ShopList';

const mockShopLists = [new ShopList('Name of the shop list', [], 0, 0, 1)];
const mockError = 'Error';

jest.mock('../domain/use-cases/GetAllShopListsUseCase.js', () => {
  return jest.fn().mockImplementationOnce(() => {
    return {execute: jest.fn(() => mockShopLists)};
  }).mockImplementationOnce(() => {
    return {execute: jest.fn(() => { throw new Error(mockError); })};
  });
});

jest.mock('../domain/use-cases/RemoveShopListUseCase.js', () => {
  return jest.fn().mockImplementationOnce(() => {
    return {execute: jest.fn()};
  }).mockImplementationOnce(() => {
    return {execute: jest.fn(() => { throw new Error(mockError); })};
  });
});

const observer = {
  update: jest.fn()
}

describe('Test HomeScreenPresenter', () => {
  let presenter;

  beforeEach(() => {
    presenter = new HomeScreenPresenter(observer);
  });

  afterEach(() => {
    GetAllShopListsUseCase.mockClear();
    RemoveShopListUseCase.mockClear();
  });

  it('State on constructor', () => {
    expect(presenter.state.isLoading).toBeTruthy();
    expect(presenter.state.refresh).toBeFalsy();
    expect(presenter.state.error).toBeNull();
    expect(presenter.state.shopLists).toHaveLength(0);
  });

  it('State on getAllShopLists', async () => {
    const spy = jest.spyOn(presenter, 'notifyObservers');
    const currentState = presenter.state;
    expect(currentState.shopLists).toHaveLength(0);

    await presenter.getAllShopLists();
    expect(spy).toBeCalledWith({ 
      error: null,
      shopLists: mockShopLists,
      isLoading: false,
      refresh: true});
    expect(currentState.shopLists).toHaveLength(1);
    expect(spy).toBeCalledTimes(2);
    expect(GetAllShopListsUseCase).toBeCalledTimes(1);
    spy.mockRestore();
  });

  it('State when error occurred on getAllShopLists', async () => {
    const spy = jest.spyOn(presenter, 'notifyObservers');
    const currentState = presenter.state;
    await presenter.getAllShopLists();
    
    expect(spy).toBeCalledWith({ 
      error: mockError,
      shopLists: [],
      isLoading: false,
      refresh: false});
    expect(currentState.shopLists).toHaveLength(0);
    expect(spy).toBeCalledTimes(2);
    expect(GetAllShopListsUseCase).toBeCalledTimes(1);
    spy.mockRestore();
  });

  it('State on deleteShopList', async () => {
    const spy = jest.spyOn(presenter, 'notifyObservers');
    presenter.state.shopLists = mockShopLists;
    const currentState = presenter.state;
    expect(currentState.shopLists).toHaveLength(1);
    await presenter.deleteShopList(mockShopLists[0]);
    expect(spy).toBeCalledWith({ 
      error: null,
      shopLists: [],
      isLoading: false,
      refresh: true});
    expect(currentState.shopLists).toHaveLength(0);
    expect(spy).toBeCalledTimes(2);
    expect(RemoveShopListUseCase).toBeCalledTimes(1);
    spy.mockRestore();
  });

  it('State when error occurred on deleteShopList', async () => {
    const spy = jest.spyOn(presenter, 'notifyObservers');
    presenter.state.shopLists = mockShopLists;
    const currentState = presenter.state;
    expect(currentState.shopLists).toHaveLength(1);
    await presenter.deleteShopList(mockShopLists[0]);
    expect(spy).toBeCalledWith({ 
      error: mockError,
      shopLists: mockShopLists,
      isLoading: false,
      refresh: false});
    expect(currentState.shopLists).toHaveLength(1);
    expect(spy).toBeCalledTimes(2);
    expect(RemoveShopListUseCase).toBeCalledTimes(1);
    spy.mockRestore();
  });
});
