import './App.css'
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Mono from './components/Mono';

function App() {
  const myDivRef = useRef(null);


useEffect(()=>{
  if (!myDivRef.current) return;

  //creo la escena
    const scene = new THREE.Scene();

  //creo la camara
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )
  camera.position.z = 5;
 
  //renderizo
  const renderer = new THREE.WebGLRenderer();

  //defino el control
  const controls = new OrbitControls(camera, renderer.domElement)

  //le agrego el tamaño
  renderer.setSize( window.innerWidth, window.innerHeight );

  // agrego el objecto a mi div
   if (myDivRef.current) {
    myDivRef.current.appendChild(renderer.domElement);
   }   

  //Cargo el modelo
  const loader = new GLTFLoader();
      loader.load(
        'models/Monkey.glb',
        function (gltf) {
          scene.add(gltf.scene);
          gltf.scene.scale.set(1, 1, 1);
        },
        undefined,
        function (error) {
          console.error('Error al cargar modelo:', error);
        }
      );

   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
   //le agrego la luz a la escene
   scene.add(ambientLight);

   // Añadir luz direccional (simula el sol)
   const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
   directionalLight.position.set(5, 10, 7.5); // Posiciona de la luz
    //le agrego la luz a la escene
   scene.add(directionalLight)

   function animate() {
    requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
   }
   animate();

  


},[])

  return (
    <div className='contenedor'>
       <div>
         <Mono />
       </div>
    </div>
  )
}

export default App
