import {
    SyncMasterEffectOptions,
    SyncMaster
} from "../sync-master/sync-master";

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
                options.data = options.data ?? res;
                SyncMaster.effect(key, options);
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
                options.data = options.data ?? res;
                SyncMaster.effect(key, options);
            }

            return res;
        };

        return descriptor;
    };
}
