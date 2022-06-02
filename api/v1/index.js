const express = require("express");
const router = express.Router();
const ytdl = require("ytdl-core");

router.get("/", (req, res) => {
  res.send("Welcome to API V1");
});
router.post("/getInfo/:id", async (req, res) => {
  const { id } = req.params;
  const info = await ytdl.getInfo(id);
  const result = {
    title: info.title,
    duration: (info.length_seconds / 60).toFixed(2) + " min",
    description: info.description,
    videoFormats: info.formats
      .filter((format) => format.hasVideo === true)
      .filter((format) => format.hasAudio === true)
      .filter((format) => format.container === "mp4")
      .sort((a, b) => {
        const aQuality = a.qualityLabel.replace(/p$/, "");
        const bQuality = b.qualityLabel.replace(/p$/, "");
        return Number(bQuality) - Number(aQuality);
      }),
    audioFormats: info.formats
      .filter((format) => format.hasVideo === false)
      .filter((format) => format.hasAudio === true)
      .sort((a, b) => {
        const aBitrate = a.audioBitrate;
        const bBitrate = b.audioBitrate;
        return Number(bBitrate) - Number(aBitrate);
      }),
  };
  res.send(result);
});
router.post("/download/:id/:itag", (req, res) => {
  const { id, itag } = req.params;
  const video = ytdl(id, {
    format: itag,
    quality: "highest",
  });
  res.setHeader("Content-disposition", "attachment");
  video.pipe(res);
});

module.exports = router;
