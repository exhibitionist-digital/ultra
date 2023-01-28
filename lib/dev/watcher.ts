declare const self: Worker;

self.onmessage = async function (event) {
  const watcher = Deno.watchFs(event.data, {
    recursive: true,
  });

  const eventKinds = ["create", "modify", "remove"];

  for await (const event of watcher) {
    if (eventKinds.includes(event.kind)) {
      self.postMessage(event);
    }
  }
};
