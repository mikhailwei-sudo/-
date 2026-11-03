/* 万里茶道 · one responsive first-concept design for every device and language.
   The picture is decorative; texts, links, buttons, menus are real HTML. */
(()=>{
'use strict';
if(document.getElementById('teaUnifiedHome'))return;
const I={
zh:{brand:'万里茶道',small:'TEA ROAD · 跨文化数字文旅',home:'首页',route:'路线',culture:'跨文化对话',museum:'3D博物馆',games:'互动游戏',dictionary:'三语词典',archive:'史料档案',eyebrow:'中国 · 蒙古 · 俄罗斯 ｜ 数字文化遗产体验',title:'万里茶道',subtitle:'跨文化数字文旅体验平台',lead:'见证中国—蒙古—俄罗斯的茶文化交流与文明互鉴',start:'开始探索',visit:'进入3D博物馆',ct1:'茶道路线',cd1:'追寻连接三地的历史商路',ct2:'跨文化对话',cd2:'同一片茶叶如何融入不同文化？',ct3:'3D博物馆',cd3:'沉浸参观历史器物与数字展厅',ct4:'互动游戏',cd4:'采茶、包装、商队运输，边玩边学',ct5:'三语词典',cd5:'中、俄、英词汇、发音与卡片练习',v1:'茶文化遗产数字化',v2:'跨文化交流与理解',v3:'沉浸式文旅体验',v4:'教育与科普资源',more:'继续探索历史资料',menu:'打开导航菜单',close:'关闭导航菜单',choose:'选择语言',skip:'跳转至历史路线'},
ru:{brand:'Великий чайный путь',small:'TEA ROAD · КУЛЬТУРНОЕ НАСЛЕДИЕ',home:'Главная',route:'Маршрут',culture:'Диалог культур',museum:'3D-музей',games:'Игры',dictionary:'Словарь',archive:'Архив',eyebrow:'КИТАЙ · МОНГОЛИЯ · РОССИЯ | ЦИФРОВОЕ НАСЛЕДИЕ',title:'Великий чайный путь',subtitle:'Путешествие через культуры',lead:'Исторические маршруты, музейные предметы, интерактивные игры и языковое обучение.',start:'Исследовать маршрут',visit:'Открыть 3D-музей',ct1:'Чайный путь',cd1:'Исторические торговые дороги трёх стран',ct2:'Диалог культур',cd2:'Один напиток — разные культурные традиции',ct3:'3D-музей',cd3:'Исторические предметы и цифровые залы',ct4:'Мини-игры',cd4:'Чайный лабиринт, мастерская и караван',ct5:'Словарь',cd5:'Русский, китайский, английский и карточки',v1:'Цифровое чайное наследие',v2:'Культурный обмен и понимание',v3:'Иммерсивный музей',v4:'Обучение и исследования',more:'Исторические материалы',menu:'Открыть меню',close:'Закрыть меню',choose:'Выбрать язык',skip:'Перейти к маршруту'},
en:{brand:'Great Tea Road',small:'TEA ROAD · DIGITAL CULTURAL HERITAGE',home:'Home',route:'Route',culture:'Cultural Dialogue',museum:'3D Museum',games:'Games',dictionary:'Dictionary',archive:'Archive',eyebrow:'CHINA · MONGOLIA · RUSSIA | DIGITAL HERITAGE',title:'Great Tea Road',subtitle:'A Cross-Cultural Digital Journey',lead:'Explore tea trade history through interactive routes, museum objects, games and languages.',start:'Explore the Route',visit:'Enter 3D Museum',ct1:'Trade Route',cd1:'Historic trade roads across three regions',ct2:'Cultural Dialogue',cd2:'How tea became part of different traditions',ct3:'3D Museum',cd3:'Explore heritage objects and digital galleries',ct4:'Interactive Games',cd4:'Tea maze, packaging workshop and caravan',ct5:'Dictionary',cd5:'Chinese, Russian and English flashcards',v1:'Digital Tea Heritage',v2:'Cross-Cultural Understanding',v3:'Immersive Experiences',v4:'Education and Research',more:'Continue Exploring History',menu:'Open Navigation',close:'Close Navigation',choose:'Choose Language',skip:'Skip to Route Content'}};
const NAV=[['home','index.html'],['route','#route-map'],['culture','culture-dialogue.html'],['museum','v4/experience.html#museum'],['games','tea-adventure.html'],['dictionary','tea-dictionary.html'],['archive','v4/collection.html']];
const CARDS=[
 ['route','#route-map','ct1','cd1','⌖'],
 ['culture','culture-dialogue.html','ct2','cd2','✧'],
 ['museum','v4/experience.html#museum','ct3','cd3','▣'],
 ['games','tea-adventure.html','ct4','cd4','✦'],
 ['dictionary','tea-dictionary.html','ct5','cd5','▤']];
const nav=NAV.map(x=>'<a href="'+x[1]+'" data-tl="'+x[0]+'">'+I.zh[x[0]]+'</a>').join('');
const cards=CARDS.map((x,i)=>'<a class="tuh-card tuh-card-'+x[0]+'" href="'+x[1]+'"><span class="tuh-card-art"><img src="assets/home-luxe-card-'+x[0]+'.webp" alt="" loading="lazy" decoding="async"></span><span class="tuh-card-copy"><span class="tuh-card-title"><span aria-hidden="true" class="tuh-card-symbol">'+x[4]+'</span><strong data-tl="'+x[2]+'">'+I.zh[x[2]]+'</strong></span><span class="tuh-card-desc" data-tl="'+x[3]+'">'+I.zh[x[3]]+'</span></span><span aria-hidden="true" class="tuh-card-arrow">↗</span></a>').join('');
const root=document.createElement('div');root.id='teaUnifiedHome';
root.innerHTML=[
'<a class="tuh-skip" href="#route-map" data-tl="skip">跳转至历史路线</a>',
'<header class="tuh-header"><div class="tuh-header-inner">',
'<a class="tuh-logo" href="index.html"><span class="tuh-logo-mark" aria-hidden="true">❧</span><span class="tuh-logo-type"><strong data-tl="brand">万里茶道</strong><small data-tl="small">TEA ROAD · 跨文化数字文旅</small></span></a>',
'<nav id="tuhMainMenu" class="tuh-menu" aria-label="网站导航">',nav,'</nav>',
'<div class="tuh-controls"><div class="tuh-languages" role="group" aria-label="选择语言">',
'<button type="button" data-tuh-lang="zh" aria-pressed="true" lang="zh">中</button>',
'<button type="button" data-tuh-lang="ru" aria-pressed="false" lang="ru">RU</button>',
'<button type="button" data-tuh-lang="en" aria-pressed="false" lang="en">EN</button>',
'</div><button class="tuh-menu-toggle" type="button" aria-label="打开导航菜单" aria-controls="tuhMainMenu" aria-expanded="false"><span class="tuh-bars" aria-hidden="true"><i></i><i></i><i></i></span></button></div>',
'</div></header>',
'<section class="tuh-hero" aria-labelledby="tuhTitle"><div class="tuh-art" aria-hidden="true">',
'<div class="tuh-art-left"></div><div class="tuh-art-right"></div>',
'<svg class="tuh-route-path" viewBox="0 0 1000 260" preserveAspectRatio="none"><path class="tuh-route-dash" d="M25 190C180 110 300 220 490 118S790 110 975 45"/><circle cx="25" cy="190" r="7"/><circle cx="490" cy="118" r="7"/><circle cx="975" cy="45" r="7"/></svg>',
'</div><div class="tuh-hero-inner"><span class="tuh-hero-eyebrow" data-tl="eyebrow">中国 · 蒙古 · 俄罗斯 ｜ 数字文化遗产体验</span>',
'<h1 id="tuhTitle"><span data-tl="title">万里茶道</span><small data-tl="subtitle">跨文化数字文旅体验平台</small></h1>',
'<p class="tuh-hero-lead" data-tl="lead">见证中国—蒙古—俄罗斯的茶文化交流与文明互鉴</p>',
'<div class="tuh-actions"><a class="tuh-button tuh-button-main" href="#route-map"><span aria-hidden="true">⌖</span><span data-tl="start">开始探索</span><span aria-hidden="true">›</span></a>',
'<a class="tuh-button tuh-button-museum" href="v4/experience.html#museum"><span aria-hidden="true">▣</span><span data-tl="visit">进入3D博物馆</span><span aria-hidden="true">›</span></a></div></div></section>',
'<section class="tuh-cards" aria-label="网站主要模块">',cards,'</section>',
'<div class="tuh-values"><span data-tl="v1">茶文化遗产数字化</span><span data-tl="v2">跨文化交流与理解</span><span data-tl="v3">沉浸式文旅体验</span><span data-tl="v4">教育与科普资源</span></div>',
'<div class="tuh-ornament" aria-hidden="true"></div><a class="tuh-more" href="#route-map" data-tl="more">继续探索历史资料</a>'
].join('');
document.body.insertBefore(root,document.body.firstChild);
const toggle=root.querySelector('.tuh-menu-toggle');
const choices=root.querySelectorAll('[data-tuh-lang]');
let current='zh';
function closeMenu(restore=false){root.classList.remove('tuh-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',I[current].menu);if(restore)toggle.focus();}
function chooseLanguage(lang,propagate=true){
 if(!Object.prototype.hasOwnProperty.call(I,lang))lang='zh';
 const t=I[lang];current=lang;document.documentElement.lang=lang;
 root.querySelectorAll('[data-tl]').forEach(el=>{const v=t[el.dataset.tl];if(typeof v==='string')el.textContent=v;});
 choices.forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.tuhLang===lang)));
 root.querySelector('.tuh-menu').setAttribute('aria-label',t.menu);
 root.querySelector('.tuh-languages').setAttribute('aria-label',t.choose);
 root.querySelector('.tuh-logo').setAttribute('aria-label',t.brand+' — '+t.home);
 toggle.setAttribute('aria-label',root.classList.contains('tuh-open')?t.close:t.menu);
 try{localStorage.setItem('gtr-lang',lang);sessionStorage.setItem('teaAdventureLanguage',lang)}catch(_){}
 if(propagate){
  const old=document.querySelector('body > header .lang [data-lang="'+lang+'"]');
  if(old && old.getAttribute('aria-pressed')!=='true') old.click();
 }
}
root.addEventListener('click',event=>{
 const language=event.target.closest('[data-tuh-lang]');
 if(language){chooseLanguage(language.dataset.tuhLang);closeMenu();return;}
 if(event.target.closest('.tuh-menu-toggle')){
  const on=!root.classList.contains('tuh-open');root.classList.toggle('tuh-open',on);
  toggle.setAttribute('aria-expanded',String(on));toggle.setAttribute('aria-label',I[current][on?'close':'menu']);return;
 }
 if(event.target.closest('#tuhMainMenu a'))closeMenu();
});
document.addEventListener('pointerdown',event=>{if(root.classList.contains('tuh-open')&&!event.target.closest('.tuh-header'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&root.classList.contains('tuh-open'))closeMenu(true);});
document.querySelectorAll('body > header .lang [data-lang]').forEach(btn=>btn.addEventListener('click',()=>{if(btn.dataset.lang!==current)chooseLanguage(btn.dataset.lang,false);}));
let initial='zh';try{initial=localStorage.getItem('gtr-lang')||'zh'}catch(_){}
const param=new URLSearchParams(location.search).get('lang');
chooseLanguage(I[param]?param:initial,false);
if(location.hash){
 try{const target=document.getElementById(decodeURIComponent(location.hash.substring(1)));if(target)requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}catch(_){}
}
})();