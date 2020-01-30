import { ISyncable } from "../syncable/syncable.interface";
import { EnumEffect } from "./effect.enum";

export abstract class SyncMaster {
    private static store: { [key: string]: ISyncable<any>[] } = {};

    static register<T>(key: string, owner: ISyncable<T>) {
        if (!this.store[key]) {
            this.store[key] = [];
        }

        this.store[key].push(owner);
    }

    static effect<T>(key: string,options?:{effect?: EnumEffect,data?: T}) {
        let syncables = this.store[key];

        if (!syncables?.length) return;

        switch (options?.effect) {
            case EnumEffect.Added:
                syncables.forEach((syncable: ISyncable<T>) => {
                    SyncMaster.onAdded(syncable, options.data);
                });
                break;
            case EnumEffect.Updated:
                syncables.forEach((syncable: ISyncable<T>) => {
                    SyncMaster.onUpdated(syncable, options.data);
                });
                break;
            case EnumEffect.Removed:
                syncables.forEach((syncable: ISyncable<T>) => {
                    SyncMaster.onRemoved(syncable, options.data);
                });
                break;
            default:
                syncables.forEach((syncable: ISyncable<T>) => {
                    SyncMaster.onSync(syncable, options?.data);
                });
                break;
        }
    }

    private static checkSyncable<T>(syncable: ISyncable<T>, data?: T){
       return !syncable.syncCondition || !data || syncable.syncCondition?.call(syncable, data)
    }

    private static onAdded<T>(syncable: ISyncable<T>, data?: T) {
        if (!SyncMaster.checkSyncable(syncable,data)) return;

        if (syncable.add && data) syncable.add?.call(syncable, data);
        else syncable.get.call(syncable);
    }

    private static onUpdated<T>(syncable: ISyncable<T>, data?: T) {
        if (syncable.update && data) syncable.update?.call(syncable, data);
        else syncable.get.call(syncable);
    }

    private static onRemoved<T>(syncable: ISyncable<T>, data?: T) {
        if (syncable.remove && data) syncable.remove?.call(syncable, data);
        else syncable.get.call(syncable);
    }

    private static onSync<T>(syncable: ISyncable<T>, data?: T) {
        if (!SyncMaster.checkSyncable(syncable,data)) return;
        syncable.get.call(syncable);
    }
}
