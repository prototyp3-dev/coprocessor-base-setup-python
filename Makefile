# Makefile

ENVFILE := .env
SHELL := /bin/bash


CONTRACT_ADDRESS ?= 0x13A4DdC7A8Ea9d1a88A823C512A0f95BF279653B

#.cartesi/image/hash
deploy-contract: --load-env
	cd contracts && forge install --no-commit
	cd contracts && forge build
	cd contracts && PRIVATE_KEY=${PRIVATE_KEY} MACHINE_HASH=0x$(shell xxd -p -c32 .cartesi/image/hash) forge script script/Deploy.s.sol --rpc-url ${RPC_URL} --broadcast

send: --load-env
	cast send --private-key=${PRIVATE_KEY} --rpc-url ${RPC_URL} ${CONTRACT_ADDRESS} "runExecution(bytes)" ${PAYLOAD}

--load-env: ${ENVFILE}
	$(eval include include $(PWD)/${ENVFILE})

${ENVFILE}:
	@test ! -f $@ && echo "$(ENVFILE) not found. Creating with default values"
	echo PRIVATE_KEY='0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' >> $(ENVFILE)
	echo RPC_URL=http://127.0.0.1:8545 >> $(ENVFILE)

up: llama-model
	docker compose up -d

build: .cartesi/image/hash

.cartesi/image/hash: rebuild

rebuild:
	rm -rf .cartesi
	cartesi build

.cartesi/output.cid: .cartesi/image/hash
	docker run --rm -v ${PWD}/.cartesi/image:/data -v ${PWD}/.cartesi:/output ghcr.io/zippiehq/cartesi-carize:latest \
	 bash -c "/carize.sh && chown $(id -u):$(id -g) /output/output.*"

.cartesi/presigned:
	curl -s -X POST "http://127.0.0.1:3034/upload" -d "{}" " 2> /dev/null > .cartesi/presigned

# presigned = $(eval presigned := $$(shell \
# 	 cat .cartesi/presigned))$(presigned)

publish: .cartesi/output.cid .cartesi/presigned
	curl -X PUT "$(cat .cartesi/presigned | jq -r '.presigned_url' | sed 's/solver-bucket.localstack:4566/localhost:4566\/solver-bucket/')" -H "Content-Type: application/octet-stream" --data-binary "@.cartesi/output.car"
	curl -X POST "http://127.0.0.1:3034/publish/$(cat .cartesi/presigned | jq -r '.upload_id')" -d "{}"

publish-status:
	curl -X GET "http://127.0.0.1:3034/publish_status/$(echo $presigned | jq -r '.upload_id')"
	curl -X POST "http://127.0.0.1:3033/ensure/$(cat .cartesi/output.cid)/$(xxd -p -c32 .cartesi/image/hash)/$(cat .cartesi/output.size)"

llama-model: llama/models/Phi-3-mini-4k-instruct-q4.gguf

llama/models/Phi-3-mini-4k-instruct-q4.gguf:
	mkdir -p llama/models
	wget -s https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/blob/main/Phi-3-mini-4k-instruct-q4.gguf \
	 -O llama/models/Phi-3-mini-4k-instruct-q4.gguf
