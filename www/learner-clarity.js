(function(root){
'use strict';
// Presentation-only amendments: keep authored targets, identifiers and historical
// snapshots intact. Each mistake below is a specific, authored beginner pattern.
const replacements={
 'Your role is Luis. Introduce yourself to a new classmate.':'You are Luis. Write “My name is Luis” in Spanish.',
 'Your role is Luis, who is from Spain. Answer “¿De dónde eres?”':'You are Luis, from Spain. Answer “¿De dónde eres?”',
 'In this role-play you are nineteen (diecinueve). Answer “¿Cuántos años tienes?”':'You are nineteen (diecinueve). Answer “¿Cuántos años tienes?”',
 'Your role is Ana. Tell Luis you are tired, rather than giving your nationality.':'You are Ana. Tell Luis you feel tired today.',
 'Your role is Ana, from England. Answer “¿De dónde eres?”':'You are Ana, from England. Answer “¿De dónde eres?”',
 'Your role is Ana, from England. Give your origin.':'You are Ana, from England. Say where you are from.',
 'Your role is Luis, aged twenty-one. Say your age in Spanish words.':'You are Luis, aged twenty-one. Write your age in Spanish words.',
 'Your role is Ana. Greet Marta and give your name in one short response.':'You are Ana. Greet Marta and give your name.',
 'Your role is Luis. Introduce your sister Marta by name.':'You are Luis. Introduce your sister Marta.',
 'Your role is Luis. Introduce your sister Marta to Ana.':'You are Luis. Introduce your sister Marta to Ana.',
 'As Luis, introduce your sister Marta by name and relationship.':'You are Luis. Introduce Marta as your sister.',
 'You did not hear a name. Ask politely for repetition.':'You did not hear a name. Politely ask the person to repeat it.',
 'What word introduces the contrast between origin and home?':'Which Spanish word means “but” in Ana’s sentence?',
 'Which Spanish verb form expresses Ana’s age?':'Which word in Ana’s sentence means “I have”?',
 'You address Ana and Marta together as friends in Spain. Which pronoun fits this all-female group?':'You are talking to Ana and Marta together as friends in Spain. Which word means “you”?',
 'You address the same two women informally in Spain. Which pronoun fits?':'You are talking to these two women as friends in Spain. Which word means “you”?',
 'Why does Ana ask for bread? Give her physical need.':'Why does Ana ask for bread? Say how she feels.',
 'Which price is written correctly before masculine euros?':'Which way of writing “twenty-one euros” is correct?',
 'You want to describe Luis, a tall man. Which phrase agrees?':'Which phrase describes Luis as tall?',
 'Which description would agree with Marta herself?':'Which description fits Marta?',
 'Which verb agrees with plural “las llaves”?':'“Las llaves” means “the keys”. Which verb goes with it?',
 'Which stated fact supports choosing the café as the nearby destination?':'Why is the café a good choice for somewhere nearby?',
 'What is the function of lo siento?':'Why does Ana say “Lo siento” here?',
 'What does no pasa nada communicate?':'What does “No pasa nada” mean here?',
 'What is the immediate next step?':'What will they do next?',
 'Which polite reply grants permission to try it on?':'Which polite reply lets her try it on?',
 'Which contrast does pero introduce?':'What two different ideas does “pero” connect?',
 'Which sentence describes Diego’s own routine in his voice?':'Which sentence could Diego say about his own routine?',
 'Explain that you stay home because you are tired (role: Ana).':'You are Ana. Say you are staying home because you are tired.',
 'Say you go to bed at ten because you are tired (role: Ana).':'You are Ana. Say you go to bed at ten because you are tired.',
 'From memory, as Ana say “I stay home because I am tired”. Use porque.':'You are Ana. From memory, write “I stay home because I am tired”. Use porque.',
 'State a sequence: first get dressed, then go to class.':'Describe your morning: first get dressed, then go to class.',
 'Write a two-step morning: first get up, then have breakfast.':'Describe your morning: first get up, then have breakfast.',
 'Luis is free, so he agrees to meet. Which connector gives the consequence?':'Luis is free, so he agrees to meet. Which word means “so”?',
 'Which connector expresses the contrast in Diego’s first message?':'Which word means “but” in Diego’s first message?',
 'As Ana, greet Luis and introduce yourself aloud.':'You are Ana. Greet Luis and introduce yourself aloud.',
 'As Ana, say you are from England and live in Madrid.':'You are Ana. Say aloud that you are from England and live in Madrid.',
 'As Luis, introduce your sister Marta, aloud.':'You are Luis. Introduce your sister Marta aloud.',
 'What information does Luis ask Ana for?':'What does Luis want to know about Ana?',
 'How does Ana introduce herself? Give just her name.':'What name does Ana give when she introduces herself?',
 'Which two expressions introduce the speakers?':'Which two phrases do the speakers use to give their names?',
 'What does “también” tell us about Luis?':'What does “también” mean in Luis’s reply?',
 'Which preference does Ana express for the morning?':'What does Ana prefer to do in the morning?',
 'Does Luis abandon walking completely?':'Does Luis decide not to walk at all?',
 'Which request keeps Luis’s main requirement?':'Which request asks for the size Luis needs?',
 'Which item should be left off Ana’s shopping list?':'Which item does Ana not need to buy?',
 'Which reply offers company?':'Which reply offers to go with Ana?',
 'What does pequeño, pero cómodo express?':'What does “pequeño, pero cómodo” tell us about the room?',
 'Which room serves both work and leisure?':'In which room does Marta work and relax?',
 'Ask to try on the T-shirt in a short written response.':'Ask if you can try on the T-shirt.',
 'The trousers are too small on you. State this using quedar.':'The trousers are too small on you. Describe the problem using quedar.'
};
const patterns=[
 [/\bme llamo\b/i,'mi llamo','Me llamo means “my name is”. Me is the little word used when talking about yourself with llamarse. Mi means “my”, as in mi nombre; it cannot replace me here.'],
 [/\bme llamo\b/i,'soy llamo','Use me llamo to give your name. It already means “my name is”; do not put soy before llamo. You can also use soy followed by your name.'],
 [/\bme llamo\b/i,'me llama','For your own name, use me llamo, with -o. Me llama means someone else calls me.'],
 [/\bcómo te llamas\b/i,'cómo me llamas','Te llamas asks the other person their name. Me llamas asks what the other person calls you; me changes who you are talking about.'],
 [/\bestoy cansada\b/i,'soy cansada','Use estoy cansada for feeling tired now. Soy gives information such as who you are or your nationality.'],
 [/\bestoy libre\b/i,'soy libre','Estoy libre means you are available at that time. Soy libre describes being a free person, which does not tell your friend whether you can meet.'],
 [/\bvivo en\b/i,'vivir en','For “I live”, use vivo. Vivir is the dictionary form, “to live”, not a complete statement about yourself.'],
 [/\bvivo en\b/i,'vives en','Vivo means “I live”; vives means “you live”. Give your own home with vivo en.'],
 [/\bvivo en\b/i,'vivo a','Use en for the city where you live: vivo en Madrid. A is used for destinations, as in voy a Madrid.'],
 [/\bhablo\b/i,'hablar','Hablo means “I speak”. Hablar means “to speak”; use the -o form when telling someone which language you speak.'],
 [/\bhablo\b/i,'habla','Use hablo for “I speak”. Habla describes someone else speaking, or politely addresses another person.'],
 [/^tengo (veinte|diecinueve|veintiún) años$/i,'tiene $1 años','For your own age, use tengo. Tiene means “he/she has” or addresses someone politely; it does not mean “I have”.'],
 [/^tengo (veinte|diecinueve|veintiún) años$/i,'tengo $1 año','An age above one needs plural años. Keep the pattern tengo + number + años.'],
 [/\bme gusta\b/i,'mi gusta','Use me with gustar to show that you like something. Mi means “my”, as in mi libro; it does not mean “to me”.'],
 [/\bme gusta\b/i,'yo gusta','Use me gusta for “I like”. Me tells us who likes it; yo cannot replace me in this pattern.'],
 [/\bme gusta\b/i,'me gustan','Use gusta with one thing or an activity such as leer. Use gustan with plural things, such as los libros.'],
 [/\bme gustan\b/i,'me gusta','Plural things such as libros or películas take gustan. Me identifies the person who likes them.'],
 [/\bno me gusta\b/i,'me no gusta','Put no before the whole phrase: no me gusta. Keep me next to gusta.'],
 [/\bprefiero\b/i,'prefero','Use prefiero for “I prefer”: the middle e changes to ie. Prefero is not the Spanish form.'],
 [/\bprefiero\b/i,'preferir','Prefiero means “I prefer”. Preferir is “to prefer”; use prefiero to state your own preference.'],
 [/\bquiero\b/i,'quieres','Quiero means “I want”; quieres means “you want”. Use quiero when making your own request.'],
 [/\bnecesito\b/i,'necesitar','Necesito means “I need”. Necesitar means “to need”; use necesito to tell the assistant what you need.'],
 [/\bnecesito\b/i,'necesita','Use necesito for “I need”. Necesita means someone else needs it, or addresses another person politely.'],
 [/\bpor favor\b/i,'para favor','Por favor is the fixed expression for “please”. Keep por; para favor is not the expression.'],
 [/\bun café\b/i,'una café','Café is masculine, so use un café. The drink is still masculine when you add con leche.'],
 [/\bun té\b/i,'una té','Té is masculine: un té. Use un when you order one tea.'],
 [/\bla cuenta\b/i,'el cuenta','Cuenta is feminine, so the bill is la cuenta. Keep la when asking to pay.'],
 [/\bla cuenta\b/i,'la cuento','La cuenta is the bill. Cuento means “story”; changing the last letter changes what you are asking for.'],
 [/\bun libro\b/i,'una libro','Libro is masculine, so use un libro. The article must match the noun.'],
 [/\bun ordenador\b/i,'una ordenador','Ordenador is masculine: un ordenador. Una goes with feminine nouns.'],
 [/\buna carpeta\b/i,'un carpeta','Carpeta is feminine: una carpeta. It means a folder, not a carpet.'],
 [/\buna camiseta\b/i,'un camiseta','Camiseta is feminine, so use una camiseta. Keep feminine forms with it, such as roja or blanca.'],
 [/\buna chaqueta\b/i,'un chaqueta','Chaqueta is feminine: una chaqueta. Its article and any changing adjective need feminine forms.'],
 [/\b(dos|tres) libros\b/i,'$1 libro','After dos or tres, use plural libros. The number and noun describe more than one book.'],
 [/\b(dos|tres) cafés\b/i,'$1 café','More than one coffee takes plural cafés: dos cafés or tres cafés.'],
 [/\bveintiún euros\b/i,'veintiuno euros','Veintiuno shortens to veintiún before masculine euros. The amount remains twenty-one.'],
 [/\bveintiún años\b/i,'veintiuno años','Veintiuno shortens to veintiún before masculine años. Keep plural años for the age.'],
 [/\b(dos|cinco|seis|siete|veintiún) euros\b/i,'$1 euro','Amounts above one take plural euros. One euro is un euro; several are euros.'],
 [/\blos ojos marrones\b/i,'los ojos marrón','Ojos is plural, so marrón becomes marrones. The colour must describe both eyes.'],
 [/\bson marrones\b/i,'son marrón','You are describing plural eyes. Marrón becomes marrones to match more than one.'],
 [/\bmis padres\b/i,'mi padres','Padres is plural, so use mis padres. Mi goes with one person or thing, such as mi padre.'],
 [/\bestos son\b/i,'estos es','Estos names more than one person, so use son. Es is for one person or thing.'],
 [/\bhermano es alto\b/i,'hermano es alta','Hermano is masculine, so use alto. Alta would describe a sister or another feminine noun.'],
 [/\bhermano es simpático\b/i,'hermano es simpática','Use simpático with masculine hermano. The -a form goes with a feminine noun.'],
 [/\bhermana es alta\b/i,'hermana es alto','Hermana is feminine, so use alta. Alto would describe a brother or another masculine noun.'],
 [/\bes simpática\b/i,'es simpático','Use feminine simpática for the woman described here. Simpático would describe a man.'],
 [/\b(hermano es alto y )simpático\b/i,'$1simpática','Both adjectives describe a brother: alto y simpático. Keep both masculine.'],
 [/\bcamiseta (blanca|roja)\b/i,'camiseta $1s','You are describing one camiseta, so its colour is singular. A final -s would describe more than one.'],
 [/\bcamiseta azul\b/i,'camiseta azules','This is one camiseta, so use singular azul. Azules describes more than one.'],
 [/\bcamiseta blanca\b/i,'camiseta blanco','Camiseta is feminine, so use blanca. Blanco is the masculine form.'],
 [/\bcamiseta roja\b/i,'camiseta rojo','Use feminine roja with camiseta. Rojo goes with a masculine noun.'],
 [/\bchaqueta (roja|negra)\b/i,'chaqueta $1s','This is one jacket, so the colour stays singular: roja or negra.'],
 [/\bpantalones negros\b/i,'pantalones negro','Pantalones is plural, so use negros. Negro would describe one masculine object.'],
 [/\bpantalones azules\b/i,'pantalones azul','Pantalones is plural; azul becomes azules when describing these trousers.'],
 [/\bmi piso es pequeño\b/i,'mi piso es pequeña','Piso is masculine, so use pequeño. Pequeña describes a feminine noun, such as cocina.'],
 [/\bcocina es pequeña\b/i,'cocina es pequeño','Cocina is feminine, so use pequeña. Pequeño would describe a masculine noun.'],
 [/\bdos dormitorios\b/i,'dos dormitorio','Two bedrooms need plural dormitorios. Dos tells us there is more than one.'],
 [/\bdos sillas\b/i,'dos silla','Use plural sillas after dos. Two chairs are dos sillas.'],
 [/\bdos ordenadores\b/i,'dos ordenador','Dos means two, so ordenador needs plural -es: dos ordenadores.'],
 [/\b(el móvil|mi móvil|el libro|el baño|el ordenador) está\b/i,'$1 estar','Use está to say where this one object or room is. Estar is “to be”, not the completed sentence form.'],
 [/\blas llaves están\b/i,'las llaves está','Las llaves is plural, so use están. Está would locate one object.'],
 [/\bmi móvil está\b/i,'mi móvil están','One phone takes singular está. Están is for several objects.'],
 [/\bdelante del\b/i,'delante de el','De + el becomes del: delante del parque. The two words contract before a masculine place.'],
 [/\bal lado de la\b/i,'al lado la','Keep de in al lado de: it means “next to”. Then name the place or object.'],
 [/\ba las (ocho|nueve|dos|tres|diez|cinco|seis|siete|once)\b/i,'a la $1','Hours other than one use plural a las. Only one o’clock uses a la una.'],
 [/\bson las (tres|dos)\b/i,'es la $1','Use plural son las for hours other than one. One o’clock is es la una.'],
 [/\bnos vemos a la una\b/i,'nos vemos la una','Keep a before the meeting time: nos vemos a la una. A la una means “at one”.'],
 [/\b(voy|vamos) a (leer|trabajar|ir|quedar)\b/i,'$1 $2','Keep a between the form of ir and the next action: voy a leer or vamos a leer.'],
 [/\bme levanto\b/i,'mi levanto','Use me for your own routine: me levanto. Mi means “my”, so it cannot replace me here.'],
 [/\bme levanto\b/i,'me levantas','Use me levanto for “I get up”. Levantas is the form used when talking to someone with tú.'],
 [/\bme ducho\b/i,'mi ducho','Me ducho means “I shower myself”. Mi means “my”; use me when talking about this action on yourself.'],
 [/\bme ducho\b/i,'me duchas','Use me ducho for your own shower. Duchas is the tú form, used when talking to another person.'],
 [/\bme visto\b/i,'me vesto','For “I get dressed”, use me visto. Vestirse changes e to i in this form.'],
 [/\bme visto\b/i,'me vestir','Me visto means “I get dressed”. Vestir is “to dress”; use visto for your own routine.'],
 [/\bme acuesto\b/i,'mi acuesto','Use me acuesto for your own bedtime. Mi means “my”; me is used with this action on yourself.'],
 [/\bme acuesto\b/i,'me acuestas','Use me acuesto for “I go to bed”. Acuestas is the tú form, not the form for yourself.'],
 [/\btengo que trabajar\b/i,'tengo trabajar','Keep que in tengo que trabajar: it means “I have to work”. Tengo trabajar leaves out part of the phrase.'],
 [/\btengo que trabajar\b/i,'tengo que trabajo','After tengo que, keep the action as trabajar, “to work”. Trabajo is the separate form “I work”.'],
 [/\bpuedo venir\b/i,'puedo vengo','After puedo (“I can”), use venir (“to come”), not vengo (“I come”). Keep puedo followed by the action.'],
 [/\bpuedo probarme\b/i,'puedo probarte','Probarme means trying clothes on yourself. Probarte changes it to trying them on the other person.'],
 [/\blos pantalones me quedan\b/i,'los pantalones me queda','Pantalones is plural, so use quedan. Keep plural grandes or pequeños as well.'],
 [/\bla chaqueta me queda\b/i,'la chaqueta me quedan','One chaqueta takes singular queda. Quedan is for plural clothes, such as pantalones.'],
 [/\bla camiseta me queda\b/i,'la camiseta me quedan','One camiseta takes singular queda. Use quedan for plural clothes.'],
 [/\bme llevo\b/i,'me llevas','Me llevo means “I will take” in the shop. Llevas is the form for tú; use llevo for your own purchase.'],
 [/\bpago con tarjeta\b/i,'pagar con tarjeta','Pago means “I pay”. Pagar is “to pay”; use pago to state how you are paying.'],
 [/\bcon tarjeta\b/i,'en tarjeta','Use con tarjeta for paying “by card”. Keep con when naming this payment method.']
];
const specific={
 'u0l1-q3':[['¿Cómo tú llamas?','Use te llamas when asking one friend their name. Tú means “you”, but it cannot replace te in this phrase.']],
 'u1write-q4':[['¿Cuánto años tienes?','Años is plural, so ask cuántos años tienes. Cuánto is singular.']],
 'u1check-q9':[['¿Cuánto años tienes?','Use plural cuántos with plural años. The question is cuántos años tienes.']],
 'u3l0-q3':[['¿Cuánto cuestan?','This prompt asks about one item: cuesta. Use cuestan when asking about several items.']],
 'u3write-q1':[['¿Cuánto cuestan?','One notebook takes cuesta. Cuestan is for more than one item.']],
 'a12u1l1-q3':[['¿Tú quiere venir?','With one friend, use tú quieres, or simply quieres. Quiere is the form for usted or another person.']],
 'a12u3l2-q3':[['¿Usted tienes la talla mediana?','When speaking politely with usted, use tiene. Tienes goes with tú.']],
 'a12u3l2-q5':[['¿Usted tienes la talla pequeña?','Usted uses tiene; tú uses tienes. Keep the polite form with usted.']],
 'a12u3check-q8':[['¿Usted tienes la talla pequeña?','Use tiene with polite usted. Tienes is the familiar tú form.']],
 'u6write-q2':[['En la derecha','For the direction “to the right”, use a la derecha. Keep a in this fixed phrase.']],
 'u6l1-q5':[['En la izquierda','The direction “to the left” is a la izquierda. Keep a in this fixed phrase.']],
 'u6check-q7':[['En la izquierda','Use a la izquierda when giving the direction “to the left”.']],
 'a12u2write-q4':[['Nosotros voy a leer el domingo','For yourself and your friends, use vamos a leer. Voy means only “I am going to”.']],
 'u7write-q2':[['Desayuno las nueve','Keep a before the time of the activity: desayuno a las nueve.']],
 'u7l1-q5':[['Desayuno las ocho','Use a las ocho to say when you have breakfast. Keep a before the time.']]
};
function normalize(value){return String(value).normalize('NFC').toLowerCase().replace(/[áéíóúü]/g,c=>({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ü':'u'}[c])).replace(/[¿?¡!.,;:”“"']/g,' ').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim();}
function apply(C){
 if(C.learnerClarityAudit)return;
 const audit={questions:0,stages:{},types:{},rewritten:0,rewrittenTypes:{},taskRewrites:0,contextLabelsRemoved:0,spanishProduction:0,addedMistakes:0,questionsWithNewMistakes:0,correctedMistakes:0,clarifiedExplanations:0};
 const explanations=new Set();
 for(const lesson of C.lessons)for(const q of lesson.questions){
  audit.questions++;audit.stages[lesson.stage]=(audit.stages[lesson.stage]||0)+1;audit.types[q.type]=(audit.types[q.type]||0)+1;
  const before=q.prompt;
  // Lesson/stage and passage titles already appear in the UI and remain in the
  // snapshot. They no longer obscure the actual task on a narrow phone screen.
  let prefix='';
  if(q.prompt.startsWith('A1.2 · ')){
   if(q.reading)prefix=`A1.2 · ${q.reading.title}: `;
   else if(lesson.id.endsWith('write'))prefix=`A1.2 · ${C.getUnit(lesson).title}: `;
   else if(lesson.checkpoint){const unit=C.getUnit(lesson);prefix=(['Discover','Build confidence','Use it'].map(label=>`A1.2 · ${label}: ${unit.title}: `)).find(p=>q.prompt.startsWith(p))||'';}
   else prefix=`A1.2 · ${lesson.title}: `;
  }else if(q.reading)prefix=`${q.reading.title}: `;
  if(prefix&&q.prompt.startsWith(prefix)){q.prompt=q.prompt.slice(prefix.length);audit.contextLabelsRemoved++;}
  const task=q.prompt;
  q.prompt=replacements[q.prompt]||q.prompt;
  if(q.type==='text'&&q.language==='es')q.prompt=q.prompt.replace(/^From memory, say /,'From memory, write ');
  if(q.prompt!==task)audit.taskRewrites++;
  if(q.prompt!==before){audit.rewritten++;audit.rewrittenTypes[q.type]=(audit.rewrittenTypes[q.type]||0)+1;}
  if(q.explanation==='Use your role’s name with me llamo or soy. A short greeting can come first.'){
   q.explanation='Me llamo Luis gives your name. You can also say soy Luis. A short greeting can come first.';audit.clarifiedExplanations++;
  }
  // Keep all original authored explanations and their precedence. Never change
  // accepted answers to make an example wrong; refuse it if it is accepted.
  if(q.type!=='text'||q.language!=='es')continue;
  audit.spanishProduction++;
  // Some checkpoint slots share source arrays. Detach the feedback array before
  // adding entries so a slot cannot mutate a different activity or practice set.
  q.mistakes=(q.mistakes||[]).map(m=>({...m}));
  // This old rule described future intentions even when a led to a place.
  // Correct the explanation without changing its saved answer or identity.
  if(/^Voy a la (estación|farmacia)$/.test(q.answer))for(const m of q.mistakes){
   if(normalize(m.answer)===normalize(q.answer.replace(/^Voy a /,'Voy '))&&m.explanation==='Keep a between ir and the infinitive: voy a + infinitive.'){
    m.explanation='Use a before the place you are going to: voy a la estación or voy a la farmacia. Keep a la before these feminine place names.';audit.correctedMistakes++;
   }
  }
  const existing=new Set((q.mistakes||[]).map(m=>normalize(m.answer))),accepted=new Set(q.accepted.map(normalize));let added=0;
  const add=(answer,explanation)=>{const key=normalize(answer);if(!key||accepted.has(key)||existing.has(key))return;existing.add(key);q.mistakes=q.mistakes||[];q.mistakes.push({answer,explanation});audit.addedMistakes++;added++;explanations.add(explanation);};
  for(const [pattern,replacement,explanation] of patterns)if(pattern.test(q.answer))add(q.answer.replace(pattern,replacement),explanation);
  for(const [answer,explanation] of specific[q.id]||[])add(answer,explanation);
  if(added)audit.questionsWithNewMistakes++;
 }
 audit.uniqueNewExplanations=explanations.size;C.learnerClarityAudit=audit;
}
root.LearnerClarity={apply};if(typeof module!=='undefined')module.exports=root.LearnerClarity;
})(typeof window==='undefined'?globalThis:window);
