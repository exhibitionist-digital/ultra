config = --allow-net --allow-read --allow-run --allow-env --allow-write --no-check --import-map importmap.json --unstable

dev:
	mode=dev deno run --watch $(config) server.js

start:
	deno run $(config) server.js

cache:
	deno cache --import-map=importmap.json --reload --no-check server.js