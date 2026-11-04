import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createMetaFeed } from './meta.mjs';
const metaFeed = createMetaFeed();
const port = Number(process.env.PORT || 3000);
const files = {'/':'index.html','/app.js':'app.js','/style.css':'style.css','/meta-ui.js':'meta-ui.js'};
const types = {'html':'text/html; charset=utf-8','js':'text/javascript; charset=utf-8','css':'text/css; charset=utf-8'};
http.createServer(async (req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/api/meta/feed'){
  if(req.method!=='GET'){res.writeHead(405,{'Allow':'GET'});res.end();return;}
  try{const feed=await metaFeed();res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(feed));}catch{res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({status:'error',items:[],message:'Service momentanément indisponible.'}));}return;
 }
 const file=files[pathname];
 if(!file){res.writeHead(404);res.end('Introuvable');return;}
 try {const body=await readFile(new URL(file,import.meta.url));res.writeHead(200,{'Content-Type':types[file.split('.').pop()],'X-Content-Type-Options':'nosniff'});res.end(body);}catch{res.writeHead(500);res.end('Erreur serveur');}
}).listen(port,'0.0.0.0',()=>console.log(`CEM Pulse démarré sur le port ${port}`));
