export const range = (n: number): number[] => {
    const array = [];
    for (let i = 0; i < n; i++) {
        array.push(i);
    }
    return array;
};

// Fisher–Yates Shuffle
export const shuffle = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
