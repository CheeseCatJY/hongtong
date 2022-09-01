import *as Cesium from 'cesium';

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYTcwMDExYy1iODlmLTRkMjUtODUzOS03ZDcwYjU5ZWZjZjAiLCJpZCI6MTQxODUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjQ5ODk0OTZ9.6tTjmjTRFhM2tsP2HfO2TBSAaTPejpRuGZTQ3gVGGoQ';
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 22, 130,
  50);
global.CESIUM_BASE_URL = '/Cesium';

export default Cesium
