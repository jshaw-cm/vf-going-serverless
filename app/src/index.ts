import AWS from 'aws-sdk';
import { FooModel } from './foo.model';

if (process.env.NODE_ENV === 'local') {
  const config = new AWS.Config({
    dynamodb: {
      endpoint: 'htt://localhost:4569',
    },
    s3: {
      endpoint: 'htt://localhost:4572',
    },
  });

  AWS.config = config;
}
export interface FooBarInterface {
  id?: string;
  foo: string;
}

const getFile = async (key: string | undefined): Promise<FooBarInterface> => {
  const s3 = new AWS.S3();
  const options: AWS.S3.Types.GetObjectRequest = {
    Bucket: process.env.BUCKET || 'undefined-bucket',
    Key: key || 'undefined-key',
  };

  const file = await s3.getObject(options).promise();
  if (!file.Body) throw new Error('Empty file');
  return { ...(JSON.parse(file.Body.toString()) as FooBarInterface) };
};

const storeRecord = async (object: FooBarInterface): Promise<void> => {
  await FooModel.create(object).then(data => console.log(`Record created with id: ${data.id}`));
};

export const handler = async (): Promise<void> => {
  try {
    console.log('ENV', process.env);
    await getFile(process.env.OBJECT_KEY).then(storeRecord);
  } catch (error) {
    console.log(error);
  }
};
