/* Tea Road offline resource cache v3.
 * Avoid serving obsolete JS/CSS after the new responsive home is deployed.
 */
const CACHE='great-tea-road-static-v3';
const PREFIX='great-tea-road-static-';
self.addEventListener('install',event=>{self.skipWaiting();});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(n=>n.startsWith(PREFIX)&&n!==CACHE).map(n=>caches.delete(n)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin||req.mode==='navigate')return;
 if(!/\.(?:jpg|jpeg|png|avif|webp|svg|css|js|mp3|woff2?)$/i.test(url.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req);
  // Prefer fresh language/UI code to prevent old site versions from sticking.
  if(/\.(?:js|css)$/i.test(url.pathname)){
    try{
      const live=await fetch(req);
      if(live.ok&&live.type!=='opaque')cache.put(req,live.clone()).catch(()=>{});
      return live;
    }catch(_e){return cached||Response.error();}
  }
  // Local images and audio can render immediately while refreshing in background.
  const live=fetch(req).then(response=>{
    if(response.ok&&response.type!=='opaque')cache.put(req,response.clone()).catch(()=>{});
    return response;
  }).catch(()=>null);
  if(cached){event.waitUntil(live);return cached;}
  return await live||Response.error();
 })());
});
