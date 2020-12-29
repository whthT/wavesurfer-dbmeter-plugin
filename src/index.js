import WaveSurfer from "wavesurfer.js";
import DBMeterPlugin from "./lib/WaveSurferDBMeter";

window.addEventListener("DOMContentLoaded", () => {
  window.wavesurfer = WaveSurfer.create({
    container: document.getElementById("wavesurfer"),
    backend: "MediaElement",
    splitChannels: true,
    plugins: [DBMeterPlugin.create()],
  });
  window.wavesurfer.load("/bllt_impact_01.wav");

  document.getElementById("playPause").onclick = () => {
    window.wavesurfer.playPause();
  };

  window.wavesurfer.on("db-meter-update", (channelMaxes) => {
    console.log(channelMaxes);
  });

  Array.from(document.querySelectorAll(".links > a")).forEach((el) => {
    el.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      wavesurfer.load(el.getAttribute("href"));
    };
  });

  console.log(window.wavesurfer);
});