### Sync Data between classes , functions , objects

## Usage

Extend any class from Syncable<T>

`class Test1 extends Syncable<number> {
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
`

Calling parents super at constructor is important, that registers component to SyncMaster with that key


ISyncable Has 5 methods 

These methods will be triggered 

`interface ISyncable<T> {
    get: () => Promise<any>;
    add?: (item:T) => any;
    update?: (item:T) => any;
    remove?: (item:T) => any;
    syncCondition?: (item:T) => boolean
}`

SyncMaster static class makes all the work.

To trigger registered classes methods use :

`SyncMaster.effect("test", { effect: EnumEffect.Added, data: 120 });`

first argument is the key that Syncable function called at constructor.
This will trigger add function if there is any. 
If not get function will be triggered. 

Before add or get function syncCondition function is called .