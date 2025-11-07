import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//para poder manipularlo con el mouse
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

//defino el control
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);


 const loader = new GLTFLoader();
      loader.load(
        'models/skeleton.glb',
        function (gltf) {
          scene.add(gltf.scene);
          gltf.scene.scale.set(1, 1, 1);
        },
        undefined,
        function (error) {
          console.error('Error al cargar modelo:', error);
        }
      );

 camera.position.z = 5;

 // Añadir luz ambiental (iluminación básica general)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Añadir luz direccional (simula el sol)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5); // Posiciona de la luz
scene.add(directionalLight)

  function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        
      }
      animate();




