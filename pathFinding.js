let board = [
  ['P', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '']
];

let foodBoard = [
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '']
];

let moves = ['left', 'up', 'right', 'down', 'left', 'up'];

let player = 'P';
let food = 'F';
let obstacle = 'O';

let mapGenerated = false;
let mapSize = 10;

let start = false;

let aiStuck = false;
let spot = null;

let timeUntilStuck = 0;

let fps = 60;

function setup() {
  createCanvas(400, 400);
  frameRate(fps);
  w = width / mapSize;
  h = height / mapSize;
}

function draw() {
  background(215);

  if (frameCount % 5 == 0 && start == true) {
    timeUntilStuck++;
    console.log(timeUntilStuck);
  }

  // Map Generator
  if (!mapGenerated) {
    generateMap();
  }

  // Draw The Map
  for (let i = 0; i < mapSize + 1; i++) {
    line(w * i, 0, w * i, height);
    line(0, h * i, width, h * i);
  }

  // Draw The objects on the map
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      textSize(50);
      if (board[i][j] == player) {
        text(player, w * j, h * (i + 1));
        realAiPlace = {
          i,
          j
        };
      }
      if (foodBoard[i][j] == obstacle) {
        text(obstacle, w * j, h * (i + 1));
      } else if (foodBoard[i][j] == food) {
        text(food, w * j, h * (i + 1));
      }
    }
  }

  // Ai Starts
  if (start) {
    bestMove();
  }

  // Check if Ai is stuck
  if (spot != null) {
    if (spot == 0) {
      if (realAiPlace.i - 1 < 0) {
        aiStuck = true;
      } else {
        aiStuck = false;
      }
    } else if (spot == 1) {
      if (realAiPlace.j - 1 < 0) {
        aiStuck = true;
      } else {
        aiStuck = false;
      }
    } else if (spot == 2) {
      if (realAiPlace.i + 1 >= mapSize) {
        aiStuck = true;
      } else {
        aiStuck = false;
      }
    } else if (spot == 3) {
      if (realAiPlace.j + 1 >= mapSize) {
        aiStuck = true;
      } else {
        aiStuck = false;
      }
    }

    if (timeUntilStuck >= 7) {
      aiStuck = true;
    }
  }

  // Check The Game Status
  gameResult = checkWinner();
  if (gameResult != null) {
    console.log(gameResult);
    start = false;
  }
}

function mousePressed() {
  if (gameResult == null) {
    start = true;
    console.log('Ai Started Playing');
  } else {
    start = false;
    console.log('Ai Stopped Playing');
  }
}

function bestMove() {
  let bestScore = -Infinity;
  for (let i = 0; i < 4; i++) {
    // Check where the Player is to see if it's in a corner
    for (let j = 0; j < mapSize; j++) {
      for (let k = 0; k < mapSize; k++) {
        if (board[j][k] == player) {
          place = {
            j,
            k
          };
        }
      }
    }

    // Make move
    move(moves[i], board, player);

    // Get Score
    let score = minimax(board, 0, false, player);

    // Undo Move
    if (i == 0) {
      if (place.k - 1 >= 0) {
        move(moves[i + 2], board, player);
      }
    } else if (i == 1) {
      if (place.j - 1 >= 0) {
        move(moves[i + 2], board, player);
      }
    } else if (i == 2) {
      if (place.k + 1 < mapSize) {
        move(moves[i + 2], board, player);
      }
    } else if (i == 3) {
      if (place.j + 1 < mapSize) {
        move(moves[i + 2], board, player);
      }
    }

    // BestScore is the score of the move And spot is actually which move we want (left,right,up,down)
    if (score > bestScore) {
      bestScore = score;
      spot = i;
    }
  }
  move(moves[spot], board, player);
}

function minimax(board, depth, isMaximizing, player) {
  // Check If game is over to end the generation of moves (Actually That would mean we have to generate alot of moves, and that gives us an error so instead we just check when the player is a close distance to the food)
  // If it is then stop generating and return the score of that set of moves
  // MaxDepth Should not be hardcoded beacuse it always looks that amount of moves ahead... and sometimes that needs to be different depending on the route the player needs to take to get to the food (i don't know how to fucking do that :))
  let maxDepth = 0;
  let result = checkWinner();

  for (let k = 0; k < mapSize; k++) {
    for (let l = 0; l < mapSize; l++) {
      if (board[k][l] == player) {
        place2 = {
          k,
          l
        };
      }
    }
  }

  if (aiStuck) {
    maxDepth = 2;
    // console.log('Stuck');
    if (timeUntilStuck > 15) {
      maxDepth = 1;
      if (timeUntilStuck > 20) {
        maxDepth = 0;
        if (timeUntilStuck > 25) {
          maxDepth = 1;
          if (timeUntilStuck > 30) {
            maxDepth = 2;
            if (timeUntilStuck > 35) {
              maxDepth = 3;
              if (timeUntilStuck > 40) {
                maxDepth = 4;
                if (timeUntilStuck > 45) {
                  maxDepth = 5;
                  if (timeUntilStuck > 55) {
                    maxDepth = 0;
                    if (timeUntilStuck > 60) {
                      maxDepth = Infinity;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } else {
    maxDepth = 0;
  }

  // console.log('MD: ' + maxDepth);

  if (depth == maxDepth || result != null) {
    // Loop through all the spots in the board
    for (let i = 0; i < mapSize; i++) {
      for (let j = 0; j < mapSize; j++) {
        // Stop when you find the player
        if (board[i][j] == player) {
          // Loop through the foodBoard
          for (let k = 0; k < mapSize; k++) {
            for (let l = 0; l < mapSize; l++) {
              // Stop when you find the food
              if (foodBoard[k][l] == food) {
                // Find the distance between the food and the player
                distance = dist(w * j, h * (i + 1), w * l, h * (k + 1));
              }
            }
          }
        }
      }
    }
    // To Return the score
    if (result == 'loss') {
      return -1000;
    } else {
      return 1000 - depth - distance;
    }
  } else {
    let bestScore = -Infinity;
    for (let i = 0; i < 4; i++) {
      // Check where the Player is to see if it's in a corner beacuse if it is we dont need to undo the move
      for (let j = 0; j < mapSize; j++) {
        for (let k = 0; k < mapSize; k++) {
          if (board[j][k] == player) {
            place1 = {
              j,
              k
            };
          }
        }
      }
      // Make move
      move(moves[i], board, player);

      // Get Score
      let score = minimax(board, depth + 1, false, player);

      // Undo Move
      if (i == 0) {
        if (place1.k - 1 >= 0) {
          move(moves[i + 2], board, player);
        }
      } else if (i == 1) {
        if (place1.j - 1 >= 0) {
          move(moves[i + 2], board, player);
        }
      } else if (i == 2) {
        if (place1.k + 1 < mapSize) {
          move(moves[i + 2], board, player);
        }
      } else if (i == 3) {
        if (place1.j + 1 < mapSize) {
          move(moves[i + 2], board, player);
        }
      }

      // BestScore is the score of the move
      bestScore = max(score, bestScore);
    }
    return bestScore;
  }
}

function generateMap() {
  let foodAmount = 0;
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (board[i][j] == '') {
        let x = floor(random(0, 10));
        if (foodBoard[i][j] == '') {
          if (x <= 2) {
            foodBoard[i][j] = obstacle;
          } else if (x == 5 && foodAmount == 0) {
            foodBoard[i][j] = food;
            foodAmount++;
          }
        }
      }
    }
  }
  if (foodAmount == 0) {
    for (let i = 0; i < mapSize; i++) {
      for (let j = 0; j < mapSize; j++) {
        if (board[i][j] == '') {
          let x = floor(random(0, 10));
          if (foodBoard[i][j] == '') {
            if (x >= 7 && foodAmount == 0) {
              foodBoard[i][j] = food;
              foodAmount++;
            }
          }
        }
      }
    }
  }
  mapGenerated = true;
}

function move(direction, board, player) {
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (board[i][j] == player) {
        if (direction == moves[0]) {
          if (j - 1 >= 0) {
            board[i][j - 1] = player;
            direction = '';
            board[i][j] = '';
          }
        } else if (direction == moves[2]) {
          if (j + 1 < mapSize) {
            board[i][j + 1] = player;
            direction = '';
            board[i][j] = '';
          }
        } else if (direction == moves[1]) {
          if (i - 1 >= 0) {
            board[i - 1][j] = player;
            direction = '';
            board[i][j] = '';
          }
        } else if (direction == moves[3]) {
          if (i + 1 < mapSize) {
            board[i + 1][j] = player;
            direction = '';
            board[i][j] = '';
          }
        }
      }
    }
  }
}

function checkWinner() {
  let result = null;
  // Loop Through the board
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      // Stop if we find the player and food on the same place and return win
      if (board[i][j] == player && foodBoard[i][j] == food) {
        result = 'win';
      } else if (board[i][j] == player && foodBoard[i][j] == obstacle) {
        result = 'loss';
      }
    }
  }
  return result;
}

function keyPressed() {
  if (gameResult == null) {
    switch (keyCode) {
      case 37:
        move(moves[0], board, player);
        break;
      case 38:
        move(moves[1], board, player);
        break;
      case 39:
        move(moves[2], board, player);
        break;
      case 40:
        move(moves[3], board, player);
        break;
      case 27:
        if (start) {
          start = false;
        } else {
          start = true;
        }
        break;
    }
  }
}