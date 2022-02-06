export default ultraCache = (cache) => {
  if (self.__ultra instanceof Array) return new Map(self.__ultra);
  else if (cache instanceof Map) return cache;
  else return new Map();
};
