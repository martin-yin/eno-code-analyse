import type { PluginInterface } from './plugin';

export class EslintDisableNextLinePlugin implements PluginInterface {
  name = 'EslintDisableNextLinePlugin';

  private context = new Map<string, Map<string, any>>();

  initPlugin(): void {
    throw new Error('Method not implemented.');
  }

  startAnalyse(_orginFileName: any) {
    console.log(_orginFileName);
  }

  format() {
    return this.context;
  }

  report() {
    return false;
  }
}
