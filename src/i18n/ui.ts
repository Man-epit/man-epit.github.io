// Interface text. Content text lives in src/content/.
export const UI = {
  en: { home: 'Home', projects: 'Projects', hackathons: 'Hackathons', contact: 'Contact',
    seeProjects: 'See projects', cv: 'Download CV', selectedWork: 'Selected work', allProjects: (n: number) => `All ${n} projects →`,
    hackTitle: 'Hackathons & awards', entries: (n: number) => `${n} entries`, experience: 'Experience & education', work: 'Experience', edu: 'Education', skills: 'Skills', beyond: 'Beyond code', press: 'In the press',
    contactTitle: "Let's talk about your April 2027 internship.", contactText: 'Embedded systems, data/AI or automation. Based in La Réunion, open to mainland France and remote.',
    copy: 'Copy', copied: 'Copied', selected: 'Selected', open: 'Open ↗',
    projIntro: (n: number) => `Everything I've built at Epitech and on my own: ${n} projects. Starred ones have full write-ups; the others have a short description and their stack.`,
    all: 'All', filterBy: 'Filter by category', back: '← All projects', backEvents: '← All hackathons & awards', result: 'Result', date: 'Date', format: 'Format', notFound: 'Page not found',
    role: 'Role', team: 'Team', ctx: 'Context', status: 'Status', context: 'Context', did: 'What I did', results: 'Results', gallery: 'Gallery', learned: 'What I learned',
    links: 'Links', stack: 'Stack', related: 'Related projects', prev: '← Previous', next: 'Next →', toFill: 'to fill', noLinks: 'No links yet', linkTodo: 'link to add',
    video: '▶ Video', image: 'Image', play: 'Play video', mediaHere: 'Media goes here', summaryTodo: 'One-sentence summary to write',
    ctxTodo: 'What was the problem or the brief?', didTodo: 'Your own contributions, as bullet points.', resTodo: 'Numbers, rankings, feedback.', learnTodo: 'Two or three sentences for interviewers.',
    shots: ['Screenshot', 'Diagram', 'Short clip'], heroMedia: 'Hero video or main screenshot',
    devnote: 'Draft mode: this page comes from one YAML file in <code>src/content/projects/</code> or <code>src/content/events/</code>. Fill in <code>media[].src</code> to replace a placeholder.',
    st: { done: 'Done', progress: 'In progress', delivered: 'Delivered' } },
  fr: { home: 'Accueil', projects: 'Projets', hackathons: 'Hackathons', contact: 'Contact',
    seeProjects: 'Voir les projets', cv: 'Télécharger le CV', selectedWork: 'Projets phares', allProjects: (n: number) => `Les ${n} projets →`,
    hackTitle: 'Hackathons & prix', entries: (n: number) => `${n} entrées`, experience: 'Expérience & formation', work: 'Expérience', edu: 'Formation', skills: 'Compétences', beyond: 'Au-delà du code', press: 'Dans la presse',
    contactTitle: "Parlons de votre stage d'avril 2027.", contactText: 'Systèmes embarqués, data/IA ou automatisation. Basé à La Réunion, ouvert à la métropole et au télétravail.',
    copy: 'Copier', copied: 'Copié', selected: 'Sélectionné', open: 'Ouvrir ↗',
    projIntro: (n: number) => `Tout ce que j'ai construit à Epitech et en perso : ${n} projets. Ceux marqués d'une étoile ont une page détaillée ; les autres ont une courte description et leur stack.`,
    all: 'Tous', filterBy: 'Filtrer par catégorie', back: '← Tous les projets', backEvents: '← Tous les hackathons & prix', result: 'Résultat', date: 'Date', format: 'Format', notFound: 'Page introuvable',
    role: 'Rôle', team: 'Équipe', ctx: 'Cadre', status: 'Statut', context: 'Contexte', did: "Ce que j'ai fait", results: 'Résultats', gallery: 'Galerie', learned: "Ce que j'en retiens",
    links: 'Liens', stack: 'Stack', related: 'Projets liés', prev: '← Précédent', next: 'Suivant →', toFill: 'à remplir', noLinks: 'Pas encore de lien', linkTodo: 'lien à ajouter',
    video: '▶ Vidéo', image: 'Image', play: 'Lire la vidéo', mediaHere: 'Média ici', summaryTodo: 'Résumé en une phrase à écrire',
    ctxTodo: 'Quel était le problème ou le sujet ?', didTodo: 'Tes contributions, en liste.', resTodo: 'Chiffres, classements, retours.', learnTodo: 'Deux ou trois phrases pour les entretiens.',
    shots: ["Capture d'écran", 'Schéma', 'Courte vidéo'], heroMedia: 'Vidéo principale ou capture',
    devnote: 'Mode brouillon : cette page vient d\'un fichier YAML dans <code>src/content/projects/</code> ou <code>src/content/events/</code>. Renseigne <code>media[].src</code> pour remplacer un emplacement.',
    st: { done: 'Terminé', progress: 'En cours', delivered: 'Livré' } },
};

export type Lang = keyof typeof UI;
export const LANGS = Object.keys(UI) as Lang[];
