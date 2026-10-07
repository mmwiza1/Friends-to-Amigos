(function(root){
'use strict';
// All scenarios, questions and explanations are original Friends to Amigos material.
const units=[
 {
  "id": "a21-0",
  "title": "This week so far",
  "goal": "Share a recent experience and ask what a friend has done",
  "phrases": [
   [
    "He visitado…",
    "I have visited…"
   ],
   [
    "¿Has comido?",
    "Have you eaten?"
   ],
   [
    "Hemos hecho…",
    "We have done…"
   ],
   [
    "Esta semana",
    "This week"
   ],
   [
    "Todavía no",
    "Not yet"
   ]
  ],
  "core": [
   [
    "He visitado el museo",
    "I have visited the museum",
    [
     "Soy visitado el museo",
     "He visitar el museo"
    ],
    "Use he + visitado. Regular -AR participles end in -ado; haber changes with the person.",
    "Ana: «¿Has visitado el museo?» You have.",
    "Sí, he visitado el museo",
    [
     "Sí, soy visitado el museo",
     "No, todavía no"
    ],
    "Say you have visited the park today, using hoy.",
    "Hoy he visitado el parque",
    [
     "He visitado el parque hoy"
    ]
   ],
   [
    "Hemos comido en casa",
    "We have eaten at home",
    [
     "Hemos comer en casa",
     "Han comido en casa"
    ],
    "Use hemos for we. Regular -ER/-IR participles end in -ido; comido stays unchanged.",
    "Luis asks whether you and Marta have eaten. Say not yet.",
    "No, todavía no hemos comido",
    [
     "Sí, hemos comido",
     "No, todavía no he comido"
    ],
    "Ask one friend whether they have eaten today.",
    "¿Has comido hoy?",
    [
     "¿Hoy has comido?"
    ]
   ],
   [
    "He hecho la compra",
    "I have done the shopping",
    [
     "He hacido la compra",
     "He hacer la compra"
    ],
    "Hacer has the irregular participle hecho. Use he/has/ha/hemos/habéis/han + hecho.",
    "Marta: «¿Qué has hecho hoy?» You have shopped.",
    "He hecho la compra",
    [
     "Voy a hacer la compra mañana",
     "Hago la compra los lunes"
    ],
    "Say you have shopped and then eaten at home. Use después.",
    "He hecho la compra y después he comido en casa",
    [
     "He hecho la compra. Después he comido en casa."
    ]
   ]
  ],
  "writing": [
   [
    "Tell Luis you have visited the museum this week.",
    "Esta semana he visitado el museo",
    [
     "He visitado el museo esta semana"
    ],
    "Use he + participle with this week, an open recent period."
   ],
   [
    "Ask a group of friends in Spain whether they have eaten.",
    "¿Habéis comido?",
    [
     "¿Vosotros habéis comido?"
    ],
    "Habéis addresses an informal group in Spain. The participle stays comido."
   ],
   [
    "Say Ana has done the shopping today.",
    "Ana ha hecho la compra hoy",
    [
     "Hoy Ana ha hecho la compra"
    ],
    "Ana takes ha. Hecho is irregular; it does not agree with Ana."
   ],
   [
    "Say you have not yet visited the museum.",
    "Todavía no he visitado el museo",
    [
     "No he visitado el museo todavía"
    ],
    "No goes before he; todavía adds not yet."
   ],
   [
    "Tell Marta you have eaten at home because you are tired (Ana).",
    "He comido en casa porque estoy cansada",
    [
     "Estoy cansada, por eso he comido en casa"
    ],
    "Keep the completed meal in he comido and the current state in estoy cansada."
   ]
  ],
  "stories": [
   {
    "title": "A message before lunch",
    "text": "Es viernes. Ana escribe a Luis: «Esta semana he visitado el museo. Hoy he hecho la compra, pero todavía no he comido. ¿Has comido tú?». Luis responde: «Sí, he comido en casa. Marta todavía no ha comido. Podéis ir al café juntos». Ana llama a Marta. El café está cerca del museo y las dos tienen hambre.",
    "glossary": [
     [
      "esta semana",
      "this week"
     ],
     [
      "todavía",
      "still; yet"
     ],
     [
      "podéis",
      "you (plural, Spain) can"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Luis suggest the café for Ana and Marta?",
      "answer": "Neither has eaten",
      "options": [
       "Neither has eaten",
       "Both dislike the museum",
       "Luis needs shopping"
      ],
      "explanation": "Ana and Marta have not eaten; hunger supports the suggestion."
     },
     {
      "type": "text",
      "prompt": "Who has already eaten?",
      "answer": "Luis",
      "accepted": [
       "Luis",
       "Luis"
      ],
      "language": "en-or-es",
      "explanation": "Luis says sí, he comido."
     },
     {
      "type": "choice",
      "prompt": "What does todavía no he comido mean here?",
      "answer": "She has not eaten yet",
      "options": [
       "She has not eaten yet",
       "She never eats",
       "She will not eat"
      ],
      "explanation": "Todavía no refers to a task not completed yet."
     },
     {
      "type": "text",
      "prompt": "Where has Ana been this week?",
      "answer": "The museum",
      "accepted": [
       "The museum",
       "El museo",
       "Museum",
       "Museo"
      ],
      "language": "en-or-es",
      "explanation": "She says he visitado el museo."
     },
     {
      "type": "choice",
      "prompt": "What is Ana likely to ask Marta next?",
      "answer": "¿Vamos al café?",
      "options": [
       "¿Vamos al café?",
       "¿Cuánto cuesta tu móvil?",
       "¿Dónde está Inglaterra?"
      ],
      "explanation": "A café invitation follows the shared need for food."
     }
    ]
   },
   {
    "title": "The group chat",
    "text": "Luis escribe al grupo: «¿Habéis visitado el museo esta semana?». Marta contesta: «Sí, he visitado el museo con Ana. Hemos comido en el café de Diego después». Luis todavía no ha visitado el museo. Hoy tiene tiempo, pero Ana trabaja. Marta dice: «Yo estoy libre. Podemos ir juntos». Luis acepta y propone quedar a las cuatro delante del museo.",
    "glossary": [
     [
      "grupo",
      "group"
     ],
     [
      "contesta",
      "replies"
     ],
     [
      "propone",
      "suggests"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why can Marta go with Luis?",
      "answer": "She is free today",
      "options": [
       "She is free today",
       "Ana is free today",
       "The café is closed"
      ],
      "explanation": "Marta explicitly says estoy libre."
     },
     {
      "type": "text",
      "prompt": "When do they plan to meet?",
      "answer": "At four",
      "accepted": [
       "At four",
       "A las cuatro",
       "Four",
       "Las cuatro"
      ],
      "language": "en-or-es",
      "explanation": "Luis proposes that time."
     },
     {
      "type": "choice",
      "prompt": "Who has not visited yet?",
      "answer": "Luis",
      "options": [
       "Luis",
       "Ana",
       "Marta"
      ],
      "explanation": "The text says Luis todavía no ha visitado."
     },
     {
      "type": "text",
      "prompt": "Who ate together after the earlier visit?",
      "answer": "Ana and Marta",
      "accepted": [
       "Ana and Marta",
       "Ana y Marta",
       "Marta and Ana",
       "Marta y Ana"
      ],
      "language": "en-or-es",
      "explanation": "Marta describes the visit with Ana and says hemos comido."
     },
     {
      "type": "choice",
      "prompt": "Choose a fitting reply to Luis’s plan.",
      "answer": "Sí, a las cuatro delante del museo",
      "options": [
       "Sí, a las cuatro delante del museo",
       "No, he comido en casa",
       "La talla mediana"
      ],
      "explanation": "Confirm both time and place."
     }
    ]
   },
   {
    "title": "Dinner at home",
    "text": "Ana invita a Marta a cenar. «He hecho la compra y tengo pan, queso y fruta», dice. Marta responde: «Perfecto. Hoy hemos comido tarde en el trabajo, pero ahora tengo hambre». Ana no ha preparado la cena todavía. Las dos van a preparar algo sencillo en la cocina. Después quieren escuchar música en el salón. Luis no puede venir porque tiene que trabajar.",
    "glossary": [
     [
      "cenar",
      "have dinner"
     ],
     [
      "queso",
      "cheese"
     ],
     [
      "preparado",
      "prepared"
     ],
     [
      "sencillo",
      "simple"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why will Luis miss dinner?",
      "answer": "He has to work",
      "options": [
       "He has to work",
       "He has eaten all the food",
       "He dislikes music"
      ],
      "explanation": "Porque gives his reason."
     },
     {
      "type": "text",
      "prompt": "What has Ana already done?",
      "answer": "The shopping",
      "accepted": [
       "The shopping",
       "La compra",
       "Shopping",
       "Ha hecho la compra"
      ],
      "language": "en-or-es",
      "explanation": "He hecho la compra is completed; the dinner is not ready."
     },
     {
      "type": "choice",
      "prompt": "What still needs doing?",
      "answer": "Preparing dinner",
      "options": [
       "Preparing dinner",
       "Buying bread",
       "Inviting Luis again"
      ],
      "explanation": "No ha preparado la cena todavía."
     },
     {
      "type": "text",
      "prompt": "Where will they listen to music?",
      "answer": "In the living room",
      "accepted": [
       "In the living room",
       "En el salón",
       "Living room",
       "El salón"
      ],
      "language": "en-or-es",
      "explanation": "Después introduces their next activity."
     },
     {
      "type": "choice",
      "prompt": "What could Marta say to help?",
      "answer": "Vamos a preparar la cena juntas",
      "options": [
       "Vamos a preparar la cena juntas",
       "He visitado el museo",
       "¿Qué talla necesitas?"
      ],
      "explanation": "Preparing together fits their immediate situation."
     }
    ]
   },
   {
    "title": "A useful update",
    "text": "Diego pregunta a Ana: «¿Qué habéis hecho hoy?». Ana responde: «Marta y yo hemos visitado el parque y hemos comido aquí. Luis ha hecho la compra para la cena. Todavía no hemos comprado agua». Diego tiene agua en el café. Ana pide dos botellas y paga con tarjeta. Después manda un mensaje a Luis: «Ya tenemos agua. Nos vemos en casa a las ocho».",
    "glossary": [
     [
      "ya",
      "already; now"
     ],
     [
      "botellas",
      "bottles"
     ],
     [
      "manda",
      "sends"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Which task was missing before the café purchase?",
      "answer": "Buying water",
      "options": [
       "Buying water",
       "Visiting the park",
       "Shopping for dinner"
      ],
      "explanation": "Todavía no hemos comprado agua names the missing task."
     },
     {
      "type": "text",
      "prompt": "Who shopped for dinner?",
      "answer": "Luis",
      "accepted": [
       "Luis",
       "Luis"
      ],
      "language": "en-or-es",
      "explanation": "Luis ha hecho la compra."
     },
     {
      "type": "choice",
      "prompt": "What does ya tenemos agua announce?",
      "answer": "The water problem is solved",
      "options": [
       "The water problem is solved",
       "They are thirsty again",
       "The café has no water"
      ],
      "explanation": "Ya here tells Luis they now have water."
     },
     {
      "type": "text",
      "prompt": "What time will they meet at home?",
      "answer": "At eight",
      "accepted": [
       "At eight",
       "A las ocho",
       "Eight",
       "Las ocho"
      ],
      "language": "en-or-es",
      "explanation": "The final message gives the time."
     },
     {
      "type": "choice",
      "prompt": "Who does hemos refer to in Ana’s first reply?",
      "answer": "Ana and Marta",
      "options": [
       "Ana and Marta",
       "Diego and Luis",
       "Only Ana"
      ],
      "explanation": "Marta y yo explicitly identifies the pair."
     }
    ]
   }
  ],
  "grammar": [
   "present-perfect",
   "regular-participles",
   "irregular-hecho"
  ]
 },
 {
  "id": "a21-1",
  "title": "Last weekend",
  "goal": "Describe a finished weekend using a few clear past events",
  "phrases": [
   [
    "Ayer",
    "Yesterday"
   ],
   [
    "El sábado pasado",
    "Last Saturday"
   ],
   [
    "Visité…",
    "I visited…"
   ],
   [
    "Fui a…",
    "I went to…"
   ],
   [
    "Hice…",
    "I did…"
   ]
  ],
  "core": [
   [
    "Ayer visité el museo",
    "Yesterday I visited the museum",
    [
     "Ayer visito el museo",
     "Ayer visitar el museo"
    ],
    "Ayer is a finished time. Regular -AR preterite endings: -é, -aste, -ó, -amos, -asteis, -aron.",
    "Luis: «¿Qué hiciste ayer?» You visited the park.",
    "Visité el parque",
    [
     "Visito el parque todos los días",
     "Voy a visitar el parque mañana"
    ],
    "Say Ana visited the museum yesterday.",
    "Ana visitó el museo ayer",
    [
     "Ayer Ana visitó el museo"
    ]
   ],
   [
    "Fui a Toledo el sábado pasado",
    "I went to Toledo last Saturday",
    [
     "Voy a Toledo el sábado pasado",
     "Fui en Toledo el sábado pasado"
    ],
    "Fui is the completed-event past of ir. Use a for the destination; fui/fuiste/fue/fuimos/fuisteis/fueron.",
    "Marta: «¿Fuisteis al museo?» You and Luis went together.",
    "Sí, fuimos al museo",
    [
     "Sí, fui al museo",
     "Sí, vamos al museo"
    ],
    "Say you went to Toledo and afterwards visited the museum.",
    "Fui a Toledo y después visité el museo",
    [
     "Fui a Toledo. Después visité el museo."
    ]
   ],
   [
    "Hice la compra ayer",
    "I did the shopping yesterday",
    [
     "Hacido la compra ayer",
     "Hago la compra ayer"
    ],
    "Hice is a complete past verb, not a participle: hice/hiciste/hizo/hicimos/hicisteis/hicieron.",
    "Ana: «¿Qué hizo Luis ayer?» He did the shopping.",
    "Hizo la compra",
    [
     "He hecho la compra",
     "Hace la compra mañana"
    ],
    "Say you did the shopping for dinner.",
    "Hice la compra para la cena",
    [
     "Ayer hice la compra para la cena"
    ]
   ]
  ],
  "writing": [
   [
    "Say you visited the park last Sunday.",
    "Visité el parque el domingo pasado",
    [
     "El domingo pasado visité el parque"
    ],
    "A finished day uses visité here."
   ],
   [
    "Ask one friend whether they went to Toledo yesterday.",
    "¿Fuiste a Toledo ayer?",
    [
     "¿Ayer fuiste a Toledo?"
    ],
    "Fuiste addresses tú."
   ],
   [
    "Say you and Luis went to the museum.",
    "Luis y yo fuimos al museo",
    [
     "Fuimos al museo, Luis y yo"
    ],
    "A group including yourself takes fuimos."
   ],
   [
    "Say Marta did the shopping yesterday.",
    "Marta hizo la compra ayer",
    [
     "Ayer Marta hizo la compra"
    ],
    "Hacer has hizo for él/ella, not hico."
   ],
   [
    "Say you visited the museum and then went to the café.",
    "Visité el museo y después fui al café",
    [
     "Visité el museo. Después fui al café."
    ],
    "Keep both events in the completed-event past."
   ]
  ],
  "stories": [
   {
    "title": "The Saturday plan worked",
    "text": "El sábado pasado Ana y Luis fueron a Toledo. Ana visitó un museo por la mañana. Luis fue al centro y después los dos fueron a un café. «Hice la compra el viernes, pero hoy quiero comer aquí», dijo Ana. Luis pidió agua y Ana pidió un café. Después visitaron el parque. Por la tarde volvieron a Madrid. Hoy Ana manda las fotos a Marta.",
    "glossary": [
     [
      "fueron",
      "they went"
     ],
     [
      "pidió",
      "ordered"
     ],
     [
      "volvieron",
      "returned"
     ],
     [
      "fotos",
      "photos"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Which event came first on Saturday?",
      "answer": "Ana’s museum visit",
      "options": [
       "Ana’s museum visit",
       "The afternoon return",
       "Sending photos today"
      ],
      "explanation": "Por la mañana places the museum before the afternoon return."
     },
     {
      "type": "text",
      "prompt": "Where did Ana and Luis travel?",
      "answer": "To Toledo",
      "accepted": [
       "To Toledo",
       "A Toledo",
       "Toledo"
      ],
      "language": "en-or-es",
      "explanation": "Fueron a Toledo gives the destination."
     },
     {
      "type": "choice",
      "prompt": "Why does Ana mention Friday?",
      "answer": "She shopped before the trip",
      "options": [
       "She shopped before the trip",
       "She went to Toledo on Friday",
       "She wants to leave now"
      ],
      "explanation": "Hice la compra el viernes refers to an earlier finished event."
     },
     {
      "type": "text",
      "prompt": "Who will see the photos?",
      "answer": "Marta",
      "accepted": [
       "Marta",
       "Marta"
      ],
      "language": "en-or-es",
      "explanation": "Ana manda las fotos a Marta."
     },
     {
      "type": "choice",
      "prompt": "Choose a supported summary.",
      "answer": "Fueron a Toledo y visitaron el parque",
      "options": [
       "Fueron a Toledo y visitaron el parque",
       "Han comprado ropa hoy",
       "Van a Toledo mañana"
      ],
      "explanation": "Both actions appear as completed Saturday events."
     }
    ]
   },
   {
    "title": "Two different days",
    "text": "Marta pregunta: «¿Qué has hecho hoy, Ana?». Ana contesta: «Hoy he hecho la compra. Ayer fui al parque con Luis y visité el café de Diego». Marta dice: «Yo también fui al parque ayer, pero por la tarde». Ana fue por la mañana. Las dos miran el móvil y deciden quedar el domingo. Esta vez quieren ir juntas y tomar un café después.",
    "glossary": [
     [
      "esta vez",
      "this time"
     ],
     [
      "deciden",
      "decide"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why did the friends not meet in the park yesterday?",
      "answer": "They went at different times",
      "options": [
       "They went at different times",
       "They visited different cities",
       "Ana was at home all day"
      ],
      "explanation": "Morning and afternoon are explicitly different."
     },
     {
      "type": "text",
      "prompt": "What did Ana do today?",
      "answer": "The shopping",
      "accepted": [
       "The shopping",
       "La compra",
       "Shopping",
       "Ha hecho la compra"
      ],
      "language": "en-or-es",
      "explanation": "Hoy he hecho la compra names today’s task."
     },
     {
      "type": "choice",
      "prompt": "Which expression names the finished previous day?",
      "answer": "Ayer",
      "options": [
       "Ayer",
       "Hoy",
       "Esta vez"
      ],
      "explanation": "Ayer is yesterday."
     },
     {
      "type": "text",
      "prompt": "When do they want to meet next?",
      "answer": "On Sunday",
      "accepted": [
       "On Sunday",
       "El domingo",
       "Sunday",
       "Domingo"
      ],
      "language": "en-or-es",
      "explanation": "Deciden quedar el domingo."
     },
     {
      "type": "choice",
      "prompt": "Which reply keeps today and yesterday distinct?",
      "answer": "Hoy he hecho la compra; ayer fui al parque",
      "options": [
       "Hoy he hecho la compra; ayer fui al parque",
       "Hoy fui mañana al parque",
       "Ayer voy al parque"
      ],
      "explanation": "The first option matches both time references."
     }
    ]
   },
   {
    "title": "A missing friend",
    "text": "Luis dice: «Ayer fuimos al museo: Ana, Diego y yo». Marta pregunta: «¿Y después?». Luis responde: «Visitamos el parque, pero Diego fue al trabajo. Ana y yo fuimos al café». Marta no pudo ir porque trabajó todo el día. Hoy está libre. Luis propone repetir la visita con ella el sábado. Marta acepta, pero prefiere quedar por la mañana.",
    "glossary": [
     [
      "no pudo",
      "could not"
     ],
     [
      "trabajó",
      "worked"
     ],
     [
      "repetir",
      "repeat"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Who left the outing to work?",
      "answer": "Diego",
      "options": [
       "Diego",
       "Ana",
       "Luis"
      ],
      "explanation": "Diego fue al trabajo after the park."
     },
     {
      "type": "text",
      "prompt": "Who went to the café with Luis?",
      "answer": "Ana",
      "accepted": [
       "Ana",
       "Ana"
      ],
      "language": "en-or-es",
      "explanation": "Ana y yo identifies the café pair."
     },
     {
      "type": "choice",
      "prompt": "Why is another visit suggested?",
      "answer": "Marta missed the first outing",
      "options": [
       "Marta missed the first outing",
       "The museum never opened",
       "Ana lost her ticket"
      ],
      "explanation": "Marta worked all day; repeating lets her join."
     },
     {
      "type": "text",
      "prompt": "When does Marta prefer to meet?",
      "answer": "In the morning",
      "accepted": [
       "In the morning",
       "Por la mañana",
       "Morning",
       "La mañana"
      ],
      "language": "en-or-es",
      "explanation": "She prefers quedar por la mañana."
     },
     {
      "type": "choice",
      "prompt": "Choose Marta’s fitting response.",
      "answer": "Sí, el sábado por la mañana",
      "options": [
       "Sí, el sábado por la mañana",
       "No, ya tengo agua",
       "¿Cuánto cuesta la camisa?"
      ],
      "explanation": "Confirming day and time fits the invitation."
     }
    ]
   },
   {
    "title": "A short weekend message",
    "text": "Ana escribe a su familia: «El sábado pasado fui a Toledo con Luis. Visitamos un museo y después fuimos al parque. Hice muchas fotos. El domingo hice la compra y fui al café de Diego. Esta semana he trabajado mucho, pero hoy estoy libre. Voy a leer en casa». Su familia responde: «¡Qué bien! ¿Tienes fotos del museo?». Ana envía una foto y escribe el nombre del museo.",
    "glossary": [
     [
      "muchas",
      "many"
     ],
     [
      "envía",
      "sends"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Which part describes a future intention?",
      "answer": "Voy a leer en casa",
      "options": [
       "Voy a leer en casa",
       "Fui a Toledo",
       "Hice muchas fotos"
      ],
      "explanation": "Voy a + infinitive is the intention."
     },
     {
      "type": "text",
      "prompt": "What did Ana do after the museum?",
      "answer": "Went to the park",
      "accepted": [
       "Went to the park",
       "Fue al parque",
       "The park",
       "Al parque"
      ],
      "language": "en-or-es",
      "explanation": "Después orders the museum and park events."
     },
     {
      "type": "choice",
      "prompt": "Why does her family ask for a photo?",
      "answer": "She mentioned taking many photos",
      "options": [
       "She mentioned taking many photos",
       "They need directions home",
       "They want her shopping list"
      ],
      "explanation": "The request follows hice muchas fotos."
     },
     {
      "type": "text",
      "prompt": "Who travelled with Ana?",
      "answer": "Luis",
      "accepted": [
       "Luis",
       "Luis"
      ],
      "language": "en-or-es",
      "explanation": "Con Luis identifies the companion."
     },
     {
      "type": "choice",
      "prompt": "Which statement refers to this week so far?",
      "answer": "He trabajado mucho",
      "options": [
       "He trabajado mucho",
       "Fui a Toledo",
       "El domingo hice la compra"
      ],
      "explanation": "Esta semana provides the open period for he trabajado."
     }
    ]
   }
  ],
  "grammar": [
   "preterite-ar",
   "preterite-ir",
   "preterite-hacer",
   "finished-vs-open-time"
  ]
 },
 {
  "id": "a21-2",
  "title": "Choosing the journey",
  "goal": "Compare transport options and buy a suitable ticket",
  "phrases": [
   [
    "Más barato que…",
    "Cheaper than…"
   ],
   [
    "Tan rápido como…",
    "As fast as…"
   ],
   [
    "Un billete de ida y vuelta",
    "A return ticket"
   ],
   [
    "¿A qué hora sale?",
    "What time does it leave?"
   ],
   [
    "Tarda…",
    "It takes…"
   ]
  ],
  "core": [
   [
    "El autobús es más barato que el tren",
    "The bus is cheaper than the train",
    [
     "El autobús es más barato de el tren",
     "El autobús está más barato que el tren"
    ],
    "Compare two options with más + adjective + que. Use ser to describe the option.",
    "Two tickets cost 12 and 20 euros. Which is cheaper?",
    "El de doce euros",
    [
     "El de veinte euros",
     "Los dos cuestan lo mismo"
    ],
    "Say the train is faster than the bus.",
    "El tren es más rápido que el autobús",
    []
   ],
   [
    "El tren no es tan barato como el autobús",
    "The train is not as cheap as the bus",
    [
     "El tren no es tan barato que el autobús",
     "El tren es no tan barato como el autobús"
    ],
    "Equal comparison uses tan + adjective + como. No goes before es.",
    "The train takes one hour and the bus two. Which is faster?",
    "El tren",
    [
     "El autobús",
     "Los dos tardan lo mismo"
    ],
    "Say the bus is not as fast as the train.",
    "El autobús no es tan rápido como el tren",
    []
   ],
   [
    "Quiero un billete de ida y vuelta",
    "I would like a return ticket",
    [
     "Quiero un billete de ida y vuelve",
     "Quiero una billete de ida y vuelta"
    ],
    "Billete is masculine. Ida y vuelta includes both journeys.",
    "Taquilla: «¿Solo ida o ida y vuelta?» You need to return.",
    "Ida y vuelta, por favor",
    [
     "Solo ida, por favor",
     "La habitación doble"
    ],
    "Ask what time the train leaves tomorrow.",
    "¿A qué hora sale el tren mañana?",
    [
     "¿Mañana a qué hora sale el tren?"
    ]
   ]
  ],
  "writing": [
   [
    "Compare prices: the bus is cheaper than the train.",
    "El autobús es más barato que el tren",
    [],
    "Más … que links the two options."
   ],
   [
    "Say the train is less comfortable than the bus.",
    "El tren es menos cómodo que el autobús",
    [],
    "Menos … que expresses less, rather than more."
   ],
   [
    "Say both trains are equally fast using tan… como.",
    "Este tren es tan rápido como el otro",
    [
     "El tren es tan rápido como el otro"
    ],
    "Tan … como expresses equality."
   ],
   [
    "Ask for a return ticket to Toledo politely.",
    "Un billete de ida y vuelta a Toledo, por favor",
    [
     "Quiero un billete de ida y vuelta a Toledo, por favor"
    ],
    "Specify the ticket type and destination."
   ],
   [
    "Choose the train because it is faster. Use prefiero and porque.",
    "Prefiero el tren porque es más rápido",
    [
     "Prefiero ir en tren porque es más rápido"
    ],
    "Porque gives the reason for your choice."
   ]
  ],
  "stories": [
   {
    "title": "Price or time?",
    "text": "Ana y Marta quieren ir a Toledo mañana. El tren cuesta veinte euros y tarda una hora. El autobús cuesta doce euros y tarda dos horas. Ana tiene poco tiempo y prefiere el tren. Marta dice: «El autobús es más barato, pero el tren es más rápido». Deciden ir en tren y comprar billetes de ida y vuelta porque van a volver a Madrid por la tarde.",
    "glossary": [
     [
      "tarda",
      "takes (time)"
     ],
     [
      "poco tiempo",
      "little time"
     ],
     [
      "billetes",
      "tickets"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why do they choose the train?",
      "answer": "They want the faster journey",
      "options": [
       "They want the faster journey",
       "It is cheaper",
       "They will not return"
      ],
      "explanation": "Ana has little time and the train is faster."
     },
     {
      "type": "text",
      "prompt": "How much does the bus cost?",
      "answer": "Twelve euros",
      "accepted": [
       "Twelve euros",
       "Doce euros",
       "12 euros"
      ],
      "language": "en-or-es",
      "explanation": "The bus price is twelve euros."
     },
     {
      "type": "choice",
      "prompt": "Which comparison is supported?",
      "answer": "El tren es más rápido que el autobús",
      "options": [
       "El tren es más rápido que el autobús",
       "El tren es más barato",
       "El autobús tarda una hora"
      ],
      "explanation": "One hour is shorter than two."
     },
     {
      "type": "text",
      "prompt": "When will they return?",
      "answer": "In the afternoon",
      "accepted": [
       "In the afternoon",
       "Por la tarde",
       "Afternoon",
       "La tarde"
      ],
      "language": "en-or-es",
      "explanation": "They plan to return por la tarde."
     },
     {
      "type": "choice",
      "prompt": "Which ticket meets the plan?",
      "answer": "Ida y vuelta",
      "options": [
       "Ida y vuelta",
       "Solo ida",
       "Una entrada al museo"
      ],
      "explanation": "They need an outward and return journey."
     }
    ]
   },
   {
    "title": "At the ticket desk",
    "text": "Luis está en la estación. Pide un billete de ida y vuelta a Toledo. La persona de la taquilla pregunta: «¿Para hoy o para mañana?». Luis responde: «Para mañana. ¿A qué hora sale el primer tren?». El primer tren sale a las ocho y el siguiente a las nueve. Luis queda con Ana a las ocho y media, así que compra el billete para las nueve.",
    "glossary": [
     [
      "estación",
      "station"
     ],
     [
      "taquilla",
      "ticket desk"
     ],
     [
      "siguiente",
      "next"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Luis choose the nine o’clock train?",
      "answer": "He meets Ana at half past eight",
      "options": [
       "He meets Ana at half past eight",
       "It costs less",
       "The first train is full"
      ],
      "explanation": "The earlier train leaves before the meeting."
     },
     {
      "type": "text",
      "prompt": "What destination does he request?",
      "answer": "Toledo",
      "accepted": [
       "Toledo",
       "Toledo"
      ],
      "language": "en-or-es",
      "explanation": "A Toledo gives the destination."
     },
     {
      "type": "choice",
      "prompt": "What does para mañana specify?",
      "answer": "The travel day",
      "options": [
       "The travel day",
       "The return price",
       "The platform"
      ],
      "explanation": "The clerk asks whether the ticket is for today or tomorrow."
     },
     {
      "type": "text",
      "prompt": "When does the first train leave?",
      "answer": "At eight",
      "accepted": [
       "At eight",
       "A las ocho",
       "Eight",
       "Las ocho"
      ],
      "language": "en-or-es",
      "explanation": "El primer tren sale a las ocho."
     },
     {
      "type": "choice",
      "prompt": "What should Luis tell Ana?",
      "answer": "El tren sale a las nueve",
      "options": [
       "El tren sale a las nueve",
       "El tren sale ayer",
       "He visitado el museo"
      ],
      "explanation": "He should share the chosen departure time."
     }
    ]
   },
   {
    "title": "Two useful options",
    "text": "Marta compara dos autobuses. Uno sale a las diez y llega a las doce. El otro sale a las once y llega a las doce y media. El segundo es más rápido, pero cuesta más. Marta no tiene prisa y quiere gastar menos. Compra el billete del primero. Antes de salir manda a Luis un mensaje: «Llego a las doce. ¿Podemos comer juntos cerca de la estación?».",
    "glossary": [
     [
      "llega",
      "arrives"
     ],
     [
      "prisa",
      "hurry"
     ],
     [
      "gastar",
      "spend"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Marta choose the first bus?",
      "answer": "She wants to spend less",
      "options": [
       "She wants to spend less",
       "It is faster",
       "It leaves at eleven"
      ],
      "explanation": "She has no hurry and wants to spend less."
     },
     {
      "type": "text",
      "prompt": "What time will she arrive?",
      "answer": "At twelve",
      "accepted": [
       "At twelve",
       "A las doce",
       "Twelve",
       "Las doce"
      ],
      "language": "en-or-es",
      "explanation": "Her message confirms noon."
     },
     {
      "type": "choice",
      "prompt": "Which bus is faster?",
      "answer": "The second",
      "options": [
       "The second",
       "The first",
       "Both are equally fast"
      ],
      "explanation": "Ninety minutes is less than two hours."
     },
     {
      "type": "text",
      "prompt": "Where does she suggest eating?",
      "answer": "Near the station",
      "accepted": [
       "Near the station",
       "Cerca de la estación",
       "The station",
       "La estación"
      ],
      "language": "en-or-es",
      "explanation": "Cerca de locates the proposed meal."
     },
     {
      "type": "choice",
      "prompt": "Which reply would accept the lunch?",
      "answer": "Sí, nos vemos a las doce",
      "options": [
       "Sí, nos vemos a las doce",
       "No, es más caro que el tren",
       "Una talla grande"
      ],
      "explanation": "The first response confirms the shared plan."
     }
    ]
   },
   {
    "title": "The return matters",
    "text": "Ana compra un billete de ida a Toledo. Después recuerda que también quiere volver hoy. Pregunta en la taquilla: «¿Puedo comprar la vuelta ahora?». El último tren sale a las ocho. Ana necesita llegar a Madrid antes de las diez. El viaje tarda una hora, así que el tren de las ocho le sirve. Compra la vuelta y escribe la hora en el móvil.",
    "glossary": [
     [
      "recuerda",
      "remembers"
     ],
     [
      "último",
      "last"
     ],
     [
      "le sirve",
      "works for her"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "What was missing from her first purchase?",
      "answer": "The return journey",
      "options": [
       "The return journey",
       "A seat for Luis",
       "A hotel room"
      ],
      "explanation": "Solo ida does not include the return."
     },
     {
      "type": "text",
      "prompt": "When does the last train leave?",
      "answer": "At eight",
      "accepted": [
       "At eight",
       "A las ocho",
       "Eight",
       "Las ocho"
      ],
      "language": "en-or-es",
      "explanation": "El último tren sale a las ocho."
     },
     {
      "type": "choice",
      "prompt": "Why is that train suitable?",
      "answer": "She can arrive before ten",
      "options": [
       "She can arrive before ten",
       "It takes three hours",
       "She does not need to return"
      ],
      "explanation": "An hour from eight means arrival at nine."
     },
     {
      "type": "text",
      "prompt": "Where does she record the time?",
      "answer": "On her phone",
      "accepted": [
       "On her phone",
       "En el móvil",
       "Phone",
       "El móvil"
      ],
      "language": "en-or-es",
      "explanation": "She writes it in her mobile."
     },
     {
      "type": "choice",
      "prompt": "Which question solves her problem?",
      "answer": "¿Puedo comprar la vuelta ahora?",
      "options": [
       "¿Puedo comprar la vuelta ahora?",
       "¿Has comido hoy?",
       "¿Qué talla necesitas?"
      ],
      "explanation": "She needs the additional return ticket."
     }
    ]
   }
  ],
  "grammar": [
   "comparisons",
   "transport",
   "ticket-requests"
  ]
 },
 {
  "id": "a21-3",
  "title": "Booking a place to stay",
  "goal": "Ask about a room and confirm a simple accommodation booking",
  "phrases": [
   [
    "Quiero reservar…",
    "I would like to book…"
   ],
   [
    "Una habitación doble",
    "A double room"
   ],
   [
    "Para dos noches",
    "For two nights"
   ],
   [
    "¿Está incluido?",
    "Is it included?"
   ],
   [
    "Tengo una reserva",
    "I have a booking"
   ]
  ],
  "core": [
   [
    "Quiero reservar una habitación doble",
    "I would like to book a double room",
    [
     "Quiero reserva una habitación doble",
     "Quiero reservar un habitación doble"
    ],
    "Quiero takes an infinitive. Habitación is feminine: una habitación doble.",
    "Hotel: «¿Individual o doble?» Two people will share.",
    "Una habitación doble",
    [
     "Una habitación individual",
     "Un billete de ida"
    ],
    "Book a single room for two nights.",
    "Quiero reservar una habitación individual para dos noches",
    []
   ],
   [
    "¿El desayuno está incluido?",
    "Is breakfast included?",
    [
     "¿El desayuno es incluye?",
     "¿El desayuno está incluir?"
    ],
    "Está incluido asks whether breakfast is part of the price.",
    "Hotel: «Son sesenta euros por noche con desayuno». What is included?",
    "El desayuno",
    [
     "La vuelta en tren",
     "La comida y la cena"
    ],
    "Ask whether wifi is included.",
    "¿El wifi está incluido?",
    []
   ],
   [
    "Necesito una habitación para dos personas",
    "I need a room for two people",
    [
     "Necesito una habitación por dos personas",
     "Necesito una habitación para dos persona"
    ],
    "Para gives the intended guests; dos requires plural personas.",
    "Hotel: «¿Cuántas noches?» You need two.",
    "Dos noches, por favor",
    [
     "Dos personas, por favor",
     "A las dos"
    ],
    "Confirm a double room for Friday, for two nights.",
    "Una habitación doble para el viernes, para dos noches",
    [
     "Quiero una habitación doble para el viernes, para dos noches"
    ]
   ]
  ],
  "writing": [
   [
    "Ask to book a double room for tomorrow.",
    "Quiero reservar una habitación doble para mañana",
    [],
    "Quiero reservar states the request and para mañana gives the day."
   ],
   [
    "Ask the nightly price.",
    "¿Cuánto cuesta por noche?",
    [
     "¿Cuánto cuesta la habitación por noche?"
    ],
    "Por noche means per night, not the total stay."
   ],
   [
    "Ask whether breakfast is included in the price.",
    "¿El desayuno está incluido en el precio?",
    [
     "¿Está incluido el desayuno en el precio?"
    ],
    "Use estar + incluido for what the booking includes."
   ],
   [
    "Say you need a room for two people and two nights.",
    "Necesito una habitación para dos personas y dos noches",
    [],
    "Keep people and nights distinct."
   ],
   [
    "Choose this hotel because it is cheaper and close to the station.",
    "Prefiero este hotel porque es más barato y está cerca de la estación",
    [],
    "Ser describes the price comparison; estar locates the hotel."
   ]
  ],
  "stories": [
   {
    "title": "A call to the hotel",
    "text": "Ana y Marta van a pasar dos noches en Toledo. Ana llama a un hotel y pide una habitación doble para el viernes. La habitación cuesta sesenta euros por noche. El desayuno está incluido, pero la cena no. Marta pregunta por la estación. El hotel está a diez minutos andando. Las dos prefieren este hotel porque pueden ir a pie desde el tren.",
    "glossary": [
     [
      "andando",
      "walking"
     ],
     [
      "a pie",
      "on foot"
     ],
     [
      "pasar",
      "spend (time)"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why do they prefer this hotel?",
      "answer": "They can walk from the station",
      "options": [
       "They can walk from the station",
       "Dinner is included",
       "It has a free train"
      ],
      "explanation": "The ten-minute walk makes arrival practical."
     },
     {
      "type": "text",
      "prompt": "How many nights will they stay?",
      "answer": "Two nights",
      "accepted": [
       "Two nights",
       "Dos noches",
       "Two",
       "Dos"
      ],
      "language": "en-or-es",
      "explanation": "The opening gives the length of the stay."
     },
     {
      "type": "choice",
      "prompt": "What does the room price include?",
      "answer": "Breakfast",
      "options": [
       "Breakfast",
       "Dinner",
       "Transport"
      ],
      "explanation": "El desayuno está incluido, pero la cena no."
     },
     {
      "type": "text",
      "prompt": "Which room type do they request?",
      "answer": "A double room",
      "accepted": [
       "A double room",
       "Una habitación doble",
       "Double room",
       "Habitación doble"
      ],
      "language": "en-or-es",
      "explanation": "Two friends request a double room."
     },
     {
      "type": "choice",
      "prompt": "What is the room cost for two nights?",
      "answer": "120 euros",
      "options": [
       "120 euros",
       "60 euros",
       "30 euros"
      ],
      "explanation": "Sixty per night times two nights is 120."
     }
    ]
   },
   {
    "title": "Checking the details",
    "text": "Luis quiere reservar una habitación individual. Escribe al hotel: «¿Tenéis una habitación para mañana? Necesito dos noches». El hotel responde: «Sí. Son cincuenta euros por noche. El wifi está incluido». Luis pregunta: «¿Y el desayuno?». Cuesta cinco euros más por día. Luis va a desayunar en el café de Diego, así que reserva la habitación sin desayuno.",
    "glossary": [
     [
      "sin",
      "without"
     ],
     [
      "más",
      "extra; more"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Luis book without breakfast?",
      "answer": "He will eat at Diego’s café",
      "options": [
       "He will eat at Diego’s café",
       "The hotel has no food",
       "He will not eat tomorrow"
      ],
      "explanation": "His existing café plan makes the extra unnecessary."
     },
     {
      "type": "text",
      "prompt": "What is included at no extra charge?",
      "answer": "Wifi",
      "accepted": [
       "Wifi",
       "El wifi",
       "Wi-fi",
       "Wifi"
      ],
      "language": "en-or-es",
      "explanation": "The reply says el wifi está incluido."
     },
     {
      "type": "choice",
      "prompt": "Who is the room intended for?",
      "answer": "Luis alone",
      "options": [
       "Luis alone",
       "Luis and Ana",
       "Three friends"
      ],
      "explanation": "Individual is a single room."
     },
     {
      "type": "text",
      "prompt": "How much extra is breakfast each day?",
      "answer": "Five euros",
      "accepted": [
       "Five euros",
       "Cinco euros",
       "5 euros"
      ],
      "language": "en-or-es",
      "explanation": "Five more per day is stated."
     },
     {
      "type": "choice",
      "prompt": "Which confirmation fits his choice?",
      "answer": "La habitación sin desayuno, por favor",
      "options": [
       "La habitación sin desayuno, por favor",
       "Una habitación doble con cena",
       "Dos billetes de vuelta"
      ],
      "explanation": "It confirms the single room without breakfast."
     }
    ]
   },
   {
    "title": "A cheaper room",
    "text": "Marta encuentra dos hoteles. El primero está cerca del centro y cuesta ochenta euros por noche. El segundo cuesta sesenta, pero está más lejos. Ana prefiere el segundo porque pueden ir al centro en autobús. Marta quiere una habitación tranquila. Llama al segundo hotel y pregunta si hay habitaciones lejos de la calle. El hotel confirma que sí, y Marta hace la reserva.",
    "glossary": [
     [
      "encuentra",
      "finds"
     ],
     [
      "tranquila",
      "quiet"
     ],
     [
      "lejos",
      "far"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "What concern does Marta check before booking?",
      "answer": "Whether the room is quiet",
      "options": [
       "Whether the room is quiet",
       "Whether the train is free",
       "Whether breakfast costs eighty euros"
      ],
      "explanation": "Rooms away from the street support her quiet-room request."
     },
     {
      "type": "text",
      "prompt": "Which hotel costs less?",
      "answer": "The second",
      "accepted": [
       "The second",
       "El segundo",
       "Second hotel",
       "El segundo hotel"
      ],
      "language": "en-or-es",
      "explanation": "Sixty is less than eighty."
     },
     {
      "type": "choice",
      "prompt": "Why does Ana accept the longer distance?",
      "answer": "They can take a bus",
      "options": [
       "They can take a bus",
       "They do not want to visit the centre",
       "The first hotel has no rooms"
      ],
      "explanation": "Bus travel makes the cheaper option workable."
     },
     {
      "type": "text",
      "prompt": "Where does Marta want the room?",
      "answer": "Away from the street",
      "accepted": [
       "Away from the street",
       "Lejos de la calle",
       "Far from the street"
      ],
      "language": "en-or-es",
      "explanation": "Her phone question specifies this."
     },
     {
      "type": "choice",
      "prompt": "What action follows the hotel’s reply?",
      "answer": "Marta books the room",
      "options": [
       "Marta books the room",
       "Ana cancels the train",
       "Luis buys breakfast"
      ],
      "explanation": "The text ends with Marta hace la reserva."
     }
    ]
   },
   {
    "title": "A booking message",
    "text": "El hotel manda a Ana un mensaje: «Su reserva es para el viernes y el sábado: una habitación doble, dos personas, dos noches. El precio total es ciento veinte euros. El desayuno está incluido. Puede llegar después de las dos». Ana comprueba el mensaje y se lo manda a Marta. Su tren llega a la una, así que van a comer antes de ir al hotel.",
    "glossary": [
     [
      "comprueba",
      "checks"
     ],
     [
      "total",
      "total"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why will they eat before going to the hotel?",
      "answer": "They arrive before check-in time",
      "options": [
       "They arrive before check-in time",
       "Breakfast is not included",
       "The train is delayed"
      ],
      "explanation": "They arrive at one but can check in after two."
     },
     {
      "type": "text",
      "prompt": "What is the total price?",
      "answer": "120 euros",
      "accepted": [
       "120 euros",
       "Ciento veinte euros",
       "120",
       "Ciento veinte"
      ],
      "language": "en-or-es",
      "explanation": "The message explicitly gives the total."
     },
     {
      "type": "choice",
      "prompt": "Which detail confirms that both friends can stay?",
      "answer": "Dos personas",
      "options": [
       "Dos personas",
       "Una persona",
       "Solo ida"
      ],
      "explanation": "Two guests are recorded."
     },
     {
      "type": "text",
      "prompt": "When may they arrive at the hotel?",
      "answer": "After two",
      "accepted": [
       "After two",
       "Después de las dos",
       "After two o’clock"
      ],
      "language": "en-or-es",
      "explanation": "Puede llegar después de las dos gives the time."
     },
     {
      "type": "choice",
      "prompt": "Choose a useful reply confirming the booking.",
      "answer": "Gracias. La reserva es correcta",
      "options": [
       "Gracias. La reserva es correcta",
       "No, quiero un billete de vuelta",
       "Tengo hambre ayer"
      ],
      "explanation": "Acknowledge that the booking details match."
     }
    ]
   }
  ],
  "grammar": [
   "accommodation",
   "included-services",
   "requests"
  ]
 },
 {
  "id": "a21-4",
  "title": "Arriving and solving a problem",
  "goal": "Check in and explain a simple problem with a journey or room",
  "phrases": [
   [
    "Llegué…",
    "I arrived…"
   ],
   [
    "Tengo una reserva a nombre de…",
    "I have a booking under…"
   ],
   [
    "No funciona",
    "It does not work"
   ],
   [
    "¿Puede ayudarme?",
    "Can you help me?"
   ],
   [
    "La llave",
    "The key"
   ]
  ],
  "core": [
   [
    "Llegué a las dos",
    "I arrived at two",
    [
     "Llego a las dos ayer",
     "Llegé a las dos"
    ],
    "Llegar uses llegué for yo to keep the hard g sound: llegué/llegaste/llegó/llegamos/llegasteis/llegaron.",
    "Recepción: «¿A qué hora llegó?» You arrived at two.",
    "Llegué a las dos",
    [
     "Voy a llegar mañana",
     "Son las dos"
    ],
    "Say Ana arrived at the hotel yesterday.",
    "Ana llegó al hotel ayer",
    [
     "Ayer Ana llegó al hotel"
    ]
   ],
   [
    "Tengo una reserva a nombre de Ana",
    "I have a booking under Ana",
    [
     "Tengo una reserva en nombre Ana",
     "Soy una reserva a nombre de Ana"
    ],
    "A nombre de introduces the name on a booking; tengo states you have one.",
    "Recepción: «¿A nombre de quién?» The booking is Ana’s.",
    "A nombre de Ana",
    [
     "Dos noches",
     "A las dos"
    ],
    "Give your booking name and say it is for two nights, as Luis.",
    "Tengo una reserva a nombre de Luis para dos noches",
    []
   ],
   [
    "La llave no funciona",
    "The key does not work",
    [
     "La llave no funcionar",
     "El llave no funciona"
    ],
    "Llave is feminine. No goes directly before the conjugated verb funciona.",
    "Your room key does not work. What request fits?",
    "La llave no funciona. ¿Puede ayudarme?",
    [
     "Quiero un billete de vuelta",
     "La habitación está incluida"
    ],
    "Explain that the shower does not work and ask politely for help.",
    "La ducha no funciona. ¿Puede ayudarme?",
    [
     "¿Puede ayudarme? La ducha no funciona."
    ]
   ]
  ],
  "writing": [
   [
    "Say you arrived at the station at nine yesterday.",
    "Ayer llegué a la estación a las nueve",
    [
     "Llegué a la estación a las nueve ayer"
    ],
    "Use a la before feminine estación."
   ],
   [
    "Check in as Marta, with a booking for two people.",
    "Tengo una reserva a nombre de Marta para dos personas",
    [],
    "Give the booking name and number of guests."
   ],
   [
    "Say there is no hot water in your room.",
    "No hay agua caliente en mi habitación",
    [
     "En mi habitación no hay agua caliente"
    ],
    "No hay states a missing service; caliente means hot here."
   ],
   [
    "Say your key does not work and ask for another.",
    "La llave no funciona. ¿Tiene otra?",
    [
     "La llave no funciona. ¿Tiene otra llave?"
    ],
    "State the problem before requesting a replacement."
   ],
   [
    "Say you arrived late because the train arrived late.",
    "Llegué tarde porque el tren llegó tarde",
    [],
    "Both are finished arrivals; use llegué for yourself and llegó for the train."
   ]
  ],
  "stories": [
   {
    "title": "The reception desk",
    "text": "Ana y Marta llegaron al hotel después de comer. Ana dijo: «Tengo una reserva a nombre de Ana para dos noches». La recepcionista comprobó el nombre y les dio una llave. La recepcionista dijo: «La habitación ya está lista». Ana preguntó a qué hora empieza el desayuno. La recepcionista respondió: «De ocho a diez». Marta guardó la llave y las dos subieron a la habitación.",
    "glossary": [
     [
      "recepcionista",
      "receptionist"
     ],
     [
      "comprobó",
      "checked"
     ],
     [
      "les dio",
      "gave them"
     ],
     [
      "lista",
      "ready"
     ],
     [
      "subieron",
      "went up"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "What does Ana give first to identify the booking?",
      "answer": "Her name",
      "options": [
       "Her name",
       "The breakfast price",
       "A train number"
      ],
      "explanation": "A nombre de Ana identifies it."
     },
     {
      "type": "text",
      "prompt": "How long is the booking?",
      "answer": "Two nights",
      "accepted": [
       "Two nights",
       "Dos noches",
       "Two",
       "Dos"
      ],
      "language": "en-or-es",
      "explanation": "Para dos noches specifies the stay."
     },
     {
      "type": "choice",
      "prompt": "Who keeps the key?",
      "answer": "Marta",
      "options": [
       "Marta",
       "Luis",
       "Diego"
      ],
      "explanation": "Marta guardó la llave."
     },
     {
      "type": "text",
      "prompt": "When does breakfast finish?",
      "answer": "At ten",
      "accepted": [
       "At ten",
       "A las diez",
       "Ten",
       "Las diez"
      ],
      "language": "en-or-es",
      "explanation": "De ocho a diez gives the end of breakfast."
     },
     {
      "type": "choice",
      "prompt": "What will they probably do next?",
      "answer": "Put their things in the room",
      "options": [
       "Put their things in the room",
       "Buy a train ticket in reception",
       "Visit Diego at work"
      ],
      "explanation": "They have just gone up to their ready room."
     }
    ]
   },
   {
    "title": "The key problem",
    "text": "Luis llegó al hotel a las nueve de la noche. Tiene una reserva, pero la llave no funcionó. Volvió a recepción y dijo: «La llave no funciona. ¿Tiene otra?». La recepcionista le dio otra llave y fue con él a la habitación. Esta vez la puerta se abrió. Luis dio las gracias. Después llamó a Ana para decir que ya está en la habitación.",
    "glossary": [
     [
      "funcionó",
      "worked"
     ],
     [
      "volvió",
      "returned"
     ],
     [
      "se abrió",
      "opened"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "What solves Luis’s problem?",
      "answer": "A replacement key",
      "options": [
       "A replacement key",
       "A new train ticket",
       "A different breakfast time"
      ],
      "explanation": "The second key opens the door."
     },
     {
      "type": "text",
      "prompt": "What time did he arrive?",
      "answer": "At nine at night",
      "accepted": [
       "At nine at night",
       "A las nueve de la noche",
       "Nine at night"
      ],
      "language": "en-or-es",
      "explanation": "The first sentence gives the arrival time."
     },
     {
      "type": "choice",
      "prompt": "Why does he go back to reception?",
      "answer": "His key does not work",
      "options": [
       "His key does not work",
       "He has no booking",
       "He dislikes the room colour"
      ],
      "explanation": "La llave no funcionó gives the reason."
     },
     {
      "type": "text",
      "prompt": "Who goes to the room with him?",
      "answer": "The receptionist",
      "accepted": [
       "The receptionist",
       "La recepcionista",
       "Receptionist"
      ],
      "language": "en-or-es",
      "explanation": "She accompanies him to check the new key."
     },
     {
      "type": "choice",
      "prompt": "Choose a useful report to Ana.",
      "answer": "Ya estoy en la habitación",
      "options": [
       "Ya estoy en la habitación",
       "Voy a comprar ropa",
       "El tren sale mañana"
      ],
      "explanation": "He calls to say he is now in his room."
     }
    ]
   },
   {
    "title": "A late arrival",
    "text": "Ana y Luis fueron a Toledo en tren. El tren llegó tarde y ellos llegaron al hotel a las cuatro. Ana explicó: «Llegamos tarde porque el tren llegó tarde». La recepción está abierta y todavía tienen su reserva. Luis preguntó por el desayuno y Ana pidió la llave. Después dejaron las mochilas en la habitación y fueron al centro a tomar algo.",
    "glossary": [
     [
      "abierta",
      "open"
     ],
     [
      "dejaron",
      "left"
     ],
     [
      "mochilas",
      "backpacks"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Which event caused their late arrival?",
      "answer": "The train’s delay",
      "options": [
       "The train’s delay",
       "A wrong room key",
       "Breakfast ending early"
      ],
      "explanation": "Porque connects their arrival to the delayed train."
     },
     {
      "type": "text",
      "prompt": "When did they reach the hotel?",
      "answer": "At four",
      "accepted": [
       "At four",
       "A las cuatro",
       "Four",
       "Las cuatro"
      ],
      "language": "en-or-es",
      "explanation": "Llegaron al hotel a las cuatro."
     },
     {
      "type": "choice",
      "prompt": "Was the booking lost?",
      "answer": "No, it was still available",
      "options": [
       "No, it was still available",
       "Yes, it was cancelled",
       "The text does not mention a booking"
      ],
      "explanation": "Su reserva seguía disponible states it was retained."
     },
     {
      "type": "text",
      "prompt": "What did they leave in the room?",
      "answer": "Their backpacks",
      "accepted": [
       "Their backpacks",
       "Las mochilas",
       "Backpacks",
       "Mochilas"
      ],
      "language": "en-or-es",
      "explanation": "Dejaron las mochilas names the bags."
     },
     {
      "type": "choice",
      "prompt": "What is their next practical activity?",
      "answer": "Getting something to drink in the centre",
      "options": [
       "Getting something to drink in the centre",
       "Taking another train immediately",
       "Booking a room in Madrid"
      ],
      "explanation": "Fueron al centro a tomar algo describes the next outing."
     }
    ]
   },
   {
    "title": "No hot water",
    "text": "Marta está en su habitación. Quiere ducharse, pero no hay agua caliente. Baja a recepción y dice: «No hay agua caliente en mi habitación. ¿Puede ayudarme?». La recepcionista llama a un compañero. Marta espera en el salón del hotel. Diez minutos después, la recepcionista dice: «Ya funciona». Marta vuelve a la habitación. Puede ducharse antes de quedar con Ana para cenar.",
    "glossary": [
     [
      "baja",
      "goes down"
     ],
     [
      "compañero",
      "colleague"
     ],
     [
      "espera",
      "waits"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Marta ask for help?",
      "answer": "There is no hot water",
      "options": [
       "There is no hot water",
       "Her key is lost",
       "Ana has no dinner"
      ],
      "explanation": "No hay agua caliente states the problem."
     },
     {
      "type": "text",
      "prompt": "Where does she wait?",
      "answer": "In the hotel lounge",
      "accepted": [
       "In the hotel lounge",
       "En el salón del hotel",
       "Hotel lounge",
       "El salón del hotel"
      ],
      "language": "en-or-es",
      "explanation": "The text gives her waiting place."
     },
     {
      "type": "choice",
      "prompt": "What does ya funciona mean here?",
      "answer": "The hot water now works",
      "options": [
       "The hot water now works",
       "The hotel is closed",
       "Her train has arrived"
      ],
      "explanation": "The receptionist reports that the problem is fixed."
     },
     {
      "type": "text",
      "prompt": "Who will she meet for dinner?",
      "answer": "Ana",
      "accepted": [
       "Ana",
       "Ana"
      ],
      "language": "en-or-es",
      "explanation": "Quedar con Ana para cenar gives the plan."
     },
     {
      "type": "choice",
      "prompt": "What can she do after the repair?",
      "answer": "Shower before dinner",
      "options": [
       "Shower before dinner",
       "Buy a cheaper room",
       "Go back to Madrid immediately"
      ],
      "explanation": "The repair makes her original shower plan possible."
     }
    ]
   }
  ],
  "grammar": [
   "preterite-llegar",
   "checking-in",
   "problem-repair"
  ]
 },
 {
  "id": "a21-5",
  "title": "How you feel",
  "goal": "Explain basic symptoms and say what you need",
  "phrases": [
   [
    "Me duele…",
    "My … hurts"
   ],
   [
    "Me duelen…",
    "My … hurt"
   ],
   [
    "Tengo fiebre",
    "I have a fever"
   ],
   [
    "Desde ayer",
    "Since yesterday"
   ],
   [
    "Necesito descansar",
    "I need to rest"
   ]
  ],
  "core": [
   [
    "Me duele la cabeza",
    "My head hurts",
    [
     "Me duelen la cabeza",
     "Yo duelo la cabeza"
    ],
    "Doler works like gustar: the body part controls duele/duelen. Me identifies who feels the pain.",
    "Luis: «¿Qué te pasa?» Your head hurts.",
    "Me duele la cabeza",
    [
     "Me gustan las cabezas",
     "Estoy cabeza"
    ],
    "Say your feet hurt.",
    "Me duelen los pies",
    []
   ],
   [
    "Tengo fiebre desde ayer",
    "I have had a fever since yesterday",
    [
     "Soy fiebre desde ayer",
     "Tengo fiebre por ayer"
    ],
    "Use tener for fever. Desde gives the starting point; Spanish can use the present for a continuing symptom.",
    "Marta asks when your fever started. Say yesterday.",
    "Desde ayer",
    [
     "Hasta mañana",
     "A las dos mañana"
    ],
    "Say your throat hurts and you have a fever.",
    "Me duele la garganta y tengo fiebre",
    []
   ],
   [
    "Necesito descansar porque estoy cansada",
    "I need to rest because I am tired (Ana)",
    [
     "Necesito descanso porque soy cansada",
     "Necesito descansar porque estoy cansado"
    ],
    "Necesitar takes an infinitive for an action. A current state uses estar; Ana uses cansada.",
    "Ana feels ill. Which plan is sensible in this context?",
    "Voy a descansar en casa",
    [
     "Voy a correr toda la tarde",
     "Voy a comprar una chaqueta"
    ],
    "As Luis, say you need water because you are thirsty.",
    "Necesito agua porque tengo sed",
    [
     "Tengo sed, por eso necesito agua"
    ]
   ]
  ],
  "writing": [
   [
    "Tell a doctor your stomach hurts.",
    "Me duele el estómago",
    [],
    "A singular body part takes duele."
   ],
   [
    "Say both feet hurt after the trip.",
    "Me duelen los pies después del viaje",
    [],
    "Plural pies takes duelen."
   ],
   [
    "Say you have a fever and need to rest.",
    "Tengo fiebre y necesito descansar",
    [],
    "Use tener for fever and an infinitive after necesito."
   ],
   [
    "Say your throat has hurt since yesterday.",
    "Me duele la garganta desde ayer",
    [],
    "Desde ayer gives when the continuing symptom began."
   ],
   [
    "As Ana, cancel because you are ill and will rest at home. Use enferma.",
    "Estoy enferma y voy a descansar en casa",
    [
     "Estoy enferma. Voy a descansar en casa."
    ],
    "Use estar for illness and voy a + infinitive for the plan."
   ]
  ],
  "stories": [
   {
    "title": "A quieter day",
    "text": "Ana escribe a Marta: «Hoy no puedo ir al museo. Me duele la cabeza y tengo fiebre desde ayer». Marta responde: «Lo siento. ¿Necesitas algo?». Ana tiene agua en casa, pero no tiene comida. Marta va a llevarle pan y fruta después del trabajo. Ana dice que va a descansar. Las dos deciden dejar la visita al museo para otro día.",
    "glossary": [
     [
      "fiebre",
      "fever"
     ],
     [
      "llevarle",
      "take her"
     ],
     [
      "dejar… para otro día",
      "leave… for another day"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why is the museum visit postponed?",
      "answer": "Ana feels ill",
      "options": [
       "Ana feels ill",
       "Marta has no ticket",
       "The museum is closed"
      ],
      "explanation": "Headache and fever explain the cancellation."
     },
     {
      "type": "text",
      "prompt": "When did the fever start?",
      "answer": "Yesterday",
      "accepted": [
       "Yesterday",
       "Ayer",
       "Since yesterday",
       "Desde ayer"
      ],
      "language": "en-or-es",
      "explanation": "Desde ayer gives the starting point."
     },
     {
      "type": "choice",
      "prompt": "What help does Ana need according to the text?",
      "answer": "Food",
      "options": [
       "Food",
       "Water",
       "A room key"
      ],
      "explanation": "She has water but no food."
     },
     {
      "type": "text",
      "prompt": "Who will bring food?",
      "answer": "Marta",
      "accepted": [
       "Marta",
       "Marta"
      ],
      "language": "en-or-es",
      "explanation": "Marta va a llevarle pan y fruta."
     },
     {
      "type": "choice",
      "prompt": "Which message would fit Ana’s plan?",
      "answer": "Gracias. Voy a descansar en casa",
      "options": [
       "Gracias. Voy a descansar en casa",
       "Me voy al museo ahora",
       "Quiero una talla grande"
      ],
      "explanation": "Resting at home follows the symptom report."
     }
    ]
   },
   {
    "title": "After a long walk",
    "text": "Luis y Ana caminaron mucho en Toledo. Hoy Luis dice: «Me duelen los pies». Ana pregunta: «¿Te duele también la cabeza?». Luis responde: «No. Solo los pies. Necesito descansar un poco». Ana quiere ir al parque, pero decide tomar un café con Luis primero. Van a sentarse en el café de Diego. Después Luis va a volver a casa.",
    "glossary": [
     [
      "caminaron",
      "walked"
     ],
     [
      "solo",
      "only"
     ],
     [
      "sentarse",
      "sit down"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Which symptom does Luis deny?",
      "answer": "A headache",
      "options": [
       "A headache",
       "Sore feet",
       "Being tired"
      ],
      "explanation": "No answers the question about his head."
     },
     {
      "type": "text",
      "prompt": "What hurts?",
      "answer": "His feet",
      "accepted": [
       "His feet",
       "Los pies",
       "Feet",
       "Pies"
      ],
      "language": "en-or-es",
      "explanation": "Me duelen los pies gives the symptom."
     },
     {
      "type": "choice",
      "prompt": "Why does Ana change the plan?",
      "answer": "Luis needs a rest",
      "options": [
       "Luis needs a rest",
       "The park is closed",
       "Diego is ill"
      ],
      "explanation": "A seated café break supports Luis’s need."
     },
     {
      "type": "text",
      "prompt": "Where will they sit first?",
      "answer": "At Diego’s café",
      "accepted": [
       "At Diego’s café",
       "En el café de Diego",
       "Diego’s café",
       "El café de Diego"
      ],
      "language": "en-or-es",
      "explanation": "They will sit there before Luis returns home."
     },
     {
      "type": "choice",
      "prompt": "Why is duelen plural here?",
      "answer": "Because pies is plural",
      "options": [
       "Because pies is plural",
       "Because two people are speaking",
       "Because the event is past"
      ],
      "explanation": "The body part, not the number of speakers, controls agreement."
     }
    ]
   },
   {
    "title": "A short phone call",
    "text": "Marta llama a Ana antes de salir. «Me duele la garganta desde esta mañana», dice Ana. «No tengo fiebre, pero estoy cansada». Marta pregunta si puede hablar. Ana responde que sí, pero prefiere un mensaje. Marta escribe: «Voy a comprar comida. ¿Necesitas agua?». Ana contesta: «Sí, por favor». Marta va a dejar la compra en la puerta. Ana va a descansar sin salir de casa.",
    "glossary": [
     [
      "garganta",
      "throat"
     ],
     [
      "si",
      "whether"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Ana prefer a message?",
      "answer": "Her throat hurts",
      "options": [
       "Her throat hurts",
       "Her phone is lost",
       "Marta cannot read"
      ],
      "explanation": "A sore throat makes a message easier than talking."
     },
     {
      "type": "text",
      "prompt": "When did the throat pain start?",
      "answer": "This morning",
      "accepted": [
       "This morning",
       "Esta mañana",
       "Since this morning",
       "Desde esta mañana"
      ],
      "language": "en-or-es",
      "explanation": "Desde esta mañana gives the start."
     },
     {
      "type": "choice",
      "prompt": "Which symptom is absent?",
      "answer": "Fever",
      "options": [
       "Fever",
       "Tiredness",
       "A sore throat"
      ],
      "explanation": "No tengo fiebre explicitly denies fever."
     },
     {
      "type": "text",
      "prompt": "What drink does Ana request?",
      "answer": "Water",
      "accepted": [
       "Water",
       "Agua",
       "Water, please",
       "Agua, por favor"
      ],
      "language": "en-or-es",
      "explanation": "Sí answers the offer of water."
     },
     {
      "type": "choice",
      "prompt": "What is Marta trying to make easier?",
      "answer": "Ana’s rest",
      "options": [
       "Ana’s rest",
       "A museum booking",
       "An early train"
      ],
      "explanation": "Leaving the food at the door reduces interruption."
     }
    ]
   },
   {
    "title": "Explaining clearly",
    "text": "Diego tiene una cita con el médico. Antes de entrar, escribe en el móvil: «Me duele el estómago desde ayer. No tengo fiebre. He comido poco hoy». Quiere explicar los síntomas con calma. El médico pregunta: «¿Desde cuándo?». Diego mira su nota y responde: «Desde ayer». Después de la cita va a llamar a Luis. No va a trabajar esta tarde porque necesita descansar.",
    "glossary": [
     [
      "cita",
      "appointment"
     ],
     [
      "síntomas",
      "symptoms"
     ],
     [
      "con calma",
      "calmly"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Diego write a note?",
      "answer": "To explain his symptoms clearly",
      "options": [
       "To explain his symptoms clearly",
       "To book a train",
       "To compare café prices"
      ],
      "explanation": "The note helps him answer calmly."
     },
     {
      "type": "text",
      "prompt": "What body part hurts?",
      "answer": "His stomach",
      "accepted": [
       "His stomach",
       "El estómago",
       "Stomach",
       "Estómago"
      ],
      "language": "en-or-es",
      "explanation": "Me duele el estómago is his symptom."
     },
     {
      "type": "choice",
      "prompt": "What does desde cuándo ask for?",
      "answer": "When it started",
      "options": [
       "When it started",
       "Where he works",
       "How much food costs"
      ],
      "explanation": "Desde asks for the starting time."
     },
     {
      "type": "text",
      "prompt": "Who will he call after the appointment?",
      "answer": "Luis",
      "accepted": [
       "Luis",
       "Luis"
      ],
      "language": "en-or-es",
      "explanation": "Va a llamar a Luis names the person."
     },
     {
      "type": "choice",
      "prompt": "Which statement explains his afternoon plan?",
      "answer": "Necesita descansar",
      "options": [
       "Necesita descansar",
       "Quiere comprar una llave",
       "Tiene que visitar el museo"
      ],
      "explanation": "He will not work because he needs rest."
     }
    ]
   }
  ],
  "grammar": [
   "doler-agreement",
   "health",
   "since-time"
  ]
 },
 {
  "id": "a21-6",
  "title": "Asking for health help",
  "goal": "Request basic help at a pharmacy and understand a simple instruction",
  "phrases": [
   [
    "¿Hay una farmacia cerca?",
    "Is there a pharmacy nearby?"
   ],
   [
    "Necesito ayuda",
    "I need help"
   ],
   [
    "Tengo que…",
    "I have to…"
   ],
   [
    "Dos veces al día",
    "Twice a day"
   ],
   [
    "Una cita",
    "An appointment"
   ]
  ],
  "core": [
   [
    "Necesito hablar con un médico",
    "I need to speak to a doctor",
    [
     "Necesito hablo con un médico",
     "Necesito hablar a un médico"
    ],
    "Necesitar takes an infinitive. Hablar con means speak with someone.",
    "Farmacia: «¿Qué necesita?» You need help with a sore throat.",
    "Me duele la garganta. Necesito ayuda",
    [
     "Necesito una habitación doble",
     "El tren llegó tarde"
    ],
    "Ask whether there is a pharmacy near the hotel.",
    "¿Hay una farmacia cerca del hotel?",
    []
   ],
   [
    "Tengo que pedir una cita",
    "I have to ask for an appointment",
    [
     "Tengo pedir una cita",
     "Soy que pedir una cita"
    ],
    "Tener que + infinitive expresses a need or obligation. Keep que before pedir.",
    "Centro de salud: «¿Para hoy o para mañana?» You need today.",
    "Para hoy, por favor",
    [
     "Desde ayer, por favor",
     "Dos veces al día"
    ],
    "Say you cannot come because you have to go to the doctor.",
    "No puedo venir porque tengo que ir al médico",
    []
   ],
   [
    "He necesitado ayuda esta semana",
    "I have needed help this week",
    [
     "He necesito ayuda esta semana",
     "Soy necesitado ayuda esta semana"
    ],
    "Combine haber + necesitado to report a recent need: he/has/ha/hemos/habéis/han necesitado.",
    "An instruction says «Dos veces al día, con agua». What does it tell you?",
    "Twice a day with water",
    [
     "Only tomorrow",
     "Every two hours without water"
    ],
    "Ask the pharmacist to repeat the instruction more slowly.",
    "¿Puede repetir más despacio, por favor?",
    [
     "¿Puede repetirlo más despacio, por favor?"
    ]
   ]
  ],
  "writing": [
   [
    "Ask if there is a pharmacy nearby.",
    "¿Hay una farmacia cerca?",
    [
     "¿Dónde hay una farmacia cerca?"
    ],
    "Hay asks whether a pharmacy exists nearby."
   ],
   [
    "Explain that your throat hurts and you need help.",
    "Me duele la garganta y necesito ayuda",
    [],
    "Name the symptom and the practical request."
   ],
   [
    "Ask for an appointment today politely.",
    "Necesito una cita para hoy, por favor",
    [
     "Quiero una cita para hoy, por favor"
    ],
    "Para hoy states the requested appointment day."
   ],
   [
    "Say you have to rest at home today.",
    "Hoy tengo que descansar en casa",
    [
     "Tengo que descansar en casa hoy"
    ],
    "Tengo que takes the infinitive descansar."
   ],
   [
    "Say you have needed help this week but feel better now. Use mejor.",
    "Esta semana he necesitado ayuda, pero ahora estoy mejor",
    [
     "He necesitado ayuda esta semana, pero ahora estoy mejor"
    ],
    "Pero contrasts the recent need with the present improvement."
   ]
  ],
  "stories": [
   {
    "title": "Finding the pharmacy",
    "text": "Ana sale del hotel con Marta. Le duele la garganta y quiere pedir ayuda. En recepción pregunta: «¿Hay una farmacia cerca?». La recepcionista dice: «Sí, al lado de la estación». Ana y Marta van andando. En la farmacia Ana explica: «Me duele la garganta desde ayer». La persona de la farmacia escucha y le hace unas preguntas. Marta espera cerca de la puerta.",
    "glossary": [
     [
      "le duele",
      "her … hurts"
     ],
     [
      "escucha",
      "listens"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Ana go to the pharmacy?",
      "answer": "To ask for help with her throat",
      "options": [
       "To ask for help with her throat",
       "To book a room",
       "To buy a return ticket"
      ],
      "explanation": "The sore throat is her stated reason."
     },
     {
      "type": "text",
      "prompt": "Where is the pharmacy?",
      "answer": "Next to the station",
      "accepted": [
       "Next to the station",
       "Al lado de la estación",
       "Near the station",
       "Junto a la estación"
      ],
      "language": "en-or-es",
      "explanation": "The receptionist locates it there."
     },
     {
      "type": "choice",
      "prompt": "What should Ana explain first?",
      "answer": "Her symptom and when it started",
      "options": [
       "Her symptom and when it started",
       "Her clothing size",
       "The train price"
      ],
      "explanation": "Me duele la garganta desde ayer gives both useful details."
     },
     {
      "type": "text",
      "prompt": "Who accompanies Ana?",
      "answer": "Marta",
      "accepted": [
       "Marta",
       "Marta"
      ],
      "language": "en-or-es",
      "explanation": "Ana and Marta go together."
     },
     {
      "type": "choice",
      "prompt": "Which question asks for a nearby service?",
      "answer": "¿Hay una farmacia cerca?",
      "options": [
       "¿Hay una farmacia cerca?",
       "¿Has comido ayer?",
       "¿Qué talla llevas?"
      ],
      "explanation": "Hay asks about the available service."
     }
    ]
   },
   {
    "title": "Checking an instruction",
    "text": "Luis está en la farmacia. La persona le explica cómo usar un producto: «Dos veces al día, con agua». Luis no entiende bien y pregunta: «¿Puede repetir más despacio, por favor?». Después repite: «Dos veces al día, con agua, ¿verdad?». La persona confirma. Luis escribe la instrucción en el móvil. Si tiene más preguntas, va a volver a la farmacia antes de usar el producto.",
    "glossary": [
     [
      "producto",
      "product"
     ],
     [
      "¿verdad?",
      "right?"
     ],
     [
      "usar",
      "use"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "What does Luis do to check understanding?",
      "answer": "Repeats the instruction back",
      "options": [
       "Repeats the instruction back",
       "Guesses another dose",
       "Leaves without asking"
      ],
      "explanation": "He repeats both frequency and water and requests confirmation."
     },
     {
      "type": "text",
      "prompt": "How often does the instruction say?",
      "answer": "Twice a day",
      "accepted": [
       "Twice a day",
       "Dos veces al día",
       "Two times a day"
      ],
      "language": "en-or-es",
      "explanation": "Dos veces al día is the stated frequency."
     },
     {
      "type": "choice",
      "prompt": "What request helps him understand?",
      "answer": "¿Puede repetir más despacio?",
      "options": [
       "¿Puede repetir más despacio?",
       "¿Cuánto cuesta el hotel?",
       "¿Vienes al cine?"
      ],
      "explanation": "Repeating more slowly addresses the communication problem."
     },
     {
      "type": "text",
      "prompt": "Where does he save the instruction?",
      "answer": "On his phone",
      "accepted": [
       "On his phone",
       "En el móvil",
       "His phone",
       "El móvil"
      ],
      "language": "en-or-es",
      "explanation": "He writes it in his phone."
     },
     {
      "type": "choice",
      "prompt": "What will he do if still unsure?",
      "answer": "Ask the pharmacy before using it",
      "options": [
       "Ask the pharmacy before using it",
       "Use it more often",
       "Ignore the instruction"
      ],
      "explanation": "The last sentence explicitly says he will return before use."
     }
    ]
   },
   {
    "title": "An appointment for today",
    "text": "Diego llama al centro de salud. «Necesito una cita para hoy. Tengo fiebre desde ayer», explica. Le ofrecen una cita a las doce. Diego trabaja por la mañana, pero puede ir a esa hora. Escribe a Luis: «Tengo que ir al médico. ¿Puedes ayudar en el café a las doce?». Luis responde que sí. Diego confirma la cita y prepara su nota con los síntomas.",
    "glossary": [
     [
      "centro de salud",
      "health centre"
     ],
     [
      "le ofrecen",
      "they offer him"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Diego ask Luis for help?",
      "answer": "He needs to leave work for the appointment",
      "options": [
       "He needs to leave work for the appointment",
       "He needs a train ticket",
       "He has forgotten the hotel name"
      ],
      "explanation": "The appointment overlaps his café work."
     },
     {
      "type": "text",
      "prompt": "When is the appointment?",
      "answer": "At twelve",
      "accepted": [
       "At twelve",
       "A las doce",
       "Twelve",
       "Las doce"
      ],
      "language": "en-or-es",
      "explanation": "The health centre offers noon."
     },
     {
      "type": "choice",
      "prompt": "What does tengo que express here?",
      "answer": "A necessary action",
      "options": [
       "A necessary action",
       "A past habit",
       "A clothing preference"
      ],
      "explanation": "Tener que indicates that he needs to go."
     },
     {
      "type": "text",
      "prompt": "Since when has he had a fever?",
      "answer": "Since yesterday",
      "accepted": [
       "Since yesterday",
       "Desde ayer",
       "Yesterday",
       "Ayer"
      ],
      "language": "en-or-es",
      "explanation": "His first message gives the start."
     },
     {
      "type": "choice",
      "prompt": "Which response confirms the appointment?",
      "answer": "Sí, a las doce, gracias",
      "options": [
       "Sí, a las doce, gracias",
       "No, ida y vuelta",
       "He comprado una camisa"
      ],
      "explanation": "Confirming the offered time completes the exchange."
     }
    ]
   },
   {
    "title": "Better, but still careful",
    "text": "Ana escribe a su familia: «Esta semana he necesitado ayuda porque me ha dolido la garganta. He hablado con una persona en la farmacia. Hoy estoy mejor, pero tengo que descansar». Luis le lleva comida y pregunta si quiere ir al parque mañana. Ana responde: «Todavía no lo sé. Voy a ver cómo estoy mañana». Luis acepta y dice que pueden decidir después.",
    "glossary": [
     [
      "me ha dolido",
      "my … has hurt"
     ],
     [
      "todavía no lo sé",
      "I do not know yet"
     ],
     [
      "decidir",
      "decide"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Ana not confirm the park yet?",
      "answer": "She will check how she feels tomorrow",
      "options": [
       "She will check how she feels tomorrow",
       "She has lost her phone",
       "She dislikes Luis"
      ],
      "explanation": "She explicitly plans to see how she feels."
     },
     {
      "type": "text",
      "prompt": "How does she feel today?",
      "answer": "Better",
      "accepted": [
       "Better",
       "Mejor",
       "She feels better",
       "Está mejor"
      ],
      "language": "en-or-es",
      "explanation": "Hoy estoy mejor describes her present state."
     },
     {
      "type": "choice",
      "prompt": "Which part reports recent help?",
      "answer": "He hablado con una persona en la farmacia",
      "options": [
       "He hablado con una persona en la farmacia",
       "Voy al parque mañana",
       "Estoy mejor"
      ],
      "explanation": "He hablado reports a recent completed conversation."
     },
     {
      "type": "text",
      "prompt": "Who brings food?",
      "answer": "Luis",
      "accepted": [
       "Luis",
       "Luis"
      ],
      "language": "en-or-es",
      "explanation": "Luis le lleva comida."
     },
     {
      "type": "choice",
      "prompt": "Which reply respects Ana’s uncertainty?",
      "answer": "Vale, decidimos mañana",
      "options": [
       "Vale, decidimos mañana",
       "Tienes que ir al parque ahora",
       "No puedes descansar"
      ],
      "explanation": "Allowing a later decision fits her response."
     }
    ]
   }
  ],
  "grammar": [
   "tener-que",
   "health-requests",
   "repair-requests",
   "recent-perfect"
  ]
 },
 {
  "id": "a21-7",
  "title": "A useful travel message",
  "goal": "Link a recent experience, a reason and a practical next plan",
  "phrases": [
   [
    "He vuelto…",
    "I have returned…"
   ],
   [
    "Luego…",
    "Then…"
   ],
   [
    "Por eso…",
    "That is why…"
   ],
   [
    "Antes de…",
    "Before…"
   ],
   [
    "Voy a…",
    "I am going to…"
   ]
  ],
  "core": [
   [
    "He vuelto a Madrid hoy",
    "I have returned to Madrid today",
    [
     "He volvido a Madrid hoy",
     "He volver a Madrid hoy"
    ],
    "Volver has the irregular participle vuelto. Use he/has/ha/hemos/habéis/han + vuelto.",
    "Marta: «¿Ya estás en Madrid?» You returned today.",
    "Sí, he vuelto hoy",
    [
     "No, voy a volver mañana",
     "Sí, volver hoy"
    ],
    "Say Ana and Luis have returned to Madrid this week.",
    "Ana y Luis han vuelto a Madrid esta semana",
    [
     "Esta semana Ana y Luis han vuelto a Madrid"
    ]
   ],
   [
    "Tomé el tren ayer y después fui al hotel",
    "I took the train yesterday and then went to the hotel",
    [
     "Tomo el tren ayer y después voy al hotel",
     "Tomé el tren ayer y después ir al hotel"
    ],
    "Tomar is regular -AR in the preterite. Join two finished events without changing back to the present.",
    "Your friend asks how you travelled yesterday. You took the bus.",
    "Tomé el autobús",
    [
     "Voy a tomar el autobús",
     "He tomar el autobús"
    ],
    "Say you took the bus and arrived at nine yesterday.",
    "Ayer tomé el autobús y llegué a las nueve",
    [
     "Tomé el autobús ayer y llegué a las nueve"
    ]
   ],
   [
    "Voy a reservar una habitación porque quiero viajar",
    "I am going to book a room because I want to travel",
    [
     "Voy reservar una habitación porque quiero viajar",
     "Voy a reservo una habitación porque quiero viajar"
    ],
    "Use voy a + infinitive for the plan and porque to explain the reason.",
    "Luis is free Saturday but not Sunday. Suggest a workable plan.",
    "Vamos a viajar el sábado",
    [
     "Vamos a viajar el domingo",
     "Fuimos el sábado pasado"
    ],
    "Say you have returned today, so you are going to rest. Use por eso.",
    "He vuelto hoy, por eso voy a descansar",
    [
     "Hoy he vuelto, por eso voy a descansar"
    ]
   ]
  ],
  "writing": [
   [
    "Say you have returned today and will rest at home.",
    "He vuelto hoy y voy a descansar en casa",
    [
     "Hoy he vuelto y voy a descansar en casa"
    ],
    "Link recent experience and next intention."
   ],
   [
    "Write two sentences: yesterday you took the train; the train is faster than the bus.",
    "Ayer tomé el tren. El tren es más rápido que el autobús",
    [],
    "Ayer tomé reports your choice; a separate present sentence describes the options."
   ],
   [
    "Tell Luis you arrived at nine and then went to the hotel.",
    "Llegué a las nueve y después fui al hotel",
    [
     "Llegué a las nueve. Después fui al hotel."
    ],
    "Use past forms for both completed events."
   ],
   [
    "Invite Marta for Saturday and explain you cannot go on Sunday.",
    "¿Vamos el sábado? El domingo no puedo",
    [
     "¿Vamos el sábado? No puedo el domingo"
    ],
    "Keep the invitation and the limitation clear."
   ],
   [
    "Say you need to book a room, then you will buy the ticket.",
    "Necesito reservar una habitación y después voy a comprar el billete",
    [
     "Necesito reservar una habitación. Después voy a comprar el billete."
    ],
    "Necesito and voy a each take an infinitive; después orders the tasks."
   ]
  ],
  "stories": [
   {
    "title": "Home again",
    "text": "Ana y Marta han vuelto a Madrid hoy. El viaje ha sido corto, pero han caminado mucho. Ana escribe a Luis: «He vuelto hoy y estoy cansada. Voy a descansar en casa». Marta está libre mañana y propone llevar las fotos al café. Luis acepta: «Perfecto. Podemos verlas después del desayuno». Ana dice que mañana va a decidir si puede ir. Hoy necesita descansar.",
    "glossary": [
     [
      "ha sido",
      "has been"
     ],
     [
      "verlas",
      "see them"
     ],
     [
      "si",
      "whether"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Ana not join a plan today?",
      "answer": "She is tired and needs rest",
      "options": [
       "She is tired and needs rest",
       "She has lost the photos",
       "She has not returned"
      ],
      "explanation": "Her message names tiredness and resting at home."
     },
     {
      "type": "text",
      "prompt": "Who proposes bringing photos?",
      "answer": "Marta",
      "accepted": [
       "Marta",
       "Marta"
      ],
      "language": "en-or-es",
      "explanation": "Marta proposes taking the photos to the café."
     },
     {
      "type": "choice",
      "prompt": "When does Luis suggest seeing them?",
      "answer": "After breakfast",
      "options": [
       "After breakfast",
       "Before the train yesterday",
       "During the hotel booking"
      ],
      "explanation": "Después del desayuno gives the sequence."
     },
     {
      "type": "text",
      "prompt": "Where is Ana going to rest?",
      "answer": "At home",
      "accepted": [
       "At home",
       "En casa",
       "Home",
       "Casa"
      ],
      "language": "en-or-es",
      "explanation": "Voy a descansar en casa is explicit."
     },
     {
      "type": "choice",
      "prompt": "Choose an accurate summary of her message.",
      "answer": "He vuelto y voy a descansar",
      "options": [
       "He vuelto y voy a descansar",
       "Voy a viajar ahora",
       "No he vuelto todavía"
      ],
      "explanation": "The first option links return and plan."
     }
    ]
   },
   {
    "title": "The next trip",
    "text": "Luis quiere ir a Toledo otra vez. Esta semana ha vuelto a Madrid después de visitar a su familia. Escribe a Ana: «¿Quieres viajar el sábado?». Ana puede el sábado, pero Marta trabaja. Ana responde: «Prefiero ir el domingo porque Marta está libre». Luis también puede el domingo. Van a reservar una habitación y después comprar los billetes. Quieren comparar los precios primero.",
    "glossary": [
     [
      "otra vez",
      "again"
     ],
     [
      "primero",
      "first"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Ana suggest Sunday?",
      "answer": "Marta is free then",
      "options": [
       "Marta is free then",
       "The trains are always cheaper",
       "Luis cannot travel Saturday"
      ],
      "explanation": "Marta’s availability motivates the alternative."
     },
     {
      "type": "text",
      "prompt": "Which day did Luis first suggest?",
      "answer": "Saturday",
      "accepted": [
       "Saturday",
       "El sábado",
       "Saturday",
       "Sábado"
      ],
      "language": "en-or-es",
      "explanation": "His invitation names el sábado."
     },
     {
      "type": "choice",
      "prompt": "What should they do before buying?",
      "answer": "Compare prices",
      "options": [
       "Compare prices",
       "Visit the doctor",
       "Cancel every plan"
      ],
      "explanation": "The last sentence states that comparison comes first."
     },
     {
      "type": "text",
      "prompt": "What will they book before tickets?",
      "answer": "A room",
      "accepted": [
       "A room",
       "Una habitación",
       "Room",
       "La habitación"
      ],
      "language": "en-or-es",
      "explanation": "Después places buying tickets after booking."
     },
     {
      "type": "choice",
      "prompt": "Which response could confirm the new day?",
      "answer": "Sí, el domingo podemos ir los tres",
      "options": [
       "Sí, el domingo podemos ir los tres",
       "No, ya llegué ayer",
       "Solo ida para hoy"
      ],
      "explanation": "The first reply includes the three available friends."
     }
    ]
   },
   {
    "title": "A message with a reason",
    "text": "Marta escribe: «Ayer tomé el autobús y llegué a las nueve. Fui al hotel y después visité el centro. Hoy he vuelto a Madrid. Me duelen los pies, por eso voy a descansar». Ana responde: «Gracias por el mensaje. ¿Necesitas agua?». Marta tiene agua, pero necesita pan. Ana va a comprar pan antes de ir a casa de Marta. Luis va a llamar más tarde.",
    "glossary": [["tomé", "I took"], ["llegué", "I arrived"]],
    "questions": [
     {
      "type": "choice",
      "prompt": "What explains Marta’s next plan?",
      "answer": "Her feet hurt",
      "options": [
       "Her feet hurt",
       "The hotel has no room",
       "Her bus leaves tomorrow"
      ],
      "explanation": "Por eso links sore feet to resting."
     },
     {
      "type": "text",
      "prompt": "What transport did she take yesterday?",
      "answer": "The bus",
      "accepted": [
       "The bus",
       "El autobús",
       "Bus",
       "Autobús"
      ],
      "language": "en-or-es",
      "explanation": "Tomé el autobús states the transport."
     },
     {
      "type": "choice",
      "prompt": "Which event happened after reaching the hotel?",
      "answer": "Visiting the centre",
      "options": [
       "Visiting the centre",
       "Taking the bus",
       "Returning to Madrid today"
      ],
      "explanation": "Fui al hotel y después visité el centro gives the order."
     },
     {
      "type": "text",
      "prompt": "What does Marta need Ana to buy?",
      "answer": "Bread",
      "accepted": [
       "Bread",
       "Pan"
      ],
      "language": "en-or-es",
      "explanation": "She has water but needs bread."
     },
     {
      "type": "choice",
      "prompt": "Which time word refers to the completed earlier day?",
      "answer": "Ayer",
      "options": [
       "Ayer",
       "Mañana",
       "Hoy"
      ],
      "explanation": "Ayer places yesterday’s bus trip in a finished period."
     }
    ]
   },
   {
    "title": "Putting the plan together",
    "text": "Ana manda un mensaje al grupo: «He reservado una habitación para el domingo. El tren es más rápido que el autobús, pero cuesta más. Prefiero el autobús porque tenemos tiempo. Luis, ¿puedes comprar los billetes?». Luis responde: «Sí. Voy a comprar ida y vuelta». Marta tiene que ir al médico el sábado, pero está libre el domingo. Confirma que puede venir y pregunta a qué hora quedan en la estación.",
    "glossary": [
     [
      "he reservado",
      "I have booked"
     ],
     [
      "confirma",
      "confirms"
     ]
    ],
    "questions": [
     {
      "type": "choice",
      "prompt": "Why does Ana prefer the bus?",
      "answer": "They have time and it costs less",
      "options": [
       "They have time and it costs less",
       "It is faster",
       "The hotel is closed"
      ],
      "explanation": "The comparison and porque tenemos tiempo justify the choice."
     },
     {
      "type": "text",
      "prompt": "What has Ana already booked?",
      "answer": "A room",
      "accepted": [
       "A room",
       "Una habitación",
       "Room",
       "La habitación"
      ],
      "language": "en-or-es",
      "explanation": "He reservado identifies the completed booking."
     },
     {
      "type": "choice",
      "prompt": "What remains for Luis to do?",
      "answer": "Buy return tickets",
      "options": [
       "Buy return tickets",
       "Reserve another room",
       "Visit the doctor"
      ],
      "explanation": "Voy a comprar states the remaining task."
     },
     {
      "type": "text",
      "prompt": "Which day can Marta travel?",
      "answer": "Sunday",
      "accepted": [
       "Sunday",
       "El domingo",
       "Sunday",
       "Domingo"
      ],
      "language": "en-or-es",
      "explanation": "She has a Saturday appointment and is free Sunday."
     },
     {
      "type": "choice",
      "prompt": "Which final question helps finish the plan?",
      "answer": "¿A qué hora quedamos en la estación?",
      "options": [
       "¿A qué hora quedamos en la estación?",
       "¿Cómo te llamas?",
       "¿Qué talla es la camisa?"
      ],
      "explanation": "The group still needs a meeting time."
     }
    ]
   }
  ],
  "grammar": [
   "connected-messages",
   "irregular-vuelto",
   "past-present-plan",
   "sequencing"
  ]
 }
];
root.FriendsA21Data=units;if(typeof module!=='undefined')module.exports=units;
})(typeof window==='undefined'?globalThis:window);
