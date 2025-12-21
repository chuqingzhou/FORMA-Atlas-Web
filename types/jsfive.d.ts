declare module 'jsfive' {
  export class File {
    constructor(buffer: ArrayBuffer)
    get(path: string): Dataset | null
  }

  export class Dataset {
    value: Float32Array | Uint8Array | any
    shape: number[]
  }
}

