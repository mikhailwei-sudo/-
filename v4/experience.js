// Great Tea Road immersive museum. Entirely original, schematic 3D reconstructions.
const holder=document.getElementById('renderStage');
const lobbyOverlay=document.getElementById('lobbyOverlay');
const lobbyButton=document.getElementById('enterLobby');
let THREE;
try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')}catch(err){document.getElementById('fallbackText').textContent=UI[lang].unavailable;console.warn('Three.js library could not be loaded',err)}
if(THREE){try{
const scene=new THREE.Scene();scene.background=new THREE.Color('#0c1711');scene.fog=new THREE.Fog('#17271e',12,65);
const camera=new THREE.PerspectiveCamera(54,1,.1,120);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<700?1.25:1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.55;holder.replaceChildren(renderer.domElement);
const C=(v,rough=.8,metal=0)=>new THREE.MeshStandardMaterial({color:v,roughness:rough,metalness:metal,side:THREE.DoubleSide});
const fabricCanvas=document.createElement('canvas');fabricCanvas.width=fabricCanvas.height=256;const f=fabricCanvas.getContext('2d');f.fillStyle='#aa875b';f.fillRect(0,0,256,256);f.strokeStyle='#d7ae7a44';for(let i=0;i<256;i+=6){f.beginPath();f.moveTo(i,0);f.lineTo(i,256);f.moveTo(0,i);f.lineTo(256,i);f.stroke()}const ft=new THREE.CanvasTexture(fabricCanvas);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.colorSpace=THREE.SRGBColorSpace;
let tx=document.createElement('canvas');tx.width=tx.height=256;let tc=tx.getContext('2d');tc.fillStyle='#75543a';tc.fillRect(0,0,256,256);for(let i=0;i<2300;i++){tc.fillStyle=`rgba(${95+Math.random()*65},${65+Math.random()*45},${38+Math.random()*30},${.09+Math.random()*.13})`;tc.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*4,1+Math.random()*3)}const teaMap=new THREE.CanvasTexture(tx);teaMap.colorSpace=THREE.SRGBColorSpace;
const M={wood:C('#8d613c'),woodLight:C('#b48a59'),gold:C('#c9a36a',.29,.6),metal:C('#5b6664',.4,.62),tea:new THREE.MeshStandardMaterial({color:'#a38a64',map:teaMap,roughness:1}),linen:new THREE.MeshStandardMaterial({color:'#ddd0ad',map:ft,roughness:1}),paper:C('#e8dcc0',.95),porcelain:C('#efe5d1',.21),red:C('#9d4c38'),stone:C('#a7a495'),shadow:C('#22372e'),dark:C('#192b23'),glass:new THREE.MeshPhysicalMaterial({color:'#d9f0de',metalness:0,transparent:true,opacity:.12,roughness:.08,depthWrite:false,side:THREE.DoubleSide})};
const mk=(p,geo,mat,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);p.add(m);return m};
const box=(p,w,h,d,x,y,z,m)=>mk(p,new THREE.BoxGeometry(w,h,d),m,x,y,z);
const cy=(p,rt,rb,h,x,y,z,m,seg=20)=>mk(p,new THREE.CylinderGeometry(rt,rb,h,seg),m,x,y,z);
const ball=(p,r,x,y,z,m)=>mk(p,new THREE.SphereGeometry(r,18,14),m,x,y,z);
const cone=(p,r,h,x,y,z,m)=>mk(p,new THREE.ConeGeometry(r,h,12),m,x,y,z);
const tube=(p,pts,r,m)=>{const curve=new THREE.CatmullRomCurve3(pts.map(a=>new THREE.Vector3(...a)));return mk(p,new THREE.TubeGeometry(curve,22,r,6,false),m)};
const ring=(p,r,t,x,y,z,m)=>mk(p,new THREE.TorusGeometry(r,t,10,24),m,x,y,z);
function lathe(p,pts,x,y,z,m){return mk(p,new THREE.LatheGeometry(pts.map(q=>new THREE.Vector2(...q)),32),m,x,y,z)}
function addArch(p,x){box(p,.21,3.5,.55,x-1.5,2.25,-4.75,M.woodLight);box(p,.21,3.5,.55,x+1.5,2.25,-4.75,M.woodLight);box(p,3.20,.22,.65,x,4.14,-4.75,M.gold);let curved=mk(p,new THREE.TorusGeometry(1.5,.10,8,28,Math.PI),M.gold,x,3.80,-4.73);}
function plaque(p,str,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=128;const ct=c.getContext('2d');ct.fillStyle='#e2cfab';ct.fillRect(0,0,512,128);ct.fillStyle='#243a2a';ct.textAlign='center';ct.font='bold 42px Georgia,serif';ct.fillText(str,256,81);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const o=mk(p,new THREE.PlaneGeometry(1.6,.4),new THREE.MeshBasicMaterial({map:t,transparent:true}),x,y,z);return o}
const rooms=[];const artifacts=[];const regionSpacing=19;
for(let i=0;i<4;i++){
const g=new THREE.Group();g.position.x=i*regionSpacing;scene.add(g);rooms.push(g);
const palette=['#263b30','#45392d','#2c4440','#492f2a'][i];const wall=C(palette),trim=C(['#d3b98d','#d9b786','#a4c6b8','#ddaf93'][i],.55);
box(g,14,.3,13,0,-.16,0,C('#999483',.6));box(g,14,5.5,.27,0,2.65,-5.15,wall);box(g,14,.16,13,0,5.5,0,C('#c6b69b',.85));
box(g,.24,5.2,6.6,-7,2.6,-1.82,wall);box(g,.24,5.2,6.6,7,2.6,-1.82,wall);
for(const col of [-5.2,0,5.2]){box(g,.17,4.4,.22,col,2.7,-4.98,trim);box(g,.45,.17,.32,col,5.0,-4.98,M.gold)}
box(g,13,.21,.13,0,.37,-5,trim);box(g,13,.16,.11,0,4.97,-5,trim);
for(const x of [-3.15,3.15])addArch(g,x);
// Gallery floor runners and architectural island
box(g,8,.018,2.55,0,.008,1.5,C(['#644c37','#7c573f','#315e52','#773b32'][i],.98));
for(const side of [-1,1]){box(g,.38,1.85,.65,side*5.6,.95,-.4,trim);box(g,.85,.17,1.0,side*5.6,1.92,-.4,M.gold)}
let spot1=new THREE.SpotLight(0xffebc3,45,13,Math.PI/3,.65,1.5);spot1.position.set(-2.9,4.8,1.1);spot1.target.position.set(-2.4,1.7,-1);g.add(spot1,spot1.target);let spot2=new THREE.SpotLight(0xffebc3,45,13,Math.PI/3,.65,1.5);spot2.position.set(2.9,4.8,1.1);spot2.target.position.set(2.4,1.7,-1);g.add(spot2,spot2.target);
for(let j=0;j<2;j++){const idx=i*2+j;let x=j===0?-2.45:2.45;let pedestal=new THREE.Group();pedestal.position.set(x,0,-1);g.add(pedestal);box(pedestal,2.65,.9,2.0,0,.45,0,C('#d6c6a8',.85));box(pedestal,2.78,.10,2.14,0,.95,0,M.gold);box(pedestal,2.62,.08,2.05,0,2.91,0,M.gold);for(let xx of [-1.27,1.27])for(let zz of [-.96,.96])box(pedestal,.055,1.93,.055,xx,1.96,zz,M.gold);for(let xx of [-1.26,1.26])box(pedestal,.035,1.86,1.90,xx,1.95,0,M.glass);box(pedestal,2.55,1.86,.035,0,1.95,-.96,M.glass);box(pedestal,2.55,1.86,.035,0,1.95,.96,M.glass);const item=new THREE.Group();item.userData.itemIndex=idx;pedestal.add(item);artifacts[idx]=item;box(pedestal,1.52,.06,.35,0,1.08,.7,C('#465a49'));}
}
scene.add(new THREE.HemisphereLight(0xf6f5e9,0x434e43,2.2));const dl=new THREE.DirectionalLight(0xffe4b9,2.5);dl.position.set(-10,11,8);scene.add(dl);

// Imported architecture and exhibits supplied by the project owner.
// Local files: FBX Chinese hall, glTF tea set, Collada crate.
let lobbyLoaded=false;
const lobbyGroup=new THREE.Group();lobbyGroup.position.x=-19;scene.add(lobbyGroup);
// Lobby lighting is local to this room, so it travels with the hall.
const lobbyAmbient=new THREE.PointLight(0xffdba0,42,18);lobbyAmbient.position.set(0,5,2);lobbyGroup.add(lobbyAmbient);
const lobbyFill=new THREE.PointLight(0xd4e3d1,20,16);lobbyFill.position.set(-4,4,-3);lobbyGroup.add(lobbyFill);
const hallBase=box(lobbyGroup,12,.20,12,0,-.10,0,C('#75583c',.7));
box(lobbyGroup,9,.09,2.4,0,.03,1.9,C('#522f25',.98));
const hallName=plaque(lobbyGroup,'万里茶道 · 茶之路',0,2.85,-3.2);
function fitImported(model,dim,center){
 model.updateMatrixWorld(true);
 const bound=new THREE.Box3().setFromObject(model),span=bound.getSize(new THREE.Vector3());
 if(![span.x,span.y,span.z].every(x=>Number.isFinite(x)&&x>1e-5))throw new Error('Invalid model bounds');
 // Account for all dimensions, not just the longest (prevents clipping in showcases).
 const factor=Math.min(dim[0]/span.x,dim[1]/span.y,dim[2]/span.z);
 model.scale.multiplyScalar(factor);model.updateMatrixWorld(true);
 const fresh=new THREE.Box3().setFromObject(model),mid=fresh.getCenter(new THREE.Vector3());
 model.position.add(new THREE.Vector3(...center).sub(mid));model.updateMatrixWorld(true);
 return model;
}
const assetStatus={hall:'loading',teaSet:'pending',crate:'pending',camel:'pending',samovar:'pending'};
const loaderBanner=document.createElement('div');loaderBanner.className='assetBanner';loaderBanner.style.cssText='position:absolute;top:54px;left:15px;padding:8px 12px;background:#0d1a15bc;border-radius:10px;font:11px system-ui;color:#eee;pointer-events:none;z-index:4';holder.parentElement.append(loaderBanner);
function reportLoad(){
 const dic={ru:['Холл','Сервиз','Ящики','Верблюд','Самовар'],zh:['大厅','茶具','木箱','骆驼','茶炊'],en:['Hall','Tea set','Crates','Camel','Samovar']};
 const labels=dic[document.documentElement.lang]||dic.en;
 const states=['hall','teaSet','crate','camel','samovar'].map(k=>assetStatus[k]);
 loaderBanner.textContent=labels.map((l,i)=>l+': '+(states[i]==='ready'?'✓':states[i]==='failed'?'⚠':states[i]==='pending'?'–':'…')).join(' · ');
 loaderBanner.style.display=states.every(v=>v==='ready'||v==='pending')?'none':'block';
}
reportLoad();
(async()=>{
 try{
  const {FBXLoader}=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/FBXLoader.js');
  const manager=new THREE.LoadingManager();manager.setURLModifier(url=>{
   const filename=url.split('/').pop().split('\\').pop().replace(/\.tga$/i,'.tga');
   const match=filename.match(/HZ[A-Za-z0-9_]+(?:_Color|_Normal|_Metallic|_N)?\.tga/i);
   if(match)return './assets/textures/hall/'+match[0]+'.jpg';
   return url;
  });
  const fbx=new FBXLoader(manager);
  fbx.load('./assets/models/chinese-hall.fbx',model=>{
   try{
    // FBX references a .tga image; browsers do not natively load it. Apply the
    // exported JPEG explicitly instead of relying on the FBXLoader TGA handler.
    const hallTexture=new THREE.TextureLoader().load(
      './assets/textures/hall/HZ116_Color.tga.jpg',
      ()=>{hallTexture.colorSpace=THREE.SRGBColorSpace;hallTexture.needsUpdate=true;},
      undefined,
      err=>console.warn('Hall diffuse texture missing',err)
    );
    hallTexture.colorSpace=THREE.SRGBColorSpace;
    model.traverse(o=>{
      if(!o.isMesh)return;
      o.castShadow=false;o.receiveShadow=false;
      const original=Array.isArray(o.material)?o.material:[o.material];
      const fixed=original.map(m=>{
        const v=new THREE.MeshStandardMaterial({
          map:hallTexture,color:0xffffff,roughness:.81,metalness:0,
          side:THREE.DoubleSide
        });
        return v;
      });
      o.material=Array.isArray(o.material)?fixed:fixed[0];
    });
    fitImported(model,[11.3,5.8,10.8],[0,2.8,-.3]);lobbyGroup.add(model);lobbyLoaded=true;assetStatus.hall='ready';reportLoad();
   }catch(e){console.warn('Hall fitting failed',e);assetStatus.hall='failed';reportLoad()}
  },undefined,e=>{console.warn('Chinese hall FBX could not load',e);assetStatus.hall='failed';reportLoad()});
 }catch(e){console.warn('FBXLoader unavailable',e);assetStatus.hall='failed';reportLoad()}
})();
(async()=>{
 await new Promise(resolve=>{document.addEventListener('museum-room-enter',e=>{if(e.detail===0){assetStatus.teaSet='loading';reportLoad();resolve()}},{once:false})});
 try{
  const {GLTFLoader}=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js');
  new GLTFLoader().load('./assets/models/teaset.glb',gltf=>{
   try{const p=artifacts[1],model=gltf.scene;fitImported(model,[1.8,1.4,1.2],[0,1.83,0]);p.add(model);for(const child of p.children){if(child!==model)child.visible=false}assetStatus.teaSet='ready';reportLoad()}
   catch(e){console.warn('Tea set invalid',e);assetStatus.teaSet='failed';reportLoad()}
  },undefined,e=>{console.warn('Tea set loading failed',e);assetStatus.teaSet='failed';reportLoad()});
 }catch(e){console.warn('GLTFLoader unavailable',e);assetStatus.teaSet='failed';reportLoad()}
})();
(async()=>{
 await new Promise(resolve=>{document.addEventListener('museum-room-enter',e=>{if(e.detail===1){assetStatus.crate='loading';reportLoad();resolve()}},{once:false})});
 try{
  const {ColladaLoader}=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/ColladaLoader.js');
  new ColladaLoader().load('./assets/models/crate/model.dae',data=>{
   try{
    const p=artifacts[3],model=data.scene;
    const timber=new THREE.TextureLoader().load('./assets/models/crate/textures/DefaultMaterial_albedo.jpg');timber.colorSpace=THREE.SRGBColorSpace;
    const woodMaterial=new THREE.MeshStandardMaterial({map:timber,roughness:.82,side:THREE.DoubleSide});
    model.traverse(o=>{if(o.isMesh){o.material=woodMaterial}});
    fitImported(model,[1.65,1.35,1.35],[0,1.82,0]);p.add(model);for(const child of p.children){if(child!==model)child.visible=false}assetStatus.crate='ready';reportLoad();
   }catch(e){console.warn('Crate fitting failed',e);assetStatus.crate='failed';reportLoad()}
  },undefined,e=>{console.warn('Crate Collada loading failed',e);assetStatus.crate='failed';reportLoad()});
 }catch(e){console.warn('ColladaLoader unavailable',e);assetStatus.crate='failed';reportLoad()}
})();

// Actual user-supplied Sketchfab GLB assets. They load from this project, not external embeds.
const realModelsLoaded=new Set();
const realModelsLoading=new Set();
const realModelInfo={
 2:{path:'./assets/models/camel-authentic.glb',status:'camel',max:[1.80,1.55,1.27],center:[0,1.93,0]},
 6:{path:'./assets/models/samovar-authentic.glb',status:'samovar',max:[1.64,1.59,1.28],center:[0,1.94,0]}
};
async function loadRealModel(index){
 const entry=realModelInfo[index];
 if(!entry||realModelsLoaded.has(index)||realModelsLoading.has(index))return;
 realModelsLoading.add(index);assetStatus[entry.status]='loading';reportLoad();
 try{
  const {GLTFLoader}=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js');
  const loader=new GLTFLoader();
  const gltf=await loader.loadAsync(entry.path);
  const parent=artifacts[index],object=gltf.scene;
  // Fit in all three axes, with safety margin from glass and railing.
  fitImported(object,entry.max,entry.center);
  object.traverse(child=>{
    if(!child.isMesh)return;
    child.castShadow=false;child.receiveShadow=false;
    const materials=Array.isArray(child.material)?child.material:[child.material];
    for(const material of materials){
      if(!material)continue;
      // Keep the embedded GLB colour, normal and PBR textures intact.
      if(material.map)material.map.colorSpace=THREE.SRGBColorSpace;
      if(material.emissiveMap)material.emissiveMap.colorSpace=THREE.SRGBColorSpace;
      if(entry.status==='samovar'){
        // Source GLB marks the entire antique metal model as translucent and
        // fully emissive, washing out its texture under museum lighting.
        material.transparent=false;material.opacity=1;material.depthWrite=true;
        material.emissive?.setRGB(0,0,0);material.emissiveIntensity=0;
        material.metalness=Math.min(material.metalness??.7,.72);
        material.roughness=Math.max(material.roughness??.3,.28);
      }
      material.needsUpdate=true;
    }
  });
  parent.add(object);
  parent.userData.realModel=object;
  realModelsLoaded.add(index);assetStatus[entry.status]='ready';reportLoad();
 }catch(error){console.error('Failed to import '+entry.path,error);
  assetStatus[entry.status]='failed';reportLoad();
 }finally{realModelsLoading.delete(index)}
}
document.addEventListener('museum-room-enter',e=>{
 if(e.detail===1)loadRealModel(2); // room 2: caravan
 if(e.detail===3)loadRealModel(6); // room 4: Russian tea
});
// 0 - brick tea
{const p=artifacts[0];for(let a=0;a<3;a++){box(p,1.35,.18,.72,0,1.15+a*.21,0,M.tea);for(let j=0;j<11;j++)box(p,.018,.018,.016,-.52+j*.10,1.25+a*.21,.37,M.woodLight)}for(let x of [-.43,.43])box(p,.12,.67,.73,x,1.36,0,M.linen);plaque(p,'茶',0,1.8,.4)}
// 1 - tea press
{const p=artifacts[1];box(p,1.52,.12,1.08,0,1.12,0,M.wood);for(let x of [-.54,.54])box(p,.16,1.42,.16,x,1.83,0,M.wood);box(p,1.55,.18,.4,0,2.49,0,M.woodLight);cy(p,.13,.13,.57,0,2.17,0,M.metal);box(p,.84,.16,.65,0,1.82,0,M.woodLight);box(p,.95,.24,.76,0,1.37,0,M.tea);tube(p,[[0,2.44,0],[.42,2.48,0],[.9,2.56,0]],.045,M.metal)}
// 2 - actual imported Bactrian camel (lazy-loaded on entering room 2).
// The plinth is intentionally kept clear while the GLB is loading.
// 3 - crates
{const p=artifacts[3];for(let k=0;k<2;k++){let x=k===0?-.48:.43;let h=k===0?.67:.91;box(p,.79,h,.74,x,1.10+h/2,0,M.wood);for(let y of [-h*.3,0,h*.3]){box(p,.82,.038,.77,x,1.10+h/2+y,0,M.gold)}for(let z of [-.375,.375])box(p,.06,h+.03,.06,x-.31,1.10+h/2,z,M.metal);box(p,.41,.25,.014,x,1.10+h/2,.39,M.paper);box(p,.10,.14,.016,x,1.10+h/2,.4,M.tea)}}
// 4 - shop
{const p=artifacts[4];box(p,1.72,.1,.92,0,1.17,0,M.wood);box(p,1.65,.90,.68,0,1.68,-.15,M.wood);box(p,2.1,.18,1.10,0,2.26,-.08,M.red);for(let x of [-.80,.80])cy(p,.075,.075,1.25,x,1.67,.46,M.gold);box(p,1.65,.10,.65,0,1.30,.30,M.woodLight);for(let x of [-.5,0,.5]){box(p,.34,.35,.32,x,1.54,.30,M.linen);box(p,.23,.18,.01,x,1.59,.48,M.paper)}plaque(p,'茶',0,2.09,.56)}
// 5 frontier gateway
{const p=artifacts[5];for(let x of [-.65,.65]){box(p,.25,1.57,.31,x,1.89,0,M.stone);box(p,.41,.13,.43,x,2.68,0,M.gold)}box(p,1.71,.16,.43,0,2.7,0,M.stone);box(p,1.63,.1,.28,0,2.82,0,M.gold);box(p,.65,.17,.25,0,1.32,.23,M.red);plaque(p,'茶路',0,2.55,.235)}
// 6 - actual imported antique samovar (lazy-loaded on entering room 4).
// No fabricated replacement is shown if the real file cannot load.
// 7 desk
{const p=artifacts[7];box(p,1.84,.13,1.20,0,1.52,0,M.wood);for(let x of [-.71,.71])for(let z of [-.39,.39])box(p,.10,.54,.12,x,1.22,z,M.woodLight);box(p,1.06,.018,.75,-.22,1.62,0,M.paper);for(let n=0;n<4;n++)tube(p,[[-.70+n*.21,1.635,-.22],[-.49+n*.20,1.635,0],[-.28+n*.21,1.635,.24]],.009,n%2?M.red:M.metal);cy(p,.13,.16,.21,.60,1.76,-.22,M.metal);cone(p,.12,.22,.60,2.02,-.22,M.metal);box(p,.44,.31,.30,.57,1.75,.35,M.woodLight)}
// Camera with smooth motion between connected halls.
const state={room:0,item:0,targetX:0,lookX:0,yaw:0,tyaw:0,pitch:.06,tpitch:.06,zoom:9.5,tzoom:9.5};
function goRoom(room,item){state.room=room;state.item=item;state.targetX=room*regionSpacing;state.tyaw=0;state.tzoom=9.5;state.tpitch=.06;highlight()}
function goItem(item){state.item=item;const local=item%2===0?-2.45:2.45;state.targetX=state.room*regionSpacing+local*.72;state.tyaw=local<0?-.12:.12;state.tzoom=6.3;highlight()}
function highlight(){artifacts.forEach((o,i)=>o.scale.setScalar(i===state.item?1.08:1));}
let inLobby=true;
function showLobby(){inLobby=true;state.room=-1;state.targetX=-19;state.tyaw=0;state.tzoom=9.5;state.tpitch=.08; if(lobbyOverlay)lobbyOverlay.hidden=false; lobbyButton?.setAttribute('aria-pressed','true');}
function leaveLobby(){inLobby=false;if(lobbyOverlay)lobbyOverlay.hidden=true;lobbyButton?.setAttribute('aria-pressed','false');}
const roomGo=goRoom;goRoom=function(room,item){leaveLobby();roomGo(room,item);document.dispatchEvent(new CustomEvent('museum-room-enter',{detail:room}))};
const itemGo=goItem;goItem=function(item){leaveLobby();itemGo(item)};
window.museumGoLobby=showLobby;
lobbyButton?.addEventListener('click',showLobby);
document.getElementById('lobbyMini')?.addEventListener('click',showLobby);
document.getElementById('lobbyBegin')?.addEventListener('click',()=>{if(window.changeRoom)window.changeRoom(0);else goRoom(0,0)});
window.museumChangeRoom=goRoom;window.museumSelectItem=goItem;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function resize(){const w=holder.clientWidth,h=holder.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}new ResizeObserver(resize).observe(holder);resize();
let isDown=false,changed=false,lastX=0,lastY=0,pinchDist=0;
const activePointers=new Map();
const canvas=renderer.domElement;
function distance(){const p=[...activePointers.values()];return p.length===2?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0}
canvas.addEventListener('pointerdown',e=>{
 activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});isDown=true;changed=activePointers.size>1;
 lastX=e.clientX;lastY=e.clientY;if(activePointers.size===2)pinchDist=distance();
 try{canvas.setPointerCapture(e.pointerId)}catch(_){ }
});
canvas.addEventListener('pointermove',e=>{
 if(!activePointers.has(e.pointerId))return;
 const old=activePointers.get(e.pointerId);activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(activePointers.size>=2){const d=distance();if(pinchDist>0&&d>0){state.tzoom=clamp(state.tzoom*pinchDist/d,4.1,13.5)}pinchDist=d;changed=true;return}
 const dx=e.clientX-old.x,dy=e.clientY-old.y;if(Math.abs(dx)+Math.abs(dy)>1.5)changed=true;
 state.tyaw=clamp(state.tyaw-dx*.005,-.85,.85);state.tpitch=clamp(state.tpitch+dy*.004,-.30,.34)
});
canvas.addEventListener('pointerup',e=>{activePointers.delete(e.pointerId);isDown=activePointers.size>0;pinchDist=0;if(changed||isDown)return;
 const rect=canvas.getBoundingClientRect();const pointer=new THREE.Vector2(2*(e.clientX-rect.left)/rect.width-1,1-2*(e.clientY-rect.top)/rect.height);
 const ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);let hits=ray.intersectObjects(artifacts,true);
 for(let hit of hits){let obj=hit.object;while(obj&&obj.userData.itemIndex===undefined)obj=obj.parent;if(obj){let idx=obj.userData.itemIndex;if(idx>=0){selectItem(idx);break}}}
});
canvas.addEventListener('pointercancel',e=>{activePointers.delete(e.pointerId);isDown=false;changed=true});
canvas.addEventListener('wheel',e=>{e.preventDefault();state.tzoom=clamp(state.tzoom+e.deltaY*.012,4.1,13.5)},{passive:false});
document.getElementById('zoomIn').onclick=()=>state.tzoom=clamp(state.tzoom-.7,4.1,13.5);
document.getElementById('zoomOut').onclick=()=>state.tzoom=clamp(state.tzoom+.7,4.1,13.5);
document.getElementById('resetCam').onclick=()=>goRoom(currentRoom,currentItem);
let prev=performance.now(),camX=-19,zoom=9.5,yaw=0,pitch=.06;
let onScreen=true;new IntersectionObserver(es=>onScreen=!!es[0]?.isIntersecting,{threshold:.02}).observe(holder);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(t){requestAnimationFrame(draw);if(document.hidden||!onScreen){prev=t;return}const dt=Math.min(.05,(t-prev)/1000);prev=t;const k=1-Math.exp(-(reduced?14:3.8)*dt);camX+=(state.targetX-camX)*k;zoom+=(state.tzoom-zoom)*k;yaw+=(state.tyaw-yaw)*k;pitch+=(state.tpitch-pitch)*k;camera.position.set(camX+Math.sin(yaw)*zoom,3.1+pitch*3.6,Math.cos(yaw)*zoom+1.5);camera.lookAt(camX,1.70,-1);renderer.render(scene,camera)}requestAnimationFrame(draw);
showLobby();
}catch(err){console.error(err);document.getElementById('fallbackText').textContent=UI[lang].unavailable;holder.replaceChildren(document.getElementById('renderFallback')||Object.assign(document.createElement('div'),{className:'renderFallback',textContent:UI[lang].unavailable}))}}
