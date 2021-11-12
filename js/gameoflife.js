function seed() {
  let args = Array.prototype.slice.call(arguments);
  return args;
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  // const [x, y] = cell;
  return this.some(function (cell1) {
    return same(cell, cell1);
  });
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)) {
    return "\u25A3";
  } else {
    return "\u25A2";
  }
};

const corners = (state = []) => {
  if (state.length === 0) {
    return { topRight: [0, 0], bottomLeft: [0, 0] };
  }
  const [firstCellX, firstCellY] = state[0];

  let rightMost = firstCellX;
  let leftMost = firstCellX;
  let topMost = firstCellY;
  let bottomMost = firstCellY;

  for (const [x, y] of state) {
    if (x > rightMost) {
      rightMost = x;
    } else if (x < leftMost) {
      leftMost = x;
    }

    if (y > topMost) {
      topMost = y;
    } else if (y < bottomMost) {
      bottomMost = y;
    }
  }
  const topRight = [rightMost, topMost];
  const bottomLeft = [leftMost, bottomMost];

  return { topRight, bottomLeft };
};

const printCells = (state) => {
  const {
    bottomLeft: [x1, y1],
    topRight: [x2, y2],
  } = corners(state);

  const a = [];
  for (y = y1; y <= y2; y++) {
    const b = [];
    for (x = x1; x <= x2; x++) {
      b.push(printCell([x, y], state));
    }

    a.push(b.join(" "));
  }

  return a.join("\n");
};

const getNeighborsOf = ([x, y]) => {
  const coords = [];
  for (let i = x - 1; i < x + 2; i++) {
    for (let j = y - 1; j < y + 2; j++) {
      if (x === i && j === y) {
        continue;
      }
      coords.push([i, j]);
    }
  }

  return coords;
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((i) => contains.bind(state)(i));
};

const willBeAlive = (cell, state) => {
  const livegNeighbors = getLivingNeighbors(cell, state);

  return (
    livegNeighbors.length === 3 ||
    (contains.call(state, cell) && livegNeighbors.length === 2)
  );
};

const calculateNext = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let nxt = [];
  for (let y = topRight[1] + 1; y >= bottomLeft[1] - 1; y--) {
    for (let x = bottomLeft[0] - 1; x <= topRight[0] + 1; x++) {
      nxt = nxt.concat(willBeAlive([x, y], state) ? [[x, y]] : []);
    }
  }
  return nxt;
};

const iterate = (state, iterations) => {
  const states = [state];
  for (let i = 0; i < iterations; i++) {
    states.push(calculateNext(states[states.length - 1]));
  }
  return states;
};

const main = (pattern, iterations) => {
  const results = iterate(startPatterns[pattern], iterations);
  results.forEach((r) => console.log(printCells(r)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4],
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3],
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
