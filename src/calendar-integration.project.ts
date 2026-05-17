import {makeProject} from "@motion-canvas/core";

import setupChecklist from "./scenes/calendar-integration/01-setup-checklist?scene";
import dataFlow from "./scenes/calendar-integration/02-data-flow?scene";
import optimizations from "./scenes/calendar-integration/03-optimizations?scene";

export default makeProject({
  scenes: [setupChecklist, dataFlow, optimizations],
});
