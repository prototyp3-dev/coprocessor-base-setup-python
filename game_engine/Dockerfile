# syntax=docker/dockerfile:1

FROM python:3.12-slim

WORKDIR /python-docker

COPY offchain_server_requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ARG ENV_FILE=.env
COPY ${ENV_FILE} .env

CMD [ "python3", "-m" , "flask", "--app=offchain_app.py", "run", "--host=0.0.0.0", "--port=80"]
