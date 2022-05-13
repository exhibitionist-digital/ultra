export default function helloWorldHandler() {
  const headers = {
    "content-type": "application/json",
  };

  const body = JSON.stringify({ hello: "world!" });

  return new Response(body, { headers });
}
