import fs from 'node:fs';

import type { PluginInstance } from './plugin';

export default class EslintDisableNextLinePlugin implements PluginInstance {
  name = 'EslintDisableNextLinePlugin';

  private context: RegExpMatchArray | Array<string> = [];

  initPlugin(): void {
    throw new Error('Method not implemented.');
  }

  startAnalyse(_orginFileName: string) {
    const comments = this.getESLintDisableCommentsFromFile(_orginFileName) as any;

    this.context = [...this.context, ...comments];
  }

  format() {
    return this.countOccurrences(this.context as any);
  }

  private getESLintDisableCommentsFromFile(_orginFileName: string) {
    const fileContent = fs.readFileSync(_orginFileName, { encoding: 'utf-8' });
    const regex = /\/\/\s*eslint-disable-next-line\s.*$/gm;
    const comments = fileContent.match(regex);

    return comments || [];
  }

  private countOccurrences(arr: RegExpMatchArray | []): any {
    const occurrences: any = {};

    for (const item of arr) {
      if (occurrences.hasOwnProperty(item)) {
        occurrences[item]++;
      } else {
        occurrences[item] = 1;
      }
    }

    return occurrences;
  }
}
