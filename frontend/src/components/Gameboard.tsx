
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid';


const mockedData = {
  "py/object": "core_engine.tikal_core.GameBoard",
  "tiles": {
    "1": {
      "4": {
        "type": "word",
        "word": "Salt"
      },
      "5": {
        "type": "word",
        "word": "Sandwich"
      },
      "6": {
        "type": "word",
        "word": "Ham"
      },
      "7": {
        "type": "word",
        "word": "Bacon"
      }
    },
    "2": {
      "3": {
        "type": "word",
        "word": "Sea"
      },
      "4": {
        "type": "word",
        "word": "Fish"
      },
      "5": {
        "type": "word",
        "word": "Bread"
      },
      "6": {
        "type": "word",
        "word": "Breakfast"
      },
      "7": {
        "type": "empty"
      }
    },
    "3": {
      "2": {
        "type": "word",
        "word": "Sand"
      },
      "3": {
        "type": "empty"
      },
      "4": {
        "type": "empty"
      },
      "5": {
        "type": "empty"
      },
      "6": {
        "type": "word",
        "word": "Tangerine"
      },
      "7": {
        "type": "empty"
      }
    },
    "4": {
      "1": {
        "type": "empty"
      },
      "2": {
        "type": "word",
        "word": "Silicon"
      },
      "3": {
        "type": "empty"
      },
      "4": {
        "type": "empty"
      },
      "5": {
        "type": "empty"
      },
      "6": {
        "type": "empty"
      },
      "7": {
        "type": "empty"
      }
    },
    "5": {
      "1": {
        "type": "empty"
      },
      "2": {
        "type": "word",
        "word": "Carbon"
      },
      "3": {
        "type": "word",
        "word": "Grey"
      },
      "4": {
        "type": "empty"
      },
      "5": {
        "type": "empty"
      },
      "6": {
        "type": "empty"
      }
    },
    "6": {
      "1": {
        "type": "word",
        "word": "Graphene"
      },
      "2": {
        "type": "word",
        "word": "Graphite"
      },
      "3": {
        "type": "word",
        "word": "Pencil"
      },
      "4": {
        "type": "empty"
      },
      "5": {
        "type": "empty"
      }
    },
    "7": {
      "1": {
        "type": "empty"
      },
      "2": {
        "type": "empty"
      },
      "3": {
        "type": "empty"
      },
      "4": {
        "type": "empty"
      }
    }
  },
  "water_supply": 2,
  "max_water_supply": 5,
  "curse_count": 1,
  "amulet_count": 1,
  "max_amulet_count": 1,
  "treasure_count": 2,
  "move_count": 13,
  "last_visited_tile_type": "exit",
  "last_visited_tile": {
    "py/tuple": [
      3,
      6
    ]
  },
  "defeat_reason": "empty",
  "game_status": "victory"
};

const layoutConfig = {
  "width": 800,
  "height": 600,
  "layout": { "width": 8, "height": 8, "flat": false, "spacing": 1.05 },
  "origin": { "x": 0, "y": 0 },
  "mapProps": [ 3]
};

export default function Gameboard() {

  const generator = GridGenerator.getGenerator("hexagon");
  const hexagons = generator(3);
  const layout = layoutConfig.layout;
  const size = { x: layout.width, y: layout.height };
  console.log("hexagons",hexagons)


  return (
    <div>

      <HexGrid width={layoutConfig.width} height={layoutConfig.height}>
        <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={layoutConfig.origin}>
          {
            hexagons.map((hex, i) => {
              // console.log("hex",i,hex,HexUtils.getID(hex))
              return (
              <Hexagon key={layoutConfig.mapProps[0] + i} q={hex.q} r={hex.r} s={hex.s}>
                <Text>{HexUtils.getID(hex)}</Text>
              </Hexagon>
            )})
          }
        </Layout>
      </HexGrid>
      <div>Status</div>
    </div>
  );
};
