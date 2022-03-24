export default () => {
  const headers = {
    "content-type": "application/json",
  };

  const body = JSON.stringify({ test: "ok" });

  return new Response(body, { headers });
};
