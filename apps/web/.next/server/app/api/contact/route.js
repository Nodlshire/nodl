(()=>{var e={};e.id=8746,e.ids=[8746],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},79646:e=>{"use strict";e.exports=require("child_process")},55511:e=>{"use strict";e.exports=require("crypto")},14985:e=>{"use strict";e.exports=require("dns")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},27910:e=>{"use strict";e.exports=require("stream")},34631:e=>{"use strict";e.exports=require("tls")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},73495:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>g,routeModule:()=>c,serverHooks:()=>l,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>x});var s={};t.r(s),t.d(s,{POST:()=>u});var o=t(31271),i=t(91232),n=t(18079),a=t(61238),p=t(41966);async function u(e){try{let{firstName:r,lastName:t,email:s,phone:o,message:i,inquiryTypes:n}=await e.json(),u=p.createTransport({host:"wnode.one",port:465,secure:!0,auth:{user:"team1@wnode.one",pass:"o$kNNdml4%,#"}}),c={from:"team1@wnode.one",to:"stephen@wnode.one",replyTo:s,subject:`[LEAD] ${r} ${t} - ${n.join(", ")}`,text:`
                Name: ${r} ${t}
                Email: ${s}
                Phone: ${o||"Not Provided"}
                Categories: ${n.join(", ")}
                
                Message:
                ${i}
            `,html:`
                <div style="font-family: sans-serif; max-width: 600px; color: #1c1c1e;">
                    <h2 style="color: #3b82f6;">New Contact Lead</h2>
                    <p><strong>Name:</strong> ${r} ${t}</p>
                    <p><strong>Email:</strong> ${s}</p>
                    <p><strong>Phone:</strong> ${o||"Not Provided"}</p>
                    <p><strong>Categories:</strong> ${n.join(", ")}</p>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; background: #f4f4f7; padding: 15px; rounded: 8px;">${i}</p>
                </div>
            `};return await u.sendMail(c),a.NextResponse.json({message:"Message Transmitted"},{status:200})}catch(e){return console.error("SMTP Error:",e),a.NextResponse.json({error:"Transmission Failed",details:e?.message},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/contact/route",pathname:"/api/contact",filename:"route",bundlePath:"app/api/contact/route"},resolvedPagePath:"/home/obregan/Documents/nodl/apps/web/app/api/contact/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:d,workUnitAsyncStorage:x,serverHooks:l}=c;function g(){return(0,n.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:x})}},87032:()=>{},80408:()=>{}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[6207,8048,1966],()=>t(73495));module.exports=s})();