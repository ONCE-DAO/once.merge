import ClassDescriptor from "../2_systems/Things/DefaultClassDescriptor.class.mjs";
import Class from "./Class.interface.mjs";

export default interface Thing<ClassInterface> {
  id: string;
  init(...a: any[]): any;
  name: string;

  classDescriptor: ClassDescriptor
  destroy(): void;
  objectState: ThingObjectState
}

export enum ThingObjectState { 'ACTIVE' = 'active', 'DESTROYED' = 'destroyed' }
export interface ThingStatics<StaticClassInterface> extends Class<any> {
  classDescriptor: ClassDescriptor
}
