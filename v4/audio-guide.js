/* Great Tea Road free guided narration.
 * No paid API or keys. Browser voices are the fallback; optional files
 * created with Piper TTS are played when listed in audio-guide-manifest.json.
 */
(function(){
'use strict';
const LOCALES={ru:'ru-RU',zh:'zh-CN',en:'en-US'};
const STRINGS={
 ru:{voice:'Голос',speed:'Темп',auto:'Автоматический выбор',progress:'Рассказываем об экспонате',unavailable:'Синтез речи не поддерживается. Для озвучки установите голос в настройках устройства.',loading:'Загружаем рассказ…',playing:'Аудиогид рассказывает',paused:'Пауза',error:'Голос не запустился. Попробуйте другой голос.',ready:'Выберите экспонат и нажмите «Слушать».',natural:'Нейронная запись'},
 zh:{voice:'声音',speed:'语速',auto:'自动选择',progress:'正在讲解展品',unavailable:'此浏览器不支持语音合成。请在设备设置中安装语音。',loading:'正在加载讲解…',playing:'正在播放语音讲解',paused:'已暂停',error:'语音无法播放，请更换声音。',ready:'选择展品后点击播放。',natural:'神经网络录音'},
 en:{voice:'Voice',speed:'Speed',auto:'Automatic',progress:'Narrating the exhibit',unavailable:'Speech synthesis is not supported. Install a voice in device settings.',loading:'Loading the story…',playing:'Playing the audio guide',paused:'Paused',error:'The voice could not start. Try another voice.',ready:'Select an exhibit and press Play.',natural:'Neural recording'}
};
const LANG_PREFIX={ru:'ru',zh:'zh',en:'en'};
const defaults={ru:.91,zh:.94,en:.95};
const preferenceScore=v=>{
 const name=v.name.toLowerCase();
 let score=0;
 if(/natural|neural|enhanced|premium|online|siri/.test(name))score+=60;
 if(/microsoft|google|apple/.test(name))score+=16;
 if(v.localService===false)score+=12;
 if(v.default)score+=8;
 return score;
};
class MuseumNarrator{
 constructor(options={}){
  this.options=options;
  this.serial=0;
  this.speaking=false;
  this.paused=false;
  this.currentAudio=null;
  this.waitTimer=null;
  this.scripts={};
  this.manifest={};
  this.voices=[];
  this.selectedVoice={};
  this.rate=Number(localStorage.getItem('gtr-voice-rate')||'1');
  this.rate=Number.isFinite(this.rate)?Math.min(1.2,Math.max(.8,this.rate)):1;
  this.buildControls();
  this.loadData();
  this.refreshVoices();
  if(window.speechSynthesis){
   window.speechSynthesis.addEventListener?.('voiceschanged',()=>this.refreshVoices());
   setTimeout(()=>this.refreshVoices(),900);
  }
 }
 translate(key){return (STRINGS[this.options.getLang?.()||'ru']||STRINGS.ru)[key];}
 buildControls(){
  const root=document.querySelector('.guide');
  if(!root)return;
  const wrap=document.createElement('div');
  wrap.className='narrator-options';
  wrap.style.cssText='display:flex;flex-wrap:wrap;gap:9px;align-items:end;margin-top:12px';
  const voiceLabel=document.createElement('label');
  voiceLabel.style.cssText='display:grid;gap:4px;flex:1 1 150px;font-size:12px;color:#d2d9cb';
  const voiceTitle=document.createElement('span');
  voiceTitle.textContent=this.translate('voice');
  this.voiceSelect=document.createElement('select');
  this.voiceSelect.setAttribute('aria-label',this.translate('voice'));
  this.voiceSelect.style.cssText='max-width:100%;width:100%;padding:9px 8px;background:#13231b;border:1px solid #ad986e77;color:#f9f0dc;border-radius:10px;font:12px system-ui';
  voiceLabel.append(voiceTitle,this.voiceSelect);
  const rateLabel=document.createElement('label');
  rateLabel.style.cssText='display:grid;gap:4px;flex:1 1 125px;font-size:12px;color:#d2d9cb';
  const rateTitle=document.createElement('span');
  this.rateText=rateTitle;
  this.rateSlider=document.createElement('input');
  this.rateSlider.type='range';
  this.rateSlider.min='0.8';this.rateSlider.max='1.2';this.rateSlider.step='.05';this.rateSlider.value=String(this.rate);
  this.rateSlider.style.cssText='width:100%;accent-color:#c7a56d';
  rateLabel.append(rateTitle,this.rateSlider);
  wrap.append(voiceLabel,rateLabel);
  root.querySelector('.guideControls')?.insertAdjacentElement('afterend',wrap);
  this.voiceSelect.addEventListener('change',()=>{
   const lang=this.options.getLang();
   this.selectedVoice[lang]=this.voiceSelect.value;
   localStorage.setItem('gtr-voice-'+lang,this.voiceSelect.value);
  });
  this.rateSlider.addEventListener('input',()=>{
   this.rate=Number(this.rateSlider.value);
   localStorage.setItem('gtr-voice-rate',String(this.rate));
   this.refreshLabels();
  });
  this.refreshLabels();
 }
 refreshLabels(){
  if(!this.voiceSelect)return;
  this.voiceSelect.setAttribute('aria-label',this.translate('voice'));
  this.rateText.textContent=this.translate('speed')+': '+this.rate.toFixed(2)+'×';
  const lab=this.voiceSelect.parentElement.querySelector('span');
  if(lab)lab.textContent=this.translate('voice');
 }
 refreshVoices(){
  const synth=window.speechSynthesis;
  this.voices=synth?.getVoices?.()||[];
  if(!this.voiceSelect)return;
  const lang=this.options.getLang?.()||'ru';
  const prefix=LANG_PREFIX[lang];
  const list=this.voices.filter(v=>v.lang.toLowerCase().startsWith(prefix)).sort((a,b)=>preferenceScore(b)-preferenceScore(a));
  this.voiceSelect.replaceChildren();
  const auto=document.createElement('option');auto.value='';auto.textContent=this.translate('auto');this.voiceSelect.add(auto);
  for(const voice of list){
   const option=document.createElement('option');option.value=voice.voiceURI;
   option.textContent=voice.name+' · '+voice.lang;
   this.voiceSelect.add(option);
  }
  const stored=this.selectedVoice[lang]??localStorage.getItem('gtr-voice-'+lang)??'';
  this.selectedVoice[lang]=stored;
  this.voiceSelect.value=stored;
  if(this.voiceSelect.selectedIndex<0)this.voiceSelect.value='';
  this.refreshLabels();
 }
 async loadData(){
  try{
   const resp=await fetch('./audio-guide-scripts.json?v=1');
   if(!resp.ok)throw Error('HTTP '+resp.status);
   const json=await resp.json();
   for(const [i,item] of json.items.entries())this.scripts[i]=item;
  }catch(e){console.warn('Museum narration scripts failed to load',e);}
  try{
   const resp=await fetch('./audio-guide-manifest.json?v=1');
   if(resp.ok)this.manifest=await resp.json();
  }catch(e){/* No optional prerecorded tracks */ }
 }
 chooseVoice(lang){
  const list=this.voices.filter(v=>v.lang.toLowerCase().startsWith(LANG_PREFIX[lang]));
  const desired=this.voiceSelect?.value||this.selectedVoice[lang]||'';
  return list.find(v=>v.voiceURI===desired)||list.sort((a,b)=>preferenceScore(b)-preferenceScore(a))[0]||null;
 }
 info(message,state){
  this.options.onStatus?.({text:message,state:state||'idle'});
 }
 stop(){
  ++this.serial;
  if(this.waitTimer){clearTimeout(this.waitTimer);this.waitTimer=null;}
  this.currentAudio?.pause();this.currentAudio=null;
  window.speechSynthesis?.cancel();
  this.speaking=false;this.paused=false;
  this.info('','idle');
 }
 togglePause(){
  if(!this.speaking)return;
  if(this.currentAudio){
   if(this.paused)this.currentAudio.play().catch(()=>{});else this.currentAudio.pause();
  }else if(window.speechSynthesis){
   if(this.paused)window.speechSynthesis.resume();else window.speechSynthesis.pause();
  }
  this.paused=!this.paused;
  this.info(this.translate(this.paused?'paused':'playing'),this.paused?'paused':'playing');
 }
 async play({item,lang,volume=1,onEnd}){
  this.stop();
  const serial=this.serial;
  this.speaking=true;
  this.info(this.translate('loading'),'loading');
  // Start only following a user tap. Downloaded Piper recordings are optional.
  if(!this.scripts[item])await this.loadData();
  if(serial!==this.serial)return;
  const clip=this.manifest?.[lang]?.[item];
  if(clip){
   const audio=new Audio(clip);
   this.currentAudio=audio;
   audio.volume=volume;
   audio.onended=()=>this.finish(serial,onEnd);
   audio.onerror=()=>{if(serial===this.serial){this.currentAudio=null;this.speakBrowser(item,lang,volume,onEnd,serial);}};
   try{
    await audio.play();
    if(serial===this.serial)this.info(this.translate('natural'),'playing');
    return;
   }catch(e){
    this.currentAudio=null;
   }
  }
  this.speakBrowser(item,lang,volume,onEnd,serial);
 }
 speakBrowser(item,lang,volume,onEnd,serial){
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){
   this.info(this.translate('unavailable'),'error');this.speaking=false;return;
  }
  const txt=this.scripts[item]?.[lang]||'';
  if(!txt){this.info(this.translate('error'),'error');this.speaking=false;return;}
  // Short phrases avoid Chrome's long-utterance cutoff and improve phrasing.
  const parts=(txt.match(/[^.!?。！？]+[.!?。！？]?/g)||[txt]).map(x=>x.trim()).filter(Boolean);
  let cursor=0;
  const speakNext=()=>{
   if(serial!==this.serial||this.paused)return;
   if(cursor>=parts.length){this.finish(serial,onEnd);return;}
   const utterance=new SpeechSynthesisUtterance(parts[cursor++]);
   utterance.lang=LOCALES[lang];
   const voice=this.chooseVoice(lang);if(voice)utterance.voice=voice;
   utterance.rate=defaults[lang]*this.rate;
   utterance.pitch=1;utterance.volume=volume;
   utterance.onstart=()=>{if(serial===this.serial)this.info(this.translate('progress')+' · '+cursor+'/'+parts.length,'playing');};
   utterance.onend=()=>{
    if(serial!==this.serial)return;
    this.waitTimer=setTimeout(()=>{this.waitTimer=null;speakNext();},lang==='zh'?190:250);
   };
   utterance.onerror=e=>{
    if(serial!==this.serial||e.error==='canceled'||e.error==='interrupted')return;
    this.info(this.translate('error'),'error');
    this.speaking=false;
   };
   window.speechSynthesis.speak(utterance);
  };
  speakNext();
 }
 finish(serial,onEnd){
  if(serial!==this.serial)return;
  this.speaking=false;this.paused=false;this.currentAudio=null;
  this.info('','idle');
  onEnd?.();
 }
}
window.MuseumNarrator=MuseumNarrator;
})();