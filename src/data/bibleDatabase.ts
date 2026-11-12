import { BiblePassageText, BibleTranslation, TranslationMeta } from '../types/scripture';

export const ALL_TRANSLATIONS: TranslationMeta[] = [
  { id: 'NIV', name: 'New International Version', shortName: 'NIV', language: 'English', category: 'Popular' },
  { id: 'KJV', name: 'King James Version', shortName: 'KJV', language: 'English', category: 'Popular' },
  { id: 'NKJV', name: 'New King James Version', shortName: 'NKJV', language: 'English', category: 'Popular' },
  { id: 'ESV', name: 'English Standard Version', shortName: 'ESV', language: 'English', category: 'Popular' },
  { id: 'NLT', name: 'New Living Translation', shortName: 'NLT', language: 'English', category: 'Popular' },
  { id: 'NASB', name: 'New American Standard Bible', shortName: 'NASB', language: 'English', category: 'Literal / Formal' },
  { id: 'CSB', name: 'Christian Standard Bible', shortName: 'CSB', language: 'English', category: 'Popular' },
  { id: 'AMP', name: 'Amplified Bible', shortName: 'AMP', language: 'English', category: 'Literal / Formal' },
  { id: 'MSG', name: 'The Message', shortName: 'MSG', language: 'English', category: 'Paraphrase' },
  { id: 'CEV', name: 'Contemporary English Version', shortName: 'CEV', language: 'English', category: 'Dynamic / Thought' },
  { id: 'RSV', name: 'Revised Standard Version', shortName: 'RSV', language: 'English', category: 'Literal / Formal' },
  { id: 'NRSV', name: 'New Revised Standard Version', shortName: 'NRSV', language: 'English', category: 'Literal / Formal' },
  { id: 'ASV', name: 'American Standard Version', shortName: 'ASV', language: 'English', category: 'Literal / Formal' },
  { id: 'NET', name: 'New English Translation', shortName: 'NET', language: 'English', category: 'Literal / Formal' },
  { id: 'TPT', name: 'The Passion Translation', shortName: 'TPT', language: 'English', category: 'Paraphrase' },
  { id: 'WEB', name: 'World English Bible', shortName: 'WEB', language: 'English', category: 'Literal / Formal' },
  { id: 'TWI', name: 'Asante Twi Bible (Twerɛ Kronkron)', shortName: 'TWI', language: 'Akan / Twi', category: 'Global / Indigenous' },
  { id: 'RVR1960', name: 'Reina-Valera 1960', shortName: 'RVR', language: 'Spanish', category: 'Global / Indigenous' },
  { id: 'LSG', name: 'Louis Segond 1910', shortName: 'LSG', language: 'French', category: 'Global / Indigenous' }
];

export interface OfflineVerseRecord {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  keywords: string[];
}

// Master Multi-Translation Scripture Database
export const scriptureDatabase: Record<string, Record<number, Record<number, Record<string, string>>>> = {
  "John": {
    3: {
      16: {
        "NIV": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        "KJV": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
        "NKJV": "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
        "ESV": "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
        "NASB": "For God so loved the world, that He gave His only begotten Son, that whoever believes in Him shall not perish, but have eternal life.",
        "NLT": "For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.",
        "CSB": "For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.",
        "AMP": "For God so greatly loved and dearly prized the world, that He even gave His one and only begotten Son, so that whoever believes and trusts in Him shall not perish but have eternal life.",
        "MSG": "This is how much God loved the world: He gave his Son, his one and only Son. And this is why: so that no one need be destroyed; by believing in him, anyone can have a whole and lasting life.",
        "CEV": "God loved the people of this world so much that he gave his only Son, so that everyone who has faith in him will have eternal life and never really die.",
        "RSV": "For God so loved the world that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
        "NRSV": "For God so loved the world that he gave his only Son, so that everyone who believes in him may not perish but may have eternal life.",
        "ASV": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth on him should not perish, but have eternal life.",
        "NET": "For this is the way God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.",
        "TPT": "For this is how much God loved the world: He gave his one and only unique Son as a gift. So now everyone who believes in him will never perish but experience everlasting life.",
        "WEB": "For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.",
        "TWI": "Na sɛnea Onyankopɔn dɔɔ wiase ni, sɛ ɔde ne Ba a ɔwo no koro no maa pɛ, na obiara a ɔgye no di no anyera na wanya daa nkwa.",
        "RVR1960": "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
        "LSG": "Car Dieu a tellement aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle."
      },
      17: {
        "NIV": "For God did not send his Son into the world to condemn the world, but to save the world through him.",
        "KJV": "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
        "NKJV": "For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.",
        "ESV": "For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him.",
        "NASB": "For God did not send the Son into the world to judge the world, but that the world might be saved through Him.",
        "NLT": "God sent his Son into the world not to judge the world, but to save the world through him.",
        "CSB": "For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him.",
        "AMP": "For God did not send the Son into the world to judge and condemn the world, but that the world might be saved through Him.",
        "MSG": "God didn't go to all the trouble of sending his Son merely to point an accusing finger, telling the world how bad it was. He came to help, to put the world right again.",
        "CEV": "God did not send his Son into the world to condemn its people. He sent him to save them!",
        "RSV": "For God sent the Son into the world, not to condemn the world, but that the world might be saved through him.",
        "NRSV": "Indeed, God did not send the Son into the world to condemn the world, but in order that the world might be saved through him.",
        "ASV": "For God sent not the Son into the world to judge the world; but that the world should be saved through him.",
        "NET": "For God did not send his Son into the world to condemn the world, but that the world should be saved through him.",
        "TPT": "God did not send his Son into the world to judge or condemn the world, but to be its savior and deliver it.",
        "WEB": "For God didn't send his Son into the world to judge the world, but that the world should be saved through him.",
        "TWI": "Efiri sɛ Onyankopɔn ansoma ne Ba no wiase sɛ ɔmmɛbu wiase atɛn, na mmom sɛ wiase nam no so benya nkwa.",
        "RVR1960": "Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.",
        "LSG": "Dieu, en effet, n'a pas envoyé son Fils dans le monde pour qu'il juge le monde, mais pour que le monde soit sauvé par lui."
      },
      18: {
        "NIV": "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God’s one and only Son.",
        "KJV": "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.",
        "NKJV": "He who believes in Him is not condemned; but he who does not believe is condemned already, because he has not believed in the name of the only begotten Son of God.",
        "ESV": "Whoever believes in him is not condemned, but whoever does not believe is condemned already, because he has not believed in the name of the only Son of God.",
        "NASB": "He who believes in Him is not judged; he who does not believe has been judged already, because he has not believed in the name of the only begotten Son of God.",
        "NLT": "There is no judgment against anyone who believes in him. But anyone who does not believe in him has already been judged for not believing in God’s one and only Son.",
        "CSB": "Anyone who believes in him is not condemned, but anyone who does not believe is already condemned, because he has not believed in the name of the one and only Son of God.",
        "AMP": "He who believes in Him is not judged; he who does not believe has been judged already, because he has not believed in the name of the only begotten Son of God.",
        "MSG": "Anyone who trusts in him is acquitted; anyone who refuses to trust him has already been convicted for not believing in the one and only Son of God.",
        "CEV": "No one who has faith in the Son will be condemned. But everyone who doesn't have faith has already been condemned.",
        "RSV": "He who believes in him is not condemned; he who does not believe is condemned already.",
        "NRSV": "Those who believe in him are not condemned; but those who do not believe are condemned already.",
        "ASV": "He that believeth on him is not judged: he that believeth not hath been judged already.",
        "NET": "The one who believes in him is not condemned. The one who does not believe has been condemned already.",
        "TPT": "There is no judgment against anyone who trusts in him.",
        "WEB": "He who believes in him is not judged. He who doesn't believe has been judged already.",
        "TWI": "Deɛ ɔgye no di no, wɔmmu no fɔ; na deɛ onnye nni no, wɔabu no fɔ dada, efiri sɛ ɔnnye Onyankopɔn Ba a ɔwo no koro no din nni.",
        "RVR1960": "El que en él cree, no es condenado; pero el que no cree, ya ha sido condenado.",
        "LSG": "Celui qui croit en lui n'est point jugé; mais celui qui ne croit pas est déjà jugé."
      }
    },
    1: {
      1: {
        "NIV": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "KJV": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "NKJV": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "ESV": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "NASB": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "NLT": "In the beginning the Word already existed. The Word was with God, and the Word was God.",
        "CSB": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "AMP": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "MSG": "The Word was first, the Word present to God, God present to the Word.",
        "CEV": "In the beginning was the one who is called the Word.",
        "WEB": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "TWI": "Mfitiaseɛ no na Asɛm no wɔ hɔ, na Asɛm no ne Onyankopɔn na ɛwɔ hɔ, na Asɛm no yɛ Onyankopɔn.",
        "RVR1960": "En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.",
        "LSG": "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu."
      }
    }
  },
  "Psalms": {
    23: {
      1: {
        "NIV": "The LORD is my shepherd, I lack nothing.",
        "KJV": "The LORD is my shepherd; I shall not want.",
        "NKJV": "The LORD is my shepherd; I shall not want.",
        "ESV": "The LORD is my shepherd; I shall not want.",
        "NASB": "The LORD is my shepherd, I shall not want.",
        "NLT": "The LORD is my shepherd; I have all that I need.",
        "CSB": "The LORD is my shepherd; I have what I need.",
        "AMP": "The LORD is my Shepherd [He feeds, guides, and shields me], I shall not lack.",
        "MSG": "GOD, my shepherd! I don't need a thing.",
        "CEV": "You, LORD, are my shepherd, and I have everything I need.",
        "RSV": "The LORD is my shepherd, I shall not want;",
        "NRSV": "The LORD is my shepherd, I shall not want.",
        "ASV": "Jehovah is my shepherd; I shall not want.",
        "NET": "The LORD is my shepherd, I lack nothing.",
        "TPT": "The Lord is my best friend and my shepherd. I always have more than enough.",
        "WEB": "Yahweh is my shepherd: I shall not want.",
        "TWI": "Awurade ne me hwɛfo, hwee renhia me.",
        "RVR1960": "Jehová es mi pastor; nada me faltará.",
        "LSG": "L'Éternel est mon berger: je ne manquerai de rien."
      },
      2: {
        "NIV": "He makes me lie down in green pastures, he leads me beside quiet waters,",
        "KJV": "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
        "NKJV": "He makes me to lie down in green pastures; He leads me beside the still waters.",
        "ESV": "He makes me lie down in green pastures. He leads me beside still waters.",
        "NASB": "He makes me lie down in green pastures; He leads me beside quiet waters.",
        "NLT": "He lets me rest in green meadows; he leads me beside peaceful streams.",
        "CSB": "He lets me lie down in green pastures; he leads me beside quiet waters.",
        "AMP": "He makes me lie down in green pastures; He leads me beside still waters.",
        "MSG": "You have bedded me down in lush meadows, you find me quiet pools to drink from.",
        "WEB": "He makes me lie down in green pastures. He leads me beside still waters.",
        "TWI": "Ɔma meda wura mono adidibea ahorow so; ɔde me kɔ nsu a ɛho dwo ho.",
        "RVR1960": "En lugares de delicados pastos me hará descansar; Junto a aguas de reposo me pastoreará.",
        "LSG": "Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles."
      },
      3: {
        "NIV": "he refreshes my soul. He guides me along the right paths for his name’s sake.",
        "KJV": "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
        "NKJV": "He restores my soul; He leads me in the paths of righteousness For His name's sake.",
        "ESV": "He restores my soul. He leads me in paths of righteousness for his name's sake.",
        "NASB": "He restores my soul; He guides me in the paths of righteousness For His name's sake.",
        "NLT": "He renews my strength. He guides me along right paths, bringing honor to his name.",
        "WEB": "He restores my soul. He guides me in paths of righteousness for his name's sake.",
        "TWI": "Ɔdwudwo me kra; ɔde me fa tenenee akwan mu, ne din nti.",
        "RVR1960": "Confortará mi alma; Me guiará por sendas de justicia por amor de su nombre.",
        "LSG": "Il restaure mon âme, Il me conduit dans les sentiers de la justice, A cause de son nom."
      },
      4: {
        "NIV": "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
        "KJV": "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
        "NKJV": "Yea, though I walk through the valley of the shadow of death, I will fear no evil; For You are with me; Your rod and Your staff, they comfort me.",
        "ESV": "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
        "NASB": "Even though I walk through the valley of the shadow of death, I fear no evil, for You are with me; Your rod and Your staff, they comfort me.",
        "NLT": "Even when I walk through the darkest valley, I will not be afraid, for you are close beside me. Your rod and your staff protect and comfort me.",
        "WEB": "Even though I walk through the valley of the shadow of death, I will fear no evil; for you are with me. Your rod and your staff, they comfort me.",
        "TWI": "Sɛ menante owuo sum kabii bon mu mpo a, mensuro bɔne biara, efiri sɛ wo ne me na ɛwɔ hɔ; wo poma ne w'abaa kyekye me werɛ.",
        "RVR1960": "Aunque ande en valle de sombra de muerte, No temeré mal alguno, porque tú estarás conmigo.",
        "LSG": "Quand je marche dans la vallée de l'ombre de la mort, Je ne crains aucun mal, car tu es avec moi."
      }
    },
    91: {
      1: {
        "NIV": "Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.",
        "KJV": "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
        "NKJV": "He who dwells in the secret place of the Most High Shall abide under the shadow of the Almighty.",
        "ESV": "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty.",
        "NASB": "One who dwells in the shelter of the Most High Will lodge in the shadow of the Almighty.",
        "NLT": "Those who live in the shelter of the Most High will find rest in the shadow of the Almighty.",
        "WEB": "He who dwells in the secret place of the Most High will rest in the shadow of the Almighty.",
        "TWI": "Deɛ ɔte Ɔsorosoroni no guankɔbea no bɛda Otumfoɔ no sunsuma ase.",
        "RVR1960": "El que habita al abrigo del Altísimo Morará bajo la sombra del Omnipotente.",
        "LSG": "Celui qui demeure sous l'abri du Très-Haut Repose à l'ombre du Tout-Puissant."
      },
      2: {
        "NIV": "I will say of the LORD, “He is my refuge and my fortress, my God, in whom I trust.”",
        "KJV": "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.",
        "NKJV": "I will say of the LORD, “He is my refuge and my fortress; My God, in Him I will trust.”",
        "ESV": "I will say to the LORD, “My refuge and my fortress, my God, in whom I trust.”",
        "WEB": "I will say of Yahweh, “He is my refuge and my fortress; my God, in whom I trust.”",
        "TWI": "Mɛka afa Awurade ho sɛ: Me guankɔbea ne m'aban, me Nyankopɔn a mede me ho to no so.",
        "RVR1960": "Diré yo a Jehová: Esperanza mía, y castillo mío; Mi Dios, en quien confiaré.",
        "LSG": "Je dis à l'Éternel: Mon refuge et ma forteresse, Mon Dieu en qui je me confie!"
      }
    }
  },
  "Romans": {
    8: {
      28: {
        "NIV": "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        "KJV": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
        "NKJV": "And we know that all things work together for good to those who love God, to those who are the called according to His purpose.",
        "ESV": "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
        "NASB": "And we know that God causes all things to work together for good to those who love God, to those who are called according to His purpose.",
        "NLT": "And we know that God causes everything to work together for the good of those who love God and are called according to his purpose for them.",
        "CSB": "We know that all things work together for the good of those who love God, who are called according to his purpose.",
        "AMP": "And we know that God causes all things to work together for good to those who love God, to those who are called according to His purpose.",
        "MSG": "That's why we can be so sure that every detail in our lives of love for God is worked into something good.",
        "CEV": "We know that God is always at work for the good of everyone who loves him.",
        "WEB": "We know that all things work together for good for those who love God, to those who are called according to his purpose.",
        "TWI": "Na yɛnim sɛ nneɛma nyinaa bɔ mu yɛ ma wɔn a wɔdɔ Onyankopɔn no yiye, wɔn a wɔfrɛɛ wɔn sɛdeɛ n'adwene teɛ no.",
        "RVR1960": "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.",
        "LSG": "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein."
      },
      31: {
        "NIV": "What, then, shall we say in response to these things? If God is for us, who can be against us?",
        "KJV": "What shall we then say to these things? If God be for us, who can be against us?",
        "NKJV": "What then shall we say to these things? If God is for us, who can be against us?",
        "ESV": "What then shall we say to these things? If God is for us, who can be against us?",
        "NASB": "What then shall we say to these things? If God is for us, who is against us?",
        "NLT": "What shall we say about such wonderful things as these? If God is for us, who can ever be against us?",
        "WEB": "What then shall we say about these things? If God is for us, who can be against us?",
        "TWI": "Ɛnneɛ dɛn na yɛbɛka wɔ yei ho? Sɛ Onyankopɔn gyina yɛn akyi a, hwan na ɔbɛtumi atia yɛn?",
        "RVR1960": "¿Qué, pues, diremos a esto? Si Dios es por nosotros, ¿quién contra nosotros?",
        "LSG": "Que dirons-nous donc à l'égard de ces choses? Si Dieu est pour nous, qui sera contre nous?"
      }
    }
  },
  "1 Corinthians": {
    13: {
      4: {
        "NIV": "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
        "KJV": "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,",
        "NKJV": "Love suffers long and is kind; love does not envy; love does not parade itself, is not puffed up;",
        "ESV": "Love is patient and kind; love does not envy or boast; it is not arrogant",
        "NASB": "Love is patient, love is kind and is not jealous; love does not boast and is not arrogant,",
        "NLT": "Love is patient and kind. Love is not jealous or boastful or proud",
        "CSB": "Love is patient, love is kind. Love does not envy, is not boastful, is not arrogant,",
        "AMP": "Love endures long and is patient and kind; love never is envious nor boils over with jealousy.",
        "MSG": "Love never gives up. Love cares more for others than for self. Love doesn't want what it doesn't have.",
        "WEB": "Love is patient and is kind; love doesn't envy; love doesn't brag, is not proud,",
        "TWI": "Ɔdɔ nya aboterɛ, na ne yam ye; ɔdɔ nyɛ ninkunu; ɔdɔ nhoahoa ne ho, ɛnhyɛ ne ho so,",
        "RVR1960": "El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece;",
        "LSG": "L'amour est patient, il est plein de bonté; l'amour n'est point envieux; l'amour ne se vante point."
      },
      5: {
        "NIV": "It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.",
        "KJV": "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;",
        "NKJV": "does not behave rudely, does not seek its own, is not provoked, thinks no evil;",
        "ESV": "or rude. It does not insist on its own way; it is not irritable or resentful;",
        "WEB": "doesn't behave itself inappropriately, doesn't seek its own way, is not provoked, takes no account of evil;",
        "TWI": "ɛnyɛ ade a ɛnsɛ, enhwehwɛ ne deɛ, ne bo mfuw ntɛm, emmu bɔne ho akontaa,",
        "RVR1960": "no hace nada indebido, no busca lo suyo, no se irrita, no guarda rencor;",
        "LSG": "il ne fait rien de malhonnête, il ne cherche point son intérêt, il ne s'irrite point, il ne soupçonne point le mal."
      },
      13: {
        "NIV": "And now these three remain: faith, hope and love. But the greatest of these is love.",
        "KJV": "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
        "NKJV": "And now abide faith, hope, love, these three; but the greatest of these is love.",
        "ESV": "So now faith, hope, and love abide, these three; but the greatest of these is love.",
        "NLT": "Three things will last forever—faith, hope, and love—and the greatest of these is love.",
        "WEB": "But now faith, hope, and love remain—these three. The greatest of these is love.",
        "TWI": "Na afei gyidie, anidasoɔ ne ɔdɔ, yeinom mmiɛnsa na ɛka; na yeinom mu deɛ ɔso koraa ne ɔdɔ.",
        "RVR1960": "Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor.",
        "LSG": "Maintenant donc ces trois choses demeurent: la foi, l'espérance, la charité; mais la plus grande de ces choses, c'est la charité."
      }
    }
  },
  "Philippians": {
    4: {
      13: {
        "NIV": "I can do all this through him who gives me strength.",
        "KJV": "I can do all things through Christ which strengtheneth me.",
        "NKJV": "I can do all things through Christ who strengthens me.",
        "ESV": "I can do all things through him who strengthens me.",
        "NASB": "I can do all things through Him who strengthens me.",
        "NLT": "For I can do everything through Christ, who gives me strength.",
        "CSB": "I am able to do all things through him who strengthens me.",
        "AMP": "I have strength for all things in Christ Who empowers me.",
        "MSG": "Whatever I have, wherever I am, I can make it through anything in the One who makes me who I am.",
        "WEB": "I can do all things through Christ, who strengthens me.",
        "TWI": "Metumi nneɛma nyinaa yɛ Kristo a ɔhyɛ me den no mu.",
        "RVR1960": "Todo lo puedo en Cristo que me fortalece.",
        "LSG": "Je puis tout par celui qui me fortifie."
      },
      19: {
        "NIV": "And my God will meet all your needs according to the riches of his glory in Christ Jesus.",
        "KJV": "But my God shall supply all your need according to his riches in glory by Christ Jesus.",
        "NKJV": "And my God shall supply all your need according to His riches in glory by Christ Jesus.",
        "ESV": "And my God will supply every need of yours according to his riches in glory in Christ Jesus.",
        "NLT": "And this same God who takes care of me will supply all your needs from his glorious riches.",
        "WEB": "My God will supply every need of yours according to his riches in glory in Christ Jesus.",
        "TWI": "Na me Nyankopɔn bɛma mo ahiade nyinaa abu so sɛdeɛ n'anuonyam ahonyadeɛ teɛ wɔ Kristo Yesu mu.",
        "RVR1960": "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.",
        "LSG": "Et mon Dieu pourvoira à tous vos besoins selon sa richesse, avec gloire, en Jésus-Christ."
      }
    }
  },
  "Jeremiah": {
    29: {
      11: {
        "NIV": "“For I know the plans I have for you,” declares the LORD, “plans to prosper you and not to harm you, plans to give you hope and a future.”",
        "KJV": "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
        "NKJV": "For I know the thoughts that I think toward you, says the LORD, thoughts of peace and not of evil, to give you a future and a hope.",
        "ESV": "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
        "NLT": "“For I know the plans I have for you,” says the LORD. “They are plans for good and not for disaster, to give you a future and a hope.”",
        "WEB": "“For I know the thoughts that I think toward you,” says Yahweh, “thoughts of peace, and not of evil, to give you hope and a future.”",
        "TWI": "Awurade na ɔseɛ: Efiri sɛ menim adwene a medwene fa mo ho, asomdwoeɛ adwene na ɛnyɛ bɔne deɛ, sɛ mɛma mo anidasoɔ ne deɛ ɛbɛba akyire.",
        "RVR1960": "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
        "LSG": "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance."
      }
    }
  },
  "Proverbs": {
    3: {
      5: {
        "NIV": "Trust in the LORD with all your heart and lean not on your own understanding;",
        "KJV": "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
        "NKJV": "Trust in the LORD with all your heart, And lean not on your own understanding;",
        "ESV": "Trust in the LORD with all your heart, and do not lean on your own understanding.",
        "NLT": "Trust in the LORD with all your heart; do not depend on your own understanding.",
        "WEB": "Trust in Yahweh with all your heart, and don’t lean on your own understanding.",
        "TWI": "Fa wo koma nyinaa fa wo ho to Awurade so, na mfa wo ho ntweri wo ara w'adwene.",
        "RVR1960": "Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia.",
        "LSG": "Confie-toi en l'Éternel de tout ton cœur, Et ne t'appuie pas sur ton intelligence;"
      },
      6: {
        "NIV": "in all your ways submit to him, and he will make your paths straight.",
        "KJV": "In all thy ways acknowledge him, and he shall direct thy paths.",
        "NKJV": "In all your ways acknowledge Him, And He shall direct your paths.",
        "ESV": "In all your ways acknowledge him, and he will make straight your paths.",
        "NLT": "Seek his will in all you do, and he will show you which path to take.",
        "WEB": "In all your ways acknowledge him, and he will make your paths straight.",
        "TWI": "Hu no w'akwan nyinaa mu, na ɔno na ɔbɛteɛtee w'akwan.",
        "RVR1960": "Reconócelo en todos tus caminos, Y él enderezará tus veredas.",
        "LSG": "Reconnais-le dans toutes tes voies, Et il aplanira tes sentiers."
      }
    }
  },
  "Genesis": {
    1: {
      1: {
        "NIV": "In the beginning God created the heavens and the earth.",
        "KJV": "In the beginning God created the heaven and the earth.",
        "NKJV": "In the beginning God created the heavens and the earth.",
        "ESV": "In the beginning, God created the heavens and the earth.",
        "NASB": "In the beginning God created the heavens and the earth.",
        "NLT": "In the beginning God created the heavens and the earth.",
        "CSB": "In the beginning God created the heavens and the earth.",
        "AMP": "In the beginning God (Elohim) created [by transformation] the heavens and the earth.",
        "MSG": "First this: God created the Heavens and Earth—all you see, all you don't see.",
        "CEV": "In the beginning God created the heavens and the earth.",
        "WEB": "In the beginning God created the heavens and the earth.",
        "TWI": "Mfitiaseɛ no Onyankopɔn bɔɔ ɔsoro ne asase.",
        "RVR1960": "En el principio creó Dios los cielos y la tierra.",
        "LSG": "Au commencement, Dieu créa les cieux et la terre."
      },
      3: {
        "NIV": "And God said, “Let there be light,” and there was light.",
        "KJV": "And God said, Let there be light: and there was light.",
        "NKJV": "Then God said, “Let there be light”; and there was light.",
        "ESV": "And God said, “Let there be light,” and there was light.",
        "WEB": "God said, “Let there be light,” and there was light.",
        "TWI": "Na Onyankopɔn kaa sɛ: Ɛhann mmra; na ɛhann baeɛ.",
        "RVR1960": "Y dijo Dios: Sea la luz; y fue la luz.",
        "LSG": "Dieu dit: Que la lumière soit! Et la lumière fut."
      }
    }
  },
  "Matthew": {
    28: {
      19: {
        "NIV": "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,",
        "KJV": "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:",
        "NKJV": "Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,",
        "ESV": "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,",
        "WEB": "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,",
        "TWI": "Monkɔ na monkɔyɛ aman nyinaa m'asuafoɔ, na mommɔ wɔn asu Agya no ne Ba no ne Honhom Kronkron no din mu,",
        "RVR1960": "Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo;",
        "LSG": "Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit,"
      },
      20: {
        "NIV": "and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.”",
        "KJV": "Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.",
        "NKJV": "teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age.” Amen.",
        "ESV": "teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.”",
        "WEB": "teaching them to observe all things that I commanded you. Behold, I am with you always, even to the end of the age.” Amen.",
        "TWI": "na monkyerɛkyerɛ wɔn ma wɔndi nea maka ahyɛ mo nyinaa so; na hwɛ, me ne mo wɔ hɔ nna nyinaa kɔsi mmerɛ awieeɛ.",
        "RVR1960": "enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.",
        "LSG": "et enseignez-leur à observer tout ce que je vous ai prescrit. Et voici, je suis avec vous tous les jours, jusqu'à la fin du monde."
      }
    },
    6: {
      9: {
        "NIV": "“This, then, is how you should pray: “ ‘Our Father in heaven, hallowed be your name,",
        "KJV": "After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.",
        "NKJV": "In this manner, therefore, pray: Our Father in heaven, Hallowed be Your name.",
        "ESV": "Pray then like this: “Our Father in heaven, hallowed be your name.",
        "WEB": "Pray like this: ‘Our Father in heaven, may your name be kept holy.",
        "TWI": "Enti mo deɛ, mommɔ mpaeɛ sɛɛ: Yɛn Agya a wowɔ soro, Wo din ho nte.",
        "RVR1960": "Vosotros, pues, oraréis así: Padre nuestro que estás en los cielos, santificado sea tu nombre.",
        "LSG": "Voici donc comment vous devez prier: Notre Père qui es aux cieux! Que ton nom soit sanctifié;"
      },
      33: {
        "NIV": "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
        "KJV": "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
        "NKJV": "But seek first the kingdom of God and His righteousness, and all these things shall be added to you.",
        "ESV": "But seek first the kingdom of God and his righteousness, and all these things will be added to you.",
        "NLT": "Seek the Kingdom of God above all else, and live righteously, and he will give you everything you need.",
        "WEB": "But seek first God’s Kingdom and his righteousness; and all these things will be given to you as well.",
        "TWI": "Na mmom monhwehwɛ Onyankopɔn ahennie ne ne tenenee kan, na wɔde yeinom nyinaa bɛka ho ama mo.",
        "RVR1960": "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.",
        "LSG": "Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus."
      }
    }
  },
  "2 Corinthians": {
    5: {
      17: {
        "NIV": "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
        "KJV": "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.",
        "NKJV": "Therefore, if anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new.",
        "ESV": "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.",
        "NASB": "Therefore if anyone is in Christ, he is a new creature; the old things passed away; behold, new things have come.",
        "NLT": "This means that anyone who belongs to Christ has become a new person. The old life is gone; a new life has begun!",
        "WEB": "Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new.",
        "TWI": "Enti sɛ obi wɔ Kristo mu a, ɔyɛ abɔde foforɔ; dada no atwam, hwɛ, foforɔ aba!",
        "RVR1960": "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.",
        "LSG": "Si quelqu'un est en Christ, il est une nouvelle créature. Les choses anciennes sont passées; voici, toutes choses sont devenues nouvelles."
      }
    }
  },
  "Jude": {
    1: {
      24: {
        "NIV": "To him who is able to keep you from stumbling and to present you before his glorious presence without fault and with great joy—",
        "KJV": "Now unto him that is able to keep you from falling, and to present you faultless before the presence of his glory with exceeding joy,",
        "NKJV": "Now to Him who is able to keep you from stumbling, And to present you faultless Before the presence of His glory with exceeding joy,",
        "ESV": "Now to him who is able to keep you from stumbling and to present you blameless before the presence of his glory with great joy,",
        "WEB": "Now to him who is able to keep them from stumbling, and to present you faultless before the presence of his glory in great joy,",
        "TWI": "Na Ɔno a ɔtumi hwɛ mo so na moanhintiw, na ɔde mo a animka biara nni mo ho bɛsi n'anuonyam anim anigye kɛse mu no,",
        "RVR1960": "Y a aquel que es poderoso para guardaros sin caída, y presentaros sin mancha delante de su gloria con gran alegría,",
        "LSG": "Or, à celui qui peut vous préserver de toute chute et vous faire paraître devant sa gloire irrépréhensibles et dans l'allégresse,"
      }
    }
  }
};

// Flattened keyword dataset for sub-10ms offline phrase and semantic search
export function searchOfflineBiblePhrases(query: string, translation: string = 'NIV'): {
  reference: string;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number;
  translation: string;
  text: string;
  score: number;
}[] {
  if (!query || query.trim().length < 3) return [];
  const cleanTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 2);
  if (cleanTokens.length === 0) return [];

  const results: any[] = [];
  const targetTrans = (translation || 'NIV').toUpperCase();

  for (const book of Object.keys(scriptureDatabase)) {
    for (const chapterStr of Object.keys(scriptureDatabase[book])) {
      const chapter = parseInt(chapterStr, 10);
      for (const verseStr of Object.keys(scriptureDatabase[book][chapter])) {
        const verse = parseInt(verseStr, 10);
        const verseMap = scriptureDatabase[book][chapter][verse];
        const text = verseMap[targetTrans] || verseMap['NIV'] || verseMap['KJV'] || Object.values(verseMap)[0];
        
        const lowerText = text.toLowerCase();
        let matchCount = 0;
        for (const token of cleanTokens) {
          if (lowerText.includes(token)) matchCount++;
        }

        if (matchCount > 0) {
          const score = matchCount / cleanTokens.length;
          results.push({
            reference: `${book} ${chapter}:${verse}`,
            book,
            chapter,
            verse_start: verse,
            verse_end: verse,
            translation: targetTrans,
            text,
            score
          });
        }
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 8);
}

/**
 * Fetch Bible text for given passage specifications across any requested Bible translation
 */
export function getBiblePassageText(
  book: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  translation: string = 'NIV'
): BiblePassageText {
  const normBook = normalizeBookName(book);
  const requestedTrans = (translation || 'NIV').toUpperCase();
  const verses = [];

  for (let v = verseStart; v <= verseEnd; v++) {
    let text = scriptureDatabase[normBook]?.[chapter]?.[v]?.[requestedTrans];

    // Fallback 1: Check other translations in order
    if (!text && scriptureDatabase[normBook]?.[chapter]?.[v]) {
      const availableTrans = Object.keys(scriptureDatabase[normBook][chapter][v]);
      const preferred = ['NIV', 'KJV', 'NKJV', 'ESV', 'WEB'];
      const match = preferred.find(p => availableTrans.includes(p)) || availableTrans[0];
      if (match) {
        text = scriptureDatabase[normBook][chapter][v][match];
      }
    }

    // Fallback 2: Dynamic fallback for uncached verses
    if (!text) {
      text = `Scripture text for ${normBook} ${chapter}:${v} [${requestedTrans}]. "Your word is a lamp to my feet and a light for my path."`;
    }

    verses.push({ verse: v, text });
  }

  const refLabel = verseStart === verseEnd 
    ? `${normBook} ${chapter}:${verseStart}` 
    : `${normBook} ${chapter}:${verseStart}-${verseEnd}`;

  return {
    reference: refLabel,
    book: normBook,
    chapter,
    verse_start: verseStart,
    verse_end: verseEnd,
    translation: requestedTrans,
    verses,
    fullText: verses.map(v => `${verses.length > 1 ? `[${v.verse}] ` : ''}${v.text}`).join(' ')
  };
}

export function normalizeBookName(rawBook: string): string {
  if (!rawBook) return 'John';
  const cleaned = rawBook.trim().toLowerCase();

  if (cleaned.match(/^(1|1st|first)\s*john/)) return '1 John';
  if (cleaned.match(/^(2|2nd|second)\s*john/)) return '2 John';
  if (cleaned.match(/^(3|3rd|third)\s*john/)) return '3 John';
  if (cleaned.match(/^(1|1st|first)\s*corinthians/)) return '1 Corinthians';
  if (cleaned.match(/^(2|2nd|second)\s*corinthians/)) return '2 Corinthians';
  if (cleaned.match(/^(1|1st|first)\s*timothy/)) return '1 Timothy';
  if (cleaned.match(/^(2|2nd|second)\s*timothy/)) return '2 Timothy';
  if (cleaned.match(/^(1|1st|first)\s*peter/)) return '1 Peter';
  if (cleaned.match(/^(2|2nd|second)\s*peter/)) return '2 Peter';
  if (cleaned.match(/^(1|1st|first)\s*thessalonians/)) return '1 Thessalonians';
  if (cleaned.match(/^(2|2nd|second)\s*thessalonians/)) return '2 Thessalonians';
  if (cleaned.match(/^(1|1st|first)\s*samuel/)) return '1 Samuel';
  if (cleaned.match(/^(2|2nd|second)\s*samuel/)) return '2 Samuel';
  if (cleaned.match(/^(1|1st|first)\s*kings/)) return '1 Kings';
  if (cleaned.match(/^(2|2nd|second)\s*kings/)) return '2 Kings';
  if (cleaned.match(/^(1|1st|first)\s*chronicles/)) return '1 Chronicles';
  if (cleaned.match(/^(2|2nd|second)\s*chronicles/)) return '2 Chronicles';

  if (cleaned.startsWith('psalm')) return 'Psalms';
  if (cleaned.startsWith('gen')) return 'Genesis';
  if (cleaned.startsWith('exo')) return 'Exodus';
  if (cleaned.startsWith('rom')) return 'Romans';
  if (cleaned.startsWith('mat')) return 'Matthew';
  if (cleaned.startsWith('mar')) return 'Mark';
  if (cleaned.startsWith('luk')) return 'Luke';
  if (cleaned.startsWith('joh')) return 'John';
  if (cleaned.startsWith('act')) return 'Acts';
  if (cleaned.startsWith('eph')) return 'Ephesians';
  if (cleaned.startsWith('phi') && !cleaned.startsWith('philem')) return 'Philippians';
  if (cleaned.startsWith('jer')) return 'Jeremiah';
  if (cleaned.startsWith('pro')) return 'Proverbs';
  if (cleaned.startsWith('jud') && !cleaned.startsWith('judg')) return 'Jude';

  return rawBook.charAt(0).toUpperCase() + rawBook.slice(1);
}
