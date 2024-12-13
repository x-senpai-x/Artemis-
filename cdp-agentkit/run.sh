#!/bin/bash
# run.sh
uvicorn app.main:app --host 0.0.0.0 --port 6969 --reload