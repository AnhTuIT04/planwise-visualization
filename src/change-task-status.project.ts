import {makeProject} from "@motion-canvas/core";

import ifElseBranching from "./scenes/change-task-status/01-if-else-branching?scene";
import solutions from "./scenes/change-task-status/02-solutions?scene";
import scaling from "./scenes/change-task-status/03-scaling?scene";

export default makeProject({
  scenes: [ifElseBranching, solutions, scaling],
});
