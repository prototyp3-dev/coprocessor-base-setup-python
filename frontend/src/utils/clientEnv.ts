import { str, envsafe, url } from 'envsafe';

export const envClient = envsafe({
  APP_ADDR: str({
    input: process.env.NEXT_PUBLIC_APP_ADDR,
    desc: "Cartesi Coprocessor app ETH address."
  }),
  BACKEND_URL: url({
    input: process.env.NEXT_PUBLIC_BACKEND_URL,
    desc: "Backend URL."
  }),
  NETWORK_CHAIN_ID: str({
    input: process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID,
    desc: "Network ChainId (in hex) where the Cartesi DApp was deployed."
  }),
})
