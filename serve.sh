#!/bin/bash

echo "Starting Jekyll server..."
echo "Note: Make sure you have Ruby and Bundler installed"
echo ""

# Check if bundle is installed
if ! command -v bundle &> /dev/null; then
    echo "Bundle not found. Please install Ruby and run: gem install bundler"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "vendor" ]; then
    echo "Installing dependencies..."
    bundle install
fi

# Start Jekyll server
echo "Starting server at http://localhost:4000"
bundle exec jekyll serve --watch --host 0.0.0.0