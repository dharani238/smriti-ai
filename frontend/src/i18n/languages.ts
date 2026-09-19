export type AppLanguage =
  | "English"
  | "Assamese"
  | "Bengali"
  | "Bodo"
  | "Hindi"
  | "Khasi"
  | "Mizo"
  | "Manipuri";

export type LanguageOption = {
  code: string;
  name: AppLanguage;
  nativeName: string;
  speechCode: string;
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    speechCode: "en-IN",
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    speechCode: "as-IN",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    speechCode: "bn-IN",
  },
  {
    code: "brx",
    name: "Bodo",
    nativeName: "बर'",
    speechCode: "brx-IN",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    speechCode: "hi-IN",
  },
  {
    code: "kha",
    name: "Khasi",
    nativeName: "Khasi",
    speechCode: "en-IN",
  },
  {
    code: "lus",
    name: "Mizo",
    nativeName: "Mizo ṭawng",
    speechCode: "en-IN",
  },
  {
    code: "mni",
    name: "Manipuri",
    nativeName: "মৈতৈলোন্",
    speechCode: "mni-IN",
  },
];

export type TranslationKey =
  | "home"
  | "backHome"
  | "memoryCompanion"
  | "talkToSmriti"
  | "intro"
  | "familyProfile"
  | "familyProfiles"
  | "savedMemory"
  | "savedMemories"
  | "connected"
  | "whatRemember"
  | "companionDescription"
  | "loading"
  | "collectionReady"
  | "collectionReadyDescription"
  | "askSmriti"
  | "placeholder"
  | "ask"
  | "searching"
  | "preferSpeak"
  | "voiceDescription"
  | "tryAsking"
  | "looking"
  | "fromCollection"
  | "readAloud"
  | "privacyNote"
  | "noPatient"
  | "loadError"
  | "noMatch";

type TranslationSet = Record<TranslationKey, string>;

export const translations: Record<
  AppLanguage,
  TranslationSet
> = {
  English: {
    home: "Home",
    backHome: "Back to home",
    memoryCompanion: "MEMORY COMPANION",
    talkToSmriti: "Talk to SMRITI",
    intro:
      "Ask about familiar people and memories shared by your family.",

    familyProfile: "Family profile",
    familyProfiles: "Family profiles",
    savedMemory: "Saved memory",
    savedMemories: "Saved memories",

    connected:
      "Connected to your personal memory collection",

    whatRemember:
      "What would you like to remember?",

    companionDescription:
      "You can type your question or use your voice. SMRITI will look through the family information and memories connected to your profile.",

    loading:
      "Loading your memory collection...",

    collectionReady:
      "Your memory collection is ready to grow",

    collectionReadyDescription:
      "Family profiles and personal memories added by your caregiver will appear here.",

    askSmriti: "Ask SMRITI",

    placeholder:
      "Ask about a person or memory...",

    ask: "Ask",
    searching: "Searching...",

    preferSpeak: "Prefer to speak?",

    voiceDescription:
      "Use the voice button and ask naturally.",

    tryAsking: "TRY ASKING",

    looking:
      "Looking through your saved memories...",

    fromCollection:
      "From your memory collection",

    readAloud: "Read answer aloud",

    privacyNote:
      "SMRITI uses the family profiles and memories connected to this patient profile to provide familiar memory assistance. It does not diagnose or replace professional care.",

    noPatient:
      "Your patient profile could not be found. Please sign in again.",

    loadError:
      "I could not access your family memories right now.",

    noMatch:
      "I could not find that information in your saved family profiles or memories.",
  },

  Assamese: {
    home: "মূল পৃষ্ঠা",
    backHome: "মূল পৃষ্ঠালৈ ঘূৰি যাওক",
    memoryCompanion: "স্মৃতি সহায়ক",
    talkToSmriti: "SMRITI-ৰ সৈতে কথা পাতক",

    intro:
      "আপোনাৰ পৰিয়ালে সংৰক্ষণ কৰা চিনাকি মানুহ আৰু স্মৃতিৰ বিষয়ে সোধক।",

    familyProfile: "পৰিয়ালৰ প্ৰ'ফাইল",
    familyProfiles: "পৰিয়ালৰ প্ৰ'ফাইলসমূহ",

    savedMemory: "সংৰক্ষিত স্মৃতি",
    savedMemories: "সংৰক্ষিত স্মৃতিসমূহ",

    connected:
      "আপোনাৰ ব্যক্তিগত স্মৃতি সংগ্ৰহৰ সৈতে সংযুক্ত",

    whatRemember:
      "আপুনি কি মনত পেলাব বিচাৰে?",

    companionDescription:
      "আপুনি আপোনাৰ প্ৰশ্ন লিখিব পাৰে বা কণ্ঠস্বৰ ব্যৱহাৰ কৰিব পাৰে। SMRITI-এ আপোনাৰ প্ৰ'ফাইলৰ সৈতে সংযুক্ত পৰিয়ালৰ তথ্য আৰু স্মৃতিসমূহ বিচাৰিব।",

    loading:
      "আপোনাৰ স্মৃতি সংগ্ৰহ লোড কৰা হৈছে...",

    collectionReady:
      "আপোনাৰ স্মৃতি সংগ্ৰহ সাজু",

    collectionReadyDescription:
      "যত্ন লোৱা ব্যক্তিয়ে যোগ কৰা পৰিয়ালৰ প্ৰ'ফাইল আৰু ব্যক্তিগত স্মৃতিসমূহ ইয়াত দেখা যাব।",

    askSmriti: "SMRITI-ক সোধক",

    placeholder:
      "এজন ব্যক্তি বা স্মৃতিৰ বিষয়ে সোধক...",

    ask: "সোধক",
    searching: "বিচাৰি থকা হৈছে...",

    preferSpeak:
      "কথা ক'ব বিচাৰে নেকি?",

    voiceDescription:
      "কণ্ঠস্বৰ বুটাম ব্যৱহাৰ কৰি স্বাভাৱিকভাৱে সোধক।",

    tryAsking: "এইবোৰ সোধি চাওক",

    looking:
      "আপোনাৰ সংৰক্ষিত স্মৃতিসমূহ বিচাৰি থকা হৈছে...",

    fromCollection:
      "আপোনাৰ স্মৃতি সংগ্ৰহৰ পৰা",

    readAloud:
      "উত্তৰটো পঢ়ি শুনাওক",

    privacyNote:
      "SMRITI-এ এই ৰোগীৰ প্ৰ'ফাইলৰ সৈতে সংযুক্ত পৰিয়ালৰ প্ৰ'ফাইল আৰু স্মৃতিসমূহ ব্যৱহাৰ কৰি চিনাকি স্মৃতিৰ সহায় প্ৰদান কৰে। ই ৰোগ নিৰ্ণয় নকৰে আৰু পেছাদাৰী চিকিৎসাৰ বিকল্প নহয়।",

    noPatient:
      "আপোনাৰ ৰোগীৰ প্ৰ'ফাইল পোৱা নগ'ল। অনুগ্ৰহ কৰি পুনৰ লগ ইন কৰক।",

    loadError:
      "এই মুহূৰ্তত আপোনাৰ পৰিয়ালৰ স্মৃতিসমূহ খোলিব পৰা নগ'ল।",

    noMatch:
      "আপোনাৰ সংৰক্ষিত পৰিয়ালৰ প্ৰ'ফাইল বা স্মৃতিসমূহত এই তথ্য পোৱা নগ'ল।",
  },

  Bengali: {
    home: "হোম",
    backHome: "হোমে ফিরে যান",
    memoryCompanion: "স্মৃতি সহায়ক",
    talkToSmriti: "SMRITI-এর সাথে কথা বলুন",

    intro:
      "আপনার পরিবারের শেয়ার করা পরিচিত মানুষ এবং স্মৃতি সম্পর্কে জিজ্ঞাসা করুন।",

    familyProfile: "পরিবারের প্রোফাইল",
    familyProfiles: "পরিবারের প্রোফাইলসমূহ",

    savedMemory: "সংরক্ষিত স্মৃতি",
    savedMemories: "সংরক্ষিত স্মৃতিসমূহ",

    connected:
      "আপনার ব্যক্তিগত স্মৃতি সংগ্রহের সাথে সংযুক্ত",

    whatRemember:
      "আপনি কী মনে করতে চান?",

    companionDescription:
      "আপনি প্রশ্ন লিখতে পারেন অথবা কণ্ঠস্বর ব্যবহার করতে পারেন। SMRITI আপনার প্রোফাইলের সাথে যুক্ত পরিবার এবং স্মৃতির তথ্য খুঁজবে।",

    loading:
      "আপনার স্মৃতি সংগ্রহ লোড হচ্ছে...",

    collectionReady:
      "আপনার স্মৃতি সংগ্রহ প্রস্তুত",

    collectionReadyDescription:
      "পরিচর্যাকারীর যোগ করা পরিবারের প্রোফাইল এবং ব্যক্তিগত স্মৃতি এখানে দেখা যাবে।",

    askSmriti: "SMRITI-কে জিজ্ঞাসা করুন",

    placeholder:
      "কোনো ব্যক্তি বা স্মৃতি সম্পর্কে জিজ্ঞাসা করুন...",

    ask: "জিজ্ঞাসা করুন",
    searching: "খোঁজা হচ্ছে...",

    preferSpeak: "কথা বলতে চান?",

    voiceDescription:
      "ভয়েস বোতাম ব্যবহার করে স্বাভাবিকভাবে প্রশ্ন করুন।",

    tryAsking: "জিজ্ঞাসা করে দেখুন",

    looking:
      "আপনার সংরক্ষিত স্মৃতি খোঁজা হচ্ছে...",

    fromCollection:
      "আপনার স্মৃতি সংগ্রহ থেকে",

    readAloud: "উত্তরটি পড়ে শোনান",

    privacyNote:
      "SMRITI পরিচিত স্মৃতির সহায়তার জন্য এই রোগীর প্রোফাইলের সাথে যুক্ত পরিবার এবং স্মৃতির তথ্য ব্যবহার করে। এটি রোগ নির্ণয় করে না এবং পেশাদার চিকিৎসার বিকল্প নয়।",

    noPatient:
      "আপনার রোগীর প্রোফাইল পাওয়া যায়নি। আবার সাইন ইন করুন।",

    loadError:
      "এই মুহূর্তে আপনার পরিবারের স্মৃতি পাওয়া যাচ্ছে না।",

    noMatch:
      "আপনার সংরক্ষিত পরিবার বা স্মৃতির তথ্যে এটি পাওয়া যায়নি।",
  },

  Bodo: {
    home: "Home",
    backHome: "Home आव थांफिन",
    memoryCompanion: "MEMORY COMPANION",
    talkToSmriti: "SMRITI जों रायज्लाय",

    intro:
      "नोंथांनि नखर आरो गामि गोसोखांथिनायनि सोमोन्दै सों।",

    familyProfile: "नखर profile",
    familyProfiles: "नखर profiles",

    savedMemory: "थिना दोनखानाय memory",
    savedMemories: "थिना दोनखानाय memories",

    connected:
      "नोंथांनि personal memory collection जों connected",

    whatRemember:
      "नोंथाङा मा गोसोखांनो लुबैयो?",

    companionDescription:
      "नोंथाङा सोंथिनाय लिरनो एबा voice बाहायनो हायो। SMRITI आ नोंथांनि profile जों सोमोन्दो थानाय नखर आरो memory information नागिरगोन।",

    loading:
      "Memory collection load खालामगासिनो दं...",

    collectionReady:
      "नोंथांनि memory collection ready",

    collectionReadyDescription:
      "Caregiver आ add खालामनाय family profiles आरो personal memories बेयाव नुजागोन।",

    askSmriti: "SMRITI खौ सों",

    placeholder:
      "मानसि एबा memory नि सोमोन्दै सों...",

    ask: "सों",
    searching: "नागिरगासिनो दं...",

    preferSpeak:
      "रायज्लायनो लुबैयो नामा?",

    voiceDescription:
      "Voice button बाहायनानै सों।",

    tryAsking: "सोंनानै नाय",

    looking:
      "Saved memories नागिरगासिनो दं...",

    fromCollection:
      "नोंथांनि memory collection निफ्राय",

    readAloud:
      "फिननायखौ फरायना खोनासं",

    privacyNote:
      "SMRITI आ familiar memory support होनो family profiles आरो memories बाहायो। बेयो diagnosis एबा professional care नि सोलायनाय नङा।",

    noPatient:
      "Patient profile मोनाखै। आरोबाव sign in खालाम।",

    loadError:
      "दानिया family memories access खालामनो हायाखै।",

    noMatch:
      "Saved family profiles एबा memories आव बे information मोनाखै।",
  },

  Hindi: {
    home: "होम",
    backHome: "होम पर वापस जाएँ",
    memoryCompanion: "स्मृति सहायक",
    talkToSmriti: "SMRITI से बात करें",

    intro:
      "अपने परिवार द्वारा साझा किए गए परिचित लोगों और यादों के बारे में पूछें।",

    familyProfile: "परिवार प्रोफ़ाइल",
    familyProfiles: "परिवार प्रोफ़ाइल",

    savedMemory: "सहेजी गई याद",
    savedMemories: "सहेजी गई यादें",

    connected:
      "आपके व्यक्तिगत स्मृति संग्रह से जुड़ा हुआ",

    whatRemember:
      "आप क्या याद करना चाहेंगे?",

    companionDescription:
      "आप अपना प्रश्न लिख सकते हैं या अपनी आवाज़ का उपयोग कर सकते हैं। SMRITI आपके प्रोफ़ाइल से जुड़ी परिवार की जानकारी और यादों को खोजेगा।",

    loading:
      "आपका स्मृति संग्रह लोड हो रहा है...",

    collectionReady:
      "आपका स्मृति संग्रह तैयार है",

    collectionReadyDescription:
      "देखभालकर्ता द्वारा जोड़ी गई परिवार प्रोफ़ाइल और व्यक्तिगत यादें यहाँ दिखाई देंगी।",

    askSmriti: "SMRITI से पूछें",

    placeholder:
      "किसी व्यक्ति या याद के बारे में पूछें...",

    ask: "पूछें",
    searching: "खोज रहा है...",

    preferSpeak: "बोलना पसंद करेंगे?",

    voiceDescription:
      "वॉइस बटन का उपयोग करके स्वाभाविक रूप से पूछें।",

    tryAsking: "ये पूछकर देखें",

    looking:
      "आपकी सहेजी गई यादों में खोज रहा है...",

    fromCollection:
      "आपके स्मृति संग्रह से",

    readAloud: "उत्तर पढ़कर सुनाएँ",

    privacyNote:
      "SMRITI परिचित स्मृतियों में सहायता के लिए इस रोगी प्रोफ़ाइल से जुड़ी परिवार प्रोफ़ाइल और यादों का उपयोग करता है। यह निदान नहीं करता और पेशेवर देखभाल का विकल्प नहीं है।",

    noPatient:
      "आपकी रोगी प्रोफ़ाइल नहीं मिली। कृपया फिर से साइन इन करें।",

    loadError:
      "अभी आपकी पारिवारिक यादों तक पहुँचा नहीं जा सका।",

    noMatch:
      "आपकी सहेजी गई परिवार प्रोफ़ाइल या यादों में यह जानकारी नहीं मिली।",
  },

  Khasi: {
    home: "Home",
    backHome: "Phai sha Home",
    memoryCompanion: "MEMORY COMPANION",
    talkToSmriti: "Kren bad SMRITI",

    intro:
      "Kylli shaphang ki briew ba phi ithuh bad ki jingkynmaw jong ka ïing.",

    familyProfile: "Family profile",
    familyProfiles: "Family profiles",

    savedMemory: "Saved memory",
    savedMemories: "Saved memories",

    connected:
      "La pynïasoh bad ka memory collection jong phi",

    whatRemember:
      "Kaei kaba phi kwah ban kynmaw?",

    companionDescription:
      "Phi lah ban thoh ïa ka jingkylli lane pyndonkam da ka sur. SMRITI kan wad na ki family information bad memories jong phi.",

    loading:
      "Dang load ïa ki memories jong phi...",

    collectionReady:
      "Ka memory collection jong phi ka la long ready",

    collectionReadyDescription:
      "Ki family profiles bad personal memories ba la buh da u caregiver kin paw hangne.",

    askSmriti: "Kylli ïa SMRITI",

    placeholder:
      "Kylli shaphang u briew lane ka memory...",

    ask: "Kylli",
    searching: "Dang wad...",

    preferSpeak:
      "Phi kwah ban kren?",

    voiceDescription:
      "Pyndonkam ïa ka voice button ban kylli.",

    tryAsking: "TRY ASKING",

    looking:
      "Dang wad na ki saved memories jong phi...",

    fromCollection:
      "Na ka memory collection jong phi",

    readAloud:
      "Pule ïa ka jubab",

    privacyNote:
      "SMRITI ka pyndonkam ïa ki family profiles bad memories na kane ka patient profile ban ai memory assistance. Kam dei ka diagnosis lane ka jing替代 ïa ka professional care.",

    noPatient:
      "Ym shem ïa ka patient profile. Sngewbha sign in biang.",

    loadError:
      "Ngam lah ban access ïa ki family memories mynta.",

    noMatch:
      "Ngam shem ïa kata ka information ha ki saved family profiles lane memories.",
  },

  Mizo: {
    home: "In",
    backHome: "In lamah kir rawh",
    memoryCompanion: "MEMORY COMPANION",
    talkToSmriti: "SMRITI biak rawh",

    intro:
      "I chhungkua leh i hriat rengte chungchang zawt rawh.",

    familyProfile: "Chhungkaw profile",
    familyProfiles: "Chhungkaw profiles",

    savedMemory: "Vawn that memory",
    savedMemories: "Vawn that memories",

    connected:
      "I personal memory collection nen inzawm",

    whatRemember:
      "Eng nge i hriat chhuah leh duh?",

    companionDescription:
      "I zawhna i ziak thei a, voice pawh i hmang thei. SMRITI chuan i profile-a chhungkaw information leh memories a zawng ang.",

    loading:
      "I memory collection load mek...",

    collectionReady:
      "I memory collection a ready",

    collectionReadyDescription:
      "Caregiver-in family profiles leh personal memories a dahte hetah a lang ang.",

    askSmriti: "SMRITI zawt rawh",

    placeholder:
      "Mi emaw memory emaw chungchang zawt rawh...",

    ask: "Zawt",
    searching: "Zawng mek...",

    preferSpeak:
      "Tawng i duh zawk em?",

    voiceDescription:
      "Voice button hmangin zawt rawh.",

    tryAsking: "HENGTE HI ZAWT TEH",

    looking:
      "I saved memories-ah zawng mek...",

    fromCollection:
      "I memory collection atangin",

    readAloud:
      "Chhanna chhiar chhuak",

    privacyNote:
      "SMRITI chuan familiar memory support atan family profiles leh memories a hmang. Diagnosis a siam lo va, professional care thlakna a ni lo.",

    noPatient:
      "Patient profile hmuh a ni lo. Sign in leh rawh.",

    loadError:
      "Tunah i family memories access theih a ni lo.",

    noMatch:
      "I saved family profiles emaw memories emaw-ah he information hi hmuh a ni lo.",
  },

  Manipuri: {
    home: "হোম",
    backHome: "হোমদা হল্লকউ",
    memoryCompanion: "মেমোরি কম্পেনিয়ন",
    talkToSmriti: "SMRITI-গা ৱারী শান্নৌ",

    intro:
      "নহাক্কী ইমুংগী মরী লৈনবা মীশিং অমসুং নীংশিংবশিংগী মতাংদা হংউ।",

    familyProfile: "ইমুংগী প্রোফাইল",
    familyProfiles: "ইমুংগী প্রোফাইলশিং",

    savedMemory: "সেভ তৌরবা নীংশিংবা",
    savedMemories: "সেভ তৌরবা নীংশিংবশিং",

    connected:
      "নহাক্কী পার্সোনেল মেমোরি কালেকশনগা শম্নরি",

    whatRemember:
      "নহাক করিমক নীংশিংবা পাম্বগে?",

    companionDescription:
      "নহাক্না ৱাহং ইবা য়াই নত্রগা ভোইস শীজিন্নবা য়াই। SMRITI-না নহাক্কী প্রোফাইলগা মরী লৈনবা ইমুংগী ইনফর্মেশন অমসুং মেমোরিশিং থিগনি।",

    loading:
      "নহাক্কী মেমোরি কালেকশন লোড তৌরি...",

    collectionReady:
      "নহাক্কী মেমোরি কালেকশন রেডি ওইরে",

    collectionReadyDescription:
      "কেয়ারগিভরনা হাপচিল্লবা ফেমিলি প্রোফাইল অমসুং পার্সোনেল মেমোরিশিং মফমসিদা উগনি।",

    askSmriti: "SMRITI-দা হংউ",

    placeholder:
      "মী অমা নত্রগা নীংশিংবা অমগী মতাংদা হংউ...",

    ask: "হংউ",
    searching: "থিরি...",

    preferSpeak:
      "ৱারী শান্নবা পাম্বরা?",

    voiceDescription:
      "ভোইস বতন শীজিন্নদুনা ৱাহং হংউ।",

    tryAsking: "মসিশিং হংদুনা য়েংউ",

    looking:
      "নহাক্কী সেভ তৌরবা মেমোরিশিং থিরি...",

    fromCollection:
      "নহাক্কী মেমোরি কালেকশনদগী",

    readAloud:
      "পাউখুম পাবীয়ু",

    privacyNote:
      "SMRITI-না মেমোরি এসিস্টেন্স পীনবা ফেমিলি প্রোফাইল অমসুং মেমোরিশিং শীজিন্নৈ। মসি রোগ ডায়াগনোসিস তৌদে অমসুং প্রোফেশনেল কেয়রগী মহুৎ শিন্দে।",

    noPatient:
      "নহাক্কী পেশেন্ট প্রোফাইল ফংদে। অমুক লগ ইন তৌবীয়ু।",

    loadError:
      "হৌজিক নহাক্কী ফেমিলি মেমোরিশিং এক্সেস তৌবা ঙমদে।",

    noMatch:
      "নহাক্কী সেভ তৌরবা ফেমিলি প্রোফাইল নত্রগা মেমোরিশিংদা মসিগী ইনফর্মেশন ফংদে।",
  },
};

export function getTranslations(
  language: AppLanguage
) {
  return (
    translations[language] ||
    translations.English
  );
}

export function getLanguageOption(
  language: AppLanguage
) {
  return (
    SUPPORTED_LANGUAGES.find(
      (item) =>
        item.name === language
    ) || SUPPORTED_LANGUAGES[0]
  );
}

export function getStoredLanguage(): AppLanguage {
  const saved =
    localStorage.getItem(
      "smritiLanguage"
    ) as AppLanguage | null;

  const exists =
    SUPPORTED_LANGUAGES.some(
      (language) =>
        language.name === saved
    );

  return exists
    ? (saved as AppLanguage)
    : "English";
}

export function saveLanguage(
  language: AppLanguage
) {
  localStorage.setItem(
    "smritiLanguage",
    language
  );
}