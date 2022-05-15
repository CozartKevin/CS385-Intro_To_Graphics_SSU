var USE_WIREFRAME = false;
  //Initial Scene layout and movement leveraged from: https://threejs.org/examples/misc_controls_pointerlock.html 
  //File Structure based off Three.js Tutorial Crash Course - 2021 by Chris Courses (https://www.youtube.com/watch?v=YK1Sw_hnm58)
  //Very informative video for setting up movement and ground plane: https://www.youtube.com/watch?v=UUilwGxIj_Q by xSaucecode
  const skyboxImage = 'purplenebula';

  //Javascript Imports
  import * as THREE from 'three';  //imports THREE.js
  import { PointerLockControls } from './PointerLockControls.js'; //imports PointerLockControls.js


  //Scene setup
  const scene = new THREE.Scene();
  //scene.background = new THREE.Color(0xff00e4 );
  //scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
  let autoRotate = true;

  var renderer = new THREE.WebGLRenderer( { alpha: true, anteialias: true});
 

    let mainCamera, controls, skyboxGeo, skybox, ambientLight, hemispherLight, light;
    var cube, walkablePlane, walkableSphere; 
    
    var keyboard = {};
    var player = { height:1.8, speed:0.02, moveSpeed: 0.02, turnSpeed:Math.PI*0.02 };
    const objects = [];
    
    let raycaster;
    
    let moveForward, moveBackward, moveLeft, moveRight, canJump = false;
    
    let prevTime = performance.now();
    
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const vertex  = new THREE.Vector3();
    const color = new THREE.Color();
     
    init();
    animate();
    
    function init(){
      
      scene.add(new THREE.AxesHelper(5));
     
      
    
     
    //Main Camera setup  Generate and set default position
    mainCamera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 30000);
    mainCamera.position.set(0,player.height,-5);
    mainCamera.lookAt(new THREE.Vector3(0,0,0));
      
     //Controls setup
         
     controls = new PointerLockControls( mainCamera, renderer.domElement);
     controls.addEventListener('lock', () => (menuPanel.style.display = 'none'));
      controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'));
     scene.add(controls.getObject());

     raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  



      //Setup Textured Skybox  Using this tutorial: https://codinhood.com/post/create-skybox-with-threejs
      const materialArray = createMaterialArray(skyboxImage);
      skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
      skybox = new THREE.Mesh(skyboxGeo, materialArray);
      scene.add(skybox);
    
        //Setup Renderer Size and link a canvas to the body tags in final.html
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.domElement.id = "canvas";
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.BasicShadowMap;
          document.body.appendChild(renderer.domElement);

      //Setup Lighting
      ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);

      hemispherLight = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75);
      hemispherLight.position.set(0.5,1,0.75);
     //scene.add(hemispherLight);

      light = new THREE.PointLight(0xffffff, 0.8, 18);
	    light.position.set(-3,6,-3);
	    light.castShadow = true;
	    // Will not light anything closer than 0.1 units or further than 25 units
	    light.shadow.camera.near = 0.1;
	    light.shadow.camera.far = 25;
	    scene.add(light);


    //Object Setup
        //Cube Setup:  This is a test cube to verify I have things setup correctly 
        const normalMaterial = new THREE.MeshNormalMaterial()
        const phongMaterial = new THREE.MeshPhongMaterial()
       
        cube =new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          new THREE.MeshPhongMaterial({color:0x78eaf5, wireframe:USE_WIREFRAME})
        );
        //cube.position.z = 5;
        cube.receiveShadow = true;
        cube.castShadow = true;
        cube.position.y += 1;
        scene.add(cube);  //reference cube

      //Plane Setup:  This is intended to be the floor of my walkable play area.
    // const planeGeometry = new THREE.PlaneGeometry( 1, 1 );
    // const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xff00f, side: THREE.DoubleSide} );
    // const plane = new THREE.Mesh( planeGeometry, planeMaterial );

    //second attempt at planar walkable world. 
      walkablePlane = new THREE.Mesh( 
        new THREE.PlaneGeometry(50,50, 50, 50),
        new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})
      );
      walkablePlane.rotation.x -= Math.PI /2; 
      walkablePlane.recieveShadow = true;
      scene.add(walkablePlane);



      walkableSphere = new THREE.Mesh( 
        new THREE.SphereGeometry(50, 50, 50 ),
        new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})
      );
     //w walkableSphere.rotation.x -= Math.PI /2; 
      walkableSphere.position.y -= 50;
      walkableSphere.recieveShadow = true;
      //scene.add(walkableSphere);

      //Attempt at walkable spherical world
    // const sphereGeometry = new THREE.SphereGeometry(150,320,150);
    // const sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00});
    // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      //sphere.position.z = -100;
    // sphere.position.y = -180;
      //scene.add(sphere);

      //attempt at walkable planar world
      //plane.position.set(10,10,0); 
      //plane.position.z = -10;aw
      //plane.position.y = -10;
      //plane.scale.x = 100;
      //plane.scale.y = 10;
      //plane.scale.z = 100;
    // scene.add(plane);

      
     

      

      //Verifying via console log that these items are being created properly. 
      console.log(scene);
      console.log(mainCamera);
      console.log(renderer);
      console.log(cube);
    //  console.log(planeGeometry);
    // console.log(planeMaterial);
    // console.log(plane);
      console.log(skybox);
      // renderer.render(scene,mainCamera);
      window.requestAnimationFrame(animate);
    }

    function animate(){
      //Movement by xSauceCode Taken from Youtube and his github: https://github.com/saucecode/threejs-demos/blob/master/02_FloorAndMovement/demo.js
      if(keyboard[87]){ // W key
       // mainCamera.position.x -= Math.sin(mainCamera.rotation.y) * player.speed;
      //  mainCamera.position.z -= -Math.cos(mainCamera.rotation.y) * player.speed;
      controls.moveForward(player.moveSpeed);
      }
      if(keyboard[83]){ // S key
       // mainCamera.position.x += Math.sin(mainCamera.rotation.y) * player.speed;
      //  mainCamera.position.z += -Math.cos(mainCamera.rotation.y) * player.speed;
      controls.moveForward(-player.moveSpeed);
      }
      if(keyboard[65]){ // A key
      //  mainCamera.position.x += Math.sin(mainCamera.rotation.y + Math.PI/2) * player.speed;
      //  mainCamera.position.z += -Math.cos(mainCamera.rotation.y + Math.PI/2) * player.speed;
      controls.moveRight(-player.moveSpeed);
      }
      if(keyboard[68]){ // D key
       // mainCamera.position.x += Math.sin(mainCamera.rotation.y - Math.PI/2) * player.speed;
      //  mainCamera.position.z += -Math.cos(mainCamera.rotation.y - Math.PI/2) * player.speed;
      controls.moveRight(player.moveSpeed);
      }
      
      if(keyboard[37]){ // left arrow key
        mainCamera.rotation.y -= player.turnSpeed;
      }
      if(keyboard[39]){ // right arrow key
        mainCamera.rotation.y += player.turnSpeed;
      }
    
    
      cube.rotation.x += 0.0025;
      cube.rotation.y += 0.005;

      //skybox stuff IS NOW WORKING
      skybox.rotation.x += 0.00015;
      skybox.rotation.y += 0.00015;
      renderer.render(scene, mainCamera);
      window.requestAnimationFrame(animate);

    




    // window.requestAnimationFrame(animate);
    // renderer.render(scene,mainCamera);
    
  }

 //   function onWindowResize() {
    
   //   mainCamera.aspect = window.innerWidth / window.innerHeight;
    
  //    mainCamera.updateProjectionMatrix();
    //  renderer.setSize(window.innerWidth, window.innerHeight);
   // }

    window.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
      mainCamera.aspect = window.innerWidth / window.innerHeight
      mainCamera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }


    function createPathStrings(filename) {
      const basePath = "./js/skybox/";
      const baseFilename = basePath + filename;
      const fileType = ".png";
      const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
      const pathStings = sides.map(side => {
        return baseFilename + "_" + side + fileType;
      });
    
      return pathStings;
    }

  function createMaterialArray(filename) {
      const skyboxImagepaths = createPathStrings(filename);
      const materialArray = skyboxImagepaths.map(image => {
        let texture = new THREE.TextureLoader().load(image);
        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // <---
      });
      return materialArray;
    }
    
    function keyDown(event){
      keyboard[event.keyCode] = true;
    }

    function keyUp(event){
      keyboard[event.keyCode] = false;
    }

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  
 

  const menuPanel = document.getElementById('menuPanel');
  const startButton = document.getElementById('startButton');

  startButton.addEventListener(
      'click',
      function () {
          controls.lock()
      },
      false
  )

