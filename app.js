const WEBHOOK="https://firstsample.app.n8n.cloud/webhook/edumind-tutor";
const $=(s)=>document.querySelector(s);
const esc=(t)=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const PAGES=[["home","Home","⌂"],["tutor","AI Tutor","✦"],["learn","My Learning","▤"],["practice","Practice Zone","◎"],["plan","Study Planner","▦"],["progress","Progress","▲"],["library","Library","❏"],["profile","Profile","☺"]];
const st=load("em_state",{page:"home",theme:null,done:{},tasks:[true,false,false,false,false],saved:[],quiz:[],chat:[],filter:"All",lf:"All"});
st.theme=st.theme||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark");
const persist=()=>save("em_state",{...st,q:undefined});
const COURSES=[
{id:"c1",t:"Foundations of AI",d:"What AI is, how machines learn, and the key terms you will meet everywhere.",l:[["What is AI?",12],["History & milestones",15],["Types of learning",18],["Data basics",14]]},
{id:"c2",t:"Biological Neural Dynamics",d:"How real neurons fire, connect and inspired artificial networks.",l:[["The neuron",10],["Synapses",14],["Signals & spikes",16],["Brain vs network",12]]},
{id:"c3",t:"Neural Networks",d:"Layers, weights, activation functions and training with backpropagation.",l:[["Perceptrons",15],["Activations",12],["Backpropagation",25],["Gradient descent",20]]},
{id:"c4",t:"Representation Learning",d:"Embeddings, features and how models build useful internal representations.",l:[["Features",12],["Embeddings",18],["Autoencoders",22],["Transfer learning",16]]}];
const lessonKey=(c,i)=>c+"-"+i;
const cpct=(c)=>Math.round(c.l.filter((_,i)=>st.done[lessonKey(c.id,i)]).length/c.l.length*100);
const unlocked=(c,i)=>i===0||st.done[lessonKey(c.id,i-1)]||st.done[lessonKey(c.id,i)];
if(!st._init){["c1-0","c1-1","c1-2","c1-3","c2-0","c2-1","c2-2"].forEach(k=>st.done[k]=true);st._init=1;persist()}
const overall=()=>{const t=COURSES.reduce((a,c)=>a+c.l.length,0),d=Object.values(st.done).filter(Boolean).length;return[d,t,Math.round(d/t*100)]};
const QUIZ=[
{t:"Neural Networks",q:"What does an activation function do?",o:["Stores training data","Adds non-linearity to a neuron's output","Counts layers","Cleans the dataset"],a:1},
{t:"Neural Networks",q:"Backpropagation is used to…",o:["Compute gradients to update weights","Collect more data","Draw network diagrams","Shuffle labels"],a:0},
{t:"Foundations of AI",q:"Which is an example of supervised learning?",o:["Clustering customers","Training on labelled images","Reward-based game play","Dimensionality reduction"],a:1},
{t:"Biological Neurons",q:"Which part of a neuron receives signals?",o:["Axon","Dendrite","Myelin","Nucleus"],a:1},
{t:"Representation Learning",q:"An embedding is…",o:["A dense vector representing an item","A type of loss","A database index","A GPU setting"],a:0}];
const LIB=[
["Neural Networks Cheat Sheet","Notes","Two-page summary of layers, activations and loss functions."],["Backprop Step by Step","Videos","18 min walkthrough with worked numbers."],["Deep Learning (Goodfellow et al.)","Books","The standard reference text, free online."],["Activation Functions Practice Sheet","Practice sheets","20 problems with answers."],["Neuron Anatomy Notes","Notes","Diagrams and key terms for chapter 2."],["What Is Machine Learning?","Videos","12 min visual introduction."],["Hands-On ML","Books","Practical projects in Python."],["Embeddings Worksheet","Practice sheets","Compare vectors by similarity."]];
const WEEK=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TASKS=[["Watch: Backpropagation",25],["Quiz: Activations",15],["Read: Gradient descent notes",20],["Ask AI Tutor 3 doubts",10],["Review weak topics",15]];

function shell(){
 $("#side").innerHTML=`<div class="logo"><i>✦</i>EduMind AI</div>`+PAGES.map(([id,n,i])=>`<button class="nav ${st.page===id?"on":""}" data-go="${id}"><span>${i}</span>${n}</button>`).join("")+`<div class="sp"></div><button class="nav" id="th">${st.theme==="dark"?"☾ Dark mode":"☀ Light mode"}</button>`;
 $("#mob").innerHTML=[PAGES[0],PAGES[1],PAGES[2],PAGES[3],PAGES[4],PAGES[5]].map(([id,n,i])=>`<button class="${st.page===id?"on":""}" data-go="${id}"><b>${i}</b>${n.split(" ")[0]}</button>`).join("");
 $("#top").innerHTML=`<input id="gs" placeholder="Search lessons, topics, or ask a question…" aria-label="Search" value="${esc(st.q||"")}"><button class="ib" id="bell" aria-label="Notifications">🔔</button><button class="ib" id="th2" aria-label="Toggle theme">${st.theme==="dark"?"☾":"☀"}</button><button class="av" data-go="profile" aria-label="Profile">P</button>`;
}
function setTheme(t){document.documentElement.dataset.theme=t;st.theme=t;persist();shell();bind()}
const greet=()=>{const h=new Date().getHours();return h<12?"Good morning":h<18?"Good afternoon":"Good evening"};
const bar=(p)=>`<div class="bar"><b style="width:0" data-w="${p}"></b></div>`;

const V={
home(){const[d,t,p]=overall();
 const cur=COURSES.find(c=>cpct(c)<100)||COURSES[3];
 return`<div class="hero"><canvas id="cv"></canvas><h1>${greet()}, Pooja! 👋</h1><p class="mut" style="color:var(--tx)">Small steps every day lead to big dreams.</p>
 <div class="grid g3" style="margin-top:18px"><div class="card glow"><div class="mut">Your learning progress</div><h1>${p}%</h1>${bar(p)}</div>
 <div class="card glow row between"><div><div class="mut">Next up</div><h3>${esc(cur.t)}</h3><div class="mut">${cur.l.length-cur.l.filter((_,i)=>st.done[lessonKey(cur.id,i)]).length} lessons remaining</div></div><button class="btn" data-go="learn" aria-label="Continue">→</button></div></div></div>
 <div class="grid g4">${[["▶","Continue Learning","Pick up "+cur.t,"Resume lesson","learn"],["✦","Ask AI Tutor","Get instant help with your questions","Start chat","tutor"],["◎","Practice Zone","Test your knowledge with quizzes","Go to practice","practice"],["▦","Study Planner","Stay on track with your goals","View plan","plan"]].map(a=>`<div class="card glow tilt"><div class="row"><span class="av" style="border-radius:10px">${a[0]}</span><h3>${a[1]}</h3></div><p class="mut" style="margin:10px 0">${a[2]}</p><button class="btn s" data-go="${a[4]}">${a[3]}</button></div>`).join("")}</div>
 <div class="row between"><h2>Your learning journey</h2><button class="chip" data-go="learn">View all</button></div>
 <div class="grid g4">${COURSES.map((c,i)=>{const p=cpct(c);const s=p===100?"Completed":p>0?"Active":"Upcoming";return`<div class="card tilt ${s==="Active"?"glow":""}"><div class="mut">Chapter ${i+1}</div><h3>${c.t}</h3>${bar(p)}<div class="row between" style="margin-top:8px"><span>${p}%</span><span class="tag">${s}</span></div></div>`}).join("")}</div>
 <div class="grid g2"><div class="card"><h3>Your stats</h3><div class="grid g3" style="margin-top:12px"><div><div class="mut">Lessons</div><h2 style="margin:0">${d} / ${t}</h2></div><div><div class="mut">Accuracy</div><h2 style="margin:0">${acc()}%</h2></div><div><div class="mut">Streak</div><h2 style="margin:0">8 days 🔥</h2></div></div></div>
 <div class="card glow row"><div class="bot float">🤖</div><div><h3>Hi Pooja! 👋</h3><p class="mut">I'm your AI tutor. Ask me concepts, doubts or practice questions.</p><button class="btn" data-go="tutor" style="margin-top:8px">Start a conversation</button></div></div></div>`},
tutor(){return`<div class="card chat"><div class="row between"><div class="row"><div class="bot float">🤖</div><div><h3>AI Tutor</h3><div class="mut">Ask anything about your courses</div></div></div><button class="btn s" id="clr">Clear chat</button></div>
 <div class="msgs" id="msgs" aria-live="polite"></div>
 <div class="row" style="margin-top:8px">${["Explain a concept","Solve a doubt","Give practice questions","Explain with an example"].map(p=>`<button class="chip" data-p="${p}">${p}</button>`).join("")}</div>
 <div class="inp"><input id="ci" placeholder="Type your message…" aria-label="Message"><button class="btn" id="send">Send</button></div></div>`},
learn(){const q=(st.q||"").toLowerCase();
 const list=COURSES.filter(c=>(st.lf==="All"||(st.lf==="Completed"?cpct(c)===100:st.lf==="In progress"?cpct(c)>0&&cpct(c)<100:cpct(c)===0))&&(!q||(c.t+c.d+c.l.map(l=>l[0]).join()).toLowerCase().includes(q)));
 return`<h1>My Learning</h1><div class="row" style="margin:14px 0">${["All","In progress","Completed","Not started"].map(f=>`<button class="chip ${st.lf===f?"on":""}" data-lf="${f}">${f}</button>`).join("")}</div>
 <div class="grid g2">${list.map(c=>{const p=cpct(c);const nx=c.l.findIndex((_,i)=>!st.done[lessonKey(c.id,i)]);return`<div class="card glow"><h3>${c.t}</h3><p class="mut" style="margin:6px 0">${c.d}</p>${bar(p)}<div class="mut" style="margin:6px 0">${p}% complete</div>
 ${c.l.map((l,i)=>{const k=lessonKey(c.id,i),d=st.done[k],u=unlocked(c,i);return`<div class="chk ${d?"done":""}"><span style="flex:1">${u?(d?"✔":"▶"):"🔒"} ${l[0]} <span class="mut">· ${l[1]} min</span></span><button class="btn s" ${u?"":"disabled"} data-les="${k}">${d?"Undo":"Complete"}</button></div>`}).join("")}
 <button class="btn" style="margin-top:10px" ${nx<0?"disabled":""} data-les="${nx<0?"":lessonKey(c.id,nx)}">${nx<0?"Course complete":p?"Continue learning":"Start course"}</button></div>`}).join("")||`<p class="mut">No courses match. Try a different search or filter.</p>`}</div>`},
practice(){const q=st.quiz;if(!st.qs)st.qs={i:0,a:[]};const s=st.qs;
 if(s.i>=QUIZ.length)return summary();
 const cur=QUIZ[s.i],ans=s.a[s.i];
 return`<h1>Practice Zone</h1><p class="mut">Question ${s.i+1} of ${QUIZ.length}</p>${bar((s.i+1)/QUIZ.length*100)}
 <div class="card glow" style="margin-top:14px"><span class="tag">${cur.t}</span><h3 style="margin:10px 0">${cur.q}</h3>${cur.o.map((o,i)=>`<button class="opt ${ans!==undefined?(i===cur.a?"ok":i===ans?"no":""):""}" data-ans="${i}" ${ans!==undefined?"disabled":""}>${o}</button>`).join("")}
 ${ans!==undefined?`<p style="margin-top:12px">${ans===cur.a?"✅ Correct!":"❌ Not quite — the right answer is: "+esc(cur.o[cur.a])}</p>`:""}
 <div class="row between" style="margin-top:14px"><button class="btn s" id="qp" ${s.i===0?"disabled":""}>Previous</button><button class="btn" id="qn" ${ans===undefined?"disabled":""}>${s.i===QUIZ.length-1?"See results":"Next"}</button></div></div>`},
plan(){const dn=st.tasks.filter(Boolean).length,mins=TASKS.reduce((a,t,i)=>a+(st.tasks[i]?0:t[1]),0),today=(new Date().getDay()+6)%7;
 return`<h1>Study Planner</h1><div class="cal" style="margin:14px 0">${WEEK.map((d,i)=>`<div class="day ${i===today?"on":""}">${d}<br><b>${i+1+(new Date().getDate()-today-1)>0?new Date(Date.now()+(i-today)*864e5).getDate():""}</b></div>`).join("")}</div>
 <div class="grid g2"><div class="card glow"><h3>Today's goals</h3><div class="mut">${dn}/${TASKS.length} done · ${mins} min left</div>${bar(dn/TASKS.length*100)}
 ${TASKS.map((t,i)=>`<label class="chk ${st.tasks[i]?"done":""}"><input type="checkbox" data-task="${i}" ${st.tasks[i]?"checked":""}><span style="flex:1">${t[0]}</span><span class="mut">${t[1]} min</span></label>`).join("")}</div>
 <div class="card"><h3>Study streak</h3><h1>8 days 🔥</h1><p class="mut">Finish one task today to keep it going.</p><h3 style="margin-top:16px">Upcoming lessons</h3>${["Backpropagation · Today 4:00 PM","Gradient descent · Tomorrow","Representation Learning intro · Fri"].map(x=>`<div class="chk">${x}</div>`).join("")}</div></div>`},
progress(){const[d,t,p]=overall();const tp=topics();const pts=[40,48,52,58,61,70,p];
 const W=520,H=140,xy=pts.map((v,i)=>[i*(W/6),H-v*H/100]);
 return`<h1>Progress & Analytics</h1><div class="grid g4" style="margin:14px 0">${[["Overall",p+"%"],["Lessons",d+" / "+t],["Quiz accuracy",acc()+"%"],["Streak","8 days"]].map(x=>`<div class="card glow"><div class="mut">${x[0]}</div><h2 style="margin:4px 0 0">${x[1]}</h2></div>`).join("")}</div>
 <div class="grid g2"><div class="card"><h3>Progress over time</h3><svg viewBox="0 0 ${W} ${H+20}" style="width:100%"><polyline fill="none" stroke="var(--cy)" stroke-width="3" points="${xy.map(a=>a.join(",")).join(" ")}"/>${xy.map(a=>`<circle cx="${a[0]}" cy="${a[1]}" r="4" fill="var(--ac)"/>`).join("")}${["W1","W2","W3","W4","W5","W6","Now"].map((l,i)=>`<text x="${i*(W/6)}" y="${H+16}" fill="var(--tx2)" font-size="11" text-anchor="middle">${l}</text>`).join("")}</svg></div>
 <div class="card"><h3>Topic performance</h3>${tp.length?tp.map(x=>`<div style="margin-top:10px">${x.t} · ${x.p}%${bar(x.p)}</div>`).join(""):`<p class="mut">Take a quiz in Practice Zone to see topic scores.</p>`}</div></div>
 <div class="card glow" style="margin-top:14px"><h3>Recommendations</h3><p class="mut" style="margin-top:6px">${tp.filter(x=>x.p<70).map(x=>"Review "+x.t).join(", ")||"Finish Chapter 3 lessons, then try the Practice Zone quiz."}</p></div>`},
library(){const q=(st.q||"").toLowerCase();const cats=["All","Notes","Videos","Books","Practice sheets","Saved"];
 const l=LIB.filter(r=>(st.filter==="All"||(st.filter==="Saved"?st.saved.includes(r[0]):r[1]===st.filter))&&(!q||(r[0]+r[2]).toLowerCase().includes(q)));
 return`<h1>Library</h1><div class="row" style="margin:14px 0">${cats.map(c=>`<button class="chip ${st.filter===c?"on":""}" data-cat="${c}">${c}</button>`).join("")}</div>
 <div class="grid g3">${l.map(r=>`<div class="card tilt"><span class="tag">${r[1]}</span><h3 style="margin:8px 0">${r[0]}</h3><p class="mut">${r[2]}</p><div class="row" style="margin-top:12px"><button class="btn" data-ask="${esc(r[0])}">Ask tutor about it</button><button class="btn s" data-save="${esc(r[0])}">${st.saved.includes(r[0])?"★ Saved":"☆ Save"}</button></div></div>`).join("")||`<p class="mut">Nothing found. Clear the search or pick another category.</p>`}</div>`},
profile(){const[d,t,p]=overall();return`<h1>Profile</h1><div class="card glow row" style="margin-top:14px"><div class="av" style="width:64px;height:64px;font-size:26px">P</div><div><h3>Pooja S.</h3><div class="mut">Student · ${d}/${t} lessons · ${p}% progress</div></div></div>
 <div class="row" style="margin-top:14px"><button class="btn s" id="th3">Switch to ${st.theme==="dark"?"light":"dark"} mode</button><button class="btn s" id="reset">Reset all progress</button></div>`}};

function topics(){const m={};(st.qs?.a||[]).forEach((a,i)=>{const t=QUIZ[i].t;m[t]=m[t]||[0,0];m[t][1]++;if(a===QUIZ[i].a)m[t][0]++});return Object.entries(m).map(([t,[c,n]])=>({t,p:Math.round(c/n*100)})).sort((a,b)=>a.p-b.p)}
function acc(){const a=st.qs?.a||[];if(!a.length)return 78;return Math.round(a.filter((x,i)=>x===QUIZ[i].a).length/a.length*100)}
function summary(){const a=st.qs.a,c=a.filter((x,i)=>x===QUIZ[i].a).length,tp=topics();
 return`<h1>Practice Zone</h1><div class="card glow" style="margin-top:14px"><h2 style="margin-top:0">Score: ${c} / ${QUIZ.length}</h2>${bar(c/QUIZ.length*100)}<h3 style="margin-top:16px">By topic</h3>${tp.map(x=>`<div class="chk"><span style="flex:1">${x.t}</span><b>${x.p}%</b></div>`).join("")}
 <p class="mut" style="margin:12px 0">${tp.filter(x=>x.p<100).length?"Practise next: "+tp.filter(x=>x.p<100).map(x=>x.t).join(", "):"Perfect score! Move on to the next chapter."}</p><div class="row"><button class="btn" id="qr">Retake quiz</button><button class="btn s" data-go="tutor">Review with AI Tutor</button></div></div>`}

/* ---- AI tutor ---- */
const sid=load("em_sid",null)||(()=>{const s="s"+Math.random().toString(36).slice(2);save("em_sid",s);return s})();
const tm=()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
function md(t){return esc(t).replace(/^\s*[-*]\s+/gm,"• ").replace(/^#{1,4}\s*(.+)$/gm,"<b>$1</b>").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`([^`\n]+)`/g,"<code style='background:var(--bg);padding:1px 5px;border-radius:5px'>$1</code>")}
function renderMsgs(busy){const el=$("#msgs");if(!el)return;
 if(!st.chat.length&&!busy)el.innerHTML=`<div class="m a">Hi Pooja! 👋 What would you like to learn today?</div>`;
 else el.innerHTML=st.chat.map(m=>`<div class="m ${m.r==="u"?"u":"a"} ${m.err?"e":""}">${m.r==="u"||m.err?esc(m.t):md(m.t)}<small>${m.time}</small></div>`).join("")+(busy?`<div class="m a dots"><span></span><span></span><span></span></div>`:"");
 el.scrollTop=el.scrollHeight}
let busy=false;
async function send(text){text=(text||"").trim();if(!text||busy)return;
 busy=true;st.chat.push({r:"u",t:text,time:tm()});renderMsgs(true);$("#send").disabled=true;
 const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),60000);
 try{
  const r=await fetch(WEBHOOK,{method:"POST",headers:{"Content-Type":"application/json"},signal:ctl.signal,body:JSON.stringify({prompt:text,message:text,chatInput:text,question:text,sessionId:sid})});
  if(!r.ok)throw new Error("The tutor service returned status "+r.status+".");
  const raw=await r.text();let out=raw;
  try{const j=JSON.parse(raw);const o=Array.isArray(j)?j[0]:j;out=o.output||o.text||o.response||o.reply||o.answer||o.message||(typeof o==="string"?o:JSON.stringify(o))}catch{}
  if(!out||!String(out).trim())throw new Error("The tutor sent an empty reply. Check that the n8n workflow has a Respond to Webhook node.");
  st.chat.push({r:"a",t:String(out),time:tm()});
 }catch(e){
  const msg=e.name==="AbortError"?"The tutor took too long to respond. Try again.":(e instanceof TypeError?"Can't reach the AI tutor. Check your connection, and that the n8n workflow is active and allows requests from this page (CORS).":e.message);
  st.chat.push({r:"a",t:msg,time:tm(),err:1});
 }finally{clearTimeout(to);busy=false;persist();if($("#send"))$("#send").disabled=false;renderMsgs(false)}}

/* ---- render / events ---- */
function go(p){st.page=p;persist();render()}
function render(){shell();const v=$("#view");v.className="";void v.offsetWidth;v.className="page";v.innerHTML=V[st.page]();bind();
 requestAnimationFrame(()=>document.querySelectorAll("[data-w]").forEach(b=>b.style.width=b.dataset.w+"%"));
 if(st.page==="tutor")renderMsgs(busy);if(st.page==="home")particles()}
function bind(){
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
 [$("#th"),$("#th2"),$("#th3")].forEach(b=>b&&(b.onclick=()=>{setTheme(st.theme==="dark"?"light":"dark");if(st.page==="profile")render()}));
 const on=(s,f)=>document.querySelectorAll(s).forEach(f);
 $("#bell").onclick=()=>{const o=$("#pop");if(o)return o.remove();const d=document.createElement("div");d.className="pop";d.id="pop";d.innerHTML=`<b>Notifications</b><div>📘 Backpropagation lesson is ready</div><div>🔥 8-day streak — keep it up!</div><div>✦ Your AI tutor has new practice questions</div>`;document.body.appendChild(d)};
 $("#gs").oninput=e=>{st.q=e.target.value;const pos=e.target.selectionStart;if(["learn","library"].includes(st.page)){$("#view").innerHTML=V[st.page]();bind();requestAnimationFrame(()=>document.querySelectorAll("[data-w]").forEach(b=>b.style.width=b.dataset.w+"%"))}};
 $("#gs").onkeydown=e=>{if(e.key==="Enter"&&st.q){if(["learn","library"].includes(st.page))return;go("learn")}};
 on("[data-lf]",b=>b.onclick=()=>{st.lf=b.dataset.lf;persist();render()});
 on("[data-cat]",b=>b.onclick=()=>{st.filter=b.dataset.cat;persist();render()});
 on("[data-les]",b=>b.onclick=()=>{const k=b.dataset.les;if(!k)return;st.done[k]=!st.done[k];if(!st.done[k]){const[c,i]=k.split("-");COURSES.find(x=>x.id===c).l.forEach((_,j)=>{if(j>+i)delete st.done[lessonKey(c,j)]})}persist();render()});
 on("[data-ans]",b=>b.onclick=()=>{st.qs.a[st.qs.i]=+b.dataset.ans;persist();render()});
 if($("#qn"))$("#qn").onclick=()=>{st.qs.i++;persist();render()};
 if($("#qp"))$("#qp").onclick=()=>{st.qs.i--;persist();render()};
 if($("#qr"))$("#qr").onclick=()=>{st.qs={i:0,a:[]};persist();render()};
 on("[data-task]",b=>b.onchange=()=>{st.tasks[+b.dataset.task]=b.checked;persist();render()});
 on("[data-save]",b=>b.onclick=()=>{const t=b.dataset.save;st.saved=st.saved.includes(t)?st.saved.filter(x=>x!==t):[...st.saved,t];persist();render()});
 on("[data-ask]",b=>b.onclick=()=>{st.page="tutor";persist();render();send("Explain "+b.dataset.ask+" and why it matters.")});
 on("[data-p]",b=>b.onclick=()=>{const p={"Explain a concept":"Explain a concept from Neural Networks in simple words.","Solve a doubt":"I have a doubt. Can you help me solve it?","Give practice questions":"Give me 3 practice questions on neural networks.","Explain with an example":"Explain backpropagation with a simple example."};send(p[b.dataset.p])});
 if($("#ci")){$("#ci").onkeydown=e=>{if(e.key==="Enter"){const v=e.target.value;e.target.value="";send(v)}};$("#send").onclick=()=>{const i=$("#ci"),v=i.value;i.value="";send(v)};$("#clr").onclick=()=>{st.chat=[];persist();renderMsgs(false)}}
 if($("#reset"))$("#reset").onclick=()=>{if(confirm("Reset all progress and chat history?")){localStorage.removeItem("em_state");location.reload()}};
}
function particles(){const c=$("#cv");if(!c||matchMedia("(prefers-reduced-motion:reduce)").matches)return;const x=c.getContext("2d");let w=c.width=c.offsetWidth,h=c.height=c.offsetHeight;
 const P=Array.from({length:36},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}));
 (function f(){if(!document.body.contains(c))return;x.clearRect(0,0,w,h);const col=getComputedStyle(document.documentElement).getPropertyValue("--cy");
 P.forEach((p,i)=>{p.x=(p.x+p.vx+w)%w;p.y=(p.y+p.vy+h)%h;x.fillStyle=col;x.beginPath();x.arc(p.x,p.y,2,0,7);x.fill();for(let j=i+1;j<P.length;j++){const d=Math.hypot(p.x-P[j].x,p.y-P[j].y);if(d<100){x.strokeStyle=col;x.globalAlpha=1-d/100;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(P[j].x,P[j].y);x.stroke();x.globalAlpha=1}}});requestAnimationFrame(f)})()}
document.addEventListener("click",e=>{const p=$("#pop");if(p&&!e.target.closest("#pop,#bell"))p.remove()});
document.documentElement.dataset.theme=st.theme;render();