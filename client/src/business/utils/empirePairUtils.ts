export function getNationPairs(nations: string[]): string[][] {
    const pairs: string[][] = [];
    for (let i = 0; i < nations.length; i++) {
        for (let j = i + 1; j < nations.length; j++) {
            pairs.push([nations[i], nations[j]]);
        }
    }
    return pairs;
}
