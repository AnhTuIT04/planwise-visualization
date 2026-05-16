import {makeProject} from "@motion-canvas/core";

import sequential from "./scenes/sequential?scene";
import fractional from "./scenes/fractional?scene";

export default makeProject({
  scenes: [sequential, fractional],
});