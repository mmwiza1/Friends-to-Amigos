(function(root){
'use strict';
// Original mini-scenarios, manually authored rather than filled from fact templates.
let position=0;
function choose(prompt,answer,wrong,explanation,mode='meaning'){
 const options=[answer,...wrong];for(let n=position++%3;n>0;n--)options.push(options.shift());
 return {type:'choice',prompt,answer,options,explanation,topic:'Reading comprehension',mode};
}
function short(prompt,en,es,variants,explanation,mode='meaning'){
 return {type:'text',prompt,answer:`${en} / ${es}`,accepted:[...new Set([en,es,...variants])],language:'en-or-es',explanation,topic:'Reading comprehension',mode};
}
const stories=[
[
 {title:'La puerta de clase',text:'Luis: Hola, me llamo Luis. ¿Cómo te llamas?\nAna: Me llamo Ana.\nLuis: Hola, Ana.\nAna: Hola, Luis.\nLos dos entran en clase.',glossary:[['la clase','the class'],['entran','they go in'],['los dos','both of them']],questions:[
  choose('What are Ana and Luis doing?','Meeting and introducing themselves',['Ordering breakfast','Saying a price'],'Hola and me llamo open an introduction; no food or price is mentioned.'),
  short('What information does Luis ask Ana for?','her name','su nombre',['name','nombre','Ana’s name','el nombre de Ana'],'Cómo te llamas asks a name, not an age or a country.'),
  choose('A third classmate says “Me llamo Marta”. Which reply welcomes her?','Hola, Marta',['Hasta luego, Marta','La cuenta, por favor'],'Hola welcomes someone. Hasta luego would close the encounter.','response'),
  short('Who introduces herself with “Me llamo Ana”?','Ana','Ana',[],'The speaker label Ana identifies who is giving that name.','fact'),
  choose('What happens after the greeting?','They go into class',['They pay a bill','They leave Spain'],'Entran en clase states the next action explicitly.','sequence')
 ]},
 {title:'Buenos días, Diego',text:'Es por la mañana. Ana entra en el café.\nAna: Buenos días.\nDiego: Buenos días. Me llamo Diego.\nAna: Me llamo Ana.\nDiego: Hola, Ana.',glossary:[['por la mañana','in the morning'],['entra','goes in']],questions:[
  choose('Which greeting fits this time of day?','Buenos días',['Buenas noches','Hasta luego'],'Por la mañana means in the morning, when buenos días fits.','response'),
  short('When does Ana enter the café?','in the morning','por la mañana',['morning','the morning','mañana'],'The first sentence gives the time of day. Here mañana means morning, not tomorrow.','fact'),
  choose('What does Diego give after greeting Ana?','His name',['His age','The price of coffee'],'Me llamo Diego supplies his name. There is no tengo or number.'),
  short('How does Ana introduce herself? Give just her name.','Ana','Ana',[],'Ana says me llamo Ana. Diego is the other speaker.','fact'),
  choose('Which short response fits Diego’s final “Hola, Ana”?','Hola, Diego',['Son tres euros','Buenas noches'],'A greeting back maintains the encounter; the other replies change the subject.','response')
 ]},
 {title:'Una amiga más',text:'Marta: Hola. Me llamo Marta.\nAna: Hola, Marta. Soy Ana.\nLuis: Hola, Ana. Hola, Marta.\nMarta: Gracias, Luis.\nLuis: De nada.',glossary:[['más','more; another'],['soy','I am']],questions:[
  choose('Which two expressions introduce the speakers?','Me llamo and soy',['Gracias and de nada','Hola and hasta luego'],'Me llamo Marta and soy Ana both give a name in this context.'),
  short('Who is being thanked?','Luis','Luis',[],'Marta says gracias, Luis; Luis is the person she thanks.','fact'),
  choose('Why does Luis say “De nada”?','Marta has thanked him',['Marta has asked his age','Ana is leaving'],'De nada responds to gracias; it is not an answer about age.','inference'),
  short('What does “Soy Ana” tell the others?','her name','su nombre',['name','nombre','Ana','Ana’s name'],'With a name, soy introduces who the speaker is.'),
  choose('What could Ana say to welcome Marta?','Hola, Marta',['Adiós, Marta','Tengo hambre'],'Hola welcomes Marta; adiós would say goodbye.','response')
 ]},
 {title:'Hasta mañana',text:'La clase termina.\nAna: Hasta luego, Luis.\nLuis: Hasta mañana, Ana.\nMarta: Adiós.\nAna: Adiós, Marta.\nLos amigos salen de clase.',glossary:[['termina','ends'],['hasta mañana','see you tomorrow'],['salen','they go out']],questions:[
  choose('Are the friends arriving or leaving?','Leaving',['Arriving','Ordering food'],'La clase termina and salen show that the class has ended and they are leaving.','inference'),
  short('When does Luis expect to see Ana again?','tomorrow','mañana',['hasta mañana','see you tomorrow'],'Hasta mañana is a farewell meaning see you tomorrow.','meaning'),
  choose('Marta says “Adiós”. Which response fits?','Adiós, Marta',['¿Cuánto cuesta?','Me gusta el café'],'Ana’s own reply models a farewell to Marta.','response'),
  short('Who says “Hasta luego, Luis”?','Ana','Ana',[],'Ana is the speaker of that line, while Luis is the person she addresses.','fact'),
  choose('What happens next in the passage?','They go out of class',['The class begins','Diego brings coffee'],'Salen de clase means they go out of class.','sequence')
 ]}
],
[
 {title:'Una ficha nueva',text:'Ana tiene una ficha de clase.\nLuis: ¿De dónde eres?\nAna: Soy de Inglaterra, pero vivo en Madrid.\nLuis: Yo soy de España. Vivo en Madrid también.\nAna escribe «Madrid» en la ficha.',glossary:[['la ficha','the form'],['también','also'],['escribe','writes']],questions:[
  choose('Which information belongs in Ana’s home-city box?','Madrid',['Inglaterra','España'],'She says vivo en Madrid. Origin and current home city are different.','transfer'),
  short('Which country is Ana from?','England','Inglaterra',['English','inglesa','soy de Inglaterra'],'Soy de Inglaterra gives her origin. Madrid is where she lives.','fact'),
  choose('What does “también” tell us about Luis?','He lives in the same city as Ana',['He comes from England','He has a different name'],'Luis says vivo en Madrid también: he also lives in Madrid.','inference'),
  short('What word introduces the contrast between origin and home?','but','pero',['pero means but'],'Pero connects two different facts: origin in England and a home in Madrid.','meaning'),
  choose('A new classmate asks Luis “¿De dónde eres?” Which reply fits?','Soy de España',['Vivo en Madrid','Tengo veinte años'],'His origin is España. Vivo en Madrid would answer where he lives.','response')
 ]},
 {title:'¿Veinte o veintiuno?',text:'Luis: ¿Cuántos años tienes?\nAna: Tengo veinte años. ¿Y tú?\nLuis: Tengo veintiún años.\nAna: ¿Veinte?\nLuis: No, veintiuno.\nAna: Ah, veintiuno. Gracias.',glossary:[['¿y tú?','and you?'],['ah','oh; I see']],questions:[
  choose('Why does Luis say “No, veintiuno”?','Ana has heard the wrong age',['He does not want to give his name','He is ordering coffee'],'Ana repeats veinte, but Luis is twenty-one. His next line corrects that misunderstanding.','inference'),
  short('How old is Luis? A number is enough.','twenty-one','veintiuno',['21','veintiún','twenty one','21 years old','veintiún años'],'The correction confirms veintiuno, not veinte. Before años the form is veintiún.','fact'),
  choose('What does “¿Y tú?” invite Luis to do?','Give his age too',['Say goodbye','Give directions'],'Ana has answered the age question and asks for Luis’s corresponding information.'),
  short('Which Spanish verb form expresses Ana’s age?','tengo','tengo',[],'Tengo is the first-person form of tener. Age is expressed with tener, not ser.','meaning'),
  choose('A nineteen-year-old classmate joins the exchange. Which answer uses the same age pattern?','Tengo diecinueve años',['Soy diecinueve años','Estoy diecinueve años'],'Transfer tengo + number + años to the new age.','transfer')
 ]},
 {title:'Un poco de español',text:'Ana: Hablo inglés y un poco de español.\nLuis: Yo hablo español.\nAna: Hoy estoy cansada.\nLuis: La clase es corta.\nAna: Bien. Vamos a clase.',glossary:[['un poco de','a little'],['corta','short'],['vamos','let’s go; we go']],questions:[
  choose('Which description matches Ana’s Spanish?','She speaks a little Spanish',['She speaks no English','She is giving a price'],'Un poco de español means a little Spanish.'),
  short('How does Ana feel today?','tired','cansada',['she is tired','está cansada','estoy cansada'],'Hoy estoy cansada describes a current state, not her identity.','fact'),
  choose('Which reply could encourage Ana using information from the passage?','La clase es corta',['La clase cuesta veinte euros','La clase está lejos'],'Luis reassures her that the class is short. A price or distance is not given.','response'),
  short('Which language does Ana speak besides Spanish?','English','inglés',['English language','habla inglés'],'Ana says hablo inglés y un poco de español.','fact'),
  choose('What do Ana and Luis decide to do?','Go to class',['Go to England','Pay for breakfast'],'Vamos a clase names their next action.','sequence')
 ]},
 {title:'El grupo de amigos',text:'Luis: Ana, esta es Marta. Es mi hermana.\nMarta: Hola, Ana. Soy de España.\nAna: Hola. Yo soy de Inglaterra.\nLuis: ¿Vosotras habláis inglés?\nAna: Sí.\nMarta: Un poco.',glossary:[['esta es','this is'],['mi hermana','my sister'],['habláis','you speak, informal plural in Spain']],questions:[
  choose('Who does Luis address with “vosotras”?','Ana and Marta',['Ana alone','Luis and Diego'],'Vosotras is informal plural you for an all-female group in Spain.','meaning'),
  short('What is Marta’s relationship to Luis?','his sister','su hermana',['sister','hermana','Luis’s sister','la hermana de Luis'],'Luis explicitly introduces Marta as mi hermana.','fact'),
  choose('What does Marta’s “Un poco” mean in this exchange?','She speaks a little English',['She is a little tired','She wants a little milk'],'Luis’s question is about speaking English, so Marta’s short answer refers to that language.'),
  short('Where is Marta from?','Spain','España',['Spanish','española','soy de España'],'Marta gives her origin with soy de España.','fact'),
  choose('You address the same two women informally in Spain. Which pronoun fits?','Vosotras',['Usted','Él'],'The group remains two female friends, so vosotras fits.','transfer')
 ]}
],
[
 {title:'El primer desayuno',text:'Ana y Luis entran en el café de Diego.\nDiego: ¿Qué quieres tomar, Ana?\nAna: Un café con leche, por favor.\nLuis: Para mí, un té.\nDiego: Bien. Un café con leche y un té.',glossary:[['tomar','have; drink'],['para mí','for me']],questions:[
  choose('Which order is Ana’s?','Café con leche',['Té','Agua'],'Ana requests coffee with milk; Luis requests tea.','character'),
  short('What does Luis want to drink?','tea','té',['a tea','un té'],'Para mí marks Luis’s own order, not Ana’s.','fact'),
  choose('What is Diego doing in his final line?','Checking the two drink orders',['Asking their ages','Bringing the bill'],'Repeating both drinks confirms he has understood the orders.','inference'),
  short('What does Ana add to make the request polite?','please','por favor',['por favor means please'],'Por favor makes the short order polite.','meaning'),
  choose('If Ana changes to tea, which short order fits?','Un té, por favor',['Un café con leche','La cuenta, por favor'],'Change the drink while keeping a polite request.','transfer')
 ]},
 {title:'Algo de comer',text:'Ana: Tengo hambre.\nDiego: Hay pan.\nAna: Quiero pan, por favor.\nLuis: No tengo hambre. Un té, por favor.\nDiego: Pan para Ana y té para Luis.',glossary:[['algo de comer','something to eat'],['hay','there is; there are'],['pan','bread']],questions:[
  choose('Who wants something to eat?','Ana',['Luis','Both of them'],'Ana says tengo hambre and asks for pan. Luis says he is not hungry.','character'),
  short('Why does Ana ask for bread? Give her physical need.','hunger','hambre',['hungry','she is hungry','tiene hambre','because she is hungry'],'Tengo hambre supports the reason. No other need is stated.','inference'),
  choose('Which reply fits Diego’s offer of bread?','Pan, por favor',['Soy pan','Tengo veinte años'],'Pan, por favor accepts the food politely; soy pan would identify yourself as bread.','response'),
  short('What does Luis order?','tea','té',['a tea','un té'],'Luis does not want food; he still requests a drink.','fact'),
  choose('What does “No tengo hambre” mean here?','I am not hungry',['I do not have a name','I am not tired'],'No negates tengo hambre. It does not change the phrase into an identity or tiredness statement.','meaning')
 ]},
 {title:'Sin café hoy',text:'Diego: ¿Un café, Luis?\nLuis: No, gracias. Hoy quiero agua.\nAna: A mí me gusta el café. Un café con leche, por favor.\nDiego: Agua para Luis y café con leche para Ana.',glossary:[['hoy','today'],['agua','water'],['a mí','to me; adds emphasis']],questions:[
  choose('Which drink should Diego give Luis today?','Agua',['Café','Té'],'Luis declines coffee and explicitly asks for water.','character'),
  short('How does Luis decline the offered coffee politely?','no thank you','no gracias',['no, thanks','no thanks','no, gracias'],'No, gracias refuses the offer while thanking Diego.','meaning'),
  choose('What does Ana’s “me gusta el café” express?','She likes coffee',['She has already paid','She is hungry'],'Me gusta states a preference. It does not state hunger or payment.'),
  short('What does Ana want in her coffee?','milk','leche',['with milk','con leche'],'Con leche specifies with milk.','fact'),
  choose('A friend likes tea instead. Which phrase follows Ana’s pattern?','Me gusta el té',['Yo gusto té','Me gustan el té'],'Singular té takes gusta; me marks the person who likes it.','transfer')
 ]},
 {title:'La cuenta juntos',text:'Ana y Luis terminan el desayuno.\nAna: La cuenta, por favor.\nDiego: Son cinco euros.\nLuis: Aquí tienes.\nDiego: Gracias.\nLuis: De nada.\nAna: Hasta luego, Diego.',glossary:[['terminan','finish'],['aquí tienes','here you are'],['juntos','together']],questions:[
  choose('At what point does Ana ask for the bill?','After breakfast',['Before saying hello','Before choosing drinks'],'Terminan el desayuno places the bill request after their meal.','sequence'),
  short('What does “la cuenta” mean in this situation?','the bill','la cuenta',['bill','the check','check'],'At a café, asking for la cuenta means asking to pay.','meaning'),
  choose('Why does Diego say “Gracias” after “Aquí tienes”?','Luis has handed over the payment',['Ana has asked Diego’s age','Luis has asked for directions'],'The price and aquí tienes support a payment exchange.','inference'),
  short('How much is the total? A number is enough.','five','cinco',['5','five euros','cinco euros','5 euros'],'Diego gives a total of cinco euros.','fact'),
  choose('Which short reply fits Diego’s thank-you?','De nada',['Por favor','¿Cuánto cuesta?'],'De nada responds to thanks. They already have the price.','response')
 ]}
],
[
 {title:'El precio de la libreta',text:'Ana está en una tienda. Hay una libreta azul.\nAna: ¿Cuánto cuesta?\nMarta: Cinco euros.\nAna: Bien. Quiero una libreta, por favor.\nMarta: Una libreta azul. Cinco euros.',glossary:[['la tienda','the shop'],['la libreta','the notebook']],questions:[
  choose('What is Ana’s first step before deciding to buy?','She asks the price',['She gives her age','She asks for the time'],'Cuánto cuesta gets the price before Ana says quiero.','sequence'),
  short('What item does Ana choose?','a notebook','una libreta',['notebook','libreta','a blue notebook','una libreta azul'],'Ana requests una libreta. The colour helps identify her choice.','fact'),
  choose('What does “Bien” mean here?','She is happy to proceed with that price',['The shop is closing','She does not want the notebook'],'Bien comes before quiero una libreta, so it indicates acceptance in this exchange.','inference'),
  short('What is the price? A number is enough.','five','cinco',['5','five euros','cinco euros'],'Both price replies give cinco euros.','fact'),
  choose('For a different item, which question can Ana reuse?','¿Cuánto cuesta?',['¿Cómo te llamas?','¿Cuántos años tienes?'],'Cuánto cuesta transfers to asking the cost of one other item.','transfer')
 ]},
 {title:'Dos cafés, no doce',text:'Luis: Dos cafés, por favor.\nDiego: ¿Dos o doce?\nLuis: Dos. Uno para Ana y uno para mí.\nDiego: Bien, dos cafés. Son cuatro euros.\nLuis: Gracias.',glossary:[['uno para…','one for…'],['o','or']],questions:[
  choose('Why does Diego ask “¿Dos o doce?”','He is checking the quantity',['He is asking a name','He is offering directions'],'Dos and doce can be confused. Diego checks how many coffees Luis wants.','inference'),
  short('How many coffees does Luis want?','two','dos',['2','two coffees','dos cafés'],'One for Ana plus one for Luis confirms two, not twelve.','fact'),
  choose('Which pair receives the coffees?','Ana and Luis',['Marta and Diego','Ana and Diego'],'Luis specifies uno para Ana y uno para mí; mí refers to the speaker Luis.','character'),
  short('What is the total price? A number is enough.','four','cuatro',['4','four euros','cuatro euros'],'Son cuatro euros gives the total for both coffees.','fact'),
  choose('Diego repeats “dos cafés”. What does this do?','Confirms the corrected order',['Changes the order to twelve','Asks Luis’s age'],'Repeating the number confirms the misunderstanding has been resolved.' )
 ]},
 {title:'La coma en el precio',text:'Ana mira el precio de un café con leche: 3,50 €.\nAna: ¿Tres euros con cincuenta?\nDiego: Sí. Un té cuesta dos euros.\nAna: Quiero un té hoy, por favor.',glossary:[['mira','looks at'],['el precio','the price']],questions:[
  choose('What does the comma mean in “3,50 €”?','Euros and cents',['Thousands of euros','Three separate drinks'],'In Spain a decimal comma separates euros from cents. 3,50 € is three euros fifty.'),
  short('Which drink does Ana choose in the end?','tea','té',['a tea','un té'],'Her final request is un té, even though she first asks about coffee.','sequence'),
  choose('Which drink costs less in the passage?','The tea',['The coffee with milk','They cost the same'],'Two euros is less than three euros fifty. No further inference about Ana’s budget is needed.','inference'),
  short('How much does the tea cost? A number is enough.','two','dos',['2','two euros','dos euros'],'Diego gives the tea price as dos euros.','fact'),
  choose('If Ana asks about the coffee again, which amount matches the label?','Tres euros con cincuenta',['Treinta y cinco euros','Tres euros con cinco'],'Cincuenta adds fifty cents, not five cents.','transfer')
 ]},
 {title:'¿Tengo suficiente?',text:'Ana tiene diez euros. Un libro cuesta cinco euros. Una libreta cuesta dos euros.\nAna: Quiero un libro y una libreta.\nMarta: Son siete euros.\nAna: Bien. Aquí tienes.',glossary:[['suficiente','enough'],['siete','seven']],questions:[
  choose('Can Ana pay the total with the money she has?','Yes',['No','The passage gives no prices'],'She has ten euros and the total is seven euros, so the payment is possible.','inference'),
  short('Which item costs five euros?','the book','el libro',['book','libro'],'The first price belongs to the book, not the notebook.','fact'),
  choose('Which request matches Ana’s purchase?','Un libro y una libreta',['Dos libros','Dos libretas'],'Ana explicitly wants one of each item.','response'),
  short('What total does Marta give? A number is enough.','seven','siete',['7','seven euros','siete euros'],'Five plus two gives the stated total of seven euros.','meaning'),
  choose('What happens after Ana accepts the total?','She hands over the money',['She asks for directions','She introduces her brother'],'Aquí tienes follows the price and signals giving the payment.','sequence')
 ]}
],
[
 {title:'Marta viene al café',text:'Luis y Ana están en el café. Marta entra.\nLuis: Ana, esta es mi hermana Marta.\nAna: Hola, Marta.\nMarta: Hola.\nDiego: Un té para Marta.\nLuis: Gracias, Diego.',glossary:[['viene','comes'],['mi hermana','my sister']],questions:[
  choose('What is Luis doing when Marta enters?','Introducing his sister',['Giving directions','Asking for the bill'],'Esta es mi hermana Marta introduces a person and her relationship.'),
  short('How is Marta related to Luis?','his sister','su hermana',['sister','hermana','Luis’s sister','la hermana de Luis'],'Mi hermana is Luis’s description of Marta.','fact'),
  choose('Which reply welcomes Marta into the conversation?','Hola, Marta',['¿Está lejos?','Tengo veinte años'],'Ana’s own response models welcoming the person just introduced.','response'),
  short('What drink is for Marta?','tea','té',['a tea','un té'],'Diego connects un té with para Marta.','character'),
  choose('What would Luis say to introduce a brother instead?','Este es mi hermano',['Esta es mi hermano','Estos son mi hermano'],'For one male sibling, change esta and hermana to este and hermano.','transfer')
 ]},
 {title:'¿Quién es tu hermano?',text:'Marta espera con Ana en el café.\nAna: ¿Cómo es tu hermano?\nMarta: Luis es alto y simpático.\nLuis entra.\nAna: Hola, Luis.\nMarta: Este es mi hermano.',glossary:[['espera','waits'],['¿cómo es…?','what is … like?']],questions:[
  choose('What information is Ana asking for?','A description of Luis',['Luis’s location','The price of breakfast'],'Cómo es asks what a person is like; dónde está would ask where they are.'),
  short('Give one of Marta’s descriptions of Luis.','tall','alto',['friendly','simpático','es alto','es simpático','tall and friendly','alto y simpático'],'Marta explicitly describes him as alto y simpático. Either one is enough.','meaning'),
  choose('Which description would agree with Marta herself?','Es alta y simpática',['Es alto y simpático','Son altas y simpáticas'],'One female person takes es and feminine alta y simpática.','transfer'),
  short('Who says “Este es mi hermano”?','Marta','Marta',[],'Marta is introducing her brother Luis. Ana is meeting him, not claiming the relationship.','character'),
  choose('What happens before Ana greets Luis?','Luis enters',['Luis pays the bill','Marta leaves'],'Luis entra appears immediately before the greeting.','sequence')
 ]},
 {title:'Una foto de familia',text:'Marta enseña una foto a Ana.\nMarta: Estos son mis padres. Este es Luis, mi hermano.\nAna: ¿Y esta?\nMarta: Soy yo. Tengo los ojos marrones.\nAna: Ah, sí.',glossary:[['la foto','the photo'],['enseña','shows'],['¿y esta?','and this woman/girl?']],questions:[
  choose('Who are “mis padres” in Marta’s photo?','Her mother and father',['Her brother and sister','Her classmates'],'Padres here refers to Marta’s parents, not to all the people in the photo.'),
  short('Which person in the photo is Marta’s brother?','Luis','Luis',[],'Marta explicitly says Luis, mi hermano.','fact'),
  choose('Who does Marta identify with “Soy yo”?','Herself',['Ana','Her mother'],'Yo refers to the speaker Marta; she is identifying herself in the picture.','inference'),
  short('What colour are Marta’s eyes?','brown','marrones',['marrón','brown eyes','ojos marrones'],'Marta says tengo los ojos marrones. Marrones agrees with plural ojos.','fact'),
  choose('Which phrase introduces two parents correctly?','Estos son mis padres',['Este es mis padres','Estos son mi padres'],'Plural padres needs estos, son and mis.','transfer')
 ]},
 {title:'La hermana simpática',text:'Ana y Luis hablan de Marta.\nAna: Tu hermana es simpática.\nLuis: Sí. Es mi hermana.\nMarta entra con dos tés.\nMarta: Uno para Ana y uno para Luis.\nAna: Gracias, Marta.',glossary:[['hablan de','talk about'],['tu hermana','your sister']],questions:[
  choose('Why does Ana say “simpática”, with -a?','She is describing Marta',['She is describing Luis','She is giving a price'],'Marta is female, so the adjective uses simpática.'),
  short('Who brings the tea?','Marta','Marta',[],'Marta entra con dos tés states who brings them.','character'),
  choose('Which act supports Ana’s description of Marta as friendly?','Marta brings drinks for both friends',['Marta gives her age','Luis names his home city'],'Bringing tea to both friends is the simple helpful act shown in the passage.','inference'),
  short('How many teas does Marta bring?','two','dos',['2','dos tés','two teas'],'The passage says dos tés and then one for each friend.','fact'),
  choose('What response fits receiving the tea?','Gracias, Marta',['¿Cómo te llamas?','Soy de Inglaterra'],'Ana thanks Marta for the drink; no new introduction is needed.','response')
 ]}
],
[
 {title:'¿Cuál es mi libro?',text:'En clase hay dos libros: un libro rojo y un libro azul.\nAna: Mi libro es rojo.\nLuis: Este es azul.\nAna: El rojo, por favor.\nLuis: Aquí tienes.',glossary:[['¿cuál?','which one?'],['el rojo','the red one']],questions:[
  choose('Which book should Luis give Ana?','The red book',['The blue book','Both books'],'Ana identifies her book as rojo and then asks for el rojo.','response'),
  short('How many books are there?','two','dos',['2','two books','dos libros'],'Hay dos libros gives the number present.','fact'),
  choose('What does “el rojo” refer to?','The red book',['Luis','A red phone'],'Libro is the object under discussion; el rojo avoids repeating the noun.'),
  short('What colour is the other book?','blue','azul',['the blue one','el azul'],'Luis says este es azul while Ana asks for the red one.','meaning'),
  choose('What happens after Ana specifies the colour?','Luis hands her the book',['Luis asks her age','Ana orders breakfast'],'Aquí tienes is the handover phrase after the request.','sequence')
 ]},
 {title:'Las llaves de Ana',text:'Ana: ¿Dónde están mis llaves?\nLuis: Hay un móvil en la mesa.\nAna: No busco el móvil. Busco las llaves.\nMarta: Las llaves están aquí, en la mesa.\nAna: Gracias.',glossary:[['busco','I am looking for'],['las llaves','the keys']],questions:[
  choose('Which object is Ana trying to find?','Her keys',['Her phone','Her computer'],'Ana explicitly corrects Luis: no busco el móvil; busco las llaves.'),
  short('Where are the keys?','on the table','en la mesa',['the table','la mesa','mesa','aquí','here','aquí en la mesa'],'Marta gives both aquí and the more specific en la mesa.','fact'),
  choose('Why is Luis’s first answer not enough?','It locates a different object',['It gives the wrong time','It is a goodbye'],'He identifies a mobile phone, while Ana is looking for keys.','inference'),
  short('Which object does Luis first mention?','a mobile phone','un móvil',['phone','mobile phone','móvil','el móvil','teléfono','a phone'],'Luis says hay un móvil en la mesa.','meaning'),
  choose('Which verb agrees with plural “las llaves”?','Están',['Está','Es'],'Keys are plural and location uses estar, so están fits.','transfer')
 ]},
 {title:'La carpeta, no la alfombra',text:'Ana tiene una carpeta azul para clase.\nLuis: ¿Es una alfombra?\nAna: No. Es una carpeta. Aquí están mis papeles.\nLuis: Ah, una carpeta.\nAna: Sí, una carpeta azul.',glossary:[['la alfombra','the carpet/rug'],['los papeles','the papers']],questions:[
  choose('What is Ana’s object?','A folder',['A carpet','A phone'],'Carpeta is folder, a false friend of English carpet.'),
  short('What does Ana keep in the folder?','papers','papeles',['her papers','sus papeles','mis papeles'],'Ana points out aquí están mis papeles.','meaning'),
  choose('Why does Ana say “No”?','Luis has confused two objects',['She refuses a drink','She is giving a new price'],'The contrast carpeta/alfombra corrects the object name.','inference'),
  short('What colour is the folder?','blue','azul',[],'The description is una carpeta azul.','fact'),
  choose('Which short reply correctly identifies a different folder?','Es una carpeta roja',['Es un carpeta rojo','Está carpeta roja'],'Carpeta is feminine and identification uses es; roja agrees with it.','transfer')
 ]},
 {title:'Un móvil en el café',text:'Diego: Hay un móvil negro en la mesa. ¿Es tu móvil, Ana?\nAna: No. Mi móvil es rojo.\nLuis: Mi móvil es negro. Está en la mesa.\nDiego: Aquí tienes, Luis.',glossary:[['¿es tu…?','is it your…?'],['negro','black']],questions:[
  choose('Who identifies the black phone as theirs?','Luis',['Ana','Diego'],'Ana rejects it by colour; Luis says his phone is black and on the table.','character'),
  short('What colour is Ana’s phone?','red','rojo',['roja'],'Mi móvil es rojo is Ana’s contrast with the found phone.','fact'),
  choose('How does the colour help in this situation?','It distinguishes Ana’s phone from the found one',['It tells the time','It gives the price'],'The red/black difference rules out Ana’s phone.','inference'),
  short('Where is the found phone?','on the table','en la mesa',['the table','la mesa','mesa'],'Diego and Luis both locate the black phone on the table.','fact'),
  choose('What happens at the end?','Diego gives the phone to Luis',['Ana orders a phone','Luis asks for the bill'],'Aquí tienes, Luis signals the handover to the identified owner.','sequence')
 ]}
],
[
 {title:'La farmacia cerca',text:'Ana está en el café.\nAna: ¿Dónde está la farmacia?\nDiego: Está cerca. Todo recto y a la derecha.\nAna: ¿A la derecha?\nDiego: Sí.\nAna: Gracias. Voy a la farmacia.',glossary:[['la farmacia','the pharmacy'],['cerca','nearby']],questions:[
  choose('What is Ana trying to do?','Find the pharmacy',['Order another coffee','Give her age'],'Her dónde question and final voy a la farmacia identify the destination.'),
  short('Which direction comes after straight ahead?','right','derecha',['to the right','a la derecha'],'Diego gives an ordered pair: todo recto y a la derecha.','sequence'),
  choose('Why does Ana repeat “¿A la derecha?”','To check she understood the direction',['To change her name','To ask a price'],'Repeating the directional phrase checks the detail before she leaves.','inference'),
  short('Is the pharmacy near or far?','near','cerca',['nearby','it is near','está cerca'],'Diego states está cerca, so the destination is nearby.','fact'),
  choose('Which short response fits after receiving the directions?','Gracias',['Tengo veinte años','Me llamo Diego'],'A thank-you acknowledges the help. Neither of the other replies addresses it.','response')
 ]},
 {title:'El parque o la estación',text:'Ana: Voy al parque. ¿Dónde está?\nLuis: El parque está a la izquierda. La estación está a la derecha.\nAna: Entonces, a la izquierda.\nLuis: Sí, al parque.',glossary:[['entonces','then; so'],['la estación','the station']],questions:[
  choose('Which direction does Ana need?','Left',['Right','Both directions'],'Her destination is the park, which Luis locates to the left.'),
  short('What place is to the right?','the station','la estación',['station','estación'],'Luis connects a la derecha with la estación, not el parque.','fact'),
  choose('What does Ana do with “Entonces, a la izquierda”?','Confirms the direction for her destination',['Changes her destination to the station','Gives the price'],'Entonces links her park destination to the left-hand direction.','inference'),
  short('Where does Ana want to go?','the park','el parque',['park','parque','al parque'],'Her first sentence is voy al parque.','fact'),
  choose('If Ana changes her destination to the station, what should she follow?','A la derecha',['A la izquierda','Todo recto only'],'Transfer the other location in Luis’s directions to the new destination.','transfer')
 ]},
 {title:'¿Está lejos?',text:'Marta: ¿Dónde está la estación?\nLuis: Está lejos. El café está cerca.\nMarta: Ahora voy al café.\nLuis: Todo recto.\nMarta: Bien, gracias.',glossary:[['lejos','far away'],['ahora','now']],questions:[
  choose('Where does Marta decide to go now?','The café',['The station','The pharmacy'],'Her decision is ahora voy al café, after hearing the distances.','sequence'),
  short('Which place is far away?','the station','la estación',['station','estación'],'Está lejos answers Marta’s question about la estación.','fact'),
  choose('Which stated fact supports choosing the café as the nearby destination?','El café está cerca',['La estación está lejos means the café is closed','Luis gives the café’s price'],'The passage explicitly calls the café nearby.','inference'),
  short('What direction does Luis give for Marta’s chosen destination?','straight ahead','todo recto',['straight','recto'],'After Marta chooses the café, Luis says todo recto.','meaning'),
  choose('A friend asks where the pharmacy is. Which question can they use?','¿Dónde está la farmacia?',['¿Dónde es la farmacia?','¿Cuántos años farmacia?'],'Reuse dónde está and change the feminine place name.','transfer')
 ]},
 {title:'Un mensaje desde el parque',text:'Ana está en el parque. Luis escribe un mensaje.\nLuis: ¿Dónde estás?\nAna: Estoy en el parque. ¿Vienes?\nLuis: Sí. Voy al parque.\nAna: El café está a la derecha.\nLuis: Gracias.',glossary:[['un mensaje','a message'],['¿vienes?','are you coming?']],questions:[
  choose('Which statement gives Ana’s current location?','Estoy en el parque',['Voy al parque','El café está a la derecha'],'Estoy en locates her now. Voy al states Luis’s destination.'),
  short('Who is going to the park?','Luis','Luis',[],'Luis writes voy al parque; Ana is already there.','character'),
  choose('Why does “al” appear in Luis’s message?','A + el contracts before parque',['Every feminine place needs al','It means to the right'],'El parque is masculine. The destination combines a and el as al.','meaning'),
  short('Where is the café relative to the park?','to the right','a la derecha',['right','derecha'],'Ana’s last message locates the café to the right.','fact'),
  choose('You are already at the café. Which reply fits “¿Dónde estás?”','Estoy en el café',['Voy al café','Soy el café'],'Current location uses estoy en. Voy al would describe movement there.','transfer')
 ]}
],
[
 {title:'¿Qué hora es?',text:'Ana y Luis están en el café.\nAna: ¿Qué hora es?\nLuis: Es la una.\nAna: Gracias. A las dos tengo clase.\nLuis: Ahora, un té. Luego, la clase.',glossary:[['luego','later; then'],['tengo clase','I have class']],questions:[
  choose('What time is it now?','One o’clock',['Two o’clock','Half past two'],'Luis says es la una. Ana’s class time is a different piece of information.'),
  short('At what hour does Ana have class? A word or number is enough.','two','dos',['2','at two','a las dos','two o’clock'],'A las dos tengo clase gives the time of the activity.','fact'),
  choose('Which happens first in Luis’s plan?','Having tea',['Going to class','Giving directions'],'Ahora, un té comes before luego, la clase.','sequence'),
  short('Which word marks the later activity?','later','luego',['then'],'Luego signals what comes after the tea.','meaning'),
  choose('At 3:00, which answer fits the same clock question?','Son las tres',['Es la tres','A las tres'],'For the current time use son las with hours other than one. A las gives an activity’s time.','transfer')
 ]},
 {title:'El desayuno de Diego',text:'Ana: ¿A qué hora desayunas, Diego?\nDiego: Desayuno a las ocho. A las nueve trabajo en el café.\nAna: Yo desayuno a las nueve.\nLuis: Ahora son las nueve. Un café, por favor.',glossary:[['desayunas','you have breakfast'],['trabajo','I work']],questions:[
  choose('What does Ana’s first question ask for?','The time of Diego’s breakfast',['The time now','Diego’s home city'],'A qué hora desayunas asks when an activity happens, not what time it is now.'),
  short('Who has breakfast at eight?','Diego','Diego',[],'Diego answers desayuno a las ocho; Ana gives nine for herself.','character'),
  choose('Which sequence matches Diego’s morning?','Breakfast, then work',['Work, then breakfast','Two breakfasts'],'His breakfast is at eight and his work at nine.','sequence'),
  short('When does Ana have breakfast? A word or number is enough.','nine','nueve',['9','at nine','a las nueve','nine o’clock'],'Ana says yo desayuno a las nueve.','fact'),
  choose('Luis asks for a coffee at the end. Which response answers that request?','Un café. Aquí tienes',['Tengo veinte años','Está a la izquierda'],'Respond to the café order, not to the earlier time question.','response')
 ]},
 {title:'Nos vemos a las tres',text:'Ana escribe a Marta.\nAna: ¿Nos vemos en el parque?\nMarta: Sí. ¿A qué hora?\nAna: A las tres.\nMarta: Bien. Nos vemos a las tres.\nAna: Hasta luego.',glossary:[['nos vemos','we’ll see each other; see you'],['¿a qué hora?','at what time?']],questions:[
  choose('What are Ana and Marta arranging?','A meeting',['A purchase','A new home city'],'They agree both a place, el parque, and a time, a las tres.'),
  short('Where will they meet?','the park','el parque',['park','parque','en el parque'],'Ana proposes en el parque and Marta accepts.','fact'),
  choose('Why does Marta ask “¿A qué hora?”','The place is agreed but the time is not yet given',['She needs Ana’s age','She wants the time now'],'Ana’s first message gives a place. Marta asks for the missing meeting time.','inference'),
  short('What hour do they agree on? A word or number is enough.','three','tres',['3','at three','a las tres','three o’clock'],'Marta repeats nos vemos a las tres to confirm the agreement.','fact'),
  choose('You propose one o’clock instead. Which message fits?','Nos vemos a la una',['Nos vemos a las una','Son las una'],'Meeting at one needs singular a la una.','transfer')
 ]},
 {title:'Un cambio de hora',text:'Marta: Son las tres menos cuarto. Voy al parque.\nAna: Nos vemos a las tres y media, no a las tres.\nMarta: Ah, a las tres y media. Gracias.\nAna: Sí. Hasta luego.',glossary:[['un cambio','a change'],['menos cuarto','a quarter to'],['y media','half past']],questions:[
  choose('What time is it when Marta sends the first message?','2:45',['3:15','3:30'],'Tres menos cuarto is fifteen minutes before three, so 2:45.'),
  short('At what time is the meeting?','half past three','las tres y media',['3:30','15:30','three thirty','tres y media','a las tres y media'],'Ana corrects the meeting to three thirty, not three o’clock.','meaning'),
  choose('Why does Marta repeat the corrected time?','To confirm she has understood',['To order a coffee','To give her age'],'Repeating a las tres y media checks the new arrangement.','inference'),
  short('Which place is Marta going to?','the park','el parque',['park','parque','al parque'],'Her opening voy al parque gives the destination.','fact'),
  choose('Which final message correctly confirms the meeting?','Nos vemos a las tres y media',['Son las tres menos cuarto','Nos vemos a las tres'],'Use the agreed meeting time, not the earlier clock time or the corrected-away time.','response')
 ]}
]
];
root.FriendsStories=stories;if(typeof module!=='undefined')module.exports=stories;
})(typeof window==='undefined'?globalThis:window);
