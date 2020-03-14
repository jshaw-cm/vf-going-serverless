import { v4 as uuid } from 'uuid';
import dynamoose from 'dynamoose';

dynamoose.setDDB({
  config: {
    endpoint: process.env.NODE_ENV === 'local' ? 'htt://localhost:4569' : undefined,
  },
});

export const fooSchema = new dynamoose.Schema({
  id: {
    type: String, required: true, hashKey: true, default: uuid,
  },
  foo: {
    type: String,
    required: true,
  },
});
