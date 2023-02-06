import QRCode from "qrcode";
import express from 'express'
import cors from 'cors'
import shelljs from "shelljs";
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()

const server = express()
server.use(cors())
server.use(express.json());

server.post('/add', (req, res) => {
  const { username, password, ip } = req.body
  try {
    shelljs.exec(`ffmpeg -v verbose  -i "rtsp://${username}:${password}@${ip}:554/cam/realmonitor?channel=1&subtype=0" -vf scale=1920:1080  -vcodec libx264 -r 25 -b:v 1000000 -crf 31 -acodec aac  -sc_threshold 0 -f hls  -hls_time 5  -segment_time 5 -hls_list_size 5 "public/stream.m3u8"`,
      function (code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
      })
    res.status(200).send({ url: `${process.env.BASE_URL}/stream.m3u8` })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error')
  }
})

server.delete('/delete', async (req, res) => {
  try {
    let files = fs.readdirSync('public')
    for (let i in files) {
      fs.unlinkSync(`public/${files[i]}`)
    }
    res.status(200).send('Apagado com sucesso!')
  } catch (error) {
    console.log(error)
    res.status(500).send('Error')
  }
})

server.use(express.static('public'));

server.listen(1337, () => console.log("Running"));