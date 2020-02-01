Sync-Data
======

Sync Data between classes , functions , objects

## Install

```
npm install @sabasayer/sync-data

# or

yarn add @sabasayer/sync-data
```

## Usage

Extend any class from Syncable<T>

```
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
```

Calling parents super at constructor is important, that registers component to SyncMaster with that key


ISyncable Has 5 methods 

These methods will be triggered 

```
interface ISyncable<T> {
    get: () => Promise<any>;
    add?: (item:T) => any;
    update?: (item:T) => any;
    remove?: (item:T) => any;
    syncCondition?: (item:T) => boolean
}
```

SyncMaster static class makes all the work.

To trigger registered classes methods use :

```
SyncMaster.effect("test", { effect: EnumEffect.Added, data: 120,sideEffectedKeys:["test2","test3"] });
```

or use decorators

```
@effectsSync("test", { effect: EnumEffect.Added })

// For async functions 
@effects("test", { effect: EnumEffect.Added })
```

first argument is the key that Syncable function called at constructor.
This will trigger add function if there is any. 
If not get function will be triggered. 

#Options are optional

| Option          | Type           | Explanation  |
| --------------- |:-------------:| -----:|
| effect          | number (EnumEffect) | effect type |
| data            | any    |   result of your action |
| sideffectedKeys | string[]      |    side effects of your action  |

Before add or get function called , syncCondition function is called as a guard, if exists. 

