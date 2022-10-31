#!/usr/bin/env bash

set -e
# try uop or kill

cd typescript-api
npm i
ENTRYPOINTS=$(find -type f -name '*.[tj]s' -not -path './node_modules/*')

rm -rf lib
mkdir -p ./lib
esbuild $ENTRYPOINTS \
	--log-level=warning \
	--outdir='./lib' \
	--outbase=. \
	--sourcemap \
	--target='node16' \
	--platform='node' \
	--format='cjs'
