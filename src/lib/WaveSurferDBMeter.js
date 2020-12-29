export default class DBMeterPlugin {
  static create(params) {
    return {
      name: "dbMeter",
      deferInit: params && params.deferInit ? params.deferInit : false,
      params: params,
      staticProps: {},
      instance: DBMeterPlugin,
    };
  }

  constructor(params, ws) {
    this.params = params;
    this.wavesurfer = ws;
    this.util = ws.util;
    this.sourceNode = null;
    this.meterNode = null;
  }

  _handleMeterProcess(audioProcessingEvent) {
    var channelData = [],
      ib = audioProcessingEvent.inputBuffer,
      channelMaxes = [],
      channelCount = 2;
    for (var i = 0; i < channelCount; i++) {
      channelData[i] = ib.getChannelData(i);
      channelMaxes[i] = 0.0;
    }

    for (var sample = 0; sample < ib.length; sample++) {
      for (i = 0; i < channelCount; i++) {
        if (Math.abs(channelData[i][sample]) > channelMaxes[i]) {
          channelMaxes[i] = Math.abs(channelData[i][sample]);
        }
      }
    }
    this.wavesurfer.fireEvent("db-meter-update", channelMaxes);
  }

  createMeterNode(sourceNode, audioCtx) {
    var c = sourceNode.channelCount;
    var meterNode = audioCtx.createScriptProcessor(2048, c, c);
    sourceNode.connect(meterNode);
    meterNode.connect(audioCtx.destination);
    return meterNode;
  }

  _onReady() {
    var audioCtx = this.wavesurfer.backend.ac;

    if (this.meterNode) {
      this.sourceNode.disconnect(this.meterNode);
      this.meterNode.disconnect(audioCtx.destination);
    }

    if (
      this.sourceNode &&
      this.wavesurfer.params.backend !== "MediaElementWebAudio"
    ) {
      this.sourceNode.disconnect(audioCtx.destination);
      this.sourceNode = null;
    }

    if (this.wavesurfer.params.backend === "MediaElement") {
      var myAudio = this.wavesurfer.backend.media;
      this.sourceNode = audioCtx.createMediaElementSource(myAudio);
      this.sourceNode.connect(audioCtx.destination);
    } else if (this.wavesurfer.params.backend === "MediaElementWebAudio") {
      this.sourceNode = this.wavesurfer.backend.sourceMediaElement;
    } else {
      this.sourceNode = audioCtx.createBufferSource();
      this.sourceNode.buffer = this.wavesurfer.backend.buffer;
      this.sourceNode.connect(audioCtx.destination);
      this.sourceNode.start();
    }

    this.meterNode = this.createMeterNode(this.sourceNode, audioCtx);

    this.meterNode.onaudioprocess = this._handleMeterProcess.bind(this);

    if (!this.wavesurfer.isPlaying()) {
      audioCtx.suspend();
    }

    this.wavesurfer.on("play", () => {
      audioCtx.resume();
    });

    this.wavesurfer.on("pause", () => {
      audioCtx.suspend();
    });
  }

  init() {
    if (this.wavesurfer.isReady) {
      this._onReady();
    } else {
      this.wavesurfer.on("ready", this._onReady.bind(this));
    }
  }

  destroy() {
    this.wavesurfer.un("ready", this._onReady.bind(this));
  }
}
