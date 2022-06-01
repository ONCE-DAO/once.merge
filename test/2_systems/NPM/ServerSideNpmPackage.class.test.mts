import OnceNodeServer from "../../../src/2_systems/Once/OnceNodeServer.class.mjs";
import { ServerSideNpmPackage } from "../../../src/2_systems/ServerSideNpmPackage.class.mjs";

beforeEach(async () => {
    if (ONCE_STARTED === false) await OnceNodeServer.start();
});

describe("NPM Package", () => {

    test("Discover", async () => {

        let list = await ServerSideNpmPackage.discover();

        expect(list.length).toBeGreaterThan(0);
    });

    test("getNpmPackage", async () => {

        let packageObject = await ServerSideNpmPackage.getNpmPackage('tla.EAM.Once', 'once.merge');

        expect(packageObject).toBeTruthy();
    });

});
