export interface Position {
  x: number;
  y: number;
}

export interface TetrisBlock {
  shape: boolean[][];
  position: Position;
  color: string;
}

export interface Score {
  name: string;
  points: number;
  date: string;
}

// Map each shape to a specific color for consistency
export const TETROMINO_COLORS = {
  I: '#00ffff', // Cyan
  L: '#ff7f00', // Orange
  J: '#0000ff', // Blue
  O: '#ffff00', // Yellow
  Z: '#ff0000', // Red
  S: '#00ff00', // Green
  T: '#ff00ff'  // Magenta
} as const;

export const SHAPES = [
  { // I
    shape: [[1, 1, 1, 1]],
    type: 'I'
  },
  { // L
    shape: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    type: 'L'
  },
  { // J
    shape: [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    type: 'J'
  },
  { // O
    shape: [
      [1, 1],
      [1, 1]
    ],
    type: 'O'
  },
  { // Z
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    type: 'Z'
  },
  { // S
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    type: 'S'
  },
  { // T
    shape: [
      [1, 1, 1],
      [0, 1, 0]
    ],
    type: 'T'
  }
] as const;