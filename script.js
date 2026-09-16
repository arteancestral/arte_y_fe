const toast=document.querySelector('.toast');let timer;
function announce(label){if(!toast)return;toast.textContent=`${label}: botón listo · enlace pendiente de configurar`;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),1800)}
document.querySelectorAll('[data-placeholder]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();announce(el.dataset.placeholder)}));

const audio=document.getElementById('bgMusic');
if(audio){
 const playPause=document.getElementById('playPause'),seek=document.getElementById('seek'),currentTimeEl=document.getElementById('currentTime'),durationEl=document.getElementById('duration'),volume=document.getElementById('volume'),muteBtn=document.getElementById('muteBtn'),autoplayNote=document.getElementById('autoplayNote');
 const savedVolume=Number(sessionStorage.getItem('artefeVolume')); if(Number.isFinite(savedVolume)) volume.value=savedVolume;
 audio.volume=Number(volume.value); audio.muted=sessionStorage.getItem('artefeMuted')==='1';
 const formatTime=s=>{if(!Number.isFinite(s))return'0:00';const m=Math.floor(s/60),sec=Math.floor(s%60).toString().padStart(2,'0');return`${m}:${sec}`};
 function updatePlayButton(){const playing=!audio.paused;playPause.innerHTML=playing?'<span aria-hidden="true">❚❚</span>':'<span aria-hidden="true">▶</span>';playPause.setAttribute('aria-label',playing?'Pausar música':'Reproducir música');muteBtn.textContent=audio.muted?'🔇':'🔊'}
 function note(msg){autoplayNote.textContent=msg;autoplayNote.classList.add('show');setTimeout(()=>autoplayNote.classList.remove('show'),5000)}
 function saveAudioState(){sessionStorage.setItem('artefeTime',String(audio.currentTime||0));sessionStorage.setItem('artefePaused',audio.paused?'1':'0');sessionStorage.setItem('artefeVolume',String(audio.volume));sessionStorage.setItem('artefeMuted',audio.muted?'1':'0');sessionStorage.setItem('artefeSavedAt',String(Date.now()))}
 playPause.addEventListener('click',async()=>{try{audio.paused?await audio.play():audio.pause()}catch(e){note('El navegador requiere una interacción para reproducir audio.')}saveAudioState();updatePlayButton()});
 audio.addEventListener('loadedmetadata',async()=>{durationEl.textContent=formatTime(audio.duration);let t=Number(sessionStorage.getItem('artefeTime'));const wasPaused=sessionStorage.getItem('artefePaused')==='1';const savedAt=Number(sessionStorage.getItem('artefeSavedAt'));if(Number.isFinite(t)&&t>0){if(!wasPaused&&Number.isFinite(savedAt))t+=(Date.now()-savedAt)/1000;if(Number.isFinite(audio.duration)&&audio.duration>0)t=t%audio.duration;audio.currentTime=t}if(!wasPaused){try{await audio.play()}catch(e){updatePlayButton();note('Pulsa ▶ para activar la música. Tu navegador bloqueó el autoplay con sonido.')}}updatePlayButton()});
 audio.addEventListener('timeupdate',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0){seek.value=(audio.currentTime/audio.duration)*100;currentTimeEl.textContent=formatTime(audio.currentTime)}if(Math.floor(audio.currentTime*2)%4===0)saveAudioState()});audio.addEventListener('play',()=>{saveAudioState();updatePlayButton()});audio.addEventListener('pause',()=>{saveAudioState();updatePlayButton()});
 seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=(Number(seek.value)/100)*audio.duration;saveAudioState()});volume.addEventListener('input',()=>{audio.volume=Number(volume.value);audio.muted=false;saveAudioState();updatePlayButton()});muteBtn.addEventListener('click',()=>{audio.muted=!audio.muted;saveAudioState();updatePlayButton()});
 document.querySelectorAll('a.nav-btn, a.gallery-card, a.back-btn, a.hotspot[href]').forEach(a=>a.addEventListener('click',saveAudioState));
 window.addEventListener('pagehide',saveAudioState);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveAudioState()});
 document.addEventListener('pointerdown',async e=>{if(e.target.closest('.audio-bar'))return;if(audio.paused&&sessionStorage.getItem('artefePaused')!=='1'){try{await audio.play();updatePlayButton()}catch(e){}}},{once:true});
 updatePlayButton();
}