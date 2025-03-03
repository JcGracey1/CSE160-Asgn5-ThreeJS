import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
    renderer.setSize(window.innerWidth, window.innerHeight);

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

	const scene = new THREE.Scene();

    const loader = new OBJLoader();

    loader.load(
        'Tree1.obj', // path to the OBJ file
        function (object) {
            object.traverse(function (child) {
                if (child.isMesh) {
                  // Replace with MeshPhongMaterial to react to lights.
                  child.material = new THREE.MeshPhongMaterial({color: 0x44aa88});
                }
              });
            object.scale.set(0.1, 0.1, 0.1);
            object.position.set(0, -.5, 0);
          // Called when the resource is loaded
          scene.add(object);
        },
        function (xhr) {
          // Called while loading is progressing
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
          // Called when loading has errors
          console.error('An error happened', error);
        }
    );

    // Lighting:
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

	// const boxWidth = 1;
	// const boxHeight = 1;
	// const boxDepth = 1;
	// const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	// const material = new THREE.MeshPhongMaterial( { color: 0x44aa88 } ); // greenish blue

	// const cube = new THREE.Mesh( geometry, material );
	// scene.add( cube );

    function render(time) {
        time *= 0.001;  // convert time to seconds
       
        // cube.rotation.x = time;
        // cube.rotation.y = time;
       
        renderer.render(scene, camera);
       
        requestAnimationFrame(render);
      }
    
    requestAnimationFrame(render);

	//renderer.render( scene, camera );

}


main();
