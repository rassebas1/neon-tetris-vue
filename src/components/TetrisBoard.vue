<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Position, TetrisBlock, TETROMINO_COLORS, SHAPES } from '../types/tetris';

const props = defineProps<{
  gameOver: boolean;
  paused: boolean;
}>();

const emit = defineEmits<{
  'update-score': [score: number];
  'game-over': [];
  'next-block': [block: TetrisBlock];
}>();

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const TICK_SPEED = 1000;

const board = ref<string[][]>(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('')));
const currentBlock = ref<TetrisBlock | null>(null);
const nextBlock = ref<TetrisBlock | null>(null);
const score = ref(0);
const gameInterval = ref<number | null>(null);

const createNewBlock = () => {
  const shapeIndex = Math.floor(Math.random() * SHAPES.length);
  const tetrominoData = SHAPES[shapeIndex];
  const shape = tetrominoData.shape.map(row => row.map(cell => Boolean(cell)));
  return {
    shape,
    position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2), y: 0 },
    color: TETROMINO_COLORS[tetrominoData.type]
  };
};

const checkCollision = (block: TetrisBlock, position: Position): boolean => {
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;
        if (
          newX < 0 || 
          newX >= BOARD_WIDTH || 
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board.value[newY][newX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

const mergeBlock = () => {
  if (!currentBlock.value) return;
  
  const { shape, position, color } = currentBlock.value;
  shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell && position.y + y >= 0) {
        board.value[position.y + y][position.x + x] = color;
      }
    });
  });
};

const clearLines = () => {
  let linesCleared = 0;
  
  board.value = board.value.filter(row => {
    if (row.every(cell => cell !== '')) {
      linesCleared++;
      return false;
    }
    return true;
  });

  while (linesCleared > 0) {
    board.value.unshift(Array(BOARD_WIDTH).fill(''));
    linesCleared--;
  }

  if (linesCleared > 0) {
    score.value += linesCleared * 100;
    emit('update-score', score.value);
    document.querySelector('.tetris-board')?.classList.add('line-clear');
    setTimeout(() => {
      document.querySelector('.tetris-board')?.classList.remove('line-clear');
    }, 200);
  }
};

const moveBlock = (dx: number, dy: number) => {
  if (!currentBlock.value || props.gameOver || props.paused) return;

  const newPosition = {
    x: currentBlock.value.position.x + dx,
    y: currentBlock.value.position.y + dy
  };

  if (!checkCollision(currentBlock.value, newPosition)) {
    currentBlock.value.position = newPosition;
  } else if (dy > 0) {
    mergeBlock();
    clearLines();
    currentBlock.value = nextBlock.value;
    nextBlock.value = createNewBlock();
    emit('next-block', nextBlock.value);
    
    if (checkCollision(currentBlock.value!, currentBlock.value!.position)) {
      emit('game-over');
    }
  }
};

const rotateBlock = () => {
  if (!currentBlock.value || props.gameOver || props.paused) return;

  const newShape = currentBlock.value.shape[0].map((_, i) =>
    currentBlock.value!.shape.map(row => row[i]).reverse()
  );

  const rotatedBlock = {
    ...currentBlock.value,
    shape: newShape
  };

  if (!checkCollision(rotatedBlock, rotatedBlock.position)) {
    currentBlock.value.shape = newShape;
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (props.gameOver || props.paused) return;

  switch (e.key) {
    case 'ArrowLeft':
      moveBlock(-1, 0);
      break;
    case 'ArrowRight':
      moveBlock(1, 0);
      break;
    case 'ArrowDown':
      moveBlock(0, 1);
      break;
    case 'ArrowUp':
      rotateBlock();
      break;
    case ' ':
      while (!checkCollision(currentBlock.value!, { 
        x: currentBlock.value!.position.x, 
        y: currentBlock.value!.position.y + 1 
      })) {
        moveBlock(0, 1);
      }
      break;
  }
};

const startGame = () => {
  board.value = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));
  currentBlock.value = createNewBlock();
  nextBlock.value = createNewBlock();
  emit('next-block', nextBlock.value);
  score.value = 0;
  
  if (gameInterval.value) {
    clearInterval(gameInterval.value);
  }
  
  gameInterval.value = setInterval(() => {
    if (!props.paused && !props.gameOver) {
      moveBlock(0, 1);
    }
  }, TICK_SPEED);
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  startGame();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (gameInterval.value) {
    clearInterval(gameInterval.value);
  }
});
</script>

<template>
  <div class="tetris-board" :class="{ 'game-over': gameOver, 'paused': paused }">
    <div v-for="(row, y) in board" :key="y" class="row">
      <div 
        v-for="(cell, x) in row" 
        :key="x" 
        class="cell"
        :class="{ filled: cell }"
        :style="{ backgroundColor: cell, boxShadow: cell ? `0 0 10px ${cell}` : 'none' }"
      />
    </div>
    <template v-if="currentBlock">
      <div 
        v-for="(row, y) in currentBlock.shape" 
        :key="y"
        class="block-row"
        :style="{ 
          top: `${(currentBlock.position.y + y) * 30}px`,
          left: `${currentBlock.position.x * 30}px`
        }"
      >
        <div 
          v-for="(cell, x) in row" 
          :key="x"
          class="cell"
          :class="{ filled: cell }"
          :style="{ 
            backgroundColor: cell ? currentBlock.color : 'transparent',
            boxShadow: cell ? `0 0 10px ${currentBlock.color}` : 'none'
          }"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.tetris-board {
  display: inline-block;
  border: 2px solid #fff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  background-color: rgba(0, 0, 0, 0.8);
  position: relative;
  padding: 2px;
}

.row {
  display: flex;
}

.cell {
  width: 30px;
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.1s ease;
}

.cell.filled {
  border-color: rgba(255, 255, 255, 0.3);
}

.block-row {
  display: flex;
  position: absolute;
}

.game-over .cell {
  opacity: 0.5;
}

.paused .cell {
  opacity: 0.7;
}

@keyframes lineGlow {
  0% { filter: brightness(1); }
  50% { filter: brightness(2); }
  100% { filter: brightness(1); }
}

.line-clear {
  animation: lineGlow 0.2s ease-in-out;
}
</style>