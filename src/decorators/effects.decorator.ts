import {
    SyncMasterEffectOptions,
    SyncMaster
} from "../sync-master/sync-master";

import cloneDeep from 'lodash/cloneDeep';

export function effectsSync<T>(
    key: string,
    options: SyncMasterEffectOptions<T>
): MethodDecorator {
    return function(
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            let res = originalMethod.apply(this, args);
            if (res) {
                let clonedOptions = cloneDeep(options);
                
                clonedOptions.data = clonedOptions.data ?? res;
                SyncMaster.effect(key, clonedOptions);
            }

            return res;
        };

        return descriptor;
    };
}

export function effects<T>(
    key: string,
    options: SyncMasterEffectOptions<T>
): MethodDecorator {
    return function(
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function(...args: any[]) {
            let res = await originalMethod.apply(this, args);
            if (res) {
                let clonedOptions = cloneDeep(options);

                clonedOptions.data = clonedOptions.data ?? res;
                SyncMaster.effect(key, clonedOptions);
            }

            return res;
        };

        return descriptor;
    };
}
