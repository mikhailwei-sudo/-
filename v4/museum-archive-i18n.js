/* Museum archive labels, translated without changing sources or changing any mascot assets. */
(() => {
'use strict';
const T={
zh:{
kicker:'馆藏文献 · 史料来源与数字复原',
title:'展厅中的史料与器物来源',
intro:'展品数字模型属于现代复原，不是博物馆文物的三维扫描。历史图片和类比器物逐条标明来源，不将参考照片误作展品原件。',
cards:[
['中国茶叶加工','约1850年的中国制茶图像，描绘茶叶干燥工序；并非砖茶实物照片。'],
['双峰驼与商队','表现骆驼形态的历史版画，作为运输主题的类比素材，并非某支茶叶商队的照片。'],
['边境贸易与商铺','1860年北京商铺历史照片，可作为建筑类比；并不是恰克图的影像。'],
['俄式茶炊','真实馆藏茶炊的照片，用于与本站当代数字复原模型进行对照。']
],
source:'查看馆藏原始来源 ↗',
footnoteTitle:'其他历史图像与补充说明',
footnotes:[
'01 · 中国：「蒸茶」主题绘画，约1850年，Wellcome Collection · PDM 1.0。',
'02 · 商队：双峰驼雕塑，古代器物类比。大都会艺术博物馆，53.117.1 · CC0 1.0。',
'03 · 贸易：1860年北京安定门附近的城墙，摄影者 Felice Beato；非恰克图影像。Wellcome Collection · PDM 1.0。',
'04 · 饮茶：19世纪英国饮茶场景，G. Hunt 临摹 M. Egerton 作品；并非俄罗斯商人办公室。Wellcome Collection · PDM 1.0。'
],
footnoteLink:'查看来源 ↗',
more:'浏览完整史料目录（12组展品） ↗'
},
ru:{
kicker:'МУЗЕЙНЫЕ МАТЕРИАЛЫ · ИСТОЧНИКИ И РЕКОНСТРУКЦИИ',
title:'Источники музейных изображений',
intro:'Цифровые модели — современные реконструкции, не трёхмерные сканы экспонатов. Исторические изображения и типологические аналоги имеют отдельные ссылки на источники.',
cards:[
['Китайское производство чая','Китайский художник, около 1850 года: сушка чайных листьев, а не фотография чайного кирпича.'],
['Двугорбые верблюды и караван','Историческая гравюра с верблюдами. Типологический аналог, не фотография конкретного каравана.'],
['Торговля и архитектура','Китайский магазин в Пекине, 1860 год — архитектурная аналогия, не исторический снимок Кяхты.'],
['Русский самовар','Реальный музейный предмет для сравнения с авторской цифровой моделью.']
],
source:'Музейный источник ↗',
footnoteTitle:'Дополнительные изображения в 3D-залах',
footnotes:[
'01 · Китай: паровая обработка чая, китайский художник, около 1850 года. Wellcome Collection · PDM 1.0.',
'02 · Караваны: скульптура двугорбого верблюда; типологический аналог. The Met, №53.117.1 · CC0 1.0.',
'03 · Торговля: стены у Аньдинмэнь, Пекин, Феличе Беато, 1860. Не Кяхта. Wellcome Collection · PDM 1.0.',
'04 · Чаепитие: английская сцена, G. Hunt по M. Egerton, XIX век. Не русская купеческая контора. Wellcome Collection · PDM 1.0.'
],
footnoteLink:'Источник ↗',
more:'Открыть исторический каталог из 12 экспозиций ↗'
},
en:{
kicker:'MUSEUM REFERENCES · SOURCES & RECONSTRUCTIONS',
title:'Historical sources behind the exhibits',
intro:'Our 3D objects are modern reconstructions, not museum scans. Archival images and typological references are credited individually and are not presented as photos of the digital models.',
cards:[
['Chinese tea processing','Chinese artist, c. 1850: tea leaf drying; not a photograph of compressed tea bricks.'],
['Bactrian camels and caravans','A historical illustration of camel types. A visual reference, not a record of a specific tea caravan.'],
['Border trade and shops','A photograph of a Beijing shop from 1860. An architectural analogue, not an image of Kyakhta.'],
['Russian samovar','An actual museum object used to compare with our modern digital reconstruction.']
],
source:'View museum source ↗',
footnoteTitle:'Additional historical images in the 3D galleries',
footnotes:[
'01 · China: steaming tea, Chinese artist, c. 1850. Wellcome Collection · PDM 1.0.',
'02 · Caravans: ancient Bactrian camel figure, typological reference. The Met, 53.117.1 · CC0 1.0.',
'03 · Trade: walls near Andingmen, Beijing, Felice Beato, 1860. Not Kyakhta. Wellcome Collection · PDM 1.0.',
'04 · Tea gatherings: English tea-drinking scene by G. Hunt after M. Egerton, 19th century. Not a Russian merchants’ office. Wellcome Collection · PDM 1.0.'
],
footnoteLink:'Source ↗',
more:'Explore the complete historical catalogue (12 collections) ↗'
}
};
const footLinks=[
'https://wellcomecollection.org/works/s946ptrq',
'https://www.metmuseum.org/art/collection/search/324256',
'https://wellcomecollection.org/works/eg29s8qh',
'https://wellcomecollection.org/works/fffkc9mv'
];
function render(language){
const lang=T[language]?language:'zh',t=T[lang];
const root=document.querySelector('.museumArchiveRail');if(!root)return;
const e=(selector)=>root.querySelector(selector);
const c=e('.museumArchiveHeader .eyebrow'),h=e('.museumArchiveHeader h2'),p=e('.museumArchiveHeader p');
if(c)c.textContent=t.kicker;if(h)h.textContent=t.title;if(p)p.textContent=t.intro;
root.querySelectorAll('.museumArchiveCards article').forEach((a,i)=>{
 if(!t.cards[i])return;
 const title=a.querySelector('h3'),desc=a.querySelector('p'),link=a.querySelector('a');
 if(title)title.textContent=t.cards[i][0];
 if(desc)desc.textContent=t.cards[i][1];
 if(link)link.textContent=t.source;
});
const note=e('.archiveFootnotes strong');if(note)note.textContent=t.footnoteTitle;
root.querySelectorAll('.archiveFootnoteGrid p').forEach((p,i)=>{
 if(!t.footnotes[i])return;
 const oldLink=p.querySelector('a');
 const href=oldLink?.href||footLinks[i];
 p.replaceChildren(document.createTextNode(t.footnotes[i]+' '));
 const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=t.footnoteLink;p.append(a);
});
const more=e('.museumArchiveMore a');if(more)more.textContent=t.more;
}
let lang='zh';try{lang=localStorage.getItem('gtr-lang')||document.documentElement.lang||'zh'}catch{}
render(lang);
window.addEventListener('museum-language-changed',event=>render(event.detail?.lang||'zh'));
document.querySelectorAll('.languages [data-lang]').forEach(btn=>btn.addEventListener('click',()=>render(btn.dataset.lang)));
})();