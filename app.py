from logging import getLogger, basicConfig, DEBUG
from pydantic import BaseModel
from typing import Annotated, List
import json

from cartesi import App, Rollup, RollupData, abi
from cartesi.models import _str2hex as str2hex

LOGGER = getLogger(__name__)
basicConfig(level=DEBUG)
app = App(raw_input = True)

BytesList = Annotated[List[bytes], abi.ABIType('bytes[]')]

class Words(BaseModel):
    challenge_id: abi.Bytes32
    words: BytesList

class ChallengeNotice(BaseModel):
    challenge_id: abi.Bytes32
    timestamp: abi.UInt256
    score: abi.UInt256
    n_moves: abi.UInt256
    n_moves_left: abi.UInt256
    user: abi.Address
    n_treasures: abi.UInt8
    escaped: abi.Bool

LLAMA_DOMAIN = int.from_bytes(bytes.fromhex('2b'), "big") # llama domain
DATA_MESSAGE = "The word is \"%s\" and the word sets are:\n%s"

standard_llama_message = {
    "model": "phi3",
    "messages": [{
        "role": "system",
        "content": "I am going to provide you with a numbered list of word sets and with an isolated word and I need you to tell me the number of the word set that is more related to the given isolated word.\nOnly consider the meaning of the word. Do not accept multiple words, ignore radicals and suffix correlations, words that are not present on the english dictionary, in these cases answer 0.\nBegin your answer with the isolated number followed by a period. After the period you can add your reasoning for choosing that option."
    },
    {
        "role": "user",
        "content": None
    }]
}
@app.advance()
def handle_advance(rollup: Rollup, data: RollupData) -> bool:

    LOGGER.debug(f"App advance 0x{rollup=} {data=}")

    payload = data.bytes_payload()
    words_model = abi.decode_to_model(data=payload, model=Words)

    selected_words = [w.decode('utf-8') for w in words_model.words]

    LOGGER.info(f"Challenge id 0x{words_model.challenge_id.hex().rjust(64,'0')} and words selected {selected_words}")

    challenge_original_sets = ["lime","wattermelon","tie","lime, wattermelon","lime, tie","wattermelon, tie"]

    current_sets = challenge_original_sets.copy()

    for selected_word in selected_words:
        llama_message = standard_llama_message.copy()
        current_sets_str = [f"{i+1}: {current_sets[i]}" for i in range(len(current_sets))]
        message = DATA_MESSAGE % (selected_word,'\n'.join(current_sets_str))
        LOGGER.info(message)
        llama_message["messages"][1]["content"] = message

        res = rollup.gio(
            {
                "domain":LLAMA_DOMAIN,
                "id":str2hex(json.dumps(llama_message))
            }
        )
        gio_res = json.loads(res.decode("utf-8"))
        llama_res = None
        if gio_res.get('response') is not None:
            llama_res = json.loads(bytes.fromhex(gio_res['response'][2:]).decode("utf-8"))
        LOGGER.debug(f"llama Res {llama_res}")
        if llama_res is not None and llama_res.get('choices') is not None and len(llama_res['choices']) > 0 and \
                llama_res['choices'][0].get('message') is not None and  llama_res['choices'][0]['message'].get('content') is not None:
            content = llama_res['choices'][0]['message']['content']
            splitted_content = content.split('.')
            if len(splitted_content) > 0:
                set_chosen = 0
                try:
                    set_chosen = int(splitted_content[0])
                except Exception as e:
                    LOGGER.warn(f"Error processing llama response Res {e}")
                    continue
                if set_chosen > 0 and set_chosen <= len(current_sets):
                    words_chosen_set = current_sets[set_chosen - 1]
                    reasoning = None
                    if len(splitted_content) > 1:
                        reasoning = '.'.join(splitted_content[1:]).strip()

                    LOGGER.info(f"Chosen set for word '{selected_word}': {set_chosen} {words_chosen_set}. Reasoning: {reasoning}")

    notice = ChallengeNotice(
        challenge_id = words_model.challenge_id,
        timestamp = data.metadata.block_timestamp,
        score = 60,
        n_moves = 6,
        n_moves_left = 3,
        user = data.metadata.msg_sender,
        n_treasures = 1,
        escaped = True,
    )
    notice_hex = f"0x{abi.encode_model(notice).hex()}"
    LOGGER.debug(f"{notice=}")
    LOGGER.debug(f"{notice_hex=}")
    rollup.notice(notice_hex)
    return True


@app.inspect()
def handle_inspect(rollup: Rollup, data: RollupData) -> bool:
    payload = data.str_payload()
    LOGGER.debug("Echoing '%s'", payload)
    rollup.report(str2hex(payload))
    return True


if __name__ == '__main__':
    app.run()
