import './App.css'
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function App() {
  const myDivRef = useRef(null);


useEffect(()=>{
  if (!myDivRef.current) return;

  //creo la escena
    const scene = new THREE.Scene();

  //creo la camara
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 5;

 
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

   //defino modelo
  let modelo = null;

  //Cargo el modelo
  const loader = new GLTFLoader();
  let mixer;//defino mixer para animaciones
      loader.load(
        'models/phone2ani.glb',
        function (gltf) {
          modelo = gltf.scene;
          scene.add(modelo);
          gltf.scene.scale.set(1, 1, 1);

           if (gltf.animations && gltf.animations.length > 0) {
              console.log("Animaciones encontradas:", gltf.animations.map(a => a.name));
            
              mixer = new THREE.AnimationMixer(modelo);
            
              gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip).play();
                action.setLoop(THREE.LoopOnce);  
                action.clampWhenFinished = true; 
              });
         }
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

   const clock = new THREE.Clock();

   function animate() {
    requestAnimationFrame(animate);

        //animaciones
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
        //hago que rote el modelo
        if (modelo) {
        modelo.rotation.y += 0.003;
      }
        controls.update();
        renderer.render(scene, camera);
   }
   animate();

  


},[])

  return (
    <div className='contenedor'>
       <div className='objeto' ref={myDivRef}></div>
    </div>
  )
}

export default App
