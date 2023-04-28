import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import nebula from '../../dist/nebula.jpg';
import stars from '../../dist/stars.jpg';

const monkey = new URL('../../dist/monkey.863d8361.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const orbit = new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

camera.position.set(-10, 30, 30);
orbit.update();

//representa el objeto como un cubo
const BoxGeometry = new THREE.BoxGeometry();
const BoxMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( BoxGeometry, BoxMaterial );
scene.add( cube );

//representa la superficie del objeto
const planeGeometry = new THREE.PlaneGeometry( 30, 30);
const planeMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

//representa el objeto como una esfera
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial( {
    color: 0x0000ff,
    wireframe: false});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

//representa la luz del objeto
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
//representa la direccion de la luz del objeto
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// //representa la posicion de la luz del objeto
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//scene.fog = new THREE.Fog(0xffffff, 0, 200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// renderer.setClearColor(0xffea00);

const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial( { 
    // color: 0x00ff00,
    // map: textureLoader.load(nebula)
} );
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
];
const cube2 = new THREE.Mesh( box2Geometry, box2MultiMaterial );
scene.add( cube2 );
cube2.position.set(0, 15, 10);
//cube2.material.map = textureLoader.load(nebula);

const plane2Geometry = new THREE.PlaneGeometry( 10, 10, 10, 10 );
const plane2Material = new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

const sphere2Geometry = new THREE.SphereGeometry(4);

// const vShader = `
// void main() {
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;

// const fShader = `
//     void main() {
//         gl_FragColor = vec4(0.5, 0.5, 1.0 , 1.0);
// }
// `;



const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const assetLoader = new GLTFLoader();

assetLoader.load(monkey.href, function(gltf){
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 4, 10);
}, undefined, function(error){
    console.error(error);
});

const gui = new dat.GUI();

const options = {
    sphereColor: "#ffea00",
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

gui.addColor(options, "sphereColor").onChange(function(e){
    sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange(function(e){
    sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);

gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
cube2.name = 'theBox';

function animate(time) {
    cube.rotation.x = time / 1000;
    cube.rotation.y = time / 1000;
    
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step)) ;

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    for(let i = 0; i < intersects.length; i++){
        if(intersects[i].object.id === sphereId)
            intersects[i].object.material.color.set(0xff0000);

        if(intersects[i].object.name === 'theBox'){
            intersects[i].object.rotation.x = time / 1000;
            intersects[i].object.rotation.y = time / 1000;
        }
            
        }

    plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;
    
    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});