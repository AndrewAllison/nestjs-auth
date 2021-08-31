import { differenceByProp } from './array-functions';

const determineConnections = (
  newArray,
  existingArray,
  comparePropName = 'id',
) => {
  const connect = differenceByProp(
    newArray,
    existingArray,
    comparePropName,
  ).map((c) => ({
    [comparePropName]: c[comparePropName],
  }));
  const disconnect = differenceByProp(
    existingArray,
    newArray,
    comparePropName,
  ).map((c) => ({
    [comparePropName]: c[comparePropName],
  }));

  const owners = {
    connect: connect.length > 0 ? connect : undefined,
    disconnect: disconnect.length > 0 ? disconnect : undefined,
  };
  return owners;
};

export { determineConnections };
