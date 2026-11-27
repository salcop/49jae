/* =====================================================================
   49재 — 최종 감독판 데이터
   [추리] WORLD=진실 · 증거는 진실과 일치 · 거짓 진술 + 같은 사실의 증거(1장) 또는 조각 2장
   [구조] 기(一) → 승(二·三) → 전(四·五) → 결(六·七)
   [거울] 일반 망자는 모두 무명 또는 흑을 비춘다 — 七齋 「그 손들은 모두, 그날 밤의 나였다」
   ===================================================================== */
var DATA={
WORLD:{
 'dog.owner':'있음','dog.cause':'노환','driver.surname':'이',
 'gm.sponsor':'있음','gm.contact':'있음','gm.found':'30일',
 'con.repaid':'변제','con.crimes':'사기 7건',
 'choi.job':'건설사 회장','choi.alive_at_donation':'아니오',
 'jh.embezzle':'있음','jh.use':'수술비',
 'bus.route':'노선 밖','sj.earphone':'착용','bus.child':'있음','sj.time':'22:41',
 'dy.fault':'회피','dy.work':'배달',
 'bus.fare':'웃돈','driver.sober':'맑음','driver.habit':'금주','hikers.purpose':'하산',
 'jt.case':'미결','jt.night':'매일',
 'tae.location':'버스 조수석','tae.alive_0920':'아니오','tae.father':'그룹 회장',
 'ws.fraud':'무료','ws.bells':'있음',
 'bus.survivor':'있음','driver.last':'뒷자리','misuk.job':'간호사',
 'wheel':'조수석 남자','report.editor':'흑','weather':'비','precedent':'있음'
},
HALVES:{
 'choi.alive_at_donation':['사망일','시주일'],
 'bus.route':['막차 규정','운행 시각'],
 'driver.sober':['술병','마신 사람'],
 'tae.alive_0920':['사망일','서명일'],
 'bus.survivor':['이송','명부'],
 'precedent':['1996 사건','같은 기사']
},
HALF_HINT:{
 'choi.alive_at_donation':{'시주일':'죽은 날은 알았다. 시주 영수증의 날짜와 맞춰 보라.','사망일':'시주 날짜는 알았다. 그날 그가 살아 있었는지 확인하라.'},
 'bus.route':{'막차 규정':'22:31에 버스를 탔다. 그 시각이 왜 이상한지 — 규정집에 있다.','운행 시각':'막차가 끝나는 시각은 알았다. 그 버스가 몇 시에 달리고 있었는지 찾아라.'},
 'driver.sober':{'술병':'조수석 남자가 마셨다. 하지만 술이 그것뿐이었는지 — 차 안에 남은 것을 확인하라.','마신 사람':'빈 병은 하나. 그럼 그 한 병은 누가 마셨지?'},
 'tae.alive_0920':{'서명일':'그가 죽은 날은 알았다. 재단 서류의 서명 날짜와 맞춰 보라.','사망일':'서명한 날은 알았다. 그날 그는 살아 있었나?'},
 'bus.survivor':{'명부':'구급차엔 아이가 실렸다. 이송 중에 숨졌다면? 명부 접수표를 확인하라.','이송':'명부엔 10세 미만이 없다. 그 버스에 아이가 있었다는 기록은?'},
 'precedent':{'같은 기사':'1996년에도 같은 사고가 있었다. 그 버스의 기사는 누구였지?','1996 사건':'흑은 30년 전 버스 기사였다. 그 버스에 무슨 일이 있었는지 — 누군가의 수첩에.'}
},
TIMELINE:[
 ['07:10','김복순의 평소 탑승 시각 (사고와 무관)'],
 ['22:15','산악회 하산, 막차 놓침'],
 ['22:20','3번 막차 종료'],
 ['22:24','조수석 남자가 기사에게 봉투를 건넴'],
 ['22:25','산악회 단체방: 웃돈 내고 탔다'],
 ['22:31','한서진 문자: 기사님이 태워 준대'],
 ['22:40','조수석 남자가 핸들을 잡아챔 (블랙박스)'],
 ['22:41','사고 · 한서진 등 현장 사망'],
 ['22:50','구급차: 8세 여아 소아병동 이송'],
 ['22:58','정미숙, 이송 중 사망']
],
PASSENGERS:[
 {name:'(백지)',age:48,dead:true},{name:'강태준',age:29,dead:true},
 {name:'산악회1',age:51,dead:true},{name:'산악회2',age:55,dead:true},{name:'산악회3',age:58,dead:true},
 {name:'산악회4',age:60,dead:true},{name:'산악회5',age:63,dead:true},{name:'산악회6',age:68,dead:true},
 {name:'한서진',age:17,dead:true},{name:'정미숙',age:34,dead:true},{name:'연이',age:8,dead:false}
],
DEATH_RECORDS:10,

RULES:[
 {id:'R1',day:1,title:'규정 一',text:'동물 망자는 자동으로 환생 처리한다.'},
 {id:'R2',day:1,title:'규정 二',text:'명부 권고와 다른 도장을 찍으려면, 그 망자의 서류에 인정된 이의가 한 건 이상 있어야 한다.'},
 {id:'R3',day:2,title:'규정 三 · 버스 운행',text:'3번 마을버스 막차는 22:20에 끝난다. 그 뒤의 운행은 모두 노선 밖 운행이다.',half:{'bus.route':'막차 규정'},show:{'bus.route':'22:20에 끝난다'}},
 {id:'R4',day:3,title:'규정 四',text:'지난 재에 받은 증언(수첩)도 증거로 낼 수 있다.'},
 {id:'R5',day:4,title:'규정 五 · 흑의 지시',text:'고액 공덕 망자는 담당자(흑)의 사전 검토를 따른다.'}
],

CASES:[
{id:'dog',day:1,name:'복실이',img:'dog',desc:'진돗개 믹스 · 16세',rec:'환생',tutorial:true,mirror:'기다림',
 statements:[
  {id:'s1',by:'명부',text:'주인: 없음 (유기견)',fact:['dog.owner','없음'],show:'유기견',press:'(복실이가 낑낑거리며 종점 쪽을 본다. 꼬리를 한 번 흔들다 만다.)'},
  {id:'s2',by:'명부',text:'사망원인: 노환 (16세)',fact:['dog.cause','노환'],show:'노환',press:'(복실이가 하품을 한다. 늙은 개다.)'}],
 cards:[
  {id:'dog_rec',title:'생전기록 · 복실이',text:'2009년 3번 마을버스 종점에서 구조됨.\n주인: 마을버스 기사 이○○.\n2026년 9월 13일 동물병원 — 종양 수술 예약. 보호자 이○○. 수술비 미납.\n9월 이후 주인이 오지 않아 종점에서 매일 기다림.',facts:{'dog.owner':'있음','driver.surname':'이'},show:{'dog.owner':'주인: 마을버스 기사','driver.surname':'이○○'}},
  {id:'dog_rep',title:'사망보고 · 복실이',text:'3번 버스 종점 벤치 아래에서 발견.\n사인: 노환. (수술받지 못한 종양)',facts:{'dog.cause':'노환'},show:{'dog.cause':'노환'}}]
},
{id:'choi',day:1,name:'최만석',img:'choi',desc:'66세 · 건설사 회장',rec:'천국',mirror:'돈',
 note:'이건 그냥 천국.\n묻지 마. 수고비 30냥.\n― 흑',
 statements:[
  {id:'s1',by:'본인',text:'"나 ○○건설 회장이야."',fact:['choi.job','건설사 회장'],show:'회장',press:'"바쁘니까 빨리 찍어. 얘기 다 됐어."'},
  {id:'s2',by:'명부',text:'공덕: 생전에 사찰 시주 5억 원',fact:['choi.alive_at_donation','예'],show:'생전에',press:'"그 정도는 해야 천국 가지. 저승 돈은 이승 제사상에서 나온다며? 우리 집 제사상이 제일 커."'}],
 cards:[
  {id:'choi_rep',title:'사망보고 · 최만석',text:'2026년 10월 12일 자택에서 사망.\n보고서 수정 1회 — 수정자: 흑',facts:{'report.editor':'흑'},half:{'choi.alive_at_donation':'사망일'},show:{'choi.alive_at_donation':'10월 12일','report.editor':'수정자: 흑'},keep:true},
  {id:'choi_rec',title:'생전기록 · 최만석',text:'○○건설 회장.\n사찰 시주 영수증 — 10월 20일, 5억 원 (납부자: 장남).',facts:{'choi.job':'건설사 회장'},half:{'choi.alive_at_donation':'시주일'},show:{'choi.job':'건설 회장','choi.alive_at_donation':'10월 20일'}}]
},
{id:'gm',day:1,name:'김복순',img:'grandma',desc:'72세 · 고독사',rec:'환생',mirror:'귤',
 statements:[
  {id:'s1',by:'명부',text:'공덕: 특별한 선행 없음',fact:['gm.sponsor','없음'],show:'선행 없음',press:'"선행은 무슨. 남들 하는 만큼 살았지."'},
  {id:'s2',by:'명부',text:'생전 교류: 없음 (방문자 기록 없음)',fact:['gm.contact','없음'],show:'교류: 없음',
   press:'"교류는 무슨… 아침마다 버스 기사 양반한테 귤 하나 건네는 게 다지.\n그 양반은 평소에 【술 한 방울】 안 하는 사람이었어. 요즘은 통 안 보이더라."',giveCard:'W_gm'},
  {id:'s3',by:'명부',text:'사망 30일이 지나서야 발견됨',fact:['gm.found','30일'],show:'30일',press:'"…아무도 안 왔지. 그 기사 양반이 있었으면 와 봤을 텐데."'}],
 cards:[
  {id:'gm_rec',title:'생전기록 · 김복순',text:'매일 07:10 3번 마을버스 탑승, 기사에게 귤 하나씩 건넴.\n아동보호시설 정기후원 20년.',facts:{'gm.contact':'있음','gm.sponsor':'있음'},show:{'gm.contact':'매일 07:10','gm.sponsor':'정기후원 20년'}},
  {id:'gm_rep',title:'사망보고 · 김복순',text:'자택에서 사망 30일 뒤 발견.\n사인: 고독사. 식탁 위에 귤 한 봉지.',facts:{'gm.found':'30일'},show:{'gm.found':'30일 뒤'}}]
},
{id:'con',day:1,name:'박칠성',img:'chil',desc:'68세 · 전과 7범',rec:'지옥',mirror:'갚음',
 statements:[
  {id:'s1',by:'명부',text:'죄목: 사기 7건',fact:['con.crimes','사기 7건'],show:'사기 7건',press:'"내가 사기꾼인 건 맞지. 그건 변명 안 해."'},
  {id:'s2',by:'명부',text:'피해 회복: 미변제',fact:['con.repaid','미변제'],show:'미변제',press:'"…갚는다고 지워지나. 근데 그 메모리카드는 버리지 마쇼. 사람 하나 살릴 거요."'}],
 cards:[
  {id:'con_rec',title:'생전기록 · 박칠성',text:'2019년 출소. 사기 7건 피해자 7명 전원에게 전액 변제(공증).\n마지막 직업: 마을버스 정비소 야간 경비.',facts:{'con.repaid':'변제','con.crimes':'사기 7건'},show:{'con.repaid':'전액 변제','con.crimes':'사기 7건'}},
  {id:'con_rep',title:'사망보고 · 박칠성',text:'2026년 10월 호스피스에서 사망.\n유품: 낡은 블랙박스 메모리카드 1개.\n유언: "그거 버리지 마."'}]
},
{id:'jh',day:2,name:'박정호',img:'office',desc:'52세 · 회사원 · 횡령',rec:'지옥',mirror:'흑',
 statements:[
  {id:'s1',by:'명부',text:'죄목: 회사 공금 3천만 원 횡령',fact:['jh.embezzle','있음'],show:'횡령',press:'"…맞습니다. 제가 가져갔어요. 변명 안 하겠습니다."'},
  {id:'s2',by:'명부',text:'횡령한 돈은 도박과 유흥에 탕진',fact:['jh.use','유흥'],show:'유흥',press:'"…애가 아팠어요. 회사엔 말 못 했고요. 다음 달 월급으로 채워 넣으려고 했는데."'}],
 cards:[
  {id:'jh_rec',title:'병원 영수증',text:'환자: 박지은 (9세). 심장 수술비 3천만 원.\n납부자: 박정호.',facts:{'jh.use':'수술비'},show:{'jh.use':'심장 수술비'}},
  {id:'jh_rep',title:'사망보고 · 박정호',text:'자수서를 쓰다 사무실 책상에서 쓰러짐.\n책상 위: 자수서 1장, 딸의 그림 1장.',facts:{'jh.embezzle':'있음'},show:{'jh.embezzle':'자수서'}}]
},
{id:'sj',day:2,name:'한서진',img:'seojin',desc:'17세 · 고등학생 · 사건 0914-2241',rec:'환생',seat:'s_seojin',mirror:'기다림',
 note:'이 서류 사망시각은\n건드리지 마.\n― 흑',
 statements:[
  {id:'s1',by:'명부',text:'3번 버스 정상 노선 운행 중 사고',fact:['bus.route','정상 노선'],show:'정상 노선',press:'"정상 노선이요? …그 길, 처음 보는 산길이었는데.\n그 기사님, 막차 놓친 애들은 그냥 태워 줬어요. 저도 몇 번 얻어 탔고요."'},
  {id:'s2',by:'본인',text:'"이어폰 끼고 있어서 아무것도 못 들었어요."',fact:['sj.earphone','착용'],show:'이어폰',press:'"…근데 이상하게, 맨 뒷자리에 토끼 인형 안은 【꼬마】는 기억나요. 계속 자던데."',giveCard:'W_sj'},
  {id:'s3',by:'명부',text:'사망시각: 22:58 (병원 이송 중)',fact:['sj.time','22:58'],show:'22:58',press:'"병원이요? 전 병원 간 기억 없어요. 눈 떠 보니 여기였어요."'}],
 cards:[
  {id:'sj_msg',title:'문자 기록 · 한서진',text:'22:31 엄마에게: "기사님이 태워 준대. 좀 돌아간대."',half:{'bus.route':'운행 시각'},show:{'bus.route':'22:31'},keep:true},
  {id:'sj_rep',title:'사망보고 · 한서진',text:'현장 사망 22:41 (산길 커브, 구급대 도착 전).\n유품: 귀에 꽂힌 채 발견된 이어폰.',facts:{'sj.time':'22:41','sj.earphone':'착용'},show:{'sj.time':'현장 사망 22:41','sj.earphone':'이어폰'}}]
},
{id:'dy',day:3,name:'김도윤',img:'rider',desc:'28세 · 배달 기사',rec:'지옥',mirror:'핸들',
 confront:{
  intro:'목격자 진술과 김도윤의 진술이 엇갈린다. 교차로 CCTV를 보며, 줄마다 맞는 쪽을 고른다.',
  cctv:'차량 신호: 초록.\n횡단보도로 아이가 뛰어듦.\n오토바이가 아이를 피해 핸들을 꺾은 뒤 가로등에 충돌.',
  rows:[
   {topic:'신호',a:'"초록불이었어요."',b:'"빨간불에 달려들었어."',truth:'a',why:'차량 신호: 초록'},
   {topic:'아이',a:'"애가 갑자기 튀어나왔어요."',b:'"애는 인도에 가만히 서 있었어."',truth:'a',why:'아이가 뛰어듦'},
   {topic:'마지막',a:'"브레이크만 밟았어요."',b:'"핸들을 꺾어서 가로등에 박았어."',truth:'b',why:'핸들을 꺾은 뒤',after:'김도윤: "…꺾었어요? 기억이 안 나요. 그 애 얼굴만 보였어요."'}],
  who:['김도윤','행인 목격자']},
 statements:[
  {id:'s1',by:'명부',text:'사고 원인: 신호 무시하고 행인을 향해 돌진',fact:['dy.fault','돌진'],show:'돌진',press:'"…애가 튀어나왔다고요. 제가 뭘 어떻게 해요."'},
  {id:'s2',by:'본인',text:'"마지막 배달 가던 길이었어요."',fact:['dy.work','배달'],show:'배달',press:'"식기 전에 갖다줘야 별점 안 깎이거든요."'}],
 cards:[
  {id:'dy_cctv',title:'교차로 CCTV',text:'차량 신호: 초록.\n횡단보도로 아이가 뛰어듦.\n오토바이가 아이를 피해 핸들을 꺾은 뒤 가로등에 충돌.',facts:{'dy.fault':'회피'},show:{'dy.fault':'아이를 피해'}},
  {id:'dy_rep',title:'사망보고 · 김도윤',text:'배달앱 기록: 마지막 주문 배달 중.\n헬멧 착용.',facts:{'dy.work':'배달'},show:{'dy.work':'배달 중'}}]
},
{id:'hk',day:3,name:'참나무 산악회 (6인)',img:'hikers',desc:'일괄 서류 · 사건 0914-2241',rec:'환생',seat:'s_hikers',mirror:'웃돈',
 statements:[
  {id:'s1',by:'명부',text:'전원 정상 요금으로 승차',fact:['bus.fare','정상'],show:'정상 요금',press:'"요금? 아이고, 그날은 사정사정해서 탔지."'},
  {id:'s2',by:'명부',text:'사고 원인: 운전기사 음주',fact:['driver.sober','음주'],show:'기사 음주',press:'"기사님이 술을? 에이, 말도 안 돼."'},
  {id:'s3',by:'본인',text:'"산행 마치고 하산하는 길이었지!"',fact:['hikers.purpose','하산'],show:'하산',press:'"그날 산 좋았지! 【막걸리】? 조수석 젊은 놈이 병째 들이켜더라."',giveCard:'W_hk'}],
 cards:[
  {id:'hk_chat',title:'단체 대화방 · 참나무 산악회',text:'22:25 "막차 놓쳐서 기사님한테 웃돈 드리고 탔다 ㅋㅋ"',facts:{'bus.fare':'웃돈'},show:{'bus.fare':'웃돈'},keep:true},
  {id:'hk_rep',title:'사망보고 · 산악회',text:'22:15 하산, 3번 막차 놓침. 사망 6명.\n차내 유류품: 막걸리 빈 병 1개.\n보고서 수정 2회 — 수정자: 흑',facts:{'hikers.purpose':'하산','report.editor':'흑'},half:{'driver.sober':'술병'},show:{'hikers.purpose':'하산','report.editor':'수정자: 흑','driver.sober':'막걸리 빈 병 1개'},keep:true}]
},
{id:'jt',day:4,name:'오종태',img:'detective',desc:'74세 · 은퇴 형사',rec:'천국',mirror:'흑',
 statements:[
  {id:'s1',by:'명부',text:'퇴직 뒤 16년 동안 매일 밤 같은 사건 서류를 읽었다',fact:['jt.night','매일'],show:'매일 밤',press:'"집사람이 질려 했지. 그래도 못 놓겠더라고."'},
  {id:'s2',by:'명부',text:'공덕: 맡은 사건 전부 해결 — 미제 0건',fact:['jt.case','해결'],show:'미제 0건',press:'"…하나 있지. 1996년, 비 오는 날 시외버스. 살아남은 학생 하나가, 기사가 자길 덮어 줬다고 울더군.\n위에서 덮으라더군. 학생 말도, 사건도."'}],
 cards:[
  {id:'jt_note',title:'수첩 · 오종태',text:'1996년 4번 시외버스 추락 — 미결.\n"기사가 막차 뒤 웃돈을 받고 운행했다"는 진술 있음.\n생존자 1명 — 막차 놓친 고3 남학생.\n"기사 아저씨가 핸들을 놓고 날 덮었어요."\n윗선 지시로 종결.',facts:{'jt.case':'미결'},half:{'precedent':'1996 사건'},show:{'jt.case':'미결','precedent':'1996년 4번 시외버스 추락'},keep:true},
  {id:'jt_rec',title:'생전기록 · 오종태',text:'경찰 38년 근속, 2010년 퇴직.\n가족 진술: 매일 밤 1996년 서류를 읽음.',facts:{'jt.night':'매일'},show:{'jt.night':'매일 밤'}}]
},
{id:'tae',day:4,name:'강태준',img:'tae',desc:'29세 · 재벌 2세',rec:'천국',mirror:'돈',
 note:'천국. 이번엔 진짜 묻지 마.\n― 흑',
 statements:[
  {id:'s1',by:'본인',text:'"그날 밤 난 집에 있었어. 심장이 멈췄다고."',fact:['tae.location','자택'],show:'집에',press:'"…기억 안 나. 비가 왔고, 기사가 자꾸 내리라고… 아니, 집이었다고!"'},
  {id:'s2',by:'본인',text:'"재단 서류엔 내가 살아서 직접 서명했어."',fact:['tae.alive_0920','예'],show:'직접 서명',press:'"아버지가… 아니, 내가 했다니까."'},
  {id:'s3',by:'본인',text:'"우리 아버지가 ○○그룹 회장이야."',fact:['tae.father','그룹 회장'],show:'그룹 회장',press:'"저승도 돈이면 된다고 하셨어."'}],
 cards:[
  {id:'tae_rep',title:'사망보고 원본 · 강태준',text:'실제 사망: 9월 14일 22:41 교통사고.\n위치: 3번 마을버스 조수석.\n보고서 수정자: 흑',facts:{'tae.location':'버스 조수석','report.editor':'흑'},half:{'tae.alive_0920':'사망일'},show:{'tae.location':'3번 마을버스 조수석','tae.alive_0920':'9월 14일','report.editor':'수정자: 흑'},keep:true},
  {id:'tae_rec',title:'생전기록 · 강태준',text:'○○그룹 회장 장남.\n장학재단 설립 서류 — 9월 20일, 서명: 강태준.',facts:{'tae.father':'그룹 회장'},half:{'tae.alive_0920':'서명일'},show:{'tae.father':'그룹 회장','tae.alive_0920':'9월 20일'}}]
},
{id:'ws',day:5,name:'월선',img:'shaman',desc:'45세 · 무녀',rec:'지옥',mirror:'방울',
 statements:[
  {id:'s1',by:'명부',text:'죄목: 모든 굿에 큰돈을 받아 신도 재산 갈취',fact:['ws.fraud','유료'],show:'모든 굿에',press:'"모든 굿? 난 돈 없는 집 굿은 공짜로 해 줬어. 장부 봐."'},
  {id:'s2',by:'본인',text:'"이 방울은 죽은 혼 앞에서만 울려."',fact:['ws.bells','있음'],show:'방울',press:'"평생 몸에서 안 뗐지. 여기 오니 쉴 새 없이 울리더라. …한 번만 빼고."'}],
 cards:[
  {id:'ws_led',title:'굿 장부 · 월선',text:'형편 어려운 집 진혼굿 41건 — 사례비 받지 않음.',facts:{'ws.fraud':'무료'},show:{'ws.fraud':'사례비 받지 않음'}},
  {id:'ws_rep',title:'사망보고 · 월선',text:'유품: 놋쇠 방울 한 꾸러미.',facts:{'ws.bells':'있음'},show:{'ws.bells':'놋쇠 방울'}}]
},
{id:'ms',day:5,name:'정미숙',img:'misuk',desc:'34세 · 간호사 · 사건 0914-2241',rec:'환생',seat:'s_misuk',mirror:'안은 손',
 statements:[
  {id:'s2',by:'명부',text:'운전기사는 마지막까지 운전석에 있었다',fact:['driver.last','운전석'],show:'운전석에',press:'"아니에요. 그건 제가 똑똑히 봤어요."'},
  {id:'s3',by:'본인',text:'"저는 시립병원 간호사예요. 그날 일, 다 봤어요."',fact:['misuk.job','간호사'],show:'간호사',press:'"핸들이 꺾이는 순간, 기사님이 핸들을 놓고 【맨 뒷자리】로 달려갔어요. 그 아이를 안았어요."',giveCard:'W_ms'}],
 cards:[
  {id:'ms_log',title:'구급일지 · 시립병원',text:'22:50 소아병동 이송: 8세 여아 1명.\n22:58 34세 여성(정미숙) 이송 중 사망.',half:{'bus.survivor':'이송'},show:{'bus.survivor':'8세 여아'},keep:true},
  {id:'ms_reg',title:'사망 명부 접수표 · 九月 十四日 사고',text:'접수 10장. 연령 17세~68세.',half:{'bus.survivor':'명부'},show:{'bus.survivor':'10세 미만 없음'},keep:true},
  {id:'ms_note',title:'간호 수첩 · 정미숙',text:'22:24 조수석 남자가 기사에게 봉투를 건넴. 기사는 한참 망설이다 받음.',facts:{'bus.fare':'웃돈'},show:{'bus.fare':'봉투'},keep:true}]
}
],

WCARDS:{
 W_gm:{title:'증언 · 김복순',text:'"그 기사 양반은 평소에 술 한 방울 안 하는 사람이었어."',facts:{'driver.habit':'금주'},show:{'driver.habit':'술 한 방울'}},
 W_sj:{title:'증언 · 한서진',text:'"맨 뒷자리에 토끼 인형 안은 꼬마는 기억나요."',facts:{'bus.child':'있음'},show:{'bus.child':'꼬마'}},
 W_hk:{title:'증언 · 산악회',text:'"막걸리? 조수석 젊은 놈이 병째 들이켜더라."',half:{'driver.sober':'마신 사람'},show:{'driver.sober':'조수석 젊은 놈이'}},
 W_ms:{title:'증언 · 정미숙',text:'"기사님이 핸들을 놓고 맨 뒷자리로 달려갔어요. 그 아이를 안았어요."',facts:{'driver.last':'뒷자리'},show:{'driver.last':'맨 뒷자리'}},
 W_fix:{title:'정정 기록 · 한서진 사망시각',text:'명부 22:58 → 현장 22:41로 정정.\n원 기록 수정자: 흑',facts:{'sj.time':'22:41','report.editor':'흑'},show:{'sj.time':'22:41','report.editor':'수정자: 흑'},cond:{c_time:'fix'},from:3},
 W_route:{title:'흑의 서랍 · 낡은 노선표',text:'1996년 4번 시외버스 노선표.\n기사: 흑',half:{'precedent':'같은 기사'},show:{'precedent':'기사: 흑'},cond:{c_drawer:'open'},from:6},
 W_bb:{title:'블랙박스 영상 (박칠성이 지킨 카드)',text:'22:40 빗길. 조수석 남자가 핸들을 잡아챈다. 기사가 핸들을 놓고 뒤로 몸을 날린다.',facts:{'wheel':'조수석 남자'},show:{'wheel':'조수석 남자가 핸들을'},cond:{c_con:['rebirth','hold']},from:7},
 W_tae:{title:'강태준 소환 진술',text:'"…핸들 잡은 건 나야. 조수석에서. 아버지가 다 덮었어."',facts:{'wheel':'조수석 남자','tae.location':'버스 조수석'},show:{'wheel':'핸들 잡은 건 나야','tae.location':'조수석에서'},cond:{c_tae:['hold','hell']},from:7}
},

TRIAL:{
 statements:[
  {id:'t0',by:'흑의 보고서',text:'"피고는 평소에도 술을 즐기던 사람이다."',fact:['driver.habit','음주'],show:'평소에도',press:'"흑이 올린 보고서다. 평소 행실 말이다."'},
  {id:'t1',by:'염라',text:'"그날 밤 피고는 술에 취해 운전했다."',fact:['driver.sober','음주'],show:'술에 취해',press:'"차 안에서 술병이 나왔다. 누가 마셨겠느냐."'},
  {id:'t2',by:'염라',text:'"핸들을 꺾은 것은 피고다."',fact:['wheel','기사'],show:'핸들을 꺾은',press:'"핸들을 쥔 자가 사고를 낸다. 당연하지 않은가."'},
  {id:'t6',by:'흑의 보고서',text:'"이런 사고는 전례가 없다. 기사 한 사람의 일탈이다."',fact:['precedent','없음'],show:'전례가 없다',press:'"흑은 이 관리소에서 가장 오래 일한 자다. 그의 보고는 믿을 만하지."'},
  {id:'t4',by:'염라',text:'"그날 밤 비가 내렸다."',fact:['weather','비'],show:'비가',press:'"비가 왔지. 길이 미끄러웠다."'},
  {id:'t5',by:'염라',text:'"그 버스에 생존자는 없다."',fact:['bus.survivor','없음'],show:'생존자는 없다',press:'"명부는 열 장. 그 버스의 사람은 모두 이쪽으로 왔다."'}],
 lamps:5
},

SUMMARY:{
 1:{text:'실종된 3번 버스 기사의 성은 {0}씨이고, 단골 승객은 그가 평소 {1} 안 하는 사람이라고 했다.',
    blanks:[{key:'driver.surname',answer:'이',opts:['박','이','최']},{key:'driver.habit',answer:'술 한 방울',opts:['담배 한 개비','욕 한마디','술 한 방울']}]},
 2:{text:'사고 버스는 막차가 끝난 {0} 뒤에도 승객을 태웠고, 맨 뒷자리에는 {1}가 있었다.',
    blanks:[{key:'bus.route',answer:'22:20',opts:['22:31','22:20','22:41']},{key:'bus.child',answer:'꼬마',opts:['학생','기사','꼬마']}]},
 3:{text:'승객들은 기사에게 {0}을 주고 탔고, 그날 {1}를 마신 건 조수석 남자였다.',
    blanks:[{key:'bus.fare',answer:'웃돈',opts:['승차권','웃돈','교통카드']},{key:'driver.sober',answer:'막걸리',opts:['소주','맥주','막걸리']}]},
 4:{type:'timeline',text:'九月 十四日 밤을 순서대로 놓아라. 그날의 조각들이 하나로 이어진다.',
    cards:[
     {t:'22:15',text:'산악회가 하산해 막차를 놓친다',src:'산악회 사망보고'},
     {t:'22:20',text:'3번 막차 운행이 끝난다',src:'규정 三'},
     {t:'22:25',text:'산악회가 「웃돈 드리고 탔다」고 단체방에 쓴다',src:'단체 대화방'},
     {t:'22:31',text:'서진이 엄마에게 「태워 준대」 문자를 보낸다',src:'문자 기록'},
     {t:'22:41',text:'버스가 산길 커브에서 떨어진다',src:'사망보고 원본'}]},
 5:{text:'기사는 {0}을 받았지만, 마지막 순간 핸들을 놓고 {1}로 달려갔다.',
    blanks:[{key:'bus.fare',answer:'봉투',opts:['술','봉투','지도']},{key:'driver.last',answer:'맨 뒷자리',opts:['출입문','맨 뒷자리','운전석']}]}
},

CHOICES:[
 {id:'c_dog',day:1,q:'복실이에게 남길 환생 메모',need:{case:'dog',stm:'s1'},
  opts:{own:{label:'주인 곁으로',echo:{news:['종점의 강아지','2009년 봄, 3번 버스 종점에서 떠돌이 강아지가 구조됐다. 신입 기사 이모 씨가 "복실이"라 이름 붙였다고.']},recall:'七齋, 기억이 막힐 때 복실이가 달려온다'},
        rule:{label:'규정대로 (주인 메모 없음)',echo:{news:['종점 벤치','3번 버스 종점 벤치 아래 개밥그릇이 치워졌다.']},recall:'복실이는 돌아오지 않는다'},
        unknown:{label:'(주인을 몰랐다)',echo:{news:['종점 벤치','3번 버스 종점 벤치 아래 개밥그릇이 치워졌다.']},recall:'복실이는 돌아오지 않는다'}}},
 {id:'c_con',day:1,q:'박칠성과 메모리카드',
  opts:{rebirth:{label:'환생 — 카드를 쥐고 간다',echo:{news:['정비소의 남자','버스 정비소 야간 경비가 사고 차량 블랙박스를 몰래 빼돌렸다는 소문. "필요할 사람이 있다"고만 했다.']},recall:'七齋 블랙박스 영상'},
        hold:{label:'보류 — 카드는 보관함으로',echo:{news:['블랙박스 행방','경찰, 사고 차량 블랙박스 "어딘가 남아 있을 것".']},recall:'七齋 블랙박스 영상'},
        hell:{label:'지옥 — 규정대로',echo:{news:['폐기된 증거','사고 차량 블랙박스 원본 행방불명. 경찰은 "복구 불가"로 결론.']},recall:'흑이 카드를 줍는다'}}},
 {id:'c_choi',day:1,q:'흑이 미리 봐 둔 최만석의 서류',
  opts:{take:{label:'천국 — 흑의 뜻대로 (+30냥)',echo:{news:['○○건설 회장 장례','성대한 장례. 제사상 규모가 화제가 됐다.']},recall:'흑 「쓸 만함」'},
        refuse:{label:'거절 — 보류/지옥',echo:{news:['○○건설 의혹','회장 사후에 시주 영수증이 발행됐다는 의혹.']},recall:'흑의 감시 시작'}}},
 {id:'c_jh',day:2,q:'딸 수술비를 위해 공금에 손댄 박정호',
  opts:{mercy:{label:'용서 — 천국/환생',echo:{news:['소아병동 퇴원','박지은(9) 양 퇴원. 병실 벽에는 아빠 사진이 붙어 있었다.']},recall:'六齋 흑 「나한테도 그렇게 해 줄 거냐」 · 七齋 「놓아준 손」'},
        hell:{label:'지옥 — 죄는 죄',echo:{news:['횡령 회사원의 딸','박지은(9) 양은 아빠 사진을 서랍 깊이 넣었다고 한다.']},recall:'六齋 흑 「그럼 나도 지옥이겠네」 · 七齋 「지옥으로 보낸 손」'},
        hold:{label:'보류 — 판단하지 않는다',echo:{news:['대기실의 회사원','저승 대기실에 자수서를 든 남자가 앉아 있다.']},recall:'六齋 흑 「너도 못 정했구나」'}}},
 {id:'c_time',day:2,q:'흑이 막아 둔 한서진의 사망시각',need:{case:'sj',stm:'s3'},
  opts:{fix:{label:'정정한다 — 흑과 첫 충돌',echo:{news:['정정 통보','"현장에서 바로 숨졌다"는 통보를 받은 한서진 양의 어머니는 그날 처음 울었다고 한다. "아프진 않았겠구나."']},recall:'정정 기록 → 六齋 고발 근거'},
        silent:{label:'넘어간다 — 메모대로',echo:{news:['응급실 앞의 어머니','"병원 가는 길에 숨졌다"는 기록. 한서진 양의 어머니는 지금도 매일 밤 그 응급실 앞에 앉아 있다.']},recall:'흑 「알고도 넘어감」'},
        unknown:{label:'(조작을 몰랐다)',echo:{news:['응급실 앞의 어머니','"병원 가는 길에 숨졌다"는 기록. 한서진 양의 어머니는 지금도 매일 밤 그 응급실 앞에 앉아 있다.']},recall:'흑 「눈치 못 챔」'}}},
 {id:'c_fare',day:3,q:'조서에 기사의 「웃돈」을 적을 것인가',need:{summary:3},
  opts:{record:{label:'그대로 적는다',echo:{news:['웃돈','"기사가 막차 뒤 웃돈 받고 태웠다" 보도. 유족 측 반발.']},recall:'七齋 자백 장면'},
        erase:{label:'지운다 — 기사를 감싼다',echo:{news:['막차 기사 미담','"막차 놓친 승객을 태워 준 기사" 미담 기사. 웃돈 얘기는 어디에도 없다.']},recall:'七齋 자백 장면'},
        unknown:{label:'(웃돈을 몰랐다)',echo:{news:['막차 이후','"그날 3번 버스는 막차 이후에도 운행했다" 주민 증언.']},recall:'흑 「조서도 못 씀」'}}},
 {id:'c_tae',day:4,q:'흑이 「위에서 내려온 건」이라 한 강태준',
  opts:{heaven:{label:'천국 — 흑과 거래 (+50냥)',echo:{news:['재벌 2세 기부','강모 씨 명의 장학재단 10억 기부. 미담으로 보도.']},recall:'증인 강태준 소멸'},
        hold:{label:'보류 — 대기실에 붙잡아 둔다',echo:{news:['재수사 청원','유족들 "조수석 승객이 핸들을 잡았다" 재수사 청원.']},recall:'七齋 강태준 소환'},
        hell:{label:'지옥 — 조작 증거와 함께',echo:{news:['○○그룹 압수수색','사고 은폐 의혹으로 그룹 본사 압수수색.']},recall:'七齋 강태준 소환'}}},
 {id:'c_drawer',day:5,q:'비어 있는 흑의 서랍',
  opts:{open:{label:'몰래 연다',echo:{scene:'六齋 흑 「서랍 뒤졌더라」'},recall:'노선표 → 七齋 「전례 없음」 반박 · 六齋 고발 근거'},
        leave:{label:'건드리지 않는다',echo:{scene:'六齋 흑이 아무렇지 않게 출근한다'},recall:'흑의 정체를 본인에게 듣는다'}}},
 {id:'c_tell',day:5,q:'연이에게 「버스 아저씨」 얘기를 할 것인가',need:{case:'ms',stm:'s2'},
  opts:{tell:{label:'말한다 — 더 기다리지 않게',echo:{news:['3번 버스 종점','누군가 종점 벤치에 귤 한 봉지를 두고 갔다.']},recall:'연이가 먼저 문을 연다'},
        hide:{label:'말하지 않는다 — 곁에 둔다',echo:{news:['3번 버스 종점','종점 벤치는 오늘도 비어 있다.']},recall:'연이가 함께 가자고 한다'},
        unknown:{label:'(알아채지 못했다)',echo:{news:['3번 버스 종점','노선이 폐지된다는 소문이 돈다.']},recall:'七齋에 염라에게서 처음 듣는다'}}},
 {id:'c_heuk',day:6,q:'흑의 제안',
  opts:{report:{label:'고발한다',need:{any:[{c_time:'fix'},{c_drawer:'open'}]},echo:{scene:'七齋 아침 흑의 책상이 비어 있다'},recall:'자백하면 흑의 조작도 함께 드러난다'},
        deal:{label:'거래한다 — 명부에서 「웃돈」을 지운다',echo:{scene:'흑이 당신 명부의 한 줄을 지운다'},recall:'엔딩 「공범」'},
        silent:{label:'대답하지 않는다',echo:{scene:'흑 「내일 보자」'},recall:'흑은 끝까지 방청석에 있다'}}}
],

ESCORT:{
 'dog:*':{pose:'crouch',line:'이놈, 아직도 누굴 기다리네.',prio:1},
 'gm:천국':{pose:'back',line:'좋은 데 가시네요. …그 버스 기사도 그리 갔으면 좋았을 텐데.',prio:4},
 'gm:*':{pose:'back',line:'할머니, 그 버스 이제 안 다녀요.',prio:4},
 'con:지옥':{pose:'crouch',line:'(바닥에 떨어진 메모리카드를 주워 품에 넣는다)',prio:3},
 'con:보류':{pose:'back',line:'보관함? …쓸데없는 데 신경 쓰네.',prio:3},
 'con:*':{pose:'turn',line:'(카드를 쥔 손을 한참 내려다본다)',prio:3},
 'choi:천국':{pose:'turn',line:'회장님, 이쪽입니다. (신입에게 눈짓)',prio:7},
 'choi:*':{pose:'grip',line:'신입이 아직 뭘 몰라서요.',prio:7},
 'jh:지옥':{pose:'grip',line:'…애 병원비였다며. 그래도 규정은 규정이지.',prio:2},
 'jh:보류':{pose:'back',line:'못 정하겠지. 나도 그랬어.',prio:2},
 'jh:*':{pose:'back',line:'따님 수술은 잘 끝났답니다. …저도 그런 날이 있었죠.',prio:2},
 'sj:fix':{pose:'turn',line:'…시각을 고쳤더라. 부지런하네.',prio:5},
 'sj:*':{pose:'back',line:'다음엔 막차 놓치지 마라.',prio:5},
 'dy:지옥':{pose:'grip',line:'규정은 규정이지.',prio:6},
 'dy:천국':{pose:'back',line:'애 하나 살렸다며. …좋은 데 가. 핸들 꺾은 값이야.',prio:6},
 'sj:천국':{pose:'back',line:'다음 생은 없겠네. …막차 걱정도 없겠다.',prio:5},
 'gm:보류':{pose:'back',line:'기사 찾으면 알려 드릴게요. …찾을 수 있으면.',prio:4},
 'dy:*':{pose:'back',line:'다음 생엔 천천히 다녀. …핸들 꺾을 일 없게.',prio:6},
 'hk:*':{pose:'back',line:'자, 웃돈 내신 분들 이쪽.',prio:8},
 'jt:천국':{pose:'turn',line:'형사 양반, 오랜만이오. …이번엔 좋은 데로 모시지.',prio:3},
 'jt:*':{pose:'grip',line:'형사 양반, 오랜만이오.',prio:3},
 'tae:천국':{pose:'turn',line:'아버님이 안부 전하시더라.',prio:9},
 'tae:*':{pose:'grip',line:'입 다물어.',prio:9},
 'ws:*':{pose:'msgr',line:'(처음 보는 사자가 말없이 데려간다. 방울이 흔들린다.)'},
 'ms:*':{pose:'msgr',line:'(처음 보는 사자가 말없이 데려간다. 흑의 자리가 비어 있다.)'}
},

ACTS:{'起':[1],'承':[2,3,4,5],'轉':[6],'結':[7]},
BEATS:[
 {day:1,kind:'갈고리',i:3,d:'백지 명부 — 운전자가 없다'},
 {day:1,kind:'씨앗',i:2,d:'복실이의 수술 예약 — 보호자 이○○, 수술비 미납'},
 {day:2,kind:'감정',i:4,d:'서진 엄마의 문자 — 「오늘도 여기 있어」'},
 {day:2,kind:'거울',i:3,d:'딸 수술비를 훔친 아버지 — 흑의 그림자'},
 {day:3,kind:'거울',i:3,d:'아이를 피해 핸들을 꺾은 배달 기사 — 「기억이 안 나요」'},
 {day:3,kind:'도덕',i:4,d:'남의 조서에 「웃돈」을 적을 것인가'},
 {day:4,kind:'재구성',i:4,d:'그날 밤을 손으로 순서대로 놓는다'},
 
 {day:5,kind:'씨앗',i:4,d:'연이 앞에서만 울리지 않는 방울'},
 {day:5,kind:'반전',i:4,d:'8세 여아는 명부에 없다'},
 {day:5,kind:'도덕',i:4,d:'아이에게 떠날 수 있다고 말할 것인가'},
 {day:4,kind:'씨앗',i:3,d:'1996 생존자 — 막차 놓친 고3 이○○'},
 {day:6,kind:'반전',i:5,d:'백지에 번지는 李無名 — 내가 기사였다 · 복실이의 주인'},
 {day:6,kind:'반전',i:5,d:'흑도 30년 전 같은 봉투를 받았다'},
 {day:6,kind:'반전',i:5,d:'흑이 그날 살린 학생이 나였다 — 그리고 흑이 나를 팔았다'},
 {day:6,kind:'도덕',i:5,d:'흑을 고발할 것인가, 함께 덮을 것인가'},
 {day:7,kind:'회수',i:5,d:'흑의 말들을 다시 듣는다 — 같은 문장이 다르게 들린다'},
 {day:7,kind:'도덕',i:5,d:'자백 — 복실이 수술비, 내 손으로 내 죄를'},
 {day:7,kind:'반전',i:5,d:'연이는 살아 있다 · 그 목소리는 연이 엄마'},
 {day:7,kind:'회수',i:5,d:'그 손들은 모두, 그날 밤의 나였다'},
 {day:7,kind:'감정',i:5,d:'핸들을 놓던 손으로, 연이의 손을 놓는다'},
 {day:7,kind:'감정',i:5,d:'당신이 보낸 영혼들 — 일곱 날의 도장이 한 장에'}
],
NEW_MECH:{1:['진술 반박','desk'],2:['휴대전화','phoneDilemma'],3:['대질','confront'],4:['타임라인','timelineScreen'],5:['방울 듣기','bellListen'],7:['놓는 손','holdScene']},
MOTIFS:[
 {word:'귤',plant:1,pay:7},
 {word:'방울',plant:5,pay:7},
 {word:'토끼',plant:2,pay:7},
 {word:'핸들',plant:3,pay:7},
 {word:'봉투',plant:5,pay:6},
 {word:'술 한 방울',plant:1,pay:7}
],
/* 음악 라이트모티프 — 검증기가 읽는다 */
MUSIC:{
 scale:{minor:[57,60,62,64,67,69,72,74,76,79,81],major:[57,59,61,64,66,69,71,73,76,78,81]},
 themes:{
  main:[[69,1],[72,1],[74,2],[76,1],[74,1],[72,2],[69,3],[0,1],[67,1],[69,1],[72,2],[69,4]],
  yeoni:[[81,1],[79,1],[76,2],[74,1],[76,1],[79,2],[76,1],[74,1],[72,1],[74,1],[76,4]],
  yeoniMajor:[[81,1],[78,1],[76,2],[73,1],[76,1],[78,2],[76,1],[73,1],[71,1],[73,1],[76,4]]
 },
 scenes:{title:['main','minor'],wait:['yeoni','minor'],mirror:['main','minor'],hospital:['yeoniMajor','major'],night:['yeoni','minor']}
}
};
if(typeof module!=='undefined')module.exports=DATA;
