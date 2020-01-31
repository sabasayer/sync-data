import { SyncMaster } from "./sync-master";
import { Syncable } from "../syncable/syncable";
import { EnumEffect } from "./effect.enum";
import {effectsSync,effects} from "../decorators/effects.decorator"

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

    class EffectTestClass {
       @effects("test",{effect:EnumEffect.Added})
       static async runAddedEffect(value:number){
            return new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve(value);
                },1000)
            })
        }

        @effectsSync("test",{effect:EnumEffect.Added})
        static runAddedEffectSync(value:number){
            return value
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

    test("shide effects should work when there isnt any registered main syncable",()=>{
        SyncMaster.clear();

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


    test("decorator should work for sync and async methods",async ()=>{
        let instance1 = new Test1();
        let res1 = await EffectTestClass.runAddedEffect(351);
        let res2 = EffectTestClass.runAddedEffectSync(352);

        expect(instance1.items).toEqual([1,2,351,352])
        expect(res1).toEqual(351)
        expect(res2).toEqual(352)
    })
});
