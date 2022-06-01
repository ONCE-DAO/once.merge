import { BaseOnce } from "./BaseOnce.class.mjs";

export abstract class BaseNodeOnce extends BaseOnce {
  constructor() {
    super(global);
    this.ENV = process.env;
  }
}
