export type CellType = {
    state: CellState;
    value: 'mine' | number;
};

export enum CellState {
    HIDDEN,
    REVEALED,
    FLAGGED,
    EXPLODED,
}

export type Coordinates = [number, number];
