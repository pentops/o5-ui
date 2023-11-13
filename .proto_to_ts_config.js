import ts from 'typescript';
import protobuf from 'protobufjs';
import { camelCase } from 'change-case';

const optionalFieldMarker = ts.factory.createToken(ts.SyntaxKind.QuestionToken);

export default {
  protoGitRepository: ['git@github.com:pentops/o5-pb.git', 'git@github.com:pentops/protoc-gen-listify.git'],
  namespacesToIgnore: ['google', 'sample'],
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
  customMemberBuilder: (field, getBaseFieldType) => {
    if (field.partOf instanceof protobuf.OneOf && !field.options?.['proto3_optional']) {
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
