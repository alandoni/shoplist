import HomeScreenPresenter from '../presentation/presenters/HomeScreenPresenter';
import GetAllShopListsUseCase from '../domain/use-cases/GetAllShopListsUseCase';
import RemoveShopListUseCase from '../domain/use-cases/RemoveShopListUseCase';
import { mockError, mockShopList } from './Mocks';

const observer = {
  update: jest.fn()
}

jest.mock('../domain/use-cases/GetAllShopListsUseCase.js', () => {
  return jest.fn().mockImplementationOnce(() => {
    return {execute: jest.fn(() => { throw new Error(mockError); })};
  });
});

jest.mock('../domain/use-cases/RemoveShopListUseCase.js', () => {
  return jest.fn().mockImplementationOnce(() => {
    return {execute: jest.fn(() => { throw new Error(mockError); })};
  });
});

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

  it('State on getAllShopLists', async () => {
    const spy = jest.spyOn(presenter, 'notifyObservers');
    const currentState = presenter.state;
    expect(currentState.shopLists).toHaveLength(0);

    await presenter.getAllShopLists();
    expect(spy).toBeCalledWith({ 
      error: null,
      shopLists: [mockShopList],
      isLoading: false,
      refresh: true});
    expect(currentState.shopLists).toHaveLength(1);
    expect(spy).toBeCalledTimes(2);
    expect(GetAllShopListsUseCase).toBeCalledTimes(1);
    spy.mockRestore();
  });

  it('State when error occurred on deleteShopList', async () => {
    const spy = jest.spyOn(presenter, 'notifyObservers');
    presenter.state.shopLists = [mockShopList];
    const currentState = presenter.state;
    expect(currentState.shopLists).toHaveLength(1);
    await presenter.deleteShopList(mockShopLists[0]);
    expect(spy).toBeCalledWith({ 
      error: mockError,
      shopLists: [mockShopList],
      isLoading: false,
      refresh: false});
    expect(currentState.shopLists).toHaveLength(1);
    expect(spy).toBeCalledTimes(2);
    expect(RemoveShopListUseCase).toBeCalledTimes(1);
    spy.mockRestore();
  });

  it('State on deleteShopList', async () => {
    const spy = jest.spyOn(presenter, 'notifyObservers');
    presenter.state.shopLists = [mockShopList];
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
});
