import { determineConnections } from './relationship-functions';

describe('relationship-functions', () => {
  it('should retunr the connect details of a new user when no existing ones', () => {
    const existingArray = [];
    const modifiedArray = [{ id: 1, name: 'User' }];
    const result = determineConnections(modifiedArray, existingArray);
    expect(result).toEqual({ connect: [{ id: 1 }], disconnect: undefined });
  });
  it('should return the correct users to connect when already existing ones.', () => {
    const existingArray = [{ id: 1, name: 'User' }];
    const modifiedArray = [
      { id: 1, name: 'User' },
      { id: 2, name: 'User1' },
    ];
    const result = determineConnections(modifiedArray, existingArray);
    expect(result).toEqual({ connect: [{ id: 2 }], disconnect: undefined });
  });
  it('should return the correct users to disconnect when already existing ones.', () => {
    const removedArray = [{ id: 1, name: 'User' }];
    const existingArray = [
      { id: 1, name: 'User' },
      { id: 2, name: 'User1' },
    ];
    const result = determineConnections(removedArray, existingArray);
    expect(result).toEqual({ disconnect: [{ id: 2 }], connect: undefined });
  });
});
