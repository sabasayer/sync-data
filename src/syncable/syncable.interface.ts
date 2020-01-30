export interface ISyncable<T> {
    get: () => Promise<any>;
    add?: (item:T) => any;
    update?: (item:T) => any;
    remove?: (item:T) => any;
    syncCondition?: (item:T) => boolean
}
