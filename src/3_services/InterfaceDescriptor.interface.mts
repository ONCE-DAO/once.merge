import ClassDescriptor from "../2_systems/Things/ClassDescriptor.class.mjs";
import UcpComponentDescriptorInterface from "./UcpComponentDescriptor.interface.mjs";

export default interface InterfaceDescriptorInterface {
    ucpComponentDescriptor: UcpComponentDescriptorInterface;
    extends: InterfaceDescriptorInterface[];
    name: string;
    componentExport: 'namedExport' | 'defaultExport' | undefined;
    componentExportName: string;
    packagePath: string;
    packageName: string;
    packageVersion: string;
    allExtendedInterfaces: InterfaceDescriptorInterface[];
    implementedInterfaces: InterfaceDescriptorInterface[];

    addImplementation(classDescriptor: ClassDescriptor): InterfaceDescriptorInterface;

    addExtension(packagePath: string, packageName: string, packageVersion: string | undefined, interfaceName: string): InterfaceDescriptorInterface;
    add(object: InterfaceDescriptorInterface | UcpComponentDescriptorInterface): InterfaceDescriptorInterface;
    _getImplementedInterfaces(input: InterfaceDescriptorInterface[]): InterfaceDescriptorInterface[];

}
