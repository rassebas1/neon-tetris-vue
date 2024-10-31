<script setup lang="ts">
import { TetrisBlock } from '../types/tetris';

defineProps<{
  block: TetrisBlock | null;
}>();
</script>

<template>
  <div class="next-block">
    <h3>Next Block</h3>
    <div class="preview-window">
      <template v-if="block">
        <div 
          v-for="(row, y) in block.shape" 
          :key="y"
          class="preview-row"
        >
          <div 
            v-for="(cell, x) in row" 
            :key="x"
            class="preview-cell"
            :class="{ filled: cell }"
            :style="{ 
              backgroundColor: cell ? block.color : 'transparent',
              boxShadow: cell ? `0 0 10px ${block.color}` : 'none'
            }"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.next-block {
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #fff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  color: #fff;
  margin-bottom: 20px;
}

h3 {
  color: #0ff;
  text-shadow: 0 0 10px #0ff;
  margin-bottom: 15px;
  text-align: center;
}

.preview-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 10px;
}

.preview-row {
  display: flex;
}

.preview-cell {
  width: 25px;
  height: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.1s ease;
}

.preview-cell.filled {
  border-color: rgba(255, 255, 255, 0.3);
}
</style>