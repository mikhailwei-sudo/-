// Great Tea Road immersive museum. Entirely original, schematic 3D reconstructions.
const holder=document.getElementById('renderStage');
const lobbyOverlay=document.getElementById('lobbyOverlay');
const lobbyButton=document.getElementById('enterLobby');
let THREE;
for(const source of [
 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js',
 'https://unpkg.com/three@0.170.0/build/three.module.js',
 'https://esm.sh/three@0.170.0'
]){
 try{THREE=await import(source);break}
 catch(err){console.warn('3D engine source unavailable:',source,err)}
}
if(!THREE){
 const fallback=document.getElementById('fallbackText');
 if(fallback)fallback.textContent=(UI[lang].unavailable||'3D не загрузилось')+' · Проверьте соединение и обновите страницу.';
}
if(THREE){try{
const scene=new THREE.Scene();scene.background=new THREE.Color('#0c1711');scene.fog=new THREE.Fog('#17271e',12,65);
const camera=new THREE.PerspectiveCamera(54,1,.1,120);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,innerWidth<700?1.1:1.25));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.55;holder.replaceChildren(renderer.domElement);
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
const rooms=[];const artifacts=[];const exhibitLights=[];const regionSpacing=19;
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
let spot1=new THREE.SpotLight(0xffe9c5,14,11,Math.PI/4,.62,1.4);spot1.position.set(-2.9,4.8,1.1);spot1.target.position.set(-2.4,1.7,-1);g.add(spot1,spot1.target);let spot2=new THREE.SpotLight(0xffe9c5,14,11,Math.PI/4,.62,1.4);spot2.position.set(2.9,4.8,1.1);spot2.target.position.set(2.4,1.7,-1);g.add(spot2,spot2.target);
exhibitLights.push(spot1,spot2);
for(let j=0;j<2;j++){const idx=i*2+j;let x=j===0?-2.45:2.45;let pedestal=new THREE.Group();pedestal.position.set(x,0,-1);g.add(pedestal);box(pedestal,2.65,.9,2.0,0,.45,0,C('#d6c6a8',.85));box(pedestal,2.78,.10,2.14,0,.95,0,M.gold);box(pedestal,2.62,.08,2.05,0,2.91,0,M.gold);for(let xx of [-1.27,1.27])for(let zz of [-.96,.96])box(pedestal,.055,1.93,.055,xx,1.96,zz,M.gold);for(let xx of [-1.26,1.26])box(pedestal,.035,1.86,1.90,xx,1.95,0,M.glass);box(pedestal,2.55,1.86,.035,0,1.95,-.96,M.glass);box(pedestal,2.55,1.86,.035,0,1.95,.96,M.glass);// Diffused case lighting: emissive strips, not eight new expensive spotlights.
 const softStrip=new THREE.MeshStandardMaterial({
  color:'#fff0d0',emissive:'#fff0d0',emissiveIntensity:.82,roughness:.78,
  side:THREE.DoubleSide
 });
 box(pedestal,1.9,.027,.065,0,2.85,-.82,softStrip);
 box(pedestal,1.9,.027,.065,0,2.85,.82,softStrip);
 // Dark inset plinth provides visual separation from the marble display base.
 box(pedestal,2.3,.045,1.69,0,1.032,0,C('#303a30',.91));
 const item=new THREE.Group();item.userData.itemIndex=idx;pedestal.add(item);artifacts[idx]=item;
 box(pedestal,1.52,.06,.35,0,1.08,.7,C('#465a49'));}
}

// Phase II: museum interior architecture. Every addition is decorative and does
// not move or replace the existing four galleries, showcases, or imported models.
const INTERIOR_EXHIBITS=[
 {name:{ru:'От чайного листа — к чайному кирпичу',zh:'茶叶加工与紧压',en:'From leaves to pressed tea'},
  section:'CHINA · TEA CRAFT',image:'https://iiif.wellcomecollection.org/image/V0018603/full/600,/0/default.jpg',
  attribution:'Chinese artist, ca. 1850 · Wellcome Collection · PDM 1.0',
  source:'https://wellcomecollection.org/works/qv74uhng',
  note:{ru:'Сушка чая. Историческая иллюстрация, не фото кирпичного чая.',zh:'茶叶烘干历史绘画，并非砖茶成品照片。',en:'Historical illustration of tea drying; not a finished brick.'}},
 {name:{ru:'Караван через степь',zh:'草原商队与双峰驼',en:'The caravan across the steppe'},
  section:'CARAVANS · THE STEPPE',image:'https://iiif.wellcomecollection.org/image/V0020910EL/full/600,/0/default.jpg',
  attribution:'W. Warwick after T. Brown & N. Marechal · Wellcome Collection · PDM 1.0',
  source:'https://wellcomecollection.org/works/kbf4jemm',
  note:{ru:'Иллюстрация двугорбого и одногорбого верблюдов, не фото чайного каравана.',zh:'双峰驼与单峰驼类型图，并非茶路驼队的照片。',en:'Camel type illustration, not a Tea Road caravan photograph.'}},
 {name:{ru:'Города пограничной торговли',zh:'边境商贸与建筑',en:'Border trading towns'},
  section:'KYAKHTA · TRADE',image:'https://iiif.wellcomecollection.org/image/V0037634/full/600,/0/default.jpg',
  attribution:'Felice Beato · Beijing, 1860 · Wellcome Collection · PDM 1.0',
  source:'https://wellcomecollection.org/works/zbmdafc9',
  note:{ru:'Магазин в Пекине: архитектурный аналог, не снимок Кяхты.',zh:'北京商铺建筑类型参照，并非恰克图实景。',en:'Beijing shop architecture; not a photograph of Kyakhta.'}},
 {name:{ru:'Самовар и чайная культура',zh:'俄罗斯茶炊与饮茶文化',en:'Samovar and tea culture'},
  section:'RUSSIA · TEA CULTURE',image:'https://collections.smvk.se/carlotta-em/web/image/zoom/1208586/2005.02.0015.A-C.jpg',
  attribution:'Samovar · Museum of Ethnography, Sweden · CC0 1.0',
  source:'https://collections.smvk.se/carlotta-em/web/object/1208565',
  note:{ru:'Музейный предмет для сопоставления с современной 3D-моделью.',zh:'馆藏实物，与现代三维模型进行形态对照。',en:'Collection object for comparison with a modern 3D model.'}}
];
const museumPanels=[];
const museumSecondaryPanels=[];
const extraArchiveImages=[
 {image:'https://iiif.wellcomecollection.org/image/V0018604/full/600,/0/default.jpg',
  attribution:'Tea steaming, ca. 1850 · Wellcome Collection · PDM 1.0',
  source:'https://wellcomecollection.org/works/s946ptrq',label:'蒸茶 · TEA STEAMING'},
 {image:'https://images.metmuseum.org/CRDImages/an/original/DP-14200-001.jpg',
  attribution:'Bactrian camel sculpture · The Met · CC0 1.0',
  source:'https://www.metmuseum.org/art/collection/search/324256',label:'双峰驼 · TYPE REFERENCE'},
 {image:'https://iiif.wellcomecollection.org/image/V0037627/full/600,/0/default.jpg',
  attribution:'Felice Beato, Beijing, 1860 · Wellcome Collection · PDM 1.0',
  source:'https://wellcomecollection.org/works/eg29s8qh',label:'城门 · TYPE REFERENCE'},
 {image:'https://iiif.wellcomecollection.org/image/V0040178/full/600,/0/default.jpg',
  attribution:'G. Hunt after M. Egerton · Wellcome Collection · PDM 1.0',
  source:'https://wellcomecollection.org/works/fffkc9mv',label:'茶桌 · TYPE REFERENCE'}
];

function museumLetterBoard(parent,text,w,h,x,y,z,fontSize=46){
 const board=document.createElement('canvas');board.width=1024;board.height=256;
 const ctx=board.getContext('2d');
 if(!ctx)return null;
 ctx.fillStyle='#182921';ctx.fillRect(0,0,1024,256);
 ctx.strokeStyle='#cbb484';ctx.lineWidth=6;ctx.strokeRect(13,13,998,230);
 ctx.fillStyle='#f7ebce';ctx.textAlign='center';
 ctx.font='500 '+fontSize+'px "Noto Sans SC",system-ui,sans-serif';
 ctx.fillText(text,512,151,970);
 const tex=new THREE.CanvasTexture(board);tex.colorSpace=THREE.SRGBColorSpace;
 return mk(parent,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}),x,y,z);
}
function framedPhoto(parent,w,h,x,y,z){
 const group=new THREE.Group();group.position.set(x,y,z);parent.add(group);
 box(group,w+.16,h+.16,.09,0,0,0,M.woodLight);
 box(group,w+.10,h+.10,.065,0,0,.06,M.gold);
 box(group,w,h,.06,0,0,.11,M.paper);
 const imageMesh=mk(group,new THREE.PlaneGeometry(w-.14,h-.14),
   new THREE.MeshBasicMaterial({color:'#a6a18d',side:THREE.DoubleSide}),0,0,.154);
 group.userData.photo=imageMesh;
 return group;
}
for(let n=0;n<4;n++){
 const room=rooms[n];
 const trim=C(['#a38e70','#a78a61','#749b91','#bb8473'][n],.66);
 const plaster=C(['#c7c0aa','#b6a899','#a7b7ad','#c7aaa0'][n],.93);
 const darkFloor=C(['#51483a','#4e4235','#344940','#513b37'][n],.86);
 // A slightly raised perimeter and inset exhibit floor.
 box(room,13.4,.055,11.7,0,-.001,.05,darkFloor);
 for(const side of [-1,1]){
  box(room,.10,4.6,11.1,side*6.83,2.43,-.1,plaster);
  box(room,.13,.18,11.1,side*6.78,.47,-.1,trim);
  box(room,.13,.18,11.1,side*6.78,4.96,-.1,trim);
  for(const z of [-4.4,-2.2,0,2.2,4.4]){
   box(room,.17,4.37,.16,side*6.72,2.71,z,trim);
  }
 }
 // Museum display walls: upper architrave, relief panels and subtle ceiling.
 box(room,13.55,.18,.37,0,5.30,-4.75,trim);
 for(const zz of [-4.0,-1,2,5]){
  box(room,12.0,.10,.24,0,5.32,zz,M.woodLight);
  for(const x of [-4.6,0,4.6]){
   // Architectural light strips, with a single real fill light per hall.
   box(room,.70,.04,.23,x,5.20,zz,new THREE.MeshStandardMaterial({
    color:'#e4c58b',emissive:'#b79354',emissiveIntensity:.52,roughness:.75
   }));
  }
 }
 // Visitor circulation strip and gallery bench, away from showcases.
 box(room,8.8,.015,1.25,0,.038,3.48,C('#c0ad86',.95));
 box(room,2.15,.14,.52,0,.55,4.45,M.woodLight);
 for(const x of [-.8,.8])box(room,.14,.48,.40,x,.26,4.45,M.wood);
 // Discreet ropes and brass stanchions in front of the glass cases.
 for(const x of [-4.25,-1.0,1.0,4.25]){
  cy(room,.042,.085,.68,x,.35,1.12,M.gold,12);
  cy(room,.10,.10,.045,x,.70,1.12,M.gold,12);
 }
 for(const left of [-4.25,1]){
  tube(room,[[left,.59,1.12],[left+1.6,.49,1.18],[left+3.25,.59,1.12]],.022,M.red);
 }
 const roomFill=new THREE.PointLight(0xffe4b3,9,13,2);
 roomFill.position.set(0,4.95,2.6);room.add(roomFill);
 const art=framedPhoto(room,2.45,1.64,0,3.49,-4.73);
 const label=museumLetterBoard(room,INTERIOR_EXHIBITS[n].section,3.2,.62,0,4.53,-4.57,46);
 museumPanels.push(art.userData.photo);
 const sideArt=framedPhoto(room,1.77,1.35,4.83,3.12,-4.55);
 museumSecondaryPanels.push(sideArt.userData.photo);
 museumLetterBoard(room,extraArchiveImages[n].label,2.15,.34,4.83,2.20,-4.49,34);
 museumLetterBoard(room,['原始史料 · PDM','类型参照 · CC0','类型参照 · PDM','类型参照 · PDM'][n],
   2.16,.32,4.83,1.93,-4.48,33);
 museumLetterBoard(room,INTERIOR_EXHIBITS[n].attribution,3.35,.32,0,2.27,-4.52,25);
 // Wall plaques connect the 3D room to its collection, without inventing an artefact.
 museumLetterBoard(room,['中国茶叶工艺 · CHINA','茶路商队 · CARAVANS',
   '恰克图贸易 · BORDER','俄罗斯饮茶文化 · RUSSIA'][n],3.9,.63,0,4.94,-4.48,43);
}
const museumPhotoLoaded=new Set();
// Accessible image captions remain in the surrounding HTML archive;
// these paintings are typological references, not scans of the 3D exhibits.
// Historical art is always shown at its original aspect ratio inside
// the frame. Images load on room entry; remote failures never block WebGL.
const museumPhotoFiles={
 'V0018603':'r1-brick-01.jpg','V0018604':'r1-brick-02.jpg',
 '1955.299_print':'r1-teaset-01.jpg',
 'V0020910EL':'r2-camel-02.jpg','DP-14200-001':'r2-camel-01.jpg',
 'V0037634':'r3-shop-02.jpg','V0037627':'r3-gate-01.jpg',
 '2005.02.0015.A-C':'r4-samovar-01.jpg',
 'V0040178':'r4-desk-01.jpg'
};
// The public site does not yet contain the archived JPEG assets. Skip guaranteed
// 404 requests; keep the collection URLs as non-blocking fallbacks.
const LOCAL_ARCHIVE_READY=false;
const imageLoader=new THREE.TextureLoader();
function loadMuseumImage(url,display){
 if(!url||!display)return;
 const code=Object.keys(museumPhotoFiles).find(key=>url.includes(key));
 const local=code?'./assets/refs/'+museumPhotoFiles[code]:null;
 const present=tex=>{
  tex.colorSpace=THREE.SRGBColorSpace;
  tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  const image=tex.image;
  const w=image?.naturalWidth||image?.videoWidth||image?.width||1;
  const h=image?.naturalHeight||image?.videoHeight||image?.height||1;
  const geom=display.geometry?.parameters||{width:1,height:1};
  const frameAspect=geom.width/geom.height;
  const textureAspect=w/h;
  // Centre crop rather than stretching a historical painting or photograph.
  if(textureAspect>frameAspect){
   tex.repeat.set(frameAspect/textureAspect,1);
   tex.offset.set((1-tex.repeat.x)/2,0);
  }else{
   tex.repeat.set(1,textureAspect/frameAspect);
   tex.offset.set(0,(1-tex.repeat.y)/2);
  }
  tex.needsUpdate=true;
  const previous=display.material;
  display.material=new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide,toneMapped:false});
  previous?.dispose();
 };
 const fail=error=>console.warn('Archival image unavailable; museum label retained',url,error);
 if(local&&LOCAL_ARCHIVE_READY){
  imageLoader.load(local,present,undefined,()=>imageLoader.load(url,present,undefined,fail));
 }else{
  imageLoader.load(url,present,undefined,fail);
 }
}
function loadMuseumWallPhoto(i){
 if(museumPhotoLoaded.has(i)||i<0||i>3)return;
 museumPhotoLoaded.add(i);
 loadMuseumImage(INTERIOR_EXHIBITS[i].image,museumPanels[i]);
 loadMuseumImage(extraArchiveImages[i].image,museumSecondaryPanels[i]);
}
document.addEventListener('museum-room-enter',e=>loadMuseumWallPhoto(e.detail));
window.addEventListener('museum-phase2-room',e=>loadMuseumWallPhoto(e.detail));

scene.add(new THREE.HemisphereLight(0xf6f5e9,0x434e43,2.2));const dl=new THREE.DirectionalLight(0xffe4b9,2.5);dl.position.set(-10,11,8);scene.add(dl);

// Gallery finish: lightweight physically lit floor strips, wall vitrines and
// detailed object labels. All geometry is static; no new model downloads.
const galleryDetailPalette=[
 {stone:'#beb4a0',timber:'#856746',accent:'#bca477',ink:'#314537'},
 {stone:'#a99a83',timber:'#786247',accent:'#c4aa7b',ink:'#423829'},
 {stone:'#a5b5ad',timber:'#625951',accent:'#b3c4b9',ink:'#25413d'},
 {stone:'#b6a39a',timber:'#76574d',accent:'#dbb29b',ink:'#513731'}
];
const museumLabels={
 ru:[['Кирпичный чай','Китайский чайный сервиз'],['Чайный караван','Торговые ящики'],['Пограничная лавка','Торговые ворота'],['Русский самовар','Купеческий стол']],
 zh:[['砖茶','中国茶具'],['茶路驼队','贸易木箱'],['边境商铺','城门与界标'],['俄罗斯茶炊','商人桌案']],
 en:[['Brick tea','Chinese teaware'],['Tea caravan','Trade crates'],['Merchant shop','Border gateway'],['Russian samovar','Merchant desk']]
};
const galleryLabelObjects=[];
function labelCanvasTexture(title,subtitle){
 const c=document.createElement('canvas');c.width=512;c.height=256;
 const ctx=c.getContext('2d');if(!ctx)return null;
 ctx.fillStyle='#ede3cb';ctx.fillRect(0,0,c.width,c.height);
 ctx.fillStyle='#a68a59';ctx.fillRect(15,15,482,3);
 ctx.fillStyle='#263a2f';ctx.font='bold 44px system-ui,"Noto Sans SC",sans-serif';ctx.textAlign='center';
 ctx.fillText(title,256,118,470);
 ctx.fillStyle='#607367';ctx.font='26px system-ui,sans-serif';
 ctx.fillText(subtitle,256,175,470);
 ctx.fillStyle='#a68a59';ctx.fillRect(15,235,482,3);
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
for(let roomIndex=0;roomIndex<4;roomIndex++){
 const room=rooms[roomIndex],theme=galleryDetailPalette[roomIndex];
 const stone=C(theme.stone,.87),timber=C(theme.timber,.76),accent=C(theme.accent,.35,.32);
 // Square cuts of polished stone with thin brass inlays only around the
 // circulation area: keep the original central carpet and glass-case bases.
 for(const x of [-5.88,5.88]){
  for(let row=0;row<5;row++){
   const z=-3.85+row*1.92;
   box(room,1.35,.02,1.77,x,.045,z,stone);
   box(room,1.35,.025,.026,x,.062,z+.86,accent);
  }
 }
 for(const x of [-4.62,4.62]){
  box(room,.025,.025,10.5,x,.063,0,accent);
 }
 // Three-dimensional panel frames and dado rails (no texture fetch).
 for(const x of [-4.85,4.85]){
  box(room,2.20,3.16,.08,x,2.72,-4.83,timber);
  box(room,2.03,2.95,.09,x,2.72,-4.74,stone);
  box(room,1.85,.045,.11,x,4.04,-4.66,accent);
  box(room,1.85,.045,.11,x,1.42,-4.66,accent);
 }
 // Illuminated nameplates at the front of the authentic-model showcases.
 for(let item=0;item<2;item++){
  const x=item===0?-2.45:2.45;
  const stand=new THREE.Group();stand.position.set(x,0,1.43);room.add(stand);
  box(stand,1.84,.09,.08,0,.68,0,timber);
  box(stand,1.78,.51,.07,0,.98,0,C('#eadcc0',.94));
  box(stand,1.86,.045,.09,0,1.23,.04,accent);
  const name=(museumLabels[document.documentElement.lang]||museumLabels.ru)[roomIndex][item];
  const tex=labelCanvasTexture(name,'GREAT TEA ROAD · '+String(roomIndex*2+item+1).padStart(2,'0'));
  if(tex){
   const plate=mk(stand,new THREE.PlaneGeometry(1.64,.49),new THREE.MeshBasicMaterial({map:tex}),0,.99,.059);
   galleryLabelObjects.push({plate,roomIndex,item});
  }
 }
 // Room-specific material accents, not arbitrary unrelated architectural assets.
 if(roomIndex===0){
  for(const x of [-5.4,5.4])box(room,.29,4.5,.28,x,2.50,-4.35,timber);
 }else if(roomIndex===1){
  box(room,11.1,.15,.30,0,4.45,-4.70,timber);
  for(const x of [-5.1,5.1])cy(room,.17,.20,1.7,x,1.01,3.7,timber,12);
 }else if(roomIndex===2){
  box(room,10.3,.15,.34,0,4.20,-4.64,accent);
  for(const x of [-5.0,5.0])box(room,.40,2.18,.40,x,1.75,-4.43,timber);
 }else{
  box(room,11.4,.18,.35,0,4.52,-4.63,timber);
  for(const x of [-5.1,5.1])cy(room,.16,.19,2.0,x,1.12,-4.10,timber,16);
 }
}
window.addEventListener('museum-language-changed',()=>{
 const chosen=museumLabels[document.documentElement.lang]||museumLabels.ru;
 for(const {plate,roomIndex,item} of galleryLabelObjects){
  const next=labelCanvasTexture(chosen[roomIndex][item],'GREAT TEA ROAD · '+String(roomIndex*2+item+1).padStart(2,'0'));
  if(next){const prev=plate.material.map;plate.material.map=next;plate.material.needsUpdate=true;prev?.dispose();}
 }
});

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
// Museum entrance: a separate, lightweight architectural presentation layer.
// The original Chinese-hall FBX remains underneath and is not modified.
const lobbyFinish=new THREE.Group();lobbyGroup.add(lobbyFinish);
const marble=C('#bcb29b',.79),darkTimber=C('#5f4231',.73),metalTrim=C('#c5a679',.32,.49);
box(lobbyFinish,11.7,.045,11.7,0,-.01,0,marble);
for(const side of [-1,1]){
 box(lobbyFinish,.20,4.7,10.9,side*5.78,2.37,-.1,darkTimber);
 box(lobbyFinish,.12,.12,10.9,side*5.67,4.61,-.1,metalTrim);
 box(lobbyFinish,.12,.12,10.9,side*5.67,.35,-.1,metalTrim);
 for(const z of [-3.85,0,3.85]){
  box(lobbyFinish,.36,4.45,.36,side*5.45,2.45,z,darkTimber);
  box(lobbyFinish,.51,.12,.53,side*5.45,4.67,z,metalTrim);
 }
}
box(lobbyFinish,11.4,.18,.4,0,5.02,-4.85,darkTimber);
box(lobbyFinish,11.4,.06,.43,0,4.93,-4.82,metalTrim);
for(const x of [-4.5,-2.25,0,2.25,4.5]){
 box(lobbyFinish,.09,.07,9.5,x,5.03,-.15,metalTrim);
}
// A small museum reception desk occupies the near-right side, out of the
// central sightline to the imported historical hall.
box(lobbyFinish,2.50,1.03,.76,3.85,.52,3.40,darkTimber);
box(lobbyFinish,2.74,.10,1.05,3.85,1.10,3.40,marble);
box(lobbyFinish,2.44,.09,.12,3.85,.62,3.85,metalTrim);
// Central monolithic introduction plinth with a bilingual museum sign.
box(lobbyFinish,2.6,.30,1.38,0,.15,2.6,darkTimber);
box(lobbyFinish,2.46,.84,1.20,0,.72,2.6,marble);
box(lobbyFinish,2.67,.09,1.42,0,1.20,2.6,metalTrim);
const entranceTitle=museumLetterBoard(lobbyFinish,'万里茶道 · GREAT TEA ROAD',4.70,.85,0,4.36,-4.48,52);
// Tour directions are museum architecture, not functional buttons; the
// existing hall navigation remains the only actionable control.
const entranceDirections=['01  中国茶叶工艺','02  茶路商队','03  恰克图贸易','04  俄罗斯茶文化'];
for(let k=0;k<4;k++){
 const x=k%2===0?-3.38:3.38,z=k<2?-.48:1.34;
 box(lobbyFinish,2.6,1.03,.16,x,1.65,z,darkTimber);
 museumLetterBoard(lobbyFinish,entranceDirections[k],2.46,.61,x,1.83,z+.12,42);
}

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
const assetPercent={hall:null,teaSet:null,crate:null,camel:null,samovar:null};
const assetKeys=['hall','teaSet','camel','crate','samovar'];
const loaderBanner=document.createElement('div');
loaderBanner.className='assetBanner';
loaderBanner.setAttribute('role','status');
loaderBanner.setAttribute('aria-live','polite');
loaderBanner.style.cssText='position:absolute;top:55px;left:15px;width:min(320px,calc(100% - 30px));padding:13px 15px;background:rgba(13,26,21,.94);border:1px solid rgba(220,190,130,.34);border-radius:14px;font:13px/1.4 system-ui;color:#f7edd4;pointer-events:none;z-index:9;box-shadow:0 10px 36px #0007;backdrop-filter:blur(8px)';
const spinnerStyle=document.createElement('style');
spinnerStyle.textContent='@keyframes teaSpin{to{transform:rotate(360deg)}}.teaLoadingSpin{width:19px;height:19px;flex:none;border:2px solid #a4ac9260;border-top-color:#e9c98e;border-radius:50%;animation:teaSpin .85s linear infinite}@media(prefers-reduced-motion:reduce){.teaLoadingSpin{animation:none;border-color:#e9c98e}}';
document.head.append(spinnerStyle);
loaderBanner.innerHTML='<div style="display:flex;align-items:center;gap:11px"><span class="teaLoadingSpin" aria-hidden="true"></span><div style="min-width:0;flex:1"><div id="teaLoadHeading" style="font-weight:650">Загрузка музея</div><div id="teaLoadDetail" style="font-size:11px;opacity:.78;margin-top:2px">Подготавливаем текстуры…</div></div><strong id="teaLoadPercent" style="font-size:13px;font-variant-numeric:tabular-nums">…</strong></div><div style="height:4px;border-radius:8px;background:#ffffff25;overflow:hidden;margin-top:11px"><div id="teaLoadBar" style="width:4%;height:100%;background:linear-gradient(90deg,#ab956c,#f5d99c);border-radius:8px;transition:width .25s ease"></div></div>';
holder.parentElement.append(loaderBanner);
const loadHeading=loaderBanner.querySelector('#teaLoadHeading');
const loadDetail=loaderBanner.querySelector('#teaLoadDetail');
const loadPercent=loaderBanner.querySelector('#teaLoadPercent');
const loadBar=loaderBanner.querySelector('#teaLoadBar');
let displayedLoaderKey='';
function reportLoad(){
 const dic={ru:{hall:'Китайский холл',teaSet:'Чайный сервиз',camel:'Верблюд',crate:'Торговые ящики',samovar:'Самовар',loading:'Загрузка 3D-модели',preparing:'Подготовка текстур…',done:'Все экспонаты готовы',failed:'Не удалось загрузить'},zh:{hall:'中国大厅',teaSet:'茶具',camel:'骆驼',crate:'木箱',samovar:'茶炊',loading:'正在加载三维模型',preparing:'正在处理纹理…',done:'展品已加载',failed:'加载失败'},en:{hall:'Chinese hall',teaSet:'Tea set',camel:'Camel',crate:'Shipping crates',samovar:'Samovar',loading:'Loading 3D model',preparing:'Preparing textures…',done:'All exhibits loaded',failed:'Failed to load'}};
 const labels=dic[document.documentElement.lang]||dic.ru;
 const loading=assetKeys.filter(k=>assetStatus[k]==='loading');
 const failed=assetKeys.filter(k=>assetStatus[k]==='failed');
 const ready=assetKeys.filter(k=>assetStatus[k]==='ready').length;
 if(loading.length===0){
  // Show a warning if a file failed; otherwise keep the UI completely unobstructed.
  loaderBanner.style.display=failed.length?'block':'none';
  if(failed.length){
   loadHeading.textContent=labels.failed;
   loadDetail.textContent=failed.map(k=>labels[k]).join(', ');
   loadPercent.textContent='!';
   loadBar.style.width='100%';
   loaderBanner.querySelector('.teaLoadingSpin').style.animation='none';
  }
  return;
 }
 const key=loading.includes(displayedLoaderKey)?displayedLoaderKey:loading[0];
 displayedLoaderKey=key;
 const progress=assetPercent[key];
 const percent=Number.isFinite(progress)?Math.max(0,Math.min(99,Math.floor(progress))):null;
 loadHeading.textContent=labels.loading+': '+labels[key];
 loadDetail.textContent=labels.preparing+' · '+ready+'/'+assetKeys.length;
 loadPercent.textContent=percent===null?'…':percent+'%';
 loadBar.style.width=(percent===null?5:Math.max(5,percent))+'%';
 loaderBanner.querySelector('.teaLoadingSpin').style.animation='';
 loaderBanner.style.display='block';
}
function modelProgress(key,event){
 if(event?.lengthComputable&&event.total>0) assetPercent[key]=Math.min(99,100*event.loaded/event.total);
 reportLoad();
}
reportLoad();
// Start downloading original assets immediately; room entry must never wait for a click.
const loaderRetrySources=[
 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js',
 'https://unpkg.com/three@0.170.0/examples/jsm/loaders/GLTFLoader.js'
];
let commonGLTFLoaderPromise;
async function obtainGLTFLoader(){
 if(!commonGLTFLoaderPromise)commonGLTFLoaderPromise=(async()=>{
  let lastError;
  for(const source of loaderRetrySources){
   try{return (await import(source)).GLTFLoader}catch(error){lastError=error;console.warn('3D asset loader CDN unavailable',source,error)}
  }
  throw lastError||new Error('3D asset loader unavailable');
 })();
 return commonGLTFLoaderPromise;
}

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
    // Keep FBX material slots and per-part colours. Only fix missing diffuse maps.
    const hallTexture=new THREE.TextureLoader().load('./assets/textures/hall/HZ116_Color.tga.jpg');
    hallTexture.colorSpace=THREE.SRGBColorSpace;
    model.traverse(o=>{
      if(!o.isMesh)return;
      o.castShadow=false;o.receiveShadow=false;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      for(const m of mats){
        if(!m)continue;
        m.side=THREE.DoubleSide;
        if(m.map){m.map.colorSpace=THREE.SRGBColorSpace}
        else if(m.name&&/HZ116/i.test(m.name)){m.map=hallTexture;m.needsUpdate=true}
      }
    });
    fitImported(model,[11.3,5.8,10.8],[0,2.8,-.3]);lobbyGroup.add(model);lobbyLoaded=true;assetStatus.hall='ready';reportLoad();scheduleMuseumPrefetch();
   }catch(e){console.warn('Hall fitting failed',e);assetStatus.hall='failed';reportLoad()}
  },e=>modelProgress('hall',e),e=>{console.warn('Chinese hall FBX could not load',e);assetStatus.hall='failed';reportLoad()});
 }catch(e){console.warn('FBXLoader unavailable',e);assetStatus.hall='failed';reportLoad()}
})();
async function loadTeaSet(){
 if(assetStatus.teaSet!=='pending'&&assetStatus.teaSet!=='failed')return;
 assetStatus.teaSet='loading';reportLoad();
 try{
  const GLTFLoader=await obtainGLTFLoader();
  // loadAsync resolves only when embedded GLB images/materials are prepared.
  const model=(await new GLTFLoader().loadAsync('./assets/models/teaset.glb',e=>modelProgress('teaSet',e))).scene;
  fitImported(model,[1.8,1.4,1.2],[0,1.83,0]);
  artifacts[1].add(model);assetStatus.teaSet='ready';reportLoad();
 }catch(e){console.warn('Tea set loading failed',e);assetStatus.teaSet='failed';reportLoad()}
}
async function loadCrates(){
 if(assetStatus.crate!=='pending'&&assetStatus.crate!=='failed')return;
 assetStatus.crate='loading';reportLoad();
 try{
  const [{ColladaLoader},timber]=await Promise.all([
   import('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/ColladaLoader.js'),
   new THREE.TextureLoader().loadAsync('./assets/models/crate/textures/DefaultMaterial_albedo.jpg')
  ]);
  timber.colorSpace=THREE.SRGBColorSpace;
  const data=await new ColladaLoader().loadAsync('./assets/models/crate/model.dae',e=>modelProgress('crate',e));
  const model=data.scene;
  const woodMaterial=new THREE.MeshStandardMaterial({map:timber,roughness:.82,side:THREE.DoubleSide});
  model.traverse(o=>{if(o.isMesh)o.material=woodMaterial});
  fitImported(model,[1.65,1.35,1.35],[0,1.82,0]);
  artifacts[3].add(model);assetStatus.crate='ready';reportLoad();
 }catch(e){console.warn('Crate loading failed',e);assetStatus.crate='failed';reportLoad()}
}
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
  const GLTFLoader=await obtainGLTFLoader();
  const loader=new GLTFLoader();
  const gltf=await loader.loadAsync(entry.path,e=>modelProgress(entry.status,e));
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
// Pre-fetch real exhibits once the Chinese hall is already visible. A single
// background lane avoids four big downloads competing for the first frame.
let prefetchScheduled=false;
function scheduleMuseumPrefetch(){
 if(prefetchScheduled)return;
 prefetchScheduled=true;
 const start=()=>{
  (async()=>{
   await loadTeaSet();
   await loadRealModel(2);
   await loadCrates();
   await loadRealModel(6);
  })().catch(e=>console.warn('Museum background prefetch failed',e));
 };
 if('requestIdleCallback' in window)requestIdleCallback(start,{timeout:1600});
 else setTimeout(start,700);
}
// If the hall FBX cannot load, still prefetch the actual exhibits.
window.addEventListener('load',()=>{
 if(!prefetchScheduled)setTimeout(scheduleMuseumPrefetch,1500);
},{once:true});
// Request models only when their room becomes visible. Heavy textures no longer
// compete with the Chinese hall on initial page load.
document.addEventListener('museum-room-enter',e=>{
 if(e.detail===0)loadTeaSet();
 if(e.detail===1){loadRealModel(2);loadCrates();}
 if(e.detail===3)loadRealModel(6);
});
// 0 - brick tea
{const p=artifacts[0];for(let a=0;a<3;a++){box(p,1.35,.18,.72,0,1.15+a*.21,0,M.tea);for(let j=0;j<11;j++)box(p,.018,.018,.016,-.52+j*.10,1.25+a*.21,.37,M.woodLight)}for(let x of [-.43,.43])box(p,.12,.67,.73,x,1.36,0,M.linen);plaque(p,'茶',0,1.8,.4)}
// 1 - authentic Chinese tea set, no temporary model.
// 2 - actual imported Bactrian camel (lazy-loaded on entering room 2).
// The plinth is intentionally kept clear while the GLB is loading.
// 3 - authentic wooden crate, no temporary model.
// 4 - tea merchant's shop / lavka
{const p=artifacts[4];
 box(p,2.12,.12,1.22,0,1.05,0,M.wood);
 box(p,1.92,.78,.54,0,1.46,.27,M.woodLight);
 box(p,1.62,.08,.20,0,1.88,.46,M.wood);
 for(const x of [-.86,.86]){cy(p,.08,.08,1.76,x,1.93,.38,M.gold);cy(p,.06,.06,1.55,x,1.80,-.32,M.woodLight)}
 box(p,2.34,.08,1.34,0,2.58,0,M.red);box(p,2.12,.08,1.08,0,2.46,-.05,M.red);
 for(const x of [-.92,.92])box(p,.24,.10,.24,x,2.66,0,M.gold);
 plaque(p,'茶庄',0,2.32,.56);
 for(const x of [-.72,.72]){cy(p,.03,.03,.18,x,2.28,.48,M.gold);ball(p,.11,x,2.11,.48,M.red);cy(p,.08,.08,.18,x,1.96,.48,M.red);cone(p,.055,.09,x,1.82,.48,M.gold)}
 box(p,1.74,.08,.18,0,1.53,-.34,M.wood);box(p,1.74,.08,.18,0,1.85,-.34,M.wood);
 for(const x of [-.82,0,.82])box(p,.08,.82,.12,x,1.69,-.34,M.wood);
 for(const x of [-.58,0,.58]){box(p,.34,.40,.26,x,1.28,.42,M.linen);box(p,.26,.08,.12,x,1.52,.43,M.paper)}
 for(const x of [-.58,0,.58]){cy(p,.11,.13,.30,x,1.70,-.28,M.porcelain);ring(p,.10,.015,x,1.84,-.28,M.gold)}
 for(const x of [-.42,.04]){box(p,.34,.12,.20,x,1.98,-.30,M.tea);box(p,.16,.06,.01,x,2.05,-.18,M.paper)}
 box(p,.24,.24,.24,.66,1.96,-.28,M.wood);box(p,.14,.18,.16,.66,2.20,-.28,M.linen);
 for(const x of [-.48,-.12,.24])cy(p,.09,.09,.28,x,1.42,.48,M.linen);
 cy(p,.10,.10,.28,.56,1.42,.48,M.red);
}
// 5 - ceremonial frontier gate
{const p=artifacts[5];
 for(const x of [-.72,.72]){box(p,.38,.20,.42,x,1.02,0,M.stone);box(p,.24,1.74,.28,x,1.99,0,M.woodLight);box(p,.34,.10,.36,x,2.87,0,M.gold)}
 box(p,1.96,.12,.34,0,2.76,0,M.woodLight);box(p,1.76,.08,.24,0,2.98,0,M.gold);
 box(p,2.34,.08,.74,0,3.18,0,M.red);box(p,2.02,.08,.54,0,3.08,-.02,M.red);
 for(const x of [-.98,.98])cone(p,.14,.20,x,3.16,0,M.gold);
 box(p,.80,.24,.10,0,2.48,.18,M.dark);plaque(p,'恰克图',0,2.48,.24);
 for(const x of [-.30,.30]){cy(p,.018,.018,.18,x,2.20,.18,M.gold);cone(p,.035,.08,x,2.06,.18,M.red)}
 for(const x of [-1.02,1.02]){box(p,.20,.58,.20,x,1.28,.34,M.stone);ball(p,.08,x,1.62,.34,M.gold)}
 box(p,1.34,.06,.18,0,1.12,.18,M.stone);box(p,1.04,.05,.12,0,1.20,-.18,M.wood);
}
// 6 - authentic samovar GLB, no temporary model.
// 7 - merchant table / writing table
{const p=artifacts[7];
 box(p,1.96,.12,1.08,0,1.50,0,M.wood);
 for(const x of [-.76,.76])for(const z of [-.40,.40])box(p,.10,.58,.12,x,1.17,z,M.woodLight);
 box(p,1.64,.09,.16,0,1.36,.46,M.woodLight);box(p,1.64,.09,.16,0,1.36,-.46,M.woodLight);
 box(p,.16,.09,.84,-.82,1.36,0,M.woodLight);box(p,.16,.09,.84,.82,1.36,0,M.woodLight);
 box(p,1.18,.02,.72,-.10,1.58,0,M.paper);
 for(let n=0;n<5;n++)tube(p,[[-.68+n*.22,1.595,-.18],[-.52+n*.22,1.595,.02],[-.36+n*.22,1.595,.22]],.010,n%2?M.red:M.metal);
 box(p,.16,.05,.16,.56,1.61,-.24,M.red);cy(p,.07,.08,.14,.62,1.67,.12,M.metal);
 for(const x of [.56,.63,.70])tube(p,[[x,1.72,.12],[x+.02,1.86,.12],[x+.03,1.96,.12]],.009,M.dark);
 box(p,.38,.03,.24,.42,1.60,.34,M.paper);box(p,.34,.02,.18,.44,1.63,.35,M.linen);
 box(p,.42,.03,.26,-.62,1.58,.28,M.woodLight);for(const x of [-.72,-.58]){cy(p,.055,.048,.08,x,1.64,.28,M.porcelain);ring(p,.035,.008,x+.03,1.68,.28,M.porcelain)}
}
// Camera with smooth motion between connected halls.
const state={room:0,item:0,targetX:0,lookX:0,yaw:0,tyaw:0,pitch:.06,tpitch:.06,zoom:9.5,tzoom:9.5};
function goRoom(room,item){state.room=room;state.item=item;state.targetX=room*regionSpacing;state.tyaw=0;state.tzoom=9.5;state.tpitch=.06;highlight()}
function goItem(item){state.item=item;const local=item%2===0?-2.45:2.45;state.targetX=state.room*regionSpacing+local*.72;state.tyaw=local<0?-.12:.12;state.tzoom=6.3;highlight()}
function highlight(){
 artifacts.forEach((object,i)=>object.scale.setScalar(i===state.item?1.035:1));
 // Guide the visitor's attention through real spotlights, not exaggerated
 // scaling of the artefact that could clip the glass enclosure.
 exhibitLights.forEach((lamp,i)=>{
  lamp.intensity=i===state.item?18:9;
  lamp.color.setHex(i===state.item?0xfff0d0:0xffdfb2);
 });
}
let inLobby=true;
function showLobby(){inLobby=true;state.room=-1;state.targetX=-19;state.tyaw=0;state.tzoom=9.5;state.tpitch=.08; if(lobbyOverlay)lobbyOverlay.hidden=false; lobbyButton?.setAttribute('aria-pressed','true');}
function leaveLobby(){inLobby=false;if(lobbyOverlay)lobbyOverlay.hidden=true;lobbyButton?.setAttribute('aria-pressed','false');}
const roomGo=goRoom;goRoom=function(room,item){leaveLobby();roomGo(room,item);document.dispatchEvent(new CustomEvent('museum-room-enter',{detail:room}))};
const itemGo=goItem;goItem=function(item){leaveLobby();itemGo(item);
 const exhibitRoom=Math.floor(item/2);
 document.dispatchEvent(new CustomEvent('museum-room-enter',{detail:exhibitRoom}));
};
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
// Live WebGL and resource diagnostics for reproducible mobile/desktop QA.
// Activated only by ?diagnostics=1; ordinary museum visitors see no new UI.
const audit={
 startedAt:performance.now(),
 getReport(){
  const canvas=renderer.domElement;
  const statuses=Object.fromEntries(Object.entries(assetStatus).map(([k,v])=>[k,{status:v,progress:assetPercent[k]}]));
  return {
   version:'5.1-QA',
   viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},
   webgl:{drawingBufferWidth:canvas.width,drawingBufferHeight:canvas.height,
      geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,
      calls:renderer.info.render.calls,triangles:renderer.info.render.triangles},
   selectedRoom:inLobby?'lobby':state.room+1,selectedExhibit:state.item+1,
   photosAttempted:museumPhotoLoaded.size,
   models:statuses,
   secondsSinceStart:Math.round((performance.now()-this.startedAt)/100)/10
  };
 }
};
window.__GTR_MUSEUM_AUDIT__=audit;
if(new URLSearchParams(location.search).has('diagnostics')){
 const wrapper=document.createElement('div');
 wrapper.style.cssText='position:absolute;right:14px;bottom:65px;z-index:20;max-width:min(360px,90vw);background:rgba(10,24,18,.95);color:#f5ecd8;padding:14px;border:1px solid #c6aa70;border-radius:14px;font:12px/1.5 system-ui;box-shadow:0 15px 30px #0007';
 const header=document.createElement('div');header.textContent='GTR · WebGL / mobile QA';header.style.fontWeight='bold';
 const actions=document.createElement('div');actions.style.cssText='display:flex;flex-wrap:wrap;gap:5px;margin:8px 0';
 const log=document.createElement('pre');log.style.cssText='max-height:185px;overflow:auto;white-space:pre-wrap;font:11px/1.4 ui-monospace,monospace';
 const buttons=[['Холл',-1],['Зал 1',0],['Зал 2',1],['Зал 3',2],['Зал 4',3]];
 for(const [label,index] of buttons){
  const button=document.createElement('button');button.textContent=label;button.style.cssText='background:#294c3b;color:white;border:1px solid #a18e66;border-radius:6px;padding:5px;cursor:pointer';
  button.addEventListener('click',()=>{
   if(index<0)showLobby();
   else goRoom(index,index*2);
   if(index>=0)document.dispatchEvent(new CustomEvent('museum-room-enter',{detail:index}));
   updateAudit();
  });
  actions.append(button);
 }
 function updateAudit(){log.textContent=JSON.stringify(audit.getReport(),null,2)}
 const copy=document.createElement('button');copy.textContent='Копировать отчёт';copy.style.cssText='color:#1c2a21;background:#e9d2a0;border:0;border-radius:7px;padding:7px;cursor:pointer';
 copy.addEventListener('click',()=>{const value=JSON.stringify(audit.getReport(),null,2);navigator.clipboard?.writeText(value).catch(()=>{});});
 wrapper.append(header,actions,log,copy);
 holder.parentElement.append(wrapper);
 setInterval(updateAudit,1300);updateAudit();
}

let prev=performance.now(),camX=-19,zoom=9.5,yaw=0,pitch=.06;
let onScreen=true;new IntersectionObserver(es=>onScreen=!!es[0]?.isIntersecting,{threshold:.02}).observe(holder);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Mobile devices may struggle with a full continuous 60fps scene.
let lastRendered=0,slowFrames=0;
const targetFrameMs=innerWidth<700?1000/40:1000/60;
function draw(t){
 requestAnimationFrame(draw);
 if(document.hidden||!onScreen){prev=t;lastRendered=t;return}
 if(lastRendered&&t-lastRendered<targetFrameMs)return;
 const elapsed=t-lastRendered;lastRendered=t;
 if(elapsed>38&&renderer.getPixelRatio()>1&&++slowFrames>70){
  renderer.setPixelRatio(Math.max(1,renderer.getPixelRatio()-.15));
  const rect=holder.getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);
  slowFrames=0;
 }else if(elapsed<=38)slowFrames=Math.max(0,slowFrames-2);
 const dt=Math.min(.05,(t-prev)/1000);prev=t;const k=1-Math.exp(-(reduced?14:3.8)*dt);camX+=(state.targetX-camX)*k;zoom+=(state.tzoom-zoom)*k;yaw+=(state.tyaw-yaw)*k;pitch+=(state.tpitch-pitch)*k;camera.position.set(camX+Math.sin(yaw)*zoom,3.1+pitch*3.6,Math.cos(yaw)*zoom+1.5);camera.lookAt(camX,1.70,-1);renderer.render(scene,camera)}requestAnimationFrame(draw);
showLobby();
}catch(err){
 console.error('3D scene initialisation failed',err);
 const fallback=document.getElementById('renderFallback')||Object.assign(document.createElement('div'),{className:'renderFallback'});
 const t=document.getElementById('fallbackText');
 const message=(UI[lang]?.unavailable||'Не удалось открыть 3D-музей')+'. Обновите страницу или проверьте подключение.';
 if(t)t.textContent=message;
 else fallback.textContent=message;
 holder.replaceChildren(fallback);
}}
