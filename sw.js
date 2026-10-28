const CACHE='great-tea-road-static-v1';
self.addEventListener('install',event=>{self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim());});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 const u=new URL(req.url);
 if(req.mode==='navigate')return;
 if(!/\.(?:jpg|jpeg|png|webp|svg|css|js|mp3|woff2?)$/i.test(u.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req);
  const live=fetch(req).then(response=>{
   if(response.ok&&response.type!=='opaque')cache.put(req,response.clone()).catch(()=>{});
   return response;
  }).catch(()=>null);
  if(cached){event.waitUntil(live);return cached;}
  return await live||Response.error();
 })());
});
