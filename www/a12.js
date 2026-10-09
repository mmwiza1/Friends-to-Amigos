(function(root){
'use strict';
// Original Friends to Amigos A1.2. Explicitly authored tasks; no corpus imports.
function create(){
 let position=0;
 const choice=(p,a,b,c,e,topic,mode='recognition')=>{const options=[a,b,c];for(let n=position++%3;n>0;n--)options.push(options.shift());return {type:'choice',prompt:p,answer:a,options,explanation:e,topic,mode};};
 const writing=(p,a,variants,e,topic,mode='contextual',mistakes=[])=>({type:'text',prompt:p,answer:a,accepted:[...new Set([a,...variants])],language:'es',spanish:a,explanation:e,topic,mode,mistakes});
 function lesson(topic,model,gap,recall,response,transfer){
  const [sentence,meaning,a,b,c,e]=gap;let i=0;
  return [choice(...model,topic),{...choice(`Complete: ${sentence} (“${meaning}”)`,a,b,c,e,topic,'completion'),type:'gap',sentence,meaning,spanish:sentence.replace(/___/g,()=>a.split(' ')[i++])},writing(...recall,topic,'recall'),choice(...response,topic,'response'),writing(...transfer,topic,'transfer')];
 }
 const units=[
 {id:'a12-free-time',title:'Free time & preferences',goal:'Describe what you enjoy and choose a simple activity with a friend',phrases:[['Me gusta leer','I like reading'],['Me gustan los libros','I like books'],['Prefiero el cine','I prefer the cinema'],['También me gusta…','I also like…'],['No me gusta…','I do not like…']]},
 {id:'a12-invitations',title:'Inviting & responding',goal:'Invite a friend out, accept or decline politely and suggest another time',phrases:[['¿Quieres venir?','Do you want to come?'],['¿Vamos al cine?','Shall we go to the cinema?'],['Sí, buena idea','Yes, good idea'],['Lo siento, no puedo','Sorry, I cannot'],['¿Qué tal mañana?','How about tomorrow?']]},
 {id:'a12-plans',title:'Making plans',goal:'Say what you are going to do and agree a day, time and meeting place',phrases:[['Voy a…','I am going to…'],['Vamos a quedar','We are going to meet'],['El sábado','On Saturday'],['¿A qué hora quedamos?','What time shall we meet?'],['Delante del cine','In front of the cinema']]},
 {id:'a12-clothes',title:'Choosing clothes',goal:'Describe clothes and explain which colour, size or item you need',phrases:[['Una camiseta azul','A blue T-shirt'],['Unos pantalones negros','Black trousers'],['Necesito una chaqueta','I need a jacket'],['La talla mediana','Medium size'],['Prefiero esta','I prefer this one']]},
 {id:'a12-shopping',title:'In the clothes shop',goal:'Ask to try on clothes, explain the fit and make a simple purchase',phrases:[['¿Puedo probarme…?','Can I try on…?'],['¿Dónde está el probador?','Where is the fitting room?'],['Me queda grande','It is too big on me'],['¿Tiene otra talla?','Do you have another size?'],['Me llevo esta','I will take this one']],note:'🇪🇸 Probador is the usual word for a fitting room in Spain. This unit practises polite usted forms with shop staff.'},
 {id:'a12-home',title:'At home',goal:'Describe rooms and furniture and help a visitor find something at home',phrases:[['En mi piso hay…','In my flat there is/are…'],['El salón','The living room'],['Al lado de…','Next to…'],['Debajo de…','Under…'],['La cocina es pequeña','The kitchen is small']],note:'🇪🇸 Piso is common for a flat in Spain. 🌎 Apartamento is widely understood and common elsewhere.'},
 {id:'a12-routines',title:'A typical day',goal:'Describe your daily routine using simple reflexive verbs and times',phrases:[['Me levanto','I get up'],['Me ducho','I shower'],['Me visto','I get dressed'],['Me acuesto','I go to bed'],['Después desayuno','Afterwards I have breakfast']]},
 {id:'a12-connected',title:'A day together',goal:'Connect a routine, a reason and a future plan in a short practical message',phrases:[['Primero… después…','First… afterwards…'],['…porque…','…because…'],['…pero…','…but…'],['Entonces…','Then; so…'],['Hoy voy a…','Today I am going to…']]}
 ];
 const core=[
 [
 lesson('Likes and activities',
 ['Ana wants to tell Luis she enjoys reading. Which sentence fits?','Me gusta leer','Me gustan leer','Yo gusto leer','An infinitive such as leer takes singular gusta; me identifies who enjoys it.'],
 ['___ ___ leer.','I like reading','Me gusta','Me gustan','Yo gusto','Leer is an activity expressed by an infinitive, so use me gusta.'],
 ['From memory, say “I like reading”.','Me gusta leer',['A mí me gusta leer'],'Use me gusta before an infinitive such as leer.'],
 ['Luis: “¿Te gusta el cine?” Reply positively.','Sí, me gusta el cine','Sí, te gusta el cine','No, no me gusta el cine','Te asks about you; answer with me. The last option is a negative reply.'],
 ['Tell Marta you like the cinema and reading. Use y.','Me gusta el cine y me gusta leer',['Me gusta el cine y leer','A mí me gusta el cine y leer'],'Y joins two things you like. El cine and leer can follow the same me gusta.']),
 lesson('Plural likes',
 ['Marta enjoys books. Which sentence is correct?','Me gustan los libros','Me gusta los libros','Yo gustan los libros','The thing liked controls agreement: plural libros needs gustan.'],
 ['___ ___ los libros.','I like books','Me gustan','Me gusta','Yo gustan','Plural los libros takes gustan; me identifies the person.'],
 ['From memory, say “I like books”.','Me gustan los libros',['A mí me gustan los libros'],'Use gustan for plural things, unlike gusta leer.'],
 ['Ana: “Me gusta la música”. Show that you like it too.','A mí también','A mí tampoco','No me gusta','También agrees with a positive statement; tampoco agrees with a negative one.'],
 ['Say you like books, but you do not like football. Use pero.','Me gustan los libros, pero no me gusta el fútbol',['Me gustan los libros pero el fútbol no me gusta'],'Pero links a contrast. Put no before me gusta; fútbol is singular.']),
 lesson('Preferences',
 ['There is time for one activity. Which phrase expresses a preference?','Prefiero el cine','Tengo el cine','Estoy el cine','Prefiero means I prefer; tengo means I have and estoy expresses a state/location.'],
 ['___ ___ cine.','I prefer the cinema','Prefiero el','Prefiere el','Prefiero la','Prefiero is the yo form and cine is masculine: el cine.'],
 ['From memory, say “I prefer the cinema”.','Prefiero el cine',['Yo prefiero el cine'],'Preferir changes to prefiero in the first person.'],
 ['Luis: “¿Cine o fútbol?” You prefer music instead.','Prefiero escuchar música','Me gustan los libros','Tengo veinte años','Offer your actual alternative with prefiero plus an infinitive.'],
 ['Say you prefer reading because you like books. Use porque.','Prefiero leer porque me gustan los libros',['Yo prefiero leer porque me gustan los libros'],'Porque gives a reason, not a contrast; libros takes gustan.'])
 ],
 [
 lesson('Invitations',
 ['Invite Marta to the cinema. Which question fits?','¿Vamos al cine?','Vamos del cine','¿Dónde está el cine?','Vamos al cine can invite someone along. Dónde asks for a location.'],
 ['¿___ ___ cine?','Shall we go to the cinema?','Vamos al','Vamos el','Voy al','Vamos includes both people. A + el contracts to al.'],
 ['From memory, invite a friend to the cinema using vamos.','¿Vamos al cine?',[],'Use vamos for we, and al before masculine cine.'],
 ['Marta: “¿Vamos al cine?” Accept warmly.','Sí, buena idea','Lo siento, no puedo','¿Cuánto cuesta la camiseta?','Buena idea accepts the suggestion; no puedo declines it.'],
 ['Invite Luis to the park using vamos.','¿Vamos al parque?',['Luis, ¿vamos al parque?'],'Transfer the invitation pattern to parque; a + el is still al.']),
 lesson('Coming along',
 ['Ask one friend whether they want to come.','¿Quieres venir?','¿Quiero venir?','¿Quieres viene?','Quieres addresses your friend; venir stays in the infinitive after querer.'],
 ['¿___ ___ al parque?','Do you want to come to the park?','Quieres venir','Quiero venir','Quieres viene','Quieres + infinitive asks about the other person’s wish.'],
 ['From memory, ask “Do you want to come?”','¿Quieres venir?',['¿Tú quieres venir?'],'Quieres is the tú form; venir is the infinitive.'],
 ['Luis: “¿Quieres venir?” Accept and thank him.','Sí, gracias','No, gracias','Quiero una talla mediana','Sí accepts; no politely refuses. A clothing size changes the subject.'],
 ['Ask Marta whether she wants to go to the cinema.','¿Quieres ir al cine?',['Marta, ¿quieres ir al cine?'],'Use quieres plus ir. Ir al cine means go to the cinema.']),
 lesson('Polite refusals',
 ['You cannot come today. Which reply is polite and clear?','Lo siento, no puedo','Sí, buena idea','No me gusta tu nombre','Lo siento softens the refusal and no puedo states you cannot come.'],
 ['Lo siento, ___ ___.','Sorry, I cannot','no puedo','no puede','sí puedo','Puedo is I can; no makes the refusal explicit.'],
 ['From memory, politely say “Sorry, I cannot”.','Lo siento, no puedo',['No puedo, lo siento'],'Lo siento and no puedo can appear in either order.'],
 ['Ana cannot come today but can tomorrow. What keeps the invitation open?','¿Qué tal mañana?','Hasta nunca','¿Qué talla tienes?','Qué tal mañana proposes another day rather than ending the contact.'],
 ['Decline today and suggest tomorrow. Use no puedo hoy and qué tal.','No puedo hoy. ¿Qué tal mañana?',['Lo siento, no puedo hoy. ¿Qué tal mañana?'],'Give the limit with no puedo hoy, then offer a different day.'])
 ],
 [
 lesson('Near-future plans',
 ['Ana has a plan for tomorrow. Which sentence says she is going to read?','Voy a leer mañana','Voy leer mañana','Voy a leo mañana','A plan uses ir + a + infinitive; leer does not change after voy a.'],
 ['___ ___ leer mañana.','I am going to read tomorrow','Voy a','Voy de','Va a','The first-person plan is voy a plus an infinitive.'],
 ['From memory, say “I am going to read tomorrow”.','Voy a leer mañana',['Mañana voy a leer','Yo voy a leer mañana'],'Voy a + infinitive expresses a plan; mañana here means tomorrow.'],
 ['Luis: “¿Qué vas a hacer mañana?” You plan to work.','Voy a trabajar','Voy trabajando','El trabajo está aquí','Respond with a future plan, not an ongoing activity or a location.'],
 ['Tell Marta you are going to go to the cinema tomorrow.','Voy a ir al cine mañana',['Mañana voy a ir al cine','Yo voy a ir al cine mañana'],'Voy a ir is natural: the first ir builds the plan, the second names going somewhere.']),
 lesson('Day and time',
 ['A message says “Quedamos el sábado a las cinco”. When is the meeting?','Saturday at five','Sunday at five','Saturday at six','Sábado is Saturday; a las cinco gives the meeting time.'],
 ['Quedamos ___ ___ a las cinco.','We meet on Saturday at five','el sábado','en sábado','la sábado','Use el with a particular day; sábado is masculine.'],
 ['From memory, say “We meet on Saturday at five”.','Quedamos el sábado a las cinco',['El sábado quedamos a las cinco'],'A las gives the meeting time; el sábado identifies the day.'],
 ['Marta: “¿A qué hora quedamos?” Which answer gives a time?','A las seis','El sábado','Delante del cine','A qué hora asks for the time, not the day or place.'],
 ['Change the meeting to Sunday at six. Say when you meet using quedamos.','Quedamos el domingo a las seis',['El domingo quedamos a las seis'],'Transfer both the day and time; use el domingo and a las seis.']),
 lesson('Meeting place',
 ['Which plan includes everyone in the group?','Vamos a quedar delante del cine','Voy a quedar delante del cine','Va a quedar delante del cine','Vamos is we are going; voy refers only to me and va to another person.'],
 ['___ ___ quedar delante del cine.','We are going to meet in front of the cinema','Vamos a','Vamos en','Voy a','A follows the conjugated ir before an infinitive. Vamos includes the group.'],
 ['From memory, say “We are going to meet in front of the cinema”.','Vamos a quedar delante del cine',['Nosotros vamos a quedar delante del cine'],'Delante de + el becomes delante del.'],
 ['Luis: “¿Dónde quedamos?” Reply with the meeting place.','Delante del cine','A las cinco','El domingo','Dónde asks where. Delante del cine gives a place.'],
 ['Arrange to meet in front of the café at six. Use quedamos.','Quedamos delante del café a las seis',['A las seis quedamos delante del café'],'Combine a place and time; de + el becomes del.'])
 ],
 [
 lesson('Clothes and colours',
 ['Which label describes a blue T-shirt?','Una camiseta azul','Un camiseta azul','Una camiseta azules','Camiseta is feminine singular; azul has one singular form for either gender.'],
 ['Necesito ___ ___ azul.','I need a blue T-shirt','una camiseta','un camiseta','unas camiseta','Una agrees with singular feminine camiseta.'],
 ['From memory, say “I need a blue T-shirt”.','Necesito una camiseta azul',['Yo necesito una camiseta azul'],'Put the colour after camiseta; use una.'],
 ['Marta asks “¿La camiseta roja o la azul?” Choose blue.','Prefiero la azul','Prefiero el azul','Prefiero los azules','La stands for feminine camiseta; azul itself does not change gender.'],
 ['Tell a shop assistant you need a red jacket.','Necesito una chaqueta roja',['Yo necesito una chaqueta roja'],'Both una and roja agree with feminine chaqueta.']),
 lesson('Trousers and agreement',
 ['Which phrase describes black trousers?','Unos pantalones negros','Un pantalones negro','Unas pantalones negras','Pantalones is masculine plural; unos and negros must match it.'],
 ['Necesito unos ___ ___.','I need black trousers','pantalones negros','pantalones negro','pantalones negras','Both pantalones and its colour are masculine plural.'],
 ['From memory, say “I need black trousers”.','Necesito unos pantalones negros',['Necesito pantalones negros','Yo necesito unos pantalones negros'],'Use plural pantalones negros; unos is natural but can be omitted here.'],
 ['Luis wants trousers, not a skirt. Which request fits?','Quiero unos pantalones','Quiero una falda','Quiero una camiseta','Pantalones means trousers; falda is a skirt and camiseta a T-shirt.'],
 ['You want blue trousers instead. Say what you need.','Necesito unos pantalones azules',['Necesito pantalones azules'],'Azul becomes azules for plural trousers.']),
 lesson('Sizes and preferences',
 ['You need medium size. Which request fits?','Necesito la talla mediana','Necesito la mesa mediana','Necesito el talla mediano','Talla means clothing size and is feminine; mesa means table.'],
 ['Necesito la ___ ___.','I need medium size','talla mediana','talla mediano','tallo mediano','Mediana agrees with feminine talla.'],
 ['From memory, ask “Do you have medium size?” using usted.','¿Tiene la talla mediana?',['¿Tiene una talla mediana?','¿Tiene una talla M?','¿Tiene la talla M?','¿La tiene en una M?','¿La tiene en una talla M?'],'Tiene is the polite usted form used with the shop assistant. M is a common label for medium; la can refer to the T-shirt being discussed.'],
 ['The blue shirt is too large. You choose the red shirt.','Prefiero la roja','Prefiero el rojo','Prefiero los rojos','La roja stands for la camiseta roja.'],
 ['Ask politely for a small size using tiene.','¿Tiene la talla pequeña?',['¿Tiene una talla pequeña?'],'Change mediana to pequeña, retaining feminine agreement.'])
 ],
 [
 lesson('Trying things on',
 ['Ask permission to try on a jacket.','¿Puedo probarme la chaqueta?','¿Puedo prueba la chaqueta?','¿Puede probarme la chaqueta?','Puedo is I can; probar stays in the infinitive and me refers to trying it on yourself.'],
 ['¿___ ___ la chaqueta?','Can I try on the jacket?','Puedo probarme','Puedo probarte','Puede probarme','Me refers to yourself. Te would refer to the person you are addressing.'],
 ['From memory, ask “Can I try on the jacket?”','¿Puedo probarme la chaqueta?',['¿Me puedo probar la chaqueta?'],'Me can attach to the infinitive or go before puedo.'],
 ['The assistant says “El probador está a la derecha”. What should you do?','Go to the fitting room on the right','Pay immediately','Look for a bigger size','Probador is the fitting room; a la derecha gives its location.'],
 ['Ask to try on the T-shirt instead of the jacket.','¿Puedo probarme la camiseta?',['¿Me puedo probar la camiseta?'],'Keep puedo + infinitive and change the garment.']),
 lesson('Explaining the fit',
 ['The jacket is too big on you. Which phrase fits?','Me queda grande','Me quedo grande','Me queda pequeño','The garment is the subject of queda; grande means big and pequeño small.'],
 ['La chaqueta ___ ___ grande.','The jacket is too big on me','me queda','me quedo','te queda','Queda refers to the jacket; me identifies who is wearing it.'],
 ['From memory, say “It is too big on me”.','Me queda grande',[],'Me queda grande explains the fit of one garment.'],
 ['Your T-shirt is too small. What would help?','Una talla más grande','Una talla más pequeña','El mismo probador','A bigger size solves a too-small fit; a smaller one does not.'],
 ['Say the T-shirt is too small on you and request a bigger size. Use queda and necesito.','La camiseta me queda pequeña y necesito una talla más grande',['Me queda pequeña y necesito una talla más grande','La camiseta me queda pequeña. Necesito una talla más grande.','La camiseta me queda pequeña y necesito una talla más grande. ¿La tiene?','Me queda pequeña. Necesito una talla más grande. ¿La tiene?'],'Pequeña agrees with camiseta; talla más grande requests a larger size. You can also ask the assistant ¿La tiene? after stating what you need.']),
 lesson('Making a purchase',
 ['You have chosen one jacket. Which reply makes the purchase clear?','Me llevo esta chaqueta','Me levanto esta chaqueta','Me gusta el café','Llevarse in a shop means take/buy an item; levantarse means get up.'],
 ['___ ___ esta chaqueta.','I will take this jacket','Me llevo','Me llevas','Me levanto','Llevo is the yo form. Me llevo esta is a natural purchasing phrase.'],
 ['From memory, say “I will take this jacket”.','Me llevo esta chaqueta',['Voy a comprar esta chaqueta'],'Me llevo states your purchase decision; voy a comprar expresses the plan.'],
 ['Assistant: “¿Cómo va a pagar?” You want to use a card.','Con tarjeta','En el probador','La talla mediana','Con tarjeta answers the payment method, not the place or size.'],
 ['Say you will take this T-shirt and pay by card. Use me llevo and pago.','Me llevo esta camiseta y pago con tarjeta',['Me llevo esta camiseta. Pago con tarjeta.'],'Connect the purchase and payment with y or two short sentences.'])
 ],
 [
 lesson('Rooms and furniture',
 ['Which sentence describes what exists in your living room?','En el salón hay un sofá','En el salón es un sofá','En el salón están un sofá','Hay introduces something that exists. Es identifies/describes; está locates a known object.'],
 ['En el salón ___ ___ sofá.','There is a sofa in the living room','hay un','es un','hay una','Hay introduces the furniture; sofá is masculine.'],
 ['From memory, say “There is a sofa in the living room”.','En el salón hay un sofá',['Hay un sofá en el salón'],'Hay does not change for singular or plural things.'],
 ['Ana: “En mi piso hay dos dormitorios”. What does she describe?','Two bedrooms in her flat','Two living rooms','Two wardrobes in a shop','Dormitorio means bedroom; piso here means flat.'],
 ['Say there is a table and two chairs in the kitchen.','En la cocina hay una mesa y dos sillas',['Hay una mesa y dos sillas en la cocina'],'Use hay for both quantities; cocina, mesa and silla are feminine.']),
 lesson('Locating things',
 ['Help Luis find a known book next to the lamp.','El libro está al lado de la lámpara','El libro es al lado de la lámpara','El libro hay al lado de la lámpara','Estar locates a known object. Al lado de means next to.'],
 ['El libro ___ ___ lado de la lámpara.','The book is next to the lamp','está al','es al','están al','Singular libro takes está. Al belongs to the fixed phrase al lado de.'],
 ['From memory, say “The book is next to the lamp”.','El libro está al lado de la lámpara',[],'Use estar for location and de before the reference object.'],
 ['Marta: “Las llaves están debajo de la mesa”. Where should you look?','Under the table','On the table','Next to the lamp','Debajo de means under; encima de would mean on top of.'],
 ['Tell a visitor the keys are under the chair.','Las llaves están debajo de la silla',[],'Plural llaves needs están; debajo de gives the position.']),
 lesson('Describing your home',
 ['Describe a small but comfortable flat.','Mi piso es pequeño, pero cómodo','Mi piso está pequeño, pero cómodo','Mi piso es pequeña, pero cómoda','Ser describes the home; pequeño and cómodo agree with masculine piso.'],
 ['Mi piso ___ ___, pero cómodo.','My flat is small but comfortable','es pequeño','está pequeño','es pequeña','Use es for the description and masculine pequeño with piso.'],
 ['From memory, say “My flat is small but comfortable”.','Mi piso es pequeño, pero cómodo',['Mi apartamento es pequeño pero cómodo'],'Pero links the contrast. Piso and apartamento are masculine.'],
 ['Luis: “¿Dónde está el baño?” Which reply helps a visitor?','Al lado de la cocina','Es pequeño','Hay una mesa','He asks where; a location helps more than a description or list of furniture.'],
 ['Describe your kitchen as small and your living room as big. Use pero.','La cocina es pequeña, pero el salón es grande',['Mi cocina es pequeña pero mi salón es grande'],'Pequeña agrees with cocina; grande works for either gender.'])
 ],
 [
 lesson('Getting up and showering',
 ['Which sentence describes your own getting-up routine?','Me levanto a las siete','Te levanto a las siete','Me levanta a las siete','Me levanto is I get up. Te levanto means I get you up; levanta is not the yo form.'],
 ['___ ___ a las siete.','I get up at seven','Me levanto','Te levanto','Me levanta','The yo reflexive form needs both me and the -o ending.'],
 ['From memory, say “I get up at seven”.','Me levanto a las siete',['Yo me levanto a las siete'],'Me cannot be omitted for this meaning of getting up.'],
 ['Luis: “¿A qué hora te duchas?” You shower at eight.','Me ducho a las ocho','Te ducho a las ocho','Me ducha a las ocho','The question addresses tú; your response changes to me ducho.'],
 ['Say you get up at eight and then shower. Use después.','Me levanto a las ocho y después me ducho',['Me levanto a las ocho. Después me ducho.'],'Después sequences the actions. Each reflexive verb keeps me.']),
 lesson('Getting dressed',
 ['Ana describes her routine. Which sentence means “I get dressed”?','Me visto','Me viste','Visto me','Vestirse changes to visto in the yo form; me normally goes before a conjugated verb.'],
 ['___ ___ después de ducharme.','I get dressed after showering','Me visto','Me viste','Te visto','Me visto gives your own routine. Después de takes an infinitive here.'],
 ['From memory, say “I get dressed”.','Me visto',['Yo me visto'],'Use me visto, not me viste, when speaking about yourself.'],
 ['Marta: “Primero me ducho y después me visto”. Which happens first?','She showers','She gets dressed','She goes to bed','Primero marks the first action; después marks the later one.'],
 ['Say you shower first and then get dressed.','Primero me ducho y después me visto',['Primero me ducho. Después me visto.'],'Primero and después show the order without needing past tenses.']),
 lesson('Going to bed',
 ['Say you normally go to bed at eleven.','Me acuesto a las once','Me acosto a las once','Me acuestas a las once','Acostarse changes o to ue: me acuesto is the yo form.'],
 ['___ ___ a las once.','I go to bed at eleven','Me acuesto','Me acosto','Te acuesto','The reflexive yo form is me acuesto, with the stem change.'],
 ['From memory, say “I go to bed at eleven”.','Me acuesto a las once',['Yo me acuesto a las once'],'Use me acuesto for going to bed; duermo means I sleep.'],
 ['Luis: “¿Te acuestas a las diez?” You go to bed at eleven.','No, me acuesto a las once','Sí, me acuesto a las once','No, te acuestas a las once','No corrects his proposed time, then me acuesto gives your routine.'],
 ['Say you get up at seven but go to bed at ten. Use pero.','Me levanto a las siete, pero me acuesto a las diez',['Me levanto a las siete pero a las diez me acuesto'],'Pero connects the contrasting times; keep the correct reflexive forms.'])
 ],
 [
 lesson('Sequencing a morning',
 ['Choose a clear morning sequence.','Primero desayuno y después voy al trabajo','Primero desayuno pero porque voy al trabajo','Después primero desayuno entonces pero','Primero and después mark order; y links the two actions.'],
 ['___ ___ y después voy al trabajo.','First I have breakfast and then go to work','Primero desayuno','Primera desayuno','Primero desayuna','Primero is the sequencing word; desayuno is I have breakfast.'],
 ['From memory, say “First I have breakfast and then I go to work”.','Primero desayuno y después voy al trabajo',['Primero desayuno. Después voy al trabajo.'],'This is a present-tense sequence; al contracts a + el.'],
 ['Ana: “Primero me ducho. Después desayuno”. What comes after the shower?','Breakfast','Getting up','Going to bed','Después introduces breakfast as the next step.'],
 ['Write a two-step morning: first get up, then have breakfast.','Primero me levanto y después desayuno',['Primero me levanto. Después desayuno.'],'Only levantarse is reflexive here; desayunar does not need me.']),
 lesson('Giving a reason',
 ['Explain that you stay home because you are tired (role: Ana).','Me quedo en casa porque estoy cansada','Me quedo en casa pero estoy cansada','Me quedo en casa porque soy cansada','Porque gives the reason; estar describes current tiredness. Pero would express a contrast.'],
 ['Me quedo en casa ___ ___ cansada.','I stay home because I am tired','porque estoy','pero soy','porque soy','Use porque for a reason and estar for a temporary state.'],
 ['From memory, as Ana say “I stay home because I am tired”.','Me quedo en casa porque estoy cansada',['Estoy cansada, por eso me quedo en casa'],'The model uses porque; por eso reverses the order to state the consequence.'],
 ['Luis: “¿Por qué no vienes?” You must work today.','Porque tengo que trabajar','Pero voy al cine','Después me ducho','Por qué asks why; porque answers with a reason. Tengo que expresses a need.'],
 ['Decline because you have to work. Use no puedo ir and porque.','No puedo ir porque tengo que trabajar',['Lo siento, no puedo ir porque tengo que trabajar'],'Tengo que + infinitive gives the obligation explaining the refusal.']),
 lesson('A connected plan',
 ['Luis is free, so he agrees to meet. Which connector gives the consequence?','Estoy libre, entonces podemos quedar','Estoy libre, pero no puedo quedar','Estoy libre porque podemos quedar','Entonces can mean so in this context; the invitation follows from being free.'],
 ['Hoy ___ ___ leer y después voy al cine.','Today I am going to read and afterwards I go to the cinema','voy a','voy de','va a','Voy a + infinitive gives your plan; después orders the later activity.'],
 ['From memory, say “Today I am going to read and afterwards I go to the cinema”.','Hoy voy a leer y después voy al cine',['Hoy voy a leer. Después voy al cine.'],'The near future names the first plan and después introduces the next one.'],
 ['Marta: “¿Qué vas a hacer hoy?” Choose a plan with a reason.','Voy a leer porque me gustan los libros','El libro está en la mesa','La camiseta es azul','Voy a leer answers a plan; porque adds a reason. The others describe an object’s location or colour.'],
 ['Tell Marta you like the cinema, but today you are going to meet Luis. Use pero.','Me gusta el cine, pero hoy voy a quedar con Luis',['Me gusta el cine pero voy a quedar con Luis hoy'],'Connect a preference and a different plan. Voy a quedar uses the infinitive after a.'])
 ]
 ];
 const written=[
 [
 ['Luis asks “¿Te gusta leer?” Say yes and that you like reading.','Sí, me gusta leer',['Sí, a mí me gusta leer'],'Answer te gusta with me gusta; leer takes singular gusta.'],
 ['Say you like music too. Begin with también.','También me gusta la música',['También a mí me gusta la música'],'También adds a shared interest; música is singular.'],
 ['Say you do not like football but you like the cinema.','No me gusta el fútbol, pero me gusta el cine',['El fútbol no me gusta pero el cine sí'],'No negates the first like, while pero contrasts it with the second.'],
 ['Say you prefer reading, but today you go to the park. Use pero.','Prefiero leer, pero hoy voy al parque',['Prefiero leer pero voy al parque hoy'],'Prefiero takes an infinitive directly. Pero contrasts a preference with today’s activity.'],
 ['Explain that you like reading because you like books.','Me gusta leer porque me gustan los libros',[],'Use gusta for the activity leer, but gustan for plural libros.']
 ],
 [
 ['Invite Marta to the café using vamos.','¿Vamos al café?',['Marta, ¿vamos al café?'],'Vamos includes both people; a + el becomes al.'],
 ['Accept an invitation and thank your friend. Use buena idea and gracias.','Sí, buena idea. Gracias.',['Sí, es una buena idea. Gracias.','Buena idea, gracias'],'Sí accepts, buena idea welcomes the suggestion and gracias thanks the inviter.'],
 ['Politely decline with “Sorry, I cannot come”.','Lo siento, no puedo venir',['No puedo venir, lo siento'],'Puedo takes the infinitive venir; no makes the refusal clear.'],
 ['Ask Luis whether he wants to come to your flat.','¿Quieres venir a mi piso?',['Luis, ¿quieres venir a mi piso?'],'Use quieres for one friend and a for movement towards your home.'],
 ['Decline tomorrow and propose Saturday using qué tal.','No puedo mañana. ¿Qué tal el sábado?',['Lo siento, no puedo mañana. ¿Qué tal el sábado?'],'State the unavailable day and propose a concrete alternative.']
 ],
 [
 ['Say you are going to work on Monday.','Voy a trabajar el lunes',['El lunes voy a trabajar','Yo voy a trabajar el lunes'],'Ir a + infinitive expresses a plan; el lunes specifies a day.'],
 ['Ask the group what time to meet using quedamos.','¿A qué hora quedamos?',[],'A qué hora asks for a time, not a place.'],
 ['Confirm a meeting in front of the park at ten using quedamos.','Quedamos delante del parque a las diez',['A las diez quedamos delante del parque'],'Delante de + el becomes delante del; a las gives the time.'],
 ['Say you and your friends are going to read on Sunday.','Vamos a leer el domingo',['El domingo vamos a leer','Nosotros vamos a leer el domingo'],'Vamos includes the group; leer stays in the infinitive.'],
 ['You cannot meet at five. Suggest six using qué tal.','No puedo a las cinco. ¿Qué tal a las seis?',['Lo siento, no puedo a las cinco. ¿Qué tal a las seis?'],'Keep a las before both clock times; offer a clear replacement.']
 ],
 [
 ['Ask for a white T-shirt politely, using quiero.','Quiero una camiseta blanca, por favor',['Por favor, quiero una camiseta blanca'],'Camiseta needs una and feminine blanca.'],
 ['Say you need a black jacket because it is cold. Use porque and hace frío.','Necesito una chaqueta negra porque hace frío',['Hace frío, por eso necesito una chaqueta negra'],'Chaqueta is feminine. Porque connects the clothing need to the weather reason.'],
 ['Choose the blue T-shirt rather than the red one. Use prefiero.','Prefiero la azul',['Prefiero la camiseta azul'],'La can stand for camiseta. Azul has the same masculine/feminine form.'],
 ['Say you need medium size, not small size. Use necesito.','Necesito la talla mediana, no la pequeña',['Necesito una talla mediana, no una pequeña','Necesito una M, no una S','Necesito una talla M, no una S','Necesito la talla M, no la S'],'Both size descriptions agree with feminine talla. M and S are common size labels for medium and small.'],
 ['Tell the assistant you want black trousers and a blue T-shirt.','Quiero unos pantalones negros y una camiseta azul',['Quiero pantalones negros y una camiseta azul'],'Use plural negros for pantalones, but singular azul for camiseta.']
 ],
 [
 ['Politely ask where the fitting room is.','¿Dónde está el probador?',['¿Dónde está el probador, por favor?'],'Use estar for the location of a known place.'],
 ['Ask whether you can try on these trousers.','¿Puedo probarme estos pantalones?',['¿Me puedo probar estos pantalones?'],'Me refers to yourself and probar stays infinitive after puedo.'],
 ['Say the jacket fits you well.','La chaqueta me queda bien',['Me queda bien'],'A singular garment takes queda; bien describes the fit.'],
 ['The trousers are too big on you. Say this using quedar.','Los pantalones me quedan grandes',['Me quedan grandes'],'Plural pantalones takes quedan and grandes.'],
 ['Confirm you will take this jacket and pay by card. Use me llevo and pago.','Me llevo esta chaqueta y pago con tarjeta',['Me llevo esta chaqueta. Pago con tarjeta.'],'State your purchase choice and the payment method.']
 ],
 [
 ['Say there are two bedrooms in your flat.','En mi piso hay dos dormitorios',['Hay dos dormitorios en mi piso','En mi apartamento hay dos dormitorios'],'Hay stays unchanged even with plural dormitorios.'],
 ['Tell a visitor the bathroom is next to the kitchen.','El baño está al lado de la cocina',[],'Use estar for location; baño retains ñ even when vowel accents are omitted.'],
 ['Say the computer is on the table.','El ordenador está encima de la mesa',['El ordenador está sobre la mesa','El ordenador está en la mesa','La computadora está encima de la mesa'],'A known object uses estar for location.'],
 ['Describe your living room as big and comfortable.','Mi salón es grande y cómodo',['El salón es grande y cómodo'],'Use ser for the description; cómodo agrees with masculine salón.'],
 ['Say there is a sofa, but no table, in the living room.','En el salón hay un sofá, pero no hay una mesa',['Hay un sofá en el salón pero no hay una mesa'],'Hay introduces presence and no hay absence; pero contrasts the two.']
 ],
 [
 ['Say you get up at eight every day. Use todos los días.','Me levanto a las ocho todos los días',['Todos los días me levanto a las ocho'],'Me levanto names your own routine; a las gives the time.'],
 ['Answer “¿A qué hora te duchas?” You shower at nine.','Me ducho a las nueve',['Yo me ducho a las nueve'],'Change the question’s te to me and duchas to ducho for your reply.'],
 ['Say you get dressed after breakfast using después de desayunar.','Me visto después de desayunar',['Después de desayunar me visto'],'Después de takes an infinitive; visto is the yo form of vestirse.'],
 ['Say you go to bed at ten because you are tired (role: Ana).','Me acuesto a las diez porque estoy cansada',['Estoy cansada, por eso me acuesto a las diez'],'Acostarse becomes me acuesto; current tiredness uses estar.'],
 ['Say you first shower and then have breakfast.','Primero me ducho y después desayuno',['Primero me ducho. Después desayuno.'],'Ducharse needs me, but desayunar does not.']
 ],
 [
 ['Write: you like reading and you also like music. Use también.','Me gusta leer y también me gusta la música',['Me gusta leer. También me gusta la música.'],'También adds another positive interest; both activities take gusta.'],
 ['Tell Ana you cannot come because you have to work.','No puedo venir porque tengo que trabajar',['Lo siento, no puedo venir porque tengo que trabajar'],'Porque gives the reason; tengo que takes an infinitive.'],
 ['State a sequence: first get dressed, then go to class.','Primero me visto y después voy a clase',['Primero me visto. Después voy a clase.'],'Primero and después organise two present-tense actions.'],
 ['Say you are free, so you can meet. Use entonces and podemos.','Estoy libre, entonces podemos quedar',[],'Estar describes availability; entonces introduces the resulting possibility.'],
 ['Write a short plan: tomorrow you will read, then go to the park.','Mañana voy a leer y después voy al parque',['Mañana voy a leer. Después voy al parque.'],'Voy a leer expresses a plan, and después introduces the next activity.']
 ]
 ];
 const short=(prompt,en,es,variants,explanation,mode)=>({type:'text',prompt,answer:`${en} / ${es}`,accepted:[...new Set([en,es,...variants])],language:'en-or-es',explanation,topic:'Reading comprehension',mode});
 const storyFactory=typeof module!=='undefined'?require('./a12-stories.js'):root.FriendsA12Stories;
 const storySets=storyFactory(choice,short),lessons=[];
 const authorship={kind:'original',referenceRecord:'docs/resources/CURRICULUM_REFERENCE.md'};
 units.forEach((unit,i)=>{
  const make=(suffix,title,questions,extra={})=>({id:`a12u${i}${suffix}`,stage:'A1.2',unit:i,unitId:unit.id,outcomeId:unit.id,goal:unit.goal,title,questions,checkpoint:false,authorship,...extra});
  const regular=core[i].map((questions,j)=>{
   // Unique authored prompt identities prevent unrelated review snapshots colliding.
   const title=`${['Discover','Build confidence','Use it'][j]}: ${unit.title}`;
   questions=questions.map(q=>({...q,prompt:`A1.2 · ${title}: ${q.prompt}`}));
   return make(`l${j}`,title,questions);
  });
  const stories=storySets[i].map((story,j)=>{
   const reading={title:story.title,text:story.text,glossary:story.glossary,stage:'A1.2'};
   return make(`story${j}`,`Story ${j+1}: ${story.title}`,story.questions.map(q=>({...q,prompt:`A1.2 · ${story.title}: ${q.prompt}`,reading})),{reading});
  });
  const production=make('write',`Write in Spanish: ${unit.title}`,written[i].map(args=>writing(`A1.2 · ${unit.title}: ${args[0]}`,...args.slice(1),unit.title)));
  const retrieval=[regular[0].questions[0],regular[1].questions[0],regular[2].questions[0],regular[0].questions[1],stories[3].questions[4],regular[0].questions[4],regular[1].questions[4],regular[2].questions[4],production.questions[4]];
  const checkpoint=make('check',`Checkpoint: ${unit.title}`,retrieval,{checkpoint:true,capability:unit.goal});
  lessons.push(regular[0],stories[0],regular[1],stories[1],regular[2],stories[2],production,stories[3],checkpoint);
 });
 // Predictable errors receive a specific explanation; other errors retain task feedback.
 const patterns=[
  [/^Me gusta /,'Yo gusto ','Gustar does not work like English like: me marks the person and the thing liked controls gusta/gustan.'],
  [/^Me gustan /,'Me gusta ','Plural things such as libros require gustan, not gusta.'],
  [/^Voy a /,'Voy ','Keep a between voy and the infinitive: voy a + infinitive.'],
  [/^Me levanto /,'Levanto ','Use me levanto for getting yourself up; levanto alone means I lift something.'],
  [/^Me ducho /,'Me ducha ','For your own routine use me ducho, with the first-person -o ending.'],
  [/^Me acuesto /,'Me acosto ','Acostarse changes o to ue: the first-person form is me acuesto.']
 ];
 for(const q of lessons.flatMap(l=>l.questions).filter(q=>q.language==='es')){
  q.mistakes=patterns.filter(([pattern])=>pattern.test(q.answer)).map(([pattern,replacement,explanation])=>({answer:q.answer.replace(pattern,replacement),explanation}));
 }
 return {units,lessons};
}
root.FriendsA12=create;if(typeof module!=='undefined')module.exports=create;
})(typeof window==='undefined'?globalThis:window);
