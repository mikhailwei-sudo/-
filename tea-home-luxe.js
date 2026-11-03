
/* 万里茶道: interactive first-concept landing. All game / mascot assets unchanged. */
(()=>{
'use strict';
if(document.getElementById('teaLuxeLanding'))return;
const T={
zh:{brand:'万里茶道',subtitle:'TEA ROAD · 跨文化数字文旅',home:'首页',route:'路线',culture:'跨文化对话',museum:'3D博物馆',games:'互动游戏',dictionary:'三语词典',archive:'史料档案',eyebrow:'中国 · 蒙古 · 俄罗斯 | 数字文化遗产体验',title:'万里茶道：',title2:'跨文化数字文旅体验平台',lead:'见证中国—蒙古—俄罗斯的茶文化交流与文明互鉴',start:'开始探索',visit:'进入3D博物馆',card1:'路线',card2:'跨文化对话',card3:'3D博物馆',card4:'互动游戏',card5:'三语词典',card1copy:'沿着万里茶道，走进连接三国的历史商路',card2copy:'同一片茶叶如何融入不同文化？',card3copy:'沉浸式观展，探索历史器物',card4copy:'采茶、包装、商队运输，边玩边学',card5copy:'中、俄、英茶文化词汇与卡片挑战',stat1:'茶文化遗产数字化',stat2:'跨文化交流与理解',stat3:'沉浸式文旅体验',stat4:'教育与科普资源',more:'继续探索历史资料',skip:'跳转至网站内容',langLabel:'切换语言'},
ru:{brand:'Великий чайный путь',subtitle:'TEA ROAD · КУЛЬТУРНОЕ НАСЛЕДИЕ',home:'Главная',route:'Маршрут',culture:'Диалог культур',museum:'3D-музей',games:'Игры',dictionary:'Словарь',archive:'Архив',eyebrow:'КИТАЙ · МОНГОЛИЯ · РОССИЯ | ЦИФРОВОЕ НАСЛЕДИЕ',title:'Великий чайный путь',title2:'Интерактивное путешествие через культуры',lead:'Торговый маршрут, виртуальный музей, три мини-игры и языковое обучение.',start:'Исследовать маршрут',visit:'Открыть 3D-музей',card1:'Маршрут',card2:'Диалог культур',card3:'3D-музей',card4:'Игры',card5:'Словарь',card1copy:'Исторические дороги трёх стран',card2copy:'Как чай менял разные традиции?',card3copy:'Исторические предметы и виртуальные залы',card4copy:'Лабиринт, чайная мастерская и караван',card5copy:'Русский, китайский, английский и карточки',stat1:'Цифровое наследие',stat2:'Диалог культур',stat3:'Виртуальный музей',stat4:'Языковое обучение',more:'Изучить исторические материалы',skip:'Перейти к содержанию',langLabel:'Выбрать язык'},
en:{brand:'Great Tea Road',subtitle:'TEA ROAD · CROSS-CULTURAL HERITAGE',home:'Home',route:'Route',culture:'Cultural Dialogue',museum:'3D Museum',games:'Games',dictionary:'Dictionary',archive:'Archive',eyebrow:'CHINA · MONGOLIA · RUSSIA | DIGITAL HERITAGE',title:'The Great Tea Road',title2:'A Cross-Cultural Digital Journey',lead:'Discover the tea trade through a virtual museum, interactive games and language learning.',start:'Explore the route',visit:'Enter the 3D Museum',card1:'The Route',card2:'Cultural Dialogue',card3:'3D Museum',card4:'Interactive Games',card5:'Dictionary',card1copy:'Historic trade roads connecting three countries',card2copy:'One tea leaf, many traditions',card3copy:'Explore artifacts and exhibition rooms',card4copy:'Tea maze, packaging workshop, caravan',card5copy:'Chinese, Russian, English and flashcards',stat1:'Digital Tea Heritage',stat2:'Cultural Exchange',stat3:'Immersive Museum',stat4:'Learning & Education',more:'Explore historical sources',skip:'Skip to site content',langLabel:'Choose language'}
};
const L={home:'index.html',route:'#route-map',culture:'culture-dialogue.html',museum:'v4/experience.html#museum',games:'tea-adventure.html',dictionary:'tea-dictionary.html',archive:'v4/collection.html',start:'#route-map',visit:'v4/experience.html#museum',card1:'#route-map',card2:'culture-dialogue.html',card3:'v4/experience.html#museum',card4:'tea-adventure.html',card5:'tea-dictionary.html'};
const zones=[
['home',502,0,104,63],['route',607,0,107,63],['culture',714,0,158,63],['museum',872,0,150,63],['games',1024,0,146,63],['dictionary',1170,0,139,63],['archive',1309,0,142,63],
['start',522,337,266,82],['visit',805,337,317,82],['card1',46,501,320,297],['card2',376,501,303,297],['card3',690,501,303,297],['card4',1000,501,300,297],['card5',1308,501,310,297]
];
const pct=(x,total)=>(x*100/total).toFixed(4)+'%';
const keys=['home','route','culture','museum','games','dictionary','archive'];
const cards=['route','culture','museum','games','dictionary'];
const pics=['v4/assets/refs/loc/route-03.webp','v4/assets/refs/r1-teaset-01.jpg','v4/assets/refs/loc/museum-03.webp','game-assets/tea-garden-tiles.png','v4/assets/refs/r3-documents-01.jpg'];
const langBtns=()=>['zh','ru','en'].map(x=>'<button type="button" data-tl-lang="'+x+'" aria-pressed="false">'+(x==='zh'?'中':x.toUpperCase())+'</button>').join('');
const aZones=zones.map(z=>'<a class="tl-zone" href="'+L[z[0]]+'" data-tl-link="'+z[0]+'" aria-label="'+(T.zh[z[0]]||z[0])+'" style="--x:'+pct(z[1],1672)+';--y:'+pct(z[2],941)+';--w:'+pct(z[3],1672)+';--h:'+pct(z[4],941)+'"></a>').join('');
const nav=keys.map(k=>'<a href="'+L[k]+'" data-tl="'+k+'">'+T.zh[k]+'</a>').join('');
const cardsHtml=cards.map((key,i)=>'<a class="tl-card" href="'+L[key]+'"><img src="'+pics[i]+'" alt="" loading="lazy"><div class="tl-card-details"><h3 data-tl="card'+(i+1)+'">'+T.zh['card'+(i+1)]+'</h3><p data-tl="card'+(i+1)+'copy">'+T.zh['card'+(i+1)+'copy']+'</p></div><span class="tl-arrow">↗</span></a>').join('');
const el=document.createElement('section');el.id='teaLuxeLanding';el.className='tl-home';
el.innerHTML=[
'<a class="tl-skip" data-tl="skip" href="#route-map">跳转至网站内容</a>',
'<div class="tl-poster"><img class="tl-poster-art" src="assets/home-luxe-first-design.avif" alt="万里茶道：金色历史路线、茶砖、商队、俄罗斯茶炊及网站功能" width="1672" height="941" fetchpriority="high"><div class="tl-clickzones">',aZones,'</div>',
'<div class="tl-poster-language"><button class="tl-language-toggle" type="button" aria-label="切换语言" aria-expanded="false">中 ⌄</button><div class="tl-language-options" hidden>',langBtns(),'</div></div></div>',
'<div class="tl-responsive"><header class="tl-nav"><a class="tl-brand" href="index.html"><span class="tl-brand-mark">❧</span><span><b data-tl="brand">万里茶道</b><small data-tl="subtitle">TEA ROAD</small></span></a><nav class="tl-nav-links" aria-label="Navigation">',nav,'</nav><button class="tl-menu-toggle" type="button" aria-expanded="false" aria-label="Menu">☰</button><div class="tl-languages">',langBtns(),'</div></header>',
'<section class="tl-lead"><p class="tl-eyebrow" data-tl="eyebrow">中国 · 蒙古 · 俄罗斯</p><h1><span data-tl="title">万里茶道：</span><small data-tl="title2">跨文化数字文旅体验平台</small></h1><p class="tl-lead-copy" data-tl="lead">见证中国—蒙古—俄罗斯的茶文化交流与文明互鉴</p><div class="tl-actions"><a class="tl-primary" href="#route-map" data-tl="start">开始探索</a><a class="tl-secondary" href="v4/experience.html#museum" data-tl="visit">进入3D博物馆</a></div></section>',
'<div class="tl-cards">',cardsHtml,'</div><div class="tl-values">',['stat1','stat2','stat3','stat4'].map(k=>'<span data-tl="'+k+'">'+T.zh[k]+'</span>').join(''),'</div>',
'<a class="tl-more" href="#route-map" data-tl="more">继续探索历史资料</a></div>'
].join('');
document.body.insertAdjacentElement('afterbegin',el);
let current='zh';
function setLanguage(lang,propagate=true){
 lang=T[lang]?lang:'zh';current=lang;document.documentElement.lang=lang;
 el.classList.toggle('tl-alt',lang!=='zh');
 el.querySelectorAll('[data-tl]').forEach(n=>{let k=n.dataset.tl;if(T[lang][k])n.textContent=T[lang][k]});
 el.querySelectorAll('[data-tl-link]').forEach(n=>{let k=n.dataset.tlLink;n.setAttribute('aria-label',T[lang][k]||k)});
 el.querySelectorAll('[data-tl-lang]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.tlLang===lang)));
 el.querySelector('.tl-language-toggle').textContent=(lang==='zh'?'中':lang.toUpperCase())+' ⌄';
 el.querySelector('.tl-language-toggle').setAttribute('aria-label',T[lang].langLabel);
 try{localStorage.setItem('gtr-lang',lang);sessionStorage.setItem('teaAdventureLanguage',lang)}catch(_e){}
 if(propagate){const old=document.querySelector('body > header .lang [data-lang="'+lang+'"]');if(old&&old.getAttribute('aria-pressed')!=='true')old.click();}
}
el.addEventListener('click',e=>{
 const lang=e.target.closest('[data-tl-lang]');
 if(lang){setLanguage(lang.dataset.tlLang);el.querySelector('.tl-language-options').hidden=true;el.querySelector('.tl-language-toggle').setAttribute('aria-expanded','false');return;}
 const menu=e.target.closest('.tl-menu-toggle');
 if(menu){const expanded=el.classList.toggle('tl-menu-open');menu.setAttribute('aria-expanded',String(expanded));return;}
 if(e.target.closest('.tl-nav-links a'))el.classList.remove('tl-menu-open');
 const toggle=e.target.closest('.tl-language-toggle');
 if(toggle){const option=el.querySelector('.tl-language-options');option.hidden=!option.hidden;toggle.setAttribute('aria-expanded',String(!option.hidden));}
});
document.addEventListener('click',e=>{if(!e.target.closest('#teaLuxeLanding .tl-poster-language')){el.querySelector('.tl-language-options').hidden=true;el.querySelector('.tl-language-toggle').setAttribute('aria-expanded','false')}});
document.querySelectorAll('body > header .lang [data-lang]').forEach(n=>n.addEventListener('click',()=>{if(current!==n.dataset.lang)setLanguage(n.dataset.lang,false)}));
let start='zh';try{start=localStorage.getItem('gtr-lang')||'zh'}catch(_e){}
const query=new URLSearchParams(location.search);if(T[query.get('lang')])start=query.get('lang');
setLanguage(start,false);
})();