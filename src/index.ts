import http from 'http';

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  let timer: NodeJS.Timer | undefined
  let count = 0
  const maxCount = 10
  const readleStream = new ReadableStream({
    start(controller) {
      enqueue()
      timer = setInterval(enqueue, 2000);

      function enqueue() {
        const message = `<p>It is ${new Date().toISOString()}\n</p>`;
        controller.enqueue(new TextEncoder().encode(message));
        if (count > maxCount) {
          clearInterval(timer);
          controller.close();
        }
        count++;
      }
    },
    cancel() {
      timer && clearInterval(timer);
    },
  });
  const writableStream = new WritableStream({
    write(chunk) {
      res.write(chunk)
    },
  })
  await readleStream.pipeTo(writableStream)
  res.end();
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

