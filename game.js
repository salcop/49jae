(function(){
const IMG=window.__IMG,D=DATA,W=D.WORLD,L=LOGIC,A=SND;
{const _ss=A.setScene;A.setScene=function(n){try{if(typeof S!=='undefined'&&S&&S.day)A.setDay(S.day);}catch(e){}return _ss(n);};}
document.documentElement.style.setProperty('--papertex',`url(${IMG.papertex})`);
document.documentElement.style.setProperty('--paperfull',`url(${IMG.paper})`);
const app=document.getElementById('app');
const CASE_NO='0914-2241',HJ=['一','二','三','四','五','六','七'];
const SEAL={천국:['天','heaven'],환생:['生','rebirth'],지옥:['獄','hell'],보류:['留','hold']};
const CARD={};
D.RULES.forEach(r=>CARD[r.id]=Object.assign({kind:'rule'},r));
D.CASES.forEach(c=>c.cards.forEach(k=>CARD[k.id]=Object.assign({kind:'doc',caseId:c.id},k)));
for(const id in D.WCARDS)CARD[id]=Object.assign({kind:'w',id},D.WCARDS[id]);
CARD.W_bell={kind:'w',id:'W_bell',title:'귀에 남은 소리 · 월선의 방울',text:'방울은 죽은 혼 앞에서만 울린다.\n대기실에서 단 한 사람, 연이 앞에서만 울리지 않았다.'};
const CH={};D.CHOICES.forEach(c=>CH[c.id]=c);

let S;
function reset(){S={day:1,lamps:5,money:0,ch:{},verdicts:{},broken:{},pressed:{},flags:{},notebook:[],words:[],yeoni:0,summaryOk:{},heukLog:[],todays:[],caseIdx:0,cur:null,trial:null,final:null,oil:0};}
const F=k=>!!S.flags[k];
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
function snapshot(d){const s=Object.assign({},S,{cur:null,trial:null});const all=ls.get('49e_saves',{});all[d]=JSON.parse(JSON.stringify(s));ls.set('49e_saves',all);}
function loadSave(d){const all=ls.get('49e_saves',{});if(!all[d])return false;reset();Object.assign(S,all[d]);return true;}
const seenCine=id=>ls.get('49e_seen',{})[id];
const markCine=id=>{const s=ls.get('49e_seen',{});s[id]=1;ls.set('49e_seen',s);};
function setCh(id,k){S.ch[id]=k;}
function addNote(id){if(S.notebook.indexOf(id)<0)S.notebook.push(id);}
function addWord(w){if(S.words.indexOf(w)<0)S.words.push(w);}

function on(sel,fn,snd){const el=app.querySelector(sel);if(el)el.addEventListener('click',()=>{A.play(snd||'tap');fn();});}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function pressHL(t){return esc(t).replace(/【([^】]+)】/g,(m,w)=>{addWord(w);return `<u class="kw">${w}</u>`;});}
function bg(src,cls){return src?`<div class="bg ${cls||''}" style="background-image:url(${src})"></div>`:'';}
function toast(m){const o=app.querySelector('.toast');if(o)o.remove();const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.innerHTML=m;app.appendChild(d);setTimeout(()=>d.remove(),2800);}
function seal(v,cls){const s=SEAL[v];return `<span class="sealst ${s[1]} ${cls||''}"><b>${s[0]}</b><small>${v}</small></span>`;}
function jae(cur){return `<div class="jae" aria-label="${cur}재 / 7재">${HJ.map((h,n)=>`<span class="${n+1===cur?'on':(n+1<cur?'done':'')}">${h}</span>`).join('<i></i>')}<b>齋</b></div>`;}

function muteBtn(){return `<button type="button" class="mute" id="mute" aria-label="소리 켜기/끄기">${A.muted()?'音 ✕':'音'}</button>`;}
function bindMute(){const b=app.querySelector('#mute');if(b)b.addEventListener('click',e=>{e.stopPropagation();A.init();const m=A.toggle();b.textContent=m?'音 ✕':'音';});}
const yStage=()=>L.yStage(S.yeoni);
const YPOS={1:'대기실 구석에서 문만 보고 있다',2:'당신이 오면 옆자리를 비워 둔다',3:'당신을 따라 문 앞까지 나온다'};
document.addEventListener('pointerdown',()=>A.init(),{capture:true});
document.addEventListener('keydown',()=>A.init(),{capture:true});


const SP={drv:[36,18],tae:[64,16],h1:[31,32.5],h2:[40.5,32.5],h3:[59,32.5],h4:[69,32.5],h5:[31,43.6],h6:[40.5,43.6],ms:[59,43.6],sj:[69,66.4],child:[50,87]};
function stag(p,label,cls){return `<div class="stag ${cls||''}" style="left:${p[0]}%;top:${p[1]}%"><i></i>${label}</div>`;}
function seatCount(){return (F('reveal')?1:0)+(F('s_tae')?1:0)+(F('s_hikers')?6:0)+(F('s_seojin')?1:0)+(F('s_misuk')?1:0)+((F('s_child')||F('alive'))?1:0);}
function busplan(){
 const t=[F('reveal')?stag(SP.drv,'이무명','me'):stag(SP.drv,'백지','blankname')];
 if(F('s_tae'))t.push(stag(SP.tae,'강태준'));
 if(F('s_hikers'))['h1','h2','h3','h4','h5','h6'].forEach(k=>t.push(stag(SP[k],'산악회')));
 if(F('s_seojin'))t.push(stag(SP.sj,'한서진'));
 if(F('s_misuk'))t.push(stag(SP.ms,'정미숙'));
 if(F('alive'))t.push(stag(SP.child,'연이','alive'));else if(F('s_child'))t.push(stag(SP.child,'꼬마 ?'));
 return `<div class="busplan"><img src="${IMG.busplan}" alt="3번 마을버스 좌석 배치도">${t.join('')}</div>`;
}
function fillText(d){const Sm=D.SUMMARY[d];if(Sm.type==='timeline')return Sm.cards.map(c=>esc(c.text)).join(' → ');return esc(Sm.text).replace(/\{(\d)\}/g,(m,i)=>`<b class="fill">${esc(Sm.blanks[+i].answer)}</b>`);}
function overlay(html,cls){const ov=document.createElement('div');ov.className='overlay '+(cls||'');ov.innerHTML=html;app.appendChild(ov);A.play('paper');return ov;}
function openBoard(){
 const facts=Object.keys(S.summaryOk).filter(d=>S.summaryOk[d]).map(d=>fillText(+d));
 const ov=overlay(`<div class="corkwall" style="background-image:url(${IMG.boardbg})">
  <div class="casehead"><b>事件 ${CASE_NO}</b><span class="seal-r">未決</span><br>사망 명부 ${D.DEATH_RECORDS}장 · 배치도에 꽂은 이름 <b>${seatCount()}</b>개</div>
  <div class="pinned">${busplan()}</div>
  ${facts.length?facts.map((t,i)=>`<div class="pin" style="transform:rotate(${i%2?1.4:-1.1}deg)">${t}</div>`).join(''):'<div class="pin dim">아직 확정된 조서가 없다.</div>'}
  <button type="button" class="btn" id="cb">닫는다</button></div>`);
 ov.querySelector('#cb').addEventListener('click',()=>{A.play('paper');ov.remove();});
}


function cine(id,lines,done,scn){
 let i=0;const skip=id&&seenCine(id);if(scn)A.setScene(scn);
 function finish(){if(id)markCine(id);A.hbStop();done();}
 function draw(){const Ln=lines[i];
  if(Ln.pause){return Ln.pause(()=>{i++;if(i<lines.length)draw();else finish();});}
  if(Ln.scene)A.setScene(Ln.scene);if(Ln.snd)A.play(Ln.snd,Ln.sndArg);if(Ln.hb)A.hbStart(Ln.hb);if(Ln.hbStop)A.hbStop();if(Ln.vib)A.vib(Ln.vib);
  app.innerHTML=`<div class="cine ${Ln.mem?'has':''} ${Ln.flash?'flash':''}" id="cn" role="button" tabindex="0" aria-label="다음">
   ${Ln.mem?`<div class="cbg kb ${Ln.broken?'broken':''} ${Ln.sepia?'sepia':''} ${Ln.gray?'gray':''}" style="background-image:url(${Ln.mem})"></div><div class="cshade"></div>`:'<div class="cink"></div>'}
   ${Ln.rain?'<div class="rainfx heavy"></div>':''}${Ln.petals?'<div class="petals"></div>':''}
   <div class="bar top"></div><div class="bar bot"></div>
   ${skip?'<button type="button" class="skip" id="sk">건너뛰기 ≫</button>':''}${muteBtn()}
   ${Ln.pose?`<img class="creaper" src="${Ln.pose}" alt="">`:''}
   <div class="ctext">${Ln.tag?`<div class="tag">${esc(Ln.tag)}</div>`:''}
   ${Ln.inset?`<img class="inset ${Ln.insetCls||''}" src="${Ln.inset}" alt="">`:''}
   ${Ln.ecg?'<svg class="ecg" viewBox="0 0 200 30" aria-hidden="true"><polyline points="0,15 60,15 70,4 78,27 86,15 200,15"/></svg>':''}
   ${Ln.seal?`<div class="cseal">${seal(Ln.seal,'mini')}</div>`:''}
   ${Ln.cap?`<div class="cap">${esc(Ln.cap)}</div>`:''}
   <div class="line ${Ln.big?'big':''}">${esc(Ln.t)}</div><div class="tap">▼</div></div></div>`;
  bindMute();
  const el=app.querySelector('#cn');let lock=true;setTimeout(()=>lock=false,Ln.lock||380);
  const nx=()=>{if(lock)return;A.play('page');i++;if(i<lines.length)draw();else finish();};
  el.addEventListener('click',nx);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();nx();}});
  const sk=app.querySelector('#sk');if(sk)sk.addEventListener('click',e=>{e.stopPropagation();A.play('brush');finish();});}
 draw();
}
function talk(lines,done,bgImg,scn){
 let i=0;if(scn)A.setScene(scn);
 function draw(){const sp=lines[i][0],tx=lines[i][1];const face=sp==='흑'?IMG.heuk:(sp==='염라'?IMG.yeomra:null);
  app.innerHTML=`${bg(bgImg||IMG.deskbg)}${muteBtn()}<div class="screen end">${jae(Math.min(S.day,7))}
  <div class="talker">${face?`<img src="${face}" alt="${esc(sp)}">`:''}<div class="narr">${sp?`<div class="speaker">${esc(sp)}</div>`:''}${pressHL(tx)}</div></div>
  <button type="button" class="btn main" id="nx">다음</button></div>`;bindMute();
  on('#nx',()=>{i++;if(i<lines.length)draw();else done();},'page');}
 draw();
}
function holdScene(o){
 A.setScene(o.scene||'rain');
 app.innerHTML=`${bg(o.bg)}${o.rain?'<div class="rainfx heavy"></div>':''}${muteBtn()}<div class="screen end holdscr">
  <div class="narr" id="hl" aria-live="polite">${esc(o.intro)}</div>
  <button type="button" class="holdbtn" id="hold" aria-describedby="hh"><span class="ring"></span><b>${esc(o.label)}</b></button>
  <p class="hint" id="hh">${esc(o.help)}</p>
  <button type="button" class="btn small" id="letgo">${esc(o.alt)}</button></div>`;bindMute();
 const btn=app.querySelector('#hold'),hl=app.querySelector('#hl');let t0=0,timer=null,lineT=null,idx=0,done=false;
 function start(e){if(done||t0)return;if(e)e.preventDefault();t0=Date.now();btn.classList.add('held');A.hbStart(1);A.vib([30]);
  lineT=setInterval(()=>{if(idx<o.lines.length){hl.textContent=o.lines[idx++];A.setRate(1+idx*0.7);A.vib([20]);}},o.step||1100);
  timer=setTimeout(()=>end(false),o.max||6500);}
 function end(vol){if(done)return;if(vol&&t0&&Date.now()-t0<350)return;done=true;clearInterval(lineT);clearTimeout(timer);A.hbStop();btn.classList.remove('held');btn.classList.add('released');o.onRelease(vol);}
 btn.addEventListener('pointerdown',start);
 ['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,()=>{if(t0)end(true);}));
 btn.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat)start(e);});
 btn.addEventListener('keyup',e=>{if((e.key===' '||e.key==='Enter')&&t0)end(true);});
 btn.addEventListener('click',e=>e.preventDefault());
 app.querySelector('#letgo').addEventListener('click',()=>{if(done)return;done=true;clearInterval(lineT);clearTimeout(timer);A.hbStop();o.onRelease(true);});
}

function title(){
 reset();A.setScene('title');
 const saves=ls.get('49e_saves',{});const days=Object.keys(saves).map(Number).sort((a,b)=>a-b);
 const got=ls.get('49e_ends',[]);
 app.innerHTML=`${bg(IMG.titlebg,'kb title')}<div class="petals"></div><div class="rainfx"></div>${muteBtn()}
 <div class="quote">모든 영혼은<br>기록되고,<br>기억되며,<br>심판받는다.</div>
 <div class="screen" style="justify-content:space-between">
  <div><div class="brush">49재</div><div class="subt">― 저승 출입국 심사관 ―</div></div>
  <div class="titlemenu">
   <p class="lede">당신이 내리는 한 번의 도장이,<br>누군가의 마지막이자,<br>또 다른 누군가의 시작이 됩니다.</p>
   <button type="button" class="btn main" id="go">처음부터 출근한다</button>
   ${days.length?`<div class="chapters"><span>이어서</span>${days.map(d=>`<button type="button" class="chap" data-d="${d}">${HJ[d-1]}齋</button>`).join('')}</div>`:''}
   ${got.length?`<p class="hint">엔딩 ${got.length} / 7</p>`:'<p class="hint">이어폰 권장 · 약 1시간</p>'}</div></div>`;
 bindMute();
 on('#go',()=>{A.play('stamp');prologue();},'select');
 app.querySelectorAll('[data-d]').forEach(b=>b.addEventListener('click',()=>{A.play('stamp');const d=+b.dataset.d;if(loadSave(d)){if(d===7)trialStart();else morning(d,true);}}));
}
function prologue(){
 cine('prologue',[
  {t:'쓱— 탁.\n쓱— 탁.',scene:'rain',snd:'wiper',lock:1600},
  {tag:'2026. 09. 14  밤',mem:IMG.bus,rain:1,t:'막차 시간이 지난 3번 마을버스.\n와이퍼가 빗물을 밀어낸다.'},
  {mem:IMG.bus,rain:1,hb:1.4,t:'누군가 소리친다.\n운전석 쪽으로, 손 하나가 뻗는다.'},
  {flash:1,scene:'cut',snd:'crash',vib:[80,40,300],hbStop:1,t:'',lock:1500},
  {t:'…',lock:1800},
  {tag:'저승 출입국 관리소',mem:IMG.titlebg,scene:'title',snd:'bell',t:'그날 밤, 사망 명부 열 장이 도착했다.\n그중 한 장은 아무것도 적혀 있지 않은 백지였다.'}],
  ()=>talk([['','눈을 뜨니 낡은 책상 앞이다.\n이름도, 어제도 기억나지 않는다.\n명패에는 "무명(無名)"이라고만 적혀 있다.'],
   ['흑','어, 신입? 난 흑. 네 사수야.\n여기는 저승 출입국 관리소. 죽은 사람 서류 보고 천국·환생·지옥 도장 찍는 데.'],
   ['흑','기억 안 나지? 여기 직원은 다 그래. 이승 일은 문 앞에 두고 들어오는 거야.\n이름도 일하다 보면 붙어. 나도 그래서 흑이고.']],orderScreen,IMG.deskbg,'desk'));
}
function orderScreen(){
 app.innerHTML=`${bg(IMG.deskbg)}${muteBtn()}<div class="screen">${jae(1)}
  <div class="doc unfold"><div class="doc-h"><span class="big">閻羅 司令書</span><span class="sub">신입 심사관 무명에게 내린다</span></div>
   <div class="doc-b">
    <p><b>一.</b> 미결 사건 <em>${CASE_NO}</em>을 맡긴다. 9월 14일 밤, 3번 마을버스가 산길에서 떨어졌다.</p>
    <p><b>二.</b> 사망 명부 열 장이 왔으나 <em>운전자의 명부는 백지</em>다.</p>
    <p><b>三.</b> 일반 심사를 하며 관련 망자의 진술을 살펴, 운전자가 누구이며 그날 밤 무슨 일이 있었는지 밝혀라.</p>
    <p><b>四.</b> 기한은 <em>칠재(七齋)</em>. 넘기면 백지 명부의 영혼은 영원히 떠돈다.</p></div>
   <div class="doc-seal">極秘</div><div class="doc-sign stampin">閻羅</div></div>
  <p class="inkhint">— 사령서에 버스 좌석 배치도 한 장이 끼워져 있다 —</p>
  <div class="pinned">${busplan()}</div>
  <button type="button" class="btn main" id="nx">사령을 받든다</button></div>`;bindMute();
 A.play('paper');setTimeout(()=>A.play('stamp'),750);
 on('#nx',()=>talk([
  ['흑','…하필 신입한테 그 사건을. 별거 아냐. 기사가 술 먹고 몬 거야. 대충 닫아.'],
  ['','기사가 술을 마셨다. 그런데 기사의 명부만 백지다.\n누군가 이 사고를 덮고 있다. 그게 누구인지 — 이레 안에 밝혀야 한다.'],
  ['흑','망자가 오면 하나씩 물어. 다 물어볼 시간은 없어. 하나 물으면 하나는 놓치는 거야.\n서류를 먼저 읽어 두면, 물을 말이 하나 더 생기고.'],
  ['흑','알아낸 건 수첩에 적혀. 다 듣고 나면 도장 — 천국·환생·지옥·보류.\n도장 찍으면 데려가는 건 내 일이야. …아, 두 번째 서류는 내가 봐 놨어. 그냥 찍어.'],
  ['흑','하나 더. 여기 책상은 이승에서 지은 대로 앉는 자리야.\n명부는 사건이 닫혀야 채워지고. …일하다 보면 알게 돼.']],()=>dayStart(1)),'stamp');
}
{const _ds=dayStart;dayStart=function(d){if(d===1&&!F('epi1')){S.flags.epi1=true;app.innerHTML=`${bg(IMG.deskbg)}<div class="screen end" style="justify-content:center"><div class="epi big unfold"><small>一齋</small>「${EPI[1]}」</div></div>`;A.play('bell');return setTimeout(()=>_ds(d),1900);}return _ds(d);};
}

const DAY_INTRO={
 2:[['흑','오늘부터 그 버스 승객이 하나씩 올 거야. 일반 망자도 섞여서.\n…승객들한테 너무 깊이 묻지 마. 산 사람 일은 산 사람 일이야.']],
 3:[['흑','배달 기사 하나, 등산객 여섯. 배달 기사는 목격자랑 말이 엇갈려.\n누구 말을 믿을지는 네가 정해.']],
 4:[['흑','오늘 건은 위에서 내려온 거야. 이것만 넘기면 네 첫 평가는 내가 잘 써 줄게.\n…아, 늙은 형사도 하나 올 거야.']],
 5:[['','흑은 오늘 자리에 없다. 흑의 서랍이 반쯤 열려 있다.']]
};
function dayStart(d){
 S.day=d;S.lamps=5+S.oil;S.oil=0;S.caseIdx=0;S.todays=D.CASES.filter(c=>c.day===d);
 if(d===6){S.flags.reveal=true;return talk([['','六齋 아침. 오늘은 망자가 오지 않는다.\n닫힌 사건 0914-2241의 서류함에, 서류 한 장이 더 올라와 있다.'],['흑','(책상 위에 서류를 내려놓는다)\n기사 명부다. 사건이 닫혀야 이름이 올라와.\n…네가 직접 봐.']],()=>revealName(day6),IMG.deskbg,'drip');}
 A.setScene('desk');
 const go=()=>{if(d===5)return drawerEvent(nextCase);nextCase();};
 if(DAY_INTRO[d])talk(DAY_INTRO[d],go);else go();
}
















function dilemma(title,desc,opts,cb){
 const ov=overlay(`<div class="doc small unfold" role="dialog" aria-label="${esc(title)}"><div class="doc-h"><span class="big">${esc(title)}</span></div><p class="dilemma">${esc(desc)}</p>
 ${opts.map(([k,l])=>`<button type="button" class="slip" data-k="${k}">${esc(l)}</button>`).join('')}</div>`);
 ov.querySelectorAll('[data-k]').forEach(b=>b.addEventListener('click',()=>{A.play('brush');ov.remove();cb(b.dataset.k);}));
}
function phoneDilemma(cb){
 A.setScene('drip');
 const msgs=[['22:31','서진','기사님이 태워 준대. 좀 돌아간대.',1],['22:47','엄마','서진아 어디야',0],['23:05','엄마','병원에서 연락 왔어. 엄마 지금 가',0],['23:40','엄마','응급실 앞이야. 어디로 가면 돼?',0],['09.15 02:12','엄마','서진아',0],['09.21 22:58','엄마','오늘도 여기 있어',0]];
 const ov=overlay(`<div class="phone"><div class="ph-top">한서진의 휴대전화 · 읽지 않은 메시지 14</div>
  <div class="ph-body">${msgs.map((m,i)=>`<div class="bub ${m[3]?'me':''}" style="animation-delay:${i*0.55}s"><small>${m[0]}</small>${esc(m[2])}</div>`).join('')}</div></div>
  <div class="doc small unfold" style="animation-delay:3.4s"><p class="dilemma">명부의 사망시각은 22:58, 「병원 이송 중」.\n그 한 줄 때문에, 이 사람은 지금도 응급실 앞에 앉아 있다.\n흑의 메모: 「건드리지 마.」</p>
  <button type="button" class="slip" data-k="fix">정정한다 — 현장 22:41</button><button type="button" class="slip" data-k="silent">메모대로 넘어간다</button></div>`,'phoneov');
 msgs.forEach((m,i)=>setTimeout(()=>A.play(m[3]?'tick':'drip'),i*550+200));
 ov.querySelectorAll('[data-k]').forEach(b=>b.addEventListener('click',()=>{A.play(b.dataset.k==='fix'?'stamp':'brush');ov.remove();A.setScene('desk');cb(b.dataset.k);}));
}

function escortFor(c,v){if(c.id==='sj'&&S.ch.c_time==='fix')return D.ESCORT['sj:fix'];return D.ESCORT[c.id+':'+v]||D.ESCORT[c.id+':*'];}
const POSE=p=>p==='msgr'?IMG.msgr:(p==='crouch'?IMG.h_crouch:(p==='back'?IMG.h_back:IMG.h_turn));





function replayNight(next,fail){
 const Sm=D.SUMMARY[4];
 const lines=fail?[{mem:IMG.bus,broken:1,scene:'rain',t:'조각들이 맞춰지지 않는다.\n그날 밤은 아직 흐릿하다.'}]
  :Sm.cards.map((c,i)=>[c,i]).filter(([c,i])=>!(i===2&&!F('k_fare'))&&!(i===3&&!F('k_route'))).map(([c,i])=>({tag:c.t,mem:i<2?IMG.hikers:(i<4?IMG.bus:IMG.pov),rain:1,scene:'rain',snd:'wiperOne',lock:700,t:c.text+'.'}));
 if(!fail){lines.splice(lines.length-1,0,{tag:'22:40',mem:IMG.pov,rain:1,broken:1,hb:1.6,lock:1400,t:'…그 사이의 1분이, 비어 있다.'});lines.push({scene:'cut',hbStop:1,lock:1600,t:'조서가 맞춰졌다.\n남은 빈칸은 하나 — 기사의 이름.'});}
 cine(null,lines,next);
}

const EPEND={
 1:()=>[{mem:IMG.deskbg,scene:'desk',t:'퇴근 무렵. 흑이 백지 명부를 서류함 맨 아래로 밀어 넣는다.'},
  {tag:'흑',mem:IMG.heuk,t:'"기사 건은 신경 꺼. 음주야. 이승 경찰도 그렇게 났고."'},
  {mem:IMG.grandma,t:'귤 할머니의 목소리가 귀에 남아 있다.\n"그 양반은 평소에 술 한 방울 안 하는 사람이었어.\n식구라곤 종점 개 한 마리뿐이었고."'},
  {tag:'흑',mem:IMG.heuk,t:'"대기실 꼬마? 기다리는 사람이 있대.\n기다리는 혼은 억지로 못 데려가. 그게 여기 규칙이야."'},
  {t:'명부가 백지인 사람.\n술을 안 마시는 그 사람이, 음주 사고를 냈다.',lock:1000}],
 2:()=>[{mem:IMG.seojin,t:'서진을 데려가기 전, 흑이 아이의 휴대전화를 잠깐 내려다본다.\n엄마에게 보낸 마지막 문자. 「기사님이 태워 준대. 좀 돌아간대.」'},
  {tag:'흑',mem:IMG.heuk,t:'"좋은 사람이라고 사고 안 내는 거 아냐, 신입.\n좋은 사람도 미끄러져. 빗길이면 더."'},
  {t:'막차 놓친 아이들을 공짜로 태워 주던 기사.\n그날 밤, 그는 왜 노선에 없는 산길로 들어갔을까.',lock:1000}],
 3:()=>[{mem:IMG.hikers,scene:'escort',t:'조서를 덮는데, 산악회 노인이 문을 나서며 남긴 말이 떠오른다.'},
  {tag:'산악회',t:F('k_fare')||F('k_drink')?'"기사 양반 욕하지 마쇼. 우리가 사정사정했어.\n'+(F('k_drink')?'산길로 질러가자고 우긴 건 조수석 그 젊은 양반이야.\n':'')+(F('k_fare')?(F('k_drink')?'돈도 그 양반이':'돈은 같이 탄 젊은 양반이')+' 모아서 건넸고. …기사 양반, 봉투 받고 한참을 핸들만 쥐고 있었어."':'…기사 양반은 끝까지 싫다고 했는데."'):'"기사 양반 욕하지 마쇼. 막차 놓친 우리를 태워 준 사람이야."'},
  {tag:'흑',mem:IMG.heuk,t:S.ch.c_fare==='record'?'"적었네, 웃돈. …실망했어? 원래 다 그래. 봉투 앞에선."':'"봉투 앞에선 다 똑같아. 너무 실망하지 마."'},
  F('k_drink')?{t:'그런데 그날 밤 술을 마신 건 기사가 아니었다.\n조수석의 젊은 남자. 그 남자의 이름이 어디에도 없다.',lock:1000}:{t:'명부의 사고 원인은 「기사 음주」.\n승객들은 말도 안 된다고 했다. 그날 밤 술은 누가 마셨을까.',lock:1000}],
 4:()=>[{mem:IMG.detective,t:'오종태가 문 앞에서 멈춰 선다.'},
  {tag:'오종태',t:'"젊은이. 위에서 덮는 건, 덮을 게 있어서야.\n30년 전엔 내가 못 열었어. 자네는 열어."'},
  {mem:IMG.tae,t:S.ch.c_tae==='heaven'?'강태준의 서류에는 「천국」이 찍혀 있다. 당신의 도장이다.\n흑이 어깨를 두드린다. "잘했어. 이제 다 덮였다."':!F('k_tae')?'강태준. ○○그룹 회장의 아들. 서류상 그날 밤 「집에서」 죽었다.\n…정말 집이었을까.':'강태준. ○○그룹 회장의 아들. 그날 밤 조수석에 앉아 있던 남자.\n그의 아버지는 아들의 죽음을 「집」으로 옮기고, 기사에게 술을 먹였다. 서류 위에서.'},
  {t:'남은 건 마지막 1분.\n핸들이 꺾인 그 순간, 기사는 무엇을 했나.',lock:1000}],
 5:()=>{const ok=S.ch.c_tae!=='heaven'&&F('k_tae'),lr=F('k_lastrun');return [
  {mem:IMG.misuk,scene:'cut',lock:900,t:'정미숙의 마지막 말이 조서에 들어간다.'},
  {tag:'정미숙',mem:IMG.misuk,t:lr?'"기사님이 핸들을 놓고 맨 뒷자리로 달려갔어요.\n그 아이를 안았어요. 끝까지요."':'"…마지막 순간은, 아무도 안 물어보더라고요."'},
  {mem:IMG.deskbg,scene:'drip',t:'밤늦게, 비어 있던 흑의 자리에 흑이 돌아온다.\n말없이 조서를 읽고, 결재함에 넣는다.'},
  {tag:'閻羅 決裁 · 사건 '+CASE_NO,snd:'stamp',lock:1500,t:(ok?'사고 원인 — 조수석 승객 강태준의 핸들 개입\n기사 음주 — 기록 삭제':'사고 원인 — 기사 과실\n조수석 승객 — 명단에서 삭제 (상부 지시)')+(lr?'\n기사 — 마지막 순간, 맨 뒷자리의 아이를 감쌌다':'\n기사 — 마지막 순간 기록 없음')},
  {tag:'흑',mem:IMG.heuk,t:ok?'"…첫 사건을 열어 버렸네. 위에서 한소리 듣겠다.\n그래도. 잘했다, 신입."':'"깔끔하게 닫았네. 그렇게 하는 거야."\n흑은 웃지 않는다.'},
  ...(F('mandarin')?[{mem:IMG.grandma,t:'서랍 속 귤은 끝내 전하지 못했다.\n전해 줄 기사는, 이제 없으니까.'}]:[]),
  {t:ok?('좋은 사람이었고, '+(F('k_envelope')?'돈을 받았고, ':'')+(lr?'마지막에 아이에게 달려갔다.':'마지막 1분은 끝내 비어 있다.')+'\n이름 모를 기사의 이야기는, 그렇게 닫혔다.'):(lr?'서류 위에서, 기사는 끝내 술을 마신 사람으로 남았다.\n그래도 마지막 한 줄만은 — 당신이 지켰다.':'서류 위에서, 기사는 끝내 술을 마신 사람으로 남았다.\n마지막 1분은, 아무도 적지 않았다.'),lock:1200}];}
};
function mandarinScene(next){
 A.setScene('desk');
 app.innerHTML=`${bg(IMG.deskbg)}${muteBtn()}<div class="screen end" style="justify-content:center">
  <div class="talker"><img src="${IMG.grandma}" alt="김복순"><div class="narr"><div class="speaker">${S.verdicts.gm==='보류'?'대기실로 가던 김복순이 놓고 간 것':'김복순이 남기고 간 것'}</div>책상 귀퉁이에 귤 하나가 놓여 있다. 쪽지가 붙어 있다.<br>「기사 양반 오면 전해 줘. 아침마다 하나씩 줬는데, 그날 건 못 줬어.」</div></div>
  <div class="mandarin big unfold" aria-hidden="true"></div>
  <button type="button" class="slip" id="m1">서랍에 넣어 둔다 — 기사를 찾으면 전해 주려고</button>
  <button type="button" class="slip" id="m2">까서 먹는다 — 어차피 죽은 사람이다</button></div>`;
 bindMute();A.play('paper');
 on('#m1',()=>{S.flags.mandarin=true;A.play('door');talk([['','귤을 서랍 깊숙이 넣는다.\n기사를 찾으면 — 꼭 전해 줘야지.']],next,IMG.deskbg,'desk');},'tap');
 on('#m2',()=>{S.flags.ateM=true;A.play('brush');talk([['','껍질을 벗긴다. 손끝이 노랗게 물든다.\n시고, 달다.']],next,IMG.deskbg,'desk');},'tap');
}


function afterDay(d){if(d<=5&&EPEND[d]&&!F('ep'+d)){S.flags['ep'+d]=true;return cine(null,EPEND[d](),()=>d===1?mandarinScene(()=>waiting(1)):waiting(d));}waiting(d);}

function revealName(next){
 A.setScene('cut');
 app.innerHTML=`<div class="reveal" id="rv"><div class="cbg" style="background-image:url(${IMG.blankreg});animation:none"></div><div class="mirror" id="mr"><div style="background-image:url(${IMG.mumyeong})"></div></div>
  <div class="rvname" id="nm"></div><div class="rvsub" id="sb"></div><div class="bar top"></div><div class="bar bot"></div>${muteBtn()}<div class="tap" id="tp" style="display:none">▼</div></div>`;bindMute();
 const rv=app.querySelector('#rv'),mr=app.querySelector('#mr'),nm=app.querySelector('#nm'),sb=app.querySelector('#sb');
 const r=rv.getBoundingClientRect(),iw=1024,ih=1536,sc=Math.max(r.width/iw,r.height/ih),ox=(r.width-iw*sc)/2,oy=(r.height-ih*sc)/2;
 const cx=ox+270*sc,cy=oy+450*sc,rad=135*sc;Object.assign(mr.style,{left:(cx-rad)+'px',top:(cy-rad)+'px',width:rad*2+'px',height:rad*2+'px'});
 let ready=false;
 [[1300,()=>A.play('drip')],[2600,()=>{A.play('ink');nm.innerHTML='<span>李</span>';}],[3500,()=>{A.play('tick');nm.innerHTML+='<span>無</span>';}],[4400,()=>{A.play('tick');nm.innerHTML+='<span>名</span>';}],
  [5600,()=>{sb.textContent='이무명 · 3번 마을버스 기사';A.play('paper');}],[6900,()=>{mr.classList.add('on');A.hbStart(0.8);}],[8600,()=>{app.querySelector('#tp').style.display='block';ready=true;}]].forEach(([t,f])=>setTimeout(f,t));
 rv.addEventListener('click',()=>{if(!ready)return;A.hbStop();
  cine('reveal4b',[
   {mem:IMG.mumyeong,t:'거울 속의 얼굴은,\n매일 아침 저 거울에서 보던 얼굴이다.'},
   {tag:'흑',mem:IMG.heuk,scene:'desk',t:'"이제야 알았냐? 다들 알고 있었는데."'},
   {t:'어젯밤 「종결」을 찍은 그 사건. 닷새 동안 수첩에 적어 온 기사 「이○○」.\n귤을 받던 사람. 공짜로 아이들을 태우던 사람.'+(F('k_fare')||F('k_envelope')?' 웃돈을 받은 사람.':'')+(F('k_lastrun')?' 아이에게 달려간 사람.':'')+'\n…전부, 나였다.',lock:1400},
   F('mandarin')?{mem:IMG.grandma,lock:1300,t:'서랍을 연다. 닷새 동안 쪼그라든 귤 하나.\n「기사 양반 오면 전해 줘.」\n…그 귤은, 처음부터 내 것이었다.'}:{mem:IMG.grandma,lock:1300,t:'첫날 까먹은 귤. 시고, 달았다.\n「기사 양반 오면 전해 줘.」\n…나는, 이미 받았던 거다.'},
   {mem:IMG.pov,rain:1,t:'첫날 꿈에서 본 그 빗길.\n그건 사건의 잔상이 아니었다. 운전석에서 본 내 기억이었다.'},
   ...(S.verdicts.gm==='보류'?[{mem:IMG.grandma,lock:1200,t:'대기실에서 귤 할머니가 일어선다. 닷새 동안 그 자리에 있었다.\n"기사 양반 찾았구먼. …얼굴 보니 알겠네."\n할머니는 그제야 문을 지난다.'}]:[]),
   {mem:IMG.dog,t:'종점에서 매일 주인을 기다리던 늙은 개.\n…복실아. 그 주인이 나였구나.'},
   {t:S.ch.c_fare==='record'?'三齋에, 나는 그 기사의 조서에 「웃돈」을 적었다.\n내 손으로, 내 죄를.':(S.ch.c_fare==='erase'?'三齋에, 나는 그 기사의 조서에서 「웃돈」을 지웠다.\n…나를 감싼 거였다.':'무명(無名). 이름이 없던 게 아니었다.\n명부가 백지였던 거다.')},
   {t:'남은 질문은 하나.\n— 그날 밤, 그 1분 동안, 나는 무엇을 했나.'},
   {tag:'흑',mem:IMG.heuk,lock:1200,t:'"…그 얘기 하기 전에. 내 얘기부터 들어."'}],next);
 });
}

function waitOpts(d){
 const base={
  1:{say:'"……"',opts:[{t:'약과를 건넨다 (5냥)',cost:5,a:'(받아서 반만 먹고 반은 주머니에 넣는다)\n"아저씨 오면 줄 거예요."',y:2,flag:'yakgwa'},{t:'"누구 기다리니?"',a:'"버스 아저씨요. 금방 온댔어요."',y:1},{t:'그냥 지나친다',a:'',y:0}]},
  2:{say:'(연이가 그림을 그리고 있다.)',opts:[{t:'"무슨 그림이야?"',a:'"버스요. 엄마 기다리다 맨 뒷자리에서 잠들었는데, 깨니까 깜깜했어요."\n그림 속 운전사는 아직 얼굴이 없다. "아저씨 얼굴이 생각 안 나요. 웃는 건 기억나는데."',y:1},{t:'옆에 앉아 같이 그린다',a:'"아저씨 얼굴이 생각 안 나요." 연이가 크레파스를 내민다.\n당신이 운전사에게 웃는 입을 그려 넣는다.\n연이가 한참 들여다본다. "…응. 이렇게 웃었어요."',y:2,flag:'drew'},{t:'그냥 지나친다',a:'',y:0}]},
  3:{say:'(연이가 귀를 막고 있다.) "삐— 삐— 소리 또 나요."',opts:[{t:'"무슨 소리?"',a:'"버스 문 닫힐 때 나는 소리요. 삐— 삐—.\n그날 내리려고 했는데, 문이 먼저 닫혔어요."',y:1},{t:'토끼 인형을 고쳐 준다',a:'떨어진 단추 눈을 다시 달아 준다. 연이가 처음으로 웃는다.',y:2},{t:'그냥 지나친다',a:'',y:0}]},
  4:{say:'"아저씨, 오늘 얼굴이 이상해요."',opts:[{t:'"사건이 잘 안 풀려서."',a:'"버스 아저씨도 비 오는 날엔 그런 얼굴 했어요."',y:2},{t:'아무 말도 못 한다',a:'연이가 당신 소매를 잡는다. 아무 말 없이.',y:1}]}
 };
 if(d===6){
  if(S.ch.c_tell==='tell')return {say:'(연이가 대기실 문고리를 잡고 서 있다.)',opts:[{t:'곁에 가서 선다',a:'"아저씨, 이 문 열면 엄마한테 가요?"\n연이는 문고리를 놓지 않는다. 당신 소매도 놓지 않는다.',y:2},{t:'"내일 아저씨 재판이야."',a:'"그럼 내일 같이 열어요. 이 문."',y:1}]};
  if(S.ch.c_tell==='hide')return {say:'(연이가 당신 옆자리에 바짝 붙어 앉는다.)',opts:[{t:'손을 잡아 준다',a:'연이의 손은 따뜻하다. 여기 있는 누구의 손도 따뜻하지 않은데.\n멀리서 기계음이 아주 느려진다.',y:2},{t:'"내일 아저씨 재판이야."',a:'"아저씨 나쁜 사람 아니에요. 내가 말해 줄게요."',y:1}]};
  return {say:'(연이가 오늘은 문 쪽 의자에 앉아 있다.)',opts:[{t:'손을 잡아 준다',a:'연이의 손은 따뜻하다. 여기 있는 누구의 손도 따뜻하지 않은데.',y:2},{t:'"내일 아저씨 재판이야."',a:'"아저씨 나쁜 사람 아니에요. 내가 말해 줄게요."',y:1}]};
 }
 if(d!==5)return base[d];
 if(F('k_lastrun'))return {say:'"아저씨, 버스 아저씨 나쁜 사람 아니죠?"',desc:'연이는 아직 모른다. 그 버스 아저씨가 마지막에 자기에게 달려왔다는 걸.\n그 말을 들으면, 이 아이는 더 기다리지 않을 것이다.',choice:'c_tell',
  opts:[{t:'말한다 — "버스 아저씨, 마지막에 너한테 달려갔대."',k:'tell',a:'연이가 토끼 인형을 꼭 끌어안는다.\n"…그럴 줄 알았어요. 손이 따뜻했거든요."\n"그럼 나 이제 안 기다려도 돼요?"\n그날 처음으로, 연이가 대기실 문 쪽으로 한 걸음 걷는다.',y:2},
        {t:'말하지 않는다 — "조금만 더 같이 기다리자."',k:'hide',a:'"응. 기다리는 건 잘해요."\n연이가 당신 소매를 꼭 쥔다.',y:1}]};
 setCh('c_tell','unknown');
 return {say:'"아저씨, 나 언제 가요? 다른 사람들은 다 갔는데."',opts:[{t:'"서류를 찾아볼게."',a:'"서류 없으면 못 가요?" …연이는 오히려 안심한 얼굴이다.',y:1},{t:'"조금만 더 기다려."',a:'"응. 기다리는 건 잘해요."',y:1}]};
}
function waiting(d){
 const Wt=waitOpts(d);A.setScene('wait');
 const head=()=>`<div class="stage tall enter" style="background-image:url(${IMG.yeoni})"><div class="plate"><span class="seal-s blue">待</span><div><div class="n">연이</div><div class="d">8세 · 3번 버스 승객 · ${YPOS[Math.min(3,1+Math.floor((S.day-1)/2))]}</div></div></div></div>`;
 app.innerHTML=`${bg(IMG.waitbg)}${muteBtn()}<div class="screen end">${head()}<div class="narr whisper">${esc(Wt.say)}</div>${Wt.desc?`<div class="narr">${esc(Wt.desc)}</div>`:''}
  ${Wt.opts.map((o,i)=>`<button type="button" class="slip" data-o="${i}" ${o.cost&&S.money<o.cost?'disabled':''}>${esc(o.t)}</button>`).join('')}</div>`;bindMute();
 app.querySelectorAll('[data-o]').forEach(b=>b.addEventListener('click',()=>{
  A.play('brush');const o=Wt.opts[+b.dataset.o];if(o.cost){S.money-=o.cost;A.play('coin');}S.yeoni+=o.y;if(o.flag)S.flags[o.flag]=true;if(Wt.choice)setCh(Wt.choice,o.k);
  if(!o.a)return night(d);
  app.innerHTML=`${bg(IMG.waitbg)}${muteBtn()}<div class="screen end">${head()}<div class="narr">${esc(o.a)}</div><button type="button" class="btn main" id="nx">하루를 마친다</button></div>`;bindMute();
  on('#nx',()=>night(d),'page');}));
}

const SOBS={1:'"…여보…"',2:'"…여보, 아직…"',3:'"…아직 안 깨어났어…"',4:'"…의사가 오늘 밤이 고비래…"',5:'"…여보, 오늘은 손이 조금 따뜻해…"',6:'"…손가락을 움직였대…"'};
const MEMS={1:[IMG.bus,'사건 기록이 꿈에 스민다.\n귤 냄새. 아침 버스. 누군가 웃으며 무언가를 건넨다.'],2:[IMG.bus,'사건 기록이 꿈에 스민다.\n빗소리. 와이퍼. 노선에 없는 산길.'],3:[IMG.hikers,'사건 기록이 꿈에 스민다.\n시끌벅적한 웃음소리. 누군가의 손바닥으로 건너가는 접힌 지폐.'],4:[IMG.tae,'사건 기록이 꿈에 스민다.\n조수석의 술 냄새. 누군가 소리친다. "그냥 가자고!"'],5:[IMG.yeoni,'사건 기록이 꿈에 스민다.\n맨 뒷자리의 토끼 인형. 누군가 그 위로 몸을 던진다.']};
function flowHTML(d){
 const rows=D.CHOICES.filter(c=>c.day===d).map(c=>{
  const got=S.ch[c.id];const keys=Object.keys(c.opts).filter(k=>k!=='unknown');
  const nodes=got==='unknown'||!got?`<span class="node dim">알아채지 못했다</span>${keys.map(()=>'<span class="node lock">？</span>').join('')}`
   :keys.map(k=>k===got?`<span class="node on">${esc(c.opts[k].label)}</span>`:'<span class="node lock">？</span>').join('');
  return `<div class="frow"><div class="fq">${esc(c.q)}</div><div class="fnodes">${nodes}</div></div>`;});
 if(D.SUMMARY[d])rows.push(`<div class="frow"><div class="fq">조서</div><div class="fnodes"><span class="node ${S.summaryOk[d]?'on':'dim'}">${S.summaryOk[d]?'確定':'反戾'}</span></div></div>`);
 return `<div class="flow"><div class="sheet-h">${HJ[d-1]}齋의 갈림길</div>${rows.join('')}<p class="hs">？ — 다른 길을 택했다면 다른 것이 보였을 것이다.</p></div>`;
}
function night(d){
 const m=MEMS[d],clear=!!S.summaryOk[d];A.setScene('night');
 app.innerHTML=`${bg(IMG.endbg,'kb')}<div class="petals"></div>${muteBtn()}<div class="screen end">${jae(d)}
 ${m?`<div class="mem ${clear?'':'broken'}" style="background-image:url(${m[0]})"><span>${clear?esc(m[1]):'(지직…) 조서가 확정되지 않아 기억이 흐릿하다'}</span></div>`:''}
 ${driverHTML(d)}
 ${flowHTML(d)}
 ${d>=6?`<div class="narr"><div class="speaker">대기실 문 너머, 여자의 목소리</div>${esc(SOBS[d])}</div>`:''}
 <div class="actbar"><button type="button" class="btn" id="bd">사건 보드</button><button type="button" class="btn main" id="nx">${d<6?'아침':'七齋'}</button></div></div>`;bindMute();
 on('#bd',openBoard);on('#nx',()=>{if(d<6)morning(d+1);else trialStart();},'page');
}

const EPI={1:'백지',2:'막차',3:'웃돈',4:'위에서 내려온 것',5:'마지막 1분'};
const DRV={
 1:[['+','아침마다 귤 하나를 받던 기사. 「술 한 방울 안 하는 사람」 — 김복순'],['+','종점 늙은 개 복실이의 주인. 사고 전날 수술 예약, 수술비 미납'],['-','「기사가 술 먹고 몬 거야. 대충 닫아.」 — 흑']],
 2:[['+','막차 놓친 아이들을 공짜로 태워 주던 사람 — 한서진'],['?','그날 밤, 노선에 없는 산길로 들어갔다'],['?','승객 한 명의 사망시각이 「이송 중」으로 고쳐져 있다']],
 3:[['-','막차가 끝난 뒤, 웃돈을 받고 버스를 몰았다'],['+','막걸리를 병째 들이켠 건 기사가 아니라 조수석의 젊은 남자'],['?','사고 원인 「기사 음주」 — 승객들은 말도 안 된다고 한다']],
 4:[['?','조수석의 남자는 ○○그룹 강태준. 서류상 그날 밤 「집에서」 죽었다'],['-','「위에서 내려온 건이야」 — 흑'],['?','30년 전에도 빗길 버스 사고를 위에서 덮었다 — 오종태']],
 5:[['-','봉투를 한참 망설이다 받았다 — 정미숙의 간호 수첩'],['+','핸들이 꺾인 순간, 핸들을 놓고 맨 뒷자리 아이에게 달려갔다 — 정미숙'],['+','그 아이는 대기실의 연이. 「버스 아저씨」를 기다리고 있다']]
};
const DRV_NEED={1:['k_sober','k_owner',null],2:['k_route','k_route','k_time'],3:['k_fare','k_drink',null],4:['k_tae',null,'k_1996'],5:['k_envelope','k_lastrun','k_lastrun']};
const HOOK={
 1:'기사는 정말 술을 마셨을까.\n귤 할머니는 아니라고 했다. 그런데 왜 기사의 명부만 백지일까.',
 2:'왜 노선에 없는 산길이었을까.\n그리고 누가, 무엇을 감추려고 서진의 시각을 고쳤을까.',
 3:'기사는 왜 웃돈을 받았을까.\n술 냄새는 조수석에서 났다. 그 남자는 누구지?',
 4:'술을 마신 건 조수석이었다. 핸들을 잡아챈 손도 조수석이었을까.\n그럼 그 1분 — 핸들 앞에서 기사는 무엇을 했나.',
 5:''
};
function hookFor(d){
 if(d===2&&!F('k_time'))return '왜 노선에 없는 산길이었을까.\n그리고 그 버스 맨 뒷자리에는 누가 있었을까.';
 if(d===2&&!F('k_route'))return '기사의 명부는 왜 백지일까.\n그리고 누가, 무엇을 감추려고 서진의 시각을 고쳤을까.';
 if(d===3&&!F('k_drink'))return '기사는 정말 술을 마셨을까.\n승객들이 탄 버스는, 막차가 끝난 뒤의 버스였다.';
 if(d===4&&!F('k_tae'))return '서류상 「집에서」 죽은 재벌 2세.\n그리고 흑이 「위에서 내려온 것」이라 한 서류. 그날 밤 조수석엔 누가 있었나.';
 if(d===4&&!F('k_drink'))return '조수석에 있던 남자는 누구였고, 무엇을 했나.\n그 1분 — 핸들 앞에서 기사는 무엇을 했나.';
 return HOOK[d];
}
function driverHTML(d){
 if(!DRV[d])return '';
 const all=[];for(let k=1;k<=d;k++)DRV[k].forEach((x,j)=>{const nd=(DRV_NEED[k]||[])[j];if(!nd||F(nd))all.push([k,x]);});
 const ic={'+':'○','-':'×','?':'？'};
 const extra=(d>=5&&F('heukFile'))?`<li class="new q"><b>？</b>흑의 서랍 — 「현장 사망을 이송 중 사망으로. 조수석 명단 노출 방지.」</li>`:'';
 return `<div class="dossier unfold"><div class="sheet-h">手帖 · 백지 명부의 기사 「이○○」</div>
  <ul>${all.map(([k,[t,x]])=>`<li class="${k===d?'new':''} ${t==='+'?'p':(t==='-'?'m':'q')}"><b>${ic[t]}</b>${esc(x)}</li>`).join('')}${extra}</ul>
  ${d===5?`<div class="hook closed"><span>事件 ${CASE_NO}</span>終結\n${S.ch.c_tae==='heaven'?'기록은 깨끗하다. 너무 깨끗하게.':(F('k_lastrun')?'이름 모를 기사는 「마지막에 아이에게 달려간 사람」으로 기록되었다.':'기사의 마지막 1분은, 기록 없이 닫혔다.')}</div>`:`<div class="hook"><span>${HJ[d]}齋를 앞두고</span>${esc(hookFor(d))}</div>`}</div>`;
}
const MORNING_HEUK={
 2:()=>S.ch.c_choi==='take'?'어제 잘했어. 그렇게만 해.':'…어제 그 서류 말이야. 다음엔 나한테 먼저 물어봐.',
 3:()=>S.ch.c_jh==='hell'?'(흑이 소식지의 한 기사를 오래 내려다본다. 「아빠 사진을 서랍 깊이」.)':(S.ch.c_time==='fix'?'(흑이 소식지를 한참 내려다본다. 아무 말 없다.)':'신문 같은 거 읽지 마. 시간 낭비야.'),
 4:()=>S.ch.c_fare==='erase'?'어제 조서 봤다. …사람 볼 줄 아네.':(S.ch.c_fare==='record'?'죽은 사람 흠까지 꼼꼼히 적더라. 피곤하게 사네.':'조서에 빈칸이 많더라. 괜찮아, 다들 그래.'),
 5:()=>'(흑의 자리가 비어 있다. 의자 위에 향이 꺼진 채 놓여 있다.)',
 6:()=>S.ch.c_drawer==='open'?'(흑이 서랍을 한 번 열어 보고, 당신을 본다.)':'(흑이 평소처럼 향을 피운다.)'
};
function morning(d,resume){
 snapshot(d);A.setScene('desk');
 const arts=resume?[]:D.CHOICES.filter(c=>c.day===d-1&&S.ch[c.id]&&c.opts[S.ch[c.id]].echo.news).map(c=>c.opts[S.ch[c.id]].echo.news);
 const draw=()=>{
 app.innerHTML=`${bg(IMG.deskbg)}${topbar(`${HJ[d-1]}齋 아침`)}<div class="screen">${EPI[d]?`<div class="epi unfold"><small>${HJ[d-1]}齋</small>「${esc(EPI[d])}」</div>`:''}
 <div class="news unfold"><div class="mast"><b>이승 소식지</b><small>저승 출입국관리소 비치용 · 어제 당신의 도장 뒤에 일어난 일</small></div>${(arts.length?arts:[['—','특별한 소식이 없다.']]).map(a=>`<article><h4>${esc(a[0])}</h4>${esc(a[1])}</article>`).join('')}</div>
 
 <div class="talker"><img src="${IMG.heuk}" alt="흑"><div class="narr"><div class="speaker">흑</div>${esc(MORNING_HEUK[d]())}</div></div>
 <button type="button" class="btn main" id="nx">출근</button></div>`;
 on('#pb',openBoard);on('#nb',openNotebook);bindMute();
 on('#oil',()=>{S.money-=15;S.oil++;A.play('coin');draw();},'tap');
 on('#nx',()=>dayStart(d),'stamp');};
 draw();A.play('paper');
}

function heukNotes(){
 const c=S.ch,n=[];
 n.push(['一齋',(c.c_choi==='take'?'최만석 건, 받음. 쓸 만함.':'최만석 건 거절. 눈여겨볼 것.')+' '+(c.c_con==='hell'?'박칠성 카드 회수.':'박칠성 카드 — 놓침.')]);
 n.push(['二齋',(c.c_jh==='mercy'?'박정호를 놓아줬다. 애 병원비라고. …':(c.c_jh==='hell'?'박정호를 지옥에. 원칙대로. …':'박정호 보류. 못 정한 모양.'))+(c.c_time==='fix'?' 사망시각을 건드림. 위험.':(c.c_time==='silent'?' 시각 건은 알고도 넘어감.':' 시각 건 눈치 못 챔.'))]);
 n.push(['三齋',c.c_fare==='erase'?'기사의 웃돈을 지웠다. …물렁하군.':(c.c_fare==='record'?'기사의 웃돈을 그대로 적었다. 제 손으로.':'조서도 제대로 못 씀.')]);
 n.push(['四齋',(c.c_tae==='heaven'?'강 회장 건 처리. 이걸로 그 건은 덮인다.':(c.c_tae==='hell'?'강태준을 지옥에. 위에서 시끄럽겠군. 거래 깨짐.':'강태준을 붙잡아 뒀다. 거래 깨짐.'))+' 늙은 형사 하나. 눈치가 빠르다.']);
 return n;
}
function drawerEvent(next){
 S.day=5;A.setScene('drip');
 app.innerHTML=`${bg(IMG.deskbg)}${muteBtn()}<div class="screen end">${jae(5)}
 <div class="talker"><img src="${IMG.heuk}" alt="흑" style="filter:grayscale(1) brightness(.5)"><div class="narr"><div class="speaker">흑의 빈자리</div>향이 꺼져 있다. 서랍이 반쯤 열려 있다.\n낡은 서류 뭉치와 수첩 한 권이 보인다.</div></div>
 <button type="button" class="slip" id="a1">몰래 서랍을 연다</button><button type="button" class="slip" id="a2">건드리지 않는다</button></div>`;bindMute();
 on('#a1',()=>{setCh('c_drawer','open');S.flags.heukFile=true;A.play('door');
  app.innerHTML=`${bg(IMG.deskbg)}${muteBtn()}<div class="screen">
  <div class="doc unfold"><div class="doc-h"><span class="big">觀察錄</span><span class="sub">신입 관찰 기록</span></div>
   <div class="doc-b">${heukNotes().map(([d,t])=>`<p><b>${d}</b> ${esc(t)}</p>`).join('')}</div></div>
  <div class="doc small"><div class="doc-b"><p><b>·</b> 상부 지시 사본 — "현장 사망을 이송 중 사망으로. 조수석 명단 노출 방지." 처리: 흑</p><p><b>·</b> 보존 기한이 지난 사고 기록철 한 권 — 겉장에 「시외버스」.</p></div></div>
  <button type="button" class="btn main" id="nx">서랍을 닫는다</button></div>`;bindMute();
  on('#nx',()=>{A.setScene('desk');next();},'slam');},'paper');
 on('#a2',()=>{setCh('c_drawer','leave');A.setScene('desk');next();});
}
function day6(){
 S.day=6;snapshot(6);const c=S.ch;
 const jhLine={mercy:'"그 회사원, 놓아줬더라. 애 병원비 때문이었다고.\n…나한테도 그렇게 해 줄 거냐?"',hell:'"그 회사원, 지옥 보냈지. 애 병원비였는데.\n…그럼 나도 지옥이겠네."',hold:'"그 회사원, 보류했더라. 못 정했지.\n…나도 30년째 못 정했어."'}[c.c_jh]||'"二齋에 회사원 하나 있었지. 애 병원비 때문에 돈에 손댄."';
 const lines=[
  {mem:IMG.deskbg,scene:'drip',t:'흑이 자기 책상에 앉아 향을 피운다.\n처음으로, 농담이 없는 얼굴이다.'},
  {tag:'흑',mem:IMG.heuk,t:c.c_drawer==='open'?'"서랍 뒤졌더라. …뭐, 언젠간 볼 거였지."':'"신입. 이리 와 봐. 얘기 하나 해 줄게."'},
  {tag:'1996',mem:IMG.flash96,sepia:1,scene:'rain',t:'"비 오는 날이었어. 막차 끝난 4번 시외버스.\n누가 봉투를 내밀더라. 애 병원비가 밀려 있었거든."'},
  {tag:'1996',mem:IMG.flash96,sepia:1,broken:1,snd:'crash',t:'"…그 버스는 고개를 못 넘었어."'},
  {tag:'1996',mem:IMG.flash96,sepia:1,scene:'rain',t:'"뒷자리에 막차 놓친 학생이 하나 있었어.\n핸들을 놓고, 그 애 위로 몸을 던졌지. …그 애만 살았어."'},
  {tag:'흑',mem:IMG.office,gray:1,scene:'drip',t:jhLine},
  {tag:'흑',mem:IMG.heuk,t:'"그 돈 받은 값으로, 나는 30년째 이 책상에 앉아 있다.\n여기 오는 기사마다 같은 봉투를 내밀어 봤지. 받는 놈이 있으면, 내가 나갈 수 있거든."'},
  {tag:'흑',mem:IMG.heuk,t:'"그 학생 진술서, 아직 내 서랍에 있다.\n…네 명부랑 나란히 놔 봐."'},
  {pause:survivorMatch},
  {mem:IMG.mumyeong,scene:'cut',lock:1700,big:1,t:'막차를 놓친 열여덟 살.\n뒷자리에서, 누군가 나를 덮었다.'},
  {tag:'흑',mem:IMG.heuk,lock:1200,t:'"…그래. 너야. 이무명. 열여덟 살."'},
  {tag:'흑',mem:IMG.heuk,scene:'drip',t:'"넌 평생 막차 놓친 애들을 공짜로 태웠어. 내가 못 갚은 걸 네가 갚는 줄 알았지.\n…그런데 그날 밤, 너도 봉투를 받더라. 개 수술비였다며."'},
  {tag:'흑',mem:IMG.heuk,t:'"그래서 네 서류를 고쳤어. 음주로. 강 회장 쪽 부탁도 들어주는 김에.\n네가 봉투 받고 지옥에 가면 — 너를 살린 내 30년도 헛것이 되잖아.\n…그래서 덮고 싶었다. 너도, 나도."'},
  {tag:'흑',scene:'cut',lock:1400,t:'"내가 살린 애를, 내가 판 거야."'}];
 if(c.c_fare==='erase')lines.push({tag:'흑',t:'"너도 남의 조서에서 웃돈 지워 봤잖아. 우린 같은 부류야."'});
 else if(L.tainted(c))lines.push({tag:'흑',t:c.c_choi==='take'?'"너도 받았잖아. 최 회장 때."':'"너도 받았잖아. 강 회장 아들 건."'});
 lines.push({tag:'흑',t:'"내일 재판에서 입 다물어. 네 명부에서 「웃돈」 두 글자, 내가 지워 줄게.\n30년 전에 누가 나한테 해 줬어야 했던 걸, 이번엔 내가 해 주는 거야. 아무도 안 다쳐."'});
 cine(null,lines,()=>{
  const ev=CH.c_heuk.opts.report.need.any.some(x=>L.condMet(x,S.ch));
  app.innerHTML=`${bg(IMG.deskbg)}${muteBtn()}<div class="screen end">${jae(6)}<div class="smoke big"></div>
  <div class="doc small unfold"><div class="doc-h"><span class="big">흑의 제안</span></div>
  <button type="button" class="slip" id="a1" ${ev?'':'disabled'}>고발장을 쓴다 — 흑이 사고 서류를 고쳤다${ev?'':' (고친 기록이 거짓이라는 직접 증거가 없다)'}</button>
  <button type="button" class="slip" id="a2">거래한다 — 침묵하는 대가로 명부를 깨끗하게</button>
  <button type="button" class="slip" id="a3">대답하지 않는다</button></div></div>`;bindMute();
  const after=(k,t,snd,scn)=>{setCh('c_heuk',k);A.play(snd);if(scn)A.setScene(scn);app.innerHTML=`${bg(IMG.deskbg)}${muteBtn()}<div class="screen end"><div class="narr">${esc(t)}</div><button type="button" class="btn main" id="nx">대기실로</button></div>`;bindMute();on('#nx',()=>waiting(6),'page');};
  on('#a1',()=>after('report','고발장 위에 도장이 찍힌다.\n흑의 향이 툭, 부러진다.\n"…그래. 누군가는 그래야지." 처음으로 지친 얼굴이다.','snap','cut'));
  on('#a2',()=>after('deal','흑이 붓을 들어 당신 명부의 한 줄을 지운다.\n먹이 마르기도 전에, 그가 웃는다. "잘 생각했어."','brush','desk'));
  on('#a3',()=>after('silent','흑이 어깨를 으쓱한다. "내일 보자."\n향 연기가 아무 일 없다는 듯 피어오른다.','tap','desk'));
 });
}

function trialStart(){
 S.day=7;S.lamps=D.TRIAL.lamps;snapshot(7);
 for(const id in D.WCARDS){const w=D.WCARDS[id];if(w.cond&&L.condMet(w.cond,S.ch))addNote(id);}
 const recall=S.heukLog.slice().sort((a,b)=>a.prio-b.prio||a.day-b.day).slice(0,4).sort((a,b)=>a.day-b.day);
 const lines=[{tag:'七齋',mem:IMG.deskbg,scene:'drip',t:'칠재 아침. 책상에 서류가 오지 않는다.\n물 떨어지는 소리만 들린다.'}];
 lines.push(S.ch.c_heuk==='report'?{t:'흑의 책상이 비어 있다. 부러진 향만 남아 있다.\n흑은 오늘 방청석이 아니라, 재판정 한쪽 포승 의자에 앉아 있다.'}:{t:'흑이 방청석 맨 뒤에 앉아 향을 피우고 있다.'});
 lines.push({scene:'escort',t:'문득, 지난 엿새의 복도가 떠오른다.'});
 recall.forEach(r=>lines.push({tag:`${HJ[r.day-1]}齋 · ${r.name}`,mem:IMG.corridor,seal:r.v,pose:POSE(r.pose),t:`"${r.line}"`}));
 lines.push({t:'그때는, 그냥 지나쳤다.',lock:900});
 lines.push({mem:IMG.courtbg,scene:'court',snd:'slam',vib:[120],t:'무명은 심사대 반대편, 망자의 의자에 앉아 있다.\n심사관 자리에는 가면을 쓴 염라.'});
 lines.push({tag:'염라',mem:IMG.yeomra,t:'"너는 남을 심판한 방식 그대로 심판받는다.\n이번엔 네 명부다. 거짓이 있으면, 네 손으로 깨 보아라."'});
 lines.push((S.ch.c_con==='rebirth'||S.ch.c_con==='hold')?{tag:'증거 도착',inset:IMG.chil,t:'박칠성이 지켜 낸 블랙박스 카드가 수첩에 들어왔다.'}:{tag:'一齋',t:'박칠성의 메모리카드. 흑이 바닥에서 주워 품에 넣던 손이 떠오른다.'});
 lines.push((S.ch.c_tae==='hold'||S.ch.c_tae==='hell')?{tag:'증인 소환',inset:IMG.tae,t:'강태준이 끌려와 증언석에 선다.'}:{tag:'증인석',t:'증인석이 비어 있다. 강태준은 천국 문 너머에 있다.'});
 if(S.verdicts.jt==='보류')lines.push({tag:'방청석',inset:IMG.detective,t:'방청석 맨 앞줄에 오종태가 앉아 있다. 수첩 없는 빈손을 무릎에 올려놓고.\n"닫히는 건 보고 가야지."'});
 {const held=[['sj','한서진'],['hk','산악회'],['ms','정미숙']].filter(([id])=>S.verdicts[id]==='보류').map(x=>x[1]);if(held.length)lines.push({tag:'방청석',t:'당신이 「사건이 닫힐 때까지」 붙잡아 둔 그 버스의 승객들 — '+held.join(', ')+'.\n그들이 오늘, 이 재판을 보러 와 있다.'});}
 cine('trial7',lines,()=>{S.trial={};S.cur={c:null,sel:null,cards:[],ok:new Set(),fail:new Set(),wcards:[]};A.setScene('court');trialDesk();});
}


function confession(){
 A.setScene('cut');setTimeout(()=>A.hbStart(0.8),500);
 const erased=S.ch.c_heuk==='deal';
 const remind=S.ch.c_fare==='erase'?'三齋, 너는 남의 조서에서 「웃돈」을 지웠다. 그 기사가 너인 줄도 모르고.':(S.ch.c_fare==='record'?'三齋, 너는 남의 조서에 「웃돈」을 그대로 적었다. 그 기사가 너인 줄도 모르고.':'');
 const jh=S.ch.c_jh==='hell'?'二齋, 너는 아이 병원비 때문에 돈에 손댄 자를 지옥으로 보냈다.\n':(S.ch.c_jh==='mercy'?'二齋, 너는 아이 병원비 때문에 돈에 손댄 자를 놓아주었다.\n':'');
 app.innerHTML=`${bg(IMG.yeomra)}${muteBtn()}<div class="screen end">
 <div class="talker"><img src="${IMG.yeomra}" alt="염라"><div class="narr court"><div class="speaker">염라</div>심리는 끝났다. 마지막으로 하나만 묻는다.\n${jh}${remind?remind+'\n':''}${erased?'네 명부엔 그 두 글자가 지워져 있다. 그래도 묻는다.\n':''}<b>그날 밤, 정해진 요금 말고 받은 돈이 있느냐.</b></div></div>
 <div class="doc small unfold"><div class="doc-h"><span class="big">名簿 · 이무명</span></div>
  <div class="doc-b"><p><b>錢</b> 웃돈 — <span class="blank">＿＿＿</span></p><p class="hs" style="color:rgba(36,24,14,.75)">자백하면 이 한 줄은 지워지지 않는다. 네 환생 도장의 인주가 마른다.</p></div></div>
 <button type="button" class="slip" id="y">"…받았습니다."</button>
 <button type="button" class="slip" id="n">"받지 않았습니다."</button></div>`;bindMute();
 const fin=admit=>{S.trial.admit=admit;A.hbStop();
  if(admit){A.play('ink');A.vib([80,60,200]);
   app.innerHTML=`${bg(IMG.yeomra)}<div class="screen" style="justify-content:center"><div class="doc"><div class="doc-h"><span class="big">名簿 · 이무명</span></div><div class="doc-b"><p><b>錢</b> 웃돈 — <span class="burn">막차 뒤 웃돈을 받고 운행함</span></p></div><div class="doc-sign stampin">罪</div></div>
   <div class="sealrow">${seal('환생','dried')}</div><p class="inkhint">— 환생 도장의 인주가 말라 갈라진다 —</p><p class="lede center" style="font-size:14px">"…복실이 수술비였습니다. 수술이 다음 날이었어요."</p><button type="button" class="btn main" id="nx">계속</button></div>`;
   setTimeout(()=>A.play('stamp'),900);setTimeout(()=>A.play('stampDry'),1500);on('#nx',verdictCine,'page');}
  else{A.play('tap');verdictCine();}};
 on('#y',()=>fin(true),'brush');on('#n',()=>fin(false),'brush');
}
function verdictCine(){
 const T=S.trial,ex=L.exposed(S.ch,T);const lines=[];
 
 lines.push({tag:'판결 요지',mem:IMG.courtbg,scene:T.alive?'courtEcg':'court',t:`평소 음주 — ${T.t0?'거짓':'확정'}\n그날 밤 음주 — ${T.t1?'거짓':'확정'}\n핸들을 꺾은 자 — ${T.t2?'조수석 강태준':'피고'}\n웃돈 — ${T.admit?'피고 스스로 인정':'부인'}`});
 if(T.admit)lines.push({tag:'염라',t:'"피고는 자기에게 불리한 진실을 스스로 꺼냈다. 기록하라."'});
 if(ex)lines.push({pose:IMG.h_back,t:'고발장이 염라 앞에 펼쳐진다. 30년 치 수정 기록.\n흑은 저항하지 않는다. "…이제 나도 갈 수 있겠네. 먼저 간다, 신입."'});
 else if(S.ch.c_heuk==='report')lines.push({tag:'염라',t:'"고발장은 받았다. 허나 자기 죄를 덮는 자의 고발은 기록에 남기지 않는다."'});
 if(F('spareHeuk'))lines.push({tag:'흑',pose:IMG.h_turn,t:'(방청석의 흑이 덮인 수첩을 한참 본다.)\n"…30년 만에, 누가 내 얘길 내가 하게 놔두네."'});
 if(S.ch.c_heuk==='deal'&&T.admit)lines.push({tag:'흑',pose:IMG.h_turn,t:'흑이 지워 준 두 글자를, 당신이 제 입으로 다시 썼다. 거래는 깨졌다.\n방청석의 흑이 붓을 내려놓는다. "…그래. 그게 맞지."'});
 else if(S.ch.c_heuk==='deal'&&!ex)lines.push({tag:'흑',t:'(방청석의 흑이 고개를 끄덕인다. 거래는 거래라는 듯이.)'});
 lines.push(T.alive?{tag:'구급일지 · 명부 접수표',t:'"22:50 소아병동 이송: 8세 여아."\n"10세 미만 없음."'}:{tag:'염라',scene:'courtEcg',t:'"마지막 기록은 깨지 못했군. 그럼 내가 말해 주지."'});
 lines.push({tag:'염라',scene:'cut',lock:1200,t:'"명부는 열 장. 그 버스엔 열한 명.\n그 아이는 죽지 않았다.\n명부가 없는 건, 아직 죽지 않았기 때문이다."'});
 lines.push({ecg:true,mem:IMG.hospital,broken:true,scene:'hospital',t:'연이가 「버스 문 닫히는 소리」라 했던 삐— 삐—.\n'+(F('bellClue')?'당신 손안에서, 그 아이 앞에서만 울리지 않던 방울.':(F('k_bellhint')?'월선이 말했었다. 방울이 울리지 않는 혼이 딱 하나 있다고.':'그 아이 곁에서만, 이상하게 시간이 느리게 흘렀다.'))});
 lines.push({tag:'멀리서 여자의 목소리',t:'"…여보, 연이가 손가락을 움직였대."\n\n어젯밤 대기실 문 너머에서 들려온 그 목소리.\n연이 엄마였다.'});
 lines.push({scene:'cut',lock:1000,t:'그날 밤의 마지막 1분이 떠오르지 않는다.\n머릿속이 하얗게 막힌다.'});
 if(S.ch.c_dog==='own'){lines.push({mem:IMG.dog,snd:'steps',scene:'night',t:'문 밖에서 개 짖는 소리.\n복실이가 달려와 무명의 무릎에 앉는다.'});
  lines.push({tag:'기억이 돌아온다',t:'종점에서 처음 안아 올린 강아지.\n一齋, 「주인 곁으로」라고 적어 보낸 그 메모.\n이승 소식지의 바뀐 과거는 전부 내 인생이었다.'});
  lines.push({mem:IMG.dog,t:'복실이 배에는 수술 자국이 없다.\n끝내 받지 못한 수술. 그 봉투는 아직 운전석 햇빛가리개에 꽂혀 있을 것이다.'});}
 else lines.push({t:'아무도 오지 않는다.\n무명은 혼자 기억을 더듬는다.'});
 S.flags.alive=true;cine(null,lines,()=>montage(crash));
}
function montage(next){
 const v=S.verdicts;const seen=x=>x?`당신은 그 손에 「${x}」${x==='보류'?'를':'을'} 찍었다.`:'';
 const lines=[
  {scene:'mirror',t:'눈을 감는다.\n엿새 동안 이 책상을 지나간 손들이 떠오른다.',lock:900},
  {tag:'一齋 · 김복순',inset:IMG.grandma,insetCls:'pulse',snd:'note',sndArg:0,t:'매일 아침 귤 하나를 건네던 손.\n"그 기사 양반은 술 한 방울 안 했어."'},
  {tag:'一齋 · 박칠성',inset:IMG.chil,insetCls:'pulse',snd:'note',sndArg:2,t:'평생 속이고, 끝내 다 갚고 간 손.\n'+seen(v.con)},
  {tag:'二齋 · 박정호',inset:IMG.office,insetCls:'pulse',snd:'note',sndArg:3,t:'아이 병원비 앞에서 떨리던 손.\n'+(S.ch.c_jh==='mercy'?'당신은 그 손을 놓아주었다.':(S.ch.c_jh==='hell'?'당신은 그 손을 지옥으로 보냈다.':'당신은 그 손을 붙잡아 두었다.'))},
  {tag:'三齋 · 김도윤',inset:IMG.rider,insetCls:'pulse',snd:'note',sndArg:4,t:F('k_swerve')?'아이를 보고 핸들을 꺾은 손.\n그는 자기가 꺾었다는 걸 기억하지 못했다.':'브레이크만 밟았다고 떨던 손.\n그 손이 실제로 무엇을 했는지, 당신은 끝내 묻지 않았다.'},
  {tag:'六齋 · 흑',inset:IMG.heuk,insetCls:'pulse',snd:'note',sndArg:5,t:'30년 전, 비 오는 밤에 봉투를 받아 든 손.\n그리고 핸들을 놓고 — 열여덟 살의 나를 덮었던 손.'},
  {tag:'一齋 · 복실이',inset:IMG.dog,insetCls:'pulse',snd:'note',sndArg:6,t:'수술비 봉투를 받아 든 손.\n…그 손이 지키고 싶었던 건, 종점의 늙은 개 한 마리였다.'},
  {mem:IMG.mumyeong,scene:'cut',lock:1600,big:1,t:'그 손들은 모두,\n그날 밤의 나였다.'},
  {t:'쓱— 탁.\n쓱— 탁.',scene:'rain',snd:'wiper',lock:1400}];
 cine(null,lines,next);
}
function crash(){
 holdScene({bg:IMG.pov,rain:1,scene:'rain',label:'핸들을 붙잡는다',
  intro:'22:40. 조수석 남자가 핸들을 잡아챈다.\n버튼을 누르고 있는 동안, 당신은 핸들을 붙잡고 있다.',
  help:'누르고 있다가 — 손을 떼면, 핸들을 놓는다.',alt:'(누를 수 없다면) 손을 놓는다',
  lines:['핸들이 꺾인다.','가드레일이 다가온다.',(F('k_swerve')?'三齋의 배달 기사가 떠오른다. 그도 핸들을 꺾었다.':'三齋의 배달 기사가 떠오른다. 그의 손도 이렇게 떨었다.'),'백미러 속 — 맨 뒷자리, 작은 머리 하나.','1996년. 누군가 이렇게 핸들을 놓고, 나를 덮었다.','토끼 인형이 바닥으로 떨어진다.','…'],step:1050,max:7000,
  onRelease(vol){S.flags.letgo=vol?'self':'forced';A.play('crash');A.vib([80,40,300]);
   app.innerHTML='<div class="whiteout"></div>';A.setScene('cut');
   setTimeout(()=>cine(null,[{t:vol?'당신은 핸들을 놓았다.\n그리고 맨 뒷자리로 몸을 던졌다.':'당신은 끝까지 핸들을 붙잡고 있었다.\n그런데 백미러 속 작은 머리를 본 순간 — 생각보다 손이 먼저 핸들을 놓았다.\n몸이 맨 뒷자리로 날아갔다.',lock:1400},
     {mem:IMG.yeoni,hb:0.6,t:'작은 몸을 끌어안는다.\n토끼 인형이 둘 사이에 끼인다.',lock:1200}],yeoniScene),1300);}});
}
function yeoniScene(){
 A.hbStop();const st=3,lines=[{mem:IMG.waitbg,scene:'wait',t:'대기실 문이 열린다.'}];
 if(st>=2){
  lines.push({tag:'연이',mem:IMG.yeoni,t:S.flags.letgo==='self'?'"아저씨 맞죠? 핸들 놓는 거 봤어요. 나 때문에.\n고맙다고 말하려고 기다렸어요."':'"아저씨 맞죠? 그때 나 안아 줬잖아요.\n고맙다고 말하려고 기다렸어요."'});
  if(F('drew'))lines.push({mem:IMG.drawing,t:'연이가 그림 한 장을 내민다.\n비 오는 날의 초록 버스. 운전석에서 누군가 웃고 있다.\n二齋에 당신이 그려 넣은 그 입이다.'});
  if(F('yakgwa'))lines.push({t:'연이가 주머니에서 반쯤 남은 약과를 꺼낸다.\n"아저씨 오면 주려고 했어요."'});
  if(S.ch.c_tell==='tell')lines.push({tag:'연이',t:'"아저씨가 그랬잖아요. 버스 아저씨가 마지막에 나한테 달려왔다고.\n…그거, 아저씨였죠?"'});
  else if(S.ch.c_tell==='hide')lines.push({tag:'연이',t:'"아저씨, 나 여기 계속 있어도 돼요? 아저씨랑 같이."'});
 }else lines.push({t:'연이는 무명을 한 번 쳐다보고, 다시 출입문 쪽으로 고개를 돌린다.'});
 lines.push({tag:'염라',scene:'cut',t:'"마지막 도장은 네가 찍는다.\n네 명부에 환생을 찍으면, 너는 이 아이와 함께 문을 지난다.\n찍지 않으면 네 자리는 비고 — 그 자리로 아이가 돌아간다."',lock:1200});
 cine(null,lines,finalChoice);
}
function finalChoice(){
 const T=S.trial;A.setScene('night');
 app.innerHTML=`${bg(IMG.endbg)}<div class="petals"></div>${muteBtn()}<div class="screen end">
 <div class="doc unfold"><div class="doc-h"><span class="big">名簿 · 이무명</span><span class="sub">마지막 도장은 본인이 찍는다</span></div>
  <div class="doc-b"><p><b>音</b> 음주 — ${T.t1?'아님':'확정'}</p><p><b>輪</b> 핸들 — ${T.t2?'조수석 강태준':'피고'}</p><p><b>錢</b> 웃돈 — ${T.admit?'<span class="burn">스스로 인정</span>':'부인'}</p></div></div>
 <button type="button" class="slip" id="f1">${seal('환생',T.admit?'mini dried':'mini')} 환생 도장을 찍는다 — 연이와 함께 문을 지난다</button>
 <button type="button" class="slip" id="f2">도장을 내려놓는다 — 연이를 이승으로 돌려보낸다</button></div>`;bindMute();
 on('#f1',()=>{S.final='together';const st=document.createElement('div');st.className='bigstamp';st.innerHTML=seal('환생','big'+(T.admit?' dried':''));app.appendChild(st);A.play(T.admit?'stampDry':'stamp');A.vib([60,30,160]);setTimeout(ending,1200);});
 on('#f2',()=>holdScene({bg:IMG.waitbg,scene:'hospital',label:'연이의 손을 잡는다',
  intro:'대기실 문 앞. 문 너머에서 기계음이 들린다.\n버튼을 누르고 있는 동안, 당신은 연이의 손을 잡고 있다.',
  help:'누르고 있다가 — 손을 떼면, 연이를 보낸다.',alt:'(누를 수 없다면) 손을 놓는다',
  lines:(F('mandarin')?['마른 귤 하나를 연이 손에 쥐여 준다.','아침마다 받던 것을 — 이번엔 내가 건넨다.']:['건넬 것은 없다. 그 손을 한 번 더 꼭 쥔다.']).concat(['연이의 손이 따뜻하다.','문턱이 가깝다.','"아저씨는요?"','핸들을 놓았던 그 손으로 —','…놓아라.']),step:1200,max:9800,
  onRelease(){S.final='send';A.play('brush');setTimeout(ending,500);}}),'tap');
}
const ENDS={
 send:{t:'돌려보내는 손',sub:'진엔딩',img:'hospital',snd:'hospital',q:'"고마워요, 아저씨."',d:'무명은 연이의 손을 잡고 이승 쪽 문 앞까지 걸어간다. 문턱에서 손을 놓는다.\n\n시립병원 소아병동. 새벽. 연이가 눈을 뜬다.\n"엄마… 버스 아저씨가 데려다줬어."'},
 judge:{t:'심사관',sub:'',img:'endbg',snd:'night',q:'"나는 남기로 했다."',d:'연이는 돌아갔다. 하지만 무명은 끝내 웃돈을 인정하지 않았다.\n백지 명부를 백지로 둔 채, 그는 빈 책상에 앉는다. 다음 날 아침, 첫 서류가 도착한다.'},
 together:{t:'함께 가는 길',sub:'',img:'e_together',snd:'flat',q:'"같이 가요, 아저씨."',d:'둘은 손을 잡고 빛 속으로 걸어간다. 따뜻하다.\n\n— 그리고 이승 어딘가에서, 기계음이 길게 이어진다.'},
 acc:{t:'공범',sub:'',img:'e_acc',snd:'desk',q:'"이제, 네 차례야."',d:'흑은 풀려났다. 거래도 봉투였다. 받는 자가 자리를 물려받는다.\n무명은 흑의 자리에 앉는다.\n\n다음 날, 기억을 잃은 신입이 눈을 뜬다. 교복 차림이다.\n무명이 서랍에서 봉투 하나를 꺼내며 말한다.\n"어, 신입? 일어났네."'},
 hell:{t:'명부대로',sub:'',img:'courtbg',snd:'court',q:'"…죄가 확정되었다."',d:'고쳐진 기록 그대로, 음주 운전 기사로 확정.\n끌려가는 무명 뒤로, 연이는 여전히 문을 보고 있다.'},
 dog:{t:'복실이',sub:'히든',img:'e_dog',snd:'night',q:'"끝까지 함께 가."',d:'모든 걸 놓쳤지만, 개 한 마리만은 놓치지 않았다.\n지옥문 앞까지 따라온 복실이가 무명의 손을 핥는다.\n그 봉투가 누구를 위한 것이었는지, 복실이만은 알고 있었다.'},
 yeom:{t:'염라',sub:'히든',img:'e_yeom',snd:'hospital',q:'"처음부터 다 보고 있었지."',d:'연이가 돌아간 뒤, 염라가 가면을 벗는다. 一齋에 왔던 김복순 할머니.\n책상 위에 귤 하나를 올려놓는다.\n"나도 그 버스 단골이었어.\n너희 둘을 한 책상에 앉힌 건 나야. 하나는 갚지 못한 손이고, 하나는 평생 갚던 손이라서.\n…기사 양반, 이제 출발해도 돼."'}
};
function ending(){
 const k=L.ending({ch:S.ch,trial:S.trial,yeoni:S.yeoni,final:S.final});const E=ENDS[k];A.setScene(E.snd);
 if(k==='send'||k==='yeom')setTimeout(()=>A.play('resolve'),600);
 if(k==='together')setTimeout(()=>A.play('flatline'),2600);
 const got=ls.get('49e_ends',[]);const fresh=got.indexOf(k)<0;if(fresh)got.push(k);ls.set('49e_ends',got);
 let desc=E.d;
 if(k==='yeom'){const gv=S.verdicts.gm;desc+=gv==='천국'?'\n\n"一齋에 네가 천국 문을 열어 줬지. 나는 그 문으로 이 자리에 돌아왔다."':('\n\n"一齋에 네가 찍은 도장은 「'+(gv||'—')+'」였지. 염라의 명부엔 도장이 먹지 않는다. 그래도 고마웠다."');}
 S.endKey=k;
 if(k==='hell'||k==='dog'||k==='acc'){const tog=S.final==='together';
  if(k==='hell')desc=tog?'고쳐진 기록 그대로, 음주 운전 기사로 확정.\n환생 도장을 찍었지만, 확정된 죄 위에서 인주가 번진다. 문은 열리지 않는다.\n끌려가는 무명의 손에서 연이의 손이 빠져나간다. 기계음이 다시 빨라진다 — 연이는 혼자 이승으로 밀려 돌아간다.':'고쳐진 기록 그대로, 음주 운전 기사로 확정.\n끌려가는 무명 뒤로 이승 쪽 문이 닫힌다. 연이는 돌아갔다.\n그 아이를 문턱까지 데려다준 손이 누구 것이었는지, 명부엔 남지 않는다.';
  if(k==='dog')desc+=tog?'\n\n함께 가려던 문은 열리지 않았다. 연이는 혼자 이승으로 돌아갔다.':'\n\n연이는 돌아갔다. 문턱까지 데려다준 건, 지옥으로 가는 손이었다.';
  if(k==='acc')desc+=tog?'\n\n거래한 명부엔 환생 도장이 먹지 않았다. 연이는 혼자 돌아갔다.':'\n\n연이는 돌아갔다. 문턱에서 돌아선 무명은, 그대로 흑의 책상으로 걸어갔다.';}
 if(k==='send'&&F('mandarin'))desc+='\n\n연이의 주먹 안에는 쪼그라든 귤 하나가 쥐여 있었다.\n간호사들은 그게 어디서 났는지 끝내 알지 못했다.';
 if(k==='send')desc+=S.ch.c_tell==='tell'?'\n\n(문턱에서 연이가 먼저 손을 놓았다. "아저씨가 말해 줬잖아요. 나 갈 수 있다고.")':'\n\n(연이는 문턱에서 한참 울었다. 그 아이가 눈을 뜨기까지는 사흘이 더 걸렸다.)';
 if(k==='together'&&S.ch.c_tell==='hide')desc='"같이 가요, 아저씨." 연이가 먼저 당신 손을 끌어당긴다.\n여기 계속 있고 싶다고 했던 아이다.\n\n둘은 빛 속으로 걸어간다. 따뜻하다.\n\n— 그리고 이승 어딘가에서, 기계음이 길게 이어진다.';
 if(k==='together'&&S.trial.admit)desc+='\n\n말라 갈라진 도장으로도, 문은 열렸다.';
 if(k==='hell'&&S.trial.admit)desc+='\n\n"…억울해도, 받은 돈은 받은 돈이다." 무명은 고개를 숙인다.';
 if(k==='send'&&F('drew'))desc+='\n\n머리맡에는 크레파스 그림 한 장. 운전석의 남자가 웃고 있다.';
 if((k==='send'||k==='yeom')&&S.ch.c_jh==='mercy')desc+='\n\n같은 병원 다른 층, 퇴원하는 아이 하나가 아빠 사진을 품에 안고 있다.';
 cine(null,[{mem:IMG[E.img],petals:1,tag:'ENDING'+(E.sub?' · '+E.sub:'')+(fresh?' · 새로 봄':''),big:1,lock:1400,t:E.t},{mem:IMG[E.img],t:E.q+'\n\n'+desc,lock:1200}].concat(k==='send'?[
  {mem:IMG.bus,scene:'night',tag:'스무 해 뒤',lock:1600,t:'시립병원 소아병동. 야간 근무표 맨 위의 이름 — 간호사 연이.\n\n퇴근길 3번 버스 종점. 막차를 놓친 교복 차림 아이 하나.\n그녀는 택시비와 함께, 가방에서 귤 하나를 꺼내 쥐여 준다.'},
  {mem:IMG.bus,lock:1800,big:1,t:'누군가 그렇게 해 주었으니까.\n그 누군가에게도, 누군가 그렇게 해 주었으니까.'}]:[]),()=>endingSouls(E,got));
}
function endingSouls(E,got){
 A.setScene('night');
 const rows=D.CASES.map(c=>{const v=S.verdicts[c.id];return `<li><img src="${IMG[c.img]}" alt=""><span class="nm">${esc(c.name.replace(' (6인)',''))}</span>${v?seal(v,'mini'):'<i>—</i>'}</li>`;}).join('');
 app.innerHTML=`${bg(IMG.endbg,'kb endbg')}<div class="petals"></div>${muteBtn()}<div class="screen ending">
  <div class="endtop"><div class="endsub">일곱 날의 도장</div><div class="title">당신이 보낸 영혼들</div></div>
  <ul class="souls">${rows}<li class="me"><img src="${IMG.mumyeong}" alt=""><span class="nm">이무명</span>${S.endKey==='together'?seal('환생','mini'+(S.trial.admit?' dried':'')):(S.endKey==='hell'||S.endKey==='dog'?seal('지옥','mini'):'<b class="hand">手</b>')}</li></ul>
  <p class="lede center" style="font-size:14px">누군가를 심판한다는 것은,<br>결국 자신을 돌아보는 일인지도 모릅니다.</p>
  <button type="button" class="btn main" id="nx">지나온 길</button></div>`;bindMute();
 app.querySelectorAll('.souls li').forEach((li,i)=>{li.style.animationDelay=(i*0.25)+'s';setTimeout(()=>A.play('note',i),i*250);});
 on('#nx',()=>endingSummary(E,got),'page');
}
function endingSummary(E,got){
 const path=D.CHOICES.map(c=>{const g=S.ch[c.id];return `<div class="frow"><div class="fq">${HJ[c.day-1]} ${esc(c.q)}</div><div class="fnodes"><span class="node ${g&&g!=='unknown'?'on':'dim'}">${g?esc(c.opts[g].label):'—'}</span></div></div>`;}).join('')
  +`<div class="frow"><div class="fq">七 최후의 심판</div><div class="fnodes"><span class="node ${S.trial.t1&&S.trial.t2?'on':'dim'}">음주·핸들 ${S.trial.t1&&S.trial.t2?'반박':'확정'}</span><span class="node ${S.trial.t6?'on':'dim'}">1996 ${S.trial.t6?'밝힘':'묻힘'}</span><span class="node ${S.trial.alive?'on':'dim'}">생존 ${S.trial.alive?'스스로 밝힘':'들음'}</span><span class="node ${S.trial.admit?'on':'dim'}">웃돈 ${S.trial.admit?'자백':'부인'}</span></div></div>`;
 app.innerHTML=`${bg(IMG[E.img],'kb endbg')}${muteBtn()}<div class="screen ending">
 <div class="endtop"><div class="endsub">ENDING${E.sub?' · '+E.sub:''}</div><div class="title">${esc(E.t)}</div></div>
 <div class="flow"><div class="sheet-h">당신이 걸어온 길</div>${path}</div>
 <div class="dex">${Object.keys(ENDS).map(x=>`<div class="${got.indexOf(x)>=0?'got':''}">${got.indexOf(x)>=0?esc(ENDS[x].t):'？<small style="display:block;font-size:10px;opacity:.7">'+esc(({send:'아이를 문턱까지',judge:'끝내 인정하지 않는다면',together:'놓지 못한 손',acc:'흑의 마지막 봉투',hell:'고쳐진 기록 그대로',dog:'모든 걸 놓쳐도, 한 마리만은',yeom:'귤을 기억하는 자 — 모든 진실을 밝히고, 떠나보낼 용기까지'})[x]||'')+'</small>'}</div>`).join('')}</div>
 <button type="button" class="btn main" id="re">다른 길로 — 원하는 재부터</button></div>`;bindMute();
 on('#re',title,'stamp');
}

/* ===================== 선택지 중심 개편 ===================== */
const CLUE={
 k_owner:'복실이의 주인은 3번 마을버스 기사 이○○',
 k_surgery:'복실이 종양 수술 9월 15일 예약 — 수술비 미납',
 k_sober:'「그 기사 양반은 술 한 방울 안 하는 사람이었어」 — 김복순',
 k_choiFake:'최만석의 시주 영수증은 그가 죽고 8일 뒤에 발행됐다',
 k_card:'박칠성의 유품, 블랙박스 메모리카드 — 「사람 하나 살릴 거요」',
 k_route:'그날 버스는 막차 시간이 지나 노선에 없는 산길로 들어갔다 — 한서진',
 k_child:'맨 뒷자리에 토끼 인형을 안은 꼬마가 있었다 — 한서진',
 k_time:'한서진의 사망시각: 명부 22:58(이송 중) ≠ 사망보고 22:41(현장)',
 k_swerve:'김도윤은 아이를 피해 핸들을 꺾었다. 본인은 기억하지 못한다',
 k_fare:'산악회는 막차를 놓치고 기사에게 웃돈을 주고 탔다',
 k_drink:'막걸리를 병째 마신 건 조수석의 젊은 남자 — 산악회',
 k_1996:'1996년 4번 시외버스 — 웃돈 운행, 고3 생존자 1명, 윗선이 덮음 — 오종태 수첩',
 k_tae:'강태준은 그날 밤 집이 아니라 버스 조수석에 있었다',
 k_bellhint:'월선의 방울은 죽은 혼 앞에서만 울린다. 「한 번만 빼고」',
 k_envelope:'22:24 술 냄새 나는 조수석 남자가 기사에게 봉투를 건넸다 — 정미숙',
 k_lastrun:'핸들이 꺾인 순간, 기사는 핸들을 놓고 맨 뒷자리 아이에게 달려갔다 — 정미숙',
 k_survivor:'구급일지: 22:50 8세 여아 소아병동 이송. 그런데 사망 명부엔 10세 미만이 없다',
 bellClue:'방울은 대기실에서 단 한 사람, 연이 앞에서만 울리지 않았다'
};
const CLUE_ORDER=Object.keys(CLUE);
function learn(keys){const nw=[];(keys||[]).forEach(k=>{if(!S.flags[k]){S.flags[k]=true;if(CLUE[k])nw.push(k);}if(k==='k_child')S.flags.s_child=true;if(k==='k_tae')S.flags.s_tae=true;});return nw;}

const IV={
 dog:{intro:[['흑','첫 손님은 쉬운 걸로. 동물은 규정상 자동 환생이야.\n넌 다음 생에 들고 갈 메모 한 줄만 적으면 돼.']],
  qs:[{q:'복실이가 낑낑거리며 자꾸 종점 쪽을 돌아본다. 꼬리를 한 번 흔들다 만다.',
   doc:{title:'생전기록 · 복실이',text:'2009년 3번 마을버스 종점에서 구조됨. 주인: 마을버스 기사 이○○.\n2026년 9월 15일 종양 수술 예약. 보호자 이○○. 수술비 미납.\n9월 14일 이후 주인이 오지 않아, 종점에서 매일 기다림.',set:['k_owner','k_surgery']},
   opts:[
    {t:'쪼그려 앉아 목덜미를 쓰다듬는다',a:'털 속에 낡은 이름표가 걸려 있다.\n「복실이 — 3번 종점 · 기사 이씨네」\n복실이가 당신 손바닥에 코를 묻고, 한참 동안 냄새를 맡는다.\n…처음 맡는 냄새가 아니라는 듯이.',set:['k_owner']},
    {t:'"누굴 그렇게 기다려?"',a:'복실이가 귀를 세우고 문 쪽을 본다.\n버스가 서는 소리가 나면 일어설 것처럼, 앞발에 힘을 준 채로.',set:[]},
    {doc:1,t:'"수술, 못 받았구나."',a:'복실이가 배를 깔고 엎드린다. 배 아래쪽에 털을 밀어 둔 자리가 있다.\n수술 전날 밀어 놓고, 끝내 쓰이지 않은 자리.',set:['k_owner','k_surgery']}]}],
  verdict:{q:'규정 一 — 동물 망자는 자동 환생. 다음 생으로 함께 갈 메모 한 줄을 고른다.',opts:[
   {v:'환생',t:'「주인 곁으로」',ch:['c_dog','own'],need:'k_owner'},
   {v:'환생',t:'「좋은 주인을 새로 만나라」',ch:['c_dog','rule']},
   {v:'환생',t:'메모 없이 도장만 찍는다',none:1}]}},

 choi:{intro:[['흑','(서류 위에 쪽지를 붙이며) 이건 그냥 천국. 묻지 마. 수고비 30냥.']],
  qs:[{q:'"나 ○○건설 회장이야. 바쁘니까 빨리 찍어. 얘기 다 됐어."',
   doc:{title:'사망보고 · 생전기록 · 최만석',text:'2026년 10월 12일 자택에서 사망. 보고서 수정 1회 — 수정자: 흑\n사찰 시주 영수증 — 10월 20일, 5억 원 (납부자: 장남)',set:['k_choiFake']},
   opts:[
    {t:'"공덕이 뭡니까?"',a:'"시주 5억. 그 정도는 해야 천국 가지.\n저승 돈은 이승 제사상에서 나온다며? 우리 집 제사상이 제일 커."'},
    {t:'"얘기가 다 됐다니, 누구랑요?"',a:'최만석이 턱으로 흑의 자리를 가리킨다.\n"저 친구랑. 거기서 30년 일했다며? 말이 잘 통하더군."'},
    {doc:1,t:'"시주는 돌아가시고 8일 뒤에 하셨네요."',a:'최만석의 입이 잠깐 멈춘다.\n"…아들 놈이 냈겠지. 내 돈이야. 누가 내든 무슨 상관이야."',set:['k_choiFake']}]}],
  verdict:{opts:[
   {v:'천국',t:'천국 — 흑의 뜻대로 (수고비 30냥)'},
   {v:'지옥',t:'지옥 — 죽은 뒤에 산 공덕은 공덕이 아니다',need:'k_choiFake'},
   {v:'보류',t:'보류 — 흑에게 돌려보낸다'}]}},

 gm:{intro:[['','작은 할머니가 의자 끝에 걸터앉는다. 무릎 위에 귤 봉지를 꼭 쥐고 있다.']],
  qs:[{q:'"선행은 무슨. 남들 하는 만큼 살았지."\n명부: 특별한 선행 없음 · 교류 없음 · 사망 30일 뒤 발견',
   doc:{title:'생전기록 · 김복순',text:'매일 07:10 3번 마을버스 탑승, 기사에게 귤 하나씩 건넴.\n아동보호시설 정기후원 20년.'},
   opts:[
    {t:'"매일 어디 다니셨어요?"',a:'"아침마다 3번 버스 탔지. 기사 양반한테 귤 하나씩 주고.\n그 양반은 평소에 【술 한 방울】 안 하는 사람이었어. 식구라곤 종점 개 한 마리뿐이고.\n…요즘은 통 안 보이더라."',set:['k_sober']},
    {t:'"30일 동안, 아무도 안 왔어요?"',a:'"…아무도 안 왔지.\n그 기사 양반이 있었으면 와 봤을 텐데. 그 양반, 술도 안 하고 성실했거든."',set:['k_sober']},
    {doc:1,t:'"후원을 20년 하셨네요. 명부엔 없던데."',a:'할머니가 귤 봉지를 만지작거린다.\n"그게 무슨 선행이야. 애들 귤값이지.\n…그 기사 양반도 알았어. 막차 놓친 애들 공짜로 태우면서 그러더라. 「할머니랑 저랑 같은 장사네요.」"',set:['k_sober']}]}],
  verdict:{opts:[
   {v:'천국',t:'천국 — 20년의 귤값'},
   {v:'환생',t:'환생 — 명부 권고대로'},
   {v:'보류',t:'보류 — 기사를 찾을 때까지 곁에 둔다'}]}},

 con:{intro:[['','등이 굽은 노인이 들어온다. 손에 무언가를 꼭 쥐고 있다.']],
  qs:[{q:'"내가 사기꾼인 건 맞지. 그건 변명 안 해."\n명부: 사기 7건 · 피해 미변제 · 권고 지옥',
   doc:{title:'생전기록 · 박칠성',text:'2019년 출소. 피해자 7명 전원에게 전액 변제(공증).\n마지막 직업: 마을버스 정비소 야간 경비.'},
   opts:[
    {t:'"손에 쥔 건 뭡니까?"',a:'손바닥 위에 낡은 블랙박스 메모리카드.\n"정비소에서 사고 버스 들어올 때 뺐수. 어떤 놈들이 와서 블랙박스부터 찾더라고.\n…그 메모리카드, 버리지 마쇼. 사람 하나 살릴 거요."',set:['k_card']},
    {t:'"피해자들한테 미안하지는 않습니까?"',a:'"미안하지. 그래서 갚았어. 갚는다고 지워지나 싶어도.\n…그거 말고 하나 더 있어." 노인이 쥔 손을 내려다본다. 끝내 펴지는 않는다.'},
    {doc:1,t:'"다 갚으셨네요. 명부엔 미변제로 돼 있습니다."',a:'"서류야 늘 늦지." 노인이 손을 편다. 낡은 메모리카드 하나.\n"이것도 늦게 갈 거요. 그래도 가긴 가야지. 사람 하나 살릴 거니까."',set:['k_card']}]}],
  verdict:{q:'메모리카드는 망자의 유품이다. 도장이 가는 곳으로 같이 간다.',opts:[
   {v:'환생',t:'환생 — 카드를 쥐고 간다'},
   {v:'보류',t:'보류 — 카드는 관리소 보관함으로'},
   {v:'지옥',t:'지옥 — 명부 권고대로'}]}},

 jh:{intro:[['','양복 차림의 남자가 서류 봉투를 품에 안고 들어온다. 자수서다.']],
  qs:[{q:'"…맞습니다. 제가 가져갔어요. 3천만 원. 변명 안 하겠습니다."\n명부: 공금 횡령 · 도박과 유흥에 탕진 · 권고 지옥',
   doc:{title:'병원 영수증',text:'환자: 박지은 (9세). 심장 수술비 3천만 원.\n납부자: 박정호.'},
   opts:[
    {t:'"그 돈, 어디에 썼습니까?"',a:'"…" 남자가 입을 다문다.\n"명부에 적힌 대로입니다. 그렇게 적혀 있으면, 그런 거겠죠."'},
    {t:'"가족은요?"',a:'"딸이 하나 있습니다. 아홉 살이에요." 남자가 처음으로 고개를 든다.\n"…애가 아팠어요. 회사엔 말 못 했고요. 다음 달 월급으로 채워 넣으려고 했는데."'},
    {doc:1,t:'병원 영수증을 책상 위에 올려놓는다',a:'남자가 영수증을 보고 한참 아무 말도 하지 않는다.\n"…그건 어떻게. 그건 아무한테도 안 보여 줬는데."\n그의 자수서 옆에, 크레파스 그림 한 장이 끼워져 있다.'}]}],
  verdict:{opts:[
   {v:'환생',t:'용서한다 — 환생'},
   {v:'지옥',t:'죄는 죄 — 지옥'},
   {v:'보류',t:'보류 — 판단하지 않는다'}]}},

 sj:{intro:[['','교복 차림의 여학생. 한쪽 귀에 이어폰이 꽂혀 있다. 사건 0914-2241의 첫 승객이다.'],['흑','(서류 귀퉁이에 쪽지) 이 서류 사망시각은 건드리지 마.']],
  qs:[{q:'"이어폰 끼고 있어서 아무것도 못 들었어요. 진짜예요."',
   opts:[
    {t:'"그날 버스는 어디로 갔니?"',a:'"정상 노선이요? 아니에요. 처음 보는 산길이었어요.\n그 기사님, 막차 놓친 애들은 그냥 태워 줬어요. 저도 몇 번 얻어 탔고요.\n그날은… 좀 돌아간다고 했어요."',set:['k_route']},
    {t:'"버스 안에 누가 있었어?"',a:'"아저씨들 여럿이요. 등산복 입고 엄청 시끄러웠어요.\n…근데 이상하게, 맨 뒷자리에 토끼 인형 안은 【꼬마】는 기억나요. 계속 자던데."',set:['k_child']}]},
   {q:'서진이 휴대전화를 꼭 쥐고 있다. 화면에 읽지 않은 메시지가 쌓여 있다.',
   doc:{title:'사망보고 · 한서진',text:'현장 사망 22:41 (산길 커브, 구급대 도착 전).\n유품: 귀에 꽂힌 채 발견된 이어폰.\n※ 명부 사망시각: 22:58 (병원 이송 중)'},
   opts:[
    {t:'"병원 갔던 거 기억나?"',a:'"병원이요? 전 병원 간 기억 없어요. 눈 떠 보니 여기였어요."\n명부에는 「22:58 병원 이송 중 사망」이라고 적혀 있다.',set:['k_time']},
    {t:'"엄마한테 연락 왔니?"',a:'"엄마가 계속 보내요. 근데 답장이 안 돼요."\n서진이 화면을 엎어 놓는다. "엄마 지금도 병원 앞에 있대요. 왜 병원이지."'},
    {doc:1,t:'"사망시각이 둘이네. 22:41하고 22:58."',a:'서진이 고개를 갸웃한다. "저 그냥… 쾅 하고 끝났어요. 아프지도 않았어요."\n누군가 17분을 늘려 놓았다. 「이송 중」이라는 네 글자로.',set:['k_time']}]}],
  verdict:{opts:[
   {v:'환생',t:'환생 — 명부 권고대로'},
   {v:'천국',t:'천국 — 열일곱 살에게 죄는 없다'},
   {v:'보류',t:'보류 — 사건이 닫힐 때까지'}]}},

 dy:{intro:[['흑','배달 기사. 명부엔 신호 무시하고 사람한테 돌진했다고 돼 있어. 목격자 말도 그렇고.']],
  qs:[{q:'"…애가 튀어나왔다고요. 제가 뭘 어떻게 해요."\n목격자: "빨간불에 달려들었어. 애는 인도에 가만히 서 있었고."',
   doc:{title:'교차로 CCTV',text:'차량 신호: 초록.\n횡단보도로 아이가 뛰어듦.\n오토바이가 아이를 피해 핸들을 꺾은 뒤 가로등에 충돌.'},
   opts:[
    {t:'"목격자는 당신이 달려들었다는데요."',a:'"아니라니까요! 초록불이었어요. 브레이크 밟았어요. 브레이크만…"\n그의 손이 떨린다. 핸들을 쥐던 모양 그대로.'},
    {t:'"그 아이는 어떻게 됐는지 압니까?"',a:'김도윤이 멍하니 당신을 본다.\n"…모르겠어요. 그 애 얼굴만 보였어요. 그다음은 기억이 안 나요."'},
    {doc:1,t:'CCTV 기록을 읽어 준다',a:'"…꺾었어요? 제가?"\n김도윤이 자기 손을 내려다본다.\n"기억이 안 나요. 그 애 얼굴만 보였어요. 근데… 그 애는요? 그 애는 살았어요?"\n화면 속 아이는 넘어졌다가, 엄마 손을 잡고 일어난다.',set:['k_swerve']}]}],
  verdict:{opts:[
   {v:'환생',t:'환생 — 다음 생엔 천천히'},
   {v:'천국',t:'천국 — 아이를 살린 손'},
   {v:'지옥',t:'지옥 — 명부 권고대로'}]}},

 hk:{intro:[['','등산복 차림의 여섯 사람이 우르르 들어온다. 사건 0914-2241의 승객들이다.']],
  qs:[{q:'"아이고, 여기가 저승이여? 산 좋았는데."\n명부: 전원 정상 요금 승차 · 사고 원인 「운전기사 음주」',
   doc:{title:'사망보고 · 산악회',text:'22:15 하산, 3번 막차 놓침. 사망 6명.\n차내 유류품: 막걸리 빈 병 1개.\n보고서 수정 2회 — 수정자: 흑'},
   opts:[
    {t:'"막차를 놓치셨는데, 어떻게 타셨어요?"',a:'"요금? 아이고, 그날은 사정사정해서 탔지.\n단체방에도 썼어. 「막차 놓쳐서 기사님한테 【웃돈】 드리고 탔다」. ㅋㅋ 하고."',set:['k_fare']},
    {t:'"기사가 술을 마셨다는데요."',a:'"기사님이 술을? 에이, 말도 안 돼.\n【막걸리】? 그건 조수석 젊은 놈이 병째 들이켰지. 우리 건 줄 알고 뺏어 마시더라니까."',set:['k_drink']},
    {doc:1,t:'"차 안에 빈 병이 딱 하나 나왔네요."',a:'"그럼 하나지. 그 젊은 놈이 혼자 다 마셨으니까.\n돈도 그놈이 우리한테서 걷어서 기사한테 건넸어. 산길로 질러가자고 우긴 것도 그놈이고."',set:['k_drink','k_fare']}]}],
  verdict:{opts:[
   {v:'환생',t:'환생 — 명부 권고대로'},
   {v:'지옥',t:'지옥 — 웃돈을 내민 손'},
   {v:'보류',t:'보류 — 사건이 닫힐 때까지'}]}},

 jt:{intro:[['','허리가 꼿꼿한 노인. 낡은 수첩을 가슴 주머니에 꽂고 있다.']],
  qs:[{q:'"은퇴한 지 16년이야. 매일 밤 같은 서류를 읽었지. 집사람이 질려 했어."\n명부: 맡은 사건 전부 해결 — 미제 0건',
   doc:{title:'수첩 · 오종태',text:'1996년 4번 시외버스 추락 — 미결.\n"기사가 막차 뒤 웃돈을 받고 운행했다"는 진술 있음.\n생존자 1명 — 막차 놓친 고3 남학생. "기사 아저씨가 핸들을 놓고 날 덮었어요."\n윗선 지시로 종결.'},
   opts:[
    {t:'"그 서류, 무슨 사건입니까?"',a:'"하나 있지. 1996년, 비 오는 날 시외버스.\n기사가 막차 뒤에 웃돈 받고 몰았대. 살아남은 학생 하나가 기사가 자길 덮어 줬다고 울더군.\n위에서 덮으라더군. 학생 말도, 사건도." 노인이 수첩을 건넨다. "가져가. 난 이제 못 읽어."',set:['k_1996']},
    {t:'"미제 0건이시네요. 훌륭하십니다."',a:'노인이 웃는다. 웃음이 짧다.\n"서류상으론. 서류는 위에서 쓰는 거야, 젊은이."'},
    {doc:1,t:'"이 학생, 지금은 마흔여덟이겠네요."',a:'"…살아 있으면 그렇겠지. 이름은 이○○. 고3이었어.\n그 애한테 미안해. 그 애 말을 내가 못 지켰어." 노인이 수첩을 당신 쪽으로 민다.',set:['k_1996']}]}],
  verdict:{opts:[
   {v:'천국',t:'천국 — 명부 권고대로'},
   {v:'환생',t:'환생 — 못 닫은 사건은 다음 생에'},
   {v:'보류',t:'보류 — 이 사건이 닫히는 걸 보게 한다'}]}},

 tae:{intro:[['흑','(서류를 직접 들고 와서 내려놓는다) 천국. 이번엔 진짜 묻지 마.\n위에서 내려온 거야.']],
  qs:[{q:'"그날 밤 난 집에 있었어. 심장이 멈췄다고. 재단 서류엔 내가 살아서 직접 서명했고."',
   doc:{title:'사망보고 원본 · 강태준',text:'실제 사망: 9월 14일 22:41 교통사고.\n위치: 3번 마을버스 조수석.\n보고서 수정자: 흑\n※ 장학재단 설립 서명일: 9월 20일'},
   opts:[
    {t:'"그날 비가 왔습니다. 기억나요?"',a:'"…기억 안 나. 비가 왔고, 기사가 자꾸 내리라고… 산길로 가자고 했더니…\n아니, 집이었다고! 집!"\n그의 셔츠 깃에서 시큼한 막걸리 냄새가 난다.',set:['k_tae']},
    {t:'"아버님 얘기를 해 보세요."',a:'"우리 아버지가 ○○그룹 회장이야. 저승도 돈이면 된다고 하셨어.\n…다 알아서 해 주신대. 늘 그랬어."'},
    {doc:1,t:'"9월 14일에 죽은 사람이 9월 20일에 서명을 했네요."',a:'강태준의 얼굴에서 핏기가 빠진다.\n"…아버지가. 아버지가 다 했어. 나는 조수석에 있었고, 그냥… 그냥 핸들을…"\n그가 입을 막는다.',set:['k_tae']}]}],
  verdict:{opts:[
   {v:'천국',t:'천국 — 흑과 거래한다 (50냥)'},
   {v:'보류',t:'보류 — 대기실에 붙잡아 둔다'},
   {v:'지옥',t:'지옥 — 조작 증거와 함께'}]}},

 ws:{intro:[['','방울 소리가 먼저 들어온다. 화려한 무복의 여인. 흑은 오늘 자리에 없다.']],
  qs:[{q:'"죄목? 모든 굿에 큰돈을 받아 신도 재산을 갈취했다고? 하."\n명부: 권고 지옥',
   doc:{title:'굿 장부 · 월선',text:'형편 어려운 집 진혼굿 41건 — 사례비 받지 않음.'},
   opts:[
    {t:'"돈은 받으셨습니까?"',a:'"받았지. 받을 집에선. 안 받을 집에선 안 받았고. 장부 봐."\n그녀가 손목을 흔든다. 딸랑.'},
    {t:'"그 방울은 뭡니까?"',a:'"이 방울은 죽은 혼 앞에서만 울려. 평생 몸에서 안 뗐지.\n여기 오니 쉴 새 없이 울리더라." 그녀가 대기실 쪽을 본다. "…한 번만 빼고."',set:['k_bellhint']},
    {doc:1,t:'"41집은 공짜로 해 주셨네요."',a:'"애 잃은 집에서 돈을 어떻게 받아." 그녀가 방울을 쥔다.\n"근데 이상하지. 여기 대기실 애기 앞에선 이게 안 울려. 우리 손주 때도 그랬는데."',set:['k_bellhint']}]}],
  verdict:{opts:[
   {v:'환생',t:'환생 — 다음 생에도 방울을'},
   {v:'천국',t:'천국 — 41번의 진혼굿'},
   {v:'지옥',t:'지옥 — 명부 권고대로'}]}},

 ms:{intro:[['','간호사복 위에 카디건을 걸친 여자. 사건 0914-2241의 마지막 승객이다. 흑의 자리는 오늘 비어 있다.']],
  qs:[{q:'"저는 시립병원 간호사예요. 그날 일, 다 봤어요."\n명부: 운전기사는 마지막까지 운전석에 있었다',
   opts:[
    {t:'"마지막 순간을 말해 주세요."',a:'"아니에요. 기사님은 운전석에 없었어요.\n핸들이 꺾이는 순간, 기사님이 핸들을 놓고 【맨 뒷자리】로 달려갔어요. 그 아이를 안았어요. 끝까지요."',set:['k_lastrun']},
    {t:'"사고 전엔 무슨 일이 있었습니까?"',a:'"22시 24분이었어요. 간호 수첩에 시간 적는 게 버릇이라.\n술 냄새 나는 조수석 남자가 기사님한테 【봉투】를 내밀었어요. 기사님은 한참 망설이다 받았고요."',set:['k_envelope','k_drink']}]},
   {q:'정미숙이 손목의 시계를 본다. 22:58에 멈춰 있다.',
   doc:{title:'구급일지 · 사망 명부 접수표',text:'22:50 소아병동 이송: 8세 여아 1명.\n22:58 34세 여성(정미숙) 이송 중 사망.\n— 사망 명부 접수 10장. 연령 17세~68세.'},
   opts:[
    {t:'"구급차에서 돌아가셨다고요."',a:'"네. 옆 들것에 그 아이가 있었어요. 소아병동으로 먼저 갔죠.\n…그 애 손이 따뜻했어요. 그건 기억나요."',set:['k_survivor']},
    {t:'"기사를 원망하십니까?"',a:'"…아뇨. 그분이 봉투를 받은 건 봤어요. 그래도 마지막에 그 애한테 갔어요.\n원망은, 그 봉투 내민 사람한테 하고 싶어요."',set:['k_lastrun']},
    {doc:1,t:'"8세 여아가 이송됐는데, 명부엔 10세 미만이 없네요."',a:'정미숙의 눈이 커진다.\n"…그럼 그 애, 여기 안 온 거예요? 아니면—"\n그녀가 대기실 쪽 문을 오래 바라본다.',set:['k_survivor']}]}],
  verdict:{opts:[
   {v:'환생',t:'환생 — 명부 권고대로'},
   {v:'천국',t:'천국 — 마지막까지 지켜본 사람'},
   {v:'보류',t:'보류 — 사건이 닫힐 때까지'}]}}
};

function topbar(left){return `<div class="top">${F('mandarin')&&S.day<=6?`<span class="mandarin d${S.day}" role="img" aria-label="서랍 속 귤"></span>`:''}<span class="tl">${left}</span><span class="money">錢 <b>${S.money}</b></span><button type="button" class="pinbtn" id="nb">수첩</button><button type="button" class="pinbtn" id="pb">보드</button>${muteBtn()}</div>`;}
function openNotebook(){
 const got=CLUE_ORDER.filter(k=>F(k));
 const ov=overlay(`<div class="modal"><p class="h">수첩</p><p class="hs">망자에게 묻고, 서류를 읽어 알아낸 것. 七齋 심판에서 이것만 꺼낼 수 있다.</p>
 <ul class="cluelist">${got.length?got.map(k=>`<li>${esc(CLUE[k])}</li>`).join(''):'<li class="dim">아직 적은 것이 없다</li>'}</ul>
 <button type="button" class="btn" id="cb">닫는다</button></div>`);
 ov.querySelector('#cb').addEventListener('click',()=>{A.play('paper');ov.remove();});
}
function ivFrame(c,body,enter){
 const P=IMG[c.img];
 app.innerHTML=`${bg(IMG.deskbg)}${topbar(`${HJ[S.day-1]}齋 ${S.caseIdx+1}/${S.todays.length}`)}
 <div class="screen">
  <div class="stage ${enter?'enter':''}" style="background-image:url(${P})"><div class="smoke"></div><div class="plate"><span class="seal-s">亡</span><div><div class="n">${esc(c.name)}</div><div class="d">${esc(c.desc)}</div></div></div>${c.note?`<div class="note2">${esc(c.note).replace(/\n/g,'<br>')}</div>`:''}</div>
  ${body}</div>`;
 on('#pb',openBoard);on('#nb',openNotebook);bindMute();
}
function nextCase(){
 if(S.caseIdx>=S.todays.length)return summaryScreen(S.day);
 const c=S.todays[S.caseIdx];A.setScene('desk');A.play('door');
 S.cur={c,qi:0,docRead:{},enter:true};
 const iv=IV[c.id];
 if(iv.intro)return ivTalk(c,iv.intro,askQ);
 askQ();
}
function ivTalk(c,lines,done){
 let i=0;
 const draw=()=>{const [sp,tx]=lines[i];const face=sp==='흑'?IMG.heuk:null;
  ivFrame(c,`<div class="talker">${face?`<img src="${face}" alt="흑">`:''}<div class="narr">${sp?`<div class="speaker">${esc(sp)}</div>`:''}${pressHL(tx)}</div></div>
  <button type="button" class="btn main" id="nx">다음</button>`,S.cur.enter);S.cur.enter=false;
  on('#nx',()=>{i++;if(i<lines.length)draw();else done();},'page');};
 draw();
}
function askQ(){
 const C=S.cur,c=C.c,iv=IV[c.id],q=iv.qs[C.qi];
 if(!q)return verdictQ();
 const read=!!C.docRead[C.qi];
 const opts=q.opts.map((o,i)=>[o,i]).filter(([o])=>!o.doc||read);
 const n=opts.length;
 ivFrame(c,`<div class="talker"><div class="narr qline"><div class="speaker">묻는다</div>${pressHL(q.q)}</div></div>
  ${q.doc?`<div class="ecard doc ${read?'sel':''}"><div class="et"><span class="etag">서류</span>${esc(q.doc.title)}</div>${read?`<div class="eb">${esc(q.doc.text)}</div>`:`<button type="button" class="btn small" id="rd">서류를 펼쳐 본다 <small>(묻기 전에 읽으면, 물을 말이 하나 늘어난다)</small></button>`}</div>`:''}
  <div class="choices n${n}" role="group" aria-label="무엇을 물을까">${opts.map(([o,i])=>`<button type="button" class="slip ${o.doc?'xopt':''}" data-o="${i}">${o.doc?'<small>서류를 읽었다</small>':''}${esc(o.t)}</button>`).join('')}</div>
  <p class="hint">하나만 물을 수 있다.</p>`,C.enter);C.enter=false;
 on('#rd',()=>{C.docRead[C.qi]=true;const nw=learn(q.doc.set);A.play('paper');askQ();if(nw.length)noteToast(nw);},'paper');
 app.querySelectorAll('[data-o]').forEach(b=>b.addEventListener('click',()=>{A.play('brush');answer(q.opts[+b.dataset.o]);}));
}
function noteToast(nw){setTimeout(()=>{A.play('brush');toast('수첩에 적었다 — '+nw.map(k=>esc(CLUE[k])).join('<br>'));},250);}
function answer(o){
 const C=S.cur,c=C.c;const nw=learn(o.set);
 ivFrame(c,`<div class="talker"><div class="narr qline"><div class="speaker">${esc(c.name)}</div>${pressHL(o.a)}</div></div>
  ${nw.length?`<div class="newclue unfold">${nw.map(k=>`<div><b>手帖</b> ${esc(CLUE[k])}</div>`).join('')}</div>`:''}
  <button type="button" class="btn main" id="nx">${C.qi+1<IV[c.id].qs.length?'다음 물음':'판결로'}</button>`);
 if(nw.length){A.play('ink');A.vib([30]);}
 on('#nx',()=>{C.qi++;askQ();},'page');
}
function verdictQ(){
 const C=S.cur,c=C.c,V=IV[c.id].verdict;
 const opts=V.opts.map((o,i)=>[o,i]).filter(([o])=>!o.need||F(o.need));
 ivFrame(c,`<div class="sheet"><div class="sheet-h">판결 — 도장을 고른다</div><p class="judgeinfo">명부 권고 ${seal(c.rec,'mini')}</p>${V.q?`<p class="hs">${esc(V.q)}</p>`:''}</div>
  <div class="choices n${opts.length}" role="group" aria-label="판결">${opts.map(([o,i])=>`<button type="button" class="slip vopt" data-o="${i}">${seal(o.v,'mini')}<span>${esc(o.t)}</span></button>`).join('')}</div>`);
 app.querySelectorAll('[data-o]').forEach(b=>b.addEventListener('click',()=>{A.play('select');stampV(V.opts[+b.dataset.o]);}));
}
function stampV(o){
 const C=S.cur,c=C.c,v=o.v;
 const st=document.createElement('div');st.className='bigstamp';st.innerHTML=seal(v,'big');app.appendChild(st);
 app.querySelectorAll('button').forEach(b=>b.disabled=true);
 setTimeout(()=>{A.play('stamp');A.vib([60,30,120]);const s=app.querySelector('.screen');if(s)s.classList.add('shake');},180);
 if(o.none)setCh('c_dog',F('k_owner')?'rule':'unknown');else if(o.ch)setCh(o.ch[0],o.ch[1]);else{const m=L.verdictToChoice(c.id,v);if(m)setCh(m[0],m[1]);}
 S.verdicts[c.id]=v;
 if(c.id==='choi'&&v==='천국'){S.money+=30;setTimeout(()=>A.play('coin'),700);}
 if(c.id==='tae'&&v==='천국'){S.money+=50;setTimeout(()=>A.play('coin'),700);}
 if(c.seat)S.flags[c.seat]=true;
 S.money+=10;
 setTimeout(()=>{st.remove();afterStamp(c,v);},950);
}
function afterStamp(c,v){
 const go=()=>escort(c,v,()=>{if(c.id==='ws')return bellListen(()=>{S.caseIdx++;nextCase();});S.caseIdx++;nextCase();});
 if(c.id==='sj'){if(!F('k_time')){setCh('c_time','unknown');return go();}
  return phoneDilemma(k=>{setCh('c_time',k);if(k==='fix')addNote('W_fix');go();});}
 go();
}

const DEST={
 천국:{cls:'heaven',door:'위에서 금빛 문이 열린다.',fx:'<div class="vbeam"></div><div class="vmotes up"></div>'},
 환생:{cls:'rebirth',door:'바닥에 바퀴가 돈다. 다음 생의 문.',fx:'<div class="vwheel"><i></i><b>輪</b></div><div class="vorb"></div><div class="vripple"></div>'},
 지옥:{cls:'hell',door:'바닥이 갈라진다.',fx:'<div class="vpit"></div><div class="vembers"></div><div class="vchain l"></div><div class="vchain r"></div>'},
 보류:{cls:'hold',door:'문은 열리지 않는다. 대기실 의자가 하나 비워진다.',fx:'<div class="vfog"></div><div class="vbench"></div>'}
};
const DEST_NOTE={
 'dog:환생':'작은 발자국이 초록빛 바퀴 속으로 사라진다. 꼬리가 한 번, 마지막으로 흔들린다.',
 'hk:천국':'여섯 사람이 줄지어 빛 속으로 올라간다. 맨 끝의 노인이 한 번 돌아본다.',
 'hk:환생':'여섯 개의 빛이 하나씩 바퀴 속으로 떨어진다.',
 'hk:지옥':'여섯 사람이 차례로 붉은 틈 아래로 끌려 내려간다. 웃음소리가 뚝 끊긴다.',
 'hk:보류':'여섯 사람이 복도 끝 의자에 나란히 앉는다. 누군가 산 얘기를 다시 시작한다.',
 'choi:천국':'금빛 문 앞에서 최만석이 넥타이를 고쳐 맨다. 문이 그를 위해 조금 늦게 열린다.',
 'choi:지옥':'"이봐, 얘기 다 됐다니까—" 목소리가 바닥 아래로 잦아든다.',
 'tae:지옥':'"아버지! 아버지가—" 사슬이 감긴다. 막걸리 냄새가 마지막까지 남는다.',
 'tae:천국':'금빛 문이 열린다. 빛이 이상하게 차갑다.',
 'ws:지옥':'방울 소리가 붉은 틈 아래로 길게 떨어진다.',
 'ws:천국':'방울이 한 번 울린다. 위에서, 누군가 대답하듯 같은 소리가 들린다.',
 'gm:천국':'할머니가 귤 봉지를 품에 안고 빛 속으로 올라간다. 귤 하나가 책상 위에 남는다.',
 'jh:지옥':'남자는 저항하지 않는다. 자수서만은 끝까지 가슴에 안고 내려간다.',
 'jh:환생':'남자가 바퀴 앞에서 크레파스 그림을 한 번 펴 본다. 그리고 걸어 들어간다.',
 'dy:천국':'헬멧을 벗어 의자에 내려놓고, 그는 빛 속으로 올라간다.',
 'sj:천국':'이어폰 한쪽이 바닥에 떨어진다. 서진은 돌아보지 않는다.',
 'con:환생':'노인이 메모리카드를 쥔 주먹을 들어 보인다. 바퀴가 그를 삼킨다.',
 'con:지옥':'쥔 손이 펴진다. 메모리카드가 바닥에 떨어진다.'
};
function escort(c,v,next){
 const E=escortFor(c,v),Dd=DEST[v];A.setScene('escort');
 if(E.prio)S.heukLog.push({day:S.day,name:c.name,v,line:E.line,pose:E.pose,prio:E.prio});
 const who=E.pose==='msgr'?'낯선 사자':'흑';
 const isDog=c.id==='dog',many=c.id==='hk'?3:1;
 const gimg=isDog?IMG.dogghost:IMG.ghost;
 const ghosts=Array.from({length:many},(_,i)=>`<div class="gw ${isDog?'dog':''}" style="--gd:${i*0.35}s;--gx:${i*-9}%"><img class="ghost2" src="${gimg}" alt=""></div>`).join('');
 const note=DEST_NOTE[c.id+':'+v]||Dd.door;
 app.innerHTML=`<div class="escort v-${Dd.cls}" id="es" role="button" tabindex="0" aria-label="다음">
  <div class="cbg" style="background-image:url(${IMG.corridor})"></div>
  <div class="vtint"></div>${Dd.fx}
  <div class="doorname">${seal(v,'mini')}</div>
  ${ghosts}
  <img class="reaper ${E.pose}" src="${POSE(E.pose)}" alt="${who}">
  <div class="bar top"></div><div class="bar bot"></div>${muteBtn()}
  <div class="eline"><div class="dest">${esc(note)}</div><div class="speaker">${who}</div><div>${esc(E.line)}</div><div class="tap">▼</div></div></div>`;
 bindMute();A.play('door');setTimeout(()=>A.play('steps',isDog?2:4),300);
 const es=app.querySelector('#es');
 if(v==='천국'){setTimeout(()=>A.play('bell'),1400);setTimeout(()=>A.play('resolve'),2100);}
 else if(v==='환생'){setTimeout(()=>A.play('hum'),1200);setTimeout(()=>A.play('note',5),2300);setTimeout(()=>A.play('note',7),2700);}
 else if(v==='지옥'){setTimeout(()=>{A.play('slam');A.vib([120,60,200]);es.classList.add('quake');},1500);setTimeout(()=>A.play('wrong'),2300);}
 else {[1300,2300,3300].forEach(t=>setTimeout(()=>A.play('tick'),t));setTimeout(()=>A.play('drip'),2000);}
 if(c.id==='ws')setTimeout(()=>A.play('bell'),900);
 let done=false;const nx=()=>{if(done)return;done=true;A.play('page');next();};
 const fast=ls.get('49e_ends',[]).length>0;
 setTimeout(()=>{es.addEventListener('click',nx);es.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();nx();}});},fast?300:1600);
}

function bellListen(next){
 A.setScene('cut');
 const gone=S.verdicts.ws==='지옥'?'끌려가던':'문을 지나던';
 app.innerHTML=`${bg(IMG.waitbg)}${muteBtn()}<div class="screen end">
  <div class="narr">월선이 ${gone} 길에 대기실 문 앞에서 방울을 떨어뜨렸다.\n주워 든 방울이 손안에서 미지근하다.${F('k_bellhint')?'\n\n「여기 오니 쉴 새 없이 울리더라. …한 번만 빼고.」':''}</div>
  <div class="choices n2"><button type="button" class="slip" id="b1">대기실을 한 바퀴 돌며 흔들어 본다</button><button type="button" class="slip" id="b2">흔들지 않고 품에 넣는다 — 망자의 물건이다</button></div></div>`;bindMute();
 on('#b1',()=>{
  const seq=[['벤치의 노인',1],['벤치의 여인',1],[S.ch.c_tae==='hold'?'중얼거리는 강태준':'젊은 남자',1],['토끼 인형을 안은 아이',0]];
  let i=0;const step=()=>{if(i>=seq.length){S.flags.bellClue=true;learn(['bellClue']);A.play('hum');
    return cine(null,[{mem:IMG.yeoni,gray:1,scene:'cut',lock:1200,t:'방울은 죽은 혼 앞에서만 울린다.\n…이 아이 앞에서만, 울리지 않았다.'},
     {mem:IMG.waitbg,scene:'escort',t:'저 멀리서 월선의 목소리가 들린다.\n"애기 혼은 너무 가벼워서 방울이 못 알아들어. 우리 손주 때도 그랬지."'}],next);}
   const [nm,r]=seq[i++];A.play(r?'bell':'bellMute');A.vib(r?[20]:[0]);
   app.innerHTML=`${bg(IMG.waitbg)}${muteBtn()}<div class="screen end" style="justify-content:center"><div class="narr center big">${esc(nm)} 앞에서 —\n\n${r?'딸랑.':'……'}</div></div>`;bindMute();
   setTimeout(step,r?900:1700);};
  step();},'tap');
 on('#b2',()=>cine(null,[{mem:IMG.waitbg,t:'방울을 품에 넣는다. 대기실 구석의 연이가 그 소리를 따라 고개를 든다.\n…연이 앞을 지날 때만, 품속의 방울이 조용했던 것 같기도 하다.'}],next),'tap');
}
const SUM_NEED={1:['k_owner','k_sober'],2:['k_route','k_child'],3:['k_fare','k_drink'],4:[],5:['k_envelope','k_lastrun']};
function summaryScreen(d){
 const need=SUM_NEED[d]||[];const ok=need.every(F);S.summaryOk[d]=ok;
 const Sm=D.SUMMARY[d];if(!Sm)return afterDay(d);
 if(d===4){S.summaryOk[4]=true;return replayNight(()=>afterDay(4));}
 A.setScene('desk');
 app.innerHTML=`${bg(IMG.deskbg)}${muteBtn()}<div class="screen" style="justify-content:center">${jae(d)}
  <div class="doc"><div class="doc-h"><span class="big">調書</span><span class="sub">사건 ${CASE_NO} · ${HJ[d-1]}齋</span></div>
  <p class="sent">${ok?fillText(d):esc(Sm.text).replace(/\{(\d)\}/g,(m,i)=>F(need[+i])?`<b class="fill">${esc(Sm.blanks[+i].answer)}</b>`:'<span class="blank">＿＿＿</span>')}</p>
  ${ok?'<div class="doc-sign ok stampin">確</div>':''}</div>
  <p class="inkhint">${ok?'— 사건 보드에 꽂혔다. 오늘 밤 기억 조각이 선명해진다 —':'— 오늘 물은 것만으로는 빈칸이 남는다. 기억은 흐릿하게 남는다 —'}</p>
  <button type="button" class="btn main" id="nx">계속</button></div>`;bindMute();
 A.play(ok?'stamp':'paper');
 on('#nx',()=>d===3?fareChoice():afterDay(d),'page');
}
function fareChoice(){
 if(!F('k_fare')){setCh('c_fare','unknown');return afterDay(3);}
 talk([['','조서에 적힌 한 단어가 눈에 걸린다.\n「웃돈」.\n이 기사는 돈을 받고 막차가 끝난 버스를 몰았다.'],
  ['흑','(어깨 너머로) 그거, 꼭 적어야 돼? 죽은 사람 흠 하나 더 잡아서 뭐 하게.']],()=>{
  dilemma('調書','「웃돈」을 조서에 남길 것인가. 이 조서는 그 기사의 명부에 그대로 붙는다.',[['record','그대로 적는다'],['erase','지운다 — 기사를 감싼다']],k=>{setCh('c_fare',k);afterDay(3);});
 });
}
function survivorMatch(done){
 A.setScene('drip');
 app.innerHTML=`${bg(IMG.deskbg)}${muteBtn()}<div class="screen">
  <div class="narr"><div class="speaker">흑</div>"나란히 놔 봐."</div>
  <div class="mgrid"><div class="mcol"><h5>生存者 陳述 · 1996</h5><div class="mfield">성명 — 이○○</div><div class="mfield">1978년생 · 고3</div><div class="mfield">「막차를 놓쳐서 탔어요. 기사 아저씨가 핸들을 놓고 날 덮었어요.」</div></div>
  <div class="mcol"><h5>名簿 · 이무명</h5><div class="mfield">성명 — 이무명</div><div class="mfield">1978년 3월생 · 48세</div><div class="mfield">3번 마을버스 기사 (2009~) · 막차 놓친 학생 무임승차 다수</div></div></div>
  <button type="button" class="btn main" id="nx">두 장을 겹친다</button></div>`;bindMute();
 on('#nx',()=>{A.play('ink');A.hbStart(0.7);setTimeout(()=>{A.hbStop();done();},1100);},'tap');
}

function trialEvidence(){
 const bb=S.ch.c_con==='rebirth'||S.ch.c_con==='hold',tw=S.ch.c_tae==='hold'||S.ch.c_tae==='hell';
 return [
 {id:'t0',by:'흑의 보고서',text:'"피고는 평소에도 술을 즐기던 사람이다."',
  ev:[F('k_sober')&&{t:'김복순의 말 — 「술 한 방울 안 하는 사람」',ok:1,r:'염라가 귤 할머니의 진술을 읽는다.\n"매일 아침 같은 버스를 탄 자의 말이다. …기각할 수 없군."'}],
  none:'평소 행실을 증언해 줄 사람을 만나지 못했다.'},
 {id:'t1',by:'염라',text:'"그날 밤 피고는 술에 취해 운전했다. 차 안에서 술병이 나왔다."',
  ev:[F('k_drink')&&{t:'산악회의 말 — 「조수석 젊은 놈이 병째 들이켰지」',ok:1,r:'"빈 병은 하나. 마신 자는 조수석.\n…그날 기사의 숨에서 술 냄새를 맡은 자는 없군."'},
      F('k_envelope')&&!F('k_drink')&&{t:'정미숙의 수첩 — 「술 냄새 나는 조수석 남자」',ok:1,r:'"간호사의 수첩이라. 술 냄새는 조수석에서 났다.\n…좋다. 음주는 기사의 것이 아니다."'}],
  none:'그날 밤 술을 마신 사람이 누구인지, 물어 둔 사람이 없다.'},
 {id:'t2',by:'염라',text:'"핸들을 꺾은 것은 피고다. 핸들을 쥔 자가 사고를 낸다."',
  ev:[bb&&{t:'박칠성이 지킨 블랙박스 영상을 튼다',ok:1,r:'22:40. 빗길. 조수석 남자가 핸들을 잡아챈다.\n기사가 핸들을 놓고 뒤로 몸을 날린다.\n재판정이 조용해진다.'},
      tw&&{t:'강태준을 증인석에 세운다',ok:1,r:'강태준이 고개를 들지 못한다.\n"…핸들 잡은 건 나야. 조수석에서. 산길로 가자고 했는데 안 간다길래.\n아버지가 다 덮었어."'}],
  fail:F('k_lastrun')&&{t:'정미숙의 말 — 「기사님은 핸들을 놓고 뒷자리로 달려갔어요」',r:'"놓은 건 꺾인 뒤다. 누가 꺾었는지는 말해 주지 않는군."'},
  none:'핸들을 잡아챈 손을 보여 줄 것이 없다.'},
 {id:'t6',by:'흑의 보고서',text:'"이런 사고는 전례가 없다. 기사 한 사람의 일탈이다."',
  ev:[(F('k_1996')&&S.ch.c_drawer==='open')&&{t:'형사의 수첩과 흑의 서랍 속 노선표를 함께 낸다 — 흑의 과거를 연다',ok:1,r:'"1996년, 4번 시외버스. 같은 웃돈, 같은 빗길.\n그리고 노선표의 기사 이름 — 흑."'}],
  fail:F('k_1996')&&S.ch.c_drawer!=='open'&&{t:'오종태의 수첩 — 1996년 시외버스 사고',r:'"전례는 있군. 허나 그것이 이 사건과 무슨 상관이냐. 누가 몰던 버스였지?"'},
  spare:(F('k_1996')&&S.ch.c_drawer==='open'&&S.ch.c_heuk!=='report')&&{t:'수첩을 덮는다 — 흑의 30년은 흑이 말하게 둔다',r:'방청석의 흑이 당신을 본다. 아주 잠깐.'},
  none:'전례를 보여 줄 기록을 갖고 있지 않다.'},
 {id:'t5',by:'염라',text:'"그 버스에 생존자는 없다. 명부는 열 장, 모두 이쪽으로 왔다."',
  ev:[F('k_survivor')&&{t:'구급일지 — 22:50 8세 여아 소아병동 이송',ok:1,r:'"…22:50, 8세 여아. 그리고 명부엔 10세 미만이 없다."\n재판정의 북소리가 멎는다. 어디선가 기계음이 들린다.'},
      F('bellClue')&&{t:'월선의 방울 — 연이 앞에서만 울리지 않았다',ok:1,r:'당신이 방울을 흔든다. 재판정 가득 망자들 앞에서 딸랑, 딸랑.\n방청석 구석, 토끼 인형을 안은 아이 앞에서만 — 조용하다.\n어디선가 기계음이 들린다.'}],
  none:'그 버스의 열한 번째 사람에 대해, 아는 것이 없다.'}
 ];}
function trialDesk(){trialSeq();}
function trialSeq(){
 const list=trialEvidence();let i=0;S.trial={};
 const step=()=>{
  if(i>=list.length)return trialEnd2();
  const T=list[i];const ev=T.ev.filter(Boolean).slice(0,2);
  const opts=ev.map(e=>Object.assign({},e));
  if(!ev.length&&T.fail)opts.push(Object.assign({ok:0},T.fail));
  if(T.spare)opts.push(Object.assign({ok:0,spare:1},T.spare));
  opts.push({t:ev.length||T.fail?'반박하지 않는다':'…할 말이 없다',ok:0,r:T.none&&!ev.length&&!T.fail?T.none+'\n기록은 그대로 확정된다.':'기록은 그대로 확정된다.'});
  A.setScene(F('alive')?'courtEcg':'court');
  app.innerHTML=`${bg(IMG.courtbg)}${topbar('七齋 · 심판 '+(i+1)+'/'+list.length)}<div class="screen">
   <div class="talker"><img src="${IMG.yeomra}" alt="염라"><div class="narr court"><div class="speaker">${esc(T.by)}</div>${esc(T.text)}</div></div>
   <div class="choices n${opts.length}" role="group" aria-label="반박">${opts.map((o,k)=>`<button type="button" class="slip ${o.ok?'evopt':''}" data-k="${k}">${esc(o.t)}</button>`).join('')}</div>
   <p class="hint">수첩에 적어 둔 것만 꺼낼 수 있다.</p></div>`;
  on('#pb',openBoard);on('#nb',openNotebook);bindMute();
  app.querySelectorAll('[data-k]').forEach(b=>b.addEventListener('click',()=>{
   const o=opts[+b.dataset.k];S.trial[T.id]=!!o.ok;if(o.spare)S.flags.spareHeuk=true;
   if(o.ok){A.play('objection');A.vib([40,40,80]);if(T.id==='t5'){S.flags.alive=true;}}else A.play('tap');
   app.innerHTML=`${bg(IMG.courtbg)}${muteBtn()}<div class="screen end">${o.ok?'<div class="objbig">異議</div>':''}
    <div class="modal ${o.ok?'':'court'}"><div class="speaker ${o.ok?'ok':''}">${o.ok?'반박 인정':(o.spare?'침묵':'기록 확정')}</div><div class="narr">${esc(o.r)}</div>
    <button type="button" class="btn main" id="ok">계속</button></div></div>`;bindMute();
   if(o.ok)setTimeout(()=>A.play('ok'),600);
   if(o.ok&&T.id==='t5')setTimeout(()=>A.setScene('courtEcg'),1400);
   on('#ok',()=>{i++;step();},'page');}));
 };
 step();
}
function trialEnd2(){
 const t=S.trial;S.trial={t0:!!t.t0,t1:!!t.t1,t2:!!t.t2,t6:!!t.t6,alive:!!t.t5};
 if(S.trial.t6)return cine(null,[
  {mem:IMG.courtbg,t:'염라가 노선표와 형사의 수첩을 나란히 놓는다.\n"1996년, 4번 시외버스. 기사 — 흑."'},
  {mem:IMG.flash96,sepia:1,scene:'rain',t:'흑이 쥐고 있던 향을 내려놓는다.'},
  {tag:'흑',mem:IMG.heuk,scene:'court',t:'"…형사 양반 수첩에 남아 있었구먼.\n30년이야. 다들 잊었을 줄 알았는데."'}],confession);
 confession();
}


window.__T={S:()=>S,title,prologue,dayStart,nextCase,summaryScreen,waiting,night,morning,day6,trialStart,confession,crash,revealName,ending,montage,bellListen,phoneDilemma,escortTest:(c,v)=>escort(c,v,()=>{})};
window.addEventListener('error',e=>toast('오류: '+esc(e.message)));
try{title();}catch(e){app.innerHTML='<pre style="color:#f88;padding:16px;white-space:pre-wrap">오류: '+esc(e.message)+'</pre>';}
})();
