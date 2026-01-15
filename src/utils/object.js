/**
 * @description Pick only defined fields from a source object
 */
export const pickDefined = (source, fields) => {
  return fields.reduce((acc, field) => {
    if (source[field] !== undefined) {
      acc[field] = source[field];
    }
    return acc;
  }, {});
};
