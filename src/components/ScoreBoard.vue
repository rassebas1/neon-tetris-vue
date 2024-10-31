<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Score } from '../types/tetris';

const props = defineProps<{
  currentScore: number;
}>();

const playerName = ref(localStorage.getItem('playerName') || '');
const highScores = ref<Score[]>([]);

const savePlayerName = () => {
  localStorage.setItem('playerName', playerName.value);
};

const loadHighScores = () => {
  const scores = localStorage.getItem('highScores');
  if (scores) {
    highScores.value = JSON.parse(scores);
  }
};

const saveHighScore = () => {
  if (!playerName.value) return;
  
  const newScore: Score = {
    name: playerName.value,
    points: props.currentScore,
    date: new Date().toLocaleDateString()
  };

  highScores.value.push(newScore);
  highScores.value.sort((a, b) => b.points - a.points);
  highScores.value = highScores.value.slice(0, 10);
  
  localStorage.setItem('highScores', JSON.stringify(highScores.value));
};

onMounted(() => {
  loadHighScores();
});
</script>

<template>
  <div class="score-board">
    <div class="current-score">
      <h2>Score: {{ currentScore }}</h2>
      <div class="player-name">
        <input 
          v-model="playerName"
          @change="savePlayerName"
          placeholder="Enter your name"
          maxlength="20"
        />
      </div>
    </div>
    
    <div class="high-scores">
      <h3>High Scores</h3>
      <div class="scores-list">
        <div v-for="(score, index) in highScores" :key="index" class="score-item">
          <span class="rank">{{ index + 1 }}.</span>
          <span class="name">{{ score.name }}</span>
          <span class="points">{{ score.points }}</span>
          <span class="date">{{ score.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-board {
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #fff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  color: #fff;
  margin-left: 20px;
  min-width: 300px;
}

.current-score {
  margin-bottom: 20px;
  text-align: center;
}

h2, h3 {
  color: #0ff;
  text-shadow: 0 0 10px #0ff;
  margin-bottom: 15px;
}

.player-name input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #0ff;
  color: #fff;
  padding: 8px;
  width: 100%;
  margin-top: 10px;
  text-align: center;
  outline: none;
}

.player-name input:focus {
  box-shadow: 0 0 10px #0ff;
}

.scores-list {
  max-height: 300px;
  overflow-y: auto;
}

.score-item {
  display: grid;
  grid-template-columns: 30px 1fr 80px 80px;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.score-item:hover {
  background: rgba(0, 255, 255, 0.1);
}

.rank {
  color: #0ff;
}

.points {
  color: #ff0;
  text-shadow: 0 0 5px #ff0;
}

.date {
  font-size: 0.8em;
  color: #888;
}
</style>