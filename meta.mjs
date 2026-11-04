const TTL = 5 * 60 * 1000;
export function createMetaFeed({env = process.env, request = fetch, now = Date.now} = {}) {
 let cache, pending;
 const missing = () => [!env.META_ACCESS_TOKEN && 'META_ACCESS_TOKEN', !(env.META_IG_USER_ID || env.META_PAGE_ID) && 'META_IG_USER_ID ou META_PAGE_ID'].filter(Boolean);
 async function graph(id, edge, fields) {
  const version = env.META_GRAPH_VERSION || 'v23.0';
  if (!/^v\d+\.0$/.test(version) || !/^\d+$/.test(id)) throw new Error('configuration');
  const url = new URL(`https://graph.facebook.com/${version}/${id}/${edge}`);
  url.searchParams.set('fields', fields);url.searchParams.set('limit', '50');
  const res = await request(url, {headers:{Authorization:`Bearer ${env.META_ACCESS_TOKEN}`},signal:AbortSignal.timeout(15000)});
  if (!res.ok) throw new Error('upstream');
  const body = await res.json();if (!Array.isArray(body.data)) throw new Error('upstream');return body.data;
 }
 function safeLink(value) {try {const u=new URL(value);return u.protocol==='https:' && ['instagram.com','www.instagram.com','facebook.com','www.facebook.com','fb.watch'].includes(u.hostname) ? u.href : null;} catch {return null;}}
 async function load() {
  const jobs=[];
  if(env.META_IG_USER_ID)jobs.push(graph(env.META_IG_USER_ID,'media','id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count').then(rows=>rows.map(p=>({id:`ig-${p.id}`,platform:'Instagram',format:p.media_product_type==='REELS'?'Reel':p.media_type==='VIDEO'?'Vidéo':'Post',text:p.caption||'Publication sans légende',url:safeLink(p.permalink),publishedAt:p.timestamp,likes:p.like_count??null,comments:p.comments_count??null}))));
  if(env.META_PAGE_ID)jobs.push(graph(env.META_PAGE_ID,'published_posts','id,message,permalink_url,created_time,attachments{media_type},reactions.limit(0).summary(true),comments.limit(0).summary(true)').then(rows=>rows.map(p=>({id:`fb-${p.id}`,platform:'Facebook',format:'Post',text:p.message||'Publication sans texte',url:safeLink(p.permalink_url),publishedAt:p.created_time,likes:p.reactions?.summary?.total_count??null,comments:p.comments?.summary?.total_count??null}))));
  const results=await Promise.allSettled(jobs);const items=results.flatMap(r=>r.status==='fulfilled'?r.value:[]).filter(p=>p.url&&Number.isFinite(Date.parse(p.publishedAt))).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
  const failed=results.filter(r=>r.status==='rejected').length;
  if(failed===results.length)return {status:'error',items:[],message:'Collecte indisponible. Vérifiez les autorisations Meta, les identifiants, la validité du jeton et l’accès réseau.'};
  const result={status:failed?'partial':'connected',items,updatedAt:new Date(now()).toISOString(),message:failed?'Une source est indisponible. Seules les publications récupérées sont affichées.':null};cache={time:now(),result};return result;
 }
 return async () => {
  if(missing().length)return {status:'not_configured',items:[],missing:missing()};
  if(cache&&now()-cache.time<TTL)return cache.result;
  if(!pending)pending=load().finally(()=>{pending=null;});return pending;
 };
}
