import S3 from 'aws-sdk/clients/s3';
import dynamoose from 'dynamoose';

export interface FooBarInterface {
  foo: string;
}

const getFile = async (key: string | undefined): Promise<FooBarInterface> => {
  const s3 = new S3();
  const options: S3.Types.GetObjectRequest = {
    Bucket: process.env.BUCKET || 'undefined-bucket',
    Key: key || 'undefined-key',
  };

  const file = await s3.getObject(options).promise();
  return Buffer.from(file.Body?.toString()) as FooBarInterface;
};

const storeRecord = async (object: FooBarInterface): Promise<void> => {
  const s3 = new S3();
  const options: S3.Types.GetObjectRequest = {
    Bucket: process.env.BUCKET || 'undefined-bucket',
    Key: key || 'undefined-key',
  };

  const file = await s3.getObject(options).promise();
  return Buffer.from(file.Body?.toString()) as FooBarInterface;
};

export const handler = async (): Promise<void> => {
  try {
  } catch (error) {
    console.log(error);
  }
};
