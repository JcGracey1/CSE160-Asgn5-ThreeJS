import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { drawCandlestick } from './Candlestick.js';
import { makeCandleRing } from './Candlestick.js';
import { drawFirefly } from './Firefly.js';


const objLoaderFigure = new OBJLoader();
const objLoaderTree = new OBJLoader();
objLoaderFigure.setPath('assets/');
objLoaderTree.setPath('assets/');
const mtlLoader = new MTLLoader();
mtlLoader.setPath('assets/');
function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
  renderer.setSize(window.innerWidth, window.innerHeight);

	const fov = 50;
	const aspect = window.innerWidth / window.innerHeight; 
	const near = 0.1;
	const far = 10;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set(0, 2, 2);

  // Add OrbitControls: passing the camera and the canvas element.
  const controls = new OrbitControls(camera, canvas);
  // Optionally, enable damping (requires calling controls.update() in the render loop)
  controls.enableDamping = true;
  controls.minPolarAngle = 0;             // Look directly upward is allowed.
  controls.maxPolarAngle = (Math.PI / 2)-.01;     // Prevent the camera from going below the horizontal.


	const scene = new THREE.Scene();

  drawTreeCircle(scene, 0, 0, 0, 10);

  // sky box:
  {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'assets/pos-x.png',
      'assets/neg-x.png',
      'assets/pos-y.png',
      'assets/neg-y.png',
      'assets/pos-z.png',
      'assets/neg-z.png',
    ]);
    scene.background = texture;
  }

  // fog:
  {
    const color = 'lightblue';
    const near = .5;
    const far = 4;
    scene.fog = new THREE.Fog(color, near, far);
  }

  // ground plane:
  // Create a ground plane
  const texture = new THREE.TextureLoader().load('assets/dirt.jpg', function(texture){
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5); // Adjust tiling to prevent stretching
    texture.anisotropy = 16; // Improves texture quality
  });
  {
    const planeSize = 5;
  
    // Create the geometry for the ground plane.
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  
    // Create a plain MeshPhongMaterial with a solid color.
    const planeMat = new THREE.MeshStandardMaterial({
      map: texture, 
      side: THREE.DoubleSide,
    });
  
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = -Math.PI / 2; // rotate to lie flat
    mesh.position.y = 0;
    scene.add(mesh);
  }
  

  // Lighting:
  // directional light
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 4, 4);
  scene.add(light);

  // add ambient light and hemisphere light
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  const skyColor = 0x698596;  // light blue
  const groundColor = 0x5b4b39;  // brownish orange
  const hemLight = new THREE.HemisphereLight(skyColor, groundColor, 2);
  scene.add(hemLight);

  //drawCandlestick(scene, 0,0,1);
  makeCandleRing(scene, 0,.2,0, 10);

  drawFirefly(scene, 0, .3, 1.3);

  // put figure in center of the ring
  mtlLoader.load('figure.mtl', (materials) => {
    materials.preload();
    objLoaderFigure.setMaterials(materials);
    
    objLoaderFigure.load('figure.obj', (object) => {
      object.position.set(0, 0, 0);
      scene.add(object);

      objBillboard(object, camera);
    });
  });


  function render(time) {
      time *= 0.001;  // convert time to seconds
      
      controls.update();
      
      renderer.render(scene, camera);
      
      requestAnimationFrame(render);
    }
  
  requestAnimationFrame(render);


}

function drawTreeCircle(scene, x, y, z, numTrees, radius = 1) {
  mtlLoader.load('Tree1.mtl', (materials) => {
      materials.preload();

      objLoaderTree.setMaterials(materials);
      objLoaderTree.load(
          'Tree1.obj',
          (object) => {
              object.scale.set(0.1, 0.1, 0.1);

              for (let i = 0; i < numTrees; i++) {
                  const angle = (i / numTrees) * Math.PI * 2; // Evenly space trees around the circle
                  const treeX = x + Math.cos(angle) * radius;
                  const treeZ = z + Math.sin(angle) * radius;

                  // Clone the tree so we don't reload the model each time
                  const treeClone = object.clone();
                  treeClone.position.set(treeX, y, treeZ);

                  scene.add(treeClone);
              }
          },
          (xhr) => {
              console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
              console.error('An error happened', error);
          }
      );
  });
}

function objBillboard(obj, camera) {
  function updateBillboard() {
    requestAnimationFrame(updateBillboard);

    let camPos = camera.position.clone();
    camPos.y = obj.position.y; // Keep Y-axis fixed
    obj.lookAt(camPos);
  }
  updateBillboard();
}



main();
