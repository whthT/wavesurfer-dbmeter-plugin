!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.WaveSurferDBMeter=t():e.WaveSurferDBMeter=t()}(self,(function(){return(()=>{"use strict";var e={282:(e,t,r)=>{r.d(t,{default:()=>s});class s{static create(e){return{name:"dbMeter",deferInit:!(!e||!e.deferInit)&&e.deferInit,params:e,staticProps:{},instance:s}}constructor(e,t){this.params=e,this.wavesurfer=t,this.util=t.util,this.sourceNode=null,this.meterNode=null}_handleMeterProcess(e){for(var t=[],r=e.inputBuffer,s=[],o=0;o<2;o++)t[o]=r.getChannelData(o),s[o]=0;for(var i=0;i<r.length;i++)for(o=0;o<2;o++)Math.abs(t[o][i])>s[o]&&(s[o]=Math.abs(t[o][i]));this.wavesurfer.fireEvent("db-meter-update",s)}createMeterNode(e,t){var r=e.channelCount,s=t.createScriptProcessor(2048,r,r);return e.connect(s),s.connect(t.destination),s}_onReady(){var e=this.wavesurfer.backend.ac;if(this.meterNode&&(this.sourceNode.disconnect(this.meterNode),this.meterNode.disconnect(e.destination)),this.sourceNode&&"MediaElementWebAudio"!==this.wavesurfer.params.backend&&(this.sourceNode.disconnect(e.destination),this.sourceNode=null),"MediaElement"===this.wavesurfer.params.backend){var t=this.wavesurfer.backend.media;this.sourceNode=e.createMediaElementSource(t),this.sourceNode.connect(e.destination)}else"MediaElementWebAudio"===this.wavesurfer.params.backend?this.sourceNode=this.wavesurfer.backend.sourceMediaElement:(this.sourceNode=e.createBufferSource(),this.sourceNode.buffer=this.wavesurfer.backend.buffer,this.sourceNode.connect(e.destination),this.sourceNode.start());this.meterNode=this.createMeterNode(this.sourceNode,e),this.meterNode.onaudioprocess=this._handleMeterProcess.bind(this),this.wavesurfer.isPlaying()||e.suspend(),this.wavesurfer.on("play",(()=>{e.resume()})),this.wavesurfer.on("pause",(()=>{e.suspend()}))}init(){this.wavesurfer.isReady?this._onReady():this.wavesurfer.on("ready",this._onReady.bind(this))}destroy(){this.wavesurfer.un("ready",this._onReady.bind(this))}}}},t={};function r(s){if(t[s])return t[s].exports;var o=t[s]={exports:{}};return e[s](o,o.exports,r),o.exports}return r.d=(e,t)=>{for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r(282)})().default}));