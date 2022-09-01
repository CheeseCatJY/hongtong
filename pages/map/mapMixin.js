import Cesium, {AmapWebMercatorTilingScheme} from "~/pages/map/cesium";

const center = [111.67803462, 36.25877929];
let distance = 5000;
export default {
  methods: {
    initViewer() {
      let layer = new Cesium.UrlTemplateImageryProvider({
        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
        tilingScheme: new AmapWebMercatorTilingScheme(),
      });

      const viewer = new Cesium.Viewer('map-box', {
        imageryProvider: layer,
        geocoder: false,
        infoBox: false,
        timeline: false,
        animation: false,
        shouldAnimate: true,
        scene3DOnly: true,
        selectionIndicator: false,
        baseLayerPicker: false,
        homeButton: false,
        fullscreenButton: false,
        navigationHelpButton: false,
        creditContainer: 'credits-box',
      });

      const camera = Cesium.Cartesian3.fromDegrees(center[0], center[1], 0);

      viewer.camera.setView({
        destination: camera,
        orientation: {
          heading: 0,
          pitch: -Cesium.Math.toRadians(30),
          roll: 0.0,
        },
      });

      viewer.scene.camera.moveBackward(distance);

      viewer.scene.sun.show = false;
      viewer.scene.skyBox.show = false;
      viewer.scene.moon.show = false;
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#020621FF');

      viewer.scene.globe.show = true;

      //光照设置
      viewer.scene.light = new Cesium.DirectionalLight({
        direction: Cesium.Cartesian3.fromDegrees(center[0] + 0.2, center[1] + 0.3, 5000),
        intensity: 3000,
        color: Cesium.Color.WHITE,
      });

      return viewer;
    },
    initBuildings() {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(111.67673462, 36.25497929, 0.0),
        model: {
          uri: '/model/hongtong.glb',
          color: Cesium.Color.fromCssColorString('#077cafff'),
          scale: 0.80
        },
      });
    },
    initLines() {
      this.$store.dispatch('meter/lineList').then(lines => {
        let lineMaterial = new Cesium.TrailLineMaterial({
          image: '/line/line0.png',
          color: Cesium.Color.fromCssColorString('#33ff39bb'),
          duration: 5000
        });
        // debugger
        const ds = new Cesium.CustomDataSource('line-ds');
        for (let {points: [start, end]} of lines) {
          start = Cesium.Cartesian3.fromDegrees(start.longitude, start.latitude, 0);
          end = Cesium.Cartesian3.fromDegrees(end.longitude, end.latitude, 0);
          // let distance = Cesium.Cartesian3.distance(start, end);
          ds.entities.add({
            name: 'line',
            polyline: {
              width: 3,
              positions: [start, end],
              material: lineMaterial,
            }
          });
        }
        this.viewer.dataSources.add(ds);
      })
    },
    rotate() {
      const viewer = this.viewer;

      let pos = Cesium.Cartesian3.fromDegrees(center[0], center[1], 0);

      // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
      let pitch = viewer.scene.camera.pitch;
      // let pitch = Cesium.Math.toRadians(-10);
      // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
      // 给定相机距离点多少距离飞行，这里取值为5000m
      let startTime = Cesium.JulianDate.fromDate(new Date());

      viewer.clock.multiplier = 1;
      viewer.clock.shouldAnimate = true;
      viewer.clock.startTime = startTime.clone();
      viewer.clock.currentTime = startTime.clone();
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
      // viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。

      // 添加实体
      let entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(center[0], center[1]),
        point: {
          color: Cesium.Color.BLUE,
          pixelSize: 0,
        }
      });

      // 相机的当前heading
      let initHeading = viewer.camera.heading;
      let rotateHandler = function () {
        // 当前已经过去的时间，单位s
        let deltaTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime,
          viewer.clock.startTime) * 100;
        let heading = Cesium.Math.toRadians(-deltaTime) + initHeading;

        let offset = new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(heading), // 水平方向的旋转角 0-360度
          -Cesium.Math.toRadians(30),// 垂直平面俯仰角 // 0-90度
          10000  // 相机距离地球球心的距离
        );
        viewer.zoomTo(entity, offset);

        if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
          viewer.clock.onTick.removeEventListener(rotateHandler);
        }
      };

      viewer.clock.onTick.addEventListener(rotateHandler);

      //监听点击事件，当点击地图时停止旋转
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((e) => {
        viewer.clock.onTick.removeEventListener(rotateHandler);
        handler.destroy();
        viewer.entities.remove(entity);
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    },
  },
  mounted() {
    global.viewer = this.viewer = this.initViewer();
    this.$bus.$emit('viewer');
    this.initBuildings();
    this.initLines();
  }
}
