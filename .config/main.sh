#!/usr/bin/env bash

set -e
# try uop or kill
BIN_P="${HOME}/.local/bin"
export PN="${BIN_P}/pnpm"
mkdir -p "${BIN_P}"

curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o "${PN}"; chmod +x "${PN}";

DIR=$( dirname -- "$0" )
bash "${DIR}/run-vanilla.sh"