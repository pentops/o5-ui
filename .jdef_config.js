const EXCLUDED_NAMESPACES = ['service', 'topic'];

module.exports = {
  jdefJsonSource: {
    service: {
      url: process.env.O5_REGISTRY_JDEF_URL,
    },
  },
  typeOutput: {
    directory: './data/types/generated',
    fileName: 'index.ts',
  },
  clientOutput: {
    directory: './data/api/generated',
    fileName: 'index.ts',
  },
  types: {
    nameWriter: (x) =>
      x
        .split('.')
        .filter((s) => s && !EXCLUDED_NAMESPACES.includes(s.toLowerCase()))
        .map((s) => s?.[0]?.toUpperCase() + s?.slice(1))
        .join(''),
  },
  client: {
    methodNameWriter: (method) =>
      method.fullGrpcName
        .split(/[./]/)
        .filter((s) => s && !EXCLUDED_NAMESPACES.includes(s.toLowerCase()))
        .map((s, i) => (i === 0 ? s : s[0].toUpperCase() + s.slice(1)))
        .join(''),
  },
};
