import Serverless from 'serverless';
import { Hooks } from 'serverless/classes/Plugin';
import Lambda, { InvocationRequest } from 'aws-sdk/clients/lambda';
import chalk from 'chalk';

interface Environment {
  INVOKE_AFTER_DEPLOY: boolean;
}

/**
 * @class InvokeAfterDeploy
 */
class InvokeAfterDeploy {
  hooks: Hooks;

  serverless: Serverless;

  options: Serverless.Options;

  constructor(serverless: Serverless, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'after:deploy:deploy': async (): Promise<void> => {
        await this.invoke();
      },
    };
  }

  /**
   * @method invoke
   * @memberof InvokeAfterDeploy
   */
  invoke(): void {
    try {
      // Pluck service out of this.serverless
      const { service } = this.serverless;
      // Get all functions
      service.getAllFunctions().forEach(async f => {
        const env = (service.getFunction(f).environment as unknown) as Environment;
        // Check if lambda is needs to be invoked after deploy
        if (env.INVOKE_AFTER_DEPLOY) {
          // create lamba client, set region
          const lambda = new Lambda({
            region: this.options.region || 'us-east-1',
          });
          // Construct options for lamba invocation
          const options: InvocationRequest = {
            // parameterize Function name
            FunctionName: `${service.getServiceName()}-${this.options.stage}-${f}`,
          };
          const invocation = await lambda.invoke(options).promise();
          if (invocation.Payload)
            this.serverless.cli.log(this.log(invocation.Payload.toString(), false));
          else throw new Error('No response payload');
        }
      });
    } catch (error) {
      const e = { ...error } as Error;
      this.serverless.cli.log(this.log(e.message, true));
    }
  }

  /**
   * @method log
   * @param {(string | number | undefined)} msg
   * @returns {string}
   * @memberof InvokeAfterDeploy
   */
  // eslint-disable-next-line class-methods-use-this
  log(msg: string | number | undefined, error: boolean): string {
    const prefix = 'Invoke Function: ';
    switch (error) {
      case true:
        return `${prefix}${chalk.red(msg)}`; // Return red if error
      default:
        return `${prefix}${chalk.white(msg)}`; // Return white if no error
    }
  }
}

module.exports = InvokeAfterDeploy;
