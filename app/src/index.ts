import S3 from 'aws-sdk/clients/s3';
import { FooModel } from './foo.model';

export interface FooBarInterface {
  id?: string;
  foo: string;
}

const getFile = async (key: string | undefined): Promise<FooBarInterface> => {
  const s3 = new S3({
    endpoint: process.env.NODE_ENV === 'local' ? 'htt://localhost:4572' : undefined,
  });
  const options: S3.Types.GetObjectRequest = {
    Bucket: process.env.BUCKET || 'undefined-bucket',
    Key: key || 'undefined-key',
  };

  const file = await s3.getObject(options).promise();
  if (!file.Body) throw new Error('Empty file');
  return { ...JSON.parse(file.Body.toString()) as FooBarInterface };
};

const storeRecord = async (object: FooBarInterface): Promise<void> => {
  await FooModel.create(object).then((data) => console.log(`Record created with id: ${data.id}`));
};

export const handler = async (): Promise<void> => {
  try {
    console.log('ENV', process.env);
    await getFile(process.env.OBJECT_KEY).then(storeRecord);
  } catch (error) {
    console.log(error);
  }
};
