// types/global.d.ts
declare global {
  var todoStorage: {
    tasks: any[];
    taskIdCounter: number;
  };
}

export {};