from logging import getLogger, basicConfig, TRACE
from pydantic import BaseModel
from typing import Annotated, List
import json

from cartesi import App, Rollup, RollupData, abi

LOGGER = getLogger(__name__)
basicConfig(level=TRACE)
app = App()

BytesList = Annotated[List[bytes], abi.ABIType('bytes[]')]

class Words(BaseModel):
    challenge_id: abi.Bytes32
    words: BytesList

class ChallengeNotice(BaseModel):
    challenge_id: abi.Bytes32
    user: abi.Address
    timestamp: abi.UInt
    score: abi.UInt
    escaped: abi.Bool
    n_treasures: abi.UInt
    n_moves: abi.UInt
    n_moves_left: abi.UInt


def str2hex(str):
    """Encodes a string as a hex string"""
    return "0x" + str.encode("utf-8").hex()

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

    payload = data.bytes_payload()
    words_model = abi.decode_to_model(data=payload, model=Words)

    selected_words = [bytes.fromhex(w[2:]).decode('utf-8') for w in words_model.words]

    LOGGER.debug(f"Challenge 0x{words_model.challenge_id.hex().rjust(64,'0')} {selected_words=}")

    challenge_original_sets = ["lime","wattermellon","tie","lime, wattermellon","lime, tie","wattermellon, tie"]

    current_sets = challenge_original_sets.copy()

    for selected_word in selected_words:
        llama_message = standard_llama_message.copy()
        current_sets_str = [f"{i}. {current_sets[i]}" for i in range(len(current_sets))]
        llama_message["messages"][1]["content"] = DATA_MESSAGE % (selected_word,'\n'.join(current_sets_str))

        res = rollup.gio(
            {
                "domain":bytes.fromhex('2b'),
                "id":f"0x{str2hex(json.dumps(llama_message))}"
            }
        )
        LOGGER.debug("Gio Res '%s'", payload)

    notice = ChallengeNotice(
        challenge_id = words_model.challenge_id,
        user = data.metadata.msg_sender,
        timestamp = data.metadata.block_timestamp,
        score = 0,
        escaped = True,
        n_treasures = 1,
        n_moves = 6,
        n_moves_left = 3
    )
    rollup.notice(f"0x{abi.encode_model(notice).hex()}")
    return True


@app.inspect()
def handle_inspect(rollup: Rollup, data: RollupData) -> bool:
    payload = data.str_payload()
    LOGGER.debug("Echoing '%s'", payload)
    rollup.report(str2hex(payload))
    return True


if __name__ == '__main__':
    app.run()
