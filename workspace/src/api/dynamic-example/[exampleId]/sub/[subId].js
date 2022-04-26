export default (request, params) => {
  const headers = {
    "content-type": "application/json",
  };

  const url = new URL(request.url);

  const body = JSON.stringify({
    test: "ok",
    url,
    params,
  });

  return new Response(body, { headers });
};
