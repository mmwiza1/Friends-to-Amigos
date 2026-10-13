const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const S=require('../www/spanish-fragments'),D=require('../www/learner-dictionary');
const spanish=(text,options)=>S.segments(text,options).filter(x=>x.spanish).map(x=>x.text);
const esc=text=>String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

for(const [text,expected]of [
 ['Luis says “¿Cómo te llamas?” What answers his question?','¿Cómo te llamas?'],
 ['She says ‘Tengo hambre’. What does she need?','Tengo hambre'],
 ['Luis asks “¿Dónde está la estación?” Choose the useful reply.','¿Dónde está la estación?'],
 ['You hear “Hasta luego”. What kind of expression is this?','Hasta luego'],
 ['Ana says: «Me llamo Ana». What is she telling you?','Me llamo Ana'],
 ['What does "Me gusta el cine" mean?','Me gusta el cine'],
 ["What does 'Tengo sed' mean?",'Tengo sed']
])test('conservative mixed-language boundary: '+text,()=>{
 const spans=S.segments(text,{language:'en'});assert.deepEqual(spans.filter(x=>x.spanish).map(x=>x.text),[expected]);
 assert.equal(spans.map(x=>x.text).join(''),text);for(const x of spans)assert.equal(x.text,text.slice(x.start,x.end));
 const rendered=S.render(text,esc,{language:'en'});assert.ok(rendered.includes('<span lang="es" data-dictionary>'+expected+'</span>'));
 assert.ok(!rendered.startsWith('<span lang="es"'));
});

test('generic inverted punctuation identifies an unquoted visible Spanish question',()=>{
 const text='Luis asks: ¿Dónde está la estación? Choose the useful reply.';
 assert.deepEqual(spanish(text,{language:'en'}),['¿Dónde está la estación?']);
});

test('several separate Spanish quotations leave English text and quotation marks untouched',()=>{
 const text='He says “Hola” and then “Hasta luego”.';
 assert.deepEqual(spanish(text,{language:'en'}),['Hola','Hasta luego']);
 assert.equal(S.segments(text).map(x=>x.text).join(''),text);
});

test('whole Spanish answer choices receive Spanish boundaries without reading answer metadata',()=>{
 for(const text of ['Hasta luego','Me llamo Ana','Soy de Inglaterra','Hola','Adiós','Gracias','No, gracias','Me gusta el cine','Tengo veinte años','Un café, por favor.']){
  assert.equal(S.isSpanish(text),true,text);assert.deepEqual(spanish(text),[text]);
 }
});

test('English choices and isolated shared words are never automatically Spanish',()=>{
 for(const text of ['Her name','Her age','Where she lives','Hello','Good morning','Thank you','Your country','No','Me','a','he','has','pan','pie','plan','hotel','radio','animal','normal','I have no idea']){
  assert.equal(S.isSpanish(text),false,text);assert.deepEqual(spanish(text),[],text);
 }
});

test('English homographs inside an English quote do not create Spanish tokens',()=>{
 for(const text of ['She says “No”.','You hear “Me”.','Choose “a pie”.','She says “He has a plan”.','She asks “Where is the café?”','Choose “Todo recto only”.'])assert.deepEqual(spanish(text,{language:'en'}),[],text);
});

test('Spanish auxiliaries and negation remain recognisable alongside clear Spanish context',()=>{
 for(const text of ['He comido en casa.','Has comido en casa.','Hay una farmacia cerca.','No puedo ir hoy.','Me gusta el cine.','No he comido todavía.','¿Habéis comido?'])assert.equal(S.isSpanish(text),true,text);
 for(const text of ['He has a plan','He needs a hotel','No café today','Has she called?'])assert.equal(S.isSpanish(text),false,text);
});

test('an accented word in an English instruction cannot decorate surrounding English',()=>{
 for(const text of ['Choose the café near the station.','What does mañana mean?','Write the word canción.','She says hola.'])assert.deepEqual(spanish(text,{language:'en'}),[],text);
});

test('explicit Spanish metadata supports concise homographs and vocabulary outside the local lexicon',()=>{
 for(const text of ['No','me','Inglaterra','Mi compañero es guatemalteco.'])assert.deepEqual(spanish(text,{language:'es-ES'}),[text]);
});

test('exact string metadata marks only visible Spanish substrings',()=>{
 const text='Read Tengo hambre, then choose the reply.';
 assert.deepEqual(spanish(text,{language:'en',fragments:['Tengo hambre']}),['Tengo hambre']);
 assert.deepEqual(spanish(text,{language:'en',fragments:['Not visible']}),[]);
});

test('anchored metadata respects the exact visible UTF-16 offset and does not search hidden text',()=>{
 const text='🙂 Read hola, then say hola.';const first=text.indexOf('hola'),last=text.lastIndexOf('hola');
 assert.deepEqual(spanish(text,{language:'en',fragments:[{text:'hola',start:last}]}),['hola']);
 const marked=S.segments(text,{language:'en',fragments:[{text:'hola',start:last}]}).find(x=>x.spanish);assert.equal(marked.start,last);
 assert.deepEqual(spanish(text,{language:'en',fragments:[{text:'hola',start:first+1},{text:'Hola',start:first},{text:'invisible',start:0}]}),[]);
});

test('invalid fragment metadata is ignored and overlapping visible spans merge safely',()=>{
 const text='Read Me llamo Ana, then continue.';
 assert.deepEqual(spanish(text,{language:'en',fragments:[null,{},12,{text:'Me llamo',start:5},'llamo Ana']}),['Me llamo Ana']);
 assert.deepEqual(spanish(text,{language:'en',fragments:'Me llamo Ana'}),[]);
});

test('renderer escapes Spanish and English text while keeping original words and punctuation',()=>{
 const text='Say <hello> & “Hola”.';const output=S.render(text);
 assert.equal(output,'Say &lt;hello&gt; &amp; “<span lang="es" data-dictionary>Hola</span>”.');
 assert.equal(S.render('<script>Hola</script>',undefined,{language:'es'}),'<span lang="es" data-dictionary>&lt;script&gt;Hola&lt;/script&gt;</span>');
 assert.ok(!S.render('<img src=x onerror="alert(1)">').includes('<img'));
});

test('helper does not inspect grading, hidden media or hint metadata',()=>{
 const options={language:'en'};for(const key of ['answer','correct','spanish','listening','models','hintRevealed'])Object.defineProperty(options,key,{get(){throw new Error('Hidden data was inspected: '+key);}});
 assert.deepEqual(spanish('You hear “Hasta luego”.',options),['Hasta luego']);
});

test('dictionary constructions remain available with Spanish fragment-local offsets',()=>{
 for(const [text,tap,expected]of [['She says “Tengo hambre”.','hambre','tener hambre'],['He says “Me gusta el cine”.','gusta','me gusta'],['She says “Voy a comer”.','Voy','ir a']]){
  const fragment=S.segments(text,{language:'en'}).find(x=>x.spanish);assert.ok(fragment);
  assert.equal(D.lookup(tap,{sentence:fragment.text,offset:fragment.text.indexOf(tap)}).lemma,expected);
 }
});

test('empty inputs remain harmless and no unrequested text is fabricated',()=>{
 assert.deepEqual(S.segments(''),[]);assert.equal(S.render(''),'');assert.equal(S.isSpanish(null),false);assert.equal(S.isSpanish({}),false);
 assert.equal(S.render(null),'');assert.equal(S.segments('hola')[0].text,'hola');
 assert.deepEqual(spanish('Read “Hola”.',null),['Hola']);assert.equal(S.render('Hola',null),'<span lang="es" data-dictionary>Hola</span>');
});

test('fragment rendering is deterministic and never changes the learner lexicon',()=>{
 const before=JSON.stringify(D.entries),text='Luis says “¿Cómo te llamas?” What answers his question?';
 const rendered=S.render(text);for(let i=0;i<3;i++)assert.equal(S.render(text),rendered);assert.equal(JSON.stringify(D.entries),before);
 const code=fs.readFileSync(require.resolve('../www/spanish-fragments'),'utf8');assert.ok(!/fetch\(|XMLHttpRequest|localStorage|hintRevealed|isCorrect\(/.test(code));
});


test('bounded visible-text memoisation preserves positive and negative classifications without learner state',()=>{
 const vm=require('node:vm');let calls=0;
 const ctx={LearnerDictionary:{lookup(text){calls++;return text==='hola'?{id:'lex-word-hola',kind:'word',pos:'greeting'}:null;}}};
 ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync(require.resolve('../www/spanish-fragments'),'utf8'),ctx);
 const api=ctx.SpanishFragments;const explicitlySpanish=api.segments('Compara «hola» con otra palabra.',{language:'es'});assert.equal(explicitlySpanish.length,1);assert.equal(explicitlySpanish[0].spanish,true);assert.equal(calls,0);
 assert.equal(api.isSpanish('hola'),true);const positiveCalls=calls;
 for(let i=0;i<100;i++)assert.equal(api.isSpanish('hola'),true);assert.equal(calls,positiveCalls);
 assert.equal(api.isSpanish('unknownword'),false);const negativeCalls=calls;
 for(let i=0;i<100;i++)assert.equal(api.isSpanish('unknownword'),false);assert.equal(calls,negativeCalls);
 // More than 512 distinct visible strings must evict the oldest cached entry.
 for(let i=0;i<520;i++)api.isSpanish('palabraprueba'+i);const beforeRetry=calls;
 assert.equal(api.isSpanish('hola'),true);assert.ok(calls>beforeRetry);
 assert.deepEqual(Object.keys(api).sort(),['isSpanish','render','segments']);
});
