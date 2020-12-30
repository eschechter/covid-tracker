const states = require("../data/states_arr.json");

const stateData = [];

for (const key in states) {
  stateData.push({
    contours: states[key].coords,
    name: key,
    color: [255, 255, 255],
    pop: states[key].pop,
  });
}

export { stateData };
