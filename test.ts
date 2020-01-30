import { ISyncable } from "./src/syncable/syncable.interface";
import { SyncMaster } from "./src/sync-master/sync-master";
import { EnumEffect } from "./src/sync-master/effect.enum";
import { Syncable } from "./src/syncable/syncable";


class Test1 extends Syncable<number> {
    items: number[] = [1, 2, 3];

    constructor() {
        super("test")
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

class Test2 extends Syncable<number> implements ISyncable<number> {
    items: number[] = [1, 2, 3,5,6,7];

    constructor(){
        super("test")
    }

    async get() {
        this.items = [1, 2, 3,5,6,7];
    }

    add(item:number){
        this.items.push(item)
    }

    syncCondition(item:number){
        return item < 150;
    }
    
}

{
    let test1 = new Test1();
    let test2 = new Test2();

    SyncMaster.effect("test", { effect: EnumEffect.Added, data: 120 });
    SyncMaster.effect("test", { effect: EnumEffect.Added, data: 151 });

    let test = document.getElementById("test");
    if (test) {
        test.innerHTML = JSON.stringify(test1.items) + JSON.stringify(test2.items);
    }
}
