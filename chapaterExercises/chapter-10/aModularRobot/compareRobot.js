import { VillageState } from "./villageState.js";
import { countSteps } from "./countSteps.js";

export function compareRobots(robot_1, memory_1, robot_2, memory_2) {
  let total_1 = 0,
    total_2 = 0;
  for (let i = 0; i < 100; i++) {
    let state = VillageState.random();
    total_1 += countSteps(state, robot_1, memory_1);
    total_2 += countSteps(state, robot_2, memory_2);
  }
  console.log(`Robot 1 needed ${total_1 / 100} steps per task`);
  console.log(`Robot 2 needed ${total_2 / 100} steps per task`);
}
