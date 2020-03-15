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
    // eslint-disable-next-line constructor-super
    // console.log('[SERVERLESS]', serverless);
    // console.log('[options]', options);
    // const functions = serverless.service.getAllFunctions();
    // functions.forEach(f => console.log(serverless.service.getFunction(f)));
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
    const { service } = this.serverless;
    service.getAllFunctions().forEach(async f => {
      const env = (service.getFunction(f).environment as unknown) as Environment;
      if (env.INVOKE_AFTER_DEPLOY) {
        const lambda = new Lambda({
          region: this.options.region || 'us-east-1',
        });
        const options: InvocationRequest = {
          FunctionName: `${service.getServiceName()}-${this.options.stage}-${f}`,
        };
        const invocation = await lambda.invoke(options).promise();
        this.serverless.cli.log(this.log(invocation.StatusCode));
      }
    });
  }

  /**
   * @method log
   * @param {(string | number | undefined)} msg
   * @returns {string}
   * @memberof InvokeAfterDeploy
   */
  // eslint-disable-next-line class-methods-use-this
  log(msg: string | number | undefined): string {
    return `Invoke Function: ${chalk.yellow(msg)}`;
  }
}

module.exports = InvokeAfterDeploy;
