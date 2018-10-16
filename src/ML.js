import { NeuralNetwork } from "brain.js";
// @ts-ignore
import DataSet from "./dataset.json";

const engine = new NeuralNetwork();

function map(data, player) {
  return data.map(index => {
    switch (true) {
      case player === index:
        return 1;
      case index === "b":
        return 0.5;
      default:
        return 0;
    }
  });
}

export function startTraining(iterations = 500) {
  return engine.trainAsync(DataSet, { iterations });
}

export function checkProbability(data, player) {
  return data
    .map((_, i) => {
      const board = data.slice();
      board[i] = player;
      return engine.run(map(board, player));
    })
    .flat()
    .map(i => i.toFixed(3));
}
