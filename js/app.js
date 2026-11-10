const IM={cap:"images/cappuccino.jpg",lat:"images/latte.jpg",bd:"images/birthday.jpg",logo:"images/logo.jpg"};
const MAP_Q="Kolkata, West Bengal"; /* change to the shop's address */
const ADMIN_PASS="cup2eat@admin"; /* change before launch */
const DEF=[
{id:1,c:"Coffee",n:"Classic Cappuccino Cup",d:"Double shot, steamed milk, chocolate-lined waffle cup.",p:149,im:"cap",on:1},
{id:2,c:"Coffee",n:"Latte Art Cup",d:"Smooth latte with a hand-poured heart.",p:169,im:"lat",on:1},
{id:3,c:"Coffee",n:"Cinnamon Cream Mocha",d:"Mocha topped with whipped cream and a cinnamon stick.",p:189,im:"cap",on:1},
{id:4,c:"Coffee",n:"Choco Rim Espresso",d:"Strong and short, with a thick dark chocolate rim.",p:129,im:"lat",on:1},
{id:5,c:"Dessert cups",n:"Birthday Sprinkle Cup",d:"Ice cream, rainbow sprinkles and a candle.",p:129,im:"bd",on:1},
{id:6,c:"Dessert cups",n:"Red Velvet Cup",d:"Red velvet crumble over vanilla cream.",p:159,im:"bd",on:1},
{id:7,c:"Dessert cups",n:"Tiramisu Scoop Cup",d:"Cocoa-dusted scoop with piped cream.",p:179,im:"bd",on:1},
{id:8,c:"Dessert cups",n:"Berry Cream Cup",d:"Whipped cream swirl with a fresh raspberry.",p:149,im:"bd",on:1}];
/* DATA LAYER: demo mode uses this browser's localStorage. Replace ld/sv with API calls when the backend is ready. */
const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let menu=ld("c2e_menu",DEF),orders=ld("c2e_orders",[]),qr=ld("c2e_qr",""),user=ld("c2e_user",null),cart={},cat="All",adm=false,tab="orders",otp="",tmr;
const $=s=>document.querySelector(s),money=n=>"₹"+n;
const total=()=>menu.reduce((s,i)=>s+(cart[i.id]||0)*i.p,0),count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
function toast(t,ms=3500){const e=$("#toast");e.textContent=t;e.style.display="block";clearTimeout(tmr);tmr=setTimeout(()=>e.style.display="none",ms)}
$("#map").src="https://www.google.com/maps?q="+encodeURIComponent(MAP_Q)+"&output=embed";
$("#mapl").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(MAP_Q);
function card(i){const q=cart[i.id]||0;return `<article class="item ${i.on?"":"off"}"><img src="${IM[i.im]}" alt="${i.n}" loading="lazy"><div class="b"><h3>${i.n}</h3><p>${i.d}</p><div class="r"><span class="price">${money(i.p)}</span>${!i.on?'<span class="note">Sold out</span>':q?`<div class="qty"><button data-m="${i.id}" aria-label="Remove one">−</button><b>${q}</b><button data-a="${i.id}" aria-label="Add one">+</button></div>`:`<button class="add" data-a="${i.id}">Add</button>`}</div></div></article>`}
function draw(){$("#cc").textContent=count();$("#feat").innerHTML=menu.filter(i=>i.on).slice(0,4).map(card).join("");
const cs=["All",...new Set(menu.map(i=>i.c))];$("#chips").innerHTML=cs.map(c=>`<button class="chip" aria-pressed="${c==cat}" data-cat="${c}">${c}</button>`).join("");
$("#mgrid").innerHTML=menu.filter(i=>cat=="All"||i.c==cat).map(card).join("");
$("#cl").innerHTML=count()?menu.filter(i=>cart[i.id]).map(i=>`<div class="row"><span>${i.n}<br><span class="note">${money(i.p)} each</span></span><div class="qty"><button data-m="${i.id}">−</button><b>${cart[i.id]}</b><button data-a="${i.id}">+</button></div></div>`).join("")+`<div class="row"><b>Total</b><b class="price">${money(total())}</b></div><p><button class="btn" style="width:100%" id="co">Checkout</button></p>`:'<p class="note">Your cart is empty. Add something from the menu.</p>'}
function route(){const h=location.hash.slice(1);const v=["menu","admin"].includes(h)?h:"home";document.querySelectorAll(".view").forEach(e=>e.classList.toggle("on",e.id=="v-"+v));if(v=="admin")drawAdmin();scrollTo(0,0)}
function modal(h){$("#mb").innerHTML=h;$("#modal").classList.add("on")}
const close=()=>document.querySelectorAll(".ov").forEach(o=>o.classList.remove("on"));
function authStep(){modal(`<h2>Log in to order</h2><p class="note">We’ll send a one-time code.</p><div class="tabs"><button class="chip" data-t="email" aria-pressed="true">Email</button><button class="chip" data-t="phone" aria-pressed="false">Phone</button></div><label id="al">Email address</label><input id="aid" autocomplete="email" inputmode="email"><button class="btn" style="width:100%" id="so">Send OTP</button>`)}
function payStep(){const t=total();modal(`<h2>Pay by QR</h2><p>Amount to pay: <b class="price">${money(t)}</b></p>${qr?`<img class="qr" src="${qr}" alt="Payment QR">`:'<div class="qr">Shop QR will appear here.</div>'}<p class="note">Scan with any UPI app, pay the exact amount, then fill the details below.</p><label>Your name</label><input id="pn" autocomplete="name">${user.type=="phone"?'<label>Email for order confirmation</label><input id="pe" inputmode="email" autocomplete="email">':""}<label>Table number or delivery address</label><input id="pa"><label>UPI transaction ID (optional)</label><input id="pu"><button class="btn" style="width:100%" id="po">I’ve paid, place order</button>`)}
document.addEventListener("click",e=>{const t=e.target.closest("button,a");if(!t)return;const d=t.dataset;
if(d.a){cart[d.a]=(cart[d.a]||0)+1;draw()}
if(d.m){cart[d.m]=(cart[d.m]||1)-1;if(!cart[d.m])delete cart[d.m];draw()}
if(d.cat){cat=d.cat;draw()}
if(t.id=="cb"){$("#drawer").classList.add("on")}
if("close"in d||e.target.classList.contains("ov"))close();
if(t.id=="co"){close();user?payStep():authStep()}
if(d.t){document.querySelectorAll("[data-t]").forEach(b=>b.setAttribute("aria-pressed",b==t));$("#al").textContent=d.t=="email"?"Email address":"Phone number (10 digits)";$("#aid").value="";$("#aid").inputMode=d.t=="email"?"email":"tel"}
if(t.id=="so"){const v=$("#aid").value.trim(),ph=document.querySelector("[data-t][aria-pressed=true]").dataset.t=="phone";
if(ph?!/^\d{10}$/.test(v):!/^\S+@\S+\.\S+$/.test(v))return toast(ph?"Enter a 10-digit phone number.":"Enter a valid email address.");
otp=String(Math.floor(100000+Math.random()*900000));window._u={id:v,type:ph?"phone":"email"};
modal(`<h2>Enter OTP</h2><p class="note">Code sent to ${v}.</p><input id="oi" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><button class="btn" style="width:100%" id="vo">Verify</button>`);
toast("Demo mode: your OTP is "+otp,12000)}
if(t.id=="vo"){if($("#oi").value.trim()!==otp)return toast("Wrong code. Check the OTP and try again.");user=window._u;sv("c2e_user",user);toast("Logged in.");payStep()}
if(t.id=="po"){const n=$("#pn").value.trim(),a=$("#pa").value.trim(),em=user.type=="phone"?$("#pe").value.trim():user.id;
if(!n||!a)return toast("Add your name and table or address.");if(!/^\S+@\S+\.\S+$/.test(em))return toast("Enter a valid email for the confirmation.");
const o={id:"C2E"+String(Date.now()).slice(-6),name:n,contact:user.id,email:em,note:a,utr:$("#pu").value.trim(),items:menu.filter(i=>cart[i.id]).map(i=>({n:i.n,q:cart[i.id],p:i.p})),total:total(),st:"new",t:Date.now()};
orders.unshift(o);sv("c2e_orders",orders);cart={};draw();modal(`<h2>Order received</h2><p>Thank you, ${n}! Your order <b>${o.id}</b> is with us. We’ll check your payment and email <b>${em}</b> once it’s delivered.</p><button class="btn" data-close>Done</button>`)}
/* admin */
if(t.id=="al2"){if($("#ap").value===ADMIN_PASS){adm=true;drawAdmin()}else toast("Wrong password.")}
if(d.tab){tab=d.tab;drawAdmin()}
if(d.dl){const o=orders.find(x=>x.id==d.dl);o.st="done";sv("c2e_orders",orders);mail(o);drawAdmin()}
if(d.tg){const i=menu.find(x=>x.id==d.tg);i.on=i.on?0:1;sv("c2e_menu",menu);drawAdmin();draw()}
if(d.out){adm=false;drawAdmin()}});
/* BACKEND HOOK: replace with a real email call (SMTP, Resend, etc.) */
function mail(o){toast("Delivery confirmation emailed to "+o.email,5000);console.log("EMAIL to",o.email,"Order",o.id,"delivered")}
function drawAdmin(){const a=$("#adm");if(!adm){a.innerHTML='<h2>Admin login</h2><div style="max-width:22rem"><label>Password</label><input id="ap" type="password" autocomplete="current-password"><button class="btn" id="al2">Log in</button></div>';return}
const tb=(k,l)=>`<button class="chip" data-tab="${k}" aria-pressed="${tab==k}">${l}</button>`;let h=`<h2>Admin</h2><div class="chips" style="margin-top:1rem">${tb("orders","Orders ("+orders.filter(o=>o.st=="new").length+" new)")}${tb("menu","Menu")}${tb("set","Settings")}<button class="chip" data-out="1">Log out</button></div>`;
if(tab=="orders")h+=orders.length?orders.map(o=>`<div class="ord"><div class="row" style="border:0"><b>${o.id}</b><span class="tag ${o.st=="done"?"d":""}">${o.st=="done"?"Delivered":"New"}</span></div><div class="note">${new Date(o.t).toLocaleString()} · ${o.name} · ${o.contact}<br>${o.email} · ${o.note}${o.utr?"<br>UTR: "+o.utr:""}</div>${o.items.map(i=>`<div class="row"><span>${i.q} × ${i.n}</span><span>${money(i.q*i.p)}</span></div>`).join("")}<div class="row" style="border:0"><b>Total ${money(o.total)}</b>${o.st=="new"?`<button class="add" data-dl="${o.id}">Mark delivered + send email</button>`:""}</div></div>`).join(""):'<p class="note">No orders yet. New orders appear here.</p>';
if(tab=="menu")h+=menu.map(i=>`<div class="row"><span>${i.n}<br><span class="note">${money(i.p)}</span></span><button class="chip" data-tg="${i.id}">${i.on?"Available":"Sold out"}</button></div>`).join("");
if(tab=="set")h+=`<div style="max-width:24rem"><label>Upload your payment QR</label><input type="file" id="qf" accept="image/*">${qr?`<img class="qr" src="${qr}" alt="Current QR">`:""}<p class="note">Customers see this QR at checkout.</p></div>`;
a.innerHTML=h;const f=$("#qf");if(f)f.onchange=()=>{const r=new FileReader();r.onload=()=>{qr=r.result;sv("c2e_qr",qr);drawAdmin();toast("QR saved.")};r.readAsDataURL(f.files[0])}}
addEventListener("hashchange",route);draw();route();
