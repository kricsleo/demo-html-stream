import http from 'http';

/**
 * Browser renders incomplete html content when streaming,
 * and rerenders when received rest content.
 */
const contents = `
<p id="tips">Streaming... 🚀 (incomplete content)</p>
<div style="display: flex">
  <div style="background:pink;height:100px;flex:1;">Part 1</div>🤔
  <div style="background:skyblue;height:100px;flex:1;">Part 2</div>
</div>
<script>document.getElementById('tips').innerText='Done 🎉 (full content)'</script>
`.split('🤔')

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  let timer: NodeJS.Timer | undefined
  const readleStream = new ReadableStream({
    async start(controller) {
      controller.enqueue(new TextEncoder().encode(contents[0]));
      await wait(3000)
      controller.enqueue(new TextEncoder().encode(contents[1]));
      controller.close();
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

function wait(timeout: number) {
  return new Promise(rs => setTimeout(rs, timeout))
}

