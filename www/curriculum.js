(function(root){
'use strict';
// Original Friends to Amigos material. Pedagogical references: docs/resources.
// Keep the public lesson IDs and the tuple-shaped units API for saved progress.
const cast={ana:{name:'Ana',role:'An English learner settling into Madrid'},luis:{name:'Luis',role:'Ana’s local friend'},marta:{name:'Marta',role:'Luis’s sister'},diego:{name:'Diego',role:'Works at the neighbourhood café'}};
const unitInfo=[
 {id:'greetings',title:'Greetings & introductions',goal:'Introduce yourself, ask someone’s name and greet or say goodbye politely',phrases:[['Hola','Hello'],['Me llamo…','My name is…'],['¿Cómo te llamas?','What is your name?'],['Buenos días','Good morning'],['Hasta luego','See you later']]},
 {id:'personal',note:'🇪🇸 Vosotros/vosotras is the usual informal plural “you” in most of Spain; vosotras addresses an all-female group. 🌎 Ustedes is usual for groups in Latin America.',title:'About you',goal:'Give your age, origin and home city, and ask for basic personal information',phrases:[['Soy de…','I am from…'],['Tengo … años','I am … years old'],['Vivo en…','I live in…'],['¿Cuántos años tienes?','How old are you?'],['Hablo…','I speak…']]},
 {id:'cafe',title:'At the café',goal:'Order a simple breakfast, express hunger and ask for the bill',phrases:[['Un café con leche, por favor','A coffee with milk, please'],['Tengo hambre','I am hungry'],['Quiero…','I would like…'],['La cuenta, por favor','The bill, please'],['Me gusta…','I like…']]},
 {id:'prices',title:'Numbers & prices',goal:'Ask a price, understand a small total and say how many items you want',phrases:[['¿Cuánto cuesta?','How much is it?'],['Dos euros','Two euros'],['Quiero dos…','I would like two…'],['Veintiún euros','Twenty-one euros'],['Tres euros con cincuenta','Three euros fifty']]},
 {id:'family',title:'Family & people',goal:'Introduce close family members and describe someone simply',phrases:[['Esta es mi hermana','This is my sister'],['Mi hermano es alto','My brother is tall'],['Tiene los ojos marrones','She/he has brown eyes'],['Mis padres','My parents'],['Es simpática','She is friendly']]},
 {id:'objects',title:'Everyday objects',goal:'Identify a personal object, describe it and say where it is',phrases:[['Mi móvil','My mobile phone'],['El ordenador','The computer'],['Un libro rojo','A red book'],['Las llaves están en la mesa','The keys are on the table'],['Hay…','There is/are…']],note:'🇪🇸 Móvil and ordenador are common in Spain. 🌎 Celular and computadora are common in much of Latin America.'},
 {id:'town',title:'Around town',goal:'Ask where a place is and follow a simple direction to get there',phrases:[['¿Dónde está…?','Where is…?'],['A la derecha','To the right'],['A la izquierda','To the left'],['Todo recto','Straight ahead'],['Voy al parque','I am going to the park']]},
 {id:'time',title:'Routines & meeting times',goal:'Say when a daily activity happens and agree a simple meeting time',phrases:[['Es la una','It is one o’clock'],['Son las dos y media','It is half past two'],['A las nueve','At nine o’clock'],['Desayuno a las ocho','I have breakfast at eight'],['¿A qué hora?','At what time?']]}
];
let choicePosition=0;
function q(prompt,answer,options,explanation,topic,spanish='',mode='recognition'){
 const ordered=options.slice();for(let i=0,n=choicePosition++%options.length;i<n;i++)ordered.push(ordered.shift());
 return {type:'choice',prompt,answer,options:ordered,explanation,topic,spanish,mode};
}
const pick=(prompt,answer,wrong,explanation,topic,mode='recognition',spanish='')=>q(prompt,answer,[answer,...wrong],explanation,topic,spanish,mode);
function gap(sentence,meaning,answer,wrong,explanation,topic){
 let index=0;const words=answer.split(' ');
 return {...pick(`Complete: ${sentence} (“${meaning}”)`,answer,wrong,explanation,topic,'completion'),type:'gap',sentence,meaning,spanish:sentence.replace(/___/g,()=>words[index++])};
}
function write(prompt,answer,variants,explanation,topic,mode='contextual'){
 const mistakes=[];
 if(answer.startsWith('Tengo ')&&(answer.includes('años')||answer.includes('hambre'))){
  for(const verb of ['Soy','Estoy'])mistakes.push({answer:answer.replace(/^Tengo/,verb),explanation:answer.includes('años')?'English uses I am for age, but Spanish uses tener: tengo + number + años.':'Hambre is a noun. Spanish expresses hunger with tener hambre, not soy or estoy hambre.'});
 }
 if(answer.startsWith('Me gusta '))mistakes.push({answer:answer.replace('Me gusta ','Yo gusto '),explanation:'Gustar works like be pleasing to: the thing liked takes gusta, and me marks the person who likes it.'});
 return {type:'text',prompt,answer,accepted:[...new Set([answer,...variants])],language:'es',explanation,topic,mode,spanish:answer,mistakes};
}
const lessonSets=[
// 0. Meet someone: model → complete → recall → respond → transfer.
[
 [pick('You meet Luis for the first time. Which greeting is neutral and friendly?','Hola',['Adiós','Gracias'],'Hola opens an encounter. Adiós ends one; gracias thanks someone.','Greetings','recognition','Hola'),
  gap('___ ___ Ana.','My name is Ana','Me llamo',['Soy llamo','Me llama'],'Llamarse needs me when you give your own name. Me llama means someone calls me.','Introductions'),
  write('From memory, write “My name is Ana”.','Me llamo Ana',['Mi nombre es Ana'],'Me llamo is a complete first-person introduction; you do not need soy before it.','Introductions','recall'),
  pick('Luis says “¿Cómo te llamas?” What answers his question?','Me llamo Ana',['Soy de Inglaterra','Hasta luego'],'He asks your name, not your country or a goodbye.','Introductions','response'),
  write('Your role is Luis. Introduce yourself to a new classmate.','Me llamo Luis',['Soy Luis','Mi nombre es Luis','Hola, me llamo Luis','Hola, soy Luis'],'Use your role’s name with me llamo or soy. A short greeting can come first.','Introductions','transfer')],
 [pick('It is 9 am. How do you greet Diego?','Buenos días',['Buenas noches','Hasta luego'],'Buenos días is the usual morning greeting. Noches refers to night.','Greetings'),
  gap('¿___ ___ llamas?','What is your name?','Cómo te',['Cómo me','Qué te'],'Te addresses the other person. Cómo me llamo asks your own name.','Introductions'),
  write('From memory, ask one friend their name.','¿Cómo te llamas?',['¿Cuál es tu nombre?'],'Use te llamas when speaking to one friend; me llamo introduces yourself.','Introductions','recall'),
  pick('Diego says “Gracias”. Which friendly response fits?','De nada',['Me llamo Diego','Buenas noches'],'De nada responds to thanks; it means you’re welcome.','Politeness','response'),
  write('You thank Luis for helping. Write a brief thank-you.','Gracias',['Muchas gracias','Gracias, Luis','Muchas gracias, Luis'],'Gracias thanks someone; por favor is used to make a request politely.','Politeness','transfer')],
 [pick('Ana is leaving the café. Which phrase fits?','Hasta luego',['Buenos días','¿Cómo te llamas?'],'Hasta luego closes an encounter and suggests you may see each other again.','Greetings'),
  gap('___ ___, Luis.','Good morning, Luis','Buenos días',['Buenas días','Buenos noches'],'Días is masculine plural, so use buenos. Buenas goes with tardes or noches.','Gender agreement'),
  write('From memory, write “See you later”.','Hasta luego',['Nos vemos'],'Hasta luego and nos vemos are natural short farewells.','Greetings','recall'),
  pick('Marta says “Hola, me llamo Marta”. Which reply introduces you too?','Hola, soy Ana',['Gracias, Marta','Adiós, Marta'],'Replying with your own name makes this an introduction, not a farewell.','Introductions','response'),
  write('Your role is Ana. Greet Marta and give your name in one short response.','Hola, me llamo Ana',['Hola, soy Ana','Hola, mi nombre es Ana'],'Start with hola and add your introduction. Me llamo already means my name is.','Introductions','transfer')]
],
// 1. Personal details without turning every interaction into an age quiz.
[
 [pick('Luis asks “¿De dónde eres?” What kind of information does he want?','Your origin',['Your name','Your age'],'De dónde asks where you are from. Cómo te llamas asks your name.','Personal information'),
  gap('___ ___ Inglaterra.','I am from England','Soy de',['Estoy de','Tengo de'],'Origin uses ser: soy de. Estar describes states and locations, not where you come from.','Ser or estar'),
  write('From memory, write “I live in Madrid”.','Vivo en Madrid',['Yo vivo en Madrid'],'Vivo is I live; en introduces the city. A normally indicates movement towards somewhere.','Prepositions','recall'),
  pick('Ana says “Soy de Inglaterra, pero vivo en Madrid”. Which is true?','Madrid is her home city now',['She is from Madrid','She lives in England'],'Pero means but. Her origin and current home are different pieces of information.','Personal information','context'),
  write('Your role is Luis, who is from Spain. Answer “¿De dónde eres?”','Soy de España',['Soy español','Yo soy de España'],'Answer with soy de plus a country, or soy plus a nationality.','Personal information','transfer')],
 [pick('Which Spanish phrase gives Ana’s age of twenty?','Tengo veinte años',['Soy veinte años','Estoy veinte años'],'Spanish uses tener for age: literally I have twenty years, not I am twenty years.','Tener expressions'),
  gap('___ ___ años.','I am twenty-one years old','Tengo veintiún',['Soy veintiún','Tengo veintiuno'],'Age uses tengo. Veintiuno shortens to veintiún before masculine años.','Number agreement'),
  write('From memory, say you are twenty years old.','Tengo veinte años',['Yo tengo veinte años','Tengo 20 años'],'Use tengo, not soy or estoy, with age. Años is part of the phrase.','Tener expressions','recall'),
  pick('Luis says “Tengo veintiún años”. How old is he?','21',['12','20'],'Veintiún is twenty-one before a masculine noun such as años.','Numbers','context'),
  write('In this role-play you are nineteen (diecinueve). Answer “¿Cuántos años tienes?”','Tengo diecinueve años',['Yo tengo diecinueve años','Tengo 19 años'],'Cuántos años tienes asks age; give tengo plus the number and años.','Tener expressions','transfer')],
 [pick('Ana wants to say she is tired today. Which phrase fits?','Estoy cansada',['Soy cansada','Tengo cansada'],'A current state such as tiredness uses estar. Cansada agrees with Ana.','Ser or estar'),
  gap('___ ___ español.','I speak Spanish','Yo hablo',['Yo habla','Yo hablar'],'The yo form of hablar is hablo. Hablar is the infinitive; habla describes another person.','Verb forms'),
  write('From memory, write “I speak English”.','Hablo inglés',['Yo hablo inglés'],'Hablo is the first-person form. You may leave out yo because the ending identifies the speaker.','Verb forms','recall'),
  pick('You address Ana and Marta together as friends in Spain. Which pronoun fits this all-female group?','Vosotras',['Usted','Ella'],'Vosotras addresses an all-female group informally in Spain. Usted addresses one person formally.','Addressing people','context'),
  write('Your role is Ana. Tell Luis you are tired, rather than giving your nationality.','Estoy cansada',['Yo estoy cansada','Hoy estoy cansada'],'Estoy describes how you feel now. Soy inglesa describes nationality.','Ser or estar','transfer')]
],
// 2. Ordering is an interaction, not just gender recognition.
[
 [pick('Diego asks “¿Qué quieres tomar?” Which response orders a drink?','Un café con leche, por favor',['La cuenta, por favor','Hasta luego'],'Tomar here means have/drink. The bill comes after the order.','Café ordering','response'),
  gap('Un café, ___ ___.','A coffee, please','por favor',['para favor','por cuenta'],'Por favor is a fixed polite request. Para favor is not the Spanish expression.','Politeness'),
  write('From memory, order a coffee with milk politely.','Un café con leche, por favor',['Quiero un café con leche, por favor','Un café con leche, porfa'],'Con means with. Café con leche is coffee with milk; por favor makes the request polite.','Café ordering','recall'),
  pick('The menu says “té”. What are you ordering?','Tea',['Milk','The bill'],'Té is tea; leche is milk, and cuenta is the bill.','Café vocabulary'),
  write('You are at the café but want tea instead of coffee. Order a tea politely.','Un té, por favor',['Quiero un té, por favor','Para mí, un té, por favor'],'Change the drink, keeping un and the polite request. Té is masculine.','Café ordering','transfer')],
 [pick('Which phrase tells Diego you are hungry?','Tengo hambre',['Soy hambre','Estoy hambre'],'Spanish uses tener hambre, literally have hunger. Translating English I am word for word does not work.','Tener expressions'),
  gap('___ ___ el café.','I like coffee','Me gusta',['Yo gusto','Me gustan'],'With gustar, coffee is the thing liked. Singular café takes gusta, not gustan.','Gustar'),
  write('From memory, write “I am hungry”.','Tengo hambre',['Yo tengo hambre'],'Use tener for hunger; hambre is a noun, not an adjective after estar.','Tener expressions','recall'),
  pick('Ana says “No quiero café. Quiero agua”. What should Diego bring?','Water',['Coffee','Tea'],'No rejects the coffee. The second sentence specifies water.','Café ordering','context'),
  write('Diego asks what you want to eat. Ask for bread politely.','Pan, por favor',['Quiero pan, por favor','Un poco de pan, por favor'],'Pan means bread. Quiero introduces what you want, and por favor keeps the request polite.','Café ordering','transfer')],
 [pick('You have finished breakfast. What request comes next?','La cuenta, por favor',['¿Cómo te llamas?','Tengo veinte años'],'La cuenta requests the bill. The other phrases ask a name or give an age.','Café ordering','response'),
  gap('La cuenta, ___ ___.','The bill, please','por favor',['para favor','por leche'],'Use the fixed phrase por favor when asking for the bill. Cuenta is feminine: la cuenta.','Café vocabulary'),
  write('From memory, ask for the bill politely.','La cuenta, por favor',['¿Me traes la cuenta, por favor?','Quiero la cuenta, por favor'],'La cuenta is the bill. El cuento means a story and does not ask to pay.','Café vocabulary','recall'),
  pick('Diego says “Son tres euros”. What is he telling you?','The total price',['The time','His age'],'Euros identifies money. A time uses an hour; an age uses años.','Prices','context'),
  write('After paying, thank Diego with a short Spanish response.','Gracias',['Muchas gracias','Gracias, Diego','Muchas gracias, Diego'],'Gracias thanks the person. De nada is what the other person can reply.','Politeness','transfer')]
],
// 3. Small purchases and meaningful number use.
[
 [pick('You point to a book in a shop. Which question asks its price?','¿Cuánto cuesta?',['¿Cuántos años tienes?','¿Dónde está?'],'Cuánto cuesta asks the cost. Cuántos años asks age; dónde asks location.','Prices','response'),
  gap('Son ___ ___.','It is two euros','dos euros',['dos años','doce euros'],'Euros identifies a price. Dos is two; doce is twelve.','Numbers'),
  write('From memory, ask how much one item costs.','¿Cuánto cuesta?',['¿Qué precio tiene?'],'For one item use cuesta. Cuestan is used with plural items.','Prices','recall'),
  pick('One tea costs 2 €. You order two teas. What is the total?','Cuatro euros',['Dos euros','Veinte euros'],'Two items at two euros each make four euros. Cuatro is four.','Prices','transfer'),
  write('The price tag says 5 €. Write the price in Spanish words.','Cinco euros',['Son cinco euros','Cuesta cinco euros'],'Cinco is five. Use euros, not años, for a price.','Prices','contextual')],
 [pick('Luis asks for “dos libros”. How many books does he want?','Two',['Twelve','Twenty'],'Dos is two. Doce is twelve and veinte is twenty.','Numbers'),
  gap('Quiero ___ ___.','I would like two books','dos libros',['dos libro','doce libros'],'Dos requires the plural libros. Doce would request twelve, not two.','Plural agreement'),
  write('From memory, write “thirty-two” in Spanish words.','Treinta y dos',[],'From thirty-one onwards, connect the tens and units with y.','Numbers','recall'),
  pick('A price label says “3,50 €”. Which amount matches it?','Tres euros con cincuenta',['Treinta y cinco euros','Tres euros con cinco'],'Spain uses a decimal comma. ,50 is fifty cents, not five cents or thirty-five euros.','Prices','context'),
  write('You need three books instead of two. Ask for them in a short sentence.','Quiero tres libros',['Quiero tres libros, por favor','Tres libros, por favor'],'Keep libros plural when changing the quantity to tres.','Plural agreement','transfer')],
 [pick('Which price is written correctly before masculine euros?','Veintiún euros',['Veintiuno euros','Veintiuna euros'],'Veintiuno shortens to veintiún before a masculine noun. Veintiuna goes with feminine nouns.','Number agreement'),
  gap('Son ___ ___.','It is two hundred euros','doscientos euros',['doscientas euros','dos cientos'],'Doscientos is one word and agrees with masculine euros. Doscientas requires a feminine noun.','Number agreement'),
  write('From memory, write “twenty-one euros”.','Veintiún euros',['Son veintiún euros','Cuesta veintiún euros'],'Before euros, veintiuno becomes veintiún. The missing vowel accent is tolerated in this practice.','Number agreement','recall'),
  pick('Ana has 10 €. The book costs 5 €. Which statement fits?','She has enough to buy it',['She needs twenty euros','The book is free'],'Ten euros covers the five-euro price. This uses the numbers to make a simple purchase decision.','Prices','inference'),
  write('Two coffees cost four euros in total. Tell Ana the total in Spanish words.','Son cuatro euros',['Cuatro euros','En total, son cuatro euros'],'Use son with the plural amount. Do not give the price of just one coffee.','Prices','transfer')]
],
// 4. Introduce people and describe them for a purpose.
[
 [pick('Luis introduces Marta: “Esta es mi hermana”. Who is Marta?','His sister',['His mother','His brother'],'Hermana is sister; hermano is brother. Mi means my.','Family vocabulary'),
  gap('Esta es ___ ___.','This is my sister','mi hermana',['mis hermana','mi hermano'],'One sister takes mi hermana. Mis needs a plural noun; hermano means brother.','Family vocabulary'),
  write('From memory, write “This is my brother”.','Este es mi hermano',['Él es mi hermano'],'For hermano use masculine este or él. Esta and ella describe a female person.','Gender agreement','recall'),
  pick('Ana introduces two people as “mis padres”. Who are they?','Her parents',['Her sisters','Her friends'],'Padres means parents here. Plural padres takes mis, not mi.','Family vocabulary','context'),
  write('Your role is Luis. Introduce your sister Marta by name.','Esta es mi hermana Marta',['Marta es mi hermana','Mi hermana se llama Marta'],'A useful introduction connects the person’s name and relationship.','Family vocabulary','transfer')],
 [pick('You want to describe Luis, a tall man. Which phrase agrees?','Luis es alto',['Luis es alta','Luis son alto'],'Alto agrees with a male person and es with one person. Alta describes a female person.','Gender agreement'),
  gap('Marta ___ ___.','Marta is friendly','es simpática',['es simpático','son simpáticas'],'Marta is one woman: es simpática. Match both number and gender.','Gender agreement'),
  write('From memory, write “My brother is tall”.','Mi hermano es alto',[],'Use ser for this characteristic and masculine alto to agree with hermano.','Gender agreement','recall'),
  pick('Ana points to two friendly women. Which description fits?','Son simpáticas',['Es simpática','Son simpático'],'Two women take plural son and feminine plural simpáticas.','Gender agreement','context'),
  write('Describe your sister as tall in one short Spanish sentence.','Mi hermana es alta',['Ella es alta'],'Change both hermano and alto when describing a sister: hermana and alta.','Gender agreement','transfer')],
 [pick('Luis says “Marta tiene los ojos marrones”. What does marrones describe?','Her eye colour',['Her age','Her home city'],'Ojos means eyes. Marrones describes their colour, not a personal detail such as age.','Description','context'),
  gap('Tiene los ___ ___.','She has brown eyes','ojos marrones',['ojos marrón','ojos marronas'],'Ojos is masculine plural. Marrón becomes marrones for plural eyes.','Plural agreement'),
  write('From memory, say “She has brown eyes”.','Tiene los ojos marrones',['Ella tiene los ojos marrones','Sus ojos son marrones'],'Keep ojos and marrones plural. Spanish commonly uses los ojos with tener.','Description','recall'),
  pick('Ana asks “¿Cómo es tu hermana?” Which response describes Marta?','Es alta y simpática',['Está en Madrid','Son tres euros'],'Cómo es asks for a description. Dónde está would ask location.','Description','response'),
  write('Marta is friendly. Answer “¿Cómo es Marta?” with one description.','Es simpática',['Marta es simpática','Ella es simpática'],'Describe her with ser and feminine simpática, rather than giving her location with estar.','Description','transfer')]
],
// 5. Objects: recognise, locate, and recover something.
[
 [pick('Luis says “Mi móvil está aquí”. What personal item is he referring to?','His mobile phone',['His folder','His computer'],'Móvil means mobile phone in Spain. Carpeta is a folder; ordenador is a computer.','Spain vocabulary','context'),
  gap('Es un ___ ___.','It is a red book','libro rojo',['libro roja','rojo libro'],'Colour normally follows the noun. Masculine libro takes rojo.','Adjective order'),
  write('From memory, write “a red book”.','Un libro rojo',[],'Use un for masculine libro and place rojo after it.','Adjective order','recall'),
  pick('Ana asks “¿Qué es?” while pointing to a folder. Which answer identifies it?','Es una carpeta',['Está una carpeta','Es un carpeta'],'Es identifies the object. Carpeta is feminine, so use una.','Gender agreement','response'),
  write('The book you are describing is blue instead of red. Write “a blue book”.','Un libro azul',[],'Change the colour after libro. Azul has the same singular form for masculine and feminine nouns.','Adjective order','transfer')],
 [pick('Which sentence says where the keys are?','Las llaves están en la mesa',['Las llaves son en la mesa','Los llaves está en la mesa'],'Location uses estar. Llaves is feminine plural, so use las and están.','Ser or estar'),
  gap('Las llaves ___ ___.','The keys are here','están aquí',['son aquí','está aquí'],'Use plural están for the location of las llaves. Son is not used for this location.','Ser or estar'),
  write('From memory, say “The phone is here”.','El móvil está aquí',['Mi móvil está aquí'],'Use está for the location of one phone. Están is plural.','Ser or estar','recall'),
  pick('A friend asks “¿Dónde está el libro?” Which response answers that question?','Está en la mesa',['Es rojo','Es un libro'],'Dónde asks where. Colour and identity do not tell your friend where to find it.','Location','response'),
  write('Tell Ana that the keys are on the table.','Las llaves están en la mesa',['Están en la mesa'],'Plural llaves takes están. En la mesa means on the table in this context.','Location','transfer')],
 [pick('Ana says “Hay un ordenador”. What is she doing?','Saying a computer is present',['Naming its owner','Giving its colour'],'Hay introduces something that is there. It does not by itself say whose object it is.','Hay','context'),
  gap('Hay ___ ___.','There is a table','una mesa',['un mesa','unas mesa'],'Mesa is feminine singular, so use una. Un is masculine and unas needs a plural noun.','Hay'),
  write('From memory, say “There is a computer”.','Hay un ordenador',['Hay una computadora'],'Hay expresses there is. Ordenador is the usual Spain vocabulary; computadora is also valid Spanish.','Hay','recall'),
  pick('You need to identify your phone among several. Which description helps?','Mi móvil es negro',['Hay un móvil','Tengo hambre'],'Ownership and colour distinguish your phone. Hay un móvil only says one exists.','Description','context'),
  write('Your phone is black. Write a short description to help someone find it.','Mi móvil es negro',['El móvil es negro','Tengo un móvil negro','Mi teléfono es negro'],'For a characteristic such as colour use es; negro agrees with masculine móvil.','Description','transfer')]
],
// 6. Ask for and follow directions.
[
 [pick('Ana wants to find the station. Which question should she ask?','¿Dónde está la estación?',['¿Dónde es la estación?','¿Cuánto cuesta la estación?'],'Location uses estar. Cuánto cuesta asks a price, not where a place is.','Ser or estar','response'),
  gap('¿Dónde ___ ___ farmacia?','Where is the pharmacy?','está la',['es la','está el'],'Use está for location and la for feminine farmacia.','Ser or estar'),
  write('From memory, ask where the station is.','¿Dónde está la estación?',['¿Dónde se encuentra la estación?'],'Estación is feminine; ask dónde está la estación, not dónde es el estación.','Ser or estar','recall'),
  pick('Luis says “La farmacia está cerca”. What does cerca mean here?','Nearby',['Far away','Closed'],'Cerca is about distance. It does not mean the shop is closed.','Directions','context'),
  write('You need the café rather than the station. Ask where it is.','¿Dónde está el café?',['¿Dónde se encuentra el café?'],'Change the place and its article: el café is masculine; la estación is feminine.','Directions','transfer')],
 [pick('Diego points right and says “A la derecha”. Which way should you go?','To the right',['To the left','Straight ahead'],'Derecha is right; izquierda is left; todo recto is straight ahead.','Directions'),
  gap('El parque está ___ ___ ___.','The park is to the left','a la izquierda',['a el izquierda','en la izquierda'],'The direction is a la izquierda. Use feminine la in this fixed expression.','Directions'),
  write('From memory, write “Straight ahead”.','Todo recto',['Recto','Sigue todo recto'],'Todo recto is a common way to give a straight-ahead direction in Spain.','Directions','recall'),
  pick('Ana needs the café. Luis says “El café está a la derecha; el parque, a la izquierda”. Which direction does she need?','Right',['Left','Back'],'Choose the direction attached to café, not the direction for parque.','Directions','context'),
  write('Tell a visitor “To the left” in Spanish.','A la izquierda',['Está a la izquierda'],'A la izquierda is the whole directional phrase, including a and la.','Directions','transfer')],
 [pick('Which sentence correctly says you are going to the park?','Voy al parque',['Voy a el parque','Voy en parque'],'A + el contracts to al before parque. En describes a location, not this destination.','Prepositions'),
  gap('Voy ___ ___.','I am going to the park','al parque',['a parque','en parque'],'The destination is a + el parque, which becomes al parque.','Prepositions'),
  write('From memory, ask “Is it far?”','¿Está lejos?',['¿Está muy lejos?'],'Lejos describes distance with estar. Es lejos is not the usual question.','Directions','recall'),
  pick('Ana is going to a pharmacy, not a park. Which sentence fits?','Voy a la farmacia',['Voy al farmacia','Voy en la farmacia'],'A + la stays separate. Only a + el contracts to al.','Prepositions','transfer'),
  write('Tell Luis you are going to the station.','Voy a la estación',['Yo voy a la estación'],'Estación takes la, so use a la, not al.','Prepositions','transfer')]
],
// 7. Times serve a routine or a meeting.
[
 [pick('Which sentence means it is one o’clock?','Es la una',['Son las una','Es las uno'],'One o’clock is singular: es la una. Other hours use son las.','Telling the time'),
  gap('___ ___ dos.','It is two o’clock','Son las',['Es la','Son la'],'Two o’clock uses plural son las dos. The singular pattern belongs to one o’clock.','Telling the time'),
  write('From memory, say “It is one o’clock”.','Es la una',['Es la una en punto'],'Use es la una: singular verb and article, with una for the hour.','Telling the time','recall'),
  pick('Luis asks “¿Qué hora es?” The clock shows 2:30. Which reply fits?','Son las dos y media',['Son las dos menos cuarto','Es la dos y medio'],'Y media means half past. Menos cuarto is a quarter before the named hour.','Telling the time','response'),
  write('A visitor asks the time. It is three o’clock. Answer in Spanish words.','Son las tres',['Son las tres en punto'],'Use plural son las for three o’clock, transferring the pattern from two.','Telling the time','transfer')],
 [pick('Ana says “Desayuno a las ocho”. What happens at eight?','She has breakfast',['She goes to sleep','She gives her age'],'Desayuno means I have breakfast; a las introduces when it happens.','Routines','context'),
  gap('Desayuno ___ ___ ___.','I have breakfast at nine','a las nueve',['en las nueve','a la nueve'],'Activities happen a las nueve. En las is not the time expression; la is for one o’clock.','Time prepositions'),
  write('From memory, say “At eight o’clock”.','A las ocho',[],'Use a las to say when, rather than son las, which says the current time.','Time prepositions','recall'),
  pick('Diego asks “¿A qué hora desayunas?” Which response answers him?','A las nueve',['Son las nueve','Tengo nueve años'],'A qué hora asks the time of an activity. Answer a las, not the current-time phrase son las.','Time prepositions','response'),
  write('Your breakfast is at eight. Say when you have breakfast.','Desayuno a las ocho',['Yo desayuno a las ocho'],'Desayuno describes your activity; a las ocho gives its time.','Routines','transfer')],
 [pick('A message says “Nos vemos a las tres”. What does it propose?','Meeting at three',['The time is three now','Someone is three years old'],'Nos vemos suggests seeing each other. A las tres gives the agreed meeting time.','Meeting times','context'),
  gap('Nos vemos ___ ___ ___.','See you at two','a las dos',['en las dos','a la dos'],'A las dos gives the meeting time. Use plural las for two, not singular la.','Time prepositions'),
  write('From memory, say “It is a quarter to three”.','Son las tres menos cuarto',['Son las dos y cuarenta y cinco'],'Menos cuarto subtracts fifteen minutes from three; the result is 2:45.','Telling the time','recall'),
  pick('You agree to meet at one. Which message uses the right time phrase?','A la una',['A las una','En la una'],'One o’clock takes singular a la una. Other hours use a las.','Meeting times','response'),
  write('Luis asks when to meet. Suggest nine o’clock, using Spanish words.','A las nueve',['Nos vemos a las nueve','A las nueve en punto'],'Give the meeting time with a las nueve. Son las nueve tells the current time instead.','Meeting times','transfer')]
]
];
const writingSets=[
[
 write('At the class door, introduce yourself as Ana. Include a greeting.','Hola, me llamo Ana',['Hola, soy Ana','Hola, mi nombre es Ana'],'An introduction combines hola with your name. Me llamo does not need soy.','Introductions'),
 write('Luis introduces himself. Ask him his name to check you heard it.','¿Cómo te llamas?',['¿Cuál es tu nombre?'],'Te llamas addresses Luis; me llamo would give your own name.','Introductions','response'),
 write('Marta helps you find the classroom. Thank her briefly.','Gracias',['Muchas gracias','Gracias, Marta','Muchas gracias, Marta'],'Gracias responds to help. Por favor belongs with a request, not a thank-you.','Politeness'),
 write('Diego says “Gracias”. Write a short, friendly reply.','De nada',['No hay de qué'],'De nada responds to thanks. Repeating por favor would not answer him.','Politeness','response'),
 write('You leave the class but expect to see Luis again. Say goodbye briefly.','Hasta luego',['Nos vemos','Adiós','Hasta luego, Luis'],'Hasta luego or nos vemos fits another meeting; adiós is also a valid farewell.','Greetings','transfer')
],
[
 write('Your role is Ana, from England. Answer “¿De dónde eres?”','Soy de Inglaterra',['Soy inglesa','Yo soy de Inglaterra'],'Use ser for origin or nationality. Estar tells a current location or state.','Personal information','response'),
 write('Your new home is Madrid. Tell a classmate where you live.','Vivo en Madrid',['Yo vivo en Madrid'],'Vivo gives your home city with en. Voy a Madrid would say you are going there.','Prepositions'),
 write('Your role is Luis, aged twenty-one. Say your age in Spanish words.','Tengo veintiún años',['Yo tengo veintiún años'],'Age uses tener; veintiuno shortens before años to veintiún.','Tener expressions'),
 write('Ask Ana how old she is.','¿Cuántos años tienes?',['¿Qué edad tienes?'],'Ask cuántos años tienes, literally how many years do you have.','Personal information','response'),
 write('You speak a little Spanish. Say this in a short sentence.','Hablo un poco de español',['Yo hablo un poco de español'],'Hablo is I speak; un poco de means a little of. The yo pronoun is optional.','Verb forms','transfer')
],
[
 write('Diego asks what you want to drink. Politely order a coffee with milk.','Un café con leche, por favor',['Quiero un café con leche, por favor','Para mí, un café con leche, por favor'],'Use con leche for with milk. Café is masculine, so un café.','Café ordering','response'),
 write('You do not want tea today. Politely order water instead.','Agua, por favor',['Un agua, por favor','Quiero agua, por favor','Para mí, agua, por favor'],'Agua names the drink. Avoid translating English order word for word with soy or tengo.','Café ordering','transfer'),
 write('Tell your friend you are hungry before ordering.','Tengo hambre',['Yo tengo hambre'],'Tener hambre expresses hunger. Estoy hambre is a literal English-style mistake.','Tener expressions'),
 write('You enjoy tea. Say “I like tea”.','Me gusta el té',['A mí me gusta el té'],'Singular té takes gusta. The person who likes it is me, not yo gusto.','Gustar'),
 write('Breakfast is finished. Ask Diego for the bill politely.','La cuenta, por favor',['¿Me traes la cuenta, por favor?','Quiero la cuenta, por favor'],'Cuenta is the bill and takes la. Cuento means story, so el cuento would request something else.','Café ordering','response')
],
[
 write('In a shop, point to one notebook and ask the price.','¿Cuánto cuesta?',['¿Qué precio tiene?'],'For one item use cuesta. A price question is not the age question cuántos años tienes.','Prices'),
 write('The café total is six euros (seis euros). Tell Ana the total in a short Spanish sentence.','Son seis euros',['Seis euros','En total, son seis euros'],'Use son with a plural total. Seis means six, not sixteen.','Numbers','transfer'),
 write('Ask for two coffees politely, using Spanish words.','Dos cafés, por favor',['Quiero dos cafés, por favor','Para mí, dos cafés, por favor'],'Two coffees needs plural cafés. Keep por favor for a polite order.','Plural agreement'),
 write('A price tag shows 21 €. Write the amount in Spanish words.','Veintiún euros',['Son veintiún euros'],'Veintiuno becomes veintiún before masculine euros. Veintiuna does not agree.','Number agreement'),
 write('Ask for one coffee with milk instead of two plain coffees.','Un café con leche, por favor',['Quiero un café con leche, por favor','Para mí, un café con leche, por favor'],'Return to singular un café and specify con leche. This combines quantities and ordering.','Café ordering','transfer')
],
[
 write('Your role is Luis. Introduce your sister Marta to Ana.','Esta es mi hermana Marta',['Marta es mi hermana','Mi hermana se llama Marta'],'Name and relationship make the introduction useful. Hermana is feminine.','Family vocabulary'),
 write('Describe your brother as friendly.','Mi hermano es simpático',['Él es simpático'],'Use masculine simpático with hermano. Use ser for this characteristic.','Gender agreement'),
 write('Describe your sister as tall.','Mi hermana es alta',['Ella es alta'],'Use feminine alta for a sister. Alto would not agree with hermana.','Gender agreement'),
 write('Marta has brown eyes. Answer “¿Cómo son sus ojos?”','Son marrones',['Sus ojos son marrones','Tiene los ojos marrones','Marta tiene los ojos marrones'],'Eyes are plural, so marrón becomes marrones. Son gives their description.','Plural agreement','response'),
 write('You point to your mother and father together. Say “These are my parents”.','Estos son mis padres',['Son mis padres','Ellos son mis padres'],'Two parents take plural estos, son and mis. Mi padre names just your father.','Plural agreement','transfer')
],
[
 write('A friend asks which book is yours. Describe it as red.','Mi libro es rojo',['El libro es rojo','Tengo un libro rojo','Es un libro rojo'],'Rojo agrees with masculine libro. A colour normally follows the noun.','Description','response'),
 write('Your keys are on the table. Tell Luis where to find them.','Las llaves están en la mesa',['Mis llaves están en la mesa','Están en la mesa'],'Plural llaves needs están. A location uses estar rather than ser.','Location'),
 write('Your mobile phone is here. Tell Ana.','Mi móvil está aquí',['El móvil está aquí','Mi teléfono está aquí','Mi celular está aquí'],'One phone takes está. Móvil is the usual Spain word; celular is a valid regional alternative.','Spain vocabulary'),
 write('In the room you see a computer. Say “There is a computer”.','Hay un ordenador',['Hay una computadora','Hay un computador'],'Hay introduces something present. Ordenador is masculine; computadora is feminine.','Hay'),
 write('Someone points to a folder and asks “¿Qué es?” Identify it.','Es una carpeta',['Una carpeta','Es una carpeta azul'],'Carpeta means folder, not carpet. Use feminine una.','False friends','response')
],
[
 write('You need medicine. Ask where the pharmacy is.','¿Dónde está la farmacia?',['¿Dónde se encuentra la farmacia?'],'Use estar for location and feminine la for farmacia.','Directions'),
 write('Luis asks which way to the café. Tell him “To the right”.','A la derecha',['Está a la derecha','El café está a la derecha'],'Derecha is right. Izquierda would send him the opposite way.','Directions','response'),
 write('A visitor asks if the station is far. Say “It is nearby”.','Está cerca',['La estación está cerca','No está lejos'],'Cerca describes distance with estar. Es cerca is not the location pattern.','Directions','response'),
 write('Tell Ana you are going to the park.','Voy al parque',['Yo voy al parque'],'A + el becomes al. Voy a el parque misses the contraction.','Prepositions'),
 write('Your destination changes to the pharmacy. Tell Ana where you are going now.','Voy a la farmacia',['Yo voy a la farmacia'],'A + la does not contract. Al farmacia would use the wrong article.','Prepositions','transfer')
],
[
 write('Luis asks the time. The clock shows 1:00. Answer in Spanish words.','Es la una',['Es la una en punto'],'One o’clock has singular es la. Other hours use plural son las.','Telling the time','response'),
 write('Say you have breakfast at nine.','Desayuno a las nueve',['Yo desayuno a las nueve'],'A las nueve gives the activity’s time. Son las nueve only gives the current time.','Routines'),
 write('You agree to meet Ana at two. Write a short message giving that time.','Nos vemos a las dos',['A las dos','Nos vemos a las dos en punto'],'Use a las for an agreed time. Dos is not singular, so a la dos is incorrect.','Meeting times'),
 write('Marta asks “¿A qué hora?” Suggest one o’clock in Spanish words.','A la una',['Nos vemos a la una','A la una en punto'],'One o’clock needs singular a la una even though other hours use a las.','Meeting times','response'),
 write('The meeting changes to half past three. Give the new meeting time in Spanish words.','A las tres y media',['Nos vemos a las tres y media'],'Y media means half past. Use a las for a meeting, rather than son las for the clock now.','Meeting times','transfer')
]
];
// Course subdivisions are authoring targets, not certified CEFR descriptors.
const stageInfo=[
 {id:'A1.1',status:'playable',goal:'Handle first meetings and short everyday exchanges',tasks:['Introduce yourself and exchange personal details','Order breakfast, ask prices and find places','Describe family, objects and simple meeting times'],languageSupport:'Story answers in English or Spanish; short practical replies in Spanish.',languageFocus:'Present-tense chunks, ser/estar, tener, agreement and basic questions'},
 {id:'A1.2',status:'playable',goal:'Manage a longer everyday exchange with simple connected sentences',tasks:['Arrange an outing and express likes','Shop for clothes and explain what you need','Describe your home and a typical day'],languageSupport:'Story answers in English or Spanish; supported short Spanish messages.',languageFocus:'Present-tense consolidation, reflexive routines, ir a + infinitive and simple connectors'},
 {id:'A2.1',status:'playable',goal:'Describe familiar experiences and make practical plans',tasks:['Describe a recent trip or weekend','Compare travel options and book a room','Explain simple health needs'],languageSupport:'English or Spanish comprehension; constrained short linked Spanish responses.',languageFocus:'Common past-event forms, comparisons and future plans'},
 {id:'A2.2',status:'playable',goal:'Resolve routine problems and explain a short sequence of events',tasks:['Explain a travel or shopping problem','Describe a past habit and what changed','Write a practical request or invitation'],languageSupport:'Spanish-first tasks with optional English support; bilingual comprehension and constrained connected Spanish production.',languageFocus:'Past-event versus habitual background, polite requests and sequencing'},
 {id:'B1.1',status:'playable',goal:'Tell a connected story and explain personal choices',tasks:['Narrate an experience with background','Give reasons for a preference','Summarise the main point of a familiar text'],languageSupport:'Spanish-first comprehension with English task hints and cautious extended-writing coaching.',languageFocus:'Connected past narration, reasons and everyday opinion expressions'},
 {id:'B1.2',status:'playable',goal:'Sustain a familiar discussion and negotiate a solution',tasks:['Discuss advantages and disadvantages','Respond to advice and propose alternatives','Write a coherent account or complaint'],languageSupport:'Spanish-first comprehension and supported extended replies.',languageFocus:'Advice, wishes, common subjunctive contexts and cohesive linking'},
 {id:'B2.1',status:'playable',goal:'Explain and defend a viewpoint on a wider range of topics',tasks:['Compare perspectives in an article','Develop an argument with examples','Adjust register in a formal request'],languageSupport:'Spanish-first tasks; longer writing uses confidence-aware coaching.',languageFocus:'Argument structure, register, qualification and complex clauses'},
 {id:'B2.2',status:'playable',goal:'Evaluate nuanced arguments and communicate a detailed position',tasks:['Identify stance and supported implications','Synthesize contrasting accounts','Defend a proposal and address objections'],languageSupport:'Spanish-first tasks; extended production uses model comparison and cautious diagnostics.',languageFocus:'Nuance, concession, counterfactuals and sustained cohesion'}
];
const stages=stageInfo.map(stage=>stage.id);
// References inform design; no third-party text is incorporated or adapted.
const authorship={kind:'original',referenceRecord:'docs/resources/CURRICULUM_REFERENCE.md'};
const storyUnits=typeof module!=='undefined'?require('./stories.js'):root.FriendsStories;
const lessons=[];
const label=['Discover','Build confidence','Use it'];
unitInfo.forEach((unit,i)=>{
 const core=lessonSets[i].map((questions,j)=>({id:`u${i}l${j}`,stage:'A1.1',unit:i,title:`${label[j]}: ${unit.title}`,questions,checkpoint:false}));
 const stories=storyUnits[i].map((story,j)=>{
  const reading={title:story.title,text:story.text,glossary:story.glossary,stage:'A1.1'};
  const questions=story.questions.map(item=>({...item,prompt:`${story.title}: ${item.prompt}`,reading}));
  return {id:`u${i}story${j}`,stage:'A1.1',unit:i,title:`Story ${j+1}: ${story.title}`,reading,questions,checkpoint:false};
 });
 const production={id:`u${i}write`,stage:'A1.1',unit:i,title:`Write in Spanish: ${unit.title}`,questions:writingSets[i],checkpoint:false};
 // Purposeful retrieval from earlier activities, with four Spanish production items.
 const checkQuestions=[core[0].questions[0],core[1].questions[0],core[2].questions[0],core[0].questions[1],core[2].questions[3],core[0].questions[4],core[1].questions[4],core[2].questions[4],production.questions[0]];
 const checkpoint={id:`u${i}check`,stage:'A1.1',unit:i,title:`Checkpoint: ${unit.title}`,questions:checkQuestions,checkpoint:true,capability:unit.goal};
 for(const lesson of [...core,...stories,production,checkpoint]){lesson.goal=unit.goal;lesson.outcomeId=unit.id;lesson.authorship=authorship;}
 lessons.push(core[0],stories[0],core[1],stories[1],core[2],stories[2],production,checkpoint,stories[3]);
});
// Existing app API and focused-practice hooks remain small and offline.
const units=unitInfo.map((u,i)=>[u.title,u.goal,lessonSets[i].flat()]);
const placement=[
q('Choose “I am from England”.','Soy de Inglaterra',['Soy de Inglaterra','Estoy de Inglaterra','Tengo Inglaterra'],'Nationality and origin use ser.','Ser or estar'),q('Say “I like these books”.','Me gustan estos libros',['Me gustan estos libros','Yo gusto estos libros','Me gusta estos libros'],'Plural libros requires gustan.','Gustar'),
q('Choose “Yesterday I went to the beach”.','Ayer fui a la playa',['Ayer fui a la playa','Ayer voy a la playa','Ayer iba la playa'],'Fui describes this completed event.','Past tenses'),q('Choose “When I was little, I played here”.','De pequeño, jugaba aquí',['De pequeño, jugaba aquí','De pequeño, jugué aquí una vez','De pequeño, juego aquí'],'Jugaba describes a past habit.','Past tenses'),
q('Complete: Espero que ___ bien.','estés',['estés','estás','estar'],'Espero que takes the subjunctive for this wish.','Subjunctive'),q('Say “I have been living here for two years”.','Llevo dos años viviendo aquí',['Llevo dos años viviendo aquí','Viví aquí por dos años','Soy viviendo aquí dos años'],'Llevar + duration + gerund describes an ongoing situation.','Duration'),
q('Complete: Si lo hubiera sabido, te lo ___.','habría dicho',['habría dicho','habré dicho','diré'],'A past counterfactual pairs imperfect pluperfect subjunctive with conditional perfect.','Hypotheticals'),q('Choose the phrase meaning “even so”.','Aun así',['Aun así','Así que','En cuanto'],'Aun así introduces a concession; así que introduces a consequence.','Connectors')
];
const numbers=[
 pick('Which number is quince?','15',['50','5'],'Quince is fifteen; cincuenta is fifty.','Numbers','recognition','Quince'),
 ...lessonSets[3].flat().filter(q=>q.topic==='Numbers'||q.topic==='Number agreement'||q.topic==='Prices'),
 pick('What number is cien?','100',['10','1000'],'Cien is exactly one hundred. Ciento is used before more numbers.','Numbers','recognition','Cien'),
 pick('What number is mil?','1000',['100','10000'],'Mil is one thousand.','Numbers','recognition','Mil')
];
const time=[...lessonSets[7].flat()];
const a12Factory=typeof module!=='undefined'?require('./a12.js'):root.FriendsA12;
const a12=a12Factory();
lessons.push(...a12.lessons);
const stageUnits={'A1.1':unitInfo,'A1.2':a12.units};
const getUnit=lesson=>stageUnits[lesson.stage||'A1.1']?.[lesson.unit];
const playableStages=stageInfo.filter(stage=>stage.status==='playable').map(stage=>stage.id);
const data={stageUnits,getUnit,playableStages,q,cast,unitInfo,units,stages,stageInfo,lessons,placement,numbers,time};
const identities=typeof module!=='undefined'?require('./question-ids.js'):root.QuestionIds;
identities.install(data);
const review=typeof module!=='undefined'?require('./a1-review.js'):root.A1Review;
review.apply(data);
const practice=typeof module!=='undefined'?require('./a1-practice.js'):root.A1Practice;
practice.apply(data);
const clarity=typeof module!=='undefined'?require('./learner-clarity.js'):root.LearnerClarity;
clarity.apply(data);
const a21Factory=typeof module!=='undefined'?require('./a21.js'):root.FriendsA21;
const a21=a21Factory();data.stageUnits['A2.1']=a21.units;data.lessons.push(...a21.lessons);
data.listeningPractice.push(...a21.lessons.filter(l=>!l.checkpoint).flatMap(l=>l.questions.filter(q=>q.listening)));
data.speakingPractice.push(...a21.lessons.flatMap(l=>l.questions.filter(q=>q.type==='speaking')));
const a22Factory=typeof module!=='undefined'?require('./a22.js'):root.FriendsA22;
const a22=a22Factory();data.stageUnits['A2.2']=a22.units;data.lessons.push(...a22.lessons);
data.listeningPractice.push(...a22.lessons.filter(l=>!l.checkpoint).flatMap(l=>l.questions.filter(q=>q.listening)));
data.speakingPractice.push(...a22.lessons.flatMap(l=>l.questions.filter(q=>q.type==='speaking')));
const bCourse=typeof module!=='undefined'?require('./b-course.js'):root.BCourse;
for(const [stage,content] of Object.entries(bCourse.create())){data.stageUnits[stage]=content.units;data.lessons.push(...content.lessons);data.listeningPractice.push(...content.lessons.filter(l=>!l.checkpoint).flatMap(l=>l.questions.filter(q=>q.listening)));data.speakingPractice.push(...content.lessons.flatMap(l=>l.questions.filter(q=>q.type==='speaking')));}
root.Curriculum=data;const language=typeof module!=='undefined'?require('./course-language.js'):root.CourseLanguage;language.apply(data);
const writingAudit=typeof module!=='undefined'?require('./writing-audit.js'):root.WritingAudit;data.writingAudit=writingAudit.apply(data);
const policy=typeof module!=='undefined'?require('./assessment-policy.js'):root.AssessmentPolicy;policy.apply(data);
if(typeof module!=='undefined')module.exports=data;
})(typeof window==='undefined'?globalThis:window);
