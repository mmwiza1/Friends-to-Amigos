(function(root){
'use strict';
// Original, authored audio-first comprehension. No transcript is used as a prompt.
const listening=[
 // A1.1: one familiar detail → contrast/quantity/location/time.
 [
  ['Hola, me llamo Marta. ¿Cómo te llamas?','What information does Marta ask for?','Your name','Your age','Your country','Cómo te llamas asks a name, after Marta introduces herself.'],
  ['Buenos días, Luis. Me llamo Ana.','What is the speaker’s name?','Ana',['Ana'],'Me llamo Ana identifies the speaker, while Luis is the person addressed.'],
  ['Hola, soy Luis. ¿Cómo te llamas?','What could you reply as Ana?','Me llamo Ana','Tengo hambre','Hasta luego','He asks your name. Introduce yourself rather than changing the subject.']
 ],
 [
  ['Soy de Inglaterra, pero vivo en Madrid. Tengo veinte años.','In which city does the speaker live?','Madrid',['Madrid'],'Vivo en names the current home city; soy de gives origin.'],
  ['Soy de España. Hablo español. También hablo inglés.','Which two languages does the speaker mention?','Spanish and English','English and French','Spanish and German','The speaker names español and inglés; también adds the second language.'],
  ['Me llamo Ana. Tengo veinte años y vivo en Madrid.','How old is Ana?','twenty','veinte',['20','twenty years old','veinte años','20 años'],'Tengo veinte años gives age; Madrid is her home.']
 ],
 [
  ['Tengo hambre. Quiero pan y agua, por favor.','Which food does the speaker want?','bread','pan',['bread','pan'],'Pan is the food; agua is the drink.'],
  ['No quiero café hoy. Un té, por favor.','Which drink should be brought?','Tea','Coffee','Water','No quiero rejects coffee; un té is the final request.'],
  ['Un café con leche y pan, por favor. Tengo hambre.','What does the speaker order to drink?','Coffee with milk','Tea','Water','Café con leche names the drink; pan is food and tengo hambre states hunger.']
 ],
 [
  ['Dos cafés, por favor. Uno para Ana y uno para mí.','How many coffees are requested?','two','dos',['2','two coffees','dos cafés'],'Two people each get one coffee: dos, not doce.'],
  ['Un té cuesta dos euros. Dos tés cuestan cuatro euros.','What is the total for two teas?','Four euros','Two euros','Twenty euros','Dos tés cuestan cuatro euros states the total, not the unit price.'],
  ['La libreta cuesta cinco euros. El libro cuesta diez euros.','How much does the notebook cost?','five euros','cinco euros',['5','cinco','five','5 euros','€5'],'Libreta is the notebook; its price is five, not the book’s ten.']
 ],
 [
  ['Esta es Marta, mi hermana. Es alta y simpática. Tiene diecinueve años.','How is Marta related to the speaker?','Their sister','Their mother','Their brother','Mi hermana names a sister; the adjectives describe her.'],
  ['Mi hermano es alto. Mi hermana es baja.','Who is tall?','the brother','el hermano',['brother','hermano','mi hermano'],'Alto describes the brother; baja describes the sister.'],
  ['Marta es mi hermana. Tiene los ojos marrones.','What colour are Marta’s eyes?','Brown','Blue','Green','Ojos marrones means brown eyes.']
 ],
 [
  ['Mi móvil está aquí. Las llaves están en la mesa.','Where are the keys?','on the table','en la mesa',['table','the table','mesa'],'Plural llaves is followed by están en la mesa, not aquí.'],
  ['Hay un ordenador y un libro rojo. El libro está en la mesa.','Which object is red?','The book','The computer','The table','Rojo describes libro; the next sentence locates that book.'],
  ['El móvil es negro. Está en la mesa. Hay un libro.','Where is the phone?','on the table','en la mesa',['table','the table','mesa'],'Está en la mesa locates the phone; negro describes its colour.']
 ],
 [
  ['La farmacia está a la derecha. El café está a la izquierda.','Which way is the pharmacy?','Right','Left','Straight ahead','Listen for farmacia, then a la derecha; the café is the other direction.'],
  ['La estación está cerca del parque. Voy al parque.','Where is the speaker going?','the park','el parque',['park','parque','to the park','al parque'],'Voy al gives the destination; estación is mentioned only as a nearby place.'],
  ['El café está cerca. Todo recto y a la derecha.','What should you do first?','Go straight ahead','Turn left immediately','Go home','Todo recto is the first step, before identifying the café on the right.']
 ],
 [
  ['Desayuno a las ocho. Trabajo a las nueve.','At what time is breakfast?','eight','las ocho',['8','at eight','a las ocho'],'Desayuno goes with eight; nine belongs to work.'],
  ['Nos vemos a la una en el café. No a las dos.','What is the agreed meeting time?','One o’clock','Two o’clock','Three o’clock','A la una is the agreed time; no a las dos corrects the alternative.'],
  ['Son las dos. Nos vemos a las tres y media en el café.','At what time will they meet?','half past three','a las tres y media',['3:30','15:30','three thirty','las tres y media','tres y media'],'Son las dos gives the time now; a las tres y media gives the meeting time.']
 ],
 // A1.2: preferences → changed plan → fit/location → sequence/reason.
 [
  ['Me gusta leer, pero no me gusta el fútbol.','Which activity does the speaker dislike?','Football','Reading','Music','No me gusta introduces the dislike; pero contrasts it with reading.'],
  ['Prefiero leer porque me gustan los libros.','Why does the speaker prefer reading?','They like books','They need clothes','They are hungry','Porque introduces the reason: liking books.'],
  ['Me gustan los libros. Hoy prefiero leer en casa, no ir al cine.','What does the speaker choose today?','Read at home','Go to the cinema','Play football','Hoy prefiero gives today’s choice, and no rejects the cinema option.']
 ],
 [
  ['¿Quieres venir al parque? Podemos caminar.','Where is the invitation to?','the park','el parque',['park','parque','to the park','al parque'],'Venir al parque names the place; caminar is the activity.'],
  ['Lo siento, mañana no puedo. ¿Qué tal el sábado?','Which alternative day is suggested?','Saturday','Tomorrow','Monday','Mañana is refused; el sábado is the proposed alternative.'],
  ['Hoy no puedo ir al cine. ¿Qué tal mañana? Mañana estoy libre.','When is the speaker available?','tomorrow','mañana',['tomorrow','mañana'],'Hoy is unavailable, but mañana estoy libre states availability.']
 ],
 [
  ['Voy a trabajar el lunes. El domingo voy a leer.','On which day is reading planned?','Sunday','Monday','Saturday','El domingo goes with voy a leer; Monday is the work plan.'],
  ['Quedamos el sábado a las cinco delante del cine.','At what time do they meet?','five','las cinco',['5','at five','a las cinco'],'A las cinco gives the time. Sábado and cine give the day and place.'],
  ['Mañana quedamos a las seis, delante del parque. Después vamos al café.','Where is the first meeting?','In front of the park','At the café','In front of the cinema','The meeting is delante del parque; the café comes después.']
 ],
 [
  ['Necesito unos pantalones negros y una camiseta azul.','What colour trousers are needed?','black','negros',['black trousers','pantalones negros','negro'],'Negros describes pantalones; azul belongs to the T-shirt.'],
  ['Necesito una camiseta azul de talla mediana. No la pequeña.','Which size is needed?','Medium','Small','Large','Mediana is the requested size; no la pequeña rejects small.'],
  ['Quiero unos pantalones negros y una camiseta blanca.','What colour T-shirt is requested?','white','blanca',['white','blanco','a white one','camiseta blanca'],'Blanca describes camiseta; negros describes pantalones.']
 ],
 [
  ['La camiseta me queda pequeña. Necesito una talla más grande.','What would solve the fit problem?','A bigger size','A smaller size','The same size','Pequeña means too small here, so a larger size helps.'],
  ['Esta chaqueta me queda bien. Me llevo esta y pago con tarjeta.','How does the speaker pay?','by card','con tarjeta',['card','tarjeta'],'Pago con tarjeta states the payment method after choosing the jacket.'],
  ['Los pantalones me quedan grandes. ¿Tiene una talla más pequeña?','Why is another size requested?','The trousers are too big','The trousers are too small','The trousers are red','Me quedan grandes explains the request for a smaller size.']
 ],
 [
  ['En mi piso hay dos dormitorios. El salón es pequeño, pero cómodo.','How many bedrooms are there?','two','dos',['2','two bedrooms','dos dormitorios'],'Dos dormitorios gives the number; pequeño describes the living room.'],
  ['El móvil está encima de la mesa. Las llaves están debajo de la silla.','Where are the keys?','Under the chair','On the table','In the bedroom','Llaves goes with debajo de la silla; the phone is on the table.'],
  ['El baño está al lado de la cocina. En el salón hay un sofá.','Where should a visitor find the bathroom?','Next to the kitchen','On the sofa','In the bedroom','Al lado de la cocina locates the bathroom; the sofa is unrelated.']
 ],
 [
  ['Me levanto a las siete y después me ducho.','What happens after getting up?','Showering','Going to bed','Buying clothes','Después me ducho gives the second action.'],
  ['Primero desayuno. Después me visto y voy a clase.','What happens before getting dressed?','breakfast','el desayuno',['have breakfast','desayunar','desayuno'],'Primero desayuno comes before después me visto.'],
  ['Me acuesto a las diez porque me levanto a las siete.','Why does the speaker go to bed at ten?','They get up at seven','They shop at ten','They dislike reading','Porque gives the reason, linking bedtime to the morning routine.']
 ],
 [
  ['Me gusta el cine, pero hoy voy a quedar con Marta.','What is today’s plan?','Meeting Marta','Going to the cinema','Buying a shirt','Pero introduces today’s different plan after the general preference.'],
  ['No puedo venir porque tengo que trabajar. Mañana estoy libre.','Why can the speaker not come?','work','el trabajo',['work','working','trabajar','tiene que trabajar'],'Porque tengo que trabajar gives the reason; tomorrow is the alternative.'],
  ['Primero voy a desayunar en casa. Después quedamos a las diez delante del parque.','What happens before the meeting?','Breakfast at home','Shopping for trousers','Going to bed','Primero marks breakfast, before después introduces the meeting.']
 ]
];
const spoken=[
 ['As Ana, greet Luis and introduce yourself aloud.','Hola, me llamo Ana'],
 ['As Ana, say you are from England and live in Madrid.','Soy de Inglaterra y vivo en Madrid'],
 ['Order a coffee with milk politely, aloud.','Un café con leche, por favor'],
 ['Ask the price of one item, aloud.','¿Cuánto cuesta?'],
 ['As Luis, introduce your sister Marta, aloud.','Esta es mi hermana Marta'],
 ['Tell Luis that the keys are on the table, aloud.','Las llaves están en la mesa'],
 ['Ask where the pharmacy is, aloud.','¿Dónde está la farmacia?'],
 ['Suggest meeting at one o’clock, aloud.','Nos vemos a la una'],
 ['Say you like books but prefer the cinema today, aloud.','Me gustan los libros, pero hoy prefiero el cine'],
 ['Decline today and suggest tomorrow, aloud.','No puedo hoy. ¿Qué tal mañana?'],
 ['Ask Luis what time you are meeting, aloud.','¿A qué hora quedamos?'],
 ['Ask for a medium blue T-shirt politely, aloud.','Una camiseta azul de talla mediana, por favor'],
 ['Ask to try on these trousers, aloud.','¿Puedo probarme estos pantalones?'],
 ['Tell a visitor the bathroom is next to the kitchen, aloud.','El baño está al lado de la cocina'],
 ['Say you get up at seven and then shower, aloud.','Me levanto a las siete y después me ducho'],
 ['Decline because you have to work, aloud.','No puedo venir porque tengo que trabajar']
];
function apply(course){
 function audio(spec,id,topic,rate){
  if(Array.isArray(spec[3]))return {id,type:'text',mode:'listening',prompt:spec[1],answer:spec[2],accepted:[...new Set([spec[2],...spec[3]])],language:'en-or-es',explanation:spec[4],topic,listening:{transcript:spec[0],lang:'es-ES',rate}};
  if(Array.isArray(spec[4]))return {id,type:'text',mode:'listening',prompt:spec[1],answer:spec[2]+' / '+spec[3],accepted:[...new Set([spec[2],spec[3],...spec[4]])],language:'en-or-es',explanation:spec[5],topic,listening:{transcript:spec[0],lang:'es-ES',rate}};
  return {id,type:'choice',mode:'listening',prompt:spec[1],answer:spec[2],options:[spec[2],spec[3],spec[4]],explanation:spec[5],topic,listening:{transcript:spec[0],lang:'es-ES',rate}};
 }
 for(let n=0;n<16;n++){
  const prefix=n<8?`u${n}`:`a12u${n-8}`,unit=course.getUnit(course.lessons.find(l=>l.id===prefix+'l0'));
  const build=course.lessons.find(l=>l.id===prefix+'l1'),use=course.lessons.find(l=>l.id===prefix+'l2'),check=course.lessons.find(l=>l.id===prefix+'check');
  build.questions.push(audio(listening[n][0],build.id+'-listen1',unit.title,n<4?.8:.9));
  use.questions.push(audio(listening[n][1],use.id+'-listen1',unit.title,n<4?.85:.95));
  use.questions.push({id:use.id+'-speak1',type:'speaking',mode:'speaking',prompt:spoken[n][0],answer:spoken[n][1],spanish:spoken[n][1],topic:unit.title,explanation:'One possible response. Compare the meaning and wording with your attempt; pronunciation is not automatically assessed.'});
  check.questions[2]=audio(listening[n][2],check.id+'-q3',unit.title,n<4?.85:1);
 }
 course.listeningPractice=course.lessons.filter(l=>!l.checkpoint).flatMap(l=>l.questions).filter(q=>q.listening);
 course.speakingPractice=course.lessons.flatMap(l=>l.questions).filter(q=>q.type==='speaking');
}
root.A1Practice={apply};if(typeof module!=='undefined')module.exports=root.A1Practice;
})(typeof window==='undefined'?globalThis:window);
