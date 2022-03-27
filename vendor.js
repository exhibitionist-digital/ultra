import vendor from './src/vendor.ts'

Deno.writeTextFile(`vendorMap.json`, JSON.stringify({ imports: await vendor() }));