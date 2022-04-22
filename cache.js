/**
 * @typedef {Map} Cache
 * @param {Cache} cache
 * @returns {Cache}
 */
const ultraCache = (cache) => {
  if (self.__ultra instanceof Array) return new Map(self.__ultra);
  else if (cache instanceof Map) return cache;
  else return new Map();
};

export default ultraCache;
