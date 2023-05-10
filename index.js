import express from 'express'
import cors from 'cors'
import path, { dirname } from 'node:path'
import { fileURLToPath } from "url";
import VideoStream from "rtsp-stream-hls/src/VideoStream.js";
import * as dotenv from 'dotenv'
dotenv.config()

const server = express()
const __dirname = dirname(fileURLToPath(import.meta.url));
server.use(cors())
server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));

server.post('/start', (req, res) => {
  const { url } = req.body

  const options = {
    url: url,
    segmentFolder: __dirname + '/public/segment',  // Diretório onde estará o arquivo .m3u8 e seus segmentos
    ffmpegOptions: {
      '-hls_time': '7', // Tamanho em segundos de cada segmento
      'ultrafast': undefined // single option other than the key-value type, it can be set by setting the value to undefined.
    }
  }
  const stream = new VideoStream(options);
  stream.start();
  res.status(200).json({ url: `${process.env.BASE_URL}/segment/stream.m3u8`, stream: stream })

})

server.post('/stop', (req, res) => {
  const { stream } = req.body
  try {
    stream.stop()
    res.status(200).json({ success: 'The conversion has been stopped!' })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

server.listen(1337, () => console.log("Running"));