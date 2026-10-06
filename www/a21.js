(function(root){
'use strict';
function create(){
const data=typeof module!=='undefined'?require('./a21-data.js'):root.FriendsA21Data;
const identities=typeof module!=='undefined'?require('./a21-ids.js'):root.FriendsA21Ids;
const clone=x=>JSON.parse(JSON.stringify(x));
const norm=x=>x.normalize('NFC').toLowerCase().replace(/[áéíóúü]/g,c=>({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ü':'u'}[c])).replace(/[¿?¡!.,;:”“"']/g,' ').replace(/\s+/g,' ').trim();
const unique=xs=>xs.filter((x,i)=>xs.findIndex(y=>norm(y)===norm(x))===i);let rotation=0;
const choice=(prompt,answer,wrong,explanation,topic,mode='recognition')=>{const options=[answer,...wrong];for(let i=rotation++%options.length;i>0;i--)options.push(options.shift());return {type:'choice',prompt,answer,options,explanation,topic,mode,spanish:answer};};
const text=(prompt,answer,accepted,explanation,topic,mode='contextual')=>({type:'text',prompt,answer,accepted:unique([answer,...accepted]),explanation,topic,mode,language:'es',spanish:answer});
const gapWords=[
 [['He','Soy','Ha'],['Hemos','Han','Somos'],['hecho','hacido','hacer']],
 [['visité','visito','visitar'],['Fui','Voy','Fue'],['Hice','Hago','Hizo']],
 [['que','de','como'],['como','que','de'],['vuelta','vuelve','volver']],
 [['reservar','reservo','reserva'],['incluido','incluir','incluye'],['personas','persona','personal']],
 [['Llegué','Llegé','Llegó'],['de','en','a'],['funciona','funcionar','funciono']],
 [['duele','duelen','duelo'],['desde','hasta','por'],['descansar','descanso','descansa']],
 [['hablar','hablo','hablas'],['que','a','de'],['necesitado','necesito','necesitar']],
 [['vuelto','volvido','volver'],['Tomé','Tomo','Tomaron'],['a','de','por']]
];
const audio=[
 [['Hoy he visitado el museo con Marta. Todavía no hemos comido. Vamos al café.','Who visited the museum with the speaker?','Marta',['Luis','Diego']],['Esta semana he hecho la compra y he comido en casa. Ana ha comido en el café.','Where did Ana eat?','At the café',['En el café','The café','El café']]],
 [['Ayer fui a Toledo con Luis. Visitamos el museo y después fuimos al parque.','What did they do after visiting the museum?','Went to the park',['Ate at home','Bought clothes']],['El sábado pasado hice la compra. El domingo fui al café de Diego.','Whose café did the speaker visit on Sunday?','Diego’s',['Diego','El café de Diego']]],
 [['El tren tarda una hora y cuesta veinte euros. El autobús tarda dos horas y cuesta doce euros. Prefiero el tren porque tengo poco tiempo.','Why does the speaker choose the train?','It is faster',['It is cheaper','It includes dinner']],['Quiero un billete de ida y vuelta para mañana. El tren sale a las nueve.','What time does the train leave?','At nine',['A las nueve','Nine','Las nueve']]],
 [['Necesito una habitación doble para dos noches. El desayuno está incluido, pero la cena no.','Which meal is included?','Breakfast',['Dinner','Lunch']],['La habitación cuesta sesenta euros por noche. Está cerca de la estación.','How much does the room cost per night?','Sixty euros',['Sesenta euros','60 euros']]],
 [['Llegué al hotel a las cuatro porque el tren llegó tarde. Tengo una reserva a nombre de Ana.','Why did the speaker arrive at four?','The train was late',['The room key was lost','She went shopping']],['La llave no funciona. ¿Puede ayudarme? Necesito otra llave.','What does the speaker need replaced?','The key',['La llave','Key','Llave']]],
 [['Me duele la garganta desde ayer. No tengo fiebre, pero estoy cansada.','Which symptom does the speaker say she does NOT have?','Fever',['A sore throat','Tiredness']],['He caminado mucho hoy. Me duelen los pies y necesito descansar.','Which body parts hurt?','The feet',['Los pies','Feet','Pies']]],
 [['Necesito una cita para hoy. Tengo fiebre desde ayer. Puedo ir a las doce.','When can the speaker attend?','At twelve',['At two','Tomorrow']],['No entiendo la instrucción. ¿Puede repetir más despacio, por favor?','How does the speaker want the instruction repeated?','More slowly',['Más despacio','Slowly','Despacio']]],
 [['He vuelto a Madrid hoy. Estoy cansada, por eso voy a descansar en casa.','What will the speaker do next?','Rest at home',['Buy a return ticket','Visit the museum']],['Ayer tomé el autobús y llegué a las nueve. Después fui al hotel.','Where did the speaker go after arriving?','To the hotel',['Al hotel','The hotel','El hotel']]]
];
const audioWhy=[
 ['Con Marta identifies Ana’s companion; Luis and Diego are not on this visit.','Ana ha comido en el café gives Ana’s meal location; en casa describes the speaker.'],
 ['Después places the park after the museum, both as finished events.','El café de Diego identifies the café visited on Sunday.'],
 ['Tengo poco tiempo explains choosing the one-hour train, although it costs more.','Sale a las nueve gives the departure time; mañana gives the day.'],
 ['El desayuno está incluido confirms breakfast. La cena no explicitly excludes dinner.','Sesenta euros por noche is the nightly price, not the total stay.'],
 ['Porque el tren llegó tarde gives the cause of the late hotel arrival.','Otra llave means another key: the key, not the shower or ticket, needs replacing.'],
 ['No tengo fiebre explicitly denies fever. The throat pain and tiredness are present.','Me duelen los pies names the feet; plural pies takes duelen.'],
 ['Puedo ir a las doce confirms noon. Desde ayer describes when the fever began.','Más despacio asks for a slower repetition, not a different appointment.'],
 ['Por eso voy a descansar links present tiredness to the next plan to rest.','Después fui al hotel places the hotel after the arrival, not before the bus journey.']
];
const units=data.map(({id,title,goal,phrases,grammar})=>({id,title,goal,phrases,grammar,note:'Original Friends to Amigos scenarios. Spain-first usage; answers are short authored models, not unrestricted writing.'})),lessons=[];
for(let u=0;u<data.length;u++){
 const unit=data[u],make=(suffix,title,questions,extra={})=>({id:`a21u${u}${suffix}`,stage:'A2.1',unit:u,unitId:unit.id,outcomeId:unit.id,goal:unit.goal,title,questions:questions.map((q,i)=>({...clone(q),id:identities[`a21u${u}${suffix}`][i],sourceQuestionId:identities[`a21u${u}${suffix}`][i],topic:q.topic||unit.title})),checkpoint:false,authorship:{kind:'original',referenceRecord:'docs/resources/CURRICULUM_REFERENCE.md'},...extra});
 const core=unit.core.map((row,j)=>{
  const [answer,meaning,wrong,rule,rp,ra,rw,tp,ta,tv]=row,[word,...distractors]=gapWords[u][j],sentence=answer.replace(word,'___');
  const qs=[choice(`Which sentence means “${meaning}”?`,answer,wrong,rule,unit.title),{...choice(`Complete: ${sentence}`,word,distractors,rule,unit.title,'completion'),type:'gap',sentence,meaning,spanish:answer},text(`From memory, write “${meaning}”.`,answer,[],rule,unit.title,'recall'),choice(rp,ra,rw,rule,unit.title,'response'),text(tp,ta,tv,rule,unit.title,'transfer')];
  if(u===6&&j===2)qs[3].spanish='Dos veces al día, con agua';
  if(j<2){const [transcript,prompt,model,alternatives]=audio[u][j];qs.push({...j?{type:'text',prompt,answer:model,accepted:unique([model,...alternatives]),language:'en-or-es',explanation:audioWhy[u][j],topic:unit.title}:{...choice(prompt,model,alternatives,audioWhy[u][j],unit.title)},mode:'listening',spanish:transcript,listening:{transcript,lang:'es-ES',rate:.9}});}
  else qs.push({type:'speaking',prompt:tp,answer:ta,spanish:ta,topic:unit.title,explanation:'Try aloud, then compare with this possible model. Speaking is self-assessed.',mode:'speaking'});
  return make('l'+j,['Discover','Build confidence','Use it'][j]+': '+unit.title,qs);
 });
 const stories=unit.stories.map((story,j)=>{const reading={title:story.title,text:story.text,glossary:story.glossary,stage:'A2.1'};return make('story'+j,'Story '+(j+1)+': '+story.title,story.questions.map((q,i)=>({...q,...(q.accepted?{accepted:unique(q.accepted)}:{}),reading,mode:['fact','context','inference','sequence','response'][i],topic:unit.title})),{reading});});
 const production=make('write','Write in Spanish: '+unit.title,unit.writing.map(([p,a,v,e])=>text(p,a,v,e,unit.title)));
 const check=make('check','Checkpoint: '+unit.title,[core[0].questions[0],core[1].questions[1],core[0].questions[5],core[2].questions[0],{...core[0].questions[4],prompt:'Checkpoint: '+core[0].questions[4].prompt},{...core[1].questions[4],prompt:'Checkpoint: '+core[1].questions[4].prompt},core[2].questions[3],{...core[2].questions[4],prompt:'Checkpoint: '+core[2].questions[4].prompt},{...production.questions[3],prompt:'Checkpoint: '+production.questions[3].prompt}],{checkpoint:true,capability:unit.goal});
 lessons.push(core[0],stories[0],core[1],stories[1],core[2],stories[2],production,stories[3],check);
}
for(const q of lessons.flatMap(l=>l.questions).filter(q=>q.language==='es')){
 q.mistakes=[];for(const [good,bad,why] of [['hecho','hacido','Hacer has the irregular participle hecho, not hacido.'],['vuelto','volvido','Volver has the irregular participle vuelto, not volvido.'],['Llegué','Llegé','Before é, llegar uses gu to preserve the hard g sound: llegué.'],['He ','Soy ','Use haber, not ser, before a participle to report a recent experience.'],['Voy a ','Voy ','Keep a between voy and the infinitive.'],['Tengo que ','Tengo ','Keep que in tener que + infinitive.'],['Me duele la','Me duelen la','A singular body part takes duele. Me identifies the person feeling pain.'],['Me duelen los','Me duele los','Plural body parts take duelen. The body part controls the verb.']])if(q.answer.includes(good))q.mistakes.push({answer:q.answer.replace(good,bad),explanation:why});
}
return {units,lessons};
}
root.FriendsA21=create;if(typeof module!=='undefined')module.exports=create;
})(typeof window==='undefined'?globalThis:window);
