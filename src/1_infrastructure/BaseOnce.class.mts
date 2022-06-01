import EAMDInterface from "../3_services/EAMD.interface.mjs";
import Once, { OnceMode, OnceState } from "../3_services/Once.interface.mjs";
import DefaultThing from "./BaseThing.class.mjs";

import { OnceConfig } from "../2_systems/Once/ONCEConfig.class.mjs";
import DefaultIOR from "../2_systems/Things/DefaultIOR.class.mjs";
import ClassDescriptor from "../2_systems/Things/DefaultClassDescriptor.class.mjs";
import IOR from "../3_services/IOR.interface.mjs";

@ClassDescriptor.componentExport('namedExport')
export abstract class BaseOnce extends DefaultThing<Once> implements Once {
  creationDate: Date;
  mode: OnceMode = OnceMode.BOOTING;
  state: OnceState = OnceState.DISCOVER;
  eamd: EAMDInterface | undefined;
  ENV: any;
  global: typeof globalThis;
  protected _config: OnceConfig | undefined;


  async load(ior: IOR | string) {
    let iorObject: IOR;
    if (typeof ior === "string") {
      iorObject = new DefaultIOR().init(ior);
    } else {
      iorObject = ior;
    }
    return iorObject.load();
  }

  constructor(glob: typeof globalThis) {
    super();
    this.creationDate = new Date();
    glob.ONCE = this;
    this.global = glob;
    this.ENV = {};
    glob.ONCE_STARTED = true;
  }


  async getConfig(): Promise<OnceConfig> {
    const configAlias = 'onceConfig';

    if (this._config === undefined) {
      try {
        this._config = await new DefaultIOR().init('ior:ude:http://localhost:3000/UDE/' + configAlias).load();
      } catch (e) {
        console.warn("No stored ONCE Config Instance found");
      }
      if (this._config === undefined) {

        let DefaultOnceConfig = (await import("../2_systems/Once/ONCEConfig.class.mjs")).default;

        this._config = new DefaultOnceConfig();
        this._config.persistanceManager.addAlias(configAlias);
        await this._config.persistanceManager.create();
      }
    }
    return this._config;
  }

  abstract start(): Promise<Once>;
  abstract init(...a: any[]): any;
}
