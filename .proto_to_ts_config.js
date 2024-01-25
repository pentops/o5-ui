import ts from 'typescript';
import { camelCase, constantCase, pascalCase } from 'change-case';

const optionalFieldMarker = ts.factory.createToken(ts.SyntaxKind.QuestionToken);

function getEnumKeyName(value) {
  // If the first character is a number, wrap in quotes
  if (!Number.isNaN(Number(value[0]))) {
    return `'${value}'`;
  }

  // If the name contains an unsupported character, wrap it in quotes
  for (const char of value) {
    if (!char.match(/\p{Letter}|[0-9]|\$|_/u)) {
      return `'${value}'`;
    }
  }

  return value;
}

export default {
  protoGitRepository: [
    'git@github.com:pentops/o5-pb.git',
    'git@github.com:pentops/iso-pb.git',
    'git@github.com:pentops/protostate.git',
    'git@github.com:pentops/moretypes.git',
  ],
  namespacesToIgnore: ['google', 'sample', 'testproto', 'test'],
  generateEnumType: 'enum',
  generatedTypeComments: {
    'google.protobuf.Timestamp': 'format: date-time',
    'int64': 'format: int64',
    'fixed64': 'format: fixed64',
    'uint64': 'format: uint64',
    'sint64': 'format: sint64',
    'sfixed64': 'format: sfixed64',
    'bytes': 'format: bytes',
  },
  outputPath: 'src/data/types/generated',
  indexFileHeaderCommentTemplate:
    'DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.',
  fileHeaderCommentTemplate:
    'DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.\nBuilt from: {{sourceFile}}',
  customEnumBuilder: (node, generatedName) => {
    const nameInConstant = `${constantCase(node.name)}_`;

    // If generatedName is not provided, a union type will be returned
    if (generatedName) {
      return ts.factory.createEnumDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier(generatedName),
        Object.keys(node.values || {}).map((value) => {
          const cleanedValue = value.replace(nameInConstant, '');
          const pascalValue = pascalCase(cleanedValue);
          const name = pascalValue.replace(pascalCase(node.name), '') || pascalValue;

          return ts.factory.createEnumMember(getEnumKeyName(name), ts.factory.createStringLiteral(cleanedValue, true));
        }),
      );
    }

    const literals = Object.keys(node.values || {}).map((value) => {
      return ts.factory.createStringLiteral(value.replace(nameInConstant, ''), true);
    });

    return ts.factory.createUnionTypeNode(literals);
  },
  customMemberBuilder: (field, getBaseFieldType) => {
    // Handle enums
    if (
      field.partOf?.constructor?.name === 'OneOf' &&
      !field.options?.['proto3_optional'] &&
      !Boolean(field.parent?.options?.['(j5.ext.v1.message).is_oneof_wrapper'])
    ) {
      // Handle oneof fields
      if (field.id === field.partOf.fieldsArray[0].id) {
        const oneofMembers = field.partOf.fieldsArray.map((f) =>
          ts.factory.createPropertySignature(
            undefined,
            camelCase(f.name),
            f.optional || !f.required ? optionalFieldMarker : undefined,
            getBaseFieldType(f),
          ),
        );

        return ts.addSyntheticTrailingComment(
          ts.addSyntheticLeadingComment(
            ts.factory.createPropertySignature(
              undefined,
              camelCase(field.partOf.name),
              field.optional || !field.required ? optionalFieldMarker : undefined,
              ts.factory.createTypeLiteralNode(oneofMembers),
            ),
            ts.SyntaxKind.SingleLineCommentTrivia,
            ` start oneof "${field.partOf.name}"`,
            false,
          ),
          ts.SyntaxKind.SingleLineCommentTrivia,
          ` end oneof "${field.partOf.name}"`,
          false,
        );
      }

      return null;
    }
  },
};
