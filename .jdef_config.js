import { camelCase, pascalCase } from 'change-case';
import i18nPlugin from './.codegen/jdef-i18n-plugin.js';
import { psmTableConfigPlugin } from './.codegen/jdef-table-config-plugin.js';

const EXCLUDED_NAMESPACES = ['service', 'topic'];

const organization = 'pentops';
const projects = [
  {
    name: 'dante',
    version: process.env.O5_DANTE_VERSION || 'main',
  },
  {
    name: 'o5-deploy',
    version: process.env.O5_DEPLOY_VERSION || 'main',
  },
];
const version = process.env.O5_REGISTRY_IMAGE_VERSION || 'v1';

export default {
  jsonSource: projects.map((project) => ({
    service: {
      url: `${process.env.O5_REGISTRY_URL}/${version}/${organization}/${project.name}/${project.version}/api.json`,
    },
  })),
  typeOutput: {
    directory: './src/data/types/generated',
    fileName: 'index.ts',
  },
  clientOutput: {
    directory: './src/data/api/generated',
    fileName: 'index.ts',
  },
  types: {
    nameWriter: (x) =>
      x
        .split('.')
        .reduce((acc, curr) => {
          if (curr && !EXCLUDED_NAMESPACES.includes(curr.toLowerCase())) {
            acc.push(pascalCase(curr));
          }

          return acc;
        }, [])
        .join(''),
  },
  client: {
    methodNameWriter: (method) =>
      method.fullGrpcName
        .split(/[./]/)
        .reduce((acc, curr) => {
          if (curr && !EXCLUDED_NAMESPACES.includes(curr.toLowerCase())) {
            acc.push(acc.length === 0 ? camelCase(curr) : pascalCase(curr));
          }

          return acc;
        }, [])
        .join(''),
  },
  plugins: [i18nPlugin, psmTableConfigPlugin],
};
