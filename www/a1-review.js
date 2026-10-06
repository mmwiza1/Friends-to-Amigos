(function(root){
'use strict';
// Reviewed, targeted A1 amendments. Historical snapshots are captured before these edits.
function apply(C){
 const lesson=id=>C.lessons.find(l=>l.id===id);
 const write=(old,prompt,answer,accepted,explanation)=>({...old,sourceQuestionId:old.id,type:'text',mode:'transfer',prompt,answer,accepted:[...new Set([answer,...accepted])],spanish:answer,language:'es',explanation,mistakes:[]});
 const choose=(old,prompt,answer,wrong,explanation)=>({...old,sourceQuestionId:old.id,type:'choice',mode:'context',prompt,answer,spanish:answer,options:[answer,...wrong],explanation});
 C.unitInfo[0].phrases.push(['¿Puedes repetir, por favor?','Could you repeat, please?']);
 const intro=lesson('u0l2');
 intro.questions[3]=choose(intro.questions[3],'You did not hear Marta’s name. Which polite request helps?','¿Puedes repetir, por favor?',['¿Cuánto cuesta?','Hasta luego'],'Puedes repetir asks the person to repeat. Por favor makes the request polite.');
 intro.questions[4]=write(intro.questions[4],'You did not hear Luis’s name. Ask him to repeat politely.','¿Puedes repetir, por favor?',['¿Puede repetir, por favor?','Luis, ¿puedes repetir, por favor?'],'Use puedes for a friend or puede for polite usted. Repetir means repeat; por favor softens the request.');
 // Avoid demanding a difficult number far beyond the practical small-price task.
 const prices=lesson('u3l2');
 prices.questions[1]={...prices.questions[1],prompt:'Complete: Son ___ ___. (“It is twenty euros”)',sentence:'Son ___ ___.',meaning:'It is twenty euros',answer:'veinte euros',options:['veinte euros','veinte años','veinte euro'],spanish:'Son veinte euros.',explanation:'A price uses euros, not años; amounts above one use plural euros.'};
 // Give a genuine model before retrieving less familiar number/time chunks.
 const numberModel=lesson('u3l1');numberModel.questions[0]=choose(numberModel.questions[0],'The price tag says 32 €. Which Spanish amount matches?','Treinta y dos euros',['Trece euros','Veinte euros'],'Thirty-two is treinta y dos. From thirty-one, y joins tens and units.');
 C.unitInfo[3].phrases.push(['Treinta y dos euros','Thirty-two euros']);
 const clockModel=lesson('u7l2');clockModel.questions[0]=choose(clockModel.questions[0],'The clock shows 2:45. Which Spanish clock phrase matches?','Son las tres menos cuarto',['Son las tres y media','Son las dos y media'],'Menos cuarto means a quarter before the named hour: fifteen minutes before three is 2:45.');
 C.unitInfo[7].phrases.push(['Son las tres menos cuarto','It is a quarter to three']);
 // Four-way sentence completion had introduced después de before its model.
 const dress=lesson('a12u6l1');
 dress.questions[1]={...dress.questions[1],prompt:'Complete: Primero me ducho y después ___ ___. (“First I shower and then get dressed”)',sentence:'Primero me ducho y después ___ ___.',meaning:'First I shower and then get dressed',answer:'me visto',options:['me visto','me viste','te visto'],spanish:'Primero me ducho y después me visto.',explanation:'Me visto is I get dressed; keep me for your own routine and the first-person visto.'};
 C.stageUnits['A1.2'][6].phrases.push(['Después de desayunar','After having breakfast']);
 const clothingReason=lesson('a12u3write').questions[1];clothingReason.accepted=clothingReason.accepted.filter(a=>a.includes('porque'));
 lesson('a12u2l1').questions[4].prompt='Change the meeting to Sunday (domingo) at six. Say when you meet using quedamos.';
 // A prompt requiring porque must not accept an alternative that omits that requirement.
 const reason=lesson('a12u7l1').questions[2];reason.prompt='From memory, as Ana say “I stay home because I am tired”. Use porque.';reason.accepted=['Me quedo en casa porque estoy cansada','Yo me quedo en casa porque estoy cansada'];
 // Recycle familiar needs/food during a purchase, and food in the final outing.
 // Fail visibly if an authored target changes; never silently lose an amendment.
 function amendStory(id,before,after,glossary=[]){
  const story=lesson(id);if(!story.reading.text.includes(before))throw Error('Story amendment needs review: '+id);
  story.reading={...story.reading,text:story.reading.text.replace(before,after),glossary:[...story.reading.glossary,...glossary]};
  for(const q of story.questions)q.reading=story.reading;
 }
 amendStory('a12u6story0','tomo un café y una tostada.','tomo un café y una tostada. También tomo agua.',[['tomo','I have/drink']]);
 amendStory('a12u4story3','Sí, primero pago y después salimos.','Sí, tengo hambre. Quiero pan y agua. Primero pago y después salimos.');
 amendStory('a12u7story3','Después podemos tomar un café','Después podemos tomar un café y comer pan');
 // Hyphens/commas are already ignored by the answer matcher. Remove redundant
 // variants while retaining exactly the same accepted language.
 lesson('u1story1').questions[1].accepted=lesson('u1story1').questions[1].accepted.filter(a=>a!=='twenty one');
 lesson('u2story2').questions[1].accepted=lesson('u2story2').questions[1].accepted.filter(a=>!['no thanks','no, gracias'].includes(a));
 // New checkpoint tasks: same learnt grammar, changed communicative details.
 const tasks=[
  ['You are Marta. Introduce yourself to a new classmate.','Me llamo Marta',['Soy Marta','Hola, me llamo Marta'],'Me llamo gives your name; you can also introduce yourself with soy.','You did not hear a name. Ask politely for repetition.','¿Puedes repetir, por favor?',['¿Puede repetir, por favor?'],'Puedes or puede repetir asks for repetition; por favor makes it polite.','Marta says “Gracias”. Which response fits?','De nada',['¿Cuánto cuesta?','Me llamo Ana'],'De nada responds to thanks, rather than asking a price or giving your name.'],
  ['Your role is Ana, from England. Give your origin.','Soy de Inglaterra',['Soy inglesa','Yo soy de Inglaterra'],'Origin uses ser, not estar.','Ask your new classmate how old they are.','¿Cuántos años tienes?',['¿Qué edad tienes?'],'Cuántos años tienes asks age with tener; do not translate how old are you word for word.','Which reply answers “¿Dónde vives?”','Vivo en Madrid',['Soy de Inglaterra','Tengo veinte años'],'Vivo en states your home; soy de states your origin.'],
  ['You want water, not coffee. Order politely.','Agua, por favor',['Quiero agua, por favor','Un agua, por favor'],'Name the desired drink and use por favor.','You have finished breakfast. Ask for the bill politely.','La cuenta, por favor',['¿Me traes la cuenta, por favor?','Quiero la cuenta, por favor'],'Cuenta is the bill; cuento is a story.','Diego asks what you want to eat. Which reply orders food?','Pan, por favor',['La cuenta, por favor','Hasta luego'],'Pan orders bread; the bill and goodbye come later.'],
  ['Ask politely for three coffees, using Spanish words.','Tres cafés, por favor',['Quiero tres cafés, por favor','Para mí, tres cafés, por favor'],'Tres requires plural cafés.','The price is seven euros. State it in Spanish words.','Siete euros',['Son siete euros','Cuesta siete euros'],'Use euros for money and siete for seven.','You buy two items at five euros each. What is the total?','Diez euros',['Cinco euros','Dos euros'],'Two items at five euros give a total of ten.'],
  ['As Luis, introduce your sister Marta by name and relationship.','Esta es mi hermana Marta',['Marta es mi hermana','Mi hermana se llama Marta'],'Hermana is feminine; the name and relationship identify her.','Describe your brother as tall and friendly.','Mi hermano es alto y simpático',['Mi hermano es simpático y alto'],'Masculine alto and simpático agree with hermano.','You want to identify Marta’s mother. Which phrase fits?','Su madre',['Su hermano','Sus padres'],'Madre means mother; hermano is brother and padres is parents.'],
  ['Your phone is on the table. Tell Ana where it is.','Mi móvil está en la mesa',['El móvil está en la mesa','Mi teléfono está en la mesa','Mi celular está en la mesa'],'Use estar for location, with singular está.','You can see two computers. Say there are two, using Spain vocabulary.','Hay dos ordenadores',[],'Hay introduces presence and does not change for a plural quantity.','Which sentence describes a blue folder?','Una carpeta azul',['Un carpeta azul','Una carpeta azules'],'Carpeta is feminine singular; azul remains singular.'],
  ['Ask where the café is.','¿Dónde está el café?',['¿Dónde se encuentra el café?'],'A location question uses dónde and estar.','Your destination is now the café. Tell Luis where you are going.','Voy al café',['Yo voy al café'],'A + el contracts to al before masculine café.','A visitor needs the park; it is on the left. Which reply helps?','A la izquierda',['A la derecha','Tengo hambre'],'Izquierda gives left, while derecha would send the visitor the wrong way.'],
  ['The clock shows two thirty. Give the current time in Spanish words.','Son las dos y media',[],'Use son las for two and y media for half past.','Invite Ana to meet at one o’clock with nos vemos.','Nos vemos a la una',['Nos vemos a la una en punto'],'An activity time uses a la una, not es la una.','Someone asks “¿A qué hora desayunas?” Choose a reply.','A las ocho',['Son las ocho','Tengo ocho años'],'A las gives the time of an activity; son las gives the clock now.'],
  ['Say you like reading but do not like football. Use pero.','Me gusta leer, pero no me gusta el fútbol',[],'Leer takes gusta and no comes before me gusta for the dislike.','Explain that you prefer the cinema because you like films.','Prefiero el cine porque me gustan las películas',['Yo prefiero el cine porque me gustan las películas'],'Plural películas takes gustan; porque supplies the reason.','Luis likes music. Agree that you like it too.','A mí también',['A mí tampoco','No puedo venir'],'También agrees with a positive like; tampoco agrees with a negative one.'],
  ['Invite Luis to your flat using quieres.','¿Quieres venir a mi piso?',['Luis, ¿quieres venir a mi piso?'],'Quieres + venir invites one friend; a mi piso gives the destination.','Decline today and suggest Saturday using qué tal.','No puedo hoy. ¿Qué tal el sábado?',['Lo siento, no puedo hoy. ¿Qué tal el sábado?'],'Give the unavailable day and a specific alternative.','Which answer accepts “¿Quieres venir?”','Sí, gracias',['Lo siento, no puedo','¿Qué talla?'],'Sí accepts and gracias politely acknowledges the invitation.'],
  ['Say you are going to read on Monday.','Voy a leer el lunes',['El lunes voy a leer','Yo voy a leer el lunes'],'Keep a before the infinitive leer, and el before the day.','Confirm a meeting at eight in front of the park using quedamos.','Quedamos delante del parque a las ocho',['A las ocho quedamos delante del parque'],'Combine a meeting place with an activity time; de + el is del.','Which reply answers “¿Dónde quedamos?”','Delante del café',['El sábado','A las cinco'],'Dónde asks the place, not the day or time.'],
  ['Ask politely for a red T-shirt, using quiero.','Quiero una camiseta roja, por favor',['Por favor, quiero una camiseta roja'],'Use una and roja with feminine camiseta.','Say you need a blue T-shirt and black trousers.','Necesito una camiseta azul y unos pantalones negros',['Necesito unos pantalones negros y una camiseta azul','Necesito una camiseta azul y pantalones negros'],'Keep singular azul with camiseta and plural negros with pantalones.','The blue shirt is small, the red one medium. You need medium. Which request fits?','La roja mediana, por favor',['La azul pequeña, por favor','Los pantalones negros'],'Choose the item that fits the size requirement.'],
  ['Ask to try on the T-shirt in a short written response.','¿Puedo probarme la camiseta?',['¿Me puedo probar la camiseta?'],'Me can attach to probar or come before puedo.','The trousers are too small on you. State this using quedar.','Los pantalones me quedan pequeños',['Me quedan pequeños'],'Plural pantalones takes quedan and pequeños.','Your jacket is too big. What should you request?','Una talla más pequeña',['Una talla más grande','La misma talla'],'A smaller size addresses the too-big fit.'],
  ['Tell a visitor the keys are next to the lamp.','Las llaves están al lado de la lámpara',[],'Plural llaves needs están; al lado de gives the position.','Describe a flat with a sofa and two chairs. Use hay.','En mi piso hay un sofá y dos sillas',['Hay un sofá y dos sillas en mi piso','En mi apartamento hay un sofá y dos sillas'],'Hay does not change for either singular or plural furniture.','Which reply helps someone asking where the bathroom is?','Al lado de la cocina',['Es pequeño','Hay un sofá'],'Give a location rather than a description or list of furniture.'],
  ['Say you get up at nine and then shower. Use después.','Me levanto a las nueve y después me ducho',['Me levanto a las nueve. Después me ducho.'],'Use me with both reflexive verbs for your own routine.','Say you first get dressed and then have breakfast.','Primero me visto y después desayuno',['Primero me visto. Después desayuno.'],'Visto is the first-person stem change; desayuno does not need me.','Luis asks “¿A qué hora te acuestas?” You go to bed at ten.','Me acuesto a las diez',['Te acuesto a las diez','Me acosto a las diez'],'Change the question’s te to me, and use the stem change acuesto.'],
  ['Tell Luis you are free and invite him to your flat. Use estoy libre and quieres.','Estoy libre. ¿Quieres venir a mi piso?',['Luis, estoy libre. ¿Quieres venir a mi piso?'],'Give your availability with estar and follow it with a question addressed to Luis.','Write a short plan: tomorrow read, then meet Marta.','Mañana voy a leer y después voy a quedar con Marta',['Mañana voy a leer. Después voy a quedar con Marta.'],'Use voy a + infinitive for both plans and después to sequence them.','A friend is free. Which suggestion follows naturally?','Entonces podemos quedar',['Lo siento, no puedo','Me queda pequeña'],'Entonces introduces the resulting possibility of meeting.']
 ];
 for(let i=0;i<16;i++){
  const check=lesson((i<8?`u${i}`:`a12u${i-8}`)+'check'),t=tasks[i];
  check.questions[5]=write(check.questions[5],t[0],t[1],t[2],t[3]);
  check.questions[8]=write(check.questions[8],t[4],t[5],t[6],t[7]);
  check.questions[4]=choose(check.questions[4],t[8],t[9],t[10],t[11]);delete check.questions[4].reading;
 }
 const rules=[
  [/^Soy de /,'Estoy de ','Origin uses ser: soy de. Estar describes a state or location, not your origin.'],
  [/^Me gusta /,'Yo gusto ','Me marks the person who likes something; the thing liked takes gusta/gustan.'],
  [/^Me gustan /,'Me gusta ','Plural things require gustan. Singular nouns and infinitives take gusta.'],
  [/^Voy a /,'Voy ','Keep a between ir and the infinitive: voy a + infinitive.'],
  [/^Me levanto /,'Te levanto ','Me levanto describes getting yourself up; te levanto means I get you up.'],
  [/^Me visto/,'Me viste','When speaking about your own routine, use me visto, not the third-person viste.'],
  [/^Me acuesto /,'Me acosto ','Acostarse has the stem change o → ue: me acuesto.'],
  [/^Es la una/,'Son las una','One o’clock takes singular es la una; other hours use son las.'],
  [/^A la una/,'A las una','One o’clock is singular: a la una. Other hours use a las.'],
  [/^Voy al /,'Voy a el ','A + el contracts to al: voy al parque.'],
  [/^Voy a la /,'Voy al ','A + la does not contract. Keep a la before a feminine place.']
 ];
 for(const q of C.lessons.flatMap(l=>l.questions).filter(q=>q.type==='text'&&q.language==='es')){
  q.mistakes=q.mistakes||[];
  for(const [pattern,replacement,explanation] of rules)if(pattern.test(q.answer)){
   const answer=q.answer.replace(pattern,replacement);if(!q.mistakes.some(m=>m.answer===answer))q.mistakes.push({answer,explanation});
  }
  if(/^Tengo /.test(q.answer)&&(q.answer.includes('años')||q.answer.includes('hambre')))for(const verb of ['Soy','Estoy']){const answer=q.answer.replace(/^Tengo/,verb);if(!q.mistakes.some(m=>m.answer===answer))q.mistakes.push({answer,explanation:q.answer.includes('años')?'Spanish uses tener for age: tengo + number + años, not soy or estoy.':'Spanish uses tener hambre. Hambre is a noun, not an adjective after estar.'});}
  if(/\bestán\b/.test(q.answer))q.mistakes.push({answer:q.answer.replace('están','son'),explanation:'Use estar for the location of known objects, with están for a plural subject.'});
  else if(/\bestá\b/.test(q.answer))q.mistakes.push({answer:q.answer.replace('está','es'),explanation:'Use estar, not ser, to locate a known object or place.'});
  if(/^(Tengo|Vivo|Hablo|Voy|Necesito|Quiero|Prefiero|Desayuno|Me levanto|Me ducho|Me visto|Me acuesto)\b/.test(q.answer)){
   const alternative='Yo '+q.answer[0].toLowerCase()+q.answer.slice(1);if(!q.accepted.includes(alternative))q.accepted.push(alternative);
  }
 }
 const extra=[['u4write',1,'Mi hermano es simpática','Simpático agrees with masculine hermano; simpática would describe a feminine noun.'],['u4write',2,'Mi hermana es alto','Use feminine alta with hermana.'],['a12u3write',0,'Quiero un camiseta blanco, por favor','Camiseta is feminine: una camiseta blanca. Both article and adjective must agree.'],['a12u6write',1,'Te ducho a las nueve','Answer about yourself with me ducho; te ducho means I shower you.']];
 for(const [id,index,answer,explanation] of extra)lesson(id).questions[index].mistakes.push({answer,explanation});
}
root.A1Review={apply};if(typeof module!=='undefined')module.exports=root.A1Review;
})(typeof window==='undefined'?globalThis:window);
