import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightProbeHelper } from "three/addons/helpers/LightProbeHelper.js";
import { LightProbeGenerator } from "three/addons/lights/LightProbeGenerator.js";

const Mono = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, cubeCamera, lightProbe;

    // --- Renderer ---
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // --- Scene ---
    scene = new THREE.Scene();

    // --- Camera ---
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 30);

    // --- CubeCamera ---
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.enablePan = false;

    // --- Light Probe ---
    lightProbe = new THREE.LightProbe();
    scene.add(lightProbe);

    // --- EnvMap ---
    const genCubeUrls = (prefix, postfix) => [
      prefix + "px" + postfix,
      prefix + "nx" + postfix,
      prefix + "py" + postfix,
      prefix + "ny" + postfix,
      prefix + "pz" + postfix,
      prefix + "nz" + postfix,
    ];

   const urls = genCubeUrls(
  "https://threejs.org/examples/textures/cube/pisa/",
  ".png"
);

    new THREE.CubeTextureLoader().load(urls, async (cubeTexture) => {
      scene.background = cubeTexture;
      cubeCamera.update(renderer, scene);

      const probe = await LightProbeGenerator.fromCubeRenderTarget(
        renderer,
        cubeRenderTarget
      );

      lightProbe.copy(probe);
      scene.add(new LightProbeHelper(lightProbe, 5));

      render();
    });

    // --- Resize ---
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    };

    window.addEventListener("resize", onWindowResize);

    // --- Render ---
    function render() {
      renderer.render(scene, camera);
    }

    // --- Cleanup ---
    return () => {
      window.removeEventListener("resize", onWindowResize);
      controls.dispose();
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Mono;
