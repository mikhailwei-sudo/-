/* Museum offline asset cache, version 1.
 * Cache original model binaries on demand. Never precache ~40 MB at install.
 * Audio range requests bypass this worker to preserve seeking on mobile.
 */
const CACHE='great-tea-road-3d-v1';
const MAX_SIZE=60*1024*1024;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{
 e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('great-tea-road-3d-')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||request.headers.has('Range'))return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin||!/\/v4\/assets\/models\/.*\.(?:glb|fbx|dae)$/i.test(url.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(request);
  if(cached)return cached;
  const response=await fetch(request);
  if(response.ok && response.type==='basic'){
   const len=Number(response.headers.get('content-length')||0);
   if(len>0&&len<=MAX_SIZE){
    try{await cache.put(request,response.clone())}catch(e){/* private browsing / quota */ }
   }
  }
  return response;
 })());
});
