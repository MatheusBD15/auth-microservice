import { Decrypter } from '@src/data/protocols';
import { DbLoadAccountByToken } from '@src/data/usecases/db-load-account-by-token';
import { mockDecrypter } from '@test-suite/data';
import { trhowError } from '@test-suite/helper';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
};

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return {
    sut,
    decrypterStub,
  };
};

describe('DbLoadAccountByToken Usecase', () => {
  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.loadByToken('any_token');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  it('Should return null if Decrypter return null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(null));
    const account = await sut.loadByToken('any_token');
    expect(account).toBeNull();
  });

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(trhowError);
    const promise = sut.loadByToken('any_token');
    await expect(promise).rejects.toThrow();
  });
});