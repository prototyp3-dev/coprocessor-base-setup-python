#!/bin/bash

awslocal --endpoint-url=http://localstack:4566 s3 mb s3://solver-bucket
