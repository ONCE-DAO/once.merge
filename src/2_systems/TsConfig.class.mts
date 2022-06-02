import { readFileSync } from "fs";

export class TSConfig {

  compilerOptions: any;

  init(path: string) {
    let tsConfig = JSON.parse(readFileSync(path).toString());
    for (const key of Object.keys(tsConfig)) {
      if (key in this) {
        //@ts-ignore
        this[key] = tsConfig[key];
      }
    }
    return this;
  }

}
