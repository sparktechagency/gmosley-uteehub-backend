import { Schema, SchemaType } from 'mongoose';

type SwaggerSchema = {
  type: string;
  description?: string;
  items?: any;
  enum?: string[];
  default?: any;
  properties?: Record<string, any>;
  required?: string[];
};

function mapMongooseTypeToOpenAPI(type: any): string {
  if (type === String) return 'string';
  if (type === Number) return 'number';
  if (type === Boolean) return 'boolean';
  if (type === Date) return 'string'; // OpenAPI treats Date as string
  if (type === Array) return 'array';
  if (type === Object) return 'object';

  // Special handling for ObjectId
  if (type?.name === 'ObjectId') return 'string';

  return 'string'; // Fallback
}

function schemaConverter(mongooseSchema: Schema, excludeFields: string[] = []): SwaggerSchema {
  const swaggerSchema: SwaggerSchema = {
    type: 'object',
    properties: {},
    required: [],
  };

  const schemaPaths = mongooseSchema.paths;

  Object.keys(schemaPaths).forEach((key) => {
    // Skip internal fields and excluded fields
    if (['__v', '_id', ...excludeFields].includes(key)) return;

    const path: any = schemaPaths[key];
    const options = path.options || {};

    const fieldType = Array.isArray(options.type) ? 'array' : mapMongooseTypeToOpenAPI(options.type || path.instance);

    const fieldSchema: any = {
      type: fieldType,
    };

    // Handle enum
    if (options.enum) {
      fieldSchema.enum = Array.isArray(options.enum.values) ? options.enum.values : options.enum;
    }

    // Handle default
    if (options.default !== undefined) {
      fieldSchema.default = options.default;
    }

    // Handle array item type
    if (fieldType === 'array') {
      const itemType = options.type[0] || {};
      fieldSchema.items = {
        type: mapMongooseTypeToOpenAPI(itemType.type || itemType),
      };
    }

    // Handle required
    if (options.required) {
      swaggerSchema.required!.push(key);
    }

    swaggerSchema.properties![key] = fieldSchema;
  });

  return swaggerSchema;
}

export default schemaConverter;
