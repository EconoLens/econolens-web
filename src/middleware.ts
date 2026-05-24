import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
const rl=new Map<string,{c:number,r:number}>();
function rlCheck(ip:string,p:string){const k=ip+":"+( p.split("/")[1]||"");const max=p.startsWith("/api/ai")?5:p.startsWith("/api/")?20:60;const now=Date.now();let e=rl.get(k);if(e===undefined||now>e.r){e={c:0,r:now+60000};rl.set(k,e)}e.c++;return e.c<=max}
const BOT=[/sqlmap/i,/nikto/i,/nmap/i,/masscan/i,/acunetix/i,/nessus/i,/openvas/i];
const SP=[/\.\.\//, /\.(php|asp|aspx)$/i,/wp-admin/i,/\.env|\.git/i,/union\s+select/i];
const prot=createRouteMatcher(["/dashboard(.*)","/api/ai(.*)","/api/user(.*)","/api/payment(.*)"]); 
const pub=createRouteMatcher(["/","/sign-in(.*)","/sign-up(.*)","/article(.*)","/api/news(.*)","/api/indicators(.*)","/api/health","/api/research(.*)","/research(.*)","/pricing(.*)","/about(.*)","/contact(.*)","/privacy(.*)","/terms(.*)","/404(.*)","/500(.*)","/error(.*)"]);
export default clerkMiddleware(async(auth,req:NextRequest)=>{
  const ip=req.headers.get("x-real-ip")??req.headers.get("x-forwarded-for")?.split(",")[0].trim()??"?";
  const p=req.nextUrl.pathname,ua=req.headers.get("user-agent")??""
  if(BOT.some(b=>b.test(ua)))return new NextResponse("Forbidden",{status:403});
  if(SP.some(s=>s.test(p)))return new NextResponse("Not Found",{status:404});
  if(rlCheck(ip,p)===false)return new NextResponse("Too Many Requests",{status:429,headers:{"Retry-After":"60"}});
  if(prot(req)&&pub(req)===false)await auth.protect();
  return NextResponse.next();
});
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};