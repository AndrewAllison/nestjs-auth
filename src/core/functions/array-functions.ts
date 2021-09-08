/***
 * Compares 2 arrays by a specified property and returns the difference
 * @return Returns an array with the differences between the arrays.
 * @param source The initial array to compare
 * @param secondary The second array to find the elements of
 * @param compareBy the property to be compared by
 */
const differenceByProp = (source, secondary, compareBy) =>
  source.filter(
    (r) => secondary.filter((c) => c[compareBy] === r[compareBy]).length <= 0,
  );

/***
 * Compares both arrays and returns an array containing all the elements in the original that are not in the alternate
 * and vice-versa. Similar to symmetricalDifference but uses object properties name for comparison.
 * @param original
 * @param alternate
 * @param propName
 */
const symmetricalDifferenceByProp = (original, alternate, propName) =>
  differenceByProp(original, alternate, propName).concat(
    differenceByProp(alternate, original, propName),
  );

/***
 * Compares 2 arrays and returns the items that appear in both arrays
 * @param original original array to compare
 * @param alternate Secondary array to check for similarities.
 * @param comparisonProp The property that will be used for comparisons.
 */
const intersectionByProp = (original, alternate, comparisonProp) =>
  original.filter(
    (r) =>
      alternate.filter((c) => c[comparisonProp] === r[comparisonProp]).length >
      0,
  );

/***
 * Will compare 2 arrays and return a unique list of all items in both
 * @param original Array to union
 * @param alternate 2nd Array to union
 * @param propName The prop to check for uniqueness.
 * @return {unknown[]}
 */
const unionByProp = (original, alternate, propName) => [
  ...new Set([...original, differenceByProp(alternate, original, propName)]),
];

/***
 * Returns the intersection of 2 arrays. Meaning the items that are in both
 * @param a Initial array to check
 * @param b Secondary array to check.
 * @example original = [1,3,4,5] alternate = [1,2,5,6,7] returned = [1,5]
 */
const intersection = (a, b) => a.filter((value) => b.indexOf(value) !== -1);

/***
 * Compares two arrays and returns the difference.
 * @param a first array to compare.
 * @param b second array to compare.
 */
const difference = (a, b) => a.filter((x) => !b.includes(x));

/***
 * Compares 2 arrays and will return elements that are in original bu not in alternate and vice-versa.
 * @param original Original array for comparison
 * @param alternate Alternate array for comparison
 * @example original = [1,3,4,5] alternate = [1,2,5,6,7] returned = [2,3,4,6,7]
 */
const symmetricalDifferences = (original, alternate) =>
  original
    .filter((x) => !alternate.includes(x))
    .concat(alternate.filter((x) => !original.includes(x)));

/***
 * Will compare 2 arrays and return a unique list of all items in both
 * @param original
 * @param alternate
 * @return {*[]}
 */
const union = (original, alternate) => [
  ...new Set([...original, ...alternate]),
];

export {
  differenceByProp,
  intersectionByProp,
  symmetricalDifferenceByProp,
  unionByProp,
  symmetricalDifferences,
  difference,
  intersection,
  union,
};
