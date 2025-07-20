export function sumArray<T>(array: T[], callback: (item: T) => number): number {
    return array.reduce((acc, item) => acc + callback(item), 0);
}