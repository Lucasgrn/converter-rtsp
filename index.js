import express from 'express';
import rtspRelay from 'rtsp-relay'
import cors from 'cors'
const app = express();

const { proxy, scriptUrl } = rtspRelay(app);
app.use(cors())
app.ws('/api/stream/:camera', (ws, req) => {
  return (
    proxy({
      url: `rtsp://${req.params.camera}/cam/realmonitor?channel=1&subtype=0`,
    })(ws)
  )
}
);

app.get('/:camera', (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'wss://' + location.host + '/api/stream/${req.params.camera}',
      canvas: document.getElementById('canvas')
    });
  </script>
`),
);

app.listen(2000);
