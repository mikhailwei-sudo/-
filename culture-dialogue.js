(() => {
'use strict';
const L={
zh:{
navHome:'首页',navMuseum:'3D展馆',navGames:'互动游戏',navDictionary:'三语词典',
eyebrow:'跨文化互动专题 · 中俄文化交流',title:'从一片茶叶，看见<br>两种文化的对话。',
intro:'茶叶不只是商品。它从中国出发，经过商队和边境贸易进入俄罗斯，也在不同社会中发展出独特的饮用方式。通过三件代表性器物，了解万里茶道如何连接不同文化。',
tagA:'文化路径',tagB:'文物与历史',tagC:'比较与理解',tagD:'中 · 俄 · 英',
pathKicker:'01 / 03 · 从生产到生活',pathTitle:'一片茶叶的跨文化旅程',pathIntro:'点击博物馆入口，可以深入观察相关展品；这里的历史图像与数字模型有不同的出处及性质。',
stage1:'砖茶：生产与贸易',stage1Text:'紧压茶便于储存与长途运输，体现中国制茶工艺如何适应远距离贸易。',
stage2:'商队：运输与接触',stage2Text:'路线连接商人、驿站与城市，茶叶流通也意味着不同语言和生活经验的交流。',
stage3:'茶炊：生活与再创造',stage3Text:'茶进入俄罗斯后逐渐融入当地家庭与社交生活，茶炊成为具有代表性的器物。',
compareKicker:'02 / 03 · 对照与理解',compareTitle:'同一种茶，不同的生活方式',
chinaKicker:'中国茶文化',chinaTitle:'重视茶叶、冲泡与品饮',chinaText:'不同地区的饮茶方式各有特色。茶叶、茶具与泡茶程序共同体现地方技艺与社交礼仪。',
russiaKicker:'俄罗斯茶文化',russiaTitle:'茶炊与家庭聚会',russiaText:'俄罗斯茶文化逐渐形成自己的器物、待客方式和家庭场景，与来自中国的茶叶贸易建立历史联系。',
commonTitle:'共同点 · ',commonText:'饮茶不仅满足日常需要，也常常承载待客、交流与共享时间的意义。',
quizKicker:'03 / 03 · 互动理解',quizTitle:'文化理解小挑战',question:'为什么说万里茶道不仅是一条商品运输路线？',
answer0:'因为茶叶只在中国使用',answer1:'因为贸易也促进器物、语言与习俗的相互接触',
correct:'回答正确。茶叶在中国生产，经商队运输，在俄罗斯融入新的生活场景；贸易同时连接了不同文化。',
wrong:'再想一想：茶叶到达新的地区后，器物、饮茶习惯和社交方式也发生了变化。',
museumCta:'进入3D博物馆 ↗',dictionaryCta:'继续三语学习 ↗',
sourceTitle:'资料说明',sourceText:'本专题使用本站本地收藏的历史图像、器物参考照片及数字展陈素材。相关展品可能包括历史原件照片、参考器物及艺术复原，不能视为同一性质。请以各展品的来源标注为准。',
sourceLink:'查看图像来源清单'
},
ru:{
navHome:'Главная',navMuseum:'3D-музей',navGames:'Игры',navDictionary:'Словарь',
eyebrow:'ИНТЕРАКТИВНАЯ ТЕМА · ДИАЛОГ КУЛЬТУР',title:'Один чайный лист —<br>диалог двух культур.',
intro:'Чай — больше, чем товар. Через караваны и приграничные города он проникал из Китая в Россию, где появились собственные чайные привычки. Три предмета рассказывают о том, как Великий чайный путь связал культурные традиции.',
tagA:'Культурный маршрут',tagB:'Предметы и история',tagC:'Сравнение традиций',tagD:'КИТ · РУС · АНГ',
pathKicker:'01 / 03 · ОТ ПРОИЗВОДСТВА К БЫТУ',pathTitle:'Культурное путешествие чайного листа',pathIntro:'Продолжите знакомство в музее: фотографии, подлинные предметы и современные реконструкции имеют разный статус.',
stage1:'Кирпичный чай: производство',stage1Text:'Прессованный чай удобен для хранения и дальних перевозок; его форма показывает адаптацию чайного ремесла к торговле.',
stage2:'Караван: торговля и контакты',stage2Text:'Торговые пути связывали купцов, стоянки и города — вместе с товарами распространялись слова, идеи и обычаи.',
stage3:'Самовар: быт и адаптация',stage3Text:'В России чай вошёл в домашнюю и общественную жизнь; самовар стал одним из характерных предметов этой культуры.',
compareKicker:'02 / 03 · СРАВНЕНИЕ',compareTitle:'Один напиток, разные традиции',
chinaKicker:'КИТАЙСКАЯ ЧАЙНАЯ КУЛЬТУРА',chinaTitle:'Чай, заваривание и дегустация',chinaText:'Способы чаепития в регионах Китая различаются. Чай, посуда и процедура отражают местные ремёсла и гостеприимство.',
russiaKicker:'РУССКАЯ ЧАЙНАЯ КУЛЬТУРА',russiaTitle:'Самовар и семейная встреча',russiaText:'В России сложились собственные формы сервировки, гостеприимства и домашнего чаепития, исторически связанные с торговлей китайским чаем.',
commonTitle:'ОБЩЕЕ · ',commonText:'Чай объединяет людей: за чашкой напитка общаются, принимают гостей и проводят время вместе.',
quizKicker:'03 / 03 · ПРОВЕРЬ СЕБЯ',quizTitle:'Короткий вопрос о культурах',question:'Почему Великий чайный путь — больше, чем торговый маршрут?',
answer0:'Потому что чай пили только в Китае',answer1:'Потому что торговля также связывала языки, вещи и традиции',
correct:'Верно! Чай производили в Китае, перевозили караванами и по-новому использовали в России — вместе с торговлей обменивались культурой.',
wrong:'Подумайте о том, как чай менял быт после того, как попадал в новые страны.',
museumCta:'Открыть 3D-музей ↗',dictionaryCta:'Перейти к словарю ↗',
sourceTitle:'Об источниках',sourceText:'На сайте используются исторические фотографии, изображения предметов и цифровые реконструкции. Эти категории не равнозначны: смотрите отдельные подписи об источниках и статусе экспонатов.',
sourceLink:'Перечень источников изображений'
},
en:{
navHome:'Home',navMuseum:'3D Museum',navGames:'Games',navDictionary:'Dictionary',
eyebrow:'INTERACTIVE FEATURE · CROSS-CULTURAL DIALOGUE',title:'One tea leaf.<br>Two cultures in dialogue.',
intro:'Tea was more than a commodity. Caravans and border trade carried it from China toward Russia, where it became part of distinctive social customs. Three objects help explain the cultural connections of the Great Tea Road.',
tagA:'Cultural journey',tagB:'Objects and history',tagC:'Compare traditions',tagD:'ZH · RU · EN',
pathKicker:'01 / 03 · FROM PRODUCTION TO DAILY LIFE',pathTitle:'A tea leaf across cultures',pathIntro:'Continue exploring in the museum: archival images, reference objects and modern reconstructions must be distinguished.',
stage1:'Tea bricks: production and trade',stage1Text:'Compressed tea was easier to store and transport, showing how tea-making adapted to long-distance trade.',
stage2:'Caravans: transport and encounters',stage2Text:'Trade routes connected merchants, stations and towns; alongside goods came the exchange of languages, ideas and customs.',
stage3:'Samovar: daily life and adaptation',stage3Text:'Tea became part of Russian social and domestic life, with the samovar emerging as a characteristic cultural object.',
compareKicker:'02 / 03 · UNDERSTANDING DIFFERENCES',compareTitle:'One drink, different traditions',
chinaKicker:'CHINESE TEA CULTURE',chinaTitle:'Tea, brewing and appreciation',chinaText:'Practices differ by region. Tea leaves, vessels and preparation reflect local craftsmanship and hospitality.',
russiaKicker:'RUSSIAN TEA CULTURE',russiaTitle:'Samovar and family gatherings',russiaText:'Russian tea culture developed its own tools, hospitality customs and domestic settings, historically connected to the trade in Chinese tea.',
commonTitle:'SHARED VALUE · ',commonText:'Tea helps people connect: hosting guests, sharing conversation and spending time together.',
quizKicker:'03 / 03 · TEST YOUR UNDERSTANDING',quizTitle:'A cross-cultural question',question:'Why was the Great Tea Road more than a commercial route?',
answer0:'Because only people in China drank tea',answer1:'Because trade also connected languages, objects and customs',
correct:'Correct! Tea was produced in China, transported through trading routes and adapted to Russian daily life — commerce also carried cultural exchange.',
wrong:'Think about how tea influenced the everyday culture of the places it reached.',
museumCta:'Explore 3D museum ↗',dictionaryCta:'Continue language learning ↗',
sourceTitle:'About the sources',sourceText:'This page uses historical imagery, reference objects and digital reconstructions. They represent different kinds of evidence; check the original attribution and object status for each exhibit.',
sourceLink:'See image-source notes'
}
};
let current;let selected=null;
const by=id=>document.getElementById(id);
function render(language){
  const lang=L[language]?language:'zh';current=lang;
  document.documentElement.lang=lang;try{localStorage.setItem('gtr-lang',lang);sessionStorage.setItem('teaAdventureLanguage',lang)}catch{}
  const t=L[lang];Object.keys(t).forEach(id=>{const n=by(id);if(n)n[id==='title'?'innerHTML':'textContent']=t[id]});
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.lang===lang)));
  if(selected!==null)by('feedback').textContent=selected===1?t.correct:t.wrong;
}
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.lang)));
document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{
  selected=Number(b.dataset.answer);
  document.querySelectorAll('[data-answer]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  by('feedback').textContent=selected===1?L[current].correct:L[current].wrong;
}));
let preferred='zh';try{preferred=localStorage.getItem('gtr-lang')||'zh'}catch{}
render(preferred);
})();