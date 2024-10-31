<script setup lang="ts">
import { ref } from 'vue';
import TetrisBoard from './components/TetrisBoard.vue';
import ScoreBoard from './components/ScoreBoard.vue';
import NextBlock from './components/NextBlock.vue';
import type { TetrisBlock } from './types/tetris';

const score = ref(0);
const gameOver = ref(false);
const paused = ref(false);
const nextBlock = ref<TetrisBlock | null>(null);

const updateScore = (newScore: number) => {
  score.value = newScore;
};

const handleGameOver = () => {
  gameOver.value = true;
};

const startNewGame = () => {
  gameOver.value = false;
  score.value = 0;
};

const togglePause = () => {
  paused.value = !paused.value;
};

const updateNextBlock = (block: TetrisBlock) => {
  nextBlock.value = block;
};
</script>

<template>
  <div class="game-container">
    <div class="game-header">
      <h1>Neon Tetris</h1>
      <div class="controls">
        <button @click="startNewGame">New Game</button>
        <button @click="togglePause">{{ paused ? 'Resume' : 'Pause' }}</button>
      </div>
    </div>
    
    <div class="game-content">
      <div class="game-info">
        <NextBlock :block="nextBlock" />
      </div>
      <TetrisBoard 
        :game-over="gameOver"
        :paused="paused"
        @update-score="updateScore"
        @game-over="handleGameOver"
        @next-block="updateNextBlock"
      />
      <ScoreBoard :current-score="score" />
    </div>

    <div class="game-instructions">
      <p>Controls: ← → ↓ to move, ↑ to rotate, SPACE to drop</p>
    </div>
  </div>
</template>

<style>
:root {
  background-color: #1a1a2e;
}

body {
  margin: 0;
  font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
  color: #fff;
  overflow: hidden;
}

.game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.game-header {
  margin-bottom: 30px;
}

h1 {
  font-size: 3em;
  color: #0ff;
  text-shadow: 0 0 20px #0ff;
  margin-bottom: 20px;
}

.controls {
  margin-bottom: 20px;
}

button {
  background: transparent;
  border: 2px solid #0ff;
  color: #0ff;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  font-family: inherit;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

button:hover {
  background: #0ff;
  color: #000;
  box-shadow: 0 0 20px #0ff;
}

.game-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.game-instructions {
  margin-top: 20px;
  color: #888;
  font-size: 0.8em;
}

@font-face {
  font-family: 'Press Start 2P';
  src: url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
}
</style>