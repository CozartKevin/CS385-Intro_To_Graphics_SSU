//Initial Scene layout and movement leveraged from: https://threejs.org/examples/misc_controls_pointerlock.html 
//File Structure based off Three.js Tutorial Crash Course - 2021 by Chris Courses (https://www.youtube.com/watch?v=YK1Sw_hnm58)
const skyboxImage = 'purplenebula';

//Javascript Imports
import * as THREE from 'three';  //imports THREE.js
import { PointerLockControls } from './PointerLockControls.js'; //imports PointerLockControls.js

//Scene setup
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0xff00e4 );
//scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
let autoRotate = true;

const renderer = new THREE.WebGLRenderer( { alpha: true, anteialias: true});
  let mainCamera, controls, skyboxGeo, skybox;
  
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

   //Main Camera setup  Generate and set default position
   mainCamera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 30000);
   //mainCamera.position.y = 10;
   mainCamera.position.z = 5;
     

     

    //Setup Textured Skybox  Using this tutorial: https://codinhood.com/post/create-skybox-with-threejs
    const materialArray = createMaterialArray(skyboxImage);
    skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
  
      //Setup Renderer Size and link a canvas to the body tags in final.html
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.id = "canvas";
        document.body.appendChild(renderer.domElement);

      //Cube Setup:  This is a test cube to verify I have things setup correctly 
      const cubeGeometry = new THREE.BoxGeometry();
      const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff, side: THREE.DoubleSide});
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.z = -5;
    
      //cube.position.y = 1;
      scene.add(cube);

    //Plane Setup:  This is intended to be the floor of my walkable play area.
    const planeGeometry = new THREE.PlaneGeometry( 1, 1 );
    const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xff00f, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    //plane.position.set(10,10,0); 
    plane.position.z = -10;
    plane.position.y = -10;
    plane.scale.x = 100;
    plane.scale.y = 10;
    plane.scale.z = 100;
    scene.add(plane);

      const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75);
      light.position.set(0.5,1,0.75);
      scene.add(light);
      
      controls = new PointerLockControls( mainCamera, document.body);
      
    
      const onKeyDown = function ( event ) {

          switch ( event.code ) {

              case 'ArrowUp':
              case 'KeyW':
                  moveForward = true;
                  break;

              case 'ArrowLeft':
              case 'KeyA':
                  moveLeft = true;
                  break;

              case 'ArrowDown':
              case 'KeyS':
                  moveBackward = true;
                  break;

              case 'ArrowRight':
              case 'KeyD':
                  moveRight = true;
                  break;

              case 'Space':
                  if ( canJump === true ) velocity.y += 350;
                  canJump = false;
                  break;

          }

      };

      const onKeyUp = function ( event ) {

          switch ( event.code ) {

              case 'ArrowUp':
              case 'KeyW':
                  moveForward = false;
                  break;

              case 'ArrowLeft':
              case 'KeyA':
                  moveLeft = false;
                  break;

              case 'ArrowDown':
              case 'KeyS':
                  moveBackward = false;
                  break;

              case 'ArrowRight':
              case 'KeyD':
                  moveRight = false;
                  break;

          }

      };

      
      document.addEventListener( 'keydown', onKeyDown );
      document.addEventListener( 'keyup', onKeyUp );

    //Verifying via console log that these items are being created properly. 
    console.log(scene);
    console.log(mainCamera);
    console.log(renderer);
    console.log(cubeGeometry);
    console.log(cubeMaterial);
    console.log(cube);
    console.log(planeGeometry);
    console.log(planeMaterial);
    console.log(plane);
    console.log(skybox);
     // renderer.render(scene,mainCamera);
     window.requestAnimationFrame(animate);
  }

  function animate(){

    //skybox stuff NOT WORKING...
    skybox.rotation.x += 0.00015;
    skybox.rotation.y += 0.00015;
    renderer.render(scene, mainCamera);
    window.requestAnimationFrame(animate);


   // window.requestAnimationFrame(animate);
    renderer.render(scene,mainCamera);
  
}

  function onWindowResize() {
   
    mainCamera.aspect = window.innerWidth / window.innerHeight;
  
    mainCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
  