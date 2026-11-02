(() => {
'use strict';
const texts={
zh:{navCulture:'文化对话',cultureEyebrow:'跨文化交际 · 以器物连接不同生活方式',cultureHeading:'一片茶叶，连接中俄两种文化。',cultureLead:'从中国的砖茶，到草原上的商队，再到俄罗斯家庭中的茶炊——用三件代表性器物解释贸易如何推动文化交流。',
culture1:'中国 · 制茶与砖茶',culture1Text:'认识茶砖的制作与运输特点：物品的形态如何适应跨境贸易？',
culture2:'蒙古 · 商队与道路',culture2Text:'从交通路线看语言、商品和习俗如何在不同地区之间相遇。',
culture3:'俄罗斯 · 茶炊与生活',culture3Text:'理解中国茶进入俄罗斯后，怎样融入当地待客与家庭生活。',
cultureEnter:'体验跨文化对话 ↗',cultureMuseum:'在3D展馆查看展品 ↗',cultureNote:'历史照片、典型器物与数字复原分别说明，并保留来源信息。',
museumBridgeTitle:'让器物讲述跨文化交流',museumBridgeBody:'从砖茶的生产与贸易，到商队穿越草原，再到俄罗斯的饮茶生活。同一商品如何进入不同文化？',museumBridgeCTA:'进入互动文化对话 ↗'},
ru:{navCulture:'Культурный диалог',cultureEyebrow:'МЕЖКУЛЬТУРНАЯ КОММУНИКАЦИЯ · ИСТОРИЯ ЧЕРЕЗ ПРЕДМЕТЫ',cultureHeading:'Один чайный лист связывает две культуры.',cultureLead:'От китайского кирпичного чая через степные караваны к русскому самовару — три предмета объясняют, как торговля создавала культурные связи.',
culture1:'Китай · Кирпичный чай',culture1Text:'Как технологии изготовления и форма чая отвечали задачам дальней торговли?',
culture2:'Монголия · Караваны',culture2Text:'Как товары, языки и обычаи встречались на торговых путях?',
culture3:'Россия · Самовар',culture3Text:'Как китайский чай стал частью повседневного быта и гостеприимства в России?',
cultureEnter:'Начать культурный диалог ↗',cultureMuseum:'Рассмотреть в 3D-музее ↗',cultureNote:'Исторические источники, типологические аналоги и цифровые реконструкции обозначены отдельно.',
museumBridgeTitle:'Предметы рассказывают о культурном обмене',museumBridgeBody:'Производство чая, торговые караваны, русские чайные обычаи: как один товар вплетался в разные культуры?',museumBridgeCTA:'Открыть культурный диалог ↗'},
en:{navCulture:'Cultural dialogue',cultureEyebrow:'CROSS-CULTURAL COMMUNICATION · OBJECTS CONNECT CULTURES',cultureHeading:'One tea leaf connects two cultures.',cultureLead:'From Chinese tea bricks through steppe caravans to the Russian samovar — three objects tell the story of trade and cultural connection.',
culture1:'China · Compressed tea',culture1Text:'How did techniques and packaging adapt tea for long-distance commerce?',
culture2:'Mongolia · Caravans',culture2Text:'How did merchants, languages and customs meet along the trading routes?',
culture3:'Russia · Samovar',culture3Text:'How did Chinese tea become part of everyday Russian social life?',
cultureEnter:'Explore cultural dialogue ↗',cultureMuseum:'Examine exhibits in 3D ↗',cultureNote:'Historical images, reference objects and modern reconstructions are clearly distinguished.',
museumBridgeTitle:'Objects tell a story of cultural exchange',museumBridgeBody:'From making and trading tea, through the caravans, to Russian tea traditions: how did one product enter different cultures?',museumBridgeCTA:'Open interactive cultural dialogue ↗'}
};
const update=(lang)=>{
  const l=texts[lang]?lang:'zh';
  const t=texts[l];
  document.querySelectorAll('[data-culture-key]').forEach(el=>{
    const key=el.dataset.cultureKey;if(t[key])el.textContent=t[key];
  });
};
let start='zh';try{start=localStorage.getItem('gtr-lang')||document.documentElement.lang||'zh'}catch{};
update(start);
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-lang]');
 if(!btn)return;
 update(btn.dataset.lang);
});
})();