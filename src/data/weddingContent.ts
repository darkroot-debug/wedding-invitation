export type LanguageCode = 'en' | 'hi' | 'hinglish';

export interface WeddingFunctionItem {
  id: 'tilak' | 'haldi' | 'ghritdhari' | 'baraat';
  name: Record<LanguageCode, string>;
  dayDate: Record<LanguageCode, string>;
  time: Record<LanguageCode, string>;
  place?: Record<LanguageCode, string>;
  dressLabel?: Record<LanguageCode, string>;
  dressColorName?: Record<LanguageCode, string>;
  dressSwatch?: string;
  dressSwatchSecondary?: string;
  sceneKey: 'tilak' | 'haldi' | 'ghritdhari' | 'baraat';
}

export interface StorySlideItem {
  id: string;
  artKey: 'story1' | 'story2' | 'story3' | 'story4';
  title: Record<LanguageCode, string>;
  caption: Record<LanguageCode, string>;
}

export const WEDDING_TARGET_ISO = '2026-12-02T20:00:00+05:30';

export const VENUE_ADDRESS =
  'Shahdeo Banquet Hall (near Krishi Bhawan), Kanke Road, Ranchi';

export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Shahdeo+House+Banquet+Hall,+Kanke+Road,+Ranchi';

export const WEDDING_FUNCTIONS: WeddingFunctionItem[] = [
  {
    id: 'tilak',
    name: {
      en: 'Tilak Ceremony & Feast',
      hi: 'तिलक समारोह एवं प्रीतिभोज',
      hinglish: 'Tilak Ceremony & Feast',
    },
    dayDate: {
      en: 'Tuesday, 01 December 2026',
      hi: 'मंगलवार, 01 दिसम्बर 2026',
      hinglish: 'Mangalwar, 01 December 2026',
    },
    time: {
      en: 'From 12 noon onwards',
      hi: 'दोपहर 12 बजे से',
      hinglish: 'Dopahar 12 baje se',
    },
    sceneKey: 'tilak',
  },
  {
    id: 'haldi',
    name: {
      en: 'Haldi Kalash & Mandap Covering',
      hi: 'हल्दी कलश एवं मण्डपाच्छादन',
      hinglish: 'Haldi Kalash & Mandap Covering',
    },
    dayDate: {
      en: 'Tuesday, 01 December 2026',
      hi: 'मंगलवार, 01 दिसम्बर 2026',
      hinglish: 'Mangalwar, 01 December 2026',
    },
    time: {
      en: 'In the evening',
      hi: 'संध्या काल में',
      hinglish: 'Shaam ke samay',
    },
    sceneKey: 'haldi',
  },
  {
    id: 'ghritdhari',
    name: {
      en: 'Ghritdhari',
      hi: 'घृतढारी एवं मटकोर',
      hinglish: 'Ghritdhari',
    },
    dayDate: {
      en: 'Wednesday, 02 December 2026',
      hi: 'बुधवार, 02 दिसम्बर 2026',
      hinglish: 'Budhwar, 02 December 2026',
    },
    time: {
      en: 'During the day',
      hi: 'दिन के समय',
      hinglish: 'Din ke samay',
    },
    sceneKey: 'ghritdhari',
  },
  {
    id: 'baraat',
    name: {
      en: 'Baraat Departure',
      hi: 'बारात प्रस्थान',
      hinglish: 'Baraat Departure',
    },
    dayDate: {
      en: 'Wednesday, 02 December 2026',
      hi: 'बुधवार, 02 दिसम्बर 2026',
      hinglish: 'Budhwar, 02 December 2026',
    },
    time: {
      en: 'At 8:00 PM',
      hi: 'रात्रि 8:00 बजे',
      hinglish: 'Raat 8:00 baje',
    },
    place: {
      en: 'Near Reliance Mart (SS. Memorial College) to Shahdeo Banquet Hall',
      hi: 'रिलायंस मार्ट (एस.एस. मेमोरियल कॉलेज) के पास से सहदेव बैंक्वेट हॉल',
      hinglish: 'Near Reliance Mart (SS. Memorial College) se Shahdeo Banquet Hall',
    },
    sceneKey: 'baraat',
  },
];

export const STORY_SLIDES: StorySlideItem[] = [
  {
    id: 'slide-1',
    artKey: 'story1',
    title: {
      en: 'Where Forever Began',
      hi: 'जहाँ से सफ़र शुरू हुआ',
      hinglish: 'Jahan Se Safar Shuru Hua',
    },
    caption: {
      en: 'One warm glance under golden skies, and two paths quietly became one.',
      hi: 'सुनहरी शाम की एक मुस्कान, और दो राहें हमेशा के लिए एक हो गईं।',
      hinglish: 'Ek pyaari si muskaan, aur do raaste hamesha ke liye ek ho gaye.',
    },
  },
  {
    id: 'slide-2',
    artKey: 'story2',
    title: {
      en: 'Quiet Walks & Shared Laughter',
      hi: 'सुकून भरे पल और मुस्कान',
      hinglish: 'Sukoon Bhare Pal & Laughter',
    },
    caption: {
      en: 'In unhurried conversations and gentle afternoons, we found home in each other.',
      hi: 'मीठी बातों और सुनहरी दोपहरों में हमें एक-दूसरे में अपना घर मिल गया।',
      hinglish: 'Chhoti-chhoti baaton aur saath chalte hue humein apna ghar mil gaya.',
    },
  },
  {
    id: 'slide-3',
    artKey: 'story3',
    title: {
      en: 'Two Families, One Blessing',
      hi: 'दो परिवार, एक आशीर्वाद',
      hinglish: 'Do Parivaar, Ek Aashirwad',
    },
    caption: {
      en: 'Carried forward by the love, grace, and blessings of generations before us.',
      hi: 'बड़ों के स्नेह, संस्कारों और आशीर्वाद से सजा यह पावन बंधन।',
      hinglish: 'Badon ke pyaar, sanskaar aur aashirwad se saja yeh khoobsurat bandhan.',
    },
  },
  {
    id: 'slide-4',
    artKey: 'story4',
    title: {
      en: 'Written in Henna & Gold',
      hi: 'मेहंदी और सिंदूर का संगम',
      hinglish: 'Mehendi & Forever',
    },
    caption: {
      en: 'Hand in hand, counting every heartbeat until we say our sacred vows in Ranchi.',
      hi: 'हाथों में हाथ थामे, 02 दिसम्बर के उस शुभ दिन की प्रतीक्षा में।',
      hinglish: 'Haathon mein haath thaame, 02 December ke us khaas din ka intezaar.',
    },
  },
];

export const COPY = {
  auspiciousInvocation: {
    en: '|| Shri Ganeshaya Namah ||',
    hi: '|| श्री गणेशाय नमः ||',
    hinglish: '|| श्री गणेशाय नमः ||',
  },
  loadingLabel: {
    en: 'Preparing your invitation',
    hi: 'आमंत्रण तैयार हो रहा है',
    hinglish: 'Aamantran taiyaar ho raha hai',
  },
  tapBook: {
    en: 'Tap the book to open',
    hi: 'आमंत्रण खोलने के लिए स्पर्श करें',
    hinglish: 'Book ko tap karke kholein',
  },
  coverSubtitle: {
    en: 'Wedding Invitation',
    hi: 'शुभ विवाह आमंत्रण',
    hinglish: 'Shubh Vivah Invitation',
  },
  togetherWith: {
    en: 'Together with their families',
    hi: 'अपने सपरिवार के संग',
    hinglish: 'Apne parivaar ke saath',
  },
  groomName: {
    en: 'Sumit',
    hi: 'सुमित',
    hinglish: 'Sumit',
  },
  brideName: {
    en: 'Rimi',
    hi: 'रिमी',
    hinglish: 'Rimi',
  },
  groomGrandson: {
    en: 'Grandson of Late Ratan Devi & Late Sadashiv Prasad',
    hi: 'पौत्र — स्व. रतन देवी एवं स्व. सदाशिव प्रसाद',
    hinglish: 'Pautra — Late Ratan Devi & Late Sadashiv Prasad',
  },
  groomSon: {
    en: 'Son of Smt. Rashmi Sinha & Shri Sushil Kumar Sinha',
    hi: 'सुपुत्र — श्रीमती रश्मि सिन्हा एवं श्री सुशील कुमार सिन्हा',
    hinglish: 'Son of Smt. Rashmi Sinha & Shri Sushil Kumar Sinha',
  },
  brideGranddaughter: {
    en: 'Granddaughter of Late Rani Devi & Late Lala Harinandan Prasad',
    hi: 'पौत्री — स्व. रानी देवी एवं स्व. लाला हरिनन्दन प्रसाद',
    hinglish: 'Pautri — Late Rani Devi & Late Lala Harinandan Prasad',
  },
  brideDaughter: {
    en: 'Daughter of Smt. Rita Sinha & Late Lala Randhir Kumar',
    hi: 'सुपुत्री — श्रीमती रीता सिन्हा एवं स्व. लाला रणधीर कुमार',
    hinglish: 'Daughter of Smt. Rita Sinha & Late Lala Randhir Kumar',
  },
  inviteLine: {
    en: 'joyfully invite you to grace the auspicious celebration of their wedding',
    hi: 'अपने शुभ विवाह के मंगल अवसर पर आपकी स्नेहमयी उपस्थिति हेतु सादर आमंत्रित करते हैं',
    hinglish: 'aapko apne Shubh Vivah ke mangal avsar par saadar aamantrit karte hain',
  },
  scrollDown: {
    en: 'Scroll gently',
    hi: 'नीचे देखें',
    hinglish: 'Neeche scroll karein',
  },
  saveTheDateHeading: {
    en: 'Save the Date',
    hi: 'शुभ तिथि',
    hinglish: 'Save the Date',
  },
  pullHint: {
    en: 'Pull or tap the tassel to unroll',
    hi: 'तिथि देखने के लिए लटकन खींचें या स्पर्श करें',
    hinglish: 'Date dekhne ke liye tassel kheenchein ya tap karein',
  },
  weddingDateDay: {
    en: 'Wednesday',
    hi: 'बुधवार',
    hinglish: 'Budhwar · Wednesday',
  },
  weddingDateFull: {
    en: '02 December 2026',
    hi: '02 दिसम्बर 2026',
    hinglish: '02 December 2026',
  },
  weddingVenueShort: {
    en: 'Shahdeo Banquet Hall · Kanke Road, Ranchi',
    hi: 'सहदेव बैंक्वेट हॉल · काँके रोड, राँची',
    hinglish: 'Shahdeo Banquet Hall · Kanke Road, Ranchi',
  },
  addToCalendar: {
    en: 'Add to calendar',
    hi: 'कैलेंडर में जोड़ें',
    hinglish: 'Calendar mein save karein',
  },
  calendarSaved: {
    en: 'Calendar invite downloaded',
    hi: 'कैलेंडर में सहेजा गया',
    hinglish: 'Calendar invite save ho gaya',
  },
  countdownUnits: {
    en: { d: 'days', h: 'hrs', m: 'min', s: 'sec' },
    hi: { d: 'दिन', h: 'घंटे', m: 'मिनट', s: 'सेकंड' },
    hinglish: { d: 'days', h: 'hrs', m: 'min', s: 'sec' },
  },
  weddingArrived: {
    en: 'The auspicious wedding celebrations have begun!',
    hi: 'शुभ विवाह उत्सव प्रारंभ हो चुका है!',
    hinglish: 'Shubh Vivah utsav shuru ho chuka hai!',
  },
  festivitiesHeading: {
    en: 'Wedding Functions',
    hi: 'विवाह कार्यक्रम',
    hinglish: 'Wedding Functions',
  },
  festivitiesSub: {
    en: 'Swipe to explore each auspicious ritual',
    hi: 'सभी मांगलिक कार्यक्रम देखने के लिए स्वाइप करें',
    hinglish: 'Har rasam dekhne ke liye swipe karein',
  },
  ourStoryHeading: {
    en: 'Our Story',
    hi: 'हमारी कहानी',
    hinglish: 'Hamari Kahani',
  },
  ourStorySub: {
    en: 'Moments cherished along the way',
    hi: 'साथ बिताए कुछ अनमोल पल',
    hinglish: 'Saath bitaye kuch khaas pal',
  },
  receptionKicker: {
    en: 'An Evening of Blessings & Celebration',
    hi: 'स्नेह मिलन एवं आशीर्वाद संध्या',
    hinglish: 'Aashirwad & Celebration',
  },
  receptionHeading: {
    en: 'NOTE',
    hi: 'नोट',
    hinglish: 'NOTE',
  },
  receptionBody: {
    en: 'The Baraat will depart on 02.12.2026 (Wednesday) at 8 PM from near Reliance Mart (SS. Memorial College) for Shahdeo Banquet Hall (near Krishi Bhawan), Kanke Road, Ranchi.',
    hi: 'बारात दिनांक 02.12.2026 (बुधवार) को रात्रि 8 बजे रिलायंस मार्ट (एस.एस. मेमोरियल कॉलेज) के पास से सहदेव बैंक्वेट हॉल (कृषि भवन के पास), काँके रोड, राँची के लिए प्रस्थान करेगी।',
    hinglish: 'Baraat 02.12.2026 (Wednesday) ko raat 8 PM near Reliance Mart (SS. Memorial College) se Shahdeo Banquet Hall (near Krishi Bhawan), Kanke Road, Ranchi ke liye prasthan karegi.',
  },
  receptionTime: {
    en: 'Wednesday, 02 December 2026 · From 8:30 PM onwards',
    hi: 'बुधवार, 02 दिसम्बर 2026 · रात्रि 8:30 बजे से',
    hinglish: 'Wednesday, 02 December 2026 · Raat 8:30 baje se',
  },
  locationHeading: {
    en: 'The Venue',
    hi: 'विवाह स्थल',
    hinglish: 'Wedding Venue',
  },
  locationSub: {
    en: 'Tap the illustrated map to open Google Maps',
    hi: 'दिशा जानने के लिए मानचित्र पर स्पर्श करें',
    hinglish: 'Directions ke liye map par tap karein',
  },
  getDirections: {
    en: 'Get directions',
    hi: 'दिशा-निर्देश देखें',
    hinglish: 'Get directions',
  },
  copyAddress: {
    en: 'Copy address',
    hi: 'पता कॉपी करें',
    hinglish: 'Address copy karein',
  },
  copiedAddress: {
    en: 'Address copied',
    hi: 'पता कॉपी हो गया',
    hinglish: 'Address copy ho gaya',
  },
  closingHeading: {
    en: "We can't wait to celebrate with you",
    hi: 'आपके सपरिवार पधारने की प्रतीक्षा में',
    hinglish: 'Aapke saath jashn manane ka intezaar rahega',
  },
  closingWarm: {
    en: 'With heartfelt warmth & blessings',
    hi: 'स्नेहाकांक्षी एवं विनीत',
    hinglish: 'Dil se sneh aur aashirwad ke saath',
  },
  groomSideLabel: {
    en: 'Groom’s Family',
    hi: 'वर पक्ष',
    hinglish: 'Groom’s Family',
  },
  brideSideLabel: {
    en: 'Bride’s Family',
    hi: 'वधू पक्ष',
    hinglish: 'Bride’s Family',
  },
  personalizeLabel: {
    en: 'Attach your own photos or MP3',
    hi: 'अपनी फ़ोटो या संगीत जोड़ें',
    hinglish: 'Apni photos ya MP3 lagayein',
  },
} as const;

export function downloadWeddingIcs(): void {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sumit and Rimi Wedding//Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:sumit-rimi-wedding-2026@ranchi',
    'DTSTAMP:20261125T080000Z',
    'DTSTART:20261202T143000Z',
    'DTEND:20261202T183000Z',
    'SUMMARY:Sumit & Rimi Wedding Celebration',
    'DESCRIPTION:Together with their families\\, Sumit (Son of Smt. Rashmi Sinha & Shri Sushil Kumar Sinha) and Rimi (Daughter of Smt. Rita Sinha & Late Lala Randhir Kumar) joyfully invite you to celebrate their wedding. Baraat departs at 8:00 PM from near Reliance Mart (SS. Memorial College).',
    'LOCATION:Shahdeo Banquet Hall (near Krishi Bhawan)\\, Kanke Road\\, Ranchi',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Sumit-and-Rimi-Wedding-02-Dec-2026.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
