import { differenceByProp } from './array-functions';

describe('array-functions', () => {
  describe('differenceByProp', () => {
    it('should compare two arrays', () => {
      const array1 = [{ id: 1, name: 'User' }];
      const array2 = [{ id: 1, name: 'User' }];

      const result = differenceByProp(array1, array2, 'id');

      expect(result).toEqual([]);
    });
    it('should compare two arrays and return the difference', () => {
      const array1 = [{ id: 1, name: 'User1' }];
      const array2 = [{ id: 2, name: 'User2' }];

      const result = differenceByProp(array1, array2, 'id');

      expect(result).toEqual([{ id: 1, name: 'User1' }]);
    });
    it('should compare two arrays and return the difference', () => {
      const array2 = [{ id: 1, name: 'User1' }];
      const array1 = [
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
      ];

      const result = differenceByProp(array1, array2, 'id');

      expect(result).toEqual([{ id: 2, name: 'User2' }]);
    });
  });
});
