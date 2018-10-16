<template>
<div class="game">
  <div class="info">
    <span>Turn: {{turn}}</span>
      <div class="totals">
        <h5>Win Tracker</h5>
        <span>O: {{winTotals.o}}</span>
        <span>X: {{winTotals.x}}</span>
        <span>Draw: {{winTotals.d}}</span>
        <span>Total: {{winTotals.o + winTotals.x}}</span>
      </div>
    <button class="reset" @click="reset">Reset</button>
  </div>
  <div class="board" :class="{'game-over': gameOver}">
    <template v-for="(square, i) in grid">
      <div @click="onClick(i)" :key=i class="square" :class="{'game-over__square': gameOver}">{{'b' === square ? '' : square}}
        <div v-if="!gameOver && 'b' === square" class="chance">{{ratios[i]}}%</div>
      </div>
    </template>
  </div>
</div>
</template>

<script>
function l(msg) {
  console.log(
    `%c ${msg}`,
    "background: #222; color: #bada55; font-size: 1.4rem;"
  );
}
import * as ML from "./ML";
export default {
  data() {
    return {
      turnCount: 0,
      gameOver: false,
      turn: "x",
      grid: [],
      isTraining: true,
      ratios: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      winTotals: {
        o: 0,
        x: 0,
        d: 0
      }
    };
  },

  methods: {
    onClick(x) {
      if (!this.gameOver && "b" === this.grid[x]) {
        this.grid.splice(x, 1, this.turn);
        this.hasWon();
        this.turn = "x" === this.turn ? "o" : "x";
        this.turnCount++;

        if (this.turnCount > 8) {
          this.gameOver = true;
          this.winTotals.d++;
        }
        this.checkProbability();
      }
    },
    checkProbability() {
      if (!this.isTraining) {
        this.ratios = ML.checkProbability(this.grid, this.turn);
      }
    },
    reset() {
      this.grid = Array.apply(null, Array(9)).map(
        String.prototype.valueOf,
        "b"
      );
      this.gameOver = false;
      this.turn = "x";
      this.turnCount = 0;
      this.checkProbability();
    },
    hasWon() {
      const test = /^xxx|ooo$/;
      const [a0, a1, a2, b0, b1, b2, c0, c1, c2] = this.grid;
      switch (true) {
        case test.test(a0 + a1 + a2):
        case test.test(b0 + b1 + b2):
        case test.test(c0 + c1 + c2):
        case test.test(a0 + b0 + c0):
        case test.test(a1 + b1 + c1):
        case test.test(a2 + b2 + c2):
        case test.test(a0 + b1 + c2):
        case test.test(a2 + b1 + c0):
          this.gameOver = true;
          this.winTotals[this.turn]++;
          break;
      }
    }
  },
  mounted() {
    l("Started training");
    ML.startTraining().then(() => {
      l("Finished Training!");
      this.isTraining = false;
      this.checkProbability();
    });
    this.reset();
  }
};
</script>

<style lang="scss">
$size: 10rem;
* {
  box-sizing: border-box;
  font-family: sans-serif;
}

body {
  color: white;
  background: #363b3b;
  display: flex;
  justify-content: center;
}

.totals {
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info {
  user-select: none;
  font-size: 3rem;
  height: 100%;
  width: 100%;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.reset {
  width: 100%;
  background-color: #555555;
  border: none;
  border-radius: 0.5rem;
  height: 3rem;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.game {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 55rem;
  // max-height: 30rem;
}

.game-over {
  cursor: not-allowed !important;

  &__square {
    background-color: black;
  }
}

.board {
  cursor: pointer;
  display: grid;
  grid-template-columns: repeat(3, $size);
}

.square {
  position: relative;
  width: $size;
  height: $size;
  border: 0.1rem solid white;
  font-size: $size;
  display: flex;
  justify-content: center;
  align-content: center;
  user-select: none;
  text-transform: capitalize;
}

.chance {
  position: absolute;
  bottom: 0;
  font-size: 1rem;
}
</style>
