# Escape from Tikal

This is a cooperative board game in which there are two different roles:
navigator and party. The navigator role is played by a human, while the
cooperating party makes decisions based on LLM responses.

# Requisites

TODO

# Running on local devnet

The process of building a cartesi machine and firing up the co-processor
infrastructure is performed through a makefile. In order to fire up the
co-processor infrastructure you should use the command
```
make up
```

After that you should build the Cartesi Machine used by the co-processor
operator. In order to do that, use the command
```
make build
```

Next, it's time to make the solver aquire the Cartesi Machine image.
The process consists of uploading the Cartesi Machine image to a local
AWS S3 like instance and notifying the solver to download it.
This is performed with the command
```
make publish
```

As time process takes a while (and it's asynchronous) you should check
it's status with the command
```
make publish-status
```

And wait until it shows the DAG import was completed. Next it's time to
tell the Co-processor operator to download the image. To perform this,
use the command
```
make ensure-publish
```

Now the Co-processor is aware of your image and it's time to deploy the
contract that issues tasks and receives callbacks from it. Use the command
```
make deploy-contract
```

This step will output the contract address. Now let's interact with the
deployed Co-processor. You need to specify the contract address that was
just shown as well as the payload. Use the command
```
CONTRACT_ADDRESS=<ADDRESS>
PAYLOAD=<PAYLOAD>
make send CONTRACT_ADDRESS=$CONTRACT_ADDRESS PAYLOAD=$PAYLOAD
```

This will send an input to the Co-processor using cast. You can check the 
docker container log for the operator to see the status of the input 
processing and once it's completed you can check the solver log for the
callback with the results. You can later recover the results from the
events generated by the smart contract using the command
```
source .env && cast logs --rpc-url $RPC_URL --address $CONTRACT_ADDRESS
```
