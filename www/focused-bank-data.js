(function(root){
'use strict';
// Original Friends to Amigos scenarios. Keys are permanent; never reuse a retired key.
// Listening: key, audio, question, model, two distractors, why, comprehension category.
// Speaking: key, communicative prompt, possible model, optional natural alternative.
const listening={
'A1.1':[
[
['address','Buenos días, Ana. Me llamo Luis.','Who is being greeted?','Ana','Luis','Marta','Ana is addressed; Luis introduces himself.','person'],
['leave','Hasta luego, Marta. Gracias.','What is the speaker doing?','Saying goodbye','Introducing a brother','Ordering breakfast','Hasta luego is a goodbye, not a request.','intention'],
['repair','Hola. ¿Puedes repetir, por favor?','What help is requested?','Repeat what was said','Give a price','Say goodbye','Repetir asks to hear something again.','response'],
['reply','Me llamo Marta. ¿Cómo te llamas?','You are Luis. Which reply fits?','My name is Luis','I am hungry','The bill, please','Cómo te llamas asks your name.','dialogue']
],
[
['origin-home','Soy de Inglaterra. Vivo en Madrid.','Which statement is true?','The speaker is from England','The speaker lives in England','The speaker is from Madrid','Soy de gives origin; vivo en gives the current home.','contrast'],
['age','Me llamo Luis. Tengo diecinueve años.','How old is Luis?','Nineteen','Twenty','Nine','Diecinueve is nineteen; tener expresses age.','number'],
['languages','Hablo español. También hablo inglés.','What does también add?','Another language','Another age','Another city','También means also: English is added to Spanish.','meaning'],
['condition','Soy Ana. Estoy cansada.','How does Ana feel?','Tired','Hungry','Tall','Estoy cansada describes how she feels now.','fact']
],
[
['order-change','Un café con leche, por favor. No quiero té.','Which drink is requested?','Coffee with milk','Tea','Water','The request is café con leche; no quiero rejects tea.','preference'],
['food','Tengo hambre. Pan, por favor.','What does the speaker ask to eat?','Bread','Water','The bill','Pan is bread. Tengo hambre explains the food request.','activity'],
['bill','La cuenta, por favor. Gracias.','What should the waiter bring?','The bill','Another coffee','Bread','La cuenta asks to pay for the meal.','response'],
['two-orders','Ana quiere té. Luis quiere agua.','What does Luis want?','Water','Tea','Coffee','Luis wants agua; the tea belongs to Ana’s order.','person']
],
[
['total','El café cuesta dos euros y el pan cuesta un euro. Son tres euros.','What is the total?','Three euros','Two euros','One euro','Son tres euros states the total, not an individual price.','price'],
['decimal','El té cuesta dos euros con cincuenta.','How much is the tea?','€2.50','€2.15','€5.20','Dos euros con cincuenta means two euros and fifty cents.','price'],
['quantity','Quiero tres libros. Son treinta euros.','How many books does the speaker want?','Three','Thirty','Two','Tres gives the quantity; treinta gives the total price.','number'],
['budget','Tengo veinte euros. El libro cuesta veintiún euros.','Can the speaker pay with that money?','No, one euro is missing','Yes, with one euro left','Yes, it costs twenty','The price is 21 and the speaker has 20: one euro short.','inference']
],
[
['relation','Esta es Marta. Es mi hermana.','Who is Marta to the speaker?','A sister','A mother','A friend','Mi hermana identifies the family relationship.','person'],
['description','Mi hermano es alto y simpático.','Which description fits the brother?','Tall and friendly','Short and tired','Tall and hungry','Alto and simpático describe him; neither is a temporary feeling here.','fact'],
['eyes','Ana tiene los ojos marrones. Luis tiene los ojos azules.','Whose eyes are blue?','Luis’s','Ana’s','Both people’s','Azules describes Luis’s eyes, not Ana’s.','contrast'],
['parents','Estos son mis padres. Son simpáticos.','How many people are introduced?','Two parents','One sister','Three brothers','Mis padres refers to the speaker’s parents, in the plural.','number']
],
[
['keys-phone','Las llaves están en la mesa. El móvil está aquí.','Which object is on the table?','The keys','The mobile phone','The computer','En la mesa locates las llaves; aquí locates the phone.','place'],
['colour','Mi móvil es negro. El libro es rojo.','What colour is the phone?','Black','Red','Blue','Negro describes móvil; rojo describes libro.','fact'],
['existence','Hay un ordenador. No hay una carpeta.','What is present?','A computer','A folder','Two computers','Hay confirms a computer; no hay denies a folder.','contrast'],
['lost','¿Dónde están las llaves? Están aquí, en la mesa.','What would help the speaker?','Point to the table','Give the bill','Describe a brother','The reply gives the keys’ location on the table.','response']
],
[
['station','La estación está cerca. El parque está lejos.','Which place is nearby?','The station','The park','Both places','Cerca applies to the station; lejos applies to the park.','place'],
['direction','Todo recto y después a la derecha.','Which direction comes second?','Right','Straight ahead','Left','Después marks the turn after going straight.','sequence'],
['destination','Voy a la farmacia. No voy al parque.','Where is the speaker going?','The pharmacy','The park','The station','Voy a la farmacia states the destination; no rejects the park.','intention'],
['ask-place','¿Dónde está el café? Está a la izquierda.','Which reply answers the question?','It is on the left','I am twenty','A tea, please','The question asks for the café’s location.','dialogue']
],
[
['quarter','Son las tres menos cuarto.','What time is it?','2:45','3:15','3:45','Tres menos cuarto is a quarter before three.','time'],
['morning','Desayuno a las ocho. Trabajo a las nueve.','What happens first?','Breakfast','Work','Both happen together','Eight comes before nine, so breakfast is first.','sequence'],
['appointment','Quedamos a la una. No a las dos.','When is the meeting?','At one','At two','At twelve','A la una is confirmed; a las dos is rejected.','time'],
['routine','Ana desayuna a las nueve. Luis desayuna a las ocho.','Who has breakfast earlier?','Luis','Ana','Both at the same time','Luis eats at eight; Ana eats at nine.','inference']
]
],
'A1.2':[
[
['instead','Me gustan los libros, pero hoy prefiero el cine.','What does the speaker prefer today?','The cinema','Books','Football','Pero contrasts a general liking with today’s preference.','preference'],
['reason','Prefiero leer porque me gustan los libros.','Why does the speaker choose reading?','They like books','They dislike books','They have to work','Porque introduces the reason: liking books.','reason'],
['shared','Ana: «Me gusta escuchar música». Luis: «A mí también».','What does Luis mean?','He also likes listening to music','He prefers football','He dislikes music','A mí también shares Ana’s preference.','dialogue'],
['plural','Me gusta el cine y me gustan los libros.','Which two interests are mentioned?','Cinema and books','Cinema and clothes','Books and football','The speaker names el cine and los libros.','fact']
],
[
['decline','¿Quieres venir al cine? Lo siento, hoy no puedo.','What happens to the invitation for today?','It is declined','It is accepted','The place changes to the park','Lo siento, no puedo politely declines today’s invitation.','intention'],
['alternative','No puedo hoy. ¿Qué tal mañana?','What alternative is proposed?','Tomorrow','Today','Saturday','Mañana proposes another day, not another place.','response'],
['accept','Marta: «¿Vamos al parque?». Ana: «Sí, buena idea».','What will Ana probably do?','Go to the park with Marta','Decline the invitation','Buy a jacket','Sí, buena idea accepts the suggested outing.','inference'],
['two-people','¿Queréis venir al café? Sí, gracias.','Who is being invited?','More than one person','Only the speaker','Only one person addressed formally','Queréis is the Spain informal plural form for a group.','form']
],
[
['meeting','Quedamos el sábado a las cinco, delante del cine.','Which meeting is arranged?','Saturday at five, outside the cinema','Sunday at five, at home','Saturday at six, outside the café','El sábado, a las cinco and delante del cine give day, time and place.','time'],
['plan-order','Voy a leer por la mañana. Después voy a ir al cine.','What comes after reading?','Going to the cinema','Going to work','Buying clothes','Después puts the cinema after reading.','sequence'],
['change','Quedamos a las seis. No puedo a las cinco.','Which time works?','Six','Five','Seven','A las seis is the arrangement; five is unavailable.','contrast'],
['intention','Mañana vamos a quedar delante del café. Hoy estoy en casa.','What is the plan for tomorrow?','Meet outside the café','Stay at home','Go to the fitting room','Vamos a quedar gives tomorrow’s intention, unlike today’s location.','intention']
],
[
['colour-choice','Necesito una chaqueta. Prefiero la roja, no la azul.','Which jacket does the speaker prefer?','The red one','The blue one','The black one','La roja refers to the preferred jacket; la azul is rejected.','preference'],
['size','¿Tiene la talla mediana? La pequeña me queda pequeña.','Which size is requested?','Medium','Small','Large','The request names mediana; the smaller garment does not fit.','fact'],
['plural-clothes','Quiero unos pantalones negros y una camiseta azul.','What colour are the trousers?','Black','Blue','Red','Negros agrees with pantalones; azul describes camiseta.','form'],
['need','Tengo una camiseta. Necesito una chaqueta para mañana.','What does the speaker still need?','A jacket','A T-shirt','Trousers','Tengo marks what is already owned; necesito marks the missing item.','intention']
],
[
['fitting','¿Puedo probarme la chaqueta? Sí, el probador está a la derecha.','Where should the customer go?','The fitting room on the right','The fitting room on the left','The station','Probador names the place to try on clothes, on the right.','response'],
['too-large','La camiseta me queda grande. ¿Tiene una talla más pequeña?','Why is another size requested?','The T-shirt is too large','It is too small','The colour is wrong','Me queda grande explains needing a smaller size.','reason'],
['payment','Me llevo esta chaqueta. Pago con tarjeta.','How will the customer pay?','By card','In cash','They are not buying it','Pago con tarjeta states the payment method.','fact'],
['buying','La roja me queda pequeña. La azul me queda bien. Me llevo la azul.','Which item will the customer buy?','The blue one','The red one','Both','Me llevo la azul confirms the final choice after checking fit.','sequence']
],
[
['rooms','En mi piso hay dos dormitorios y un salón pequeño.','What does the flat have two of?','Bedrooms','Living rooms','Kitchens','Dos modifies dormitorios, not salón.','number'],
['location','El móvil está debajo de la silla. Las llaves están al lado de la lámpara.','Where is the phone?','Under the chair','Beside the lamp','On the sofa','Debajo de la silla locates the phone; the lamp locates the keys.','place'],
['contrast-home','Mi piso es pequeño, pero cómodo. La cocina es grande.','Which description fits the flat?','Small but comfortable','Large and uncomfortable','Small with no kitchen','Pero connects the flat’s size with its positive comfort.','meaning'],
['furniture','En la cocina hay una mesa y dos sillas. El sofá está en el salón.','Where is the sofa?','In the living room','In the kitchen','Under the table','El sofá está en el salón gives its location separately from kitchen furniture.','place']
],
[
['sequence-day','Primero me ducho y después me visto.','What happens second?','Getting dressed','Showering','Going to bed','Después me visto places dressing after showering.','sequence'],
['wake-sleep','Me levanto a las siete, pero me acuesto a las once.','When does the speaker go to bed?','At eleven','At seven','At eight','Me acuesto is going to bed; me levanto is getting up.','time'],
['reflexive','Ana se ducha a las ocho. Yo me ducho a las nueve.','Who showers at eight?','Ana','The speaker','Both','Se ducha refers to Ana; me ducho refers to the speaker.','form'],
['routine-contrast','Hoy me levanto a las ocho. Normalmente me levanto a las siete.','What is different today?','Getting up one hour later','Going to bed earlier','Getting dressed at seven','Eight is one hour after the usual seven.','inference']
],
[
['work-reason','No puedo ir al cine porque tengo que trabajar.','Why does the speaker decline?','They have to work','They dislike cinema','They want to buy clothes','Porque gives the actual reason: tener que trabajar.','reason'],
['then','Estoy libre, entonces podemos quedar.','Why can they arrange a meeting?','The speaker is free','The speaker has to work','The speaker is asleep','Entonces links being free to being able to meet.','intention'],
['home-reason','Me quedo en casa porque estoy cansada. Después voy a leer.','What will the speaker do at home?','Read','Buy a ticket','Try on clothes','Después voy a leer gives the next activity at home.','activity'],
['linked-day','Primero desayuno. Después voy al trabajo. Por la tarde quedo con Luis.','When does the speaker meet Luis?','In the afternoon','Before breakfast','During breakfast','Por la tarde locates meeting Luis after the morning routine.','sequence']
]
],
'A2.1':[
[
['not-yet','Hoy he visitado el museo, pero todavía no he comido. Voy al café.','What has NOT happened yet?','Eating','Visiting the museum','Leaving home','Todavía no he comido denies eating so far; the museum visit is complete.','contrast'],
['recent-period','Esta semana hemos hecho la compra y hemos comido en casa.','Which period is being described?','This week so far','Last Saturday only','Tomorrow','Esta semana gives an open recent period; hemos reports experiences in it.','time'],
['who-recent','Ana ha visitado el parque. Luis todavía no ha visitado el parque.','Who has visited the park?','Ana only','Luis only','Both','Ha visitado affirms Ana’s visit; todavía no denies Luis’s.','person'],
['recent-order','He hecho la compra y después he comido con Marta. Ahora voy a descansar.','What happened between shopping and the next plan?','Eating with Marta','Resting at home','Going to the museum','Después he comido follows shopping; voy a descansar is the next intention.','sequence'],
['reply-recent','Marta: «¿Has comido hoy?». Luis: «No, todavía no».','Which response would help Luis?','Suggest going to the café','Ask which meal he ate','Say he has already eaten','He has not eaten yet, so a café suggestion fits the supported need.','response']
],
[
['finished-period','Ayer visité el museo. Hoy voy a leer en casa.','When was the museum visit?','Yesterday','Today','Tomorrow','Ayer marks the completed period; today’s activity is still a plan.','time'],
['trip-reason','El sábado fui a Toledo con Ana. Visitamos el museo y después fuimos al parque.','What happened after the museum?','They went to the park','They did the shopping','They stayed in Madrid','Después puts the park second, in the completed outing.','sequence'],
['past-person','Yo hice la compra ayer. Marta hizo la compra hoy.','Who shopped yesterday?','The speaker','Marta','Both','Yo hice goes with ayer; Marta hizo goes with hoy in the explicit contrast.','person'],
['past-v-plan','Ayer fui al café. Mañana voy a ir al parque.','Which activity has already happened?','Going to the café','Going to the park','Both activities','Fui reports the finished café visit; voy a ir describes the future plan.','form'],
['outing-message','Luis: «¿Qué hiciste el sábado?». Ana: «Fui al museo y después hice la compra».','Which summary matches Ana’s answer?','Museum first, shopping second','Shopping first, museum second','Only shopping','Y después orders the two completed actions.','dialogue']
],
[
['value','El tren cuesta veinte euros. El autobús cuesta doce. Tengo tiempo y prefiero gastar menos.','Which option best fits the speaker’s reason?','The bus','The train','Neither option','The bus is cheaper, and the speaker explicitly has time.','reason'],
['speed','El tren tarda una hora. El autobús tarda dos. Necesito llegar pronto.','Which option is faster?','The train','The bus','They take the same time','One hour is shorter than two, supporting the train choice.','comparison'],
['ticket','Quiero un billete de ida y vuelta para el sábado. El tren sale a las nueve.','What ticket is requested?','A return ticket for Saturday','A one-way ticket for today','A room for Saturday','Ida y vuelta specifies a return ticket; el sábado gives its day.','fact'],
['departure','El autobús sale a las diez y llega a las doce. Después voy al hotel.','What happens at twelve?','Arrival','Departure','Checking out','Llega a las doce gives arrival; sale a las diez gives departure.','time'],
['same-duration','Este tren tarda una hora. El otro también tarda una hora, pero cuesta más.','How do the travel times compare?','They are equal','The second is shorter','The first is longer','También repeats the one-hour duration; the contrast is price.','comparison']
],
[
['room-request','Necesito una habitación individual para dos noches. Viajo sola.','Which booking fits?','One person, two nights','Two people, one night','Two people, two nights','Individual and sola identify one guest; dos noches identifies duration.','number'],
['included','El desayuno está incluido. El wifi también, pero la cena no.','Which service is NOT included?','Dinner','Breakfast','Wi-Fi','Pero la cena no explicitly excludes dinner; también adds Wi-Fi.','contrast'],
['night-cost','La habitación cuesta sesenta euros por noche. Quiero dos noches.','What is the nightly price?','Sixty euros','One hundred and twenty euros','Thirty euros','Por noche asks the nightly rate, not the two-night total.','price'],
['quiet','El hotel barato está lejos del centro, pero hay un autobús. Prefiero ese hotel.','What makes the cheaper hotel practical?','There is a bus','It is in the centre','Dinner is free','Hay un autobús supports access despite the distance.','inference'],
['booking-reply','Recepción: «¿Para cuántas personas?». Ana: «Para dos. ¿Tiene una habitación doble?».','What information does Ana give?','Two guests and a double room','Two nights and a single room','The arrival time','Para dos answers the guest question; doble names the room.','dialogue']
],
[
['arrival-cause','Llegué al hotel a las cuatro porque el tren llegó tarde. Tengo una reserva.','Why was arrival at four?','The train was late','The key failed','The room was too small','Porque identifies the delayed train as the cause.','reason'],
['name-reservation','Tengo una reserva a nombre de Luis para dos noches. Llegué hoy.','Whose name is on the booking?','Luis','Ana','Marta','A nombre de Luis identifies the reservation, not a companion.','person'],
['key-problem','La llave no funciona. Estoy en recepción. ¿Puede darme otra llave?','What would solve the immediate problem?','Another key','Another ticket','Breakfast','Otra llave addresses the failed key; the request is explicit.','response'],
['shower','No hay agua caliente en mi habitación. Necesito ayuda antes de ducharme.','What is the problem?','No hot water','No room reservation','No train ticket','No hay agua caliente states the problem, before the planned shower.','fact'],
['arrival-sequence','Ayer llegué al hotel. Después fui al café. Hoy estoy en el hotel para descansar.','Which café visit is described?','A visit after yesterday’s arrival','A visit planned for tomorrow','A visit before yesterday’s arrival','Ayer and después place the café visit after arrival in the finished period.','sequence']
],
[
['negative-symptom','Me duele la garganta. No tengo fiebre, pero estoy cansada.','Which symptom is denied?','Fever','Throat pain','Tiredness','No tengo fiebre is explicit negation; the other two conditions are present.','contrast'],
['since','Me duele la cabeza desde esta mañana. Necesito descansar.','When did the headache begin?','This morning','Yesterday evening','Tomorrow','Desde esta mañana gives the starting point, not the next plan.','time'],
['body-plural','He caminado mucho. Me duelen los pies, pero no me duele la cabeza.','Which body parts hurt?','The feet','The head','The throat','Me duelen los pies affirms feet; no denies head pain.','form'],
['need-rest','Estoy cansado y tengo sed. Quiero agua y voy a descansar en casa.','Which two needs does the speaker express?','Water and rest','Food and a ticket','A doctor and a room','Tengo sed supports water; descansar gives rest.','reason'],
['health-response','Ana: «Me duele la garganta». Marta: «¿Necesitas agua?». Ana: «Sí, por favor».','What help does Ana accept?','Water','Shopping for clothes','A train booking','Sí accepts Marta’s explicit offer of water.','dialogue']
],
[
['appointment','Necesito una cita para hoy. Puedo ir a las doce, pero no a las diez.','Which appointment time works?','Twelve today','Ten today','Twelve tomorrow','Para hoy gives the day; puedo ir a las doce confirms the time.','time'],
['repair-instruction','No entiendo la instrucción. ¿Puede repetir más despacio, por favor?','What does the learner request?','A slower repetition','A different diagnosis','A larger size','Repetir más despacio asks for clearer delivery, not new medical advice.','response'],
['obligation','Hoy tengo que ir al médico. Por eso no puedo quedar con Luis.','Why can the speaker not meet Luis?','They have to go to the doctor','They dislike Luis','They are buying a ticket','Por eso connects the medical visit with declining the meeting.','reason'],
['nearby','Ana: «¿Hay una farmacia cerca?». Recepción: «Sí, al lado de la estación».','Where should Ana look?','Beside the station','Inside the hotel room','At the airport','Al lado de la estación gives the supported location.','place'],
['recent-help','He necesitado ayuda esta semana. Hoy tengo que descansar en casa.','What should happen today?','Rest','Start a new trip','Buy a larger jacket','Tengo que descansar gives today’s continuing need.','intention']
],
[
['past-and-plan','Ayer tomé el autobús. Hoy he vuelto a Madrid y mañana voy a trabajar.','What is planned rather than completed?','Working tomorrow','Taking yesterday’s bus','Returning to Madrid today','Voy a trabajar is the intention; tomé and he vuelto report completed actions.','form'],
['reason-message','He vuelto a casa. Estoy cansada, por eso voy a descansar y después voy a leer.','Why will the speaker rest?','She is tired','She dislikes books','The bus is cheaper','Por eso links tiredness with the next plan to rest.','reason'],
['connected-order','Ayer visité el parque y después tomé el autobús. Hoy he hecho la compra.','What followed the park visit?','Taking the bus','Today’s shopping','Booking a room','Después tomé orders the completed actions yesterday.','sequence'],
['comparison-plan','Prefiero el tren porque es más rápido. Voy a comprar un billete de ida y vuelta para mañana.','Which plan matches the message?','Buy a return train ticket for tomorrow','Take a one-way bus today','Book a room for yesterday','Prefiero el tren and ida y vuelta para mañana jointly specify the plan.','intention'],
['message-contrast','Luis: «¿Has vuelto a Madrid?». Ana: «Sí, he vuelto hoy. Ayer fui a Toledo».','Where is Ana now, according to the reply?','Madrid','Toledo','The pharmacy','He vuelto hoy confirms the return; ayer fui refers to the earlier trip.','dialogue']
]
]
};
const speaking={
'A1.1':[
[
['name','You are Ana. Introduce yourself to Luis.','Hola, me llamo Ana','Hola, soy Ana'],
['ask-name','Ask Marta her name.','¿Cómo te llamas?'],
['morning','Greet Luis in the morning.','Buenos días, Luis'],
['thanks','Someone helps you. Thank them.','Gracias','Muchas gracias'],
['repeat','You did not understand. Ask your classmate to repeat politely.','¿Puedes repetir, por favor?'],
['goodbye','You will see Marta later. Say goodbye.','Hasta luego, Marta','Hasta luego']
],
[
['origin','You are from England. Tell Ana where you are from.','Soy de Inglaterra'],
['home','You live in Madrid. Tell Luis.','Vivo en Madrid'],
['age','You are twenty. Tell Marta your age.','Tengo veinte años'],
['english','Say that you speak English.','Hablo inglés'],
['two-languages','Say that you speak Spanish and English.','Hablo español e inglés','Hablo español. También hablo inglés'],
['tired','You are Ana and feel tired. Tell Luis.','Estoy cansada']
],
[
['coffee','Order a coffee with milk politely.','Un café con leche, por favor'],
['tea','The waiter asks what you want. Ask for tea.','Un té, por favor'],
['bread-water','You want bread and water. Make the request.','Pan y agua, por favor'],
['hungry','Tell Marta you are hungry.','Tengo hambre'],
['bill','You have finished breakfast. Ask for the bill.','La cuenta, por favor'],
['no-coffee','You do not want coffee. Tell the waiter, then request water.','No quiero café. Agua, por favor']
],
[
['ask-price','You point at a book. Ask how much it costs.','¿Cuánto cuesta?'],
['five','Tell Luis that the book costs five euros.','El libro cuesta cinco euros','Son cinco euros'],
['quantity','Ask for three books.','Quiero tres libros'],
['thirty-two','Say the price: thirty-two euros.','Treinta y dos euros'],
['decimal-price','Tell the customer the price is three euros fifty.','Son tres euros con cincuenta','Tres euros con cincuenta'],
['budget','Tell Marta you have twenty euros.','Tengo veinte euros']
],
[
['sister','Introduce Marta as your sister.','Esta es mi hermana Marta'],
['brother','Introduce Luis as your brother.','Este es mi hermano Luis'],
['tall-brother','Describe your brother as tall.','Mi hermano es alto'],
['friendly-sister','Describe your sister as friendly.','Mi hermana es simpática'],
['eyes','Say that Ana has brown eyes.','Ana tiene los ojos marrones'],
['parents','Introduce your parents and say they are friendly.','Estos son mis padres. Son simpáticos']
],
[
['phone','You can see the phone here. Tell Luis.','El móvil está aquí'],
['keys','Tell Marta that the keys are on the table.','Las llaves están en la mesa'],
['computer','Say there is a computer.','Hay un ordenador'],
['blue-book','Describe the object as a blue book.','Es un libro azul'],
['black-phone','Describe your phone as black.','Mi móvil es negro'],
['folder','Luis asks what the object is. Say it is a folder.','Es una carpeta']
],
[
['station','Ask where the station is.','¿Dónde está la estación?'],
['left','Tell Ana that the café is on the left.','El café está a la izquierda'],
['right','Luis needs a direction. Say straight ahead, then right.','Todo recto y después a la derecha'],
['park','Tell Marta you are going to the park.','Voy al parque'],
['pharmacy','Tell Luis you are going to the pharmacy.','Voy a la farmacia'],
['distance','You are discussing the station. Ask whether it is far.','¿Está lejos?']
],
[
['one','Tell Ana that it is one o’clock.','Es la una'],
['half-past','Tell Luis that it is half past two.','Son las dos y media'],
['quarter-to','Say that it is quarter to three.','Son las tres menos cuarto'],
['breakfast','Tell Marta you have breakfast at eight.','Desayuno a las ocho'],
['meet-nine','Confirm that you are meeting at nine.','Quedamos a las nueve'],
['two-times','Say that you have breakfast at eight and work at nine.','Desayuno a las ocho y trabajo a las nueve']
]
],
'A1.2':[
[
['books','Tell Marta you like books.','Me gustan los libros'],
['prefer','Marta suggests football. Say you prefer the cinema.','Prefiero el cine'],
['two-likes','Say that you like reading and listening to music.','Me gusta leer y escuchar música'],
['contrast','Say you like books, but today prefer the cinema.','Me gustan los libros, pero hoy prefiero el cine'],
['reason','Explain that you prefer reading because you like books.','Prefiero leer porque me gustan los libros'],
['shared','Luis says he likes the cinema. Say you do too.','A mí también','A mí también me gusta el cine']
],
[
['invite-park','Invite Marta to the park.','¿Vamos al parque?'],
['invite-friend','Ask Luis whether he wants to come to the cinema.','¿Quieres venir al cine?'],
['accept','Marta invites you to the café. Accept politely.','Sí, gracias','Sí, buena idea'],
['decline','You cannot come today. Decline politely.','Lo siento, hoy no puedo','Lo siento, no puedo hoy'],
['alternative','You cannot come today. Suggest tomorrow instead.','No puedo hoy. ¿Qué tal mañana?'],
['invite-group','Invite Ana and Luis to the café, using the Spain informal plural.','¿Queréis venir al café?']
],
[
['read-plan','Tell Marta you are going to read tomorrow.','Voy a leer mañana','Mañana voy a leer'],
['Saturday','Arrange to meet on Saturday at five.','Quedamos el sábado a las cinco'],
['place','Arrange to meet outside the cinema.','Vamos a quedar delante del cine','Quedamos delante del cine'],
['change-time','You cannot meet at five. Suggest six.','No puedo a las cinco. ¿Qué tal a las seis?'],
['two-plans','Say you will read and then go to the cinema tomorrow.','Mañana voy a leer y después voy a ir al cine'],
['full-meeting','Confirm a meeting outside the café at six on Sunday.','Quedamos el domingo a las seis delante del café']
],
[
['blue-shirt','Ask for a blue T-shirt.','Necesito una camiseta azul','Quiero una camiseta azul'],
['black-trousers','Say you need black trousers.','Necesito unos pantalones negros'],
['medium','Ask whether the shop has medium size.','¿Tiene la talla mediana?'],
['red-choice','The assistant shows a blue jacket and a red one. Say you prefer the red one.','Prefiero la roja'],
['two-items','Say you need a red jacket and blue trousers.','Necesito una chaqueta roja y unos pantalones azules'],
['small-size','Ask politely for the small size.','La talla pequeña, por favor']
],
[
['try','Ask whether you can try on the jacket.','¿Puedo probarme la chaqueta?'],
['fitting-place','Ask where the fitting room is.','¿Dónde está el probador?'],
['too-small','The T-shirt is too small. Explain and request a larger size.','La camiseta me queda pequeña. Necesito una talla más grande'],
['too-big','The jacket is too large. Ask for a smaller size.','La chaqueta me queda grande. ¿Tiene una talla más pequeña?'],
['buy','Tell the assistant you will take this jacket.','Me llevo esta chaqueta'],
['card','Say you will take this T-shirt and pay by card.','Me llevo esta camiseta y pago con tarjeta']
],
[
['living-room','Tell Ana there is a sofa in the living room.','En el salón hay un sofá'],
['kitchen','Describe a kitchen with a table and two chairs.','En la cocina hay una mesa y dos sillas'],
['lamp','Tell Luis the book is next to the lamp.','El libro está al lado de la lámpara'],
['under-chair','Tell Marta the keys are under the chair.','Las llaves están debajo de la silla'],
['flat','Describe your flat as small but comfortable.','Mi piso es pequeño, pero cómodo'],
['rooms-contrast','Say the kitchen is small but the living room is large.','La cocina es pequeña, pero el salón es grande']
],
[
['wake','Tell Marta you get up at seven.','Me levanto a las siete'],
['shower','Say you shower at eight.','Me ducho a las ocho'],
['dressing','Say that you shower first and then get dressed.','Primero me ducho y después me visto'],
['bed','Tell Luis that you go to bed at eleven.','Me acuesto a las once'],
['day-times','Say you get up at seven but go to bed at ten.','Me levanto a las siete, pero me acuesto a las diez'],
['question-routine','Ask Marta what time she gets up.','¿A qué hora te levantas?']
],
[
['work-order','Say that you have breakfast first, then go to work.','Primero desayuno y después voy al trabajo'],
['stay-home','You are Ana. Say you are staying home because you are tired.','Me quedo en casa porque estoy cansada'],
['work-refusal','Decline an invitation because you have to work.','No puedo ir porque tengo que trabajar'],
['free','Tell Luis you are free, so you can meet.','Estoy libre, entonces podemos quedar'],
['afternoon','Tell Marta that today you will read, then go to the cinema.','Hoy voy a leer y después voy al cine'],
['different-choice','You like cinema, but today will meet Luis instead. Explain.','Me gusta el cine, pero hoy voy a quedar con Luis']
]
],
'A2.1':[
[
['recent-visit','Tell Marta you have visited the museum today.','Hoy he visitado el museo'],
['not-eaten','Luis asks if you have eaten. Say not yet.','No, todavía no he comido'],
['recent-shopping','Say you have done the shopping this week.','Esta semana he hecho la compra'],
['shared-meal','Say you and Ana have eaten at home, then ask Luis if he has eaten.','Hemos comido en casa. ¿Has comido tú?'],
['recent-order','Explain that you have shopped and then eaten at home.','He hecho la compra y después he comido en casa'],
['recent-plan','Say you have visited the park today and will now rest at home.','Hoy he visitado el parque. Ahora voy a descansar en casa']
],
[
['yesterday','Say that you visited the museum yesterday.','Ayer visité el museo'],
['trip','Tell Marta you went to Toledo last Saturday.','Fui a Toledo el sábado pasado'],
['shopping','Say you did the shopping for dinner yesterday.','Ayer hice la compra para la cena'],
['outing-order','Say you went to Toledo and then visited the museum.','Fui a Toledo y después visité el museo'],
['third-person','Tell Luis that Ana visited the park yesterday.','Ana visitó el parque ayer'],
['past-plan','Tell Marta you went to the café yesterday and will read today.','Ayer fui al café. Hoy voy a leer']
],
[
['compare-price','Tell Luis the bus is cheaper than the train.','El autobús es más barato que el tren'],
['compare-speed','Explain that you prefer the train because it is faster.','Prefiero el tren porque es más rápido'],
['return','Ask politely for a return ticket.','Un billete de ida y vuelta, por favor','Quiero un billete de ida y vuelta, por favor'],
['departure','Ask when the train leaves on Saturday, then say you need a return ticket.','¿A qué hora sale el tren el sábado? Necesito un billete de ida y vuelta'],
['reason-bus','You have time and want to spend less. Explain why you prefer the bus.','Prefiero el autobús porque es más barato y tengo tiempo'],
['linked-ticket','Ask for a return ticket for tomorrow, then ask the price.','Quiero un billete de ida y vuelta para mañana. ¿Cuánto cuesta?']
],
[
['single-room','Ask to book a single room for two nights.','Quiero reservar una habitación individual para dos noches'],
['guests','Say you need a double room for two people.','Necesito una habitación doble para dos personas'],
['breakfast','Ask whether breakfast is included.','¿El desayuno está incluido?'],
['wifi','Ask whether Wi-Fi is included and what the room costs per night.','¿El wifi está incluido? ¿Cuánto cuesta la habitación por noche?'],
['cheaper-room','Say you prefer this hotel because it is cheaper and near the station.','Prefiero este hotel porque es más barato y está cerca de la estación'],
['booking-date','Request a double room for Friday for two nights.','Una habitación doble para el viernes, para dos noches, por favor']
],
[
['arrival','Say you arrived at the hotel at two yesterday.','Ayer llegué al hotel a las dos'],
['reservation','You are Luis. State that you have a reservation in your name for two nights.','Tengo una reserva a nombre de Luis para dos noches'],
['key','Explain that the key does not work and ask for help.','La llave no funciona. ¿Puede ayudarme?'],
['water','Explain there is no hot water in your room, then request help.','No hay agua caliente en mi habitación. ¿Puede ayudarme?'],
['late','Explain you arrived late because the train arrived late.','Llegué tarde porque el tren llegó tarde'],
['help-repeat','You did not understand reception. Ask for a slower repetition.','¿Puede repetir más despacio, por favor?']
],
[
['throat','Say your throat hurts and you need help.','Me duele la garganta y necesito ayuda'],
['since','Say your head has hurt since this morning.','Me duele la cabeza desde esta mañana'],
['feet','You have walked a lot today. Say your feet hurt.','He caminado mucho hoy. Me duelen los pies'],
['no-fever','You are Ana. Say you have no fever but are tired.','No tengo fiebre, pero estoy cansada'],
['rest','Explain that you need water and will rest at home.','Necesito agua y voy a descansar en casa'],
['decline-health','You have a fever and cannot meet today. Tell Luis.','Tengo fiebre y no puedo quedar hoy']
],
[
['near-pharmacy','Ask if there is a pharmacy nearby.','¿Hay una farmacia cerca?'],
['appointment','Ask politely for an appointment today.','Necesito una cita para hoy, por favor','Quiero una cita para hoy, por favor'],
['repeat-instruction','You did not understand the pharmacist. Say so, then ask for a slower repetition.','No entiendo. ¿Puede repetir más despacio, por favor?'],
['doctor-reason','Say you cannot come because you have to go to the doctor.','No puedo venir porque tengo que ir al médico'],
['recent-need','Say you have needed help this week and must rest today.','He necesitado ayuda esta semana. Hoy tengo que descansar'],
['confirm-time','Confirm that you can attend at twelve today, then thank the receptionist.','Puedo ir a las doce hoy. Gracias']
],
[
['return-message','Tell Marta you have returned to Madrid today and will rest.','He vuelto a Madrid hoy. Voy a descansar'],
['past-arrival','Say you took the bus yesterday and arrived at nine.','Ayer tomé el autobús y llegué a las nueve'],
['past-next','Say you visited the park yesterday and will go to the cinema tomorrow.','Ayer visité el parque. Mañana voy a ir al cine'],
['reason-rest','You are Ana. Say you are tired, so you will rest at home.','Estoy cansada, por eso voy a descansar en casa'],
['three-times','Say you went to Toledo yesterday, have returned today and will work tomorrow.','Ayer fui a Toledo. Hoy he vuelto y mañana voy a trabajar'],
['connected-options','Say you prefer the train because it is faster, and will buy a return ticket.','Prefiero el tren porque es más rápido. Voy a comprar un billete de ida y vuelta']
]
]
};
root.FocusedBankData={listening,speaking};if(typeof module!=='undefined')module.exports=root.FocusedBankData;
})(typeof window==='undefined'?globalThis:window);
