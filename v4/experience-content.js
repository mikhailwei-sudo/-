// Museum editorial content. References identify sources of inspiration, not exact 3D scans.
const ROOMS=[
{accent:'#4c6751',items:[0,1],ru:{title:'Китай. Истоки чая',short:'Чайный кирпич и технология производства',desc:'Путь начинался в китайских чайных регионах. Прессование и упаковка позволяли перевозить чай на большие расстояния.'},zh:{title:'中国：茶路起点',short:'砖茶与加工技艺',desc:'茶路始于中国的产茶地区。压制与包装工艺使茶叶可以进行长途运输。'},en:{title:'China: origins of tea',short:'Brick tea and craft',desc:'The journey began in the tea-growing regions of China. Pressing and packaging helped protect tea on its long journey.'}},
{accent:'#80674a',items:[2,3],ru:{title:'Караванный путь',short:'Верблюды, груз и дороги через Монголию',desc:'Караваны перевозили чай в тюках и ящиках. Дорога состояла из нескольких маршрутов, меняющихся в разные эпохи.'},zh:{title:'商队与漫长旅程',short:'穿越蒙古草原的驼队',desc:'商队使用驮兽、木箱与茶包运输货物。贸易路线在不同历史时期存在差异。'},en:{title:'The caravan journey',short:'Camels, cargo and Mongolia',desc:'Caravans carried tea in crates and bundles. Several trade routes evolved across different eras.'}},
{accent:'#47685e',items:[4,5],ru:{title:'Кяхта и Маймачен',short:'Граница и торговые лавки',desc:'В пограничных торговых поселениях встречались купцы России и Китая. Здесь обменивались товарами, языками и обычаями.'},zh:{title:'恰克图与买卖城',short:'边境商埠与贸易交往',desc:'在中俄边境的贸易城镇，商人交换商品，也交流语言、知识与习俗。'},en:{title:'Kyakhta & Maimaichen',short:'Border markets and merchants',desc:'Trading settlements on the frontier connected merchants from Russia and China, along with goods, languages and customs.'}},
{accent:'#7b4c3c',items:[6,7],ru:{title:'Русское чаепитие',short:'Самовар и новые чайные традиции',desc:'Чай менял повседневную жизнь. В России сложились особые способы чаепития, а предметы и привычки путешествовали вместе с товаром.'},zh:{title:'俄罗斯茶文化',short:'茶炊与饮茶习俗',desc:'茶叶改变了日常生活。在俄罗斯形成了独特的饮茶习惯，器物与习俗也随商品跨越边界。'},en:{title:'Russian tea traditions',short:'Samovars and tea traditions',desc:'Tea transformed everyday life. Russian tea rituals developed alongside the circulation of goods and customs.'}}
,
{accent:"#476969",items:[8,9],ru:{title:"География чайного пути",short:"Карта и торговые города",desc:"Маршруты связывали китайские районы производства чая с Монголией и Россией. На стенде показана схематическая последовательность важных узлов, а не единственная историческая дорога."},zh:{title:"万里茶道地理",short:"路线图与贸易节点",desc:"茶路连接中国茶区、蒙古草原与俄罗斯。展厅展示重要贸易节点的示意路线，并非唯一固定历史路线。"},en:{title:"Geography of the Tea Road",short:"Routes and trading cities",desc:"Routes connected Chinese tea regions, Mongolia and Russia. The map is a schematic of major nodes, not a single definitive historical trace."}},
{accent:"#81634b",items:[10,11],ru:{title:"Купцы и торговля",short:"Документы, учёт и перевозка",desc:"В международной чайной торговле участвовали купцы, перевозчики и посредники. Расчёты, упаковка и переговоры обеспечивали движение товаров."},zh:{title:"商人与贸易",short:"账册、结算与运输",desc:"商人、运输者和中介参与跨境茶叶贸易。记账、包装、洽谈和结算维系商贸网络。"},en:{title:"Merchants and commerce",short:"Records, accounting and transport",desc:"Merchants, carriers and middlemen sustained the tea trade through negotiation, packing, accounts and settlements."}},
{accent:"#635469",items:[12,13],ru:{title:"Диалог культур",short:"Чаепитие и культурные связи",desc:"Чай формировал разные традиции гостеприимства в Китае, Монголии и России. Эти обычаи связаны торговлей, но сохраняют собственную историю."},zh:{title:"跨文化交流",short:"饮茶习俗与文化联系",desc:"中国、蒙古与俄罗斯发展出不同的饮茶和待客方式。商贸促进了交流，各地传统也保留自身特点。"},en:{title:"Cultural dialogue",short:"Tea customs and connections",desc:"China, Mongolia and Russia developed distinct tea customs. Trade encouraged exchanges while local traditions retained their individual histories."}}
];
const VISIT_ORDER=[0,1,4,2,3,5,6];
const TOUR_ITEMS=[0,1,2,3,8,9,4,5,6,7,10,11,12,13];
const ITEMS=[
{room:0,url:'https://www.si.edu/object/tea-brick-china-19th-century%3Anmah_1068779',ru:{title:'Кирпичный чай',short:'Прессованные чайные листья',detail:'Условная модель кирпичного чая с волокнистой поверхностью, рельефом и упаковочной лентой. Прессование упрощало хранение и перевозку.'},zh:{title:'砖茶',short:'压制成块的茶叶',detail:'砖茶的示意模型，表现纤维表面、压印纹理和捆扎带。压制方便了茶叶的存储和运输。'},en:{title:'Brick tea',short:'Compressed tea leaves',detail:'A schematic brick-tea model with fibrous surfaces, relief and binding bands. Pressing helped store and transport tea.'}},
{room:0,url:'https://commons.wikimedia.org/wiki/Category:Chinese_tea_sets',ru:{title:'Китайский чайный сервиз',short:'Чайник и посуда',detail:'Реальная 3D-модель чайного сервиза из пользовательского архива free-3d-tea-set.zip. Её можно приблизить и осмотреть с разных сторон. Историческая атрибуция конкретного предмета не установлена.'},zh:{title:'中国茶具',short:'茶壶与茶杯',detail:'来自用户提供的 free-3d-tea-set.zip 的真实茶具三维模型。可从不同角度观察。尚未核实具体文物的历史年代与归属。'},en:{title:'Chinese tea set',short:'Teapot and cups',detail:'An actual 3D tea-set model from the user-supplied free-3d-tea-set.zip. Inspect the object from different angles. The specific model has not been historically attributed.'}},
{room:1,url:'https://russian.people.com.cn/n3/2024/1106/c31521-20238225.html',ru:{title:'Чайный караван',short:'Верблюды с товаром',detail:'Трёхмерная модель двугорбого верблюда из предоставленного пользователем файла camel.glb. Экспонат загружается отдельно и сохраняет исходную текстуру.'},zh:{title:'茶叶商队',short:'负载货物的骆驼',detail:'使用用户提供的 camel.glb 文件制作的双峰驼三维展品，保留模型原始贴图。'},en:{title:'Tea caravan',short:'Pack camels and cargo',detail:'Bactrian camel 3D model supplied by the project owner as camel.glb; original texture is retained.'}},
{room:1,url:'https://ar.culture.ru/tt/exhibition/rossii-chaynoy----staraya-stolica',ru:{title:'Торговые ящики',short:'Деревянная тара и тюки',detail:'Ящики, бумажные ярлыки и крепёжные ремни показаны как собирательный образ грузовой упаковки чайной торговли.'},zh:{title:'贸易茶箱',short:'木箱、标签与绑带',detail:'木箱、纸制标签和捆扎带组成的综合性模型，表现茶叶贸易中的货物包装。'},en:{title:'Tea shipping crates',short:'Wooden chests and bundles',detail:'Crates, paper labels and fastening bands illustrate the packaging used in long-distance tea commerce.'}},
{room:2,url:'https://commons.wikimedia.org/wiki/Category:Kyakhta',ru:{title:'Купеческая лавка',short:'Торговля на границе',detail:'Миниатюрная торговая лавка с навесом, полками и чайными ящиками; художественная реконструкция по образам исторической пограничной торговли.'},zh:{title:'边境商铺',short:'贸易柜台与货物',detail:'带有棚顶、货架和茶箱的微缩商铺，参考历史边境贸易图像创作。'},en:{title:'Merchant trading shop',short:'Border market goods',detail:'A miniature shop with a canopy, shelves and tea boxes; a stylized reconstruction of frontier commerce.'}},
{room:2,url:'https://ar.culture.ru/tt/exhibition/rossii-chaynoy----staraya-stolica',ru:{title:'Пограничные ворота',short:'Кяхта как торговый узел',detail:'Символическая каменная арка и дорожный знак. Это авторский образ пограничной торговли, а не точная реконструкция ворот Кяхты.'},zh:{title:'边境城门',short:'恰克图贸易枢纽',detail:'象征性的石拱门与道路标记。该作品是艺术化的边贸表现，而非恰克图城门的精确复原。'},en:{title:'Frontier gateway',short:'Kyakhta trade hub',detail:'A symbolic stone arch and road marker. This is an interpretive scene, not an exact reconstruction of a Kyakhta gateway.'}},
{room:3,url:'https://commons.wikimedia.org/wiki/Category:Samovars',ru:{title:'Русский самовар',short:'Чайный прибор и чашки',detail:'Подлинная пользовательская 3D-модель самовара из файла samovar.glb со встроенными картами материалов; это цифровая модель, а не исторически атрибутированный музейный скан.'},zh:{title:'俄罗斯茶炊',short:'茶具与茶杯',detail:'用户提供的 samovar.glb 俄罗斯茶炊三维模型，包含材质贴图。'},en:{title:'Russian samovar',short:'Samovar and teacups',detail:'A user-provided textured 3D samovar model from samovar.glb; no specific historical attribution has been established.'}},
{room:3,url:'https://commons.wikimedia.org/wiki/Category:Kyakhta',ru:{title:'Купеческий стол',short:'Карта и торговые записи',detail:'Реконструкция рабочего стола торговца с условной картой, бумагами и чернильницей. Линии маршрута не являются GPS-точной исторической дорогой.'},zh:{title:'商人桌案',short:'商路示意与账册',detail:'带有示意地图、纸张和墨水瓶的商人桌案。路线并不是GPS精确的历史道路。'},en:{title:'Merchant’s writing desk',short:'Trade map and accounts',detail:'A reconstructed desk with a schematic map, papers and ink pot. Route lines are not a historically exact GPS trace.'}}
,
{room:4,url:"https://www.unesco.org/en/silkroads",ru:{title:"Схема Великого чайного пути",short:"Торговые направления",detail:"Схематическая карта основных узлов: Уишань, Чжанцзякоу, Урга (Улан-Батор), Кяхта, российские рынки. Исторические маршруты и перевозки менялись в разные периоды."},zh:{title:"万里茶道路线示意",short:"茶叶运输路线",detail:"示意路线包括武夷山、张家口、库伦（今乌兰巴托）、恰克图及俄罗斯市场。历史路线在不同时期有所变化。"},en:{title:"Schematic Tea Road map",short:"Trade directions",detail:"A schematic chain of nodes from Wuyi Mountains through Zhangjiakou and Urga (Ulaanbaatar) to Kyakhta and Russian markets. Actual routes varied over time."}},
{room:4,url:"https://commons.wikimedia.org/wiki/Category:Kyakhta",ru:{title:"Торговые города",short:"Связь городов и народов",detail:"Учебная 3D-инфографика показывает узлы обмена чаем и информацией. Города представлены условными моделями, а не их точными историческими реконструкциями."},zh:{title:"茶路贸易城市",short:"城市与商贸网络",detail:"三维信息示意呈现沿途商品与信息交流的节点。建筑只是示意模型，不是历史城市的精确复原。"},en:{title:"Trading cities",short:"Networks and exchange",detail:"A conceptual 3D diagram of places where goods and information circulated. The small buildings are symbols, not exact historical reconstructions."}},
{room:5,url:"https://wellcomecollection.org/works/tqzrwdqz",ru:{title:"Купеческие документы",short:"Записи и договоры",detail:"Собирательная реконструкция купеческого стола с бумажными записями. Торговцы вели учёт товара, расходов и платежей; выставленные листы не являются подлинными архивными документами."},zh:{title:"商人账册与文书",short:"账目和交易记录",detail:"桌面与纸张为示意复原。商人通过账册记录货物、成本与支付；展示的纸张并非真实档案原件。"},en:{title:"Merchant records",short:"Ledgers and agreements",detail:"An interpretive merchant desk with illustrative documents. Merchants kept accounts of goods and payments; the displayed papers are not original archival documents."}},
{room:5,url:"https://www.metmuseum.org/art/collection/search/251192",ru:{title:"Упаковка и расчёты",short:"Груз, вес и стоимость",detail:"Художественная композиция с ящиками объясняет упаковку и торговый учёт. Она не воспроизводит конкретный склад или подлинный исторический безмен."},zh:{title:"包装、称量与结算",short:"货物管理",detail:"以木箱组成的复原场景说明包装和贸易结算，不代表某一真实仓库或具体历史衡器。"},en:{title:"Packing and accounting",short:"Cargo, weights and cost",detail:"A reconstructed stack of cargo boxes illustrates packing and accounting, not a specific historical warehouse or surviving scale."}},
{room:6,url:"https://collections.smvk.se/carlotta-em/web/object/1208565",ru:{title:"Три традиции чаепития",short:"Китай, Монголия, Россия",detail:"Сравнительный экспонат о разнообразии способов приготовления чая и приёма гостей. Посуда здесь условная; в культурных традициях есть региональные и временные различия."},zh:{title:"三地饮茶传统",short:"中国、蒙古与俄罗斯",detail:"比较中国、蒙古与俄罗斯不同的饮茶和待客方式。器物为示意模型，各地习俗在地域和时代上存在差异。"},en:{title:"Three tea traditions",short:"China, Mongolia, Russia",detail:"A comparative display about tea preparation and hospitality. The vessels are schematic; customs varied by region and period."}},
{room:6,url:"https://www.unesco.org/en/silkroads",ru:{title:"Чай как культурный мост",short:"Обмен людьми и идеями",detail:"Финальная символическая композиция «Один чайный лист — связь культур». Это авторская инсталляция, напоминающая, что торговые связи сопровождались обменом знаниями и обычаями."},zh:{title:"茶与文明互鉴",short:"一片茶叶，连接不同文明",detail:"“一片茶叶，连接不同文明”是原创象征性装置。茶叶贸易使人员、知识和习俗跨越地域而交流。"},en:{title:"Tea as a cultural bridge",short:"One leaf, many cultures",detail:"A symbolic finale titled “One tea leaf, many cultures.” Trade also enabled the exchange of people, customs and knowledge."}}
];
const UI={
ru:{navHome:'Главная',navRooms:'Залы',navMuseum:'3D-музей',heroEyebrow:'ЦИФРОВОЕ НАСЛЕДИЕ · ИНТЕРАКТИВНАЯ ЭКСПОЗИЦИЯ',heroTitle:'История, в которую<br><i>можно войти.</i>',heroDesc:'Семь виртуальных залов. От китайских чайных мастерских до караванов, Кяхты и чайных традиций России. Исследуйте предметы и слушайте аудиогид.',heroCta:'Войти в музей <span>↗</span>',heroExplore:'Посмотреть залы ↓',roomsKicker:'СЕМЬ ГЛАВ ОДНОЙ ИСТОРИИ',roomsTitle:'Путешествие по залам',roomsDesc:'Выберите главу, чтобы перейти в соответствующий зал музея.',museumKicker:'НАСТОЯЩАЯ WEBGL-СЦЕНА · THREE.JS',museumTitle:'Ваш личный музей',museumDesc:'Выберите зал и экспонат. Камера переместится к нему плавно — без резких переходов.',liveText:'ИНТЕРАКТИВНЫЙ ЗАЛ',stageHint:'Перетаскивайте для обзора · колесо для масштаба',roomNumber:'ЗАЛ',objectLabel:'ЭКСПОНАТЫ ЗАЛА',detailOverline:'ВЫБРАННЫЙ ОБЪЕКТ',source:'Музейный источник ↗',reconstruction:'Авторская реконструкция, не 3D-скан подлинного музейного предмета.',tourStart:'▶ Экскурсия',tourStop:'■ Завершить',tourActive:'Экскурсия идёт',guideHeading:'Аудиогид',guideSub:'Нейронные записи Piper MP3',guideNote:'Наличие русского, китайского и английского голоса зависит от устройства.',play:'Слушать',pause:'Пауза',continue:'Продолжить',footerKicker:'ИСТОРИЯ + ТЕХНОЛОГИИ',footerTitle:'Торговый путь, который<br>стал культурным мостом.',footerDesc:'Виртуальные модели — авторские интерпретации исторических предметов. Первоисточники указаны в карточках. Точные 3D-сканы музейных артефактов и исторические фотографии ими не подменяются.',footerBack:'← На главную',footerTech:'Three.js · Web Speech API',fallback:'Загрузка 3D-пространства…',unavailable:'WebGL недоступен. Тексты и аудиогид остаются доступны.'},
zh:{navHome:'首页',navRooms:'展厅',navMuseum:'3D博物馆',heroEyebrow:'数字文化遗产 · 互动展览',heroTitle:'走进<br><i>历史深处。</i>',heroDesc:'七个虚拟展厅，从中国砖茶制作到商队、恰克图与俄罗斯饮茶文化。可互动查看展品并收听语音导览。',heroCta:'进入博物馆 <span>↗</span>',heroExplore:'探索展厅 ↓',roomsKicker:'七个展厅 · 一段历史',roomsTitle:'展厅之旅',roomsDesc:'选择一个章节，进入对应的虚拟展厅。',museumKicker:'真实的WEBGL三维场景 · THREE.JS',museumTitle:'专属数字博物馆',museumDesc:'选择展厅和展品，镜头平稳移动至展柜前。',liveText:'互动展厅',stageHint:'拖动环顾 · 滚轮缩放',roomNumber:'展厅',objectLabel:'本厅展品',detailOverline:'当前展品',source:'查看馆藏参考 ↗',reconstruction:'原创三维重建，并非馆藏实物的3D扫描。',tourStart:'▶ 自动参观',tourStop:'■ 结束',tourActive:'正在参观',guideHeading:'语音导览',guideSub:'Piper 神经网络录音',guideNote:'中文、俄语和英语声音是否可用取决于设备。',play:'播放导览',pause:'暂停',continue:'继续',footerKicker:'历史 + 技术',footerTitle:'一条贸易道路，<br>一座文化桥梁。',footerDesc:'虚拟模型是根据历史物品类型创作的原创数字作品。展品卡片标注参考来源，模型并非准确3D扫描或真实历史照片。',footerBack:'← 返回首页',footerTech:'Three.js · 浏览器语音合成',fallback:'正在加载3D场景…',unavailable:'无法使用WebGL，仍可阅读文本和使用语音导览。'},
en:{navHome:'Home',navRooms:'Halls',navMuseum:'3D museum',heroEyebrow:'DIGITAL HERITAGE · INTERACTIVE EXHIBITION',heroTitle:'History you can<br><i>step inside.</i>',heroDesc:'Seven virtual halls: from Chinese tea workshops to caravans, Kyakhta and Russian tea traditions. Inspect artifacts and listen to the audio guide.',heroCta:'Enter the museum <span>↗</span>',heroExplore:'Explore the halls ↓',roomsKicker:'SEVEN CHAPTERS · ONE STORY',roomsTitle:'A journey through the halls',roomsDesc:'Choose a chapter to visit its virtual exhibition room.',museumKicker:'REAL WEBGL SCENE · THREE.JS',museumTitle:'Your personal museum',museumDesc:'Choose a hall and an exhibit. The camera moves smoothly between displays.',liveText:'INTERACTIVE GALLERY',stageHint:'Drag to look around · scroll to zoom',roomNumber:'HALL',objectLabel:'EXHIBITS IN THIS HALL',detailOverline:'SELECTED OBJECT',source:'Museum reference ↗',reconstruction:'Original 3D interpretation, not a scan of a museum artifact.',tourStart:'▶ Guided tour',tourStop:'■ End tour',tourActive:'Tour active',guideHeading:'Audio guide',guideSub:'Piper neural MP3',guideNote:'Voice availability for Russian, Chinese and English depends on your device.',play:'Listen',pause:'Pause',continue:'Resume',footerKicker:'HISTORY + TECHNOLOGY',footerTitle:'A trade route that became<br>a cultural bridge.',footerDesc:'Virtual models are original interpretations of historical objects. Museum references are given with each exhibit. They are not authentic 3D scans or substitutes for archival photographs.',footerBack:'← Back to homepage',footerTech:'Three.js · Web Speech API',fallback:'Loading 3D museum…',unavailable:'WebGL unavailable. Text and audio guide remain accessible.'}
};
let lang=localStorage.getItem('gtr-lang')||'ru';if(!UI[lang])lang='ru';let currentRoom=0,currentItem=0;
const el=id=>document.getElementById(id);
function words(){const t=UI[lang]; const lobby={ru:['Главный холл','Добро пожаловать в музей','Перед вами китайский архитектурный холл. Выберите один из семи залов или начните экскурсию.','Начать осмотр ↗'],zh:['中央大厅','欢迎来到万里茶道博物馆','这里是中国风格的中央大厅。请选择展厅或开启导览。','开始参观 ↗'],en:['Entrance hall','Welcome to the museum','You are in the Chinese-style entrance hall. Choose one of seven galleries or start the tour.','Start exploring ↗']}[lang];for(let [id,v] of [['lobbyLabel',lobby[0]],['lobbyTitle',lobby[1]],['lobbyDesc',lobby[2]],['lobbyBegin',lobby[3]]]){if(el(id))el(id).textContent=v;}document.documentElement.lang=lang;for(const [id,val] of Object.entries(t)){if(!el(id))continue;if(['heroTitle','heroCta','footerTitle'].includes(id))el(id).innerHTML=val;else el(id).textContent=val;}document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));el('playLabel').textContent=t.play;el('tourStart').textContent=t.tourStart;el('tourStop').textContent=t.tourStop;el('roomCards').replaceChildren(...VISIT_ORDER.map((i)=>{const r=ROOMS[i];let b=document.createElement('button');b.className='roomCard';b.innerHTML=`<span class="num">0${i+1} / 07</span><span><span class="cardTitle">${r[lang].title}</span><span class="cardText">${r[lang].short}</span></span><span class="arrow">↗</span>`;b.onclick=()=>{changeRoom(i);el('museum').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})};return b}));roomWords();localStorage.setItem('gtr-lang',lang)}
function roomWords(){const r=ROOMS[currentRoom],u=UI[lang],ids=r.items;el('roomNumber').textContent=`${u.roomNumber} 0${VISIT_ORDER.indexOf(currentRoom)+1} / 07`;el('stageHall').textContent=`0${currentRoom+1} / 07`;el('roomName').textContent=r[lang].title;el('roomStory').textContent=r[lang].desc;el('roomTabs').replaceChildren(...VISIT_ORDER.map((i)=>{const rr=ROOMS[i];const b=document.createElement('button');b.textContent=rr[lang].title;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(i===currentRoom));b.onclick=()=>changeRoom(i);return b}));el('objectCards').replaceChildren(...ids.map((idx,j)=>{const b=document.createElement('button');b.innerHTML=`<span>0${j+1} / 02</span>${ITEMS[idx][lang].title}`;b.setAttribute('aria-pressed',String(idx===currentItem));b.onclick=()=>selectItem(idx);return b}));itemWords()}
function itemWords(){const i=ITEMS[currentItem],u=UI[lang];el('itemName').textContent=i[lang].title;el('itemDesc').textContent=i[lang].detail;el('itemSource').textContent=u.source;el('itemSource').href=i.url;el('objectCounter').textContent=`0${ROOMS[currentRoom].items.indexOf(currentItem)+1} / 02`;el('guideNote').textContent=u.guideNote;document.querySelectorAll('#objectCards button').forEach((b,j)=>b.setAttribute('aria-pressed',String(ROOMS[currentRoom].items[j]===currentItem)));window.dispatchEvent(new CustomEvent('museum-narration-focus',{detail:{item:currentItem,lang}}))}
function changeRoom(i){if(tourActive&&!tourAdvancing)stopTour();currentRoom=(i+ROOMS.length)%ROOMS.length;currentItem=ROOMS[currentRoom].items[0];roomWords();window.museumChangeRoom?.(currentRoom,currentItem);stopAudio()}
function selectItem(i){if(tourActive&&!tourAdvancing)stopTour();currentItem=i;itemWords();window.museumSelectItem?.(i);stopAudio()}
// Independent free audio guide, with platform voices and optional Piper recordings.
const museumNarrator=new window.MuseumNarrator({
 getLang:()=>lang,
 getItem:()=>currentItem,
 onStatus:({text,state})=>{
  el('guideState').textContent=state==='playing'?'◉':state==='paused'?'Ⅱ':state==='error'?'!':'○';
  if(text)el('guideNote').textContent=text;
  else el('guideNote').textContent=UI[lang].guideNote;
 }
});
let tourActive=false;
let tourAdvancing=false;
let nextTourTimer=null;
function stopAudio(){museumNarrator.stop()}
function playAudio(){
 const narrationItem=currentItem;
 const narrationLang=lang;
 museumNarrator.play({
  item:narrationItem,
  lang:narrationLang,
  volume:Number(el('audioVolume').value),
  onEnd:()=>{
   if(tourActive){
    nextTourTimer=setTimeout(()=>{
     nextTourTimer=null;
     if(tourActive)advanceTour();
    },900);
   }
  }
 });
}
function pauseAudio(){museumNarrator.togglePause()}
function stopTour(){
 tourActive=false;
 if(nextTourTimer){clearTimeout(nextTourTimer);nextTourTimer=null}
 el('tourStatus').textContent='';
 stopAudio();
}
function advanceTour(){
 if(!tourActive)return;
 const nextIndex=TOUR_ITEMS.indexOf(currentItem)+1;
 if(nextIndex>=TOUR_ITEMS.length){stopTour();return}
 const next=TOUR_ITEMS[nextIndex];
 tourAdvancing=true;
 if(ITEMS[next].room!==currentRoom)changeRoom(ITEMS[next].room);
 selectItem(next);
 tourAdvancing=false;
 playAudio();
}
el('tourStart').onclick=()=>{
 stopTour();
 tourActive=true;
 el('tourStatus').textContent=UI[lang].tourActive;
 playAudio();
};
el('tourStop').onclick=stopTour;
el('audioPlay').onclick=()=>{if(tourActive)stopTour();playAudio()};
el('audioPause').onclick=pauseAudio;
el('audioStop').onclick=stopTour;
el('prevRoom').onclick=()=>changeRoom(VISIT_ORDER[(VISIT_ORDER.indexOf(currentRoom)+VISIT_ORDER.length-1)%VISIT_ORDER.length]);el('nextRoom').onclick=()=>changeRoom(VISIT_ORDER[(VISIT_ORDER.indexOf(currentRoom)+1)%VISIT_ORDER.length]);document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{stopAudio();lang=b.dataset.lang;words();window.dispatchEvent(new CustomEvent('museum-language-changed',{detail:{lang}}));museumNarrator.refreshVoices()});window.addEventListener('pagehide',stopTour);
words();
// Deep links from the Tea Road route: ?room=0..6&item=0..13
(function(){
 const params=new URLSearchParams(location.search);
 if(!params.has('room'))return;
 const room=Number(params.get('room')),item=Number(params.get('item'));
 if(!Number.isInteger(room)||room<0||room>=ROOMS.length)return;
 currentRoom=room;
 currentItem=Number.isInteger(item)&&ROOMS[room].items.includes(item)?item:ROOMS[room].items[0];
 roomWords();
 window.__gtrInitialRoom={room:currentRoom,item:currentItem};
 window.addEventListener('load',()=>{
  document.getElementById('museum')?.scrollIntoView({behavior:'instant',block:'start'});
 },{once:true});
})();

// Original 3D meshes are not museum scans. Imported assets are credited in ASSET_CREDITS.md.
window.changeRoom=changeRoom;
