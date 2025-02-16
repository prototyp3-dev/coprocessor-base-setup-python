export const mockedData = {
  "py/object": "core_engine.tikal_core.GameState",
  game_board: {
    "py/object": "core_engine.tikal_core.GameBoard",
    tiles: {
      "1": {
        "4": {
          type: "word",
          word: "Salt",
        },
        "5": {
          type: "word",
          word: "Sandwich",
        },
        "6": {
          type: "word",
          word: "Ham",
        },
        "7": {
          type: "word",
          word: "Bacon",
        },
      },
      "2": {
        "3": {
          type: "word",
          word: "Sea",
        },
        "4": {
          type: "word",
          word: "Fish",
        },
        "5": {
          type: "word",
          word: "Bread",
        },
        "6": {
          type: "word",
          word: "Breakfast",
        },
        "7": {
          type: "empty",
        },
      },
      "3": {
        "2": {
          type: "word",
          word: "Sand",
        },
        "3": {
          type: "empty",
        },
        "4": {
          type: "empty",
        },
        "5": {
          type: "empty",
        },
        "6": {
          type: "word",
          word: "Tangerine",
        },
        "7": {
          type: "empty",
        },
      },
      "4": {
        "1": {
          type: "empty",
        },
        "2": {
          type: "word",
          word: "Silicon",
        },
        "3": {
          type: "empty",
        },
        "4": {
          type: "empty",
        },
        "5": {
          type: "empty",
        },
        "6": {
          type: "empty",
        },
        "7": {
          type: "empty",
        },
      },
      "5": {
        "1": {
          type: "empty",
        },
        "2": {
          type: "word",
          word: "Carbon",
        },
        "3": {
          type: "word",
          word: "Grey",
        },
        "4": {
          type: "empty",
        },
        "5": {
          type: "empty",
        },
        "6": {
          type: "empty",
        },
      },
      "6": {
        "1": {
          type: "word",
          word: "Graphene",
        },
        "2": {
          type: "word",
          word: "Graphite",
        },
        "3": {
          type: "word",
          word: "Pencil",
        },
        "4": {
          type: "empty",
        },
        "5": {
          type: "empty",
        },
      },
      "7": {
        "1": {
          type: "empty",
        },
        "2": {
          type: "empty",
        },
        "3": {
          type: "empty",
        },
        "4": {
          type: "empty",
        },
      },
    },
    water_supply: 2,
    max_water_supply: 5,
    curse_count: 1,
    amulet_count: 1,
    max_amulet_count: 1,
    treasure_count: 2,
    move_count: 13,
    last_visited_tile_type: "exit",
    last_visited_tile: {
      "py/tuple": [3, 6],
    },
    last_move_reasoning: " I like turtles",
    score: 1410,
    defeat_reason: "empty",
    game_status: "victory",
  },
  game_map: {
    "py/object": "core_engine.tikal_core.GameMap",
    tiles: {
      "1": {
        "4": {
          type: "word",
          word: "Bread",
        },
        "5": {
          type: "empty",
        },
        "6": {
          type: "treasure",
        },
        "7": {
          type: "trap",
        },
      },
      "2": {
        "3": {
          type: "empty",
        },
        "4": {
          type: "word",
          word: "Fish",
        },
        "5": {
          type: "word",
          word: "Bread",
        },
        "6": {
          type: "empty",
        },
        "7": {
          type: "empty",
        },
      },
      "3": {
        "2": {
          type: "water",
        },
        "3": {
          type: "trap",
        },
        "4": {
          type: "empty",
        },
        "5": {
          type: "empty",
        },
        "6": {
          type: "exit",
        },
        "7": {
          type: "empty",
        },
      },
      "4": {
        "1": {
          type: "empty",
        },
        "2": {
          type: "empty",
        },
        "3": {
          type: "empty",
        },
        "4": {
          type: "curse",
        },
        "5": {
          type: "trap",
        },
        "6": {
          type: "treasure",
        },
        "7": {
          type: "empty",
        },
      },
      "5": {
        "1": {
          type: "empty",
        },
        "2": {
          type: "curse",
        },
        "3": {
          type: "trap",
        },
        "4": {
          type: "empty",
        },
        "5": {
          type: "empty",
        },
        "6": {
          type: "empty",
        },
      },
      "6": {
        "1": {
          type: "treasure",
        },
        "2": {
          type: "water",
        },
        "3": {
          type: "amulet",
        },
        "4": {
          type: "curse",
        },
        "5": {
          type: "empty",
        },
      },
      "7": {
        "1": {
          type: "water",
        },
        "2": {
          type: "empty",
        },
        "3": {
          type: "empty",
        },
        "4": {
          type: "empty",
        },
      },
    },
  },
  words: ["Tangerine"],
  game_id: -1,
};

export type GameData = typeof mockedData;
export type GameboardState = typeof mockedData.game_board;
export type GameboardMap = typeof mockedData.game_map.tiles;
export type GameboardRow = keyof GameboardState["tiles"];
export type GameboardRow1Col = keyof GameboardState["tiles"][1];
export type GameboardRow2Col = keyof GameboardState["tiles"][2];
export type GameboardRow3Col = keyof GameboardState["tiles"][3];
export type GameboardRow4Col = keyof GameboardState["tiles"][4];
export type GameboardRow5Col = keyof GameboardState["tiles"][5];
export type GameboardRow6Col = keyof GameboardState["tiles"][6];
export type GameboardRow7Col = keyof GameboardState["tiles"][7];
// export type BoardCoords = [GameboardRow, GameboardRow1Col | GameboardRow2Col | GameboardRow3Col | GameboardRow4Col | GameboardRow5Col | GameboardRow6Col | GameboardRow7Col];

export type BoardCoords =
  | ["1", GameboardRow1Col]
  | ["2", GameboardRow2Col]
  | ["3", GameboardRow3Col]
  | ["4", GameboardRow4Col]
  | ["5", GameboardRow5Col]
  | ["6", GameboardRow6Col]
  | ["7", GameboardRow7Col];

export const gameboardMapping: Record<string, BoardCoords> = {
  "0,-3,3": ["1", "4"],
  "1,-3,2": ["1", "5"],
  "2,-3,1": ["1", "6"],
  "3,-3,0": ["1", "7"],

  "-1,-2,3": ["2", "3"],
  "0,-2,2": ["2", "4"],
  "1,-2,1": ["2", "5"],
  "2,-2,0": ["2", "6"],
  "3,-2,-1": ["2", "7"],

  "-2,-1,3": ["3", "2"],
  "-1,-1,2": ["3", "3"],
  "0,-1,1": ["3", "4"],
  "1,-1,0": ["3", "5"],
  "2,-1,-1": ["3", "6"],
  "3,-1,-2": ["3", "7"],

  "-3,0,3": ["4", "1"],
  "-2,0,2": ["4", "2"],
  "-1,0,1": ["4", "3"],
  "0,0,0": ["4", "4"],
  "1,0,-1": ["4", "5"],
  "2,0,-2": ["4", "6"],
  "3,0,-3": ["4", "7"],

  "-3,1,2": ["5", "1"],
  "-2,1,1": ["5", "2"],
  "-1,1,0": ["5", "3"],
  "0,1,-1": ["5", "4"],
  "1,1,-2": ["5", "5"],
  "2,1,-3": ["5", "6"],

  "-3,2,1": ["6", "1"],
  "-2,2,0": ["6", "2"],
  "-1,2,-1": ["6", "3"],
  "0,2,-2": ["6", "4"],
  "1,2,-3": ["6", "5"],

  "-3,3,0": ["7", "1"],
  "-2,3,-1": ["7", "2"],
  "-1,3,-2": ["7", "3"],
  "0,3,-3": ["7", "4"],
};
