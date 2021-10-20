dev:
	mode=dev deno run --no-check --allow-net --allow-read --allow-env --allow-run --allow-write --import-map=import_map.json --unstable server.ts

start: 
	deno run --no-check --allow-net --allow-read --allow-env --allow-run --allow-write --import-map=import_map.json --unstable server.ts

cache:
	deno cache --reload --no-check server.ts
