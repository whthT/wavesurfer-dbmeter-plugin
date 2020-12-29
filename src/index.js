import WaveSurfer from "wavesurfer.js";
import DBMeterPlugin from "./lib/WaveSurferDBMeter";

window.addEventListener("DOMContentLoaded", () => {
  const wavesurfer = WaveSurfer.create({
    container: document.getElementById("wavesurfer"),
    backend: "MediaElement",
    splitChannels: true,
    plugins: [DBMeterPlugin.create()],
  });
  wavesurfer.load("/4_channel_test.wav");

  document.getElementById("playPause").onclick = () => {
    wavesurfer.playPause();
  };

  wavesurfer.on("db-meter-update", (channelMaxes) => {
    console.log(channelMaxes); // [0.1297202706336975, 0.1289086937904358]
  });

  Array.from(document.querySelectorAll(".links > a")).forEach((el) => {
    el.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      wavesurfer.load(el.getAttribute("href"));
    };
  });
});
