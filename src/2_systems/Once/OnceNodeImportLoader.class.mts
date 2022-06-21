import OnceInterface, { OnceMode, OnceState } from "../../3_services/Once.interface.mjs";

import DefaultIOR from "../Things/DefaultIOR.class.mjs";
import { BaseNodeOnce } from "../../1_infrastructure/BaseNodeOnce.class.mjs";

import { loaderReturnValue } from "../../3_services/Loader.interface.mjs";
import { existsSync, readFileSync } from "fs";
import OnceNodeServer from "./OnceNodeServer.class.mjs";

function load(
  url: string,
  context: loadContext,
  defaultLoad: Function
): Promise<{
  format: "builtin" | "commonjs" | "json" | "module" | "wasm";
  source: string | ArrayBuffer | Int8Array;
}> {
  // TODO hook it load via IOR
  return defaultLoad(url, context, defaultLoad);
}

/**
* This example has the application context send a message to the loader
* and sends the message back to the application context
* @param {{
   port: MessagePort,
 }} utilities Things that preload code might find useful
* @returns {string} Code to run before application startup
*/
function globalPreload() {
  global.NODE_JS = true;
}


// const load = loadDummy;
// const resolve = resolve;
// const globalPreload = globalPreload;

type resolveContext = {
  conditions: string[];
  importAssertions: object;
  parentURL: string | undefined;
};

type loadContext = {
  format: string | null | undefined;
  importAssertions: any;
};


export default class OnceNodeImportLoader extends OnceNodeServer {


  creationDate: Date = new Date();
  ENV = process.env;
  mode = OnceMode.NODE_LOADER;
  state = OnceState.DISCOVER_SUCCESS;
  private static instance: any;

  init(...a: any[]) {
    throw new Error("Method not implemented.");
  }


  async start(): Promise<OnceNodeImportLoader> {
    console.log("ONCE STARTED AS NODE_LOADER");
    return this;
  }

  static async start(): Promise<OnceNodeImportLoader> {
    console.log("ONCE STARTED AS NODE_LOADER");
    const once = new OnceNodeImportLoader(await this.initEAMD());
    return once;
  }

  async resolve(
    specifier: string,
    context: resolveContext,
    defaultResolve: Function
  ): Promise<{ url: string }> {
    if (specifier.startsWith("ior:"))
      specifier = await DefaultIOR.load(specifier, { returnValue: loaderReturnValue.path });
    return defaultResolve(specifier, context, defaultResolve);
  }
}

let once = await OnceNodeImportLoader.start();

const resolve = once.resolve;

export { load, resolve, globalPreload };
