import "express"
declare global {
    export interface Request{
      userId?:string
    }
}

export {};