import rawAws from 'aws-sdk';
import awsXray from 'aws-xray-sdk';
import pino from 'pino';
import { FooModel } from './foo.model';
import { FooBarInterface } from './foo.interface';

// add xray to AWS object
const AWS = awsXray.captureAWS(rawAws) as typeof rawAws;

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

// Add xray to logger
awsXray.setLogger(l);

/**
 * @function getFile
 * @param {(String)} key
 * @returns {(Promise<FooBarInterface>)}
 * @description get file from s3
 */
const getFile = async (key: string | undefined): Promise<FooBarInterface> => {
  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  const options: AWS.S3.Types.GetObjectRequest = {
    Bucket: process.env.BUCKET || 'undefined-bucket',
    Key: key || 'undefined-key',
  };

  const file = await s3.getObject(options).promise();
  if (!file.Body) throw new Error('Empty file');
  return { ...(JSON.parse(file.Body.toString()) as FooBarInterface) };
};

/**
 * @function storeObject
 * @param {(FooBarInterface)} object
 * @returns {(Promise<void>)}
 * @description store object in dynamodb
 */
const storeObject = async (object: FooBarInterface): Promise<FooBarInterface> => {
  // create dynamo object
  const res = await FooModel.create(object);
  if (res.id) l.debug(`Created with id: ${res.id}`);
  return res;
};
/**
 * @async handler
 * @returns {Promise<FooBarInterface>}
 */
export const handler = async (): Promise<FooBarInterface> => {
  try {
    l.debug(process.env);
    /**
     * 1. Get file from s3
     * 2. Store object in file to dynamodb
     * return stored object
     */
    return await getFile(process.env.OBJECT_KEY).then(storeObject);
  } catch (error) {
    l.warn(error);
    // Return error if it occurs
    return error;
  }
};
