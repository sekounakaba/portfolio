export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type VocabCategory = 'Business' | 'Tech' | 'Daily' | 'Travel' | 'Food';

export interface VocabularyWord {
  id: number;
  english: string;
  phonetic: string;
  french: string;
  example: string;
  exampleTranslation: string;
  category: VocabCategory;
  level: CEFRLevel;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface GrammarQuestion {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'sentence-order';
  topic: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  level: CEFRLevel;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'words' | 'streak' | 'accuracy' | 'challenges' | 'grammar';
  unlocked: boolean;
}

export interface LevelInfo {
  level: CEFRLevel;
  title: string;
  description: string;
  xpRequired: number;
  wordsRequired: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 'A1', title: 'Beginner', description: 'Basic words and simple phrases', xpRequired: 0, wordsRequired: 0 },
  { level: 'A2', title: 'Elementary', description: 'Everyday expressions and simple communication', xpRequired: 500, wordsRequired: 10 },
  { level: 'B1', title: 'Intermediate', description: 'Handle most travel and work situations', xpRequired: 1500, wordsRequired: 20 },
  { level: 'B2', title: 'Upper Intermediate', description: 'Complex texts and fluent interaction', xpRequired: 3000, wordsRequired: 30 },
  { level: 'C1', title: 'Advanced', description: 'Flexible and effective language use', xpRequired: 5000, wordsRequired: 40 },
  { level: 'C2', title: 'Mastery', description: 'Near-native fluency and precision', xpRequired: 8000, wordsRequired: 50 },
];

export const VOCABULARY_WORDS: VocabularyWord[] = [
  // Business (10)
  { id: 1, english: 'negotiate', phonetic: '/nɪˈɡoʊʃieɪt/', french: 'négocier', example: 'We need to negotiate the terms of the contract.', exampleTranslation: 'Nous devons négocier les termes du contrat.', category: 'Business', level: 'B1', difficulty: 3 },
  { id: 2, english: 'stakeholder', phonetic: '/ˈsteɪkhoʊldər/', french: 'partie prenante', example: 'All stakeholders were invited to the meeting.', exampleTranslation: 'Toutes les parties prenantes ont été invitées à la réunion.', category: 'Business', level: 'B2', difficulty: 4 },
  { id: 3, english: 'deadline', phonetic: '/ˈdedlaɪn/', french: 'date limite', example: 'The project deadline is next Friday.', exampleTranslation: 'La date limite du projet est vendredi prochain.', category: 'Business', level: 'A2', difficulty: 2 },
  { id: 4, english: 'revenue', phonetic: '/ˈrevənjuː/', french: 'revenu', example: 'Our revenue increased by 20% this quarter.', exampleTranslation: 'Notre revenu a augmenté de 20% ce trimestre.', category: 'Business', level: 'B1', difficulty: 3 },
  { id: 5, english: 'collaborate', phonetic: '/kəˈlæbəreɪt/', french: 'collaborer', example: 'We collaborate with international teams.', exampleTranslation: 'Nous collaborons avec des équipes internationales.', category: 'Business', level: 'B1', difficulty: 3 },
  { id: 6, english: 'benchmark', phonetic: '/ˈbentʃmɑːrk/', french: 'référence', example: 'We use industry benchmarks to measure performance.', exampleTranslation: 'Nous utilisons des références industrielles pour mesurer la performance.', category: 'Business', level: 'B2', difficulty: 4 },
  { id: 7, english: 'proposal', phonetic: '/prəˈpoʊzl/', french: 'proposition', example: 'She submitted a proposal for the new project.', exampleTranslation: 'Elle a soumis une proposition pour le nouveau projet.', category: 'Business', level: 'B1', difficulty: 3 },
  { id: 8, english: 'quarterly', phonetic: '/ˈkwɔːrtərli/', french: 'trimestriel', example: 'We publish quarterly financial reports.', exampleTranslation: 'Nous publions des rapports financiers trimestriels.', category: 'Business', level: 'B2', difficulty: 4 },
  { id: 9, english: 'delegate', phonetic: '/ˈdelɪɡeɪt/', french: 'déléguer', example: 'A good leader knows how to delegate tasks.', exampleTranslation: 'Un bon leader sait comment déléguer des tâches.', category: 'Business', level: 'B1', difficulty: 3 },
  { id: 10, english: 'feasible', phonetic: '/ˈfiːzəbl/', french: 'faisable', example: 'Is this plan feasible within our budget?', exampleTranslation: 'Ce plan est-il faisable dans notre budget ?', category: 'Business', level: 'B1', difficulty: 3 },

  // Tech (10)
  { id: 11, english: 'algorithm', phonetic: '/ˈælɡərɪðəm/', french: 'algorithme', example: 'The search algorithm returns relevant results.', exampleTranslation: 'L\'algorithme de recherche renvoie des résultats pertinents.', category: 'Tech', level: 'B1', difficulty: 3 },
  { id: 12, english: 'bandwidth', phonetic: '/ˈbændwɪdθ/', french: 'bande passante', example: 'We need more bandwidth for the video call.', exampleTranslation: 'Nous avons besoin de plus de bande passante pour l\'appel vidéo.', category: 'Tech', level: 'B1', difficulty: 3 },
  { id: 13, english: 'repository', phonetic: '/rɪˈpɒzɪtɔːri/', french: 'dépôt', example: 'Push your changes to the remote repository.', exampleTranslation: 'Poussez vos modifications vers le dépôt distant.', category: 'Tech', level: 'B2', difficulty: 4 },
  { id: 14, english: 'scalable', phonetic: '/ˈskeɪləbl/', french: 'évolutif', example: 'The architecture must be scalable.', exampleTranslation: 'L\'architecture doit être évolutive.', category: 'Tech', level: 'B2', difficulty: 4 },
  { id: 15, english: 'deploy', phonetic: '/dɪˈplɔɪ/', french: 'déployer', example: 'We will deploy the update tonight.', exampleTranslation: 'Nous déploierons la mise à jour ce soir.', category: 'Tech', level: 'B1', difficulty: 3 },
  { id: 16, english: 'encryption', phonetic: '/ɪnˈkrɪpʃn/', french: 'chiffrement', example: 'End-to-end encryption protects your data.', exampleTranslation: 'Le chiffrement de bout en bout protège vos données.', category: 'Tech', level: 'B2', difficulty: 4 },
  { id: 17, english: 'debug', phonetic: '/diːˈbʌɡ/', french: 'déboguer', example: 'I need to debug this issue before the release.', exampleTranslation: 'Je dois déboguer ce problème avant la sortie.', category: 'Tech', level: 'B1', difficulty: 3 },
  { id: 18, english: 'latency', phonetic: '/ˈleɪtənsi/', french: 'latence', example: 'Low latency is critical for real-time applications.', exampleTranslation: 'Une faible latence est critique pour les applications en temps réel.', category: 'Tech', level: 'B2', difficulty: 4 },
  { id: 19, english: 'refactor', phonetic: '/riːˈfæktər/', french: 'refactoriser', example: 'Let\'s refactor this code to improve readability.', exampleTranslation: 'Refactorisons ce code pour améliorer la lisibilité.', category: 'Tech', level: 'B2', difficulty: 4 },
  { id: 20, english: 'authenticate', phonetic: '/ɔːˈθentɪkeɪt/', french: 'authentifier', example: 'Users must authenticate before accessing the system.', exampleTranslation: 'Les utilisateurs doivent s\'authentifier avant d\'accéder au système.', category: 'Tech', level: 'B2', difficulty: 4 },

  // Daily (10)
  { id: 21, english: 'commute', phonetic: '/kəˈmjuːt/', french: 'naveter', example: 'I commute to work by train every day.', exampleTranslation: 'Je navette pour le travail en train tous les jours.', category: 'Daily', level: 'A2', difficulty: 2 },
  { id: 22, english: 'groceries', phonetic: '/ˈɡroʊsəriz/', french: 'courses', example: 'I need to buy groceries for the week.', exampleTranslation: 'Je dois faire les courses pour la semaine.', category: 'Daily', level: 'A1', difficulty: 1 },
  { id: 23, english: 'chores', phonetic: '/tʃɔːrz/', french: 'tâches ménagères', example: 'We share the household chores.', exampleTranslation: 'Nous partageons les tâches ménagères.', category: 'Daily', level: 'A2', difficulty: 2 },
  { id: 24, english: 'appointment', phonetic: '/əˈpɔɪntmənt/', french: 'rendez-vous', example: 'I have a doctor\'s appointment at 3 PM.', exampleTranslation: 'J\'ai un rendez-vous chez le médecin à 15h.', category: 'Daily', level: 'A2', difficulty: 2 },
  { id: 25, english: 'exhausted', phonetic: '/ɪɡˈzɔːstɪd/', french: 'épuisé', example: 'After the marathon, I was completely exhausted.', exampleTranslation: 'Après le marathon, j\'étais complètement épuisé.', category: 'Daily', level: 'B1', difficulty: 3 },
  { id: 26, english: 'neighborhood', phonetic: '/ˈneɪbərhʊd/', french: 'quartier', example: 'We live in a quiet neighborhood.', exampleTranslation: 'Nous vivons dans un quartier calme.', category: 'Daily', level: 'A2', difficulty: 2 },
  { id: 27, english: 'routine', phonetic: '/ruːˈtiːn/', french: 'routine', example: 'My morning routine includes exercise and coffee.', exampleTranslation: 'Ma routine matinale inclut de l\'exercice et du café.', category: 'Daily', level: 'A2', difficulty: 2 },
  { id: 28, english: 'laundry', phonetic: '/ˈlɔːndri/', french: 'lessive', example: 'I do my laundry every Sunday.', exampleTranslation: 'Je fais ma lessive chaque dimanche.', category: 'Daily', level: 'A1', difficulty: 1 },
  { id: 29, english: 'relax', phonetic: '/rɪˈlæks/', french: 'se détendre', example: 'I like to relax with a good book.', exampleTranslation: 'J\'aime me détendre avec un bon livre.', category: 'Daily', level: 'A1', difficulty: 1 },
  { id: 30, english: 'schedule', phonetic: '/ˈskedʒuːl/', french: 'programme', example: 'Check your schedule for the meeting time.', exampleTranslation: 'Vérifiez votre programme pour l\'heure de la réunion.', category: 'Daily', level: 'A2', difficulty: 2 },

  // Travel (10)
  { id: 31, english: 'itinerary', phonetic: '/aɪˈtɪnəreri/', french: 'itinéraire', example: 'Our itinerary includes stops in Paris and Rome.', exampleTranslation: 'Notre itinéraire inclut des arrêts à Paris et Rome.', category: 'Travel', level: 'B1', difficulty: 3 },
  { id: 32, english: 'boarding pass', phonetic: '/ˈbɔːrdɪŋ pæs/', french: 'carte d\'embarquement', example: 'Please have your boarding pass ready.', exampleTranslation: 'Veuillez avoir votre carte d\'embarquement prête.', category: 'Travel', level: 'A2', difficulty: 2 },
  { id: 33, english: 'accommodation', phonetic: '/əˌkɒməˈdeɪʃn/', french: 'hébergement', example: 'We booked accommodation near the beach.', exampleTranslation: 'Nous avons réservé un hébergement près de la plage.', category: 'Travel', level: 'B1', difficulty: 3 },
  { id: 34, english: 'customs', phonetic: '/ˈkʌstəmz/', french: 'douane', example: 'You must go through customs when entering the country.', exampleTranslation: 'Vous devez passer la douane en entrant dans le pays.', category: 'Travel', level: 'B1', difficulty: 3 },
  { id: 35, english: 'luggage', phonetic: '/ˈlʌɡɪdʒ/', french: 'bagages', example: 'Please collect your luggage at carousel 3.', exampleTranslation: 'Veuillez récupérer vos bagages au carrousel 3.', category: 'Travel', level: 'A2', difficulty: 2 },
  { id: 36, english: 'souvenir', phonetic: '/ˌsuːvəˈnɪr/', french: 'souvenir', example: 'I bought a souvenir for my friend.', exampleTranslation: 'J\'ai acheté un souvenir pour mon ami.', category: 'Travel', level: 'A2', difficulty: 2 },
  { id: 37, english: 'currency', phonetic: '/ˈkʌrənsi/', french: 'devise', example: 'What currency do they use in Japan?', exampleTranslation: 'Quelle devise utilise-t-on au Japon ?', category: 'Travel', level: 'B1', difficulty: 3 },
  { id: 38, english: 'departure', phonetic: '/dɪˈpɑːrtʃər/', french: 'départ', example: 'The departure time has been delayed.', exampleTranslation: 'L\'heure de départ a été retardée.', category: 'Travel', level: 'A2', difficulty: 2 },
  { id: 39, english: 'passport', phonetic: '/ˈpæspɔːrt/', french: 'passeport', example: 'Don\'t forget to bring your passport.', exampleTranslation: 'N\'oubliez pas d\'apporter votre passeport.', category: 'Travel', level: 'A1', difficulty: 1 },
  { id: 40, english: 'explore', phonetic: '/ɪkˈsplɔːr/', french: 'explorer', example: 'We spent the day exploring the old city.', exampleTranslation: 'Nous avons passé la journée à explorer la vieille ville.', category: 'Travel', level: 'A2', difficulty: 2 },

  // Food (10)
  { id: 41, english: 'appetizer', phonetic: '/ˈæpɪtaɪzər/', french: 'entrée', example: 'We ordered bruschetta as an appetizer.', exampleTranslation: 'Nous avons commandé de la bruschetta en entrée.', category: 'Food', level: 'B1', difficulty: 3 },
  { id: 42, english: 'recipe', phonetic: '/ˈresəpi/', french: 'recette', example: 'Can you share the recipe for this cake?', exampleTranslation: 'Pouvez-vous partager la recette de ce gâteau ?', category: 'Food', level: 'A2', difficulty: 2 },
  { id: 43, english: 'ingredient', phonetic: '/ɪnˈɡriːdiənt/', french: 'ingrédient', example: 'Fresh ingredients make the best dishes.', exampleTranslation: 'Les ingrédients frais font les meilleurs plats.', category: 'Food', level: 'A2', difficulty: 2 },
  { id: 44, english: 'beverage', phonetic: '/ˈbevərɪdʒ/', french: 'boisson', example: 'What beverage would you like with your meal?', exampleTranslation: 'Quelle boisson souhaitez-vous avec votre repas ?', category: 'Food', level: 'B1', difficulty: 3 },
  { id: 45, english: 'delicious', phonetic: '/dɪˈlɪʃəs/', french: 'délicieux', example: 'This pasta is absolutely delicious!', exampleTranslation: 'Cette pâtes est absolument délicieuse !', category: 'Food', level: 'A1', difficulty: 1 },
  { id: 46, english: 'cuisine', phonetic: '/kwɪˈziːn/', french: 'cuisine', example: 'French cuisine is famous worldwide.', exampleTranslation: 'La cuisine française est célèbre dans le monde entier.', category: 'Food', level: 'B1', difficulty: 3 },
  { id: 47, english: 'allergic', phonetic: '/əˈlɜːrdʒɪk/', french: 'allergique', example: 'I\'m allergic to shellfish.', exampleTranslation: 'Je suis allergique aux fruits de mer.', category: 'Food', level: 'B1', difficulty: 3 },
  { id: 48, english: 'spicy', phonetic: '/ˈspaɪsi/', french: 'épicé', example: 'Do you like spicy food?', exampleTranslation: 'Aimez-vous la nourriture épicée ?', category: 'Food', level: 'A1', difficulty: 1 },
  { id: 49, english: 'organic', phonetic: '/ɔːrˈɡænɪk/', french: 'bio', example: 'I prefer to buy organic vegetables.', exampleTranslation: 'Je préfère acheter des légumes bio.', category: 'Food', level: 'A2', difficulty: 2 },
  { id: 50, english: 'portion', phonetic: '/ˈpɔːrʃn/', french: 'portion', example: 'The portions at this restaurant are generous.', exampleTranslation: 'Les portions dans ce restaurant sont généreuses.', category: 'Food', level: 'A2', difficulty: 2 },

  // Extra words (10)
  { id: 51, english: 'accomplish', phonetic: '/əˈkɒmplɪʃ/', french: 'accomplir', example: 'She accomplished all her goals this year.', exampleTranslation: 'Elle a accompli tous ses objectifs cette année.', category: 'Daily', level: 'B1', difficulty: 3 },
  { id: 52, english: 'persuade', phonetic: '/pərˈsweɪd/', french: 'persuader', example: 'He persuaded me to join the project.', exampleTranslation: 'Il m\'a persuadé de rejoindre le projet.', category: 'Business', level: 'B2', difficulty: 4 },
  { id: 53, english: 'infrastructure', phonetic: '/ˈɪnfrəstrʌktʃər/', french: 'infrastructure', example: 'Cloud infrastructure needs regular maintenance.', exampleTranslation: 'L\'infrastructure cloud nécessite une maintenance régulière.', category: 'Tech', level: 'C1', difficulty: 5 },
  { id: 54, english: 'straightforward', phonetic: '/ˌstreɪtfɔːrwərd/', french: 'simple', example: 'The solution was straightforward.', exampleTranslation: 'La solution était simple.', category: 'Tech', level: 'B2', difficulty: 4 },
  { id: 55, english: 'comprehensive', phonetic: '/ˌkɒmprɪˈhensɪv/', french: 'complet', example: 'We need a comprehensive analysis of the data.', exampleTranslation: 'Nous avons besoin d\'une analyse complète des données.', category: 'Business', level: 'C1', difficulty: 5 },
];

export const GRAMMAR_QUESTIONS: GrammarQuestion[] = [
  // Multiple Choice - Present Simple
  { id: 1, type: 'multiple-choice', topic: 'Present Simple', question: 'She ___ to work every day.', options: ['go', 'goes', 'going', 'gone'], answer: 'goes', explanation: 'Third person singular (he/she/it) adds -s in Present Simple.', level: 'A1' },
  { id: 2, type: 'multiple-choice', topic: 'Present Simple', question: 'They ___ coffee every morning.', options: ['drinks', 'drink', 'drinking', 'drank'], answer: 'drink', explanation: 'With plural subjects (they, we), use the base form without -s.', level: 'A1' },

  // Multiple Choice - Past Simple
  { id: 3, type: 'multiple-choice', topic: 'Past Simple', question: 'I ___ to Paris last summer.', options: ['go', 'goes', 'went', 'gone'], answer: 'went', explanation: '"Go" has an irregular past simple form: went.', level: 'A2' },
  { id: 4, type: 'multiple-choice', topic: 'Past Simple', question: 'She ___ a beautiful painting yesterday.', options: ['paint', 'paints', 'painted', 'painting'], answer: 'painted', explanation: 'Regular verbs add -ed in Past Simple.', level: 'A2' },

  // Multiple Choice - Present Perfect
  { id: 5, type: 'multiple-choice', topic: 'Present Perfect', question: 'I ___ never ___ sushi before.', options: ['have / eat', 'has / eaten', 'have / eaten', 'had / eat'], answer: 'have / eaten', explanation: 'Present Perfect uses have/has + past participle. "Eat" → "eaten".', level: 'B1' },
  { id: 6, type: 'multiple-choice', topic: 'Present Perfect', question: 'She ___ already ___ the report.', options: ['has / finish', 'have / finished', 'has / finished', 'had / finishes'], answer: 'has / finished', explanation: 'With "already", use Present Perfect. She → has + past participle.', level: 'B1' },

  // Multiple Choice - Conditionals
  { id: 7, type: 'multiple-choice', topic: 'First Conditional', question: 'If it ___ tomorrow, we ___ at home.', options: ['rains / will stay', 'will rain / stay', 'rain / stayed', 'rained / will stay'], answer: 'rains / will stay', explanation: 'First Conditional: If + Present Simple, will + base verb.', level: 'B1' },
  { id: 8, type: 'multiple-choice', topic: 'Second Conditional', question: 'If I ___ rich, I ___ around the world.', options: ['am / would travel', 'were / would travel', 'was / will travel', 'were / will travel'], answer: 'were / would travel', explanation: 'Second Conditional: If + Past Simple, would + base verb. Use "were" for all subjects.', level: 'B2' },

  // Multiple Choice - Passive Voice
  { id: 9, type: 'multiple-choice', topic: 'Passive Voice', question: 'The report ___ by the team yesterday.', options: ['wrote', 'was written', 'is written', 'has written'], answer: 'was written', explanation: 'Passive Voice: Subject + was/were + past participle + by + agent.', level: 'B1' },
  { id: 10, type: 'multiple-choice', topic: 'Passive Voice', question: 'English ___ all over the world.', options: ['speaks', 'is spoken', 'is speaking', 'spoke'], answer: 'is spoken', explanation: 'Present Simple Passive: Subject + is/am/are + past participle.', level: 'B1' },

  // Multiple Choice - Articles
  { id: 11, type: 'multiple-choice', topic: 'Articles', question: '___ sun rises in ___ east.', options: ['The / the', 'A / an', 'The / an', 'An / the'], answer: 'The / the', explanation: 'Unique objects need "the". Compass directions also use "the".', level: 'A2' },
  { id: 12, type: 'multiple-choice', topic: 'Articles', question: 'She is ___ engineer at ___ tech company.', options: ['an / a', 'a / an', 'an / the', 'a / a'], answer: 'an / a', explanation: '"Engineer" starts with a vowel sound → "an". "Tech" starts with a consonant → "a".', level: 'A2' },

  // Multiple Choice - Prepositions
  { id: 13, type: 'multiple-choice', topic: 'Prepositions', question: 'I\'m interested ___ learning new languages.', options: ['at', 'in', 'on', 'for'], answer: 'in', explanation: '"Interested in" is the correct preposition combination.', level: 'A2' },
  { id: 14, type: 'multiple-choice', topic: 'Prepositions', question: 'She depends ___ her team for support.', options: ['of', 'in', 'on', 'at'], answer: 'on', explanation: '"Depend on" is the correct preposition combination.', level: 'A2' },

  // Fill in the blank
  { id: 15, type: 'fill-blank', topic: 'Present Continuous', question: 'Look! It ___ outside right now.', answer: 'is raining', explanation: 'Present Continuous (be + verb-ing) for actions happening right now. Use "look!" as a signal.', level: 'A1' },
  { id: 16, type: 'fill-blank', topic: 'Past Continuous', question: 'While I ___ dinner, the phone rang.', answer: 'was cooking', explanation: 'Past Continuous (was/were + verb-ing) for an action in progress when another action interrupted it.', level: 'B1' },
  { id: 17, type: 'fill-blank', topic: 'Future Perfect', question: 'By next year, I ___ 500 English words.', answer: 'will have learned', explanation: 'Future Perfect (will have + past participle) for actions completed before a future time.', level: 'B2' },
  { id: 18, type: 'fill-blank', topic: 'Modal Verbs', question: 'You ___ wear a seatbelt at all times. It\'s the law.', answer: 'must', explanation: '"Must" expresses obligation and necessity.', level: 'A2' },
  { id: 19, type: 'fill-blank', topic: 'Comparatives', question: 'This exercise is ___ than the last one.', answer: 'more difficult', explanation: 'For adjectives with 3+ syllables, use "more + adjective" for comparatives.', level: 'A2' },
  { id: 20, type: 'fill-blank', topic: 'Relative Clauses', question: 'The woman ___ lives next door is a teacher.', answer: 'who', explanation: '"Who" is used for people as the subject of a relative clause.', level: 'B1' },
  { id: 21, type: 'fill-blank', topic: 'Gerunds & Infinitives', question: 'I enjoy ___ books in my free time.', answer: 'reading', explanation: 'After "enjoy", use a gerund (verb + -ing).', level: 'B1' },
  { id: 22, type: 'fill-blank', topic: 'Third Conditional', question: 'If I ___ studied harder, I would have passed the exam.', answer: 'had', explanation: 'Third Conditional: If + had + past participle, would have + past participle.', level: 'B2' },
  { id: 23, type: 'fill-blank', topic: 'Reported Speech', question: 'She said that she ___ tired.', answer: 'was', explanation: 'In reported speech, present simple changes to past simple: "am" → "was".', level: 'B1' },
  { id: 24, type: 'fill-blank', topic: 'Quantifiers', question: 'There aren\'t ___ people at the meeting.', answer: 'many', explanation: '"Many" is used with countable nouns in negative sentences.', level: 'A2' },

  // Sentence ordering
  { id: 25, type: 'sentence-order', topic: 'Word Order', question: 'every / She / morning / exercises', answer: 'She exercises every morning.', explanation: 'Standard word order: Subject + Verb + Time expression.', level: 'A1' },
  { id: 26, type: 'sentence-order', topic: 'Word Order', question: 'the / have / finished / report / I / already', answer: 'I have already finished the report.', explanation: 'Already comes between the auxiliary verb (have) and the past participle.', level: 'B1' },
  { id: 27, type: 'sentence-order', topic: 'Questions', question: 'you / do / What / do / weekends / on / ?', answer: 'What do you do on weekends?', explanation: 'Question word + auxiliary verb + subject + main verb + time.', level: 'A1' },
  { id: 28, type: 'sentence-order', topic: 'Negative Sentences', question: 'never / They / meat / eat', answer: 'They never eat meat.', explanation: 'Frequency adverbs (never, always, often) go before the main verb.', level: 'A2' },
  { id: 29, type: 'sentence-order', topic: 'Passive Voice', question: 'was / The / built / in / bridge / 1889', answer: 'The bridge was built in 1889.', explanation: 'Passive: Subject + be + past participle + time expression.', level: 'B1' },
  { id: 30, type: 'sentence-order', topic: 'Present Perfect', question: 'lived / have / here / I / for / years / five', answer: 'I have lived here for five years.', explanation: 'Present Perfect: Subject + have/has + past participle + duration.', level: 'B1' },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_word', title: 'First Steps', description: 'Learn your first word', icon: '🎯', requirement: 1, type: 'words', unlocked: false },
  { id: 'ten_words', title: 'Word Collector', description: 'Master 10 words', icon: '📚', requirement: 10, type: 'words', unlocked: false },
  { id: 'twenty_five_words', title: 'Vocabulary Builder', description: 'Master 25 words', icon: '🏗️', requirement: 25, type: 'words', unlocked: false },
  { id: 'fifty_words', title: 'Word Master', description: 'Master all 55 words', icon: '👑', requirement: 55, type: 'words', unlocked: false },
  { id: 'streak_3', title: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', requirement: 3, type: 'streak', unlocked: false },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', requirement: 7, type: 'streak', unlocked: false },
  { id: 'streak_30', title: 'Unstoppable', description: 'Maintain a 30-day streak', icon: '🌟', requirement: 30, type: 'streak', unlocked: false },
  { id: 'accuracy_80', title: 'Sharp Mind', description: 'Reach 80% accuracy', icon: '🧠', requirement: 80, type: 'accuracy', unlocked: false },
  { id: 'accuracy_95', title: 'Perfectionist', description: 'Reach 95% accuracy', icon: '💎', requirement: 95, type: 'accuracy', unlocked: false },
  { id: 'challenge_5', title: 'Challenge Seeker', description: 'Complete 5 daily challenges', icon: '🏆', requirement: 5, type: 'challenges', unlocked: false },
  { id: 'challenge_20', title: 'Champion', description: 'Complete 20 daily challenges', icon: '🎖️', requirement: 20, type: 'challenges', unlocked: false },
  { id: 'grammar_10', title: 'Grammar Guru', description: 'Complete 10 grammar exercises', icon: '📝', requirement: 10, type: 'grammar', unlocked: false },
];

export const GRAMMAR_TOPICS = [
  { id: 'present-simple', name: 'Present Simple', level: 'A1', description: 'Habits, facts, and routines' },
  { id: 'present-continuous', name: 'Present Continuous', level: 'A1', description: 'Actions happening now' },
  { id: 'past-simple', name: 'Past Simple', level: 'A2', description: 'Completed actions in the past' },
  { id: 'present-perfect', name: 'Present Perfect', level: 'B1', description: 'Past actions with present relevance' },
  { id: 'past-continuous', name: 'Past Continuous', level: 'B1', description: 'Actions in progress in the past' },
  { id: 'conditionals', name: 'Conditionals', level: 'B1', description: 'If-then statements' },
  { id: 'passive-voice', name: 'Passive Voice', level: 'B1', description: 'Focus on the action, not the actor' },
  { id: 'articles', name: 'Articles (A/An/The)', level: 'A2', description: 'Using a, an, and the correctly' },
  { id: 'prepositions', name: 'Prepositions', level: 'A2', description: 'In, on, at, and more' },
  { id: 'modal-verbs', name: 'Modal Verbs', level: 'A2', description: 'Can, could, must, should, etc.' },
  { id: 'comparatives', name: 'Comparatives & Superlatives', level: 'A2', description: 'Comparing things' },
  { id: 'relative-clauses', name: 'Relative Clauses', level: 'B1', description: 'Who, which, that, where' },
  { id: 'gerunds-infinitives', name: 'Gerunds & Infinitives', level: 'B1', description: 'Verb patterns' },
  { id: 'future-perfect', name: 'Future Perfect', level: 'B2', description: 'Actions before a future point' },
  { id: 'third-conditional', name: 'Third Conditional', level: 'B2', description: 'Hypothetical past situations' },
  { id: 'reported-speech', name: 'Reported Speech', level: 'B1', description: 'Reporting what someone said' },
  { id: 'quantifiers', name: 'Quantifiers', level: 'A2', description: 'Much, many, few, little, etc.' },
  { id: 'word-order', name: 'Word Order', level: 'A1', description: 'Basic sentence structure' },
  { id: 'questions', name: 'Questions', level: 'A1', description: 'Forming questions correctly' },
  { id: 'negative-sentences', name: 'Negative Sentences', level: 'A1', description: 'Making sentences negative' },
];

export const FAKE_LEADERBOARD = [
  { name: 'Emma L.', score: 950, avatar: '👩‍💻' },
  { name: 'Lucas M.', score: 920, avatar: '👨‍🎓' },
  { name: 'Sophie R.', score: 880, avatar: '👩‍🔬' },
  { name: 'You', score: 0, avatar: '🌟', isUser: true },
  { name: 'Alex T.', score: 750, avatar: '👨‍💼' },
  { name: 'Marie K.', score: 710, avatar: '👩‍🎨' },
  { name: 'Tom B.', score: 680, avatar: '🧑‍🚀' },
  { name: 'Léa D.', score: 650, avatar: '👩‍🏫' },
];
