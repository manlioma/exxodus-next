import type { Lang } from './translations';

export type ConceptCard = {
  num: string;
  title: string;
  sections: { subtitle: string; body: string }[];
};

export const getConceptCards = (lang: Lang): ConceptCard[] => lang === 'it' ? [
  {
    num: '01',
    title: 'La Fine del Lavoro come Contratto Sociale Stabile',
    sections: [
      { subtitle: 'Il lavoro come infrastruttura, non solo come impiego', body: "Per oltre un secolo, il lavoro ha funzionato come fonte di reddito, sistema primario di identità, meccanismo di strutturazione del tempo, canale di riconoscimento sociale e quadro morale (meritevole vs non meritevole). La produttività guidata dall'IA sfida tutti questi ruoli simultaneamente." },
      { subtitle: 'La falsa narrativa della "distruzione vs creazione di posti di lavoro"', body: "Il discorso pubblico rimane intrappolato in un binario: i posti di lavoro spariscono o vengono sostituiti. Entrambe le narrazioni mancano il punto. Il fenomeno reale è l'instabilità: lavoro intermittente, reddito frammentato, coerenza identitaria in declino, accesso ineguale alla leva tecnologica." },
    ],
  },
  {
    num: '02',
    title: "Il Divario di Transizione: Dove Si Accumula l'Instabilità",
    sections: [
      { subtitle: 'Abbondanza asincrona', body: "L'abbondanza tecnologica non arriverà in modo uniforme. Alcuni gruppi sperimenteranno una ridotta dipendenza dal lavoro e una maggiore produttività. Altri affronteranno una precarietà prolungata, un potere contrattuale in declino e un accesso ritardato ai nuovi modelli economici. Questa asimmetria temporale è il rischio centrale della transizione." },
      { subtitle: 'Ritardo istituzionale', body: 'Le istituzioni progettate attorno a un impiego stabile faticano a rispondere: sistemi di welfare legati ai contratti, tassazione collegata agli stipendi, sistemi educativi che assumono carriere lineari. Il divario tra velocità tecnologica e adattamento istituzionale continua ad allargarsi.' },
    ],
  },
  {
    num: '03',
    title: 'Perché il "Reskilling" Non è una Soluzione Universale',
    sections: [
      { subtitle: 'Limiti cognitivi, sociali e temporali', body: "L'assunzione che tutti possano continuamente aggiornarsi ignora la diversità cognitiva, i vincoli legati all'età, l'accesso ineguale al tempo e alle risorse, e la fatica psicologica. La capacità di adattamento è diseguale." },
      { subtitle: "Il rischio di moralizzare l'adattamento", body: "Quando il reskilling diventa la narrativa dominante, il fallimento nell'adattarsi viene inquadrato come una colpa personale piuttosto che come una condizione sistemica. Questo produce stigma, risentimento e disimpegno." },
    ],
  },
  {
    num: '04',
    title: "Collasso dell'Identità in un Mondo Post-Professionale",
    sections: [
      { subtitle: 'Quando la professione non definisce più il sé', body: "Man mano che l'automazione erode l'esclusività professionale, gli individui affrontano la perdita di status, la perdita di coerenza narrativa e il diminuito riconoscimento sociale. Non è una questione HR. È una sfida culturale ed esistenziale." },
      { subtitle: 'Il pericolo della perdita di identità non gestita', body: 'Il collasso identitario non gestito può portare alla radicalizzazione, alla politica della nostalgia e al ritiro dalla partecipazione civica. La stabilità richiede più delle sole misure economiche.' },
    ],
  },
  {
    num: '05',
    title: 'La Volatilità del Reddito come Nuova Normalità',
    sections: [
      { subtitle: 'Dalla disoccupazione alla discontinuità', body: "Il rischio dominante non è più la disoccupazione, ma i flussi di reddito imprevedibili, l'assenza di riserve di sicurezza e la costante ansia finanziaria. I sistemi costruiti per stati di impiego binari non riescono ad affrontare questa realtà." },
      { subtitle: 'Il costo psicologico della volatilità', body: "L'instabilità del reddito influisce sulla pianificazione a lungo termine, sulla formazione della famiglia, sulla salute mentale e sulla fiducia nelle istituzioni. La mitigazione deve affrontare sia le dimensioni materiali che quelle psicologiche." },
    ],
  },
  {
    num: '06',
    title: 'Il Tempo come Nuova Disuguaglianza',
    sections: [
      { subtitle: 'Controllo asimmetrico del tempo', body: 'La transizione produce surplus di tempo per alcuni ed estrema scarsità di tempo per altri. Il tempo sostituisce il salario come asse primario di disuguaglianza.' },
      { subtitle: "Ripensare l'allocazione del tempo oltre la produttività", body: "Una società post-lavoro non può organizzare il tempo esclusivamente attorno all'efficienza. Sono necessari nuovi framework per legittimare il tempo non produttivo, riconoscere la cura, l'apprendimento e il contributo sociale, e prevenire la frammentazione sociale." },
    ],
  },
] : [
  {
    num: '01',
    title: 'The End of Work as a Stable Social Contract',
    sections: [
      {
        subtitle: 'Work as infrastructure, not just employment',
        body: 'For over a century, work has functioned as a source of income, a primary identity system, a time-structuring mechanism, a channel for social recognition, and a moral framework (deserving vs non-deserving). AI-driven productivity challenges all these roles simultaneously.',
      },
      {
        subtitle: 'The false narrative of "job destruction vs job creation"',
        body: 'Public discourse remains trapped in a binary: jobs will disappear, or jobs will be replaced. Both narratives miss the point. The real phenomenon is instability: intermittent work, fragmented income, declining identity coherence, unequal access to technological leverage.',
      },
    ],
  },
  {
    num: '02',
    title: 'The Transition Gap: Where Instability Accumulates',
    sections: [
      {
        subtitle: 'Asynchronous abundance',
        body: 'Technological abundance will not arrive evenly. Some groups will experience reduced labour dependency and enhanced productivity. Others will face prolonged precarity, declining bargaining power, and delayed access to new economic models. This temporal asymmetry is the core risk of the transition.',
      },
      {
        subtitle: 'Institutional lag',
        body: 'Institutions designed around stable employment struggle to respond: welfare systems tied to contracts, taxation linked to salaries, education systems assuming linear careers. The gap between technological speed and institutional adaptation continues to widen.',
      },
    ],
  },
  {
    num: '03',
    title: 'Why "Reskilling" Is Not a Universal Solution',
    sections: [
      {
        subtitle: 'Cognitive, social and temporal limits',
        body: 'The assumption that everyone can continuously reskill ignores cognitive diversity, age-related constraints, unequal access to time and resources, and psychological fatigue. Adaptation capacity is uneven.',
      },
      {
        subtitle: 'The risk of moralizing adaptation',
        body: 'When reskilling becomes the dominant narrative, failure to adapt is framed as a personal fault rather than a systemic condition. This produces stigma, resentment, and disengagement.',
      },
    ],
  },
  {
    num: '04',
    title: 'Identity Collapse in a Post-Professional World',
    sections: [
      {
        subtitle: 'When profession no longer defines the self',
        body: 'As automation erodes professional exclusivity, individuals face loss of status, loss of narrative coherence, and diminished social recognition. This is not an HR issue. It is a cultural and existential challenge.',
      },
      {
        subtitle: 'The danger of unaddressed identity loss',
        body: 'Unmanaged identity collapse can lead to radicalization, nostalgia politics, and withdrawal from civic participation. Stability requires more than economic measures.',
      },
    ],
  },
  {
    num: '05',
    title: 'Income Volatility as the New Normal',
    sections: [
      {
        subtitle: 'From unemployment to discontinuity',
        body: 'The dominant risk is no longer unemployment, but unpredictable income streams, absence of safety buffers, and constant financial anxiety. Systems built for binary employment states fail to address this reality.',
      },
      {
        subtitle: 'The psychological cost of volatility',
        body: 'Income instability affects long-term planning, family formation, mental health, and trust in institutions. Mitigation must address both material and psychological dimensions.',
      },
    ],
  },
  {
    num: '06',
    title: 'Time as the New Inequality',
    sections: [
      {
        subtitle: 'Asymmetric control over time',
        body: 'The transition produces surplus time for some and extreme time scarcity for others. Time replaces salary as a primary axis of inequality.',
      },
      {
        subtitle: 'Rethinking time allocation beyond productivity',
        body: 'A post-labour society cannot organize time solely around efficiency. New frameworks are required to legitimize non-productive time, recognize care, learning and social contribution, and prevent social fragmentation.',
      },
    ],
  },
];
