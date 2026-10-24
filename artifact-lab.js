// Great Tea Road 2.0: original, historically inspired models (not artifact scans).
const host=document.getElementById("view");let T;
try{T=await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js")}catch(e){document.getElementById("loading").textContent="Three.js / WebGL unavailable. Object descriptions remain accessible.";console.warn(e)}
if(T){try{
const scene=new T.Scene();scene.background=new T.Color("#25332b");
const camera=new T.PerspectiveCamera(42,1,.01,120);
const renderer=new T.WebGLRenderer({antialias:true,powerPreference:"high-performance",alpha:false});
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.48;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));
host.replaceChildren(renderer.domElement);
scene.add(new T.HemisphereLight(0xf8f3e4,0x536253,2.45));
const key=new T.DirectionalLight(0xffe7c0,3.6);key.position.set(-4,8,7);scene.add(key);const rim=new T.DirectionalLight(0xb5d5ce,2.1);rim.position.set(5,5,-5);scene.add(rim);
const fill=new T.PointLight(0xe0b77c,38,14);fill.position.set(2,4,3);scene.add(fill);
const std=(color,rough=.75,metal=0,map)=>new T.MeshStandardMaterial({color,roughness:rough,metalness:metal,...(map?{map}: {})});
function texture(base,contrast,grain,seed){const canvas=document.createElement("canvas");canvas.width=canvas.height=256;const c=canvas.getContext("2d");c.fillStyle=base;c.fillRect(0,0,256,256);let n=seed;const rand=()=>((n=(n*1664525+1013904223)>>>0)/4294967296);for(let i=0;i<grain;i++){c.fillStyle=contrast;c.globalAlpha=.025+rand()*.09;const x=rand()*256,y=rand()*256;const w=2+rand()*42,h=1+rand()*5;c.fillRect(x,y,w,h)}c.globalAlpha=1;const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t}
const tea=std("#8a7754",.99,0,texture("#675032","#d1bb87",3000,121)),
wood=std("#e1bb83",.84,0,texture("#98714a","#302417",2100,122)),
paper=std("#f0e0b9",.92,0,texture("#e7d6ae","#877357",2200,123)),
linen=std("#cab28d",.98,0,texture("#b6a080","#55452a",2600,124)),
copper=std("#d79f62",.25,.77),brass=std("#e3bf7e",.22,.78),iron=std("#5b6666",.45,.68),dark=std("#49382a",.83),stone=std("#aeb09f",1),red=std("#a94738",.73),ink=std("#3c3d35",.96),glaze=std("#f8f1d9",.20,.02);
const box=(g,w,h,d,x,y,z,m)=>{let o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o};
const ball=(g,r,x,y,z,m,s=18)=>{let o=new T.Mesh(new T.SphereGeometry(r,s,12),m);o.position.set(x,y,z);g.add(o);return o};
const cyl=(g,a,b,h,x,y,z,m,seg=24)=>{let o=new T.Mesh(new T.CylinderGeometry(a,b,h,seg),m);o.position.set(x,y,z);g.add(o);return o};
const ring=(g,r,t,x,y,z,m,axis="z")=>{let o=new T.Mesh(new T.TorusGeometry(r,t,10,28),m);o.position.set(x,y,z);if(axis==="x")o.rotation.y=Math.PI/2;else if(axis==="y")o.rotation.x=Math.PI/2;g.add(o);return o};
const cone=(g,r,h,x,y,z,m,sides=8)=>{let o=new T.Mesh(new T.ConeGeometry(r,h,sides),m);o.position.set(x,y,z);g.add(o);return o};
const line=(g,pts,m,r=.015)=>{const curve=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));const o=new T.Mesh(new T.TubeGeometry(curve,Math.max(12,pts.length*7),r,6,false),m);g.add(o);return o};
const plaque=(g,w,h,x,y,z,mat=paper)=>box(g,w,h,.012,x,y,z,mat);
const exhibit=new T.Group();scene.add(exhibit);
function make(i){exhibit.clear();const g=new T.Group();exhibit.add(g);
if(i===0){ // pressed bricks with fibres, relief and bindings
for(let n=0;n<4;n++){let y=n*.26-.38;box(g,2,.23,1.22,0,y,0,tea);for(let k=0;k<45;k++){let a=(k*37+n*11)%100/100,b=(k*71+n*19)%100/100;box(g,.018,.004,.028,-.95+a*1.9,y+.12,-.55+b*1.1,paper)}}for(let x of [-.55,.55])box(g,.13,1.08,1.27,x,0,0,linen);plaque(g,.6,.36,0,.53,.58,paper);for(let x of [-.18,.0,.18])box(g,.034,.22,.01,x,.53,.592,ink);box(g,2.23,.11,1.45,0,-.61,0,wood)}
if(i===1){for(let k=0;k<3;k++){let x=(k-1)*1.2;const h=[1.05,1.5,.85][k];box(g,1.05,h,.92,x,h/2-.5,0,wood);for(let z of [-.47,.47])for(let y of [-.34,.20])box(g,1.09,.055,.035,x,h/2-.5+y,z,iron);for(let xx of [-.46,.46])box(g,.04,h,.96,x+xx,h/2-.5,0,iron);plaque(g,.5,.3,x,h/2-.35,.482,paper);for(let j=0;j<3;j++)box(g,.035,.2,.015,x-.14+j*.14,h/2-.34,.493,ink)}}
if(i===2){ // three stylized pack camels on sand track
box(g,5,.15,2.15,0,-1.25,0,stone);let cam=std("#9f7857",.97);function camel(x,z,sc){let c=new T.Group();c.position.set(x,-.69,z);c.scale.setScalar(sc);g.add(c);ball(c,.52,0,.8,0,cam);ball(c,.31,-.14,1.22,0,cam);ball(c,.28,.32,1.14,0,cam);line(c,[[.29,1.02,0],[.53,1.43,.05],[.79,1.56,.06]],cam,.12);ball(c,.18,.85,1.52,.06,cam);for(let xx of [-.32,.28])for(let zz of [-.23,.23]){let leg=cyl(c,.075,.068,.83,xx,.15,zz,cam);leg.rotation.z=xx<0?.08:-.08}for(let zz of [-.4,.4])box(c,.62,.48,.39,-.05,1.0,zz,linen);box(c,.88,.1,.8,-.06,1.24,0,wood);line(c,[[-.45,1.27,-.50],[.55,1.22,-.48],[.55,1.1,.46]],dark,.017)}camel(-1.6,-.15,.76);camel(0,.17,.95);camel(1.67,-.1,.76)}
if(i===3){box(g,3.55,.12,1.8,0,-.87,0,wood);cyl(g,.58,.45,1.44,0,.05,0,copper,48);cyl(g,.69,.65,.08,0,.82,0,brass);cyl(g,.40,.40,.12,0,.94,0,copper);cyl(g,.11,.1,.22,0,1.1,0,brass);for(let s of [-1,1]){ring(g,.42,.065,s*.66,.21,0,brass,"x");line(g,[[s*.66,.17,.2],[s*.8,.20,.2],[s*.80,.32,.2]],iron,.04)}let tap=cyl(g,.075,.075,.68,0,-.10,.81,brass);tap.rotation.x=Math.PI/2;ball(g,.13,0,-.1,1.18,brass);for(let x of [-1.1,1.15]){cyl(g,.26,.18,.38,x,-.5,.24,glaze);ring(g,.26,.025,x,-.31,.24,brass,"y");ring(g,.14,.03,x+.27,-.43,.24,glaze,"x")}}
if(i===4){ // trading shop with tiered roof
box(g,4,.16,2.5,0,-.88,0,stone);box(g,3.24,1.85,1.64,0,.13,-.21,wood);box(g,3.7,.16,2.2,0,1.15,-.26,dark);for(let x of [-1.61,1.61])cyl(g,.09,.09,2.2,x,.14,.87,red);for(let y of [-.48,-.02,.43])box(g,2.8,.075,.57,0,y,-.11,paper);for(let x of [-1,0,1])for(let y of [-.30,.18])box(g,.55,.34,.42,x,y,-.02,linen);box(g,3.25,.14,.8,0,-.32,1.0,wood);box(g,1.3,.5,.16,0,1.0,.78,red);for(let x of [-.34,-.1,.14,.38])box(g,.025,.32,.02,x,1.0,.875,brass);for(let x of [-1.15,1.15])ball(g,.16,x,.78,.87,red);for(let x of [-1.25,1.25])cone(g,.2,.21,x,1.3,.40,brass)}
if(i===5){box(g,4.1,.18,1.8,0,-1.05,0,stone);for(let x of [-1.55,1.55]){box(g,.42,2.4,.44,x,.10,0,stone);cyl(g,.29,.29,.18,x,1.4,0,brass)}box(g,3.5,.24,.65,0,1.4,0,wood);box(g,2.6,1.68,.10,0,.40,-.42,red);for(let x of [-1.15,1.15])box(g,.25,1.5,.14,x,.20,-.41,wood);for(let j=0;j<4;j++)box(g,.04,.14,.02,-.35+j*.23,1.4,.35,brass)}
if(i===6){for(let k=0;k<3;k++){let x=(k-1)*1.3;let sack=new T.Group();sack.position.x=x;g.add(sack);let body=cyl(sack,.4,.48,.95,0,-.25,0,linen,11);ball(sack,.39,0,.22,0,linen,12);cyl(sack,.14,.23,.13,0,.53,0,dark);line(sack,[[-.28,.22,.22],[.26,.18,.3],[.30,-.15,.3]],wood,.04);box(sack,.32,.23,.01,0,-.08,.46,paper)}box(g,4.25,.12,1.65,0,-.84,0,wood)}
if(i===7){box(g,3.8,.14,2.2,0,-.78,0,wood);box(g,3.1,.12,1.5,0,-.3,0,wood);for(let x of [-1.25,1.25])for(let z of [-.55,.55])cyl(g,.08,.08,.4,x,-.55,z,dark);box(g,2.14,.015,1.1,-.24,-.22,.04,paper);for(let n=0;n<5;n++){line(g,[[-1.1+n*.24,-.196,-.30],[-.65+n*.22,-.194,.04],[-.35+n*.27,-.193,.39]],n%2?red:ink,.01)}cyl(g,.21,.14,.35,1.28,.02,-.26,iron);cone(g,.17,.22,1.28,.29,-.26,ink);box(g,.72,.40,.52,1.12,-.02,.44,wood);cyl(g,.29,.28,.84,-1.25,.10,.32,paper);cyl(g,.34,.34,.045,-1.25,.56,.32,linen)}
g.position.y=0;return g}
let selected=window.objectIndex?.()||0;make(selected);
let yaw=.45,pitch=.20,dist=8.0,desiredYaw=.45,desiredPitch=.20,desiredDist=8.0,auto=false,drag=false,lastX=0,lastY=0;
const clamp=(v,l,h)=>Math.min(h,Math.max(l,v));
function setSize(){const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}new ResizeObserver(setSize).observe(host);setSize();
const canvas=renderer.domElement;
canvas.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener("pointermove",e=>{if(!drag)return;desiredYaw+=(e.clientX-lastX)*.008;desiredPitch=clamp(desiredPitch+(e.clientY-lastY)*.006,-1.15,1.15);lastX=e.clientX;lastY=e.clientY});
canvas.addEventListener("pointerup",()=>drag=false);canvas.addEventListener("pointercancel",()=>drag=false);
canvas.addEventListener("wheel",e=>{e.preventDefault();desiredDist=clamp(desiredDist+e.deltaY*.012,4.1,14)},{passive:false});
document.getElementById("zoomIn").onclick=()=>desiredDist=clamp(desiredDist-.85,4.1,14);
document.getElementById("zoomOut").onclick=()=>desiredDist=clamp(desiredDist+.85,4.1,14);
document.getElementById("reset").onclick=()=>{desiredYaw=.45;desiredPitch=.2;desiredDist=8};
document.getElementById("auto").onclick=()=>{auto=!auto;document.getElementById("auto").setAttribute("aria-pressed",String(auto))};
window.set3DObject=i=>{selected=i;make(i);desiredYaw=.45;desiredPitch=.20;desiredDist=i===2||i===4?10:8};
let prev=performance.now();
function frame(now){requestAnimationFrame(frame);let dt=Math.min(.055,(now-prev)/1000);prev=now;let k=1-Math.exp(-8*dt);if(auto&&!drag)desiredYaw+=dt*.34;yaw+=(desiredYaw-yaw)*k;pitch+=(desiredPitch-pitch)*k;dist+=(desiredDist-dist)*k;exhibit.rotation.set(pitch,yaw,0);camera.position.set(0,1.1,dist);camera.lookAt(0,0,0);renderer.render(scene,camera)}requestAnimationFrame(frame);
}catch(e){console.error(e);host.replaceChildren(Object.assign(document.createElement("div"),{className:"fallback",textContent:"3D rendering unavailable; exhibit descriptions remain accessible."}))}}
