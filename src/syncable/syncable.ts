import { SyncMaster } from "../sync-master/sync-master";
import { ISyncable } from "./syncable.interface";

export abstract class Syncable<T> implements ISyncable<T>{
    constructor(syncableKey:string){
        SyncMaster.register(syncableKey, this);
    }

    abstract async get():Promise<any>;

    add?(item:T):void;

    update?(item:T):void;

    remove?(item:T):void;

    syncCondition?(item:T):boolean;
}