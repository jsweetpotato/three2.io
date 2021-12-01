class App{
  constructor() {
    const divContainer = document.querySelector('#webgl-container');
    this._divContainer = divContainer;

    const renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupVideo();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.3,
      1000
    );
    camera.position.z = 1.5;
    this._camera = camera;
    this._scene.add(camera);
  }

  _setupLight() {
    const color = [0xB6DFF3, 0xF5CECF];
    const intensity = 1;
    const light = new THREE.DirectionalLight(color[0], intensity);
    const light2 = new THREE.DirectionalLight(color[2], intensity);
    light.position.set(-2, 3, 4);
    light2.position.set(2, -2, -2);
    this._camera.add(light);
    this._camera.add(light2);
  } 
  
  _setupVideo() {
    const video = document.createElement("video");

    //웹캠 지원 확인
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        //비디오 해상도 지정
        video: {width : 720, height: 720}
      };
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        video.srcObject = stream;
        video.play();

        //three.js 비디오 텍스쳐 객체 생성
        const videoTexture = new THREE.VideoTexture(video);
        this._videoTexture = videoTexture;

        //카메라 영상에 대한 텍스쳐 맵핑 객체가 준비된 산태에서 _setupModel 메소드가 호출됨
        this._setupModel();
      }).catch(function (error) {
        console.error("카메라에 접근할 수 없습니다.", error);
      });
    } else {
      console.error("MediaDevices 인터페이스 사용 불가");
    }
  }

  _setupControls() {
    new THREE.OrbitControls(this._camera, this._divContainer);
  }

  _setupModel() {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      map: this._videoTexture,
      // color: 0x44a88
    });
    const box = new THREE.Mesh(boxGeometry, material);
    this._scene.add(box);
  }

  //버튼을 눌렀을 때 신이 변경 되어야 함
  //

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  render(time) {
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001; //second unit
  }
}

window.onload = function () {
  // alert("this project need webcam");
  new App();
}