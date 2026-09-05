document.addEventListener('DOMContentLoaded', () => {
  // Retrieve saved language or default to English
  const savedLang = localStorage.getItem('netflix-lang') || 'en';
  translatePage(savedLang);
  
  // Set dropdowns to the matching saved language value
  const headerSelector = document.getElementById('lang-selector');
  const footerSelector = document.getElementById('footer-lang-selector');
  const loginFooterSelector = document.getElementById('login-footer-lang-selector');
  [headerSelector, footerSelector, loginFooterSelector].forEach(select => {
    if (select) select.value = savedLang;
  });

  setupFAQAccordion();
  setupCTALandingForms();
  setupLoginForm();
  setupLanguageSelectors();
  setupTrendingCarousel();
});

/* ==========================================
   FAQ Accordion Functionality
   ========================================== */
function setupFAQAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isOpen = currentItem.classList.contains('active');
      
      // Close all other FAQ items first
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== currentItem) {
          item.classList.remove('active');
          item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current item
      if (isOpen) {
        currentItem.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
      } else {
        currentItem.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================
   Email CTA Validation (Landing Page)
   ========================================== */
function setupCTALandingForms() {
  const forms = [
    { formId: 'cta-form-hero', inputId: 'email-hero', groupId: 'input-group-hero' },
    { formId: 'cta-form-faq', inputId: 'email-faq', groupId: 'input-group-faq' }
  ];

  forms.forEach(cfg => {
    const form = document.getElementById(cfg.formId);
    if (!form) return;

    const input = document.getElementById(cfg.inputId);
    const group = document.getElementById(cfg.groupId);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailVal = input.value.trim();
      const isValid = validateEmail(emailVal);

      if (!isValid) {
        group.classList.add('error');
      } else {
        group.classList.remove('error');
        // Simulated next step - redirect to sign-in page with email in query param
        window.location.href = `login.html?email=${encodeURIComponent(emailVal)}`;
      }
    });

    // Clear error state while user types
    input.addEventListener('input', () => {
      if (group.classList.contains('error')) {
        group.classList.remove('error');
      }
    });
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* ==========================================
   Login Form Validation
   ========================================== */
function setupLoginForm() {
  const loginForm = document.getElementById('login-form-submit');
  if (!loginForm) return;

  const emailInput = document.getElementById('login-email');
  const emailGroup = document.getElementById('login-input-group-email');
  const passwordInput = document.getElementById('login-password');
  const passwordGroup = document.getElementById('login-input-group-password');

  // Fill in email if passed as query parameter from landing page
  const urlParams = new URLSearchParams(window.location.search);
  const emailParam = urlParams.get('email');
  if (emailParam) {
    emailInput.value = emailParam;
    // Trigger floating label state by forcing validation/not-placeholder check
    emailInput.dispatchEvent(new Event('input'));
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value.trim();
    
    let isEmailValid = true;
    let isPasswordValid = true;

    // Validate email or phone:
    // Simple criteria: must not be empty, and either a valid email or a valid phone (numeric, > 5 digits)
    if (emailVal.length === 0) {
      isEmailValid = false;
    } else {
      const isEmail = validateEmail(emailVal);
      const isPhone = /^\+?[0-9]{8,15}$/.test(emailVal.replace(/[- ]/g, ''));
      if (!isEmail && !isPhone) {
        isEmailValid = false;
      }
    }

    // Validate password:
    // Netflix standard requires 4 to 60 characters
    if (passwordVal.length < 4 || passwordVal.length > 60) {
      isPasswordValid = false;
    }

    // Handle UI updates
    if (!isEmailValid) {
      emailGroup.classList.add('error');
    } else {
      emailGroup.classList.remove('error');
    }

    if (!isPasswordValid) {
      passwordGroup.classList.add('error');
    } else {
      passwordGroup.classList.remove('error');
    }

    // Successful login simulation
    if (isEmailValid && isPasswordValid) {
      alert(`Demo Sign-In: Simulation successful as ${emailVal}! (Educational UI Clone)`);
      // In a real app, this would make an API call and redirect to dashboard
      window.location.href = 'index.html';
    }
  });

  // Clear errors on typing
  emailInput.addEventListener('input', () => {
    emailGroup.classList.remove('error');
  });

  passwordInput.addEventListener('input', () => {
    passwordGroup.classList.remove('error');
  });
}

/* ==========================================
   Language Selector Syncing & Persistence
   ========================================== */
function setupLanguageSelectors() {
  const headerSelector = document.getElementById('lang-selector');
  const footerSelector = document.getElementById('footer-lang-selector');
  const loginFooterSelector = document.getElementById('login-footer-lang-selector');

  const selectors = [headerSelector, footerSelector, loginFooterSelector].filter(el => el !== null);

  selectors.forEach(select => {
    select.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      
      // Store in localStorage for persistence across pages
      localStorage.setItem('netflix-lang', selectedValue);
      translatePage(selectedValue);
      
      // Synchronize all visible language selectors on the page
      selectors.forEach(otherSelect => {
        if (otherSelect.value !== selectedValue) {
          otherSelect.value = selectedValue;
        }
      });
    });
  });
}

/* ==========================================
   Trending Carousel Navigation
   ========================================== */
function setupTrendingCarousel() {
  const track = document.getElementById('trending-track');
  const prevBtn = document.getElementById('trending-prev');
  const nextBtn = document.getElementById('trending-next');
  
  if (!track || !prevBtn || !nextBtn) return;

  const checkButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft <= 5) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }
    if (track.scrollLeft >= maxScroll - 5) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
    }
  };

  track.addEventListener('scroll', checkButtons);
  window.addEventListener('resize', checkButtons);
  setTimeout(checkButtons, 100);

  prevBtn.addEventListener('click', () => {
    const card = track.querySelector('.trending-card');
    if (!card) return;
    const cardWidth = card.offsetWidth + 24; // width + gap (24px = 1.5rem)
    track.scrollBy({ left: -cardWidth * 5, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const card = track.querySelector('.trending-card');
    if (!card) return;
    const cardWidth = card.offsetWidth + 24; // width + gap (24px = 1.5rem)
    track.scrollBy({ left: cardWidth * 5, behavior: 'smooth' });
  });
}

/* ==========================================
   Translation Dictionary
   ========================================== */
const translations = {
  en: {
    signIn: "Sign In",
    heroHeading: "Unlimited movies, TV shows, and more",
    heroSubheading: "Watch anywhere. Cancel anytime.",
    ctaLabel: "Ready to watch? Enter your email to create or restart your membership.",
    emailLabel: "Email address",
    getStarted: "Get Started",
    errorEmail: "Please enter a valid email address.",
    trendingTitle: "Trending Now",
    
    tvHeading: "Enjoy on your TV",
    tvText: "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.",
    downloadHeading: "Download your shows to watch offline",
    downloadText: "Save your favorites easily and always have something to watch.",
    everywhereHeading: "Watch everywhere",
    everywhereText: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
    kidsHeading: "Create profiles for kids",
    kidsText: "Send kids on adventures with their favorite characters in a space made just for them—free with your membership.",
    
    faqHeading: "Frequently Asked Questions",
    faqQ1: "What is Netflix?",
    faqA1: "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.<br><br>You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!",
    faqQ2: "How much does Netflix cost?",
    faqA2: "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month. No extra costs, no contracts.",
    faqQ3: "Where can I watch?",
    faqA3: "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.<br><br>You can also download your favorite shows with the iOS or Android app. Use downloads to watch while you're on the go and without an internet connection. Take Netflix with you anywhere.",
    faqQ4: "How do I cancel?",
    faqA4: "Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.",
    faqQ5: "What can I watch on Netflix?",
    faqA5: "Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.",
    faqQ6: "Is Netflix good for kids?",
    faqA6: "The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and films in their own space.<br><br>Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don't want kids to see.",
    
    region: "Netflix India",
    
    // Login Page
    loginTitle: "Sign In",
    loginEmailLabel: "Email or phone number",
    loginPasswordLabel: "Password",
    loginErrorEmail: "Please enter a valid email or phone number.",
    loginErrorPassword: "Your password must contain between 4 and 60 characters.",
    loginBtn: "Sign In",
    rememberMe: "Remember me",
    needHelp: "Need help?",
    signupPrompt: "New to Netflix? <a href='index.html' id='link-signup-now'>Sign up now</a>.",
    captchaText: "This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href='#' id='link-captcha-learn-more'>Learn more.</a>"
  },
  hi: {
    signIn: "साइन इन करें",
    heroHeading: "असीमित फ़िल्में, टीवी शो और बहुत कुछ",
    heroSubheading: "कहीं भी देखें। जब चाहें रद्द करें।",
    ctaLabel: "देखने के लिए तैयार हैं? अपनी मेंबरशिप बनाने या रीस्टार्ट करने के लिए ईमेल डालें।",
    emailLabel: "ईमेल पता (Email address)",
    getStarted: "शुरू करें",
    errorEmail: "कृपया एक मान्य ईमेल एड्रेस दर्ज करें।",
    trendingTitle: "अभी लोकप्रिय (Trending Now)",
    
    tvHeading: "अपने टीवी पर आनंद लें",
    tvText: "स्मार्ट टीवी, प्लेस्टेशन, एक्सबॉक्स, क्रोमकास्ट, एप्पल टीवी, बीएलयू-रे प्लेयर और अन्य उपकरणों पर देखें।",
    downloadHeading: "ऑफ़लाइन देखने के लिए अपने शो डाउनलोड करें",
    downloadText: "अपने पसंदीदा शो को आसानी से सेव करें और हमेशा देखने के लिए कुछ न कुछ पास रखें।",
    everywhereHeading: "हर जगह देखें",
    everywhereText: "अपने फोन, टैबलेट, लैपटॉप और टीवी पर असीमित फिल्में और टीवी शो स्ट्रीम करें।",
    kidsHeading: "बच्चों के लिए प्रोफाइल बनाएं",
    kidsText: "बच्चों को उनके पसंदीदा पात्रों के साथ एडवेंचर पर भेजें - यह आपकी मेंबरशिप के साथ बिल्कुल मुफ्त है।",
    
    faqHeading: "अक्सर पूछे जाने वाले प्रश्न",
    faqQ1: "Netflix क्या है?",
    faqA1: "Netflix एक स्ट्रीमिंग सर्विस है जो हज़ारों इंटरनेट-कनेक्टेड डिवाइसों पर विभिन्न प्रकार के पुरस्कार विजेता टीवी शो, फिल्में, एनीमे, वृत्तचित्र और बहुत कुछ प्रदान करती है।<br><br>आप बिना किसी विज्ञापन के जितना चाहें, जब चाहें देख सकते हैं - वह भी एक कम मासिक शुल्क में। हमेशा कुछ नया खोजने के लिए रहता है और हर सप्ताह नए शो और फिल्में जोड़ी जाती हैं!",
    faqQ2: "Netflix की कीमत कितनी है?",
    faqA2: "अपने स्मार्टफोन, टैबलेट, स्मार्ट टीवी, लैपटॉप या streaming डिवाइस पर एक निश्चित मासिक शुल्क पर Netflix देखें। प्लान ₹149 से ₹649 प्रति माह तक हैं। कोई अतिरिक्त लागत नहीं, कोई अनुबंध नहीं।",
    faqQ3: "मैं कहाँ देख सकता हूँ?",
    faqA3: "कहीं भी, कभी भी देखें। अपने कंप्यूटर से netflix.com पर तुरंत देखने के लिए या Netflix ऐप प्रदान करने वाले किसी भी इंटरनेट-कनेक्टेड डिवाइस पर साइन इन करें।<br><br>आप आईओएस या एंड्रॉइड ऐप का उपयोग करके भी डाउनलोड कर सकते हैं। यात्रा के दौरान ऑफ़लाइन देखने के लिए डाउनलोड का उपयोग करें। Netflix को अपने साथ कहीं भी ले जाएं।",
    faqQ4: "मैं कैसे रद्द करूँ?",
    faqA4: "Netflix लचीला है। कोई अनुबंध नहीं और कोई प्रतिबद्धता नहीं है। आप दो क्लिक में अपना खाता ऑनलाइन आसानी से रद्द कर सकते हैं। कोई रद्दीकरण शुल्क नहीं है - जब चाहें खाता शुरू या बंद करें।",
    faqQ5: "मैं Netflix पर क्या देख सकता हूँ?",
    faqA5: "Netflix के पास फीचर फिल्मों, वृत्तचित्रों, टीवी शो, एनीमे, पुरस्कार विजेता Netflix ओरिजिनल और बहुत कुछ का एक विशाल संग्रह है। जितना चाहें, जब चाहें देखें।",
    faqQ6: "क्या Netflix बच्चों के लिए अच्छा है?",
    faqA6: "Netflix Kids अनुभव आपकी मेंबरशिप में शामिल है ताकि बच्चों को एक सुरक्षित स्पेस प्रदान किया जा सके।<br><br>बच्चों की प्रोफाइल पिन-संरक्षित पैरेंटल कंट्रोल के साथ आती है जिससे आप परिपक्वता रेटिंग को प्रतिबंधित कर सकते हैं और विशिष्ट टाइटल ब्लॉक कर सकते हैं।",
    
    region: "Netflix India",
    
    // Login Page
    loginTitle: "साइन इन करें",
    loginEmailLabel: "ईमेल या फोन नंबर",
    loginPasswordLabel: "पासवर्ड",
    loginErrorEmail: "कृपया एक मान्य ईमेल या फोन नंबर दर्ज करें।",
    loginErrorPassword: "आपका पासवर्ड 4 से 60 वर्णों के बीच होना चाहिए।",
    loginBtn: "साइन इन करें",
    rememberMe: "मुझे याद रखें",
    needHelp: "क्या आपको सहायता चाहिए?",
    signupPrompt: "Netflix पर नए हैं? <a href='index.html' id='link-signup-now'>अभी साइन अप करें</a>।",
    captchaText: "यह पेज सुरक्षा के लिए Google reCAPTCHA द्वारा संरक्षित है। <a href='#' id='link-captcha-learn-more'>अधिक जानें।</a>"
  },
  es: {
    signIn: "Iniciar sesión",
    heroHeading: "Películas y series ilimitadas y mucho más",
    heroSubheading: "Disfruta donde quieras. Cancela cuando quieras.",
    ctaLabel: "¿Quieres ver Netflix ya? Ingresa tu email para crear o reactivar tu membresía.",
    emailLabel: "Dirección de email",
    getStarted: "Comenzar",
    errorEmail: "Escribe una dirección de email válida.",
    trendingTitle: "Tendencias de hoy",
    
    tvHeading: "Disfruta en tu TV",
    tvText: "Ve en smart TV, PlayStation, Xbox, Chromecast, Apple TV, reproductores de Blu-ray y más.",
    downloadHeading: "Descarga tus series para verlas offline",
    downloadText: "Guarda tus títulos favoritos fácilmente y ten siempre algo que ver.",
    everywhereHeading: "Ve donde quieras",
    everywhereText: "Transmite películas y series ilimitadas en tu teléfono, tablet, computadora y TV.",
    kidsHeading: "Crea perfiles para niños",
    kidsText: "Lleva a los niños a vivir aventuras con sus personajes favoritos en un espacio diseñado exclusivamente para ellos, gratis con tu membresía.",
    
    faqHeading: "Preguntas frecuentes",
    faqQ1: "¿Qué es Netflix?",
    faqA1: "Netflix es un servicio de streaming que ofrece una gran variedad de series, películas, títulos de anime, documentales y otros contenidos premiados en miles de dispositivos conectados a internet.<br><br>Puedes ver todo el contenido que quieras, cuando quieras y sin un solo anuncio, por una tarifa mensual muy accesible. Siempre hay algo nuevo que descubrir, ¡y cada semana se agregan más series y películas!",
    faqQ2: "¿Cuánto cuesta Netflix?",
    faqA2: "Disfruta de Netflix en tu smartphone, tablet, smart TV, computadora o dispositivo de streaming, todo por una tarifa mensual fija. Planes desde ₹149 hasta ₹649 al mes. Sin costos adicionales ni contratos.",
    faqQ3: "¿Dónde puedo ver Netflix?",
    faqA3: "Disfruta donde quieras y cuando quieras. Inicia sesión en tu cuenta de Netflix para ver contenido al instante a través de netflix.com desde tu computadora o en cualquier dispositivo con conexión a internet que cuente con la app de Netflix, como smart TV, smartphones, tablets, reproductores multimedia y consolas de juegos.<br><br>También puedes descargar tus series favoritas con la app para iOS o Android. Usa las descargas para ver contenido mientras viajas o si no tienes conexión a internet. Lleva Netflix contigo a donde vayas.",
    faqQ4: "¿Cómo cancelo?",
    faqA4: "Netflix es flexible. Sin contratos molestos ni compromisos. Puedes cancelar tu cuenta online con solo dos clics. Sin cargos por cancelación: inicia o cancela tu cuenta en cualquier momento.",
    faqQ5: "¿Qué puedo ver en Netflix?",
    faqA5: "Netflix tiene un amplio catálogo de películas, documentales, series, títulos de anime, originales de Netflix galardonados y mucho más. Ve todo lo que quieras, cuando quieras.",
    faqQ6: "¿Es bueno Netflix para los niños?",
    faqA6: "La experiencia de Netflix para niños está incluida en la membresía para que los padres tengan el control mientras los niños disfrutan de series y películas familiares en su propio espacio.<br><br>Los perfiles para niños cuentan con controles parentales protegidos por PIN que te permiten restringir la clasificación de edad del contenido que los niños pueden ver y bloquear títulos específicos.",
    
    region: "Netflix España",
    
    // Login Page
    loginTitle: "Iniciar sesión",
    loginEmailLabel: "Email o número de teléfono",
    loginPasswordLabel: "Contraseña",
    loginErrorEmail: "Ingresa un email o número de teléfono válido.",
    loginErrorPassword: "La contraseña debe tener entre 4 y 60 caracteres.",
    loginBtn: "Iniciar sesión",
    rememberMe: "Recuérdame",
    needHelp: "¿Necesitas ayuda?",
    signupPrompt: "¿Primera vez en Netflix? <a href='index.html' id='link-signup-now'>Regístrate ahora</a>.",
    captchaText: "Esta página está protegida por Google reCAPTCHA para comprobar que no eres un robot. <a href='#' id='link-captcha-learn-more'>Más información.</a>"
  },
  fr: {
    signIn: "S'identifier",
    heroHeading: "Films, séries TV et bien plus en illimité",
    heroSubheading: "Où que vous soyez. Annulez à tout moment.",
    ctaLabel: "Prêt à regarder Netflix ? Saisissez votre adresse e-mail pour vous abonner ou réactiver votre abonnement.",
    emailLabel: "Adresse e-mail",
    getStarted: "Commencer",
    errorEmail: "Veuillez saisir une adresse e-mail valide.",
    trendingTitle: "Tendances actuelles",
    
    tvHeading: "Regardez Netflix sur votre TV",
    tvText: "Regardez Netflix sur votre Smart TV, PlayStation, Xbox, Chromecast, Apple TV, lecteurs Blu-ray et plus.",
    downloadHeading: "Téléchargez vos séries pour les regarder hors connexion",
    downloadText: "Enregistrez facilement vos programmes préférés pour ne jamais en manquer.",
    everywhereHeading: "Où que vous soyez",
    everywhereText: "Regardez des films et séries TV en illimité sur votre téléphone, tablette, ordinateur et TV.",
    kidsHeading: "Créez des profils pour les enfants",
    kidsText: "Les enfants découvrent de nouvelles aventures avec leurs personnages préférés dans un espace qui leur est dédié, gratuit avec votre abonnement.",
    
    faqHeading: "Foire aux questions",
    faqQ1: "Netflix, c'est quoi ?",
    faqA1: "Netflix est un service de streaming qui propose une vaste sélection de séries TV, films, anime, documentaires et autres programmes primés sur des milliers d'appareils connectés à Internet.<br><br>Regardez tout ce que vous voulez, quand vous voulez, sans aucune publicité, pour un tarif mensuel très attractif. Découvrez sans cesse de nouveaux programmes. Des films et séries TV sont ajoutés chaque semaine !",
    faqQ2: "Combien coûte Netflix ?",
    faqA2: "Regardez Netflix sur votre smartphone, tablette, Smart TV, ordinateur ou appareil de streaming, le tout pour un tarif mensuel fixe. Forfaits de ₹149 à ₹649 par mois. Pas de contrat ni de frais supplémentaires.",
    faqQ3: "Où puis-je regarder Netflix ?",
    faqA3: "Regardez où et quand vous voulez. Connectez-vous à votre compte Netflix pour regarder des films et séries en streaming sur netflix.com depuis votre ordinateur, ou sur tout appareil connecté à Internet qui propose l'application Netflix, comme les Smart TV, smartphones, tablettes, lecteurs de streaming et consoles de jeu.<br><br>Vous pouvez également télécharger vos programmes préférés avec l'application iOS ou Android. Utilisez le téléchargement pour regarder vos programmes hors connexion lors de vos déplacements. Emmenez Netflix partout avec vous.",
    faqQ4: "Comment puis-je annuler mon abonnement ?",
    faqA4: "Netflix est flexible. Sans contrat fastidieux ni engagement. Vous pouvez facilement annuler votre compte en ligne en deux clics. Aucun frais d'annulation : commencez ou suspendez votre abonnement à tout moment.",
    faqQ5: "Que puis-je regarder sur Netflix ?",
    faqA5: "Netflix propose un catalogue complet de longs-métrages, documentaires, séries TV, anime, programmes originaux Netflix primés et bien plus encore. Regardez ce que vous voulez, quand vous voulez.",
    faqQ6: "Netflix est-il adapté aux enfants ?",
    faqA6: "L'espace Netflix Jeunesse est inclus dans votre abonnement pour offrir un meilleur contrôle aux parents et un espace dédié aux enfants, où ils peuvent regarder des séries et des films en famille.<br><br>Les profils pour enfants comportent des contrôles parentaux protégés par code PIN qui vous permettent de restreindre la catégorie d'âge des programmes que les enfants peuvent regarder et de bloquer des titres spécifiques.",
    
    region: "Netflix France",
    
    // Login Page
    loginTitle: "S'identifier",
    loginEmailLabel: "Adresse e-mail ou numéro de téléphone",
    loginPasswordLabel: "Mot de passe",
    loginErrorEmail: "Veuillez saisir une adresse e-mail ou un numéro de téléphone valide.",
    loginErrorPassword: "Votre mot de passe doit comporter entre 4 et 60 caractères.",
    loginBtn: "S'identifier",
    rememberMe: "Se souvenir de moi",
    needHelp: "Besoin d'aide ?",
    signupPrompt: "Première visite sur Netflix ? <a href='index.html' id='link-signup-now'>Inscrivez-vous</a>.",
    captchaText: "Cette page est protégée par Google reCAPTCHA pour s'assurer que vous n'êtes pas un robot. <a href='#' id='link-captcha-learn-more'>En savoir plus.</a>"
  }
};

/* ==========================================
   Page Text Translator
   ========================================== */
function translatePage(lang) {
  const t = translations[lang];
  if (!t) return;

  // Header Sign In button
  const signInNav = document.getElementById('btn-login-nav');
  if (signInNav) signInNav.innerText = t.signIn;

  // Hero Section
  const heroHeading = document.getElementById('hero-heading');
  if (heroHeading) heroHeading.innerText = t.heroHeading;

  const heroSubheading = document.getElementById('hero-subheading');
  if (heroSubheading) heroSubheading.innerText = t.heroSubheading;

  // CTA form labels
  document.querySelectorAll('.cta-form-label').forEach(el => {
    el.innerText = t.ctaLabel;
  });

  // Email input labels
  const emailHeroLabel = document.querySelector('label[for="email-hero"]');
  if (emailHeroLabel) emailHeroLabel.innerText = t.emailLabel;

  const emailFaqLabel = document.querySelector('label[for="email-faq"]');
  if (emailFaqLabel) emailFaqLabel.innerText = t.emailLabel;

  // Error messages
  const errorHero = document.getElementById('error-hero');
  if (errorHero) errorHero.innerText = t.errorEmail;

  const errorFaq = document.getElementById('error-faq');
  if (errorFaq) errorFaq.innerText = t.errorEmail;

  // CTA Buttons
  const btnHero = document.getElementById('btn-submit-hero');
  if (btnHero) {
    btnHero.innerHTML = `${t.getStarted} <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 3l14 9-14 9V3z"/></svg>`;
  }

  const btnFaq = document.getElementById('btn-submit-faq');
  if (btnFaq) {
    btnFaq.innerHTML = `${t.getStarted} <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 3l14 9-14 9V3z"/></svg>`;
  }

  // Trending Section Title
  const trendingTitle = document.querySelector('.trending-title');
  if (trendingTitle) trendingTitle.innerText = t.trendingTitle;

  // Feature Section 1
  const tvHeader = document.querySelector('#feature-tv .feature-text h2');
  if (tvHeader) tvHeader.innerText = t.tvHeading;
  const tvDesc = document.querySelector('#feature-tv .feature-text p');
  if (tvDesc) tvDesc.innerText = t.tvText;

  // Feature Section 2
  const dlHeader = document.querySelector('#feature-download .feature-text h2');
  if (dlHeader) dlHeader.innerText = t.downloadHeading;
  const dlDesc = document.querySelector('#feature-download .feature-text p');
  if (dlDesc) dlDesc.innerText = t.downloadText;

  // Feature Section 3
  const evHeader = document.querySelector('#feature-everywhere .feature-text h2');
  if (evHeader) evHeader.innerText = t.everywhereHeading;
  const evDesc = document.querySelector('#feature-everywhere .feature-text p');
  if (evDesc) evDesc.innerText = t.everywhereText;

  // Feature Section 4
  const kidsHeader = document.querySelector('#feature-kids .feature-text h2');
  if (kidsHeader) kidsHeader.innerText = t.kidsHeading;
  const kidsDesc = document.querySelector('#feature-kids .feature-text p');
  if (kidsDesc) kidsDesc.innerText = t.kidsText;

  // FAQ Title
  const faqTitle = document.querySelector('.faq-section h2');
  if (faqTitle) faqTitle.innerText = t.faqHeading;

  // FAQ Items
  const faqQ1 = document.querySelector('#faq-item-1 .faq-header h3');
  if (faqQ1) faqQ1.innerText = t.faqQ1;
  const faqA1 = document.querySelector('#faq-answer-1 .faq-body-content');
  if (faqA1) faqA1.innerHTML = t.faqA1;

  const faqQ2 = document.querySelector('#faq-item-2 .faq-header h3');
  if (faqQ2) faqQ2.innerText = t.faqQ2;
  const faqA2 = document.querySelector('#faq-answer-2 .faq-body-content');
  if (faqA2) faqA2.innerHTML = t.faqA2;

  const faqQ3 = document.querySelector('#faq-item-3 .faq-header h3');
  if (faqQ3) faqQ3.innerText = t.faqQ3;
  const faqA3 = document.querySelector('#faq-answer-3 .faq-body-content');
  if (faqA3) faqA3.innerHTML = t.faqA3;

  const faqQ4 = document.querySelector('#faq-item-4 .faq-header h3');
  if (faqQ4) faqQ4.innerText = t.faqQ4;
  const faqA4 = document.querySelector('#faq-answer-4 .faq-body-content');
  if (faqA4) faqA4.innerHTML = t.faqA4;

  const faqQ5 = document.querySelector('#faq-item-5 .faq-header h3');
  if (faqQ5) faqQ5.innerText = t.faqQ5;
  const faqA5 = document.querySelector('#faq-answer-5 .faq-body-content');
  if (faqA5) faqA5.innerHTML = t.faqA5;

  const faqQ6 = document.querySelector('#faq-item-6 .faq-header h3');
  if (faqQ6) faqQ6.innerText = t.faqQ6;
  const faqA6 = document.querySelector('#faq-answer-6 .faq-body-content');
  if (faqA6) faqA6.innerHTML = t.faqA6;

  // Footer Copyright Region
  const copyright = document.querySelector('.footer-copyright');
  if (copyright) copyright.innerText = t.region;

  // LOGIN PAGE TRANSLATIONS
  const loginTitle = document.getElementById('login-card-title');
  if (loginTitle) loginTitle.innerText = t.loginTitle;

  const loginEmailLabel = document.querySelector('label[for="login-email"]');
  if (loginEmailLabel) loginEmailLabel.innerText = t.loginEmailLabel;

  const loginPasswordLabel = document.querySelector('label[for="login-password"]');
  if (loginPasswordLabel) loginPasswordLabel.innerText = t.loginPasswordLabel;

  const loginErrorEmail = document.getElementById('login-error-email');
  if (loginErrorEmail) loginErrorEmail.innerText = t.loginErrorEmail;

  const loginErrorPassword = document.getElementById('login-error-password');
  if (loginErrorPassword) loginErrorPassword.innerText = t.loginErrorPassword;

  const btnLoginSubmit = document.getElementById('btn-login-submit');
  if (btnLoginSubmit) btnLoginSubmit.innerText = t.loginBtn;

  const rememberMeSpan = document.querySelector('.remember-me span');
  if (rememberMeSpan) rememberMeSpan.innerText = t.rememberMe;

  const needHelpLink = document.getElementById('link-forgot-password');
  if (needHelpLink) needHelpLink.innerText = t.needHelp;

  const signupPrompt = document.querySelector('.signup-now');
  if (signupPrompt) signupPrompt.innerHTML = t.signupPrompt;

  const captchaText = document.querySelector('.captcha-disclaimer');
  if (captchaText) captchaText.innerHTML = t.captchaText;
}
