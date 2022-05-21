import { sleep } from "https://deno.land/x/sleep/mod.ts";

const helloWorldHandler = async (request) => {
  const headers = {
    "content-type": "application/json",
  };
  await sleep(5);
  const body = JSON.stringify({ hello: "world2" });

  return new Response(body, { headers });
};

export default helloWorldHandler;
