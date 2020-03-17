import AWS from 'aws-sdk';
import pino from 'pino';
import { FooModel } from './foo.model';
import { FooBarInterface } from './foo.interface';
// Setup logger
const l = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    useLevelLabels: true,
    messageKey: 'message',
    base: {
      serviceName: process.env.SERVICE_NAME || 'foo-service',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.destination(1)
);

l.info('Logger setup');

/**
 * @function getFile
 * @param {(String)} key
 * @returns {(Promise<FooBarInterface>)}
 * @description get file from s3
 */
export const getFile = async (key: string, bucket: string): Promise<FooBarInterface> => {
  const s3 = new AWS.S3();

  const options: AWS.S3.Types.GetObjectRequest = {
    Bucket: bucket,
    Key: key,
  };

  // Get file from s3
  l.info('Getting file from bucket');
  const file = await s3.getObject(options).promise();
  if (!file.Body) throw new Error('Empty file');
  // return contents of file as FooBarInterface
  l.info('Return contents of file as FooBarInterface');
  return { ...(JSON.parse(file.Body.toString()) as FooBarInterface) };
};

/**
 * @function storeObject
 * @param {(FooBarInterface)} object
 * @returns {(Promise<void>)}
 * @description store object in dynamodb
 */
export const storeObject = async (object: FooBarInterface): Promise<FooBarInterface> => {
  // create dynamo object
  l.info({ object }, 'Insert object');
  const res = await FooModel.create(object);
  l.info({ res }, 'Response from dynamodb');
  if (res.id) l.info(`Created with id: ${res.id}`);
  return res;
};
/**
 * @async handler
 * @returns {Promise<FooBarInterface>}
 */
export const handler = async (): Promise<FooBarInterface> => {
  try {
    l.info(process.env);
    l.info({
      key: process.env.OBJECT_KEY || 'NO-OBJECT-KEY',
      bucket: process.env.BUCKET || 'NO-BUCKET',
    });
    /**
     * 1. Get file from s3
     * 2. Store object in file to dynamodb
     * return stored object
     */
    return await getFile(
      process.env.OBJECT_KEY || 'undefined-key',
      process.env.BUCKET || 'undefined-bucket'
    ).then(storeObject);
  } catch (error) {
    l.warn(error);
    // Return error if it occurs
    return error;
  }
};
