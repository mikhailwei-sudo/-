// Great Tea Road 2.0 — procedural museum room.
// Modern schematic reconstructions only; no historical imagery is synthesized.
const host=document.getElementById("stage");
let T;
try{T=await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js")}catch(e){console.warn(e);window.onMuseumError?.()}
if(T){
try{
const scene=new T.Scene();scene.background=new T.Color("#33433b");scene.fog=new T.Fog("#33433b",13,29);
const camera=new T.PerspectiveCamera(60,1,.1,70);
const renderer=new T.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));renderer.outputColorSpace=T.SRGBColorSpace;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
host.append(renderer.domElement);document.getElementById("fallback").style.display="none";
const material=(color,metalness=0,roughness=.8)=>new T.MeshStandardMaterial({color,metalness,roughness});
const stone=material("#a5a28f"),plaster=material("#bcb9a8"),dark=material("#273a31"),timber=material("#5e4230"),brass=material("#ac8146",.45,.33),tea=material("#59462d"),glass=new T.MeshPhysicalMaterial({color:"#bac8b9",transparent:true,opacity:.22,roughness:.18,metalness:.06,depthWrite:false});
function block(w,h,d,x,y,z,m,parent=scene){const v=new T.Mesh(new T.BoxGeometry(w,h,d),m);v.position.set(x,y,z);parent.add(v);return v}
function sphere(r,x,y,z,m){const o=new T.Mesh(new T.SphereGeometry(r,20,12),m);o.position.set(x,y,z);scene.add(o);return o}
block(18,.25,15,0,-.16,-1.5,stone);block(18,7,.35,0,3.5,-9,plaster);block(.3,7,15,-9,3.5,-1.5,plaster);block(.3,7,15,9,3.5,-1.5,plaster);block(18,.22,15,0,7.05,-1.5,dark);
for(let i=-7;i<=7;i+=3.5){block(.12,5.6,.17,i,3,-8.76,timber);block(.65,.18,.55,i,6.87,-4.2,dark)}
scene.add(new T.HemisphereLight(0xffffff,0x455348,2.3));
for(let x of [-6,0,6]){const l=new T.SpotLight(0xfff1c9,45,16,Math.PI/4,.55,1.3);l.position.set(x,6.7,0);l.target.position.set(x,1,-5);scene.add(l,l.target)}
const exhibits=[];
const sites=[[-5,0,-5.8],[-1.6,0,-5.8],[1.8,0,-5.8],[5.2,0,-5.8]];
const plinthMat=material("#d3c3a2"),labelMat=material("#2a342d");
for(let i=0;i<4;i++){
 const [x,,z]=sites[i];let group=new T.Group();group.position.set(x,0,z);scene.add(group);
 block(2.4,1.05,1.5,0,.53,0,plinthMat,group);
 block(1.8,.12,.65,0,1.11,.28,labelMat,group);
 // Distinct simplified artifacts: border marker, merchant buildings, tea brick, caravan cargo.
 if(i===0){block(1.17,1.6,.52,0,1.9,-.13,timber,group);block(1.45,.18,.8,0,2.73,-.13,brass,group)}
 if(i===1){for(let x0 of [-.47,.47]){block(.7,1,.67,x0,1.58,-.07,timber,group);const roof=new T.Mesh(new T.ConeGeometry(.64,.58,4),brass);roof.position.set(x0,2.38,-.07);roof.rotation.y=Math.PI/4;group.add(roof)}}
 if(i===2){for(let y=0;y<3;y++){block(1.5,.22,.85,0,1.18+y*.25,-.12,tea,group);block(.95,.014,.016,0,1.18+y*.25,.32,brass,group)}}
 if(i===3){for(let x0 of [-.46,.46]){block(.8,.65,.76,x0,1.45,-.15,timber,group);block(.9,.08,.8,x0,1.83,-.15,brass,group)}}
 block(2.65,1.95,1.8,0,1.92,0,glass,group);
 // Transparent vitrine is deliberately schematic and is not a photogrammetric reproduction.
 group.userData.exhibit=i;exhibits.push(group);
}
const ray=new T.Raycaster(),mouse=new T.Vector2();
let yaw=0,desiredYaw=0,pitch=0,desiredPitch=0,distance=11.5,desiredDistance=11.5;
let dragging=false,travel=false,lastX=0,lastY=0,selectedIndex=0,focusX=0,targetFocusX=0;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function select(i){selectedIndex=i;targetFocusX=sites[i][0];desiredYaw=clamp((sites[i][0]/7)*.26,-.38,.38);desiredDistance=9.2}
window.focusExhibit=select;
const canvas=renderer.domElement;
canvas.addEventListener("pointerdown",e=>{dragging=true;travel=false;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener("pointermove",e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>2)travel=true;desiredYaw=clamp(desiredYaw-dx*.0045,-1.05,1.05);desiredPitch=clamp(desiredPitch+dy*.003,-.22,.4);lastX=e.clientX;lastY=e.clientY});
canvas.addEventListener("pointerup",e=>{dragging=false;if(travel)return;const r=canvas.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);let hits=ray.intersectObjects(exhibits,true);if(hits.length){let parent=hits[0].object;while(parent && parent.userData.exhibit===undefined)parent=parent.parent;if(parent?.userData.exhibit!==undefined)window.chooseMuseumExhibit?.(parent.userData.exhibit)}});
canvas.addEventListener("wheel",e=>{e.preventDefault();desiredDistance=clamp(desiredDistance+e.deltaY*.012,6,17)},{passive:false});
document.getElementById("left").onclick=()=>desiredYaw=clamp(desiredYaw-.23,-1.05,1.05);
document.getElementById("right").onclick=()=>desiredYaw=clamp(desiredYaw+.23,-1.05,1.05);
document.getElementById("near").onclick=()=>desiredDistance=clamp(desiredDistance-1,6,17);
document.getElementById("far").onclick=()=>desiredDistance=clamp(desiredDistance+1,6,17);
document.getElementById("reset").onclick=()=>{desiredYaw=0;desiredPitch=0;desiredDistance=11.5;targetFocusX=0};
const resize=()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};new ResizeObserver(resize).observe(host);resize();
const clock=new T.Clock();
function draw(){requestAnimationFrame(draw);const t=Math.min(.05,clock.getDelta()),k=1-Math.exp(-4*t);yaw+=(desiredYaw-yaw)*k;pitch+=(desiredPitch-pitch)*k;distance+=(desiredDistance-distance)*k;focusX+=(targetFocusX-focusX)*k;const centerX=focusX*.42;camera.position.set(centerX+Math.sin(yaw)*distance,3.2+pitch*5,3+Math.cos(yaw)*distance-4);camera.lookAt(centerX,2.2,-6);renderer.render(scene,camera)}draw();window.onMuseumReady?.();
}catch(error){console.error(error);window.onMuseumError?.()}
}