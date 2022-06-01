// Hier sind dann noch alle echten exports von once.ts


import DefaultIOR from "./2_systems/Things/DefaultIOR.class.mjs";
export { DefaultIOR };


(await import("./1_infrastructure/OnceKernel.class.mjs")).default.start();
