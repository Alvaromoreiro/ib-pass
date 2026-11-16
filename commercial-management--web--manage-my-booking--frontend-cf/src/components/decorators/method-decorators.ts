
export function PromiseTimeout (timeMax: number, error = 'TIMEOUT_ERROR') {
    return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
        const childFunction = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const timePromise = new Promise((resolve, reject) => {
                setTimeout(resolve, timeMax, error);
            });
            return new Promise((resolve, reject) => {
                Promise.race([childFunction.apply(this, args), timePromise]).then(
                    (data) => {
                        data !== error ? resolve(data) : reject(data);
                    },
                    (PromiseError) => {
                        reject(PromiseError);
                    }
                );
            });
        };
        return descriptor;
    };
}
