import { v4 as uuid } from 'uuid';
import dynamoose from './dynamoose';

export const fooSchema = new dynamoose.Schema({
  id: {
    type: String,
    required: true,
    hashKey: true,
    default: uuid,
  },
  foo: {
    type: String,
    required: true,
  },
});
