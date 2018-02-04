#!/usr/bin/env bash

# Simulate a production environment by throwing 300 requests at the server
for i in {1..300}; do
  curl -X POST localhost:3000/process
done;