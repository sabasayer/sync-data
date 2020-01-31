import { SyncMaster } from "./sync-master";
import { Syncable } from "../syncable/syncable";
import { EnumEffect } from "./effect.enum";

describe("Sync Master", () => {
    class Test1 extends Syncable<number> {
        items: number[] = [1, 2];

        constructor() {
            super("test");
        }

        async get() {
            this.items = [1, 2];
        }

        add(item: number) {
            this.items.push(item);
        }

        remove(item: number) {
            this.items.splice(this.items.indexOf(item), 1);
        }

        syncCondition(item: number) {
            return item > 150;
        }
    }

    class Test2 extends Syncable<number> {
        items: number[] = [1, 2, 3, 5];

        constructor() {
            super("test2");
        }

        async get() {
            this.items = [1, 2, 3, 5, 6, 7];
        }

        add(item: number) {
            this.items.push(item);
        }

        syncCondition(item: number) {
            return item < 150;
        }
    }

    test("should add new items to test1", () => {
        let instance1 = new Test1();
        let instance2 = new Test1();

        SyncMaster.effect("test", { effect: EnumEffect.Added, data: 250 });

        expect(instance1.items).toEqual([1, 2, 250]);
        expect(instance2.items).toEqual([1, 2, 250]);
    });

    test("syncConditions should work",()=>{
        let instance1 = new Test1();
        let instance2 = new Test2();

        SyncMaster.effect("test", { effect: EnumEffect.Added, data: 149 });
        SyncMaster.effect("test2", { effect: EnumEffect.Added, data: 151 });

        expect(instance1.items).toEqual([1, 2]);
        expect(instance2.items).toEqual([1, 2, 3, 5]);
    });

    test("remove should work",()=>{
        let instance1 = new Test1();

        SyncMaster.effect("test",{effect:EnumEffect.Removed,data:1});

        expect(instance1.items).toEqual([2]);
    });

    test("shide effects should work",()=>{
        let instance1 = new Test1();
        let instance2 = new Test2();

        SyncMaster.effect("test",{effect:EnumEffect.Added,data:122,sideEffectedKeys:["test2"]});

        expect(instance2.items).toEqual([1, 2, 3, 5, 6, 7])
    })

    test("unregister should work",()=>{
        let instance1 = new Test1();

        SyncMaster.unregister("test",instance1);
        SyncMaster.effect("test", { effect: EnumEffect.Added, data: 250 });
        expect(instance1.items).toEqual([1, 2]);

    })
});
