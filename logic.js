/* 게임 · 검증기 공용 순수 로직 */
var LOGIC=(function(){
 function judgeObjection(D,stm,cards){
  cards=(cards||[]).filter(Boolean);
  const k=stm.fact[0],v=stm.fact[1];
  if(D.WORLD[k]===v)return {ok:false,why:'true'};
  for(const c of cards)if(c.facts&&c.facts[k]===D.WORLD[k])return {ok:true,shows:[c.show[k]]};
  const req=D.HALVES[k];
  if(req){const got=new Set();const shows=[];
   cards.forEach(c=>{if(c.half&&c.half[k]){got.add(c.half[k]);shows.push(c.show[k]);}});
   if(req.every(h=>got.has(h)))return {ok:true,shows};
   if(got.size>0){const miss=req.filter(h=>!got.has(h))[0];return {ok:false,why:'half',key:k,miss,hint:(D.HALF_HINT[k]||{})[miss]};}}
  return {ok:false,why:'unrelated'};
 }
 const VMAP={con:['c_con',{환생:'rebirth',보류:'hold',지옥:'hell'}],choi:['c_choi',{천국:'take',환생:'refuse',보류:'refuse',지옥:'refuse'}],
  tae:['c_tae',{천국:'heaven',보류:'hold',지옥:'hell'}],jh:['c_jh',{천국:'mercy',환생:'mercy',지옥:'hell',보류:'hold'}]};
 function verdictToChoice(caseId,v){const m=VMAP[caseId];if(!m||!m[1][v])return null;return [m[0],m[1][v]];}
 function condMet(cond,ch){if(!cond)return true;return Object.keys(cond).every(k=>{const w=cond[k];return Array.isArray(w)?w.indexOf(ch[k])>=0:ch[k]===w;});}
 function yStage(y){return y>=8?3:(y>=4?2:1);}
 function tainted(ch){return ch.c_choi==='take'||ch.c_tae==='heaven';}
 function exposed(ch,T){return ch.c_heuk==='report'&&!!T.admit;}
 function ending(st){
  const ch=st.ch,T=st.trial;
  if(ch.c_heuk==='deal'&&!T.admit&&!exposed(ch,T))return 'acc';
  if(!(T.t1&&T.t2))return ch.c_dog==='own'?'dog':'hell';
  if(st.final==='together')return 'together';
  if(!T.admit)return 'judge';
  if(T.alive&&exposed(ch,T)&&ch.c_dog==='own'&&ch.c_tell==='tell'&&!tainted(ch)&&ch.c_fare==='record')return 'yeom';
  return 'send';
 }
 return {judgeObjection,verdictToChoice,condMet,yStage,tainted,exposed,ending};
})();
if(typeof module!=='undefined')module.exports=LOGIC;
