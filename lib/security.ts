import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
export function sanitizeHtml(s:string){return String(s).replace(/[&<>"'/]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;","'':"&#x27;","/":"&#x2F;"}[c]??c))}
export function stripHtml(s:string){return String(s).replace(/<[^>]*>/g,"").replace(/&[a-z]+;/gi," ").trim()}
export function sanitizeQuery(s:string){return String(s).replace(/['";\`]/g,"").replace(/--|\/*|\*\//g,"").replace(/(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)/gi,"").slice(0,500).trim()}
const ss=(max=1000)=>z.string().max(max).transform(stripHtml);const se=z.string().email().max(254).toLowerCase().trim();
export const NewsSearchSchema=z.object({q:ss(200).optional(),category:z.enum(["monetary-policy","markets","trade","fiscal","global","india"]).optional(),page:z.coerce.number().int().min(1).max(50).default(1),limit:z.coerce.number().int().min(1).max(20).default(10)});
export const AiResearchSchema=z.object({query:ss(600).min(3),context:ss(2000).optional(),mode:z.enum(["summary","deep","indicators"]).default("summary")});
export const NewsletterSchema=z.object({email:se,name:ss(100).optional()});
export const PaymentSchema=z.object({plan:z.enum(["premium_monthly","premium_annual"]),userId:z.string().uuid(),currency:z.enum(["INR"]).default("INR")});
