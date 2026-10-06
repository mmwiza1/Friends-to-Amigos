(function(root){
'use strict';
// Original A1.2 scenarios. Each question's evidence is in its own passage.
function create(choice,short){
 const c=(p,a,b,d,e,mode='meaning')=>choice(p,a,b,d,e,'Reading comprehension',mode);
 const t=(p,en,es,variants,e,mode='meaning')=>short(p,en,es,variants,e,mode);
 const s=(title,text,glossary,questions)=>({title,text,glossary,questions});
 return [
 [
 s('Una tarde libre','Ana y Luis están en el café.\nLuis: Esta tarde estoy libre. ¿Te gusta el fútbol?\nAna: No me gusta el fútbol, pero me gusta leer.\nLuis: A mí también me gustan los libros. En el parque hay una mesa.\nAna: Buena idea. Podemos leer allí y después tomar un café.',[['libre','free; available'],['podemos','we can'],['allí','there']], [
 c('Why is reading a suitable activity for both friends?','Both enjoy books','Both dislike reading','They need to buy a table','Ana likes reading and Luis also likes books.','inference'),
 t('Which activity does Ana say she does not like?','football','el fútbol',['fútbol','soccer'],'No me gusta el fútbol gives her dislike.','fact'),
 c('What does también add to Luis’s reply?','He shares the interest','He changes the day','He refuses the plan','También means also and connects his interest to Ana’s.'),
 t('Where do they suggest reading?','in the park','en el parque',['park','the park','parque'],'Luis mentions a table in the park; allí refers back to that place.','context'),
 c('What is their plan after reading?','Have a coffee','Play football','Buy a book','Después introduces tomar un café as the next activity.','sequence')]),
 s('Música en casa','Marta invita a Ana a su piso.\nMarta: Me gusta escuchar música en casa. ¿Y a ti?\nAna: A mí también, pero prefiero leer por la mañana.\nMarta: Tengo música tranquila.\nAna: Perfecto. Hoy no quiero salir. Podemos escuchar música aquí.\nMarta: Sí, y después tomamos un té.',[['escuchar','to listen'],['tranquila','calm; quiet'],['salir','to go out']], [
 c('Which preference does Ana express for the morning?','Reading','Going out','Drinking coffee','Ana says prefiero leer por la mañana.'),
 t('Who has calm music?','Marta','Marta',[],'Tengo is spoken by Marta.','character'),
 c('Why does the plan suit Ana today?','It lets her stay indoors','It takes her to a shop','It requires football','Ana does not want to go out; music aquí is at Marta’s flat.','inference'),
 t('What drink is planned afterwards?','tea','té',['a tea','un té'],'Después tomamos un té identifies the drink.','fact'),
 c('Which response agrees with “Me gusta escuchar música”?','A mí también','A mí tampoco','No me gusta','También agrees with a positive like.','response')]),
 s('Elegir juntos','Luis: ¿Cine o parque esta tarde?\nAna: Prefiero el cine porque me gustan las películas.\nLuis: A mí me gusta caminar, pero hoy prefiero el cine también.\nMarta: ¿Una película de música?\nAna: Sí, buena idea.\nLuis: Entonces vamos al cine. Después podemos caminar un poco.',[['las películas','films'],['caminar','to walk'],['un poco','a little']], [
 c('What reason does Ana give for her choice?','She likes films','She wants new clothes','She is hungry','Porque introduces me gustan las películas.'),
 t('Which place do they choose?','the cinema','el cine',['cinema','cine'],'Entonces vamos al cine states the decision.','fact'),
 c('Does Luis abandon walking completely?','No, they may walk afterwards','Yes, he dislikes walking','Yes, the park is closed','Después podemos caminar leaves walking as a later option.','inference'),
 t('Who suggests a film about music?','Marta','Marta',[],'Marta asks ¿Una película de música?','character'),
 c('Which reply fits Ana’s preference?','A mí también me gusta el cine','A mí también tengo el cine','Yo gustan las películas','Me gusta correctly expresses a shared interest.','response')]),
 s('Un libro para Diego','Ana y Marta miran dos libros en una tienda.\nAna: Diego quiere un libro. Le gusta la música.\nMarta: Este libro es de música y este es de fútbol.\nAna: Prefiero el de música porque a Diego no le gusta el fútbol.\nMarta: Sí. Y después vamos al café.\nAna: Podemos darle el libro allí.',[['miran','look at'],['le gusta','he/she likes'],['darle','give him/her']], [
 c('Which book is more suitable for Diego?','The music book','The football book','Neither, because he dislikes music','His music interest and football dislike support the choice.','inference'),
 t('Who will receive the book?','Diego','Diego',[],'Diego quiere un libro and darle refer to Diego.','character'),
 c('What does el de música refer to?','The book about music','The café','A music film','El replaces masculine libro to avoid repeating it.','context'),
 t('Where do they plan to give it to him?','at the café','en el café',['café','the café','el café'],'Allí refers to the café in Marta’s previous line.'),
 c('What happens next in their plan?','They go to the café','They play football','They get dressed','Después vamos al café gives the next destination.','sequence')])
 ],
 [
 s('Una invitación sencilla','Luis ve a Ana delante del café.\nLuis: ¿Quieres venir al parque conmigo?\nAna: Sí, buena idea. Hoy estoy libre.\nLuis: Podemos caminar y tomar algo.\nAna: Perfecto. ¿Viene Marta también?\nLuis: Sí, quiere venir. Vamos los tres.',[['conmigo','with me'],['tomar algo','have a drink or something to eat'],['los tres','the three of us']], [
 c('How does Ana respond to the invitation?','She accepts','She refuses','She asks for a size','Sí, buena idea accepts Luis’s invitation.','response'),
 t('Where does Luis invite Ana?','to the park','al parque',['park','the park','parque'],'Luis asks venir al parque.','fact'),
 c('What does vamos los tres mean here?','Ana, Luis and Marta go together','Only Ana goes','Diego goes alone','Marta’s coming makes a group of three.','inference'),
 t('Who asks whether Marta is coming?','Ana','Ana',[],'Ana asks ¿Viene Marta también?','character'),
 c('Which reply could Marta give to join them?','Sí, quiero venir','No puedo venir','La talla pequeña','Quiero venir expresses her wish to join the outing.','response')]),
 s('Hoy no puedo','Marta llama a Ana.\nMarta: ¿Vamos al cine hoy?\nAna: Lo siento, no puedo. Tengo que estudiar.\nMarta: ¿Qué tal mañana?\nAna: Mañana sí puedo. Gracias por invitarme.\nMarta: Perfecto. Mañana vamos al cine.',[['llama','calls'],['tengo que','I have to'],['invitarme','invite me']], [
 c('Does Ana reject all cinema plans?','No, she accepts tomorrow','Yes, she dislikes films','Yes, she never goes out','Mañana sí puedo accepts the alternative day.','inference'),
 t('Why can Ana not go today? Give the activity she must do.','study','estudiar',['studying','to study','she has to study','tiene que estudiar'],'Tengo que estudiar supplies the reason.'),
 c('What is the function of lo siento?','It softens a refusal','It names the film','It proposes a price','Lo siento is a polite apology before no puedo.','context'),
 t('Who suggests tomorrow?','Marta','Marta',[],'Marta offers ¿Qué tal mañana?','character'),
 c('Which message confirms their final plan?','Mañana vamos al cine','Hoy vamos al cine','Mañana no puedo','The agreement changes from today to tomorrow.','response')]),
 s('Un paseo corto','Diego termina de trabajar a las seis.\nLuis: ¿Quieres venir al parque después?\nDiego: Sí, pero solo tengo media hora.\nLuis: No pasa nada. Podemos dar un paseo corto.\nDiego: Buena idea. Después voy a casa.\nLuis: Entonces nos vemos delante del café.',[['media hora','half an hour'],['no pasa nada','that is okay'],['dar un paseo','go for a walk'],['corto','short']], [
 c('Why do they choose a short walk?','Diego has limited time','Luis dislikes the park','The café has no chairs','Solo tengo media hora limits Diego’s available time.','inference'),
 t('At what time does Diego finish work?','six','las seis',['6','at six','a las seis'],'Termina de trabajar a las seis gives the time.','fact'),
 c('What does no pasa nada communicate?','Luis accepts the time limit','Luis cancels the outing','Luis asks a price','Luis reassures Diego and proposes a shorter walk.','context'),
 t('Where do they agree to meet?','in front of the café','delante del café',['outside the café','frente al café'],'Luis’s final line gives the meeting place.'),
 c('What will Diego do after the walk?','Go home','Work until midnight','Go shopping','Después voy a casa states the next action.','sequence')]),
 s('La invitación del grupo','Ana escribe a Luis y Marta: “¿Queréis venir a mi piso mañana? Podemos tomar té y escuchar música”.\nMarta: Sí, gracias.\nLuis: Lo siento, mañana no puedo. ¿Qué tal el sábado?\nAna: El sábado también puedo.\nMarta: Perfecto, entonces el sábado.\nAna: ¡Nos vemos!', [['escribe','writes'],['queréis','you want (informal plural in Spain)'],['el grupo','the group']], [
 c('Why does Ana use queréis?','She addresses two friends','She speaks about herself','She addresses one shop assistant','Spain’s informal plural form addresses Luis and Marta together.'),
 t('Who cannot come tomorrow?','Luis','Luis',[],'Luis says mañana no puedo.','character'),
 c('What changes after Luis replies?','The day','The drink','The home address','The group changes tomorrow to Saturday, keeping the invitation.','inference'),
 t('Which day do they finally choose?','Saturday','el sábado',['sábado','on Saturday'],'Marta confirms entonces el sábado.','fact'),
 c('Which message accepts Ana’s invitation politely?','Sí, gracias','No quiero nada','¿Qué talla?','Sí, gracias is Marta’s brief acceptance.','response')])
 ],
 [
 s('El sábado en el cine','Ana mira los horarios del cine.\nAna: Voy a ir al cine el sábado. ¿Quieres venir, Luis?\nLuis: Sí. ¿A qué hora quedamos?\nAna: A las cinco, delante del cine. La película empieza a las cinco y media.\nLuis: Perfecto. Primero podemos tomar un café.',[['los horarios','schedules'],['empieza','starts'],['primero','first']], [
 c('Why do they meet before five thirty?','There is time for coffee before the film','The film ends at five','They need to buy a jacket','The film starts at five thirty; their meeting is at five.','inference'),
 t('On which day is the plan?','Saturday','el sábado',['sábado','on Saturday'],'Ana says voy a ir al cine el sábado.','fact'),
 c('Which question asks for their meeting time?','¿A qué hora quedamos?','¿Dónde quedamos?','¿Qué talla tiene?','A qué hora asks when; dónde asks where.'),
 t('Where will they meet?','in front of the cinema','delante del cine',['outside the cinema','frente al cine'],'Ana supplies delante del cine as the meeting place.'),
 c('What do they plan to do first?','Have a coffee','Watch the film','Go home','Primero podemos tomar un café comes before the film.','sequence')]),
 s('Un cambio de hora','Marta escribe a Ana: “Mañana vamos a quedar en el parque a las cuatro”.\nAna: A las cuatro tengo clase. ¿Podemos quedar a las cinco?\nMarta: Sí, a las cinco está bien.\nAna: Perfecto. Voy a salir de clase y después voy al parque.\nMarta: Nos vemos delante de la entrada.',[['la entrada','the entrance'],['salir de clase','leave class'],['está bien','is fine']], [
 c('Why does Ana request a different time?','She has class at four','She dislikes the park','She needs a smaller size','A las cuatro tengo clase explains the conflict.','inference'),
 t('What time do they finally agree?','five','las cinco',['5','at five','a las cinco'],'Marta accepts a las cinco está bien.'),
 c('Which action happens before Ana goes to the park?','Leaving class','Going to bed','Buying clothes','Voy a salir de clase y después voy al parque gives the order.','sequence'),
 t('Who accepts the later time?','Marta','Marta',[],'Marta confirms the proposed five o’clock meeting.','character'),
 c('Which reminder matches the final agreement?','Mañana, a las cinco','Hoy, a las cuatro','Mañana, a las cuatro','The day stays tomorrow but the time becomes five.','response')]),
 s('Planes distintos','Luis y Diego hablan en el café.\nLuis: El domingo voy a jugar al fútbol por la mañana. ¿Y tú?\nDiego: Voy a trabajar por la mañana, pero por la tarde estoy libre.\nLuis: Entonces podemos quedar por la tarde.\nDiego: Sí. Voy a ir al parque a las seis.\nLuis: Yo también.',[['jugar al fútbol','play football'],['por la tarde','in the afternoon/evening'],['distintos','different']], [
 c('Why is the afternoon suitable for both?','Diego works in the morning but is free later','Luis works all afternoon','Diego is never free','Diego explicitly contrasts morning work with being free later.','inference'),
 t('What activity does Luis plan for the morning?','football','fútbol',['play football','jugar al fútbol','soccer'],'Voy a jugar al fútbol describes Luis’s plan.','fact'),
 c('Which phrase expresses a plan rather than a location?','Voy a trabajar','Estoy en el café','El parque está cerca','Voy a + infinitive expresses an intended activity.'),
 t('At what time does Diego plan to go to the park?','six','las seis',['6','at six','a las seis'],'His final plan includes a las seis.'),
 c('What does yo también mean in Luis’s last reply?','He shares the park plan','He also works that morning','He refuses to meet','Luis responds to Diego’s most recent park plan.','context')]),
 s('Dónde quedamos','Ana y Marta van a comprar una camiseta el lunes.\nAna: ¿Quedamos delante del café a las diez?\nMarta: El café está lejos de la tienda. Prefiero quedar delante de la tienda.\nAna: Buena idea. Entonces a las diez, delante de la tienda.\nMarta: Después podemos ir al café.\nAna: Sí, perfecto.',[['la tienda','the shop'],['lejos de','far from'],['comprar','to buy']], [
 c('What detail of the meeting changes?','The place','The day','The time','The meeting moves from the café to the shop; ten stays the same.'),
 t('On which day do they plan to shop?','Monday','el lunes',['lunes','on Monday'],'The opening sentence names el lunes.','fact'),
 c('Why does Marta prefer the shop as a meeting place?','The café is far from it','The café is closed','The shirt is too small','Marta gives the distance as her reason.','inference'),
 t('What time remains unchanged?','ten','las diez',['10','at ten','a las diez'],'Both proposed and final plans keep a las diez.'),
 c('What comes after shopping in their plan?','Going to the café','Meeting at nine','Going to class','Después podemos ir al café adds the later activity.','sequence')])
 ],
 [
 s('Para el parque','Ana y Marta miran ropa.\nAna: Necesito una camiseta para ir al parque.\nMarta: Esta camiseta es roja y esta es azul.\nAna: Prefiero la azul. También necesito unos pantalones negros.\nMarta: Aquí hay unos.\nAna: Perfecto. No necesito una chaqueta hoy, hace calor.',[['la ropa','clothes'],['hace calor','it is hot'],['aquí hay unos','there are some here']], [
 c('Which T-shirt does Ana choose?','The blue one','The red one','The black one','La azul replaces la camiseta azul.'),
 t('What colour trousers does Ana need?','black','negros',['negro','black trousers','pantalones negros'],'Ana asks for unos pantalones negros.','fact'),
 c('Why does Ana not need a jacket today?','It is hot','It is too expensive','She already has a red one','Hace calor supports her decision not to need a jacket.','inference'),
 t('Who points out the trousers?','Marta','Marta',[],'Marta says aquí hay unos.','character'),
 c('Which request matches Ana’s needs?','Una camiseta azul y unos pantalones negros','Una chaqueta roja y una falda','Unos pantalones rojos','The first combines the two items she asks for.','response')]),
 s('Dos tamaños','Luis busca una camiseta.\nLuis: Necesito la talla mediana.\nAna: Esta es pequeña y esta es mediana.\nLuis: La mediana, por favor. ¿Es azul?\nAna: No, es verde. La azul es pequeña.\nLuis: Entonces prefiero la verde. Necesito una camiseta mediana, no pequeña.',[['tamaños','sizes'],['verde','green'],['busca','looks for']], [
 c('Why does Luis choose green instead of blue?','The green shirt is medium','He never likes blue','The blue shirt is expensive','Medium size is his requirement; the blue shirt is small.','inference'),
 t('Which size does Luis need?','medium','mediana',['medium size','la talla mediana','talla mediana'],'He repeats that he needs medium.','fact'),
 c('What does la mediana stand for?','The medium T-shirt','The shop assistant','The green trousers','La mediana refers to feminine camiseta in the exchange.','context'),
 t('What colour is the small T-shirt?','blue','azul',['the blue one','la azul'],'Ana says la azul es pequeña.'),
 c('Which request keeps Luis’s main requirement?','Una camiseta mediana','Una camiseta pequeña','Unos pantalones pequeños','The required garment and size matter more here than blue.','response')]),
 s('Una chaqueta para Marta','Marta: Mañana voy a caminar y necesito una chaqueta.\nAna: ¿Prefieres la roja o la negra?\nMarta: La negra. Me gustan los pantalones negros también.\nAna: Esta chaqueta es pequeña.\nMarta: Necesito la talla mediana. Vamos a preguntar en la tienda.\nAna: Sí, y después podemos tomar algo.',[['preguntar','to ask'],['negra','black (feminine)'],['tomar algo','have a drink or snack']], [
 c('What still needs checking before Marta buys the jacket?','Whether there is medium size','Whether Ana likes football','Whether the café has tea','The shown jacket is small but Marta needs medium.','inference'),
 t('Which jacket colour does Marta prefer?','black','negra',['negro','black jacket','la negra'],'Marta chooses la negra.'),
 c('Why is negra used with chaqueta?','Chaqueta is feminine singular','All clothes are feminine','Marta is speaking in the past','The adjective agrees with the garment, not the speaker.'),
 t('Who suggests asking in the shop?','Marta','Marta',[],'Marta says vamos a preguntar en la tienda.','character'),
 c('What is the immediate next step?','Ask about medium size','Drink tea first','Play football','They need to ask in the shop before the later drink.','sequence')]),
 s('La lista de ropa','Ana escribe una lista: “Una camiseta blanca y unos pantalones azules”.\nLuis: ¿Necesitas zapatos también?\nAna: No, tengo zapatos. Solo necesito la camiseta y los pantalones.\nLuis: ¿Qué talla de camiseta?\nAna: Mediana. Voy a comprar la ropa mañana.\nLuis: Perfecto, puedo ir contigo.',[['blanca','white (feminine)'],['los zapatos','shoes'],['contigo','with you']], [
 c('Which item should be left off Ana’s shopping list?','Shoes','A white T-shirt','Blue trousers','Ana already has shoes and says no to adding them.','inference'),
 t('What colour T-shirt is on the list?','white','blanca',['blanco','una camiseta blanca'],'The written list names una camiseta blanca.','fact'),
 c('Why is azules plural?','It describes plural pantalones','It describes Ana and Luis','All colours are plural','Azules agrees with pantalones.'),
 t('When will Ana buy the clothes?','tomorrow','mañana',['tomorrow'],'Voy a comprar la ropa mañana gives tomorrow, not a specific time.'),
 c('Which reply offers company?','Puedo ir contigo','No necesito zapatos','La talla pequeña','Contigo means with you; Luis offers to go along.','response')])
 ],
 [
 s('En el probador','Ana entra en la tienda con Marta.\nAna: ¿Puedo probarme esta camiseta?\nDependienta: Sí, el probador está a la derecha.\nAna se prueba la camiseta.\nAna: Me queda pequeña. ¿Tiene una talla más grande?\nDependienta: Sí, aquí tiene la mediana.\nMarta: Vamos a probar esa.',[['la dependienta','the shop assistant'],['se prueba','tries on'],['aquí tiene','here you are (polite)']], [
 c('Why does Ana ask for another size?','The shirt is too small','She dislikes all shirts','The fitting room is closed','Me queda pequeña states the fitting problem.','inference'),
 t('Where is the fitting room?','on the right','a la derecha',['right','the right'],'The assistant gives a la derecha.','fact'),
 c('Which request responds to the problem?','Una talla más grande, por favor','Una talla más pequeña, por favor','Un té, por favor','A larger size addresses the too-small shirt.','response'),
 t('What size does the assistant offer next?','medium','mediana',['the medium size','la mediana','la talla mediana'],'The assistant offers la mediana.'),
 c('What will Ana probably do next?','Try the medium shirt','Go to bed','Buy shoes immediately','Marta says vamos a probar esa, referring to the offered medium shirt.','inference')]),
 s('La chaqueta grande','Luis se prueba una chaqueta negra.\nLuis: Me queda grande. ¿Tiene la talla pequeña?\nDependiente: Sí, aquí tiene.\nLuis se prueba la pequeña.\nLuis: Esta me queda bien. Me llevo esta chaqueta.\nDependiente: Son treinta euros.\nLuis: Pago con tarjeta.',[['el dependiente','the shop assistant'],['me queda bien','it fits me well'],['con tarjeta','by card']], [
 c('Which jacket does Luis decide to buy?','The smaller black jacket','The first large jacket','A blue T-shirt','He tries the small size, says it fits and chooses it.'),
 t('What is wrong with the first jacket?','too big','grande',['big','it is too big','le queda grande','me queda grande'],'Me queda grande explains why he needs a smaller size.'),
 c('What does me llevo esta mean in this shop?','I will take this one','I am getting up','I cannot come','Llevarse here states a purchase decision.','context'),
 t('How does Luis pay?','by card','con tarjeta',['card','tarjeta'],'His final line gives the payment method.','fact'),
 c('Which question would ask for the price before buying?','¿Cuánto cuesta?','¿Dónde quedamos?','¿A qué hora te duchas?','Cuánto cuesta asks the price of an item.','transfer')]),
 s('Otro color','Marta quiere una camiseta roja de talla mediana.\nDependienta: Lo siento, la roja solo está en talla pequeña. Tenemos una azul mediana.\nMarta: ¿Puedo probarme la azul?\nDependienta: Claro.\nMarta: Me queda bien. Prefiero la roja, pero necesito la talla mediana. Me llevo la azul.',[['tenemos','we have'],['claro','of course'],['solo','only']], [
 c('Why does Marta buy blue despite preferring red?','Blue is available in her size and fits','Red is more expensive','She dislikes red','Red is only small; blue medium fits.','inference'),
 t('Which size does Marta need?','medium','mediana',['la talla mediana','medium size'],'The opening and final lines state the required size.'),
 c('Which contrast does pero introduce?','Preferred colour versus required size','Morning versus night','Home versus work','Marta contrasts wanting red with needing medium.','context'),
 t('Which colour does she buy?','blue','azul',['la azul','the blue one'],'Me llevo la azul states the final choice.','fact'),
 c('Which polite reply grants permission to try it on?','Claro','Lo siento, no puedo','Me queda grande','The assistant uses claro to say yes to the request.','response')]),
 s('Antes de pagar','Ana lleva una camiseta al mostrador.\nDependiente: Son doce euros.\nAna: ¿Puedo pagar con tarjeta?\nDependiente: Sí. ¿Quiere una bolsa?\nAna: No, gracias. Tengo una mochila.\nMarta: Después vamos al café.\nAna: Sí, primero pago y después salimos.',[['el mostrador','the counter'],['una bolsa','a bag'],['una mochila','a backpack'],['salimos','we go out/leave']], [
 c('Why does Ana decline a bag?','She has a backpack','She does not buy the shirt','The price is too high','Tengo una mochila explains how she can carry the purchase.','inference'),
 t('How much is the T-shirt?','twelve euros','doce euros',['12 euros','€12'],'Son doce euros gives the price.','fact'),
 c('What must happen before they leave?','Ana pays','They drink coffee','They go to the park','Primero pago puts payment before leaving.','sequence'),
 t('What payment method does Ana ask to use?','card','tarjeta',['by card','con tarjeta'],'Pagar con tarjeta is her payment request.'),
 c('Which reply politely refuses the offered bag?','No, gracias','No me queda bien','¿Quieres venir?','No, gracias responds directly to the bag offer.','response')])
 ],
 [
 s('Una visita al piso','Marta visita el piso de Ana.\nAna: Este es el salón. Hay un sofá y una mesa pequeña.\nMarta: Es cómodo. ¿Dónde está la cocina?\nAna: Al lado del salón. La cocina es pequeña, pero hay una mesa y dos sillas.\nMarta: Perfecto. Podemos tomar té allí.\nAna: Sí, y después escuchamos música en el salón.',[['visita','visits'],['cómodo','comfortable'],['el salón','the living room']], [
 c('Which room do they choose for tea?','The kitchen','The bedroom','The bathroom','Marta suggests tea allí after Ana describes the kitchen.','context'),
 t('Where is the kitchen?','next to the living room','al lado del salón',['beside the living room'],'Ana gives al lado del salón.'),
 c('What makes the small kitchen suitable for tea together?','There is a table and two chairs','There are no chairs','There is a sofa in it','The table and two chairs support having tea as a pair.','inference'),
 t('How many chairs are in the kitchen?','two','dos',['2','two chairs','dos sillas'],'Dos sillas gives the number.','fact'),
 c('What is planned after tea?','Music in the living room','Buying clothes','Showering','Después escuchamos música en el salón gives the later activity.','sequence')]),
 s('Las llaves de Luis','Luis está en el piso de Ana.\nLuis: No encuentro mis llaves.\nAna: ¿Están encima de la mesa?\nLuis: No. En la mesa hay un libro.\nMarta: Mira debajo de la silla, al lado del sofá.\nLuis: ¡Aquí están! Gracias.\nAna: Perfecto. Ahora podemos salir.',[['no encuentro','I cannot find'],['encima de','on top of'],['mira','look'],['ahora','now']], [
 c('Where does Luis find the keys?','Under the chair beside the sofa','On the table','In the kitchen cupboard','Marta’s instruction and Luis’s aquí están locate the keys.'),
 t('What is on the table instead of the keys?','a book','un libro',['book','libro'],'Luis says en la mesa hay un libro.','fact'),
 c('Who gives the helpful second location?','Marta','Diego','Luis','Marta tells him to look under the chair.','character'),
 t('What can the group now do?','go out','salir',['leave','go outside','they can go out','pueden salir'],'Ahora podemos salir follows finding the keys.','inference'),
 c('Which sentence correctly reports the found keys?','Las llaves están debajo de la silla','Las llaves es debajo de la silla','Las llaves está debajo de la silla','Plural llaves needs están for a location.','transfer')]),
 s('Un rincón para leer','Ana quiere leer en casa.\nAna: En mi dormitorio hay una cama, pero no hay una mesa.\nLuis: En el salón hay una mesa al lado de la ventana.\nAna: Sí, y la lámpara está encima de la mesa.\nLuis: Entonces puedes leer allí.\nAna: Buena idea. Primero voy a preparar un té.',[['un rincón','a corner; small space'],['la ventana','the window'],['preparar','to prepare']], [
 c('Why is the living room suggested for reading?','It has a table and a lamp','It has no furniture','Ana wants to sleep there','Luis points to the table and Ana adds the lamp.','inference'),
 t('Which room lacks a table?','the bedroom','el dormitorio',['bedroom','dormitorio'],'Ana says no hay una mesa in her bedroom.','fact'),
 c('What does no hay express?','Something does not exist there','A known object is large','Someone is tired','No hay introduces absence, unlike estar for location.'),
 t('What is next to the living-room table?','the window','la ventana',['window','ventana'],'The table is al lado de la ventana.'),
 c('What will Ana do before reading?','Prepare tea','Buy a bed','Go to the park','Primero voy a preparar un té gives the first action.','sequence')]),
 s('Dormir y trabajar','Marta enseña su piso a Luis.\nMarta: Hay un dormitorio y un salón. Mi piso es pequeño, pero cómodo.\nLuis: ¿Dónde está tu ordenador?\nMarta: En el salón, encima de la mesa. Trabajo allí por la mañana.\nLuis: ¿Y por la tarde?\nMarta: Voy a leer en el sofá. El dormitorio es para dormir.',[['enseña','shows'],['dormir','to sleep'],['por la mañana','in the morning']], [
 c('Which room serves both work and leisure?','The living room','The bedroom','The kitchen','Marta works at the living-room table and later reads on its sofa.','inference'),
 t('Where is the computer?','on the table','encima de la mesa',['on the living-room table','en la mesa','sobre la mesa'],'Marta locates it encima de la mesa in the living room.'),
 c('What does pequeño, pero cómodo express?','A contrast between size and comfort','A future purchase','A change of meeting time','Pero links the small size with being comfortable.','context'),
 t('When does Marta work at home?','in the morning','por la mañana',['morning','the morning'],'Trabajo allí por la mañana states when.','fact'),
 c('Which response answers “¿Qué vas a hacer por la tarde?” as Marta?','Voy a leer en el sofá','Trabajo por la mañana','Me llevo esta camiseta','Her afternoon plan is reading on the sofa.','response')])
 ],
 [
 s('Antes del trabajo','Diego habla de su mañana.\nDiego: Me levanto a las siete. Primero me ducho y después desayuno.\nAna: ¿Desayunas en casa?\nDiego: Sí, tomo un café y una tostada. Después voy al trabajo a las ocho.\nAna: Yo me levanto a las ocho.\nDiego: Entonces mi mañana empieza antes que la tuya.',[['la tostada','toast'],['antes que','earlier than'],['la tuya','yours']], [
 c('Who gets up earlier?','Diego','Ana','Both at the same time','Diego gets up at seven; Ana at eight.','inference'),
 t('What does Diego do before breakfast?','shower','ducharse',['take a shower','se ducha','me ducho'],'Primero me ducho comes before después desayuno.','sequence'),
 c('Which sentence describes Diego’s own routine in his voice?','Me levanto a las siete','Te levanto a las siete','Me levanta a las siete','Me and levanto both match the speaker.','response'),
 t('Where does Diego have breakfast?','at home','en casa',['home','casa'],'He answers sí to desayunas en casa.','fact'),
 c('What follows breakfast in Diego’s routine?','Going to work','Getting up','Going to bed','Después voy al trabajo is the next step.','sequence')]),
 s('Primero la ducha','Marta y Ana hablan antes de salir.\nMarta: Me ducho y después me visto.\nAna: Yo también. Pero hoy necesito una camiseta limpia.\nMarta: Hay una azul en tu dormitorio.\nAna: Perfecto. Primero me ducho, después me visto y luego desayunamos.\nMarta: Sí. Podemos salir después del desayuno.',[['limpia','clean'],['luego','then'],['el desayuno','breakfast']], [
 c('What order does Ana propose?','Shower, dress, breakfast','Dress, breakfast, shower','Breakfast, leave, shower','Primero, después and luego mark the sequence.','sequence'),
 t('What colour clean T-shirt is available?','blue','azul',['a blue one','una azul'],'Marta mentions una azul in the bedroom.','fact'),
 c('Does yo también reject Marta’s routine?','No, Ana shares it','Yes, Ana never showers','Yes, they cannot leave','También indicates the same routine before Ana adds today’s clothing need.','context'),
 t('Who needs the clean T-shirt?','Ana','Ana',[],'Ana says hoy necesito una camiseta limpia.','character'),
 c('When can they leave?','After breakfast','Before the shower','Before getting dressed','Marta confirms después del desayuno.','inference')]),
 s('Una noche tranquila','Luis: Normalmente me acuesto a las once. ¿Y tú, Ana?\nAna: Yo me acuesto a las diez porque me levanto a las siete.\nLuis: Hoy voy a leer en casa.\nAna: Yo también, pero solo un poco. Estoy cansada.\nLuis: Entonces nos vemos mañana.\nAna: Sí, mañana podemos quedar en el café.',[['normalmente','normally'],['solo un poco','only a little'],['cansada','tired']], [
 c('Why does Ana go to bed at ten?','She gets up at seven','She buys clothes at ten','She dislikes books','Porque introduces her early getting-up time as the reason.'),
 t('At what time does Luis normally go to bed?','eleven','las once',['11','at eleven','a las once'],'Luis’s first line gives his normal bedtime.','fact'),
 c('Why will Ana read only a little tonight?','She is tired','She has no book','She works at the cinema','Estoy cansada supports limiting her reading.','inference'),
 t('Where do they suggest meeting tomorrow?','at the café','en el café',['café','the café','el café'],'Ana’s final line proposes the café.'),
 c('Which message fits Ana’s routine?','Me acuesto a las diez','Me acuesto a las once','Me levanto a las diez','Ten is Ana’s bedtime; eleven is Luis’s.','response')]),
 s('El domingo sin prisa','Es domingo. Ana no tiene clase.\nAna: Hoy me levanto a las nueve, no a las siete.\nMarta: Yo también. Primero desayuno y después me ducho.\nAna: Normalmente me ducho antes del desayuno, pero hoy no tengo prisa.\nMarta: Después podemos ir al parque.\nAna: Sí. Me visto y salimos juntas.',[['sin prisa','without rushing'],['antes del desayuno','before breakfast'],['juntas','together (feminine)']], [
 c('What is different for Ana today?','She gets up later','She has an early class','She works at seven','Nine replaces her usual seven because there is no class.','inference'),
 t('On which day does this happen?','Sunday','el domingo',['domingo','on Sunday'],'The opening sentence gives domingo.','fact'),
 c('What does Marta do first today?','Have breakfast','Shower','Go to the park','Marta says primero desayuno.','sequence'),
 t('Where will they go after their morning routine?','to the park','al parque',['park','the park','parque'],'Marta suggests ir al parque.'),
 c('Which statement belongs to Ana rather than Marta?','Normally I shower before breakfast','Today I have class','I dislike the park','Ana compares her usual order with this relaxed day.','character')])
 ],
 [
 s('Un mensaje para Marta','Ana escribe: “Hola, Marta. Hoy me levanto a las ocho. Primero desayuno y después voy a clase. Por la tarde voy a leer en casa porque estoy cansada. ¿Quieres venir? Podemos tomar un té”.\nMarta responde: “Sí, buena idea. Voy a ir a tu piso a las seis”.\nAna: “Perfecto, nos vemos”.', [['responde','replies'],['por la tarde','in the afternoon/evening'],['a tu piso','to your flat']], [
 c('Why does Ana choose to read at home?','She is tired','She dislikes Marta','Her class is cancelled','Porque estoy cansada gives her reason.'),
 t('What does Ana do immediately after breakfast?','go to class','ir a clase',['goes to class','va a clase'],'Después voy a clase gives the next action.','sequence'),
 c('Does Marta accept the invitation?','Yes, and gives an arrival time','No, she has to work','No, she wants coffee instead','Sí, buena idea and the six o’clock plan confirm acceptance.','inference'),
 t('At what time will Marta go to Ana’s flat?','six','las seis',['6','at six','a las seis'],'Voy a ir a tu piso a las seis gives the time.','fact'),
 c('Which reply would keep their agreed plan?','Nos vemos a las seis','No puedo ir a las seis','Quedamos en la tienda','Meeting at six matches Marta’s accepted home visit.','response')]),
 s('Un plan con lluvia','Luis: Hoy quiero caminar en el parque.\nMarta: Llueve. Prefiero quedar en casa porque no quiero mojarme.\nLuis: Buena idea. Voy a llevar un libro.\nMarta: En mi salón hay un sofá y una mesa. Podemos leer y después escuchar música.\nLuis: Perfecto. Entonces voy a tu piso a las cinco.',[['llueve','it is raining'],['mojarme','get wet'],['llevar','bring; carry']], [
 c('Why does the plan move indoors?','It is raining and Marta wants to stay dry','The park is too small','Luis has no shoes','The rain and no quiero mojarme explain the change.','inference'),
 t('What will Luis bring?','a book','un libro',['book','libro'],'Voy a llevar un libro names the item.','fact'),
 c('What does entonces do in the final reply?','Introduces the resulting plan','Describes yesterday','Names a colour','Entonces links their decision to going to Marta’s flat.','context'),
 t('What time does Luis give?','five','las cinco',['5','at five','a las cinco'],'Luis’s final message names five.'),
 c('What will they do after reading?','Listen to music','Go shopping','Go to class','Después escuchar música states the later activity.','sequence')]),
 s('Trabajo primero','Diego escribe a Luis: “Hoy tengo que trabajar hasta las seis. Me gusta el fútbol, pero no puedo ir al parque esta tarde”.\nLuis: “Lo siento. ¿Qué tal mañana?”\nDiego: “Mañana estoy libre. Primero voy a desayunar en casa y después voy al parque”.\nLuis: “Perfecto. Quedamos delante de la entrada a las diez”.', [['hasta las seis','until six'],['la entrada','the entrance'],['tengo que trabajar','I have to work']], [
 c('Does Diego’s refusal mean he dislikes football?','No, work prevents today’s outing','Yes, he says he dislikes it','Yes, he prefers shopping','Me gusta el fútbol contrasts with his work obligation.','inference'),
 t('Who proposes tomorrow?','Luis','Luis',[],'Luis asks qué tal mañana.','character'),
 c('Which connector expresses the contrast in Diego’s first message?','Pero','Y','Después','Pero links liking football with being unable to go today.'),
 t('At what time do they agree to meet tomorrow?','ten','las diez',['10','at ten','a las diez'],'Quedamos ... a las diez gives the final time.','fact'),
 c('What does Diego plan before going to the park?','Breakfast at home','Buying a jacket','Meeting at the café','Primero voy a desayunar en casa comes before the park.','sequence')]),
 s('Todo preparado','Ana escribe a Marta: “Mañana vamos al cine a las cinco. Me gusta caminar, pero primero voy a pasar por tu piso”.\nMarta: “Perfecto. Mi chaqueta está en el salón, al lado del sofá. Voy a llevarla porque por la tarde hace frío”.\nAna: “Yo también voy a llevar una chaqueta. Después podemos tomar un café”.\nMarta: “Buena idea. Nos vemos mañana”.', [['pasar por','stop by'],['llevarla','bring it (feminine)'],['hace frío','it is cold']], [
 c('Why does Marta plan to bring a jacket?','It will be cold in the afternoon','She needs to return it','The cinema sells clothes','Porque ... hace frío supplies the practical reason.','inference'),
 t('Where is Marta’s jacket?','next to the sofa','al lado del sofá',['beside the sofa','in the living room next to the sofa','en el salón al lado del sofá'],'Marta gives the room and the position.','fact'),
 c('What will Ana do before the cinema?','Stop at Marta’s flat','Buy a computer','Go to class','Primero voy a pasar por tu piso gives the earlier stop.','sequence'),
 t('What drink do they suggest afterwards?','coffee','café',['a coffee','un café'],'Después podemos tomar un café proposes the drink.'),
 c('Which message combines a plan with a reason?','Voy a llevar una chaqueta porque hace frío','Me gusta el cine','La chaqueta es negra','The first uses voy a for a plan and porque for its reason.','transfer')])
 ]
 ];
}
root.FriendsA12Stories=create;if(typeof module!=='undefined')module.exports=create;
})(typeof window==='undefined'?globalThis:window);
