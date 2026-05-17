import {makeProject} from "@motion-canvas/core";

import sequential from "./scenes/change-task-position/sequential?scene";
import fractional from "./scenes/change-task-position/fractional?scene";
import lexicographical from "./scenes/change-task-position/lexicographical?scene";

export default makeProject({
  scenes: [sequential, fractional, lexicographical],
});
