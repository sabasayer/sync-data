import { ISyncable } from "./src/syncable/syncable.interface";
import { SyncMaster } from "./src/sync-master/sync-master";
import { EnumEffect } from "./src/sync-master/effect.enum";
import { Syncable } from "./src/syncable/syncable";
import { effectsSync } from "./src/decorators/effects.decorator";

class Test1 extends Syncable<number> {
    items: number[] = [1, 2, 3];

    constructor() {
        super("test");
    }

    async get() {
        this.items = [1, 2, 3];
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
    @effectsSync("test", { effect: EnumEffect.Added })
    static runAddedEffect(value: number) {
        return value;
    }
}

{
    let test1 = new Test1();
    let test2 = new Test2();

    SyncMaster.effect("test", { effect: EnumEffect.Added, data: 250 });
    EffectTestClass.runAddedEffect(450);

    let test = document.getElementById("test");
    if (test) {
        test.innerHTML =
            JSON.stringify(test1.items) + JSON.stringify(test2.items);
    }
}
