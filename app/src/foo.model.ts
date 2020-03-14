import dynamoose from '../../../common/dynamoose';
import { fooSchema } from './foo.schema';
import { FooBarInterface } from './index';

export const FooModel = dynamoose.model<FooBarInterface, dynamoose.Schema>(
  process.env.TABLE || 'foo',
  fooSchema
);
