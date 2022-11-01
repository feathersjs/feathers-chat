
cd typescript-api
pnpm i
ENTRYPOINTS=$(find -type f -name '*.[tj]s' -not -path './node_modules/*')

rm -rf lib
mkdir -p ./lib
pnpm run migrate:make feathers-api
pnpm run migrate
pnpm run dev

# Future improvements
# Try esbuild, vite, bun, tsx or swc
