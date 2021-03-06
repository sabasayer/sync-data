import { ISyncable } from "../syncable/syncable.interface";
import { EnumEffect } from "./effect.enum";

export interface SyncMasterEffectOptions<T> {
  effect?: EnumEffect;
  data?: T;
  sideEffectedKeys?: string[];
  condition?: (data: T) => boolean;
}

export abstract class SyncMaster {
  private static store: { [key: string]: ISyncable<any>[] } = {};

  static register<T>(key: string, owner: ISyncable<T>) {
    if (!this.store[key]) {
      this.store[key] = [];
    }

    this.store[key].push(owner);
  }

  static unregister<T>(key: string, owner: ISyncable<T>) {
    if (!this.store[key]) return;

    let index = this.store[key].indexOf(owner);
    if (index > -1) this.store[key].splice(index, 1);
  }

  static checkCondition<T>(options?: SyncMasterEffectOptions<T>) {
    return (
      !options?.condition || !options?.data || options.condition(options.data)
    );
  }

  static effect<T>(key: string, options?: SyncMasterEffectOptions<T>) {
    if (!SyncMaster.checkCondition(options)) {
      return;
    }

    let syncables = this.store[key];

    if (syncables?.length) {
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

    options?.sideEffectedKeys?.forEach((sideEffectedKey) => {
      SyncMaster.effect(sideEffectedKey, { effect: options.effect });
    });
  }

  static clear() {
    this.store = {};
  }

  private static checkSyncable<T>(syncable: ISyncable<T>, data?: T) {
    return (
      !syncable.syncCondition ||
      !data ||
      syncable.syncCondition?.call(syncable, data)
    );
  }

  private static onAdded<T>(syncable: ISyncable<T>, data?: T) {
    if (!SyncMaster.checkSyncable(syncable, data)) return;

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
    if (!SyncMaster.checkSyncable(syncable, data)) return;
    syncable.get.call(syncable);
  }
}
