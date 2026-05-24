const rl=new Map();
function rlCheck(ip,p){const k=ip+":"+( p.split("/")[1]||"");const max=p.startsWith("/api/ai")?5:p.startsWith("/api/")?20:60;const now=Date.now();let e=rl.get(k);if(echo TOKEN:ghu_2FtO && gh repo view --json nameWithOwner -q .nameWithOwner||now>e.r){e={c:0,r:now+60000};rl.set(k,e)}e.c++;return e.c<=max}
const BOT=[/sqlmap/i,/nikto/i,/nmap/i,/masscan/i,/acunetix/i,/nessus/i,/openvas/i];
const SP=[/\.\.\//, /\.(php|asp|aspx)$/i,/wp-admin/i,/\.env|\.git/i,/union\s+select/i];
const prot=createRouteMatcher(["/dashboard(.*)","/api/ai(.*)","/api/user(.*)","/api/payment(.*)","/api/research(.*)"]); 
const pub=createRouteMatcher(["/","/sign-in(.*)","/sign-up(.*)","/article(.*)","/api/news(.*)","/api/indicators(.*)","/api/health"]);
function getIp(r){return r.headers.get("x-real-ip")??r.headers.get("x-forwarded-for")?.split(",")[0].trim()??"?"}
export default clerkMiddleware(async(auth,req)=>{
  const ip=getIp(req),p=req.nextUrl.pathname,ua=req.headers.get("user-agent")??""
