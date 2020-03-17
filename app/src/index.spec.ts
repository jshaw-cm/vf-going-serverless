// eslint-disable-next-line import/no-extraneous-dependencies
import awsMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { PutItemInput } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import { GetObjectOutput, GetObjectRequest } from 'aws-sdk/clients/s3';
import { storeObject, getFile } from './index';
import { FooBarInterface } from './foo.interface';
import dynamoose from './dynamoose';

awsMock.setSDKInstance(dynamoose.AWS);

beforeEach(() => {
  awsMock.restore();
});

describe('Foo handler tests', () => {
  it('stores an object in dynamodb', async () => {
    awsMock.setSDKInstance(dynamoose.AWS);
    // mock putitem
    awsMock.mock('DynamoDB', 'putItem', (params: PutItemInput, callback: Function) => {
      console.log('DynamoDB', 'putItem', 'mock called');
      callback(null, {});
    });

    const input: FooBarInterface = {
      id: '123',
      foo: 'bar',
    };

    const res = await storeObject(input);
    const test: FooBarInterface = {
      id: res.id,
      foo: res.foo,
    };

    expect(test).toStrictEqual({ id: '123', foo: 'bar' });
  });

  it('gets a file', async () => {
    awsMock.setSDKInstance(AWS);

    const s3Resp: GetObjectOutput = {
      Body: Buffer.from(`{ "foo": "bar" }`),
    };

    awsMock.mock('S3', 'getObject', (params: GetObjectRequest, callback: Function) => {
      console.log('S3', 'getObject', 'mock called');
      callback(null, s3Resp);
    });

    const test: FooBarInterface = await getFile('key', 'bucket');
    expect(test).toStrictEqual({ foo: 'bar' });
  });

  it.skip('handles a request', async () => {});
});
