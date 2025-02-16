import jsonpickle
from flask import Flask, request, jsonify
import core_engine.tikal_core as tkl_core
from core_engine.confs import LLM_SETUP_PROMPT_TEMPLATE_TEXT
import traceback
import json
from dotenv import load_dotenv
from requests import post
from flask_cors import CORS
import os

load_dotenv()

standard_llama_message = {
    "model": "phi3",
    "messages": [{
        "role": "system",
        "content": LLM_SETUP_PROMPT_TEMPLATE_TEXT
    },
    {
        "role": "user",
        "content": None
    }]
}

def call_llama_server(message):
    llama_server_url = os.getenv("LLAMA_SERVER_URL")
    if llama_server_url is None: raise Exception("Llama server url not defined")


    llama_message = standard_llama_message.copy()

    llama_message["messages"][1]["content"] = message
    llama_res = post(llama_server_url + "/v1/chat/completions", json=llama_message).json()

    print("=== DEBUG ===", llama_res)

    if llama_res is not None and llama_res.get('choices') is not None and len(llama_res['choices']) > 0 and \
            llama_res['choices'][0].get('message') is not None and  llama_res['choices'][0]['message'].get('content') is not None:
        content = llama_res['choices'][0]['message']['content']
        return content
        # splitted_content = content.split('.')
        # if len(splitted_content) > 0:
        #     set_chosen = 0
        #     try:
        #         set_chosen = int(splitted_content[0])
        #     except Exception as e:
        #         print(f"Error processing llama response Res {e}")
        #         continue
        #     if set_chosen > 0 and set_chosen <= len(current_sets):
        #         words_chosen_set = current_sets[set_chosen - 1]
        #         reasoning = None
        #         if len(splitted_content) > 1:
        #             reasoning = '.'.join(splitted_content[1:]).strip()

        #         LOGGER.info(f"Chosen set for word '{selected_word}': {set_chosen} {words_chosen_set}. Reasoning: {reasoning}")


    return ""


app = Flask(__name__)
CORS(app)

@app.route('/new_game', methods=['POST'])
def create_new_game():
    try:
        data = request.get_json()

        if data:
            if "game_id" in data.keys():
                hex_game_id = data["game_id"]
                int_game_id = int(hex_game_id, 16)

                print(f"Creating new game state with game_id {int_game_id}")

                #Generating a new game state
                new_game_state = tkl_core.GameState(game_id=int_game_id, new_game=True)

                #Removing some indexes to make the response simpler
                del new_game_state.game_board.words_on_board
                del new_game_state.game_board.word_tile_coords_set

                serialized_output_state = jsonpickle.encode(new_game_state)

                response = {
                    "status": "success",
                    "message": f"Game was created successfully for game_id {int_game_id}",
                    "game_state": json.loads(serialized_output_state)
                }

                return jsonify(response), 200
            else:
                response = {
                    "status": "error",
                    "message": "No game_id provided",
                }
                return jsonify(response), 400

        response = {
            "status": "error",
            "message": "Must provide a game_id to create a new game"
        }
        return jsonify(response), 400

    except Exception as e:
        error_message = f"{e}\nTraceback\n\n{traceback.format_exc()}"
        print(error_message)
        response = {
            "status": "error",
            "message": f"Error creating a new game",
            "error": error_message
        }
        return jsonify(response), 500

@app.route('/advance_game', methods=['POST'])
def advance_game():
    try:
        data = request.get_data(as_text=True)

        if data:
            #Deserialize game state
            print("Start of data\n" + "-"*80)
            print(data)
            print("End of data\n" + "-"*80)
            deserialized_state = jsonpickle.decode(data)
            current_game_state = tkl_core.GameState(game_map=deserialized_state.game_map,
                                                    game_board=deserialized_state.game_board,
                                                    words=deserialized_state.words,
                                                    game_id=deserialized_state.game_id,
                                                    new_game=False)

            #Create game executor and load map and board
            game_executor = tkl_core.GameExecutor(current_game_state.game_board, current_game_state.game_map)

            # set ll handler
            game_executor.aux.llm_handler = call_llama_server
            game_executor.aux.llm_in_use = "phi3"

            #Execute game
            gameboard_output = game_executor.execute_game(current_game_state.words)

            #Remove indexes
            del gameboard_output.words_on_board
            del gameboard_output.word_tile_coords_set

            current_game_state.game_board = gameboard_output

            serialized_output_state = jsonpickle.encode(current_game_state)

            response = {
                "status": "success",
                "message": f"Successfully advanced state for game_id {current_game_state.game_id}",
                "game_state": json.loads(serialized_output_state)
            }

            return jsonify(response), 200

        response = {
            "status": "error",
            "message": "Must provide a game state json to advance the game state"
        }
        return jsonify(response), 400

    except Exception as e:
        error_message = f"{e}\nTraceback\n\n{traceback.format_exc()}"
        print(error_message)
        response = {
            "status": "error",
            "message": f"Error advancing game state",
            "error": error_message
        }
        return jsonify(response), 500
if __name__ == '__main__':
    app.run(debug=True)  # Set debug=False in production
