(function(root){
'use strict';
// Original, permanent-keyed contexts. Listening never displays these clips before an attempt.
const listening=[
[
['old-home','Antes vivía en Madrid. Ahora vivo en Toledo y voy al trabajo andando.','Which statement describes the former situation?','Living in Madrid','Living in Toledo','Walking to work now','Antes vivía gives the former home; ahora separates the current routine.','contrast'],
['former-work','Trabajaba en el café por la mañana y estudiaba por la tarde. Ahora solo estudio.','What has changed?','The speaker no longer works at the café','The speaker no longer studies','The speaker works at night','The two past routines contrast with only studying now.','contrast'],
['childhood','Cuando era pequeño, iba al parque con mi hermana. Teníamos un perro.','Who went to the park together?','The speaker and his sister','The speaker and Ana','The speaker and his brother','Con mi hermana identifies the companion in the former routine.','person'],
['weather-memory','En mi barrio hacía frío por la mañana. Normalmente tomábamos café antes de salir.','When did they usually have coffee?','Before going out','After returning home','Only at night','Normalmente and antes describe a habitual sequence.','sequence'],
['changed-route','Antes iba al trabajo en autobús porque vivía lejos. Ahora vivo cerca.','Why did the speaker use the bus before?','The home was far away','The bus was free','The café was closed','Porque vivía lejos supplies the former reason, not a ticket price.','reason']
],
[
['meal-background','Comía en casa normalmente, pero ayer comí con Marta en el café.','Which meal is a completed event?','Yesterday’s café meal','The normal meals at home','A meal planned for tomorrow','Comí and ayer present the particular completed meal.','contrast'],
['bounded-home','Viví en Toledo dos años. Después volví a Madrid y ahora trabajo allí.','What came after the Toledo stay?','Returning to Madrid','Moving to Toledo again','Leaving the café yesterday','Después volví follows the bounded stay.','sequence'],
['interruption','Hacía buen tiempo cuando salimos. Después empezó a llover y volvimos al café.','Why did they return?','It started raining','They missed a train','The café was closing','The changed weather explains the completed return.','reason'],
['phone-scene','Marta estaba en casa cuando Luis llamó. Después salió y quedaron en la plaza.','Where was Marta when Luis called?','At home','In the square','At the station','Estaba en casa describes the background at the time of the call.','place'],
['finished-weekend','El sábado comimos juntos y salimos a las seis. Hoy hemos tomado café en casa.','Which action happened in the finished Saturday period?','Going out at six','Having coffee at home today','A trip tomorrow','El sábado sets a finished period; hoy supplies a different current period.','time']
],
[
['platform-route','El tren sale del andén cuatro. Siga recto hasta la plaza y después a la derecha para llegar a la estación.','Which turn follows the square?','Right','Left','Back to the café','Después a la derecha specifies the second step; the platform number is a separate detail.','sequence'],
['missed-bus','Perdí el autobús de las ocho. Tuve que esperar treinta minutos, pero llegué antes de las nueve.','Did the speaker arrive before nine?','Yes, despite missing the bus','No, the speaker arrived at ten','No arrival is mentioned','Pero llegué antes de las nueve states the successful outcome after waiting.','inference'],
['transfer','Para ir a Toledo tienes que cambiar en Madrid. El segundo tren sale veinte minutos después.','Where is the change?','Madrid','Toledo','The café','Cambiar en Madrid identifies the connection, not the destination.','place'],
['cannot-depart','El tren estaba parado. No pude salir a las nueve, así que avisé a Ana.','What did the speaker do because departure was impossible?','Informed Ana','Cancelled Ana’s ticket','Left at nine','Así que connects the failed departure with advising Ana.','intention'],
['ticket-check','¿Este billete sirve para el siguiente tren? Perdí el de las seis. Necesito llegar hoy.','What does the traveller want to check?','Whether the ticket works on the next train','Whether the ticket includes breakfast','Whether the station closes at six','The first question asks about validity for an alternative departure.','dialogue']
],
[
['order-count','Para nosotros, dos cafés con leche, una sopa sin carne y una botella de agua, por favor.','How many coffees are ordered?','Two','One','Three','Dos refers to the coffees, while una refers to soup and water.','number'],
['ingredient','¿La sopa lleva pollo? No como carne. Si lleva pollo, prefiero una ensalada.','What alternative does the customer propose?','A salad','Another chicken soup','Only a coffee','Si lleva pollo makes the salad conditional on the ingredient, not a new grammar exercise.','intention'],
['missing-item','Pedimos dos cafés, pero solo hay uno. ¿Puede traer el otro, por favor?','What is missing?','One coffee','Both coffees','The whole meal','Two requested minus one delivered leaves the other coffee missing.','inference'],
['bill-issue','En la cuenta hay tres cafés, pero tomamos dos. ¿Puede comprobarla?','Why should the bill be checked?','It lists an extra coffee','Both customers want more coffee','The soup contains meat','The charged quantity conflicts with the quantity consumed.','reason'],
['waiter-message','El camarero dijo que faltaba sopa. Marta eligió una ensalada y Luis pidió pan.','What did Marta choose after the message?','A salad','Bread','Soup','The past message causes Marta’s new choice; bread belongs to Luis.','sequence']
],
[
['fit-exchange','Compré esta camiseta ayer. Me queda pequeña. Quiero una mediana del mismo color.','What does the customer want to change?','The size','The colour','The receipt','The colour stays the same; pequeña motivates medium.','intention'],
['fault-receipt','Este móvil no funciona. Tengo el recibo y vine ayer a pedir ayuda.','Which problem is reported?','A faulty phone','An unsuitable coat size','A missing train ticket','No funciona describes the fault; the receipt supports the service request.','fact'],
['refused-purchase','No quise comprar la bolsa porque estaba rota. Elegí otra y pagué ocho euros.','Why was the first bag refused?','It was broken','It cost eight euros','It was too small','Porque estaba rota explains the refusal; eight euros is the replacement price.','reason'],
['shop-comparison','Esta chaqueta cuesta treinta euros. La otra cuesta cuarenta, pero me queda mejor. Voy a probar la otra.','Which jacket will the speaker try?','The forty-euro jacket','The thirty-euro jacket','Neither jacket','La otra identifies the better-fitting, more expensive option.','comparison'],
['receipt-response','Dependienta: ¿Tiene el recibo? Cliente: Sí, aquí está. La compré ayer y quiero otra talla.','What should the assistant help with?','A size exchange','Finding a café','Buying a receipt','The receipt and otra talla make this an exchange request.','dialogue']
],
[
['later-meeting','Perdí el tren, así que voy a llegar más tarde. ¿Podemos quedar a las siete en lugar de a las seis?','What change is requested?','Seven instead of six','Six instead of seven','A different city','The request changes the meeting time, not its destination.','intention'],
['past-obligation','Ayer no pude venir porque tuve que trabajar. Hoy estoy libre después de las cinco.','When is the speaker available now?','After five today','Yesterday at five','All morning today','Hoy and después de las cinco give the new availability.','time'],
['bounded-wait','Estuve en la estación hasta las ocho. Después fui al café y llamé a Marta.','Which action came after the wait?','Going to the café','Arriving at the station','Calling before leaving home','Después gives the next event after the completed station stay.','sequence'],
['alternative-day','El domingo tengo una visita familiar. ¿Qué tal el sábado por la tarde? Podemos ir al cine.','Which alternative day is suggested?','Saturday','Sunday','Friday','Sábado is proposed instead of the unavailable Sunday.','response'],
['place-stays','Quedamos delante del café. Antes dijimos las cinco, pero ahora vamos a quedar a las seis y media.','What remains unchanged?','The meeting place','The meeting time','Both time and place','Delante del café remains the place; the time is revised.','contrast']
],
[
['different-preference','El autobús cuesta menos, y estoy de acuerdo con eso. Pero prefiero el tren porque tengo poco tiempo.','Why does the speaker still prefer the train?','Limited time','A lower train price','Disliking every bus','Agreement about bus price does not change the speaker’s time priority.','reason'],
['negative-agreement','Marta: No quiero carne hoy. Ana: A mí tampoco. Luis: Yo sí quiero.','Who shares Marta’s negative preference?','Ana','Luis','Both Ana and Luis','Tampoco joins Ana to the negative preference; sí contrasts Luis.','person'],
['film-opinion','Vi la película ayer. Me gustó la música, pero el final no me parece bueno.','Which part receives a negative opinion?','The ending','The music','The cinema price','Pero introduces a reservation about the ending, not the music.','preference'],
['practical-choice','Creo que el café nuevo es más tranquilo. Pero cierra a las cinco y son las cuatro y media. Mejor vamos al de la estación.','What changes the practical choice?','The early closing time','A change in the quietness opinion','The station café closing now','The speaker retains the quietness opinion but changes the feasible destination.','inference'],
['polite-response','Diego: Me parece una buena idea caminar. Marta: Estoy de acuerdo, pero primero necesito comer.','What does Marta ask to do first?','Eat','Cancel the walk','Take a train','Agreement is qualified by the sequence primero necesito comer.','dialogue']
],
[
['linked-day','Hacía frío y perdí el tren. Después tomé el autobús. Ahora estoy cansada, así que voy a descansar.','What is the current plan?','Resting','Taking the missed train','Going to work immediately','Ahora and voy a distinguish the present result/plan from the completed journey.','intention'],
['open-finished','Esta semana he ido a Toledo. Ayer fui a Madrid y comí con Ana. Mañana voy a quedar con Luis.','Which trip is explicitly in a finished day?','Yesterday’s Madrid trip','The Toledo experience this week','Tomorrow’s meeting','Ayer fui names the finished-day trip, contrasting the open week and future plan.','contrast'],
['solution','La chaqueta era pequeña. Pedí otra talla, me quedó bien y ahora voy a llevarla mañana.','What solved the clothing problem?','Asking for another size','Changing tomorrow’s weather','Returning without trying anything','Pedí otra talla leads to the stated successful fit.','sequence'],
['travel-message','Llegué tarde porque el tren estaba parado. Pude tomar un autobús y ahora estoy en el museo. ¿Podemos vernos aquí?','Where does the speaker propose meeting?','At the museum','On the stopped train','At the bus station','Aquí refers to the stated current museum location.','reference'],
['reassurance','No todo salió bien ayer: perdimos el tren y faltaba una sopa. Pero pedimos ayuda y pudimos seguir el plan.','What is the speaker’s overall message?','Problems were manageable with help','Everything went perfectly','The whole plan was cancelled','Pero contrasts difficulties with a successful practical response.','inference']
]
];
const speaking=[
[
['former-home','Say that you used to live in Madrid but now live in Toledo.','Antes vivía en Madrid, pero ahora vivo en Toledo.','Vivía en Madrid antes; ahora vivo en Toledo.'],
['old-work','Say that you worked at a café in the mornings and studied in the afternoons.','Trabajaba en un café por la mañana y estudiaba por la tarde.','Por la mañana trabajaba en un café; por la tarde estudiaba.'],
['childhood','Describe being small and having a dog.','Cuando era pequeño, tenía un perro.','Cuando era pequeña, tenía un perro.'],
['old-route','Say that you used to go to work by bus because you lived far away.','Iba al trabajo en autobús porque vivía lejos.','Antes vivía lejos y por eso iba al trabajo en autobús.'],
['old-weather','Describe the weather in your old neighbourhood as cold.','Antes hacía frío en mi barrio.','En mi antiguo barrio hacía frío.'],
['routine-change','Say that before you ate at home but now have breakfast at the café.','Antes comía en casa, pero ahora desayuno en el café.','Ahora desayuno en el café; antes comía en casa.']
],
[
['meal-event','Say that you normally ate at home but yesterday ate with Marta.','Normalmente comía en casa, pero ayer comí con Marta.','Ayer comí con Marta; normalmente comía en casa.'],
['bounded-stay','Say that you lived in Toledo for two years and then returned to Madrid.','Viví en Toledo dos años y después volví a Madrid.','Viví en Toledo durante dos años. Después volví a Madrid.'],
['background-call','Say that you were at home when Luis called.','Estaba en casa cuando Luis llamó.','Cuando Luis llamó, estaba en casa.'],
['rain-change','Describe good weather when you went out, followed by rain.','Hacía buen tiempo cuando salimos. Después empezó a llover.','Cuando salimos hacía buen tiempo, pero después empezó a llover.'],
['meal-sequence','Tell Ana that you ate and then left the café at six.','Comí y después salí del café a las seis.','Primero comí. Después salí del café a las seis.'],
['habit-event','Contrast your old park routine with yesterday’s café visit.','Antes iba al parque los domingos, pero ayer fui al café.','Ayer fui al café. Antes iba al parque los domingos.']
],
[
['lost-train','Tell Luis that you missed the train because you arrived late.','Perdí el tren porque llegué tarde.','Llegué tarde, así que perdí el tren.'],
['change-stop','Ask where you have to change to get to Toledo.','¿Dónde tengo que cambiar para ir a Toledo?','Para ir a Toledo, ¿dónde tengo que cambiar?'],
['ticket-valid','Ask whether this ticket is valid for the next train.','¿Este billete sirve para el siguiente tren?','¿Sirve este billete para el siguiente tren?'],
['route-check','Check directions: straight to the square, then right.','Recto hasta la plaza y después a la derecha, ¿verdad?','¿Voy recto hasta la plaza y después a la derecha?'],
['alternative','Say that you had to buy another ticket but could arrive on time.','Tuve que comprar otro billete, pero pude llegar a tiempo.','Pude llegar a tiempo, aunque tuve que comprar otro billete.'],
['delay-message','Explain that the train was stopped and you are going to arrive later.','El tren estaba parado, así que voy a llegar más tarde.','Voy a llegar más tarde porque el tren estaba parado.']
],
[
['table-order','Order two coffees with milk and one bottle of water.','Dos cafés con leche y una botella de agua, por favor.','Quiero dos cafés con leche y una botella de agua, por favor.'],
['ingredient','Ask whether the soup contains meat and say that you do not eat meat.','¿La sopa lleva carne? No como carne.','No como carne. ¿La sopa lleva carne?'],
['wrong-soup','Explain that you ordered soup without meat but this soup contains chicken.','Pedí sopa sin carne, pero esta lleva pollo.','Esta sopa lleva pollo, pero la pedí sin carne.'],
['missing-coffee','Say that you ordered two coffees but only one arrived. Ask for the other.','Pedimos dos cafés, pero solo hay uno. ¿Puede traer el otro?','Falta un café. Pedimos dos; ¿puede traer el otro, por favor?'],
['bill-check','Say that the bill lists three coffees but you had two, and ask for a check.','En la cuenta hay tres cafés, pero tomamos dos. ¿Puede comprobarla?','Tomamos dos cafés, no tres. ¿Puede comprobar la cuenta?'],
['past-message','Tell Ana that the waiter said there was no soup, so you chose salad.','El camarero dijo que no había sopa, así que elegí una ensalada.','Elegí una ensalada porque el camarero dijo que no había sopa.']
],
[
['size-change','Explain that this T-shirt is too small and ask for medium.','Esta camiseta me queda pequeña. Quiero una mediana.','Quiero una camiseta mediana porque esta me queda pequeña.'],
['receipt','Say you bought the jacket yesterday and have the receipt.','Compré la chaqueta ayer y tengo el recibo.','Tengo el recibo; compré la chaqueta ayer.'],
['fault','Explain that this phone does not work and ask for help.','Este móvil no funciona. ¿Puede ayudarme?','¿Puede ayudarme? Este móvil no funciona.'],
['refusal','Say that you declined to buy the bag because it was broken.','No quise comprar la bolsa porque estaba rota.','La bolsa estaba rota, así que no quise comprarla.'],
['comparison','Say that the other jacket costs more but fits better.','La otra chaqueta cuesta más, pero me queda mejor.','Me queda mejor la otra chaqueta, aunque cuesta más.'],
['return-visit','Tell the assistant you came yesterday to exchange the jacket.','Vine ayer a cambiar la chaqueta.','Ayer vine para cambiar esta chaqueta.']
],
[
['reschedule','Say you missed the train and ask to meet at seven instead of six.','Perdí el tren. ¿Podemos quedar a las siete en lugar de a las seis?','¿Podemos quedar a las siete? Perdí el tren y no puedo llegar a las seis.'],
['work-reason','Say that you could not come yesterday because you had to work.','Ayer no pude venir porque tuve que trabajar.','Tuve que trabajar ayer, así que no pude venir.'],
['alternative-day','Decline Sunday because of a family visit and suggest Saturday afternoon.','El domingo tengo una visita familiar. ¿Qué tal el sábado por la tarde?','¿Podemos quedar el sábado por la tarde? El domingo tengo una visita familiar.'],
['finished-wait','Say that you stayed at the station until eight and then went to the café.','Estuve en la estación hasta las ocho y después fui al café.','Después de estar en la estación hasta las ocho, fui al café.'],
['same-place','Confirm the café meeting place but change the time to half past six.','Quedamos delante del café, pero ahora a las seis y media.','El mismo lugar: delante del café. La nueva hora es las seis y media.'],
['new-plan','Explain that you are tired after yesterday’s journey and plan to rest today.','Ayer viajé y ahora estoy cansada, así que hoy voy a descansar.','Estoy cansado después del viaje de ayer. Hoy voy a descansar.']
],
[
['opinion-reason','Say you think the train is better because you have little time.','Creo que el tren es mejor porque tengo poco tiempo.','Tengo poco tiempo, así que para mí el tren es mejor.'],
['polite-difference','Agree about the cheaper bus but say you prefer the train.','Estoy de acuerdo: el autobús cuesta menos, pero prefiero el tren.','El autobús cuesta menos, sí. Pero yo prefiero el tren.'],
['negative-agree','Ana says she does not want meat. Say that you do not either.','A mí tampoco.','Yo tampoco quiero carne.'],
['positive-agree','Diego thinks walking is a good idea. Agree and give that opinion too.','Estoy de acuerdo. A mí también me parece una buena idea.','A mí también me parece una buena idea caminar.'],
['film-reason','Say you saw the film yesterday and liked its music but not its ending.','Vi la película ayer. Me gustó la música, pero no me gustó el final.','Ayer vi la película; me gustó la música, pero el final no.'],
['practical-choice','Say the new café seems good but closes soon, so suggest the station café.','El café nuevo me parece bueno, pero cierra pronto. Vamos al de la estación.','Me gusta el café nuevo, pero vamos al de la estación porque el nuevo cierra pronto.']
],
[
['background-result','Describe cold weather, missing the train and your current plan to rest.','Hacía frío y perdí el tren. Ahora estoy cansada, así que voy a descansar.','Perdí el tren cuando hacía frío. Estoy cansado y voy a descansar.'],
['open-finished','Say you have been to Toledo this week but went to Madrid yesterday.','Esta semana he ido a Toledo, pero ayer fui a Madrid.','Ayer fui a Madrid. Esta semana también he ido a Toledo.'],
['problem-solution','Explain that the jacket was small, you asked for another size and it fitted.','La chaqueta era pequeña. Pedí otra talla y me quedó bien.','Pedí otra talla porque la chaqueta era pequeña. La otra me quedó bien.'],
['message-place','Tell Diego you arrived late because the train was stopped and are now at the museum.','Llegué tarde porque el tren estaba parado. Ahora estoy en el museo.','El tren estaba parado, así que llegué tarde. Ya estoy en el museo.'],
['help-result','Say you had problems yesterday but asked for help and could continue the plan.','Ayer tuvimos problemas, pero pedimos ayuda y pudimos seguir el plan.','Pedimos ayuda con los problemas de ayer y pudimos seguir el plan.'],
['complete-message','Link your old routine, yesterday’s outing and tomorrow’s café plan in three sentences.','Antes iba al parque los domingos. Ayer fui al museo. Mañana voy a tomar un café con Ana.','Antes los domingos iba al parque. Ayer fui al museo y mañana voy a tomar un café con Ana.']
]
];
root.A22FocusedData={listening,speaking};if(typeof module!=='undefined')module.exports=root.A22FocusedData;
})(typeof window==='undefined'?globalThis:window);
