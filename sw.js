/* sw v3 — يحفظ الهيكل فقط، ولا يتدخل في أي اتصال بالسيرفر */
var C='dodo-v3';
var F=['./calm.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);
  /* لا تلمس: القناة، النفق، الشبكة المحلية */
  if(u.hostname.indexOf('ntfy.sh')>=0) return;
  if(u.hostname.indexOf('trycloudflare.com')>=0) return;
  if(/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)) return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(function(r){return r}).catch(function(){
      return caches.match('./calm.html');
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request)}));
});
