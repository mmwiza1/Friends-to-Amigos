(function(root){
'use strict';
// First incremental canonical registry: the existing starter bank, not new content.
const pairs=[['Hola','Hello'],['Adiós','Goodbye'],['Hasta luego','See you later'],['¿Cómo te llamas?','What is your name?'],['Me llamo Ana','My name is Ana'],['Me llamo Luis','My name is Luis'],['Hola, Ana','Hello, Ana'],['Hola, Luis','Hello, Luis'],['Adiós, Ana','Goodbye, Ana'],['Adiós, Luis','Goodbye, Luis'],['Hasta luego, Ana','See you later, Ana'],['Hasta luego, Luis','See you later, Luis'],['Hola, me llamo Ana','Hello, my name is Ana'],['Hola, me llamo Luis','Hello, my name is Luis']];
const starters=pairs.map(([canonicalSpanish,englishSupport],i)=>({id:'linguistic-greeting-'+String(i+1).padStart(2,'0'),stage:'A1.1',unit:0,topic:'Greetings',grammarConcept:null,communicativeGoal:'Greet someone, give a name or say goodbye.',canonicalSpanish,englishSupport,naturalAlternatives:[],prerequisites:[],dictionaryLemmas:/llam/.test(canonicalSpanish)?['llamarse']:/Hola/.test(canonicalSpanish)?['hola']:/Adiós/.test(canonicalSpanish)?['adiós']:['hasta luego'],spainPreferredForm:canonicalSpanish,regionalAlternatives:[],eligiblePracticeModes:['builder','listening','speaking','match','rapid'],storyReferences:['u0story0'],sourceActivity:'u0l0',editorialStatus:'internal review; independent native/educator review pending'}));
// Canonical v1.8 introduction models, moved unchanged from the transitional overlay.
const introductionUnits=[
  {
    "sourceActivity": "u1l0",
    "unit": 1,
    "communicativeGoal": "Give your age, origin and home city, and ask for basic personal information",
    "models": [
      [
        "u1l0-q1",
        "Personal information",
        "¿De dónde eres?",
        "Where are you from?"
      ],
      [
        "u1l0-q2",
        "Ser or estar",
        "Soy de Inglaterra.",
        "I am from England."
      ],
      [
        "u1l0-q3",
        "Prepositions",
        "Vivo en Madrid.",
        "I live in Madrid."
      ]
    ]
  },
  {
    "sourceActivity": "u2l0",
    "unit": 2,
    "communicativeGoal": "Order a simple breakfast, express hunger and ask for the bill",
    "models": [
      [
        "u2l0-q1",
        "Café ordering",
        "¿Qué quieres tomar?",
        "What would you like to drink?"
      ],
      [
        "u2l0-q2",
        "Politeness",
        "Un café, por favor.",
        "A coffee, please."
      ],
      [
        "u2l0-q3",
        "Café ordering",
        "Un café con leche, por favor.",
        "A coffee with milk, please."
      ],
      [
        "u2l0-q4",
        "Café vocabulary",
        "Un té.",
        "A tea."
      ]
    ]
  },
  {
    "sourceActivity": "u3l0",
    "unit": 3,
    "communicativeGoal": "Ask a price, understand a small total and say how many items you want",
    "models": [
      [
        "u3l0-q1",
        "Prices",
        "¿Cuánto cuesta?",
        "How much is it?"
      ],
      [
        "u3l0-q2",
        "Numbers",
        "Son dos euros.",
        "It is two euros."
      ],
      [
        "u3l0-q3",
        "Prices",
        "¿Cuánto cuesta?",
        "How much is it?"
      ]
    ]
  },
  {
    "sourceActivity": "u4l0",
    "unit": 4,
    "communicativeGoal": "Introduce close family members and describe someone simply",
    "models": [
      [
        "u4l0-q1",
        "Family vocabulary",
        "Esta es mi hermana.",
        "This is my sister."
      ],
      [
        "u4l0-q2",
        "Family vocabulary",
        "Esta es mi hermana.",
        "This is my sister."
      ],
      [
        "u4l0-q3",
        "Gender agreement",
        "Este es mi hermano.",
        "This is my brother."
      ],
      [
        "u4l0-q4",
        "Family vocabulary",
        "Mis padres.",
        "My parents."
      ]
    ]
  },
  {
    "sourceActivity": "u5l0",
    "unit": 5,
    "communicativeGoal": "Identify a personal object, describe it and say where it is",
    "models": [
      [
        "u5l0-q1",
        "Spain vocabulary",
        "Mi móvil está aquí.",
        "My mobile phone is here."
      ],
      [
        "u5l0-q2",
        "Adjective order",
        "Es un libro rojo.",
        "It is a red book."
      ],
      [
        "u5l0-q3",
        "Adjective order",
        "Un libro rojo.",
        "A red book."
      ],
      [
        "u5l0-q4",
        "Gender agreement",
        "Una carpeta.",
        "A folder."
      ]
    ]
  },
  {
    "sourceActivity": "u6l0",
    "unit": 6,
    "communicativeGoal": "Ask where a place is and follow a simple direction to get there",
    "models": [
      [
        "u6l0-q1",
        "Ser or estar",
        "¿Dónde está la estación?",
        "Where is the station?"
      ],
      [
        "u6l0-q2",
        "Ser or estar",
        "¿Dónde está la farmacia?",
        "Where is the pharmacy?"
      ],
      [
        "u6l0-q3",
        "Ser or estar",
        "¿Dónde está la estación?",
        "Where is the station?"
      ],
      [
        "u6l0-q4",
        "Directions",
        "La farmacia está cerca.",
        "The pharmacy is nearby."
      ]
    ]
  },
  {
    "sourceActivity": "u7l0",
    "unit": 7,
    "communicativeGoal": "Say when a daily activity happens and agree a simple meeting time",
    "models": [
      [
        "u7l0-q1",
        "Telling the time",
        "Es la una.",
        "It is one o’clock."
      ],
      [
        "u7l0-q2",
        "Telling the time",
        "Son las dos.",
        "It is two o’clock."
      ],
      [
        "u7l0-q3",
        "Telling the time",
        "Es la una.",
        "It is one o’clock."
      ],
      [
        "u7l0-q4",
        "Telling the time",
        "Son las dos y media.",
        "It is half past two."
      ]
    ]
  }
];
const introductions=introductionUnits.flatMap(u=>u.models.map(([sourceQuestionId,topic,canonicalSpanish,englishSupport])=>({id:'linguistic-intro-'+sourceQuestionId,stage:'A1.1',unit:u.unit,topic,grammarConcept:null,communicativeGoal:u.communicativeGoal,canonicalSpanish,englishSupport,naturalAlternatives:[],prerequisites:[],dictionaryLemmas:[],spainPreferredForm:canonicalSpanish,regionalAlternatives:[],eligiblePracticeModes:[],storyReferences:[],sourceActivity:u.sourceActivity,sourceQuestionId,intendedTask:'Meaning-first support during course introduction; hidden in retrieval practice.',editorialStatus:'v1.8 internal review; independent native/educator review pending'})));
// A view over live questions, not a second authored copy of the course.
function course(C){return C.lessons.flatMap(l=>l.questions.map(q=>({id:q.id,stage:l.stage,unit:l.unit,topic:q.topic,sourceActivity:l.id,sourceQuestionId:q.sourceQuestionId||q.id,canonicalSpanish:q.spanish||(['tiles','cloze','speaking'].includes(q.type)||q.language==='es'?q.answer:q.teachingModel?.spanish)||null,englishSupport:q.englishHint||null,prerequisites:[],question:q})));}
root.LinguisticContent={schemaVersion:1,starters,introductions,course};if(typeof module!=='undefined')module.exports=root.LinguisticContent;
})(typeof window==='undefined'?globalThis:window);
