import { randomPick } from "./randomPick.js";

export function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}
