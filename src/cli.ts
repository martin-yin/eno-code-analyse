import cac from 'cac';

import { version } from '../package.json';
import { startAnalyse } from './analyse';
import { loadConfig } from './config';
import { getRemoteConfigPath } from './utils/remoteConfig';

const VERSION = version as string;
const cli = cac('code-analyse');

type Options = {
  remote?: string;
  config?: string;
};

cli.help();
cli.version(VERSION);

cli
  .command('start', '代码分析')
  .option('-r, --remote <url>', `[string] 远程获取配置，cli 优先获取 --remote 的配置`)
  .option('-c, --config <file>', `[string] 配置文件地址`)
  .action(async (options: Options) => {
    const cwd = process.cwd();

    if (options.remote) {
      const configPath = await getRemoteConfigPath(options.remote);

      options.config = configPath;
    }

    const config = await loadConfig({
      cwd,
      configPath: options.config ?? ''
    });

    startAnalyse(config);
  });

cli.parse();
