export default (request: Request, params: Record<string, string>) => {
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
