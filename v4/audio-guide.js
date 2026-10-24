/* Great Tea Road audio guide: one MP3 playback engine for all museum exhibits.
   Neural voice recordings are committed in ./audio/<lang>/<item>.mp3.
   Browser speech synthesis is intentionally NOT used: it caused overlapping,
   inconsistent voices and delays between exhibit 1 and exhibit 2. */
(function () {
 'use strict';
 const VOICES={ru:'Dmitri',zh:'Chaowen',en:'Kristin'};
 const LANG={ru:'ru',zh:'zh',en:'en'};
 const COPY={
  ru:{voice:'Голос аудиогида',speed:'Скорость',play:'Воспроизводится',pause:'Пауза',loading:'Загружаем нейронную запись…',error:'Запись не загрузилась. Попробуйте ещё раз.',ready:'Нажмите «Слушать».',format:'Нейронный голос: '},
  zh:{voice:'语音导览',speed:'语速',play:'正在播放',pause:'暂停',loading:'正在加载录音…',error:'录音加载失败，请重试。',ready:'点击播放收听。',format:'神经网络语音：'},
  en:{voice:'Museum voice',speed:'Speed',play:'Playing',pause:'Paused',loading:'Loading neural recording…',error:'Recording could not load. Try again.',ready:'Press Play to listen.',format:'Neural voice: '}
 };
 class MuseumNarrator{
  constructor(options={}){
   this.options=options;
   this.serial=0;
   this.speaking=false;
   this.paused=false;
   this.currentTrack=null;
   this.rate=Number(localStorage.getItem('gtr-voice-rate')||1);
   this.rate=Number.isFinite(this.rate)?Math.min(1.5,Math.max(.75,this.rate)):1;
   this.tabId=String(Date.now())+'-'+Math.random().toString(36).slice(2);
   this.audio=new Audio();
   this.audio.preload='auto';
   this.audio.preservesPitch=true;
   this.audio.playbackRate=this.rate;
   this.currentAudio=null;
   this.voiceSelect=null;
   this._finish=null;
   this._prefetched=new Set();
   this.buildControls();
   // Prevent any queued legacy Web Speech narration from continuing.
   try{window.speechSynthesis?.cancel();}catch(e){}
   const BC=window.BroadcastChannel;
   this.channel=typeof BC==='function'?new BC('great-tea-road-narration-v3'):null;
   this.channel?.addEventListener('message',e=>{if(e.data?.kind==='start'&&e.data.owner!==this.tabId)this.stop();});
   window.addEventListener('storage',e=>{if(e.key!=='gtr-narration-active'||!e.newValue)return;
    try{if(JSON.parse(e.newValue).owner!==this.tabId)this.stop();}catch(err){}});
   document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop();});
   window.addEventListener('pagehide',()=>this.stop());
   window.addEventListener('museum-narration-focus',e=>{
    const {item,lang}=e.detail||{};
    if(Number.isInteger(item)&&LANG[lang])this.prefetch(item,lang);
   });
   this.audio.addEventListener('ended',()=>{
    if(!this.speaking||this.paused)return;
    const fn=this._finish;
    this.stop();
    fn?.();
   });
   this.audio.addEventListener('error',()=>{
    if(!this.speaking)return;
    this.fail();
   });
   this.refreshVoices();
  }
  lang(){const lang=this.options.getLang?.()||'ru';return LANG[lang]?lang:'ru';}
  t(key){return (COPY[this.lang()]||COPY.ru)[key];}
  url(item,lang){return './audio/'+lang+'/'+item+'.mp3';}
  status(message,state='idle'){this.options.onStatus?.({text:message,state});}
  buildControls(){
   const root=document.querySelector('.guide');
   if(!root)return;
   const block=document.createElement('div');
   block.className='narrator-options';
   block.style.cssText='display:flex;flex-wrap:wrap;gap:9px;align-items:end;margin-top:12px';
   const voiceLabel=document.createElement('label');
   voiceLabel.style.cssText='display:grid;gap:4px;flex:1 1 150px;font-size:12px;color:#d2d9cb';
   this.voiceTitle=document.createElement('span');
   this.voiceSelect=document.createElement('select');
   this.voiceSelect.disabled=true;
   this.voiceSelect.style.cssText='width:100%;padding:9px 8px;background:#13231b;border:1px solid #ad986e77;color:#f9f0dc;border-radius:10px;font:12px system-ui;opacity:.85';
   voiceLabel.append(this.voiceTitle,this.voiceSelect);
   const rateLabel=document.createElement('label');
   rateLabel.style.cssText='display:grid;gap:4px;flex:1 1 125px;font-size:12px;color:#d2d9cb';
   this.rateText=document.createElement('span');
   this.rateSlider=document.createElement('input');
   this.rateSlider.type='range';this.rateSlider.min='.75';this.rateSlider.max='1.5';this.rateSlider.step='.05';
   this.rateSlider.value=String(this.rate);
   this.rateSlider.style.cssText='width:100%;accent-color:#c7a56d';
   rateLabel.append(this.rateText,this.rateSlider);
   block.append(voiceLabel,rateLabel);
   root.querySelector('.guideControls')?.insertAdjacentElement('afterend',block);
   this.rateSlider.addEventListener('input',()=>{
    this.rate=Number(this.rateSlider.value);
    this.audio.playbackRate=this.rate;
    this.audio.defaultPlaybackRate=this.rate;
    try{localStorage.setItem('gtr-voice-rate',String(this.rate))}catch(e){}
    this.refreshLabels();
   });
   this.refreshLabels();
  }
  refreshLabels(){
   if(this.rateText)this.rateText.textContent=this.t('speed')+': '+this.rate.toFixed(2)+'×';
   if(this.voiceTitle)this.voiceTitle.textContent=this.t('voice');
   if(this.voiceSelect){
    this.voiceSelect.replaceChildren();
    const o=document.createElement('option');
    o.value=this.lang();o.textContent=this.t('format')+VOICES[this.lang()];
    this.voiceSelect.add(o);
   }
  }
  refreshVoices(){this.refreshLabels();}
  prefetch(item,lang){
   if(!LANG[lang]||!Number.isInteger(item)||item<0||item>7)return;
   const key=lang+':'+item;
   if(this._prefetched.has(key))return;
   this._prefetched.add(key);
   if(!('fetch' in window))return;
   // One short MP3 per exhibit; use the ordinary HTTP cache, not extra Audio elements.
   window.fetch(this.url(item,lang),{cache:'force-cache'})
    .then(resp=>{if(!resp.ok)this._prefetched.delete(key);})
    .catch(()=>this._prefetched.delete(key));
  }
  stop(){
   ++this.serial;this._finish=null;
   try{this.audio.pause();this.audio.currentTime=0;}catch(e){}
   this.speaking=false;this.paused=false;this.currentAudio=null;this.currentTrack=null;
   try{window.speechSynthesis?.cancel();}catch(e){}
   this.status('','idle');
  }
  fail(){
   this.stop();this.status(this.t('error'),'error');
  }
  claim(){
   const msg={kind:'start',owner:this.tabId,at:Date.now()};
   this.channel?.postMessage(msg);
   try{localStorage.setItem('gtr-narration-active',JSON.stringify(msg))}catch(e){}
  }
  async togglePause(){
   if(!this.speaking)return;
   if(!this.paused){
    this.paused=true;this.audio.pause();
    this.status(this.t('pause'),'paused');return;
   }
   this.claim();
   this.paused=false;
   const token=this.serial;
   try{
    await this.audio.play();
    if(token!==this.serial){this.audio.pause();return;}
    this.status(this.t('play'),'playing');
   }catch(e){if(token===this.serial){this.paused=true;this.status(this.t('error'),'error');}}
  }
  async play({item,lang,volume=1,onEnd}){
   if(!LANG[lang]||!Number.isInteger(item)||item<0||item>7){this.fail();return;}
   if(this.speaking&&this.currentTrack?.item===item&&this.currentTrack?.lang===lang){
    if(this.paused)await this.togglePause();
    return; // Same item: never create or restart another audio track.
   }
   this.stop();
   this.claim();
   const token=this.serial;
   this.currentTrack={item,lang};
   this.speaking=true;
   this._finish=onEnd;
   this.currentAudio=this.audio;
   const next=this.url(item,lang);
   this.audio.pause();
   this.audio.src=next;
   this.audio.preload='auto';
   this.audio.playbackRate=this.rate;
   this.audio.volume=Math.max(0,Math.min(1,Number(volume)||0));
   this.status(this.t('loading'),'loading');
   try{
    await this.audio.play();
    if(token!==this.serial)return; // Stale play() must never restart another voice.
    if(this.paused){this.audio.pause();return;}
    this.status(this.t('play'),'playing');
   }catch(err){if(token===this.serial)this.fail();}
  }
 }
 window.MuseumNarrator=MuseumNarrator;
})();
