/* 49재 사운드 엔진 v4 — 실제 녹음 악기(가야금·대금·해금 재구성) 기반 BGM/효과음 + 합성 폴백
   - window.__SNDPACK      : {name:'data:audio/webm;codecs=opus;base64,...'}   (기본: Opus)
   - window.__SNDPACK_MP3  : {name:'data:audio/mpeg;base64,...'}               (Opus를 못 여는 기기용, 예: 구형 iOS)
   - window.__SNDMETA      : {name: 원본 길이(초)}  — MP3 인코더 지연을 보정해 루프 이음새를 맞춘다
   - 음원이 하나도 열리지 않으면 기존 합성음으로 자동 대체
   API: init · setScene · play · hbStart · hbStop · setRate · vib · toggle · muted */
var SND=(function(){
 let ctx=null,master,limiter,glue,sfxBus,musBus,ambBus,loopBus,rev,noiseBuf,analyser,muted=false,scene=null,timers=[],rainNode=null,padNodes=[],hbTimer=null,hbRate=1;
 let loopSrc=null,loopGain=null;let jae=0,loopKey=null;const LN=n=>(n==='desk'&&jae)?'jae'+jae:n;const BUF={},LOOPAT={};let packTried=false,noPack=false;
 const KS={};try{muted=localStorage.getItem('49e_mute')==='1';}catch(e){}
 const mtof=m=>440*Math.pow(2,(m-69)/12);
 const LOOP_DB={jae1:-15.5,jae2:-15.5,jae3:-15.5,jae4:-15.5,title:-15.8,desk:-16.7,wait:-18.0,night:-17.1,court:-16.8,escort:-15.4,hospital:-16.5,mirror:-19.1};
 const SFX_DB={bell:-10.4,ok:-15.9,note:-15.1,resolve:-12.5,hum:-11.3,heartbeat:-12.5,objection:-10.3,slam:-9.0,wrong:-7.5};
 function init(){
  if(ctx){if(ctx.state==='suspended')ctx.resume();return;}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();
  master=ctx.createGain();master.gain.value=muted?0:0.89;
  limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-4;limiter.knee.value=0;limiter.ratio.value=20;limiter.attack.value=0.002;limiter.release.value=0.12;
  glue=ctx.createDynamicsCompressor();glue.threshold.value=-20;glue.knee.value=8;glue.ratio.value=2.5;glue.attack.value=0.02;glue.release.value=0.25;
  analyser=ctx.createAnalyser();analyser.fftSize=2048;
  glue.connect(limiter);limiter.connect(master);master.connect(ctx.destination);master.connect(analyser);
  rev=ctx.createConvolver();rev.buffer=impulse(3.2,2.4);const revG=ctx.createGain();revG.gain.value=0.32;rev.connect(revG);revG.connect(glue);
  sfxBus=ctx.createGain();sfxBus.gain.value=0.78;sfxBus.connect(glue);const sr=ctx.createGain();sr.gain.value=0.18;sfxBus.connect(sr);sr.connect(rev);
  musBus=ctx.createGain();musBus.gain.value=0.42;musBus.connect(glue);const mr=ctx.createGain();mr.gain.value=0.7;musBus.connect(mr);mr.connect(rev);
  loopBus=ctx.createGain();loopBus.gain.value=1;loopBus.connect(glue);
  ambBus=ctx.createGain();ambBus.gain.value=0.55;ambBus.connect(glue);
  noiseBuf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  loadPack();
  if(scene){const s=scene;scene=null;setScene(s);}
 }
 function b64ToBuf(u){const b=atob(u.slice(u.indexOf(',')+1));const a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a.buffer;}
 function decode(ab){return new Promise((res,rej)=>{try{const p=ctx.decodeAudioData(ab,res,rej);if(p&&p.then)p.then(res,rej);}catch(e){rej(e);}});}
 /* MP3 앞쪽 인코더 지연(무음) 길이를 재서 루프 시작점으로 삼는다 */
 function leadSilence(b){const d=b.getChannelData(0);let i=0;const lim=Math.min(d.length,4000);while(i<lim&&Math.abs(d[i])<2e-4)i++;return i/b.sampleRate;}
 function loadPack(){
  if(packTried||noPack||!window.__SNDPACK)return;packTried=true;
  const names=Object.keys(window.__SNDPACK);
  names.sort((a,b)=>(b==='bgm_'+LN(scene))-(a==='bgm_'+LN(scene))||(a.startsWith('bgm')?-1:1)-(b.startsWith('bgm')?-1:1));
  let ok=0,fail=0,fmt='opus';
  (async()=>{
   /* 첫 파일로 Opus 지원 여부 판정 → 실패하면 MP3 묶음으로 전환 */
   for(const n of names){if(noPack)break;
    let src=fmt==='opus'?window.__SNDPACK[n]:(window.__SNDPACK_MP3||{})[n];
    try{BUF[n]=await decode(b64ToBuf(src));}
    catch(e){
     if(fmt==='opus'&&window.__SNDPACK_MP3&&window.__SNDPACK_MP3[n]){fmt='mp3';try{BUF[n]=await decode(b64ToBuf(window.__SNDPACK_MP3[n]));}catch(e2){fail++;continue;}}
     else{fail++;continue;}}
    if(fmt==='mp3'&&n.startsWith('bgm_')){const st=leadSilence(BUF[n]);const dur=(window.__SNDMETA||{})[n]||(BUF[n].duration-st);LOOPAT[n]=[st,Math.min(BUF[n].duration,st+dur)];}
    ok++;
    if(n==='bgm_'+LN(scene)&&!loopSrc){const s=scene;scene=null;setScene(s);}
   }
   api.packStatus={ok,fail,format:fmt};})();
 }
 function impulse(sec,decay){const n=Math.floor(ctx.sampleRate*sec),b=ctx.createBuffer(2,n,ctx.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);let lp=0;for(let i=0;i<n;i++){const w=(Math.random()*2-1);lp=lp*0.6+w*0.4;d[i]=lp*Math.pow(1-i/n,decay);}}return b;}
 const now=()=>ctx.currentTime;
 const dbg=db=>Math.pow(10,db/20);
 function env(g,t,a,peak,dcy){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(peak,0.0002),t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+dcy);}
 function osc(type,f,t,dur,peak,out,f2,a){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);env(g,t,a||0.005,peak,dur);o.connect(g);g.connect(out||sfxBus);o.start(t);o.stop(t+(a||0.005)+dur+0.05);return {o,g};}
 function noise(t,dur,peak,type,freq,q,out,a){const s=ctx.createBufferSource();s.buffer=noiseBuf;const f=ctx.createBiquadFilter();f.type=type||'lowpass';f.frequency.value=freq||1000;f.Q.value=q||0.7;const g=ctx.createGain();env(g,t,a||0.003,peak,dur);s.connect(f);f.connect(g);g.connect(out||sfxBus);s.start(t,Math.random());s.stop(t+(a||0.003)+dur+0.1);return f;}
 function bellTone(f,t,peak,dur,out){[1,2.76,5.4,8.93].forEach((m,i)=>osc('sine',f*m,t,dur/(i+1),peak/(i*1.6+1),out||sfxBus));}
 function playBuf(name,db,out){const b=BUF[name];if(!b)return false;const s=ctx.createBufferSource();s.buffer=b;const g=ctx.createGain();g.gain.value=dbg(db||0);s.connect(g);g.connect(out||sfxBus);
  const st=LOOPAT[name]?LOOPAT[name][0]:(BUF[name]&&api.packStatus&&api.packStatus.format==='mp3'?leadSilence(b):0);s.start(0,st);return true;}
 function startLoop(name){
  const ln=LN(name),key='bgm_'+ln,b=BUF[key];if(!b)return false;
  const s=ctx.createBufferSource();s.buffer=b;s.loop=true;const lp=LOOPAT[key]||[0,b.duration];s.loopStart=lp[0];s.loopEnd=lp[1];
  const g=ctx.createGain();g.gain.value=0.0001;g.gain.setTargetAtTime(dbg(LOOP_DB[ln]||-12),now(),0.6);loopKey=key;
  s.connect(g);g.connect(loopBus);s.start(0,lp[0]);loopSrc=s;loopGain=g;return true;
 }
 function stopLoop(fast){if(!loopSrc)return;const s=loopSrc,g=loopGain;loopSrc=null;loopGain=null;try{g.gain.cancelScheduledValues(now());g.gain.setTargetAtTime(0.0001,now(),fast?0.03:0.8);s.stop(now()+(fast?0.3:3.5));}catch(e){}}
 /* ---------- 합성 악기 (폴백) ---------- */
 function ksBuf(f){const key=f.toFixed(2);if(KS[key])return KS[key];const sr=ctx.sampleRate,len=Math.floor(sr*3.2),b=ctx.createBuffer(1,len,sr),d=b.getChannelData(0);const N=Math.max(2,Math.floor(sr/f));
  for(let i=0;i<N;i++)d[i]=(Math.random()*2-1)*(1-0.3*Math.random());d[N]=d[0];for(let i=N+1;i<len;i++)d[i]=0.995*0.5*(d[i-N]+d[i-N-1]);let m=0;for(let i=0;i<len;i++)m=Math.max(m,Math.abs(d[i]));for(let i=0;i<len;i++)d[i]*=0.8/m;return KS[key]=b;}
 const INST={
  gayageum(t,n,dur,vel,out){const s=ctx.createBufferSource();s.buffer=ksBuf(mtof(n));const g=ctx.createGain();const body=ctx.createBiquadFilter();body.type='peaking';body.frequency.value=240;body.gain.value=5;body.Q.value=1.2;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;
   s.playbackRate.setValueAtTime(1,t);s.playbackRate.setValueAtTime(1,t+0.18);s.playbackRate.linearRampToValueAtTime(1.012,t+0.34);s.playbackRate.linearRampToValueAtTime(0.996,t+0.52);s.playbackRate.linearRampToValueAtTime(1,t+0.9);
   g.gain.setValueAtTime((vel||0.6)*0.55,t);g.gain.setTargetAtTime(0.0001,t+Math.max(0.6,dur),0.4);s.connect(body);body.connect(lp);lp.connect(g);g.connect(out||musBus);s.start(t);s.stop(t+Math.max(0.6,dur)+2);},
  daegeum(t,n,dur,vel,out){const f=mtof(n);const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;const vib=ctx.createOscillator(),vg=ctx.createGain();vib.frequency.value=5.2;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(f*0.006,t+Math.min(dur,1.2));vib.connect(vg);vg.connect(o.frequency);
   const pk=(vel||0.6)*0.28;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(pk,t+0.14);g.gain.setValueAtTime(pk,t+Math.max(0.15,dur-0.2));g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.35);o.connect(g);g.connect(out||musBus);[o,vib].forEach(x=>{x.start(t);x.stop(t+dur+0.5);});},
  haegeum(t,n,dur,vel,out){const f=mtof(n);const o=ctx.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f*0.965,t);o.frequency.exponentialRampToValueAtTime(f,t+0.12);const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f*2.4;bp.Q.value=0.9;
   const g=ctx.createGain();const pk=(vel||0.6)*0.22;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(pk,t+0.09);g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.25);o.connect(bp);bp.connect(g);g.connect(out||musBus);o.start(t);o.stop(t+dur+0.4);},
  musicbox(t,n,dur,vel,out){const f=mtof(n);const pk=(vel||0.6)*0.2;[[1,1,1.6],[4.02,0.18,0.5]].forEach(([m,a,d])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f*m;env(g,t,0.003,pk*a,d);o.connect(g);g.connect(out||musBus);o.start(t);o.stop(t+d+0.1);});},
  deong(t,v,out){osc('sine',95,t,0.45,(v||0.7)*0.7,out||musBus,48);noise(t,0.18,(v||0.7)*0.25,'lowpass',380,1,out||musBus);},
  gi(t,v,out){noise(t,0.05,(v||0.6)*0.35,'bandpass',2600,3,out||musBus);},
  deok(t,v,out){noise(t,0.09,(v||0.6)*0.45,'highpass',1800,1,out||musBus);}
 };
 function pad(notes,vol,type,cut){notes.forEach(n=>{[-6,6].forEach(dt=>{const o=ctx.createOscillator(),g=ctx.createGain(),lp=ctx.createBiquadFilter();o.type=type||'triangle';o.frequency.value=mtof(n);o.detune.value=dt;lp.type='lowpass';lp.frequency.value=cut||600;
  const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=0.07+Math.random()*0.05;lg.gain.value=(cut||600)*0.35;l.connect(lg);lg.connect(lp.frequency);g.gain.value=0.0001;g.gain.setTargetAtTime(vol/notes.length,now(),2.2);o.connect(lp);lp.connect(g);g.connect(musBus);o.start();l.start();padNodes.push({o,g,l});});});}
 function rain(vol){const s=ctx.createBufferSource();s.buffer=noiseBuf;s.loop=true;const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=900;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=7000;const g=ctx.createGain();g.gain.value=0.0001;g.gain.setTargetAtTime(vol,now(),1.5);s.connect(hp);hp.connect(lp);lp.connect(g);g.connect(ambBus);s.start();
  const drops=()=>{const t=now();for(let i=0;i<6;i++)noise(t+Math.random()*0.5,0.012,vol*0.5,'bandpass',2500+Math.random()*3500,4,ambBus);};timers.push(setInterval(drops,500));rainNode={s,g};}
 function wiper(t,vol,out){const f=noise(t,0.46,0.24*(vol||1),'bandpass',650,1.8,out,0.14);f.frequency.setValueAtTime(480,t);f.frequency.linearRampToValueAtTime(1500,t+0.42);osc('sine',95,t+0.46,0.09,0.16*(vol||1),out,70);}
 const THEMES={main:[[69,1],[72,1],[74,2],[76,1],[74,1],[72,2],[69,3],[0,1],[67,1],[69,1],[72,2],[69,4]],yeoni:[[81,1],[79,1],[76,2],[74,1],[76,1],[79,2],[76,1],[74,1],[72,1],[74,1],[76,4]],yeoniMajor:[[81,1],[78,1],[76,2],[73,1],[76,1],[78,2],[76,1],[73,1],[71,1],[73,1],[76,4]]};
 function themeEvents(name,start,inst,vel,stretch,tr){const th=THEMES[name];let b=start;const ev=[];th.forEach(([n,d])=>{if(n)ev.push([b,inst,n+(tr||0),d*(stretch||1)*0.92,vel]);b+=d*(stretch||1);});return {ev};}
 function startSeq(bpm,loop,events){const spb=60/bpm;events.sort((a,b)=>a[0]-b[0]);let idx=0,loopStart=now()+0.15;
  const tick=()=>{const h=now()+0.2;while(true){if(idx>=events.length){idx=0;loopStart+=loop*spb;}const e=events[idx];const t=loopStart+e[0]*spb;if(t>h)break;const f=INST[e[1]];if(f){if(e[1]==='deong'||e[1]==='gi'||e[1]==='deok')f(t,e[4]);else f(t,e[2],e[3]*spb,e[4]);}idx++;}};
  tick();timers.push(setInterval(tick,40));}
 function arp(notes,beats,every,vel){const ev=[];for(let b=0;b<beats;b+=every)ev.push([b,'gayageum',notes[Math.floor(b/every)%notes.length],every,vel]);return ev;}
 /* ---------- 효과음 ---------- */
 const S={
  tap(){const t=now();noise(t,0.03,0.22,'bandpass',2800,3);osc('sine',1200,t,0.03,0.03);},
  paper(){const t=now();for(let i=0;i<22;i++)noise(t+Math.random()*0.24,0.008+Math.random()*0.012,0.12+Math.random()*0.18,'bandpass',2800+Math.random()*4200,2.5);noise(t,0.22,0.12,'bandpass',1400,0.8,null,0.04);},
  select(){const t=now();noise(t,0.04,0.25,'bandpass',1900,4);if(!playBuf('sfx_note5',-16))INST.gayageum(t,81,0.3,0.25,sfxBus);},
  stamp(){const t=now();osc('sine',130,t,0.32,0.9,null,45);noise(t,0.05,0.7,'bandpass',900,5);noise(t,0.12,0.55,'lowpass',700,1);noise(t+0.005,0.05,0.35,'highpass',3200,1);osc('sine',640,t,0.05,0.18,null,420);},
  stampDry(){const t=now();osc('sine',100,t,0.18,0.5,null,45);noise(t,0.08,0.45,'lowpass',600,1);[0.03,0.06,0.1,0.15].forEach(d=>noise(t+d,0.025,0.22,'highpass',4200,2));},
  objection(){if(playBuf('sfx_objection',SFX_DB.objection))return;const t=now();osc('sine',140,t,0.6,1,null,42);noise(t,0.25,0.65,'lowpass',500,1);bellTone(784,t+0.05,0.16,1.8);},
  ok(){if(playBuf('sfx_ok',SFX_DB.ok))return;const t=now();INST.gayageum(t,69,0.8,0.6,sfxBus);INST.gayageum(t+0.11,76,0.8,0.55,sfxBus);},
  wrong(){if(playBuf('sfx_wrong',SFX_DB.wrong))return;const t=now();osc('sine',70,t,1.3,0.42);osc('sine',73.6,t,1.3,0.38);},
  lampOff(){const t=now();const f=noise(t,0.6,0.32,'bandpass',1400,2,null,0.01);f.frequency.exponentialRampToValueAtTime(180,t+0.6);},
  door(){const t=now();const o=ctx.createOscillator(),g=ctx.createGain(),bp=ctx.createBiquadFilter(),j=ctx.createOscillator(),jg=ctx.createGain();o.type='sawtooth';o.frequency.setValueAtTime(82,t);o.frequency.linearRampToValueAtTime(64,t+1.1);
   j.type='square';j.frequency.value=13;jg.gain.value=9;j.connect(jg);jg.connect(o.frequency);bp.type='bandpass';bp.frequency.setValueAtTime(700,t);bp.frequency.linearRampToValueAtTime(1100,t+1.1);bp.Q.value=7;env(g,t,0.15,0.06,1.0);o.connect(bp);bp.connect(g);g.connect(sfxBus);o.start(t);j.start(t);o.stop(t+1.4);j.stop(t+1.4);
   noise(t,1.8,0.35,'lowpass',160,1,null,0.4);osc('sine',60,t+1.15,0.3,0.35,null,40);},
  steps(n){const t=now();for(let i=0;i<(n||4);i++){const tt=t+i*0.48+Math.random()*0.03;noise(tt,0.07,0.32,'lowpass',380,1);osc('sine',72,tt,0.07,0.16,null,50);}},
  bell(){if(playBuf('sfx_bell',SFX_DB.bell))return;const t=now();[0,0.07,0.15,0.21].forEach((d,i)=>bellTone(1480+i*90,t+d,0.06,1.1));},
  bellMute(){const t=now();noise(t,0.05,0.22,'lowpass',500,1);osc('sine',160,t,0.1,0.1,null,90);},
  heartbeat(){if(playBuf('sfx_heartbeat',SFX_DB.heartbeat))return;const t=now();osc('sine',62,t,0.16,0.85,null,38);osc('sine',54,t+0.27,0.14,0.55,null,34);},
  ecg(){osc('sine',1046.5,now(),0.11,0.11);},
  flatline(){osc('sine',1046.5,now(),6,0.11);},
  page(){S.paper();},
  slam(){if(playBuf('sfx_slam',SFX_DB.slam))return;const t=now();osc('sine',58,t,0.9,1,null,30);noise(t,0.4,0.85,'lowpass',280,1);},
  brush(){const t=now();const f=noise(t,0.38,0.28,'bandpass',900,0.8,null,0.05);f.frequency.exponentialRampToValueAtTime(2600,t+0.38);},
  coin(){const t=now();bellTone(2093,t,0.05,0.4);bellTone(2637,t+0.06,0.04,0.3);},
  ink(){const t=now();osc('sine',1500,t,0.1,0.14,null,600);osc('sine',180,t+0.08,1.6,0.22,null,90);noise(t+0.08,1.2,0.16,'lowpass',400,1,null,0.3);bellTone(220,t+0.1,0.07,2.5);},
  drip(){const t=now();osc('sine',1500,t,0.08,0.15,null,620);osc('sine',2400,t+0.01,0.03,0.03,null,1200);},
  tick(){const t=now();noise(t,0.03,0.5,'bandpass',3600,4);osc('sine',2200,t,0.02,0.05);},
  snap(){const t=now();noise(t,0.04,0.5,'highpass',2600,1);noise(t+0.02,0.35,0.12,'lowpass',800,1,null,0.05);},
  wiper(){const t=now();wiper(t,1);wiper(t+0.9,1);},
  wiperOne(){wiper(now(),1);},
  crash(){const t=now();osc('sine',75,t,1.3,1,null,24);noise(t,1.5,0.9,'lowpass',1100,0.7);[1.0,1.37,2.11,2.83,3.61].forEach((m,i)=>osc('sine',310*m,t+0.02,1.2-i*0.15,0.12,null,300*m));for(let i=0;i<14;i++)osc('sine',3000+Math.random()*4000,t+0.05+Math.random()*0.7,0.06+Math.random()*0.1,0.05);noise(t+0.04,0.5,0.5,'highpass',2600,0.7);},
  note(i){if(playBuf('sfx_note'+((i||0)%8),SFX_DB.note))return;INST.gayageum(now(),[57,60,62,64,67,69,72,74][(i||0)%8],1,0.55,sfxBus);},
  resolve(){if(playBuf('sfx_resolve',SFX_DB.resolve))return;const t=now();[57,64,69,73,76,81].forEach((n,i)=>INST.gayageum(t+i*0.3,n,2,0.5,sfxBus));},
  hum(){if(playBuf('sfx_hum',SFX_DB.hum))return;INST.daegeum(now(),69,2.6,0.16,sfxBus);}
 };
 function hbStart(rate){hbRate=rate||1;if(hbTimer)return;const tick=()=>{if(ctx&&!muted)try{S.heartbeat();}catch(e){}hbTimer=setTimeout(tick,Math.max(260,900/hbRate));};tick();}
 function hbStop(){clearTimeout(hbTimer);hbTimer=null;}
 function stopScene(fast){timers.forEach(id=>{clearTimeout(id);clearInterval(id);});timers=[];const tc=fast?0.04:0.9;stopLoop(fast);
  padNodes.forEach(n=>{try{n.g.gain.cancelScheduledValues(now());n.g.gain.setTargetAtTime(0.0001,now(),tc);n.o.stop(now()+(fast?0.4:3.5));n.l.stop(now()+(fast?0.4:3.5));}catch(e){}});padNodes=[];
  if(rainNode){try{rainNode.g.gain.setTargetAtTime(0.0001,now(),fast?0.05:1);rainNode.s.stop(now()+(fast?0.5:4));}catch(e){}rainNode=null;}}
 function loop(fn,sec){timers.push(setInterval(fn,sec*1000));}
 const AMAJ=[45,52,57,61];
 const SCENES={
  title:[()=>rain(0.05),()=>{pad([45,57,64],0.10,'triangle',700);startSeq(66,32,[...arp([45,52,57,60,64,60,57,52],32,1,0.28),...themeEvents('main',4,'haegeum',0.62).ev]);}],
  desk:[null,()=>{pad([45,52],0.06,'triangle',500);startSeq(72,16,[[0,'gayageum',57,2,0.42],[3,'gayageum',60,1,0.32],[4,'gayageum',62,2,0.36],[8,'gayageum',57,2,0.4],[12,'gayageum',64,3,0.34]]);}],
  wait:[()=>loop(()=>S.ecg(),3.2),()=>{pad([57,64],0.05,'sine',900);startSeq(60,24,themeEvents('yeoni',2,'musicbox',0.6).ev);}],
  night:[null,()=>{pad([45,57],0.06,'triangle',600);startSeq(56,32,themeEvents('yeoni',2,'daegeum',0.55,1.5,-12).ev);}],
  court:[null,()=>{pad([33,40],0.12,'sawtooth',380);startSeq(84,8,[[0,'deong',0,0,0.8],[1.5,'gi',0,0,0.5],[2,'deok',0,0,0.55],[3,'deong',0,0,0.7],[6,'deong',0,0,0.75],[7,'deok',0,0,0.6]]);}],
  courtEcg:[()=>{pad([33,40],0.07,'sawtooth',300);loop(()=>S.ecg(),1.4);},null],
  escort:[null,()=>{pad([43,50],0.07,'triangle',500);startSeq(50,16,[[0,'gayageum',55,4,0.3],[6,'gayageum',62,4,0.25],[10,'gayageum',57,6,0.28]]);}],
  rain:[()=>{rain(0.17);pad([42],0.05,'triangle',300);loop(()=>wiper(now(),0.8,ambBus),1.8);},null],
  hospital:[()=>loop(()=>{S.ecg();wiper(now()+0.9,0.22,ambBus);},1.8),()=>{pad([45,57,61,64],0.07,'sine',1100);startSeq(60,36,[...arp(AMAJ.concat([64,61]),36,1,0.24),...themeEvents('yeoniMajor',4,'daegeum',0.6,1.2).ev]);}],
  mirror:[null,()=>{pad([45,52,57],0.07,'triangle',700);startSeq(54,40,themeEvents('main',2,'daegeum',0.55,1.6).ev);}],
  flat:[()=>pad([45,57,61,64],0.05,'sine',900),null],
  drip:[()=>loop(()=>S.drip(),3.1),null],
  cut:[null,null],silence:[null,null]
 };
 const TRIM={title:1.5,desk:5,wait:3,night:-4.3,court:-3.4,courtEcg:2.4,escort:2.3,rain:-3.6,hospital:-1,mirror:-4.6,flat:3.3,drip:0};
 function setScene(name){if(scene===name)return;scene=name;if(!ctx)return;stopScene(name==='cut');const g=dbg(TRIM[name]||0);
  musBus.gain.setTargetAtTime(0.42*g,now(),0.3);ambBus.gain.setTargetAtTime(0.55*g,now(),0.3);
  const sc=SCENES[name]||[null,null];try{sc[0]&&sc[0]();}catch(e){}
  if(sc[1]){if(!startLoop(name)){try{sc[1]();}catch(e){}}}}
 function measure(ms){return new Promise(r=>{const buf=new Float32Array(analyser.fftSize);let sum=0,n=0,peak=0,clip=0;const id=setInterval(()=>{analyser.getFloatTimeDomainData(buf);for(const v of buf){const a=Math.abs(v);sum+=v*v;n++;if(a>peak)peak=a;if(a>=0.999)clip++;}},40);
  setTimeout(()=>{clearInterval(id);const rms=Math.sqrt(sum/Math.max(1,n));r({rmsDb:+(20*Math.log10(rms+1e-9)).toFixed(1),peakDb:+(20*Math.log10(peak+1e-9)).toFixed(1),clip,sample:!!loopSrc});},ms);});}
 /* 재(齋)별 염불 BGM: 1재 목탁 · 2~3재 독송 · 4~5재 범종 · 6~7재 요령 */
 function setDay(d){const k=d<=1?1:d<=3?2:d<=5?3:4;if(k===jae)return;jae=k;
  if(ctx&&scene==='desk'&&loopSrc&&loopKey!=='bgm_jae'+k&&BUF['bgm_jae'+k]){stopLoop();startLoop('desk');}}
 const api={init,setScene,setDay,hbStart,hbStop,setRate(r){hbRate=r;},
  play(n,a){if(!ctx||muted)return;try{S[n]&&S[n](a);}catch(e){}},
  vib(p){try{if(navigator.vibrate)navigator.vibrate(p);}catch(e){}},
  toggle(){muted=!muted;try{localStorage.setItem('49e_mute',muted?'1':'0');}catch(e){}if(master)master.gain.setTargetAtTime(muted?0:0.89,now(),0.1);return muted;},
  muted:()=>muted,packStatus:null,
  _sfx:()=>Object.keys(S),_scenes:()=>Object.keys(SCENES),_buffers:()=>Object.keys(BUF),_loopAt:()=>LOOPAT,
  async _waitPack(ms){init();const t0=Date.now();while(!api.packStatus&&Date.now()-t0<(ms||20000))await new Promise(r=>setTimeout(r,100));return api.packStatus;},
  async _measureScene(name,ms){init();scene=null;setScene(name);await new Promise(r=>setTimeout(r,1800));return measure(ms||5000);},
  async _measureSfx(name,arg){init();setScene('silence');await new Promise(r=>setTimeout(r,1500));const p=measure(1600);S[name](arg);return p;},
  _test(){init();const errs=[];Object.keys(S).forEach(k=>{try{S[k]();}catch(e){errs.push(k+':'+e.message);}});return errs;},
  _forceSynth(){noPack=true;for(const k in BUF)delete BUF[k];}
 };
 return api;
})();
/* 첫 입력(클릭·터치)으로 소리 엔진을 깨운다 */
['click','touchend'].forEach(ev=>document.addEventListener(ev,()=>{try{SND.init();}catch(e){}},{capture:true,passive:true}));
