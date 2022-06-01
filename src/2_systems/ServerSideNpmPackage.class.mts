import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

import fs from 'fs';
import path from 'path';
import { NpmPackage } from "./NpmPackage.class.mjs";


export class ServerSideNpmPackage extends NpmPackage {

  static getByFolder(path: string): ServerSideNpmPackage | undefined {
    return this.getByPath(join(path, "package.json"));
  }

  static getByPath(path: string): ServerSideNpmPackage | undefined {
    if (!existsSync(path)) return undefined;
    const npmPackage: ServerSideNpmPackage = JSON.parse(readFileSync(path).toString());
    npmPackage.path = path;
    return npmPackage;
  }

  static getByPackage(path: string, name: string, version: string): NpmPackage {
    const nameString = `${path}.${name}[${version}]`
    let npmPackageInstance = this._store[nameString];

    if (npmPackageInstance === undefined) {

      npmPackageInstance = new NpmPackage().init(path, name, version);
      this._store[nameString] = npmPackageInstance;
    }
    return npmPackageInstance
  }


  get localBaseDir(): string {
    // HACK Change with real Components
    return process.cwd() + '/src';
  }


  static async discover(): Promise<ServerSideNpmPackage[]> {
    let result: ServerSideNpmPackage[] = [];

    // TODO: Sollte ein zentrales EAMD.ucp Root dir geben
    let dir = process.cwd().replace(/\/EAMD.ucp\/.*/, '/EAMD.ucp/') + '/Components/';

    let thisProxy = this;

    function walkDir(currentPath: string) {
      let files = fs.readdirSync(currentPath);
      if (files.includes('package.json')) {
        let packageObject = thisProxy.getByPath(path.join(currentPath, 'package.json'));
        if (packageObject) {
          result.push(packageObject)
        }
      }
      for (let file of files) {
        let curFile = path.join(currentPath, file);
        if (fs.statSync(curFile).isDirectory() && !file.endsWith('node_modules') && !file.startsWith('.')) {
          walkDir(curFile);
        }
      }
    };

    walkDir(dir);


    return result;
  }

  static async getNpmPackage(packageString: string, name: string): Promise<NpmPackage | undefined> {
    let list = await this.discover();
    let resultList = list.filter(p => p.name === name && p.package === packageString)
    return resultList[0];
  }

  discoverFiles(fileTypes: string[]): string[] {

    if (!this.path) throw new Error("Missing path")
    let dir = this.localBaseDir;

    let filesToReturn: string[] = [];
    function walkDir(currentPath: string) {
      let files = fs.readdirSync(currentPath);
      for (let i in files) {
        let curFile = path.join(currentPath, files[i]);
        if (fs.statSync(curFile).isFile()) {
          filesToReturn.push(curFile.replace(dir, ''));
        } else if (fs.statSync(curFile).isDirectory()) {
          walkDir(curFile);
        }
      }
    };
    walkDir(dir);
    return filesToReturn;

  }
}
