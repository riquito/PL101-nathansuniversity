#!/bin/bash

# DEPENDENCIES
# On UBUNTU run
# sudo apt-get install git-core build-essential curl openssl libssl-dev 

function usage
{
    echo "Usage: $0 newProjectDir nodejsGitTag"
    echo "e.g. $0 fooProj v0.6.9"
}

if [ $# -ne 2 -o $# -eq 0 -o "$1" == "-h" ]; then
usage
  exit 1
fi

ORIG_DIR=`pwd`
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_PATH=$1
NODE_VERSION=$2

if [ ! -e $PROJECT_PATH ]; then
    mkdir $PROJECT_PATH
fi

cd $PROJECT_PATH

echo "Installing latest nvm (Node Version Manager)"
git clone git://github.com/creationix/nvm.git .nvm
source .nvm/nvm.sh

echo "Installing Node.js $NODE_VERSION"
nvm install $NODE_VERSION

echo -e ".nvm/\nnode_modules/" > .gitignore

nvm deactivate

cd $ORIG_DIR

echo ""
echo "Done. You can enter your virtual environment with"
echo "cd $1 && source .nvm/nvm.sh"
echo "Then you'll have node, npm and the other binaries available in your PATH"
echo ""
echo "Remember to review the dependencies in package.json and then run"
echo "npm install"
echo "(it's also a nice time to start versioning the project)"
