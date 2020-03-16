import dynamoose from './dynamoose';
import { fooSchema } from './foo.schema';
import { FooBarInterface } from './foo.interface';

export const FooModel = dynamoose.model<FooBarInterface, dynamoose.Schema>(
  process.env.TABLE || 'foo',
  fooSchema
);
