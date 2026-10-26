(function(root){
'use strict';
// Closed-domain, original templates. IDs encode the value and direction; never
// use a random identity or reinterpret the old numbers-q/time-q snapshots.
const stages=['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2'];
const units=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];
const tens=['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
const hundreds=['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
const months=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const days=[31,28,31,30,31,30,31,31,30,31,30,31];
function number(n,gender=null){
 if(!Number.isInteger(n)||n<0||n>9999||![null,'m','f'].includes(gender))throw Error('Unsupported Spanish number');
 let s;if(n<30)s=units[n];else if(n<100)s=tens[Math.floor(n/10)]+(n%10?' y '+units[n%10]:'');else if(n===100)s='cien';else if(n<1000)s=hundreds[Math.floor(n/100)]+(n%100?' '+number(n%100):'');else s=(Math.floor(n/1000)===1?'mil':number(Math.floor(n/1000),'m')+' mil')+(n%1000?' '+number(n%1000):'');
 if(gender==='f')s=s.replace(/(?:doscientos|trescientos|cuatrocientos|quinientos|seiscientos|setecientos|ochocientos|novecientos)/g,x=>x.slice(0,-2)+'as').replace(/veintiuno$/,'veintiuna').replace(/uno$/,'una');
 if(gender==='m')s=s.replace(/veintiuno$/,'veintiún').replace(/uno$/,'un');return s;
}
function time(hour,minute){
 if(!Number.isInteger(hour)||hour<0||hour>23||!Number.isInteger(minute)||minute<0||minute>59||minute%5)throw Error('Unsupported clock time');
 let h=hour%12||12,m=minute,less=m>30;if(less){h=h%12+1;m=60-m;}
 return (h===1?'Es la una':'Son las '+number(h))+(m===0?' en punto':(less?' menos ':' y ')+(m===15?'cuarto':m===30?'media':number(m)));
}
const pad=n=>String(n).padStart(2,'0');
function date(day,month){if(!Number.isInteger(month)||month<1||month>12||!Number.isInteger(day)||day<1||day>days[month-1])throw Error('Invalid day/month');return 'el '+number(day)+' de '+months[month-1];}
function price(cents){if(!Number.isInteger(cents)||cents<100||cents>999999)throw Error('Unsupported price');let euros=Math.floor(cents/100),c=cents%100;return number(euros,'m')+(euros===1?' euro':' euros')+(c?' con '+number(c,'m')+(c===1?' céntimo':' céntimos'):'');}
const priceDisplay=n=>Math.floor(n/100)+','+pad(n%100)+' €';
const cache=new Map();
function pool(profile){
 const key=[profile.level,!!profile.time,!!profile.prices,!!profile.dates].join('|');if(cache.has(key))return cache.get(key);
 const level=stages.indexOf(profile.level),max=level===0?20:level===1?100:level<=3?999:9999,bank=[];
 function add(category,value,display,spanish,alternatives,minStage,visual){
  const code=minStage.toLowerCase().replace('.',''),id='skill-numbers-gen-'+code+'-'+category+'-'+value;
  const directions=['value','reverse','audio'];
  for(const direction of directions){const reverse=direction==='reverse',audio=direction==='audio',answer=reverse||audio?display:spanish,options=reverse||audio?[display,...alternatives.map(x=>x[0])]:[spanish,...alternatives.map(x=>x[1])];
   if(new Set(options.map(x=>x.toLowerCase())).size!==4)throw Error('Ambiguous numeric options: '+id);
   const clip=category==='prices'?'Cuesta '+spanish+'.':category==='dates'?'El tren sale '+spanish+'.':spanish;
   const labels={numbers:'number',time:'time (12-hour clock)',prices:'price',dates:'date (day/month)'};
   bank.push({id:id+'-'+direction,type:'choice',mode:audio?'listening':'recognition',topic:{numbers:'Numbers',time:'Time',prices:'Prices',dates:'Dates'}[category],practiceCategory:category,prompt:audio?'Listen, then choose the '+labels[category]+'.':reverse?'Choose the '+labels[category]+': '+(category==='dates'?clip:spanish):category==='time'&&visual?'Which Spanish expression matches the clock?':(category==='prices'?'At the '+(Number(value)<2100?'café':'shop')+'. ':category==='dates'?'Train travel. ':'')+'Read the '+labels[category]+': '+display,answer,options,optionsLanguage:reverse||audio?'en':'es',...(reverse?{spanishFragments:[category==='dates'?clip:spanish]}:{}),...(audio?{listening:{transcript:clip,lang:'es-ES',rate:.9}}:{}),...(!reverse&&!audio&&visual?{practiceVisual:visual}:{}),explanation:category==='dates'?'Spain uses day/month. '+display+' means '+spanish+'.':category==='time'?display+' = '+spanish+'. Use es la with one and son las with other hours. Menos counts towards the next hour.':display+' = '+spanish+'. '+(category==='prices'?'Con joins euros and céntimos; un euro, veintiún euros.':'Read the whole value, not just the final digit.')});
  }
 }
 const values=Array.from({length:Math.min(max,100)+1},(_,i)=>i);if(max>=999)for(let n=107;n<=999;n+=7)values.push(n);if(max>999)for(let n=1000;n<=9999;n+=137)values.push(n);
 for(const n of values){const others=[n+1,n+10,n+11,n-1,n-10,n-2,n+2,n+3].filter(x=>x>=0&&x<=max&&x!==n).slice(0,3);add('numbers',n,String(n),number(n),others.map(x=>[String(x),number(x)]),n<=20?'A1.1':n<=100?'A1.2':n<=999?'A2.1':'B1.1');}
 if(profile.time)for(let hour=0;hour<12;hour++)for(let minute=0;minute<60;minute+=5){const raw=hour*60+minute,near=[(raw+5)%720,(raw+60)%720,(raw+65)%720],disp=v=>(Math.floor(v/60)||12)+':'+pad(v%60);add('time',pad(hour)+pad(minute),disp(raw),time(hour,minute),near.map(v=>[disp(v),time(Math.floor(v/60),v%60)]),'A1.1',{kind:'clock',hour:hour||12,minute});}
 if(profile.prices){const amounts=new Set([100,150,200,250,795,1420,3875,10999]);for(let euro=1;euro<=(level===0?20:level===1?99:level<=3?499:999);euro+=level<=1?1:3)for(const cent of [0,20,50,75,95,99])amounts.add(euro*100+cent);for(const n of amounts){if(n>(level===0?2099:level===1?9999:level<=3?49999:99999))continue;const near=[n+1,n+100,n+101];add('prices',n,priceDisplay(n),price(n),near.map(x=>[priceDisplay(x),price(x)]),n<2100?'A1.1':n<10000?'A1.2':n<50000?'A2.1':'B1.1');}}
 if(profile.dates)for(let month=1;month<=12;month++)for(let day=1;day<=days[month-1];day++){const d2=day%days[month-1]+1,m2=month%12+1,d3=Math.min(day,days[m2-1]),display=(d,m)=>pad(d)+'/'+pad(m);add('dates',pad(day)+pad(month),display(day,month),date(day,month),[[d2,month],[d3,m2],[d3%days[m2-1]+1,m2]].map(([d,m])=>[display(d,m),date(d,m)]),'A2.1');}
 cache.set(key,bank);return bank;
}
root.PracticeNumbers={number,time,date,price,priceDisplay,months,days,pool};if(typeof module!=='undefined')module.exports=root.PracticeNumbers;
})(typeof window==='undefined'?globalThis:window);
