dev:
	mode=dev deno run --no-check --allow-net --allow-read --allow-env --allow-run --allow-write --import-map=importmap.json --unstable server.ts

start: 
	url=https://ultrajs.dev deno run --no-check --allow-net --allow-read --allow-env --allow-run --allow-write --import-map=importmap.json --unstable server.ts

cache:
	deno cache --reload --no-check server.ts