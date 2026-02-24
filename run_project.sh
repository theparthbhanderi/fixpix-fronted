#!/bin/bash
echo "Starting FixPix..."

# Get the current directory
PROJECT_DIR=$(pwd)

# Start Backend in a new Terminal window
osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR/backend' && python3 manage.py runserver\""

# Start Frontend in a new Terminal window
osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR' && npm run dev\""
