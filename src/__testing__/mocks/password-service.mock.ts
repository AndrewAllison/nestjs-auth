export const mockedHashValue = '12345678907654regfhytre';
export const mockedSalt = '2134567uytrgewq3456';
export const mockPasswordService = {
  createPasswordHash: (strParam) => {
    if (strParam) {
      return { hash: mockedHashValue, salt: mockedSalt };
    }
    return { hash: mockedHashValue, salt: mockedSalt };
  },
  createRandomCode: jest.fn(),
  validatePassword: jest.fn(),
};
