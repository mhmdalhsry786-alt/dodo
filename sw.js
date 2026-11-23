// كاش بسيط: يخلي التطبيق يفتح حتى بلا إنترنت (الواجهة فقط، لا يخزّن التوجيه)
var C='dodo-shell-v1';
var F=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);
  // لا تتدخل في الاتصال بالسيرفر أو القناة
  if(u.hostname.indexOf('ntfy.sh')>=0 || e.request.url.indexOf('/?invite=')>=0) return;
  e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request)}));
});
