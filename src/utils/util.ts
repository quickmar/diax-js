export function throwNowContext(description: string): never {
    throw new Error(`For ${description} Context is not defined`);
}