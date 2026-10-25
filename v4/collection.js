/* Heritage collection phase I. Curated from contest pack 2026-10-25.
  Public domain / CC0 / PDM image references only.
  "type reference" labels explicitly distinguish analogues from actual tea-road objects. */
const rooms={
 ru:['Китай: начало чайного пути','Караваны и степи','Кяхта и Маймачен','Чай и культурный обмен'],
 zh:['中国·茶路起点','商队与草原','恰克图与买卖城','茶与文化交流'],
 en:['China: origins of tea','Caravans and steppe','Kyakhta and Maimaichen','Tea and cultural exchange']
};
const items=[
 {id:'r1-brick',room:0,name:{ru:'Кирпичный чай',zh:'砖茶',en:'Brick tea'},
  desc:{ru:'Перед дальним путешествием чай сушили, пропаривали и прессовали. Исторические изображения помогают понять последовательность операций. Представленная иллюстрация показывает сушку листьев, а не готовый чайный кирпич.',zh:'茶叶在远行前经过烘干、蒸软和紧压等工序。历史绘画展示的是烘干茶叶的过程，并非砖茶成品。',en:'Tea underwent drying, steaming and pressing before transport. This historical painting documents leaf drying, not a finished tea brick.'},
  image:'https://iiif.wellcomecollection.org/image/V0018603/full/800,/0/default.jpg',source:'https://wellcomecollection.org/works/qv74uhng',credit:'Chinese artist, ca. 1850 · Wellcome Collection',license:'Public Domain Mark 1.0',qual:'historical'},
 {id:'r1-teaset',room:0,name:{ru:'Китайская чайная посуда',zh:'中国茶具',en:'Chinese teaware'},
  desc:{ru:'Китайский чайный сервиз в 3D-зале — современная модель. Для исторического сопоставления представлен настоящий исинский чайник периода Цин из коллекции Кливлендского музея искусства.',zh:'三维展厅中的茶具是现代模型。这里展出的清代宜兴紫砂茶壶来自克利夫兰艺术博物馆，可作为器型参照。',en:'The 3D teaware is a modern model. This Qing-dynasty Yixing teapot in the Cleveland Museum of Art is presented as a historical form reference.'},
  image:'https://openaccess-cdn.clevelandart.org/1955.299/1955.299_print.jpg',source:'https://www.clevelandart.org/art/1955.299',credit:'Yixing ware, Qing dynasty · Cleveland Museum of Art, 1955.299',license:'CC0 1.0',qual:'type'},
 {id:'r1-chest',room:0,name:{ru:'Чайные ящики и упаковка',zh:'茶箱与包装',en:'Tea chests and packing'},
  desc:{ru:'Упаковка позволяла защищать чай при многократных перегрузках. На рисунке начала XIX века китайские рабочие укладывают экспортные чайные ящики на плоты. Он показывает водный участок торговли, а не конкретный эпизод в Кяхте.',zh:'运输过程中，茶箱用于保护货物。图中描绘中国工人将出口茶箱装上木筏，表现的是水运环节而非恰克图的具体事件。',en:'Tea chests protected shipments through repeated handling. This early nineteenth-century Chinese painting shows tea boxes being loaded onto rafts rather than a particular event in Kyakhta.'},
  image:'https://iiif.wellcomecollection.org/image/V0046754/full/800,/0/default.jpg',source:'https://wellcomecollection.org/works/tqzrwdqz',credit:'Chinese artist, 1800–1850 · Wellcome Collection',license:'Public Domain Mark 1.0',qual:'historical'},
 {id:'r2-camel',room:1,name:{ru:'Двугорбый верблюд',zh:'双峰驼与驼队',en:'Bactrian camel caravans'},
  desc:{ru:'Двугорбые верблюды перевозили грузы через засушливые степные районы. Изображённая бронзовая статуэтка намного древнее чайной торговли и представлена только как пример изображения двугорбого верблюда.',zh:'双峰驼适应干旱和寒冷环境，曾用于长途运输。展出的青铜驼像年代远早于万里茶道，仅作为动物形态参照。',en:'Bactrian camels served long-distance caravan trade. This copper-alloy sculpture predates the Great Tea Road by millennia and is shown solely as a reference for the animal’s form.'},
  image:'https://images.metmuseum.org/CRDImages/an/original/DP-14200-001.jpg',source:'https://www.metmuseum.org/art/collection/search/324256',credit:'Bactrian camel, late 3rd–early 2nd millennium BCE · The Met, 53.117.1',license:'CC0 1.0',qual:'type'},
 {id:'r2-packsaddle',room:1,name:{ru:'Вьючная упряжь',zh:'驼铃与驮具',en:'Pack saddles and equipment'},
  desc:{ru:'Снаряжение животных определяло удобство и безопасность перевозки груза. Древняя бронзовая накладка с всадником помогает понять изображение верблюдов, но не является находкой с маршрута чайной торговли.',zh:'驮具和绑扎方式影响货物运输。骑驼纹青铜带饰提供形态参照，但并非茶道沿线出土文物。',en:'Harnesses and saddles shaped caravan transport. This ancient bronze belt plaque is an illustrative type reference, not an archaeological find from the Tea Road.'},
  image:'https://images.metmuseum.org/CRDImages/as/original/2002_201_83_O1.jpg',source:'https://www.metmuseum.org/art/collection/search/59505',credit:'Bactrian camel with rider, 4th c. BCE · The Met, 2002.201.83',license:'CC0 1.0',qual:'type'},
 {id:'r2-poststation',room:1,name:{ru:'Стоянки и почтовые станции',zh:'草原驿站与商队营地',en:'Caravan stations and camps'},
  desc:{ru:'В степях и пустынях переходы планировали с учётом воды, погоды и безопасных стоянок. Исторические материалы в конкурсном архиве требуют дополнительной проверки прав, поэтому здесь пока приведено описание без изображения.',zh:'草原与戈壁的路程需要考虑水源、天气与过夜地点。相关照片仍需核实授权，本展位暂不公开展示照片。',en:'Routes across steppe and desert depended on water, weather and safe stopping places. The candidate photographs require further permissions checks, so this display currently uses text only.'},
  image:null,source:null,credit:'Historical reconstruction topic · source review pending',license:null,qual:'pending'},
 {id:'r3-shop',room:2,name:{ru:'Пограничная торговая лавка',zh:'边境商铺',en:'Merchant shops'},
  desc:{ru:'Торговая лавка была местом переговоров, хранения и обмена товарами. Фотография китайского магазина в Сямэне относится к 1870 году; это архитектурный аналог, но не фотография Маймачена.',zh:'商铺是交易、议价和存放货物的空间。这张约1870年的厦门商铺照片是建筑类型参照，不是买卖城的实景。',en:'Shops were sites of trading, negotiation and storage. This photograph of a shop in Xiamen around 1870 is an architectural comparison, not a view of Maimaichen.'},
  image:'https://iiif.wellcomecollection.org/image/L0056273/full/800,/0/default.jpg',source:'https://wellcomecollection.org/works/qsb8zx5a',credit:'John Thomson, Xiamen, ca. 1870 · Wellcome Collection',license:'Public Domain Mark 1.0',qual:'type'},
 {id:'r3-gate',room:2,name:{ru:'Ворота и пограничные рубежи',zh:'城门与界标',en:'Gates and border markers'},
  desc:{ru:'После договоров 1727 года Кяхта и Маймачен развивались как пограничные торговые поселения. Снимок пекинских стен у ворот Аньдинмэнь показывает тип укреплений, но не является изображением ворот Кяхты.',zh:'1727年的边界条约为恰克图和买卖城的贸易关系奠定背景。北京安定门城墙照片仅作城门类型参照，并非恰克图城门。',en:'The 1727 agreements shaped trade at Kyakhta and Maimaichen. This photograph of Beijing walls near Andingmen illustrates a fortified gate type, not a Kyakhta gate.'},
  image:'https://iiif.wellcomecollection.org/image/V0037627/full/800,/0/default.jpg',source:'https://wellcomecollection.org/works/eg29s8qh',credit:'Felice Beato, Beijing, 1860 · Wellcome Collection',license:'Public Domain Mark 1.0',qual:'type'},
 {id:'r3-documents',room:2,name:{ru:'Документы, весы и торговые расчёты',zh:'茶票·账册·度量衡',en:'Documents and weights'},
  desc:{ru:'Торговле нужны были учёт, весы, расчёты и договорённости. Представленный античный безмен показывает принцип взвешивания, однако не относится непосредственно к китайским торговцам чаем.',zh:'贸易依赖账目、度量衡与结算。图示青铜杆秤年代更早，仅供说明衡器类型，并非中国茶商专用器具。',en:'Trade relied on accounts, weights and negotiated settlements. This earlier bronze steelyard illustrates weighing technology only; it is not documented as a Chinese tea trader’s instrument.'},
  image:'https://images.metmuseum.org/CRDImages/gr/original/DP121459.jpg',source:'https://www.metmuseum.org/art/collection/search/251192',credit:'Bronze steelyard, 2nd–4th c. CE · The Met, 22.139.14',license:'CC0 1.0',qual:'type'},
 {id:'r4-samovar',room:3,name:{ru:'Русский самовар',zh:'俄式茶炊',en:'Russian samovar'},
  desc:{ru:'Самовар стал символом русского гостеприимства и семейного чаепития. Для сравнения с 3D-моделью представлен реальный музейный предмет из этнографической коллекции Швеции.',zh:'茶炊是俄罗斯家庭待客和饮茶文化的重要象征。这张照片来自瑞典民族学博物馆的馆藏实物，可与三维模型对照。',en:'The samovar became an emblem of Russian hospitality. This image shows a collection object from Sweden’s Museum of Ethnography, offered as a reference alongside our separate 3D model.'},
  image:'https://collections.smvk.se/carlotta-em/web/image/zoom/1208586/2005.02.0015.A-C.jpg',source:'https://collections.smvk.se/carlotta-em/web/object/1208565',credit:'Samovar · Museum of Ethnography, Sweden, 2005.02.0015.A–C',license:'CC0 1.0',qual:'historical'},
 {id:'r4-desk',room:3,name:{ru:'Купеческий стол и переписка',zh:'商人桌案与地图',en:'Merchant desk and correspondence'},
  desc:{ru:'Письма, контракты, счета и карты связывали участников торгового пути. Английская гравюра с чаепитием служит примером обстановки чайного стола, но не изображает рабочее место купца.',zh:'书信、契约和账目支撑跨境贸易。这幅英国茶桌版画可用于了解茶具陈设，但并非商人账房场景。',en:'Letters, contracts and ledgers connected merchants. This British tea-table aquatint offers a furnishing comparison, not an authentic merchant’s office scene.'},
  image:'https://iiif.wellcomecollection.org/image/V0040178/full/600,/0/default.jpg',source:'https://wellcomecollection.org/works/fffkc9mv',credit:'G. Hunt after M. Egerton, 19th c. · Wellcome Collection',license:'Public Domain Mark 1.0',qual:'type'},
 {id:'r4-threetea',room:3,name:{ru:'Традиции чаепития и культурный обмен',zh:'三种茶桌：中·俄·蒙',en:'Tea traditions across cultures'},
  desc:{ru:'Чай связывал разные способы приготовления и гостеприимства в Китае, Монголии и России. Здесь пока показан русский самовар; китайские и монгольские сопоставления добавим только после проверки соответствующих источников.',zh:'茶在中国、蒙古和俄罗斯形成了不同的饮用与待客传统。本展位暂以俄式茶炊作例，其余图像将待来源核实后补充。',en:'Tea acquired distinct traditions of preparation and hospitality in China, Mongolia and Russia. This display currently highlights the Russian samovar; further comparisons will follow source verification.'},
  image:'https://collections.smvk.se/carlotta-em/web/image/zoom/1208586/2005.02.0015.A-C.jpg',source:'https://collections.smvk.se/carlotta-em/web/object/1208565',credit:'Samovar · Museum of Ethnography, Sweden',license:'CC0 1.0',qual:'historical'}
];
const COPY={
 ru:{eyebrow:'ИСТОРИЧЕСКИЙ АРХИВ · ЦИФРОВАЯ ЭКСПОЗИЦИЯ',heading:'История, за которой стоят источники.',intro:'Двенадцать экспозиций: от технологии изготовления чая до караванных маршрутов, Кяхты и русских чайных традиций. Здесь исторические музейные изображения отделены от современных 3D-реконструкций.',m1:'экспозиций',m2:'исторических раздела',m3:'три языка',notice:'Мы публикуем только изображения с указанными открытыми лицензиями. Материалы с неподтверждённым происхождением и ограниченными правами исключены. Исторические аналогии не доказывают происхождения наших 3D-моделей.',all:'Все',search:'Поиск по экспозиции…',count:'Найдено экспозиций: ',source:'Открыть источник',empty:'Иллюстрация пока не опубликована',analogy:'ТИПОЛОГИЧЕСКИЙ АНАЛОГ',history:'ИСТОРИЧЕСКИЙ ИСТОЧНИК',pending:'ИСТОЧНИК ПРОВЕРЯЕТСЯ',methodHeading:'О достоверности',method:'Все 3D-модели нашего проекта — художественные реконструкции или типовые модели, а не сканы коллекционных предметов. Иллюстрации снабжены ссылками, лицензиями и авторством. Неподтверждённые материалы остаются за пределами публичной экспозиции.',footer:'Историческая коллекция · первый этап расширения музея',home:'Главная',museum:'3D-музей'},
 zh:{eyebrow:'历史文献 · 数字展陈',heading:'让每一个展品都有据可查。',intro:'十二个主题展位，涵盖茶叶制作、草原商队、恰克图边贸以及俄罗斯茶文化。历史图像与现代三维复原明确区分。',m1:'个展位',m2:'个主题展厅',m3:'三种语言',notice:'公开页面仅使用标注开放许可的图片。出处不明或版权受限的材料不公开。历史类型参照不等于三维模型的原件证明。',all:'全部',search:'搜索展品…',count:'展位数量：',source:'查看馆藏来源',empty:'图像尚未公开',analogy:'类型参照',history:'历史图像',pending:'来源待核实',methodHeading:'真实性与来源说明',method:'项目中的三维模型均为示意复原或类型模型，并非馆藏实物的三维扫描。历史图片附有来源页、许可与署名。出处不明的资料仅供内部研究。',footer:'史料图版馆 · 第一阶段扩展',home:'首页',museum:'三维展馆'},
 en:{eyebrow:'HISTORICAL ARCHIVE · DIGITAL EXHIBITION',heading:'Every exhibit has a story and a source.',intro:'Twelve curated displays trace tea production, overland caravans, the Kyakhta border trade and Russian tea culture. Original historical images are clearly distinguished from modern 3D reconstructions.',m1:'displays',m2:'historical galleries',m3:'languages',notice:'Only material with stated open reuse rights appears in this public gallery. Images with uncertain provenance or restricted rights are omitted. Type references are not evidence that our 3D models represent specific museum objects.',all:'All',search:'Search the collection…',count:'Displays: ',source:'View collection source',empty:'Image not published',analogy:'TYPE REFERENCE',history:'HISTORICAL IMAGE',pending:'SOURCE UNDER REVIEW',methodHeading:'Provenance and accuracy',method:'All 3D exhibits are illustrative reconstructions or supplied type models, not scans of museum collections. Images carry source links, licence and credits. Unverified items are excluded from this public exhibition.',footer:'Historical collections · first expansion phase',home:'Home',museum:'3D museum'}
};
let lang=localStorage.getItem('gtr-collection-lang')||'ru',room=-1,query='';
if(!rooms[lang])lang='ru';
const $=id=>document.getElementById(id);
const srcLink=(e,t)=>e.source?'<a href="'+e.source+'" target="_blank" rel="noopener noreferrer">'+t.source+'</a>':'';
const escapeHTML=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function display(){
 const t=COPY[lang];document.documentElement.lang=lang;
 for(const key of ['eyebrow','heading','intro','notice','methodHeading'])$(key).textContent=t[key];
 $('metric1').textContent=t.m1;$('metric2').textContent=t.m2;$('metric3').textContent=t.m3;
 $('methodText').textContent=t.method;$('footer').textContent=t.footer;$('homeLink').textContent=t.home;$('museumLink').textContent=t.museum;
 $('search').placeholder=t.search;
 document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
 const filters=$('filters');filters.replaceChildren();
 [-1,0,1,2,3].forEach(n=>{
  const b=document.createElement('button');b.textContent=n<0?t.all:rooms[lang][n];
  b.setAttribute('aria-pressed',String(room===n));b.onclick=()=>{room=n;display()};filters.append(b);
 });
 const found=items.filter(e=>(room<0||e.room===room)&&(!query||[e.name[lang],e.desc[lang],e.id].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase())));
 $('count').textContent=t.count+found.length;
 const section=$('entries');section.replaceChildren();
 for(const e of found){
  const card=document.createElement('article');card.className='entry';
  const image=document.createElement('div');image.className='picture';image.dataset.tag=({type:t.analogy,historical:t.history,pending:t.pending})[e.qual]||t.history;
  if(e.image){
   const img=document.createElement('img');img.src=e.image;img.loading='lazy';img.decoding='async';img.alt=e.name[lang];img.referrerPolicy='no-referrer';
   img.onerror=()=>{img.remove();const fallback=document.createElement('span');fallback.className='empty';fallback.textContent='文';image.append(fallback);};
   image.append(img);
  }else{const p=document.createElement('span');p.className='empty';p.textContent='文';image.append(p)}
  const meta=document.createElement('div');meta.className='meta';
  const chapter=document.createElement('div');chapter.className='chapter';chapter.textContent='0'+(e.room+1)+' / 04 · '+rooms[lang][e.room];
  const h=document.createElement('h2');h.textContent=e.name[lang];
  const description=document.createElement('p');description.className='description';description.textContent=e.desc[lang];
  const bottom=document.createElement('div');bottom.className='source';
  const credit=document.createElement('span');credit.textContent=e.credit;bottom.append(credit);
  if(e.license){const license=document.createElement('small');license.textContent=e.license;bottom.append(license)}
  if(e.source){const link=document.createElement('a');link.href=e.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent=t.source+' ↗';bottom.append(link)}
  meta.append(chapter,h,description,bottom);card.append(image,meta);section.append(card);
 }
}
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;localStorage.setItem('gtr-collection-lang',lang);display()});
$('search').addEventListener('input',e=>{query=e.target.value;display();$('search').focus();});
display();