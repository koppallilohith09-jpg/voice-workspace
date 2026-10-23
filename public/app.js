import {$,el,notify,request,action} from './common.js';import {parseCommand} from './core.js';
let selected=[],timers=[],recognition=null;const history=[];
function reply(text){$('#reply').textContent=text;if($('#speak').checked&&'speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text))}}
function log(text){history.unshift(text);history.splice(30);$('#history').replaceChildren(...history.map(x=>el('li',x)))}
async function run(text){
 log(text);const c=parseCommand(text);
 if(c.type==='launch'){await request('/api/launch?app='+c.app,{method:'POST'});reply('Opened '+c.app+'.')}
 else if(c.type==='timer'){timers.push({id:crypto.randomUUID(),end:Date.now()+c.seconds*1000,done:false});renderTimers();reply('Timer started. Keep this tab open.')}
 else if(c.type==='find'){
  const list=$('#files');list.replaceChildren();const matches=selected.filter(f=>(f.webkitRelativePath||f.name).toLowerCase().includes(c.query.toLowerCase()));
  for(const f of matches.slice(0,100)){const li=el('li',f.webkitRelativePath||f.name);li.append(action('Download / open',()=>{const u=URL.createObjectURL(f),a=el('a');a.href=u;a.download=f.name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}));list.append(li)}
  reply(matches.length+' matching files in your selected folder.');
 }else if(c.type==='time')reply(new Date().toLocaleTimeString());
 else reply('Supported: open calculator, open notepad, timer 5 minutes, find filename, what time is it.');
}
$('#command-form').onsubmit=e=>{e.preventDefault();run($('#command').value).catch(e=>notify(e.message))};
$('#folder').onchange=e=>{selected=[...e.target.files];$('#folder-summary').textContent=selected.length+' filenames available. Nothing uploaded.'};
function renderTimers(){
 const list=$('#timers');list.replaceChildren();if(!timers.length)list.append(el('p','No active timers.'));
 for(const t of timers){const remaining=Math.max(0,Math.ceil((t.end-Date.now())/1000));if(!remaining&&!t.done){t.done=true;reply('Timer finished.');notify('Timer finished.')}
  const div=el('div',undefined,'row');div.append(el('span',remaining?Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0'):'Finished','timer'),action('Dismiss',()=>{timers=timers.filter(x=>x.id!==t.id);renderTimers()},'secondary'));list.append(div);
 }
}
setInterval(renderTimers,1000);renderTimers();
const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!Recognition){$('#listen').disabled=true;$('#mic-status').textContent='Voice recognition unavailable. Typed commands remain available.'}
else{
 recognition=new Recognition();recognition.lang='en-US';recognition.continuous=false;recognition.interimResults=false;
 recognition.onresult=e=>{const text=e.results[0][0].transcript;$('#command').value=text;run(text).catch(e=>notify(e.message))};
 recognition.onerror=e=>notify('Microphone/recognition: '+e.error);
 recognition.onend=()=>{$('#listen').disabled=false;$('#stop').disabled=true;$('#mic-status').textContent='Microphone off.'};
 $('#listen').onclick=()=>{try{recognition.start();$('#listen').disabled=true;$('#stop').disabled=false;$('#mic-status').textContent='Listening for one command. Your browser may send audio to its recognition provider.'}catch(e){notify(e.message)}};
 $('#stop').onclick=()=>recognition.abort();window.addEventListener('pagehide',()=>recognition.abort());
}
