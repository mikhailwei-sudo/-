/* Great Tea Road | editorial museum homepage. No character/game assets changed. */
(() => {
'use strict';
if (document.getElementById('teaEditorialHome')) return;
const entries = [
  {key:'route',url:'#route-map',img:'v4/assets/refs/loc/route-04.webp',icon:'⌁'},
  {key:'museum',url:'v4/experience.html#museum',img:'CMIT2026_submission/site-design-qa/05_museum.png',icon:'▤'},
  {key:'culture',url:'culture-dialogue.html',img:'v4/assets/refs/r1-chest-01.jpg',icon:'◎'},
  {key:'games',url:'tea-adventure.html',img:'CMIT2026_submission/caravan-qa/02_third_game_after_skip.png',icon:'◇'},
  {key:'dictionary',url:'tea-dictionary.html',img:'CMIT2026_submission/site-design-qa/10_dictionary.png',icon:'▣'}
];
const nav = [
 {key:'home',url:'index.html'}, {key:'route',url:'#route-map'},
 {key:'museum',url:'v4/experience.html#museum'}, {key:'culture',url:'culture-dialogue.html'},
 {key:'games',url:'tea-adventure.html'}, {key:'dictionary',url:'tea-dictionary.html'},
 {key:'archive',url:'v4/collection.html'}
];
const copy = {
zh:{
brand:'万里茶道',brandSub:'跨文化数字文旅体验平台',
home:'首页',route:'茶道路线',museum:'3D博物馆',culture:'文化对话',games:'互动游戏',dictionary:'茶路词典',archive:'史料档案',
eyebrow:'中国 · 蒙古 · 俄罗斯',title:'万里茶道',titleSub:'跨文化数字文旅体验平台',
description:'以茶贸易为纽带，连接中国、蒙古与俄罗斯。沿着历史商路，探索器物、旅程与不同文化的交流。',
primary:'开始探索',secondary:'进入3D博物馆',mapAlt:'万里茶道三地文化交流示意图',mapNote:'文化交流示意 · 非精确历史路线',
country1:'中国',country2:'蒙古',country3:'俄罗斯',
routeDesc:'沿着历史商路，认识茶叶贸易的旅程。',
museumDesc:'走进虚拟展厅，了解器物与史料。',
cultureDesc:'从一杯茶理解中俄饮茶传统。',
gamesDesc:'体验采集、包装与商队运输。',
dictionaryDesc:'中俄英词汇、语音与记忆卡片。',
cultureTitle:'从一片茶叶，看见三地文化的交流',
cultureSubtitle:'Cultural Exchange through Tea',
cultureIntro:'一个商品在跨境流动中，如何连接不同的生活方式？',
step1:'中国 · 制茶与贸易',step1Desc:'从茶叶生产到压制与外销。',
step2:'蒙古 · 商队与道路',step2Desc:'跨越草原的运输与语言接触。',
step3:'俄罗斯 · 饮茶与生活',step3Desc:'融入家庭、社交与地方习惯。',
cultureCta:'体验跨文化对话',source:'历史图片与数字复原在各展品中分别标注来源',menu:'打开菜单',closeMenu:'关闭菜单',imageFallback:'图片暂时无法显示'
},
ru:{
brand:'Великий чайный путь',brandSub:'Цифровое культурное наследие',
home:'Главная',route:'Маршрут',museum:'3D-музей',culture:'Диалог культур',games:'Игры',dictionary:'Словарь',archive:'Архив',
eyebrow:'КИТАЙ · МОНГОЛИЯ · РОССИЯ',title:'Великий чайный путь',titleSub:'Цифровое путешествие через культуры',
description:'Чайная торговля связывала Китай, Монголию и Россию. Исследуйте исторический путь, предметы материальной культуры и традиции разных народов.',
primary:'Исследовать маршрут',secondary:'Войти в 3D-музей',mapAlt:'Схематическое изображение культурных связей вдоль Чайного пути',mapNote:'Иллюстрация культурных связей, не точная историческая карта',
country1:'Китай',country2:'Монголия',country3:'Россия',
routeDesc:'Исторические пути, города и торговля чаем.',
museumDesc:'Виртуальные залы, экспонаты и документы.',
cultureDesc:'Как китайский чай повлиял на русские традиции.',
gamesDesc:'Сбор чая, упаковка и караванная дорога.',
dictionaryDesc:'Три языка, произношение и карточки.',
cultureTitle:'Один чайный лист объединяет три культуры',
cultureSubtitle:'Cultural Exchange through Tea',
cultureIntro:'Как движение товаров меняет привычки и традиции?',
step1:'Китай · Производство',step1Desc:'Чай, его обработка и дальняя торговля.',
step2:'Монголия · Караваны',step2Desc:'Транспорт, торговые контакты и языки.',
step3:'Россия · Традиции',step3Desc:'Чай, гостеприимство и домашняя культура.',
cultureCta:'Сравнить чайные традиции',source:'Исторические изображения и цифровые модели имеют отдельные сведения об источниках',menu:'Открыть меню',closeMenu:'Закрыть меню',imageFallback:'Изображение недоступно'
},
en:{
brand:'Great Tea Road',brandSub:'Cross-cultural digital heritage',
home:'Home',route:'Tea Route',museum:'3D Museum',culture:'Cultural Dialogue',games:'Games',dictionary:'Dictionary',archive:'Archive',
eyebrow:'CHINA · MONGOLIA · RUSSIA',title:'The Great Tea Road',titleSub:'A Digital Journey Across Cultures',
description:'Tea trade connected China, Mongolia and Russia. Explore the historic routes, museum objects and cultural traditions that emerged along the way.',
primary:'Explore the route',secondary:'Enter the 3D Museum',mapAlt:'Illustrative diagram of cultural connections along the Great Tea Road',mapNote:'Illustrative cultural route, not a precise historical map',
country1:'China',country2:'Mongolia',country3:'Russia',
routeDesc:'Historic roads, towns and tea trade.',
museumDesc:'Virtual galleries, objects and archival evidence.',
cultureDesc:'How tea crossed cultural boundaries.',
gamesDesc:'Tea collecting, packing and caravan travel.',
dictionaryDesc:'Vocabulary, audio and multilingual flashcards.',
cultureTitle:'One Tea Leaf, Three Cultures in Dialogue',
cultureSubtitle:'Cultural Exchange through Tea',
cultureIntro:'How does trade influence everyday traditions?',
step1:'China · Tea Trade',step1Desc:'Tea processing, preparation and export.',
step2:'Mongolia · Caravans',step2Desc:'Travel, trade and contact across the steppe.',
step3:'Russia · Tea Culture',step3Desc:'Tea, hospitality and domestic traditions.',
cultureCta:'Explore the Cultural Dialogue',source:'Historical photographs and digital reconstructions are credited separately',menu:'Open navigation',closeMenu:'Close navigation',imageFallback:'Image unavailable'
}
};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const menuHtml=nav.map(n=>'<a href="'+n.url+'" data-editorial-text="'+n.key+'">'+copy.zh[n.key]+'</a>').join('');
const featureHtml=entries.map((c,i)=>
'<a class="eh-feature" href="'+c.url+'" data-e-feature="'+c.key+'">'+
 '<div class="eh-image"><img src="'+c.img+'" loading="lazy" alt="" decoding="async"></div>'+
 '<div class="eh-feature-copy"><span class="eh-feature-icon" aria-hidden="true">'+c.icon+'</span>'+
 '<div class="eh-feature-words"><h3 data-editorial-text="'+c.key+'">'+copy.zh[c.key]+'</h3>'+
 '<p data-editorial-text="'+c.key+'Desc">'+copy.zh[c.key+'Desc']+'</p></div>'+
 '<span class="eh-chevron" aria-hidden="true">›</span></div></a>').join('');
const stageHtml=[
 ['step1','v4/assets/refs/r1-teaset-01.jpg'],
 ['step2','v4/assets/refs/loc/route-04.webp'],
 ['step3','v4/assets/refs/r4-samovar-01.jpg']
].map(([key,src],i)=>
'<article class="eh-culture-step"><img src="'+src+'" alt="" loading="lazy">'+
 '<div><h3 data-editorial-text="'+key+'">'+copy.zh[key]+'</h3>'+
 '<p data-editorial-text="'+key+'Desc">'+copy.zh[key+'Desc']+'</p></div></article>'+
 (i===2?'':'<span class="eh-step-arrow" aria-hidden="true">→</span>')).join('');
const el=document.createElement('div');
el.id='teaEditorialHome';
el.className='eh-home';
el.innerHTML=
'<a class="eh-skip" href="#route-map" data-editorial-text="primary">开始探索</a>'+
'<header class="eh-topbar"><a href="index.html" class="eh-brand"><span class="eh-logo" aria-hidden="true">❧</span><span><strong data-editorial-text="brand">万里茶道</strong><small data-editorial-text="brandSub">跨文化数字文旅体验平台</small></span></a>'+
 '<nav class="eh-nav" id="eh-nav" aria-label="Main navigation">'+menuHtml+'</nav>'+
 '<div class="eh-language" role="group" aria-label="Language"><button type="button" data-eh-lang="zh" aria-pressed="true">中</button><button type="button" data-eh-lang="ru" aria-pressed="false">RU</button><button type="button" data-eh-lang="en" aria-pressed="false">EN</button></div>'+
 '<button class="eh-menu-toggle" type="button" aria-controls="eh-nav" aria-expanded="false" aria-label="打开菜单"><span class="eh-menu-lines"></span></button></header>'+
'<main class="eh-shell">'+
'<section class="eh-hero" aria-labelledby="eh-title">'+
 '<div class="eh-hero-copy"><p class="eh-eyebrow" data-editorial-text="eyebrow">中国 · 蒙古 · 俄罗斯</p>'+
 '<h1 id="eh-title" data-editorial-text="title">万里茶道</h1>'+
 '<h2 data-editorial-text="titleSub">跨文化数字文旅体验平台</h2>'+
 '<span class="eh-hero-rule" aria-hidden="true"></span>'+
 '<p class="eh-description" data-editorial-text="description">以茶贸易为纽带，连接中国、蒙古与俄罗斯。沿着历史商路，探索器物、旅程与不同文化的交流。</p>'+
 '<div class="eh-hero-buttons"><a class="eh-btn eh-btn-primary" href="#route-map" data-editorial-text="primary">开始探索</a>'+
 '<a class="eh-btn eh-btn-ghost" href="v4/experience.html#museum" data-editorial-text="secondary">进入3D博物馆</a></div></div>'+
 '<div class="eh-hero-art" aria-label="Tea trade illustration">'+
  '<div class="eh-map-illustration" role="img" aria-label="茶路文化交流示意图">'+
  '<svg viewBox="0 0 780 425" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'+
   '<defs><pattern id="eh-map-grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M38 0H0V38" fill="none" stroke="#76664a" stroke-opacity=".20" stroke-width=".8"/></pattern></defs>'+
   '<path d="M41 166 C107 125 161 210 218 149S337 110 389 144 S503 85 557 119 S673 33 744 61" fill="none" stroke="#5b523b" stroke-width="4" stroke-opacity=".8"/>'+
   '<path d="M41 166 C107 125 161 210 218 149S337 110 389 144 S503 85 557 119 S673 33 744 61" fill="none" stroke="#f0d19a" stroke-width="2.4" stroke-dasharray="5 7"/>'+
   '<path d="M0 229Q70 167 137 226T263 210T389 223T527 178T699 199L780 179" fill="none" stroke="#b1a17f" stroke-opacity=".32" stroke-width="1.5"/>'+
   '<path d="M0 263Q70 201 137 260T263 244T389 257T527 212T699 233L780 213" fill="none" stroke="#b1a17f" stroke-opacity=".32" stroke-width="1.5"/>'+
   '<path d="M0 301Q70 239 137 298T263 282T389 295T527 250T699 271L780 251" fill="none" stroke="#b1a17f" stroke-opacity=".32" stroke-width="1.5"/>'+
   '<g fill="#efcc86" stroke="#253b32" stroke-width="3"><circle cx="218" cy="149" r="9"/><circle cx="389" cy="144" r="9"/><circle cx="673" cy="73" r="9"/></g>'+
  '</svg>'+
  '<span class="eh-map-label eh-map-china" data-editorial-text="country1">中国</span>'+
  '<span class="eh-map-label eh-map-mongolia" data-editorial-text="country2">蒙古</span>'+
  '<span class="eh-map-label eh-map-russia" data-editorial-text="country3">俄罗斯</span>'+
  '</div>'+
  '<figure class="eh-artwork eh-artwork-archive"><img src="v4/assets/refs/loc/route-04.webp" alt="" fetchpriority="high" decoding="async"><figcaption>万里茶道 · 历史影像</figcaption></figure>'+
  '<figure class="eh-artwork eh-artwork-tea"><img src="v4/assets/refs/r1-teaset-01.jpg" alt="" decoding="async"></figure>'+
  '<figure class="eh-artwork eh-artwork-vessel"><img src="v4/assets/refs/r4-samovar-01.jpg" alt="" decoding="async"></figure>'+
  '<div class="eh-map-note" data-editorial-text="mapNote">文化交流示意 · 非精确历史路线</div>'+
 '</div></section>'+
'<section class="eh-feature-band" aria-label="Explore Great Tea Road"><div class="eh-feature-grid">'+featureHtml+'</div></section>'+
'<section class="eh-culture" aria-labelledby="eh-culture-title">'+
 '<div class="eh-culture-heading"><h2 id="eh-culture-title" data-editorial-text="cultureTitle">从一片茶叶，看见三地文化的交流</h2>'+
 '<p class="eh-culture-english" data-editorial-text="cultureSubtitle">Cultural Exchange through Tea</p>'+
 '<p class="eh-culture-intro" data-editorial-text="cultureIntro">一个商品在跨境流动中，如何连接不同的生活方式？</p></div>'+
 '<div class="eh-culture-flow">'+stageHtml+'</div>'+
 '<div class="eh-culture-action"><a href="culture-dialogue.html" data-editorial-text="cultureCta">体验跨文化对话</a></div>'+
 '</section><p class="eh-source" data-editorial-text="source">历史图片与数字复原在各展品中分别标注来源</p>'+
 '</main>';
document.body.prepend(el);
let current='zh';
function setLanguage(lang,notifyLegacy=true){
 if(!copy[lang])lang='zh';current=lang;
 document.documentElement.lang=lang;
 el.querySelectorAll('[data-editorial-text]').forEach(item=>{
  const value=copy[lang][item.dataset.editorialText];if(value)item.textContent=value;
 });
 el.querySelectorAll('[data-eh-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ehLang===lang)));
 const map=el.querySelector('.eh-map-illustration');
 map.setAttribute('aria-label',copy[lang].mapAlt);
 const toggle=el.querySelector('.eh-menu-toggle');toggle.setAttribute('aria-label',copy[lang][el.classList.contains('eh-menu-open')?'closeMenu':'menu']);
 document.title=copy[lang].title+' | Great Tea Road';
 try{localStorage.setItem('gtr-lang',lang);sessionStorage.setItem('teaAdventureLanguage',lang)}catch(_e){}
 if(notifyLegacy){
  const existing=document.querySelector('body > header .lang [data-lang="'+lang+'"]');
  if(existing&&existing.getAttribute('aria-pressed')!=='true')existing.click();
 }
}
function closeMenu(){
 el.classList.remove('eh-menu-open');
 const t=el.querySelector('.eh-menu-toggle');t.setAttribute('aria-expanded','false');t.setAttribute('aria-label',copy[current].menu);
}
el.addEventListener('click',event=>{
 const l=event.target.closest('[data-eh-lang]');
 if(l){setLanguage(l.dataset.ehLang);closeMenu();return}
 const b=event.target.closest('.eh-menu-toggle');
 if(b){
  const open=el.classList.toggle('eh-menu-open');
  b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',copy[current][open?'closeMenu':'menu']);
  return;
 }
 if(event.target.closest('.eh-nav a'))closeMenu();
});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
document.addEventListener('click',event=>{if(!event.target.closest('#teaEditorialHome .eh-topbar'))closeMenu()});
document.querySelectorAll('body > header .lang [data-lang]').forEach(b=>b.addEventListener('click',()=>{if(current!==b.dataset.lang)setLanguage(b.dataset.lang,false)}));
el.querySelectorAll('.eh-image img,.eh-artwork img,.eh-culture-step img').forEach(img=>{
 img.addEventListener('error',()=>{img.closest('.eh-image,.eh-artwork,.eh-culture-step')?.classList.add('eh-image-missing')},{once:true});
});
let lang='zh';
try{lang=localStorage.getItem('gtr-lang')||'zh'}catch(_e){}
const query=new URLSearchParams(location.search);
if(copy[query.get('lang')])lang=query.get('lang');
setLanguage(lang,true);
})();