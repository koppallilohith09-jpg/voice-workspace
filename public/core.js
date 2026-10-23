export function parseCommand(text){
 const s=text.toLowerCase().trim().replace(/[.!?]+$/,'');
 if(/^open (calculator|notepad)$/.test(s))return{type:'launch',app:s.split(' ')[1]};
 const timer=s.match(/^(?:set (?:a )?)?timer(?: for)? (\d+(?:\.\d+)?) (seconds?|minutes?|hours?)$/);
 if(timer){const seconds=Number(timer[1])*(timer[2].startsWith('hour')?3600:timer[2].startsWith('minute')?60:1);if(seconds>0&&seconds<=86400)return{type:'timer',seconds}}
 if(s.startsWith('find '))return{type:'find',query:text.trim().slice(5).trim()};
 if(/^(what time is it|time)$/.test(s))return{type:'time'};return{type:'unknown'};
}
