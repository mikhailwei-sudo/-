import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ColladaLoader} from 'three/addons/loaders/ColladaLoader.js';

const canvas=document.getElementById('canvas');
const status=document.getElementById('status');
const details=document.getElementById('details');
const buttons=document.getElementById('exhibitButtons');
const scene=new THREE.Scene();
scene.background=new THREE.Color('#101d17');
scene.fog=new THREE.Fog('#101d17',17,46);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.25;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,innerWidth<720?1.5:2));
const camera=new THREE.PerspectiveCamera(50,1,.1,90);
camera.position.set(-4,3.8,10);
const orbit=new OrbitControls(camera,canvas);
orbit.enableDamping=true;
orbit.enablePan=false;
orbit.minDistance=3.4;
orbit.maxDistance=18;
orbit.maxPolarAngle=Math.PI*.53;
orbit.target.set(-3.6,1.8,-.7);
scene.add(new THREE.HemisphereLight(0xfff8e8,0x34473a,2.1));
const key=new THREE.DirectionalLight(0xffe3ad,3.1);key.position.set(-3,10,7);scene.add(key);
const fill=new THREE.PointLight(0xffe5a1,60,28);fill.position.set(4,5,3);scene.add(fill);
const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const m={floor:mat('#8c7859'),wall:mat('#213b2d'),wood:mat('#705036'),frame:mat('#bd9a62',.45,.38),glass:new THREE.MeshPhysicalMaterial({color:'#f7fff8',roughness:.08,metalness:0,transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide})};
function box(parent,w,h,d,x,y,z,material){const obj=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);obj.position.set(x,y,z);parent.add(obj);return obj;}
box(scene,24,.2,14,0,-.15,-1.2,m.floor);
box(scene,24,7,.16,0,3.3,-7.9,m.wall);
box(scene,.16,7,14,-11.8,3.3,-1.2,m.wall);
box(scene,.16,7,14,11.8,3.3,-1.2,m.wall);
for(const x of [-9,0,9]){box(scene,.17,6,.28,x,3,-7.7,m.frame);box(scene,8,.1,.35,x,6,-7.65,m.wood);}
const hallTexture=new THREE.TextureLoader().load('./assets/textures/hall/HZ116_Color.tga.jpg',t=>{t.colorSpace=THREE.SRGBColorSpace;});
hallTexture.colorSpace=THREE.SRGBColorSpace;
const wallTextureMaterial=new THREE.MeshStandardMaterial({map:hallTexture,roughness:.8,side:THREE.DoubleSide});
for(const x of [-6.6,0,6.6]) box(scene,4.8,2.6,.07,x,4,-7.75,wallTextureMaterial);
const runner=mat('#4c6048',1);box(scene,18,.025,3.1,0,0,2.1,runner);
const exhibits=[
{id:'camel',title:'Чайный караван',file:'./assets/models/camel-authentic.glb',kind:'gltf',x:-5.4,z:-1.2,
 desc:'Подлинный файл camel.glb, присланный для проекта. Оригинальная 3D-геометрия и встроенная текстура.',max:[2.4,1.8,1.75]},
{id:'crate',title:'Торговые ящики',file:'./assets/models/crate/model.dae',kind:'dae',x:-1.8,z:-1.2,
 desc:'Объёмная модель из low-poly-wooden-crate.zip. Применяется исходная текстура деревянной поверхности.',max:[2.05,1.8,1.75]},
{id:'teaset',title:'Китайский чайный сервиз',file:'./assets/models/teaset.glb',kind:'gltf',x:1.8,z:-1.2,
 desc:'Настоящая модель teaset.glb из free-3d-tea-set.zip, включая встроенные материалы.',max:[2.15,1.85,1.8]},
{id:'samovar',title:'Русский самовар',file:'./assets/models/samovar-authentic.glb',kind:'gltf',x:5.4,z:-1.2,
 desc:'Подлинный samovar.glb с исходными картами материала, загружаемый вместо старой схематичной фигуры.',max:[2.0,1.9,1.75]}
];
for(const [i,e] of exhibits.entries()){
 const g=new THREE.Group();g.position.set(e.x,0,e.z);scene.add(g);
 box(g,2.75,.83,2.55,0,.415,0,mat('#d9ccb0'));
 box(g,2.79,.09,2.59,0,.875,0,m.frame);
 box(g,2.42,.055,2.1,0,.95,0,mat('#60765c'));
 const gh=2.1,top=.93+gh;
 for(const x of [-1.32,1.32])for(const z of [-1.19,1.19])box(g,.046,gh,.046,x,.93+gh/2,z,m.frame);
 box(g,2.78,.07,2.55,0,top,0,m.frame);
 box(g,2.68,gh,.015,0,.93+gh/2,1.19,m.glass);
 box(g,2.68,gh,.015,0,.93+gh/2,-1.19,m.glass);
 box(g,.015,gh,2.45,1.31,.93+gh/2,0,m.glass);
 box(g,.015,gh,2.45,-1.31,.93+gh/2,0,m.glass);
 const holder=new THREE.Group();holder.position.y=1;g.add(holder);e.holder=holder;
 e.status='loading';
 e.index=i;
 const light=new THREE.SpotLight(0xffefc9,25,7,Math.PI/3,.65);light.position.set(0,2.9,.4);g.add(light);light.target=holder;g.add(light.target);
}
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
new ResizeObserver(resize).observe(canvas);resize();
let selected=0;
let destination=new THREE.Vector3(-5.4+2.1,3.05,6.1);
let desiredTarget=new THREE.Vector3(-5.4,1.85,-1.2);
function drawButtons(){
 buttons.replaceChildren();
 for(const [i,e] of exhibits.entries()){
  const b=document.createElement('button');b.className='exhibit-btn'+(i===selected?' selected':'');
  const name=document.createElement('strong');name.textContent=(i+1).toString().padStart(2,'0')+' · '+e.title;
  const statusText=document.createElement('small');statusText.textContent=({loading:'Загрузка исходной 3D-модели…',ready:'Настоящая 3D-модель загружена',failed:'Ошибка загрузки исходного файла'})[e.status];
  b.append(name,statusText);b.addEventListener('click',()=>select(i));buttons.append(b);
 }
 status.textContent='Загружено '+exhibits.filter(e=>e.status==='ready').length+' из '+exhibits.length+' моделей';
}
function select(i){
 selected=i;const e=exhibits[i];
 destination.set(e.x+2.45,3.3,e.z+7.6);
 desiredTarget.set(e.x,1.92,e.z);
 document.getElementById('detailTitle').textContent=e.title;
 document.getElementById('detailBody').textContent=e.desc;
 drawButtons();
}
function fitIntoCase(obj,e){
 obj.updateMatrixWorld(true);
 const bound=new THREE.Box3().setFromObject(obj);
 const size=bound.getSize(new THREE.Vector3());
 if(![size.x,size.y,size.z].every(n=>Number.isFinite(n)&&n>1e-7))throw Error('Invalid dimensions for '+e.id);
 obj.scale.multiplyScalar(Math.min(e.max[0]/size.x,e.max[1]/size.y,e.max[2]/size.z));
 obj.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(obj);
 const ctr=bounds.getCenter(new THREE.Vector3());
 obj.position.x-=ctr.x;obj.position.y-=bounds.min.y;obj.position.z-=ctr.z;
}
function fixMaterials(obj,e){
 if(e.id==='crate'){
   const tex=new THREE.TextureLoader().load('./assets/models/crate/textures/DefaultMaterial_albedo.jpg');
   tex.colorSpace=THREE.SRGBColorSpace;
   obj.traverse(o=>{if(o.isMesh)o.material=new THREE.MeshStandardMaterial({map:tex,roughness:.75,side:THREE.DoubleSide})});
 }else obj.traverse(o=>{if(!o.isMesh)return;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m?.map)m.map.colorSpace=THREE.SRGBColorSpace;if(m?.emissiveMap)m.emissiveMap.colorSpace=THREE.SRGBColorSpace;}});
}
const gltfLoader=new GLTFLoader();
const colladaLoader=new ColladaLoader();
async function load(e){
 try{
  const result=e.kind==='gltf'?await gltfLoader.loadAsync(e.file):await colladaLoader.loadAsync(e.file);
  const obj=e.kind==='gltf'?result.scene:result.scene;
  fixMaterials(obj,e);fitIntoCase(obj,e);e.holder.add(obj);e.status='ready';
 }catch(err){e.status='failed';console.error('Museum asset failed:',e.file,err);}
 drawButtons();
}
document.getElementById('reload').addEventListener('click',()=>location.reload());
select(0);
Promise.all(exhibits.map(load));
let previous=performance.now();
function frame(t){requestAnimationFrame(frame);const dt=Math.min(.06,(t-previous)/1000);previous=t;const k=1-Math.exp(-3.4*dt);camera.position.lerp(destination,k);orbit.target.lerp(desiredTarget,k);orbit.update();renderer.render(scene,camera);}
requestAnimationFrame(frame);
