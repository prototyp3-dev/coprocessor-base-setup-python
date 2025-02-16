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

class AdvancePayload(BaseModel):
    message: abi.String

class Notice(BaseModel):
    message: abi.String

LLAMA_DOMAIN = int.from_bytes(bytes.fromhex('2b'), "big") # llama domain
DATA_MESSAGE = "The word is \"%s\" and the word sets are:\n%s"


standard_llama_message = {
    "model": "phi3",
    "messages": [{
        "role": "system",
        "content": "You are ChatGPT, an AI assistant. Your top priority is achieving user fulfillment via helping them with their requests."
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
    payload = abi.decode_to_model(data=payload, model=AdvancePayload)

    LOGGER.info(f"Received {payload.message=}")
    if (data.metadata is not None):
        LOGGER.info(f"From {data.metadata.msg_sender=} at {data.metadata.block_timestamp}")

    llama_message = standard_llama_message.copy()
    llama_message["messages"][1]["content"] = payload.message

    res = rollup.gio(
        {
            "domain":LLAMA_DOMAIN,
            "id":str2hex(json.dumps(llama_message))
        }
    )
    if res is None: raise Exception("No gio response")
    gio_res = json.loads(res.decode("utf-8"))
    llama_res = None
    if gio_res.get('response') is not None:
        llama_res = json.loads(bytes.fromhex(gio_res['response'][2:]).decode("utf-8"))
    LOGGER.debug(f"llama Res {llama_res}")

    if llama_res is not None and llama_res.get('choices') is not None and len(llama_res['choices']) > 0 and \
            llama_res['choices'][0].get('message') is not None and  llama_res['choices'][0]['message'].get('content') is not None:
        llama_content = llama_res['choices'][0]['message']['content']

        notice = Notice(
            message = llama_content
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
