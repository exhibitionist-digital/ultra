// @ts-check

/**
 * @typedef {Map<unknown, unknown>} Cache
 * @param {Cache} cache
 * @returns {Cache}
 */
const ultraCache = (cache) => {
  const __ultra = self?.__ultra || new Map();
  if (__ultra instanceof Array) return new Map(__ultra);
  if (cache instanceof Map) return cache;
  return new Map();
};

export default ultraCache;
