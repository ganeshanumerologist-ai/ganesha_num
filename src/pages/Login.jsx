import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { isValidId, looksLikePhone, isValidOtp, toPhone } from "../auth/identity.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { pageTX } from "../i18n/pageTx.js";
import { isFirebaseConfigured } from "../firebase.js";

const ERR_TX = {
  en: {
    key: "Firebase setup is incomplete — put the real API key in .env (see README). Login/gallery/booking need it.",
    cred: "Wrong email or password. Sign up first.",
    used: "This email is already registered — please sign in.",
    net: "Check your internet connection.",
    otpTab: "Login with OTP",
    otpSend: "Send OTP",
    otpEnter: "Enter OTP",
    otpVerify: "Verify",
    otpSent: "OTP bheja gaya hai — number par check karein.",
    otpBad: "OTP galat ya expire ho gaya.",
    otpResend: "Resend",
    otpBack: "Back",
    otpNeedsPhone: "SMS OTP ke liye Firebase me Phone provider ON hona chahiye (aur Blaze plan — SMS ka charge lagta hai).",
    idLabel: "Email or Mobile Number",
    id: "Email ya 10-digit mobile number daaliye — dono me se koi ek chalta hai.",
    idUsed: "Ye email ya mobile pehle se registered hai — sign in kijiye.",
  },
  hi: {
    key: "Firebase सेटअप अधूरा है — .env फ़ाइल में सही API key डालें (README में तरीका है)। इसके बिना लॉगिन, गैलरी और बुकिंग नहीं चलेंगी; बाकी पेज चलेंगे।",
    cred: "ईमेल या पासवर्ड गलत है। पहले साइन अप करें।",
    used: "यह ईमेल पहले से रजिस्टर्ड है — साइन इन करें।",
    net: "इंटरनेट कनेक्शन जाँचें।",
    otpTab: "OTP से लॉगिन",
    otpSend: "OTP भेजें",
    otpEnter: "OTP डालें",
    otpVerify: "वेरीफाई करें",
    otpSent: "OTP भेज दिया गया है — अपने नंबर पर देखें।",
    otpBad: "OTP गलत या एक्सपायर हो गया।",
    otpResend: "फिर से भेजें",
    otpBack: "वापस",
    otpNeedsPhone: "SMS OTP के लिए Firebase में Phone provider ON होना चाहिए (और Blaze plan — SMS का चार्ज लगता है)।",
    idLabel: "ईमेल या मोबाइल नंबर",
    id: "ईमेल या 10 अंकों का मोबाइल नंबर डालें — दोनों में से कोई एक चलेगा।",
    idUsed: "यह ईमेल या मोबाइल पहले से रजिस्टर्ड है — साइन इन करें।",
  },
  mr: {
    key: "Firebase सेटअप अपूर्ण आहे — .env फाइलमध्ये योग्य API key टाका (README मध्ये पद्धत आहे). त्याशिवाय लॉगिन, गॅलरी आणि बुकिंग चालणार नाहीत; इतर पाने चालतील.",
    cred: "ईमेल किंवा पासवर्ड चूक आहे. आधी साइन अप करा.",
    used: "हा ईमेल आधीच नोंदणीकृत आहे — साइन इन करा.",
    net: "इंटरनेट कनेक्शन तपासा.",
    otpTab: "OTP ने लॉगिन",
    otpSend: "OTP पाठवा",
    otpEnter: "OTP टाका",
    otpVerify: "तपासा",
    otpSent: "OTP पाठवला आहे — तुमच्या क्रमांकावर पहा.",
    otpBad: "OTP चुकचा किंवा expire झाला.",
    otpResend: "पुन्हा पाठवा",
    otpBack: "मागे",
    otpNeedsPhone: "SMS OTP साठी Firebase मध्ये Phone provider ON असणे गरजेच (आणि Blaze plan — SMS चा शुल्क लागतो).",
    idLabel: "ईमेल किंवा मोबाइल क्रमांक",
    id: "ताका नेमवा किंवा 10 अंकी मोबाइल क्रमांक भरा — दोन्हीपैकी एकही चालेल.", idUsed: "हा ईमेल किंवा मोबाइल आधीच नोंदणीकृत आहे — साइन इन करा.",
  },
  bn: {
    key: "Firebase সেটআপ অসম্পূর্ণ — .env ফাইলে সঠিক API key দিন (README-এ পদ্ধতি আছে)। এটি ছাড়া লগইন, গ্যালারি ও বুকিং কাজ করবে না; বাকি পেজ চলবে।",
    cred: "ইমেইল বা পাসওয়ার্ড ভুল। আগে সাইন আপ করুন।",
    used: "এই ইমেইল আগেই নিবন্ধিত — সাইন ইন করুন।",
    net: "ইন্টারনেট সংযোগ পরীক্ষা করুন।",
    otpTab: "OTP দিয়ে লগইন",
    otpSend: "OTP পাঠান",
    otpEnter: "OTP দিন",
    otpVerify: "যাচাই করুন",
    otpSent: "OTP পাঠানো হয়েছে — আপনার নম্বরে দেখুন।",
    otpBad: "OTP ভুল বা মেয়াদ শেষ।",
    otpResend: "আবার পাঠান",
    otpBack: "ফিরে যান",
    otpNeedsPhone: "SMS OTP এর জন্য Firebase এ Phone provider ON থাকতে হবে (এবং Blaze plan — SMS এর চার্জ লাগে)।",
    idLabel: "ইমেইল বা মোবাইল নম্বর",
    id: "ইমেইল বা ১০ অঙ্কের মোবাইল নম্বর দিন — দুটোর যেকোনো একটি চলবে।", idUsed: "এই ইমেইল বা মোবাইল আগেই নিবন্ধিত — সাইন ইন করুন।",
  },
  te: {
    key: "Firebase సెటప్ అసంపూర్ణం — .env ఫైల్‌లో సరైన API key పెట్టండి (README‌లో విధానం ఉంది). దీని లేకుండా లాగిన్, గ్యాలరీ, బుకింగ్ పనిచేయవు; మిగిలిన పేజీలు పనిచేస్తాయి.",
    cred: "ఇమెయిల్ లేదా పాస్‌వర్డ్ తప్పు. ముందుగా సైన్ అప్ చేయండి.",
    used: "ఈ ఇమెయిల్ ఇప్పటికే నమోదు చేసబడింది — సైన్ ఇన్ చేయండి.",
    net: "ఇంటర్‌నెట్ కనెక్షన్ పరిశీలించండి.",
    otpTab: "OTP తో లాగిన్",
    otpSend: "OTP పంపండి",
    otpEnter: "OTP నమోదు చేయండి",
    otpVerify: "ధృవీకరించండి",
    otpSent: "OTP పంపబడింది — మీ నంబర్‌లో చూడండి.",
    otpBad: "OTP తప్పు లేదా గడువు ముగిసింది.",
    otpResend: "మళ్లీ పంపండి",
    otpBack: "వెనుకకు",
    otpNeedsPhone: "SMS OTP కోసం Firebase లో Phone provider ON ఉండాలి (మరియు Blaze plan — SMS కు ఛార్జీ అవుతుంది).",
    idLabel: "ఇమెయిల్ లేదా మొబైల్ నంబర్",
    id: "ఇమెయిల్ లేదా 10 అంకెల మొబైల్ నంబర్ ఇవ్వండి — రెండిటిలో ఏదైనా ఒకటి పనిచేస్తుంది.", idUsed: "ఈ ఇమెయిల్ లేదా మొబైల్ ఇప్పటికే నమోదు — సైన్ ఇన్ చేయండి.",
  },
  ta: {
    key: "Firebase அமைப்பு முழுமையாக இல்லை — .env கோப்பில் சரியான API key இடவும் (README-இல் முறை உள்ளது). இது இல்லாமல் லொகின், கேலரி, பதிவு ஆகியவை இயங்காது; மற்ற பக்கங்கள் இயங்கும்.",
    cred: "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறு. முதலில் பதிவு செய்யுங்கள்.",
    used: "இந்த மின்னஞ்சல் ஏற்கனவே பதிவானது — உள்நுழையுங்கள்.",
    net: "இணைய இணைப்பை சரிபார்க்கவும்.",
    otpTab: "OTP மூலம் உள்நுழை",
    otpSend: "OTP அனுப்பு",
    otpEnter: "OTP உள்ளிடவும்",
    otpVerify: "சரிபார்க்கவும்",
    otpSent: "OTP அனுப்பப்பட்டது — உங்கள் எண்ணில் பாருங்கள்.",
    otpBad: "OTP தவறு அல்லது காலாவதி.",
    otpResend: "மீண்டும் அனுப்பு",
    otpBack: "பின்செல்",
    otpNeedsPhone: "SMS OTP க்கு Firebase இல் Phone provider ON ஆக வேண்டும் (மேலும் Blaze plan — SMS க்கு கட்டணம்).",
    idLabel: "மின்னஞ்சல் அல்லது மொபைல் எண்",
    id: "மின்னஞ்சல் அல்லது 10 இலக்க மொபைல் எண்ணைத் தரவும் — இரண்டில் ஏதேனும் ஒன்று போதும்.", idUsed: "இந்த மின்னஞ்சல் அல்லது மொபைல் ஏற்கனவே பதிவானது — உள்நுழையுங்கள்.",
  },
  gu: {
    key: "Firebase સેટઅપ અપૂર્ણ છે — .env ફાઇલમાં સાચી API key મૂકો (README માં રીત છે). વગર લોગિન, ગેલરી અને બુકિંગ ચલશે નહીં; બાકીના પાના ચલશે.",
    cred: "ઈમેલ કે પાસવર્ડ ખોટો છે. પહેલા સાઇન અપ કરો.",
    used: "આ ઈમેલ પહેલેથી નોંધાયેલો છે — સાઇન ઇન કરો.",
    net: "ઇન્ટરનેટ કનેક્શન તપાસો.",
    otpTab: "OTP થી લોગિન",
    otpSend: "OTP મોકલો",
    otpEnter: "OTP નાખો",
    otpVerify: "ચકાસો",
    otpSent: "OTP મોકલી દીધો છે — તમારા નંબર પર જુઓ.",
    otpBad: "OTP ખોટો અથવા સમાપ્ત.",
    otpResend: "ફરી મોકલો",
    otpBack: "પાછળ",
    otpNeedsPhone: "SMS OTP માટે Firebase માં Phone provider ON હોવો જોઈએ (અને Blaze plan — SMS નો ચાર્જ લાગે છે).",
    idLabel: "ઈમેલ અથવા મોબાઇલ નંબર",
    id: "ઈમેલ અથવા 10 અંકનો મોબાઇલ નંબર આપો — બંનેમાંથી કોઈ એક ચાલશે.", idUsed: "આ ઈમેલ અથવા મોબાઇલ પહેલેથી નોંધાયેલો છે — સાઇન ઇન કરો.",
  },
  ur: {
    key: "Firebase سیٹ اپ مکمل نہیں — .env فائل میں درست API key رکھیں (README میں طریقہ ہے)۔ اس کے بغیر لاگ ان، گیلری اور بکنگ نہیں چلے گی؛ باقی صفحات چلیں گے۔",
    cred: "ای میل یا پاس ورڈ غلط ہے۔ پہلے سائن اَپ کریں۔",
    used: "یہ ای میل پہلے سے رجسٹرڈ ہے — سائن اِن کریں۔",
    net: "انٹرنیٹ کنکشن چیک کریں۔",
    otpTab: "OTP سے لاگ ان",
    otpSend: "OTP بھیجیں",
    otpEnter: "OTP درج کریں",
    otpVerify: "تصدیق کریں",
    otpSent: "OTP بھیج دیا گیا ہے — اپنے نمبر پر دیکھیں۔",
    otpBad: "OTP غلط یا میعاد ختم۔",
    otpResend: "دوبارہ بھیجیں",
    otpBack: "واپس",
    otpNeedsPhone: "SMS OTP کے لیے Firebase میں Phone provider ON ہونا چاہیے (اور Blaze plan — SMS کا-charge لگتا ہے)۔",
    idLabel: "ای میل یا موبائل نمبر",
    id: "ای میل یا 10 ہندسوں کا موبائل نمبر درج کریں — دونوں میں سے کوئی ایک چلے گا۔", idUsed: "یہ ای میل یا موبائل پہلے سے رجسٹرڈ ہے — سائن اِن کریں۔",
  },
  kn: {
    key: "Firebase ಸೆಟಪ್ ಅಪೂರ್ಣವಾಗಿದೆ — .env ಫೈಲ್‌ನಲ್ಲಿ ಸರಿಯಾದ API key ಇಡಿ (README ನಲ್ಲಿ ವಿಧಾನವಿದೆ). ಇದಿಲ್ಲದೆ ಲಾಗಿನ್, ಗ್ಯಾಲರಿ ಮತ್ತು ಬುಕಿಂಗ್ ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ; ಉಳಿದ ಪುಟಗಳು ಕೆಲಸ ಮಾಡುತ್ತವೆ.",
    cred: "ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ. ಮೊದಲು ಸೈನ್ ಅಪ್ ಮಾಡಿ.",
    used: "ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿತು — ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    net: "ಇಂಟರ್ನೆಟ್ ಕನೆಕ್ಷನ್ ಪರಿಶೀಲಿಸಿ.",
    otpTab: "OTP ಮೂಲಕ ಲಾಗಿನ್",
    otpSend: "OTP ಕಳುಹಿಸಿ",
    otpEnter: "OTP ನಮೂದಿಸಿ",
    otpVerify: "ಪರಿಶೀಲಿಸಿ",
    otpSent: "OTP ಕಳುಹಿಸಲಾಗಿದೆ — ನಿಮ್ಮ ಸಂಖ್ಯೆಯಲ್ಲಿ ನೋಡಿ.",
    otpBad: "OTP ತಪ್ಪು ಅಥವಾ ಅವಧಿ ಮುಗಿದಿದೆ.",
    otpResend: "ಮತ್ತೆ ಕಳುಹಿಸಿ",
    otpBack: "ಹಿಂದೆ",
    otpNeedsPhone: "SMS OTP ಗಾಗಿ Firebase ನಲ್ಲಿ Phone provider ON ಇರಬೇಕು (ಮತ್ತು Blaze plan — SMS ಗೆ ಶುಲ್ಕ ಹಾಕುತ್ತದೆ).",
    idLabel: "ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ನಂಬರ್",
    id: "ಇಮೇಲ್ ಅಥವಾ 10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ — ಎರಡರಲ್ಲಿ ಯಾವುದಾದರೂ ಒಂದು ಸಾಕು.", idUsed: "ಈ ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿತು — ಸೈನ್ ಇನ್ ಮಾಡಿ.",
  },
  ml: {
    key: "Firebase സജ്ജിമൻ പൂർത്തിയല്ല — .env ഫയലിൽ ശരിയായ API key ഇടുക (README-ൽ മാർഗം ഉണ്ട്). ഇതില്ലാതെ ലോഗിൻ, ഗാളറി, ബുക്കിംഗ് പ്രവർത്തിക്കില്ല; ബാക്കി പേജുകൾ പ്രവർത്തിക്കും.",
    cred: "ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ് തെറ്റാണ്. ആദ്യം സൈൻ അപ്പ് ചെയ്യുക.",
    used: "ഈ ഇമെയിൽ മുമ്പ് തന്നെ രജിസ്റ്റർ ചെയ്തിരിക്കുന്നു — ലോഗിൻ ചെയ്യുക.",
    net: "ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക.",
    otpTab: "OTP വഴി ലോഗിൻ",
    otpSend: "OTP അയയ്ക്കുക",
    otpEnter: "OTP നൽകുക",
    otpVerify: "പരിശോധിക്കുക",
    otpSent: "OTP അയച്ചു — നിങ്ങളുടെ നമ്പറിൽ കാണുക.",
    otpBad: "OTP തെറ്റാണ് അല്ലെങ്കിൽ കാലാവധി കഴിഞ്ഞു.",
    otpResend: "വീണ്ടും അയയ്ക്കുക",
    otpBack: "പിന്നിലേക്ക്",
    otpNeedsPhone: "SMS OTP നുവൻ Firebase ലിൽ Phone provider ON ആയിരിക്കണം (കൂടാതെ Blaze plan — SMS ന് ചാർജ്).",
    idLabel: "ഇമെയിൽ അല്ലെങ്കിൽ മൊബൈൽ നമ്പർ",
    id: "ഇമെയിൽ അല്ലെങ്കിൽ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക — രണ്ടിലും ഏതെങ്കിലും ഒന്ന് മതി.", idUsed: "ഈ ഇമെയിൽ അല്ലെങ്കിൽ മൊബൈൽ മുമ്പ് തന്നെ രജിസ്റ്റർ ചെയ്തിരിക്കുന്നു — ലോഗിൻ ചെയ്യുക.",
  },
  pa: {
    key: "Firebase ਸੈਟਅੱਪ ਅਧੂਰਾ ਹੈ — .env ਫਾਈਲ ਵਿੱਚ ਸਹੀ API key ਪਾਓ (README ਵਿੱਚ ਤਰੀਕਾ ਹੈ)। ਇਸ ਬਿਨਾਂ ਲੌਗਿਨ, ਗੈਲਰੀ ਅਤੇ ਬੁਕਿੰਗ ਨਹੀਂ ਚੱਲੇਗੀ; ਬਾਕੀ ਪੰਨੇ ਚੱਲਣਗੇ।",
    cred: "ਈਮੇਲ ਜਾਂ ਪਾਸਵਰਡ ਗਲਤ ਹੈ। ਪਹਿਲਾਂ ਸਾਈਨ ਅੱਪ ਕਰੋ।",
    used: "ਇਹ ਈਮੇਲ ਪਹਿਲਾਂ ਤੋਂ ਰਜਿਸਟਰਡ ਹੈ — ਸਾਈਨ ਇਨ ਕਰੋ।",
    net: "ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ।",
    otpTab: "OTP ਰਾਹੀਂ ਲੌਗਿਨ",
    otpSend: "OTP ਭੇਜੋ",
    otpEnter: "OTP ਪਾਓ",
    otpVerify: "ਜਾਂਚੋ",
    otpSent: "OTP ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ — ਆਪਣੇ ਨੰਬਰ 'ਤੇ ਵੇਖੋ।",
    otpBad: "OTP ਗਲਤ ਜਾਂ ਮਿਆਦ ਪੁੱਗ ਗਈ।",
    otpResend: "ਮੁੜ ਭੇਜੋ",
    otpBack: "ਵਾਪਸ",
    otpNeedsPhone: "SMS OTP ਲਈ Firebase ਵਿੱਚ Phone provider ON ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ (ਅਤੇ Blaze plan — SMS ਦਾ ਚਾਰਜ ਲੱਗਦਾ ਹੈ)।",
    idLabel: "ਈਮੇਲ ਜਾਂ ਮੋਬਾਈਲ ਨੰਬਰ",
    id: "ਈਮੇਲ ਜਾਂ 10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਪਾਓ — ਦੋਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਚੱਲੇਗਾ।", idUsed: "ਇਹ ਈਮੇਲ ਜਾਂ ਮੋਬਾਈਲ ਪਹਿਲਾਂ ਤੋਂ ਰਜਿਸਟਰਡ ਹੈ — ਸਾਈਨ ਇਨ ਕਰੋ।",
  },
  or: {
    key: "Firebase ସେଟଅପ ଅସମ୍ପୂର୍ଣ୍ଣ — .env ଫାଇଲରେ ସଠିକ୍ API key ରଖନ୍ତୁ (READMEରେ ପଦ୍ଧତି ଅଛି)। ଏହା ବିନା ଲଗଇନ, ଗେଲରୀ ଓ ବୁକିଂ ଚଲିବ ନାହିଁ; ବାକୀ ପୃଷ୍ଠା ଚଲିବ।",
    cred: "ଇମେଲ କିମ୍ବା ପାସୱାର୍ଡ ଭୁଲ। ପ୍ରଥମେ ସାଇନ ଅପ୍ କରନ୍ତୁ।",
    used: "ଏହି ଇମେଲ ପୂର୍ବରୁ ପଞ୍ଜୀକୃତ — ସାଇନ ଇନ୍ କରନ୍ତୁ।",
    net: "ଇଣ୍ଟରନେଟ୍ ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ।",
    otpTab: "OTP ଦ୍ୱାରା ଲଗଇନ",
    otpSend: "OTP ପଠାନ୍ତୁ",
    otpEnter: "OTP ଦିଅନ୍ତୁ",
    otpVerify: "ଯାଚ କରନ୍ତୁ",
    otpSent: "OTP ପଠାଯାଇଲା — ଆପଣଙ୍କ ନମ୍ବରରେ ଦେଖନ୍ତୁ।",
    otpBad: "OTP ଭୁଲ କିମ୍ବା ମିଆଦ ଶେଷ।",
    otpResend: "ପୁଣି ପଠାନ୍ତୁ",
    otpBack: "ପଛକୁ",
    otpNeedsPhone: "SMS OTP ପାଇଁ Firebase ରେ Phone provider ON ହେବା ଆବଶ୍ୟକ (ଏବଂ Blaze plan — SMS ର ଚାର୍ଜ ଲାଗେ)।",
    idLabel: "ଇମେଲ କିମ୍ବା ମୋବାଇଲ ନମ୍ବର",
    id: "ଇମେଲ କିମ୍ବା 10 ଅଙ୍କର ମୋବାଇଲ ନମ୍ବର ଦିଅନ୍ତୁ — ଦୁଇଠି ମଧ୍ୟରୁ କୌଣସି ଏକ ଚଲିବ।", idUsed: "ଏହି ଇମେଲ କିମ୍ବା ମୋବାଇଲ ପୂର୍ବରୁ ପଞ୍ଜୀକୃତ — ସାଇନ ଇନ୍ କରନ୍ତୁ।",
  },
  as: {
    key: "Firebase ছেটআপ অসম্পূৰ্ণ — .env ফাইলত সঠিক API key দিয়ক (READMEত পথ দেখুওঁ)। এইখন নহ’লে লগইন, গেলাৰী আৰু বুকিং চলিব না; বাকী পৃষ্ঠাবোৰ চলিব।",
    cred: "ইমেইল বা পাছৱৰ্ড ভুল। প্ৰথমে ছাইন আপ কৰক।",
    used: "এই ইমেইল আগৰে পঞ্জীয়ন কৰা আছে — ছাইন ইন কৰক।",
    net: "ইণ্টাৰনেট সংযোগ পৰীক্ষা কৰক।",
    otpTab: "OTPৰে লগইন",
    otpSend: "OTP পঠিয়াওক",
    otpEnter: "OTP দিয়ক",
    otpVerify: "সত্যাপন কৰক",
    otpSent: "OTP পঠিয়াইছে — আপোনাৰ নম্বৰত চাওক।",
    otpBad: "OTP ভুল বা ম্যাদ শেষ।",
    otpResend: "পুনৰ পঠিয়াওক",
    otpBack: "উভতৰলৈ",
    otpNeedsPhone: "SMS OTPৰ বাবে Firebaseত Phone provider ON থাকিব লাগে (আৰু Blaze plan — SMSৰ চাৰ্জ লাগে)।",
    idLabel: "ইমেইল বা মোবাইল নম্বৰ",
    id: "ইমেইল বা ১০ অংকৰ মোবাইল নম্বৰ দিয়ক — দুয়োটাৰ যিকোনো এটা চলিব।", idUsed: "এই ইমেইল বা মোবাইল আগৰে পঞ্জীয়ন কৰা আছে — ছাইন ইন কৰক।",
  },
};

function friendlyError(err, lang) {
  const code = err?.code || "";
  const d = pageTX(ERR_TX, lang);
  if (code.includes("api-key") || code.includes("invalid-api-key") || code.includes("app-no-app") || !isFirebaseConfigured) return d.key;
  if (code.includes("invalid-credential") || code.includes("user-not-found") || code.includes("wrong-password")) return d.cred;
  if (code.includes("email-already-in-use")) return d.idUsed || d.used;
  if (code.includes("network")) return d.net;
  // OTP-specific
  if (code.includes("invalid-verification-code") || code.includes("invalid-verification-id")
    || code.includes("session-expired") || code.includes("code-expired")) return d.otpBad;
  if (code.includes("phone-number-already") || code.includes("browse")) return d.otpNeedsPhone;
  if (code.includes("too-many-requests")) return d.otpBad;
  return err?.message;
}

export default function Login() {
  const { user, loading, login, signup, googleLogin, sendOtp, verifyOtp, signupWithOtp, resetOtp, otpReady } = useAuth();
  const { t, lang } = useLanguage();
  const nav = useNavigate();

  // Login ke baad /login khole to dashboard bhejo
  useEffect(() => {
    if (!loading && user) nav("/dashboard");
  }, [user, loading, nav]);
  const [mode, setMode] = useState("login");   // login | signup
  const [how, setHow] = useState("pass");     // pass | otp
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isPhoneField = looksLikePhone(id);
  const d = pageTX(ERR_TX, lang);
  const CAPTCHA_ID = "recaptcha-otp";

  /* TOTP ke liye number + code submit */
  const sendTheOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidId(id) || !looksLikePhone(id)) { setError(d.id); return; }
    setBusy(true);
    try {
      await sendOtp(id, CAPTCHA_ID);
      setOtpSent(true);
      setNote(d.otpSent);
    } catch (err) {
      setError(friendlyError(err, lang) || d.otpNeedsPhone);
    } finally {
      setBusy(false);
    }
  };

  const verifyTheOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidOtp(otp)) { setError(d.otpBad); return; }
    setBusy(true);
    try {
      if (mode === "signup") await signupWithOtp(id, name, otp);
      else await verifyOtp(otp);
      // number profile me bhi rakh do, forms me auto bhare
      try {
        const cur = JSON.parse(localStorage.getItem("nv-profile") || "{}");
        localStorage.setItem("nv-profile", JSON.stringify({ ...cur, mobile: toPhone(id) }));
      } catch { /* ignore */ }
      nav("/dashboard");
    } catch (err) {
      setError(friendlyError(err, lang));
    } finally {
      setBusy(false);
    }
  };

  const backToOtpStart = () => {
    setOtpSent(false);
    setOtp("");
    setNote("");
    setError("");
    resetOtp();
  };

  // Password aur OTP alag-alag submit
  const submit = how === "otp"
    ? (otpSent ? verifyTheOtp : sendTheOtp)
    : submitPassword;

  async function submitPassword(e) {
    e.preventDefault();
    setError("");
    if (!isValidId(id)) { setError(d.id); return; }
    setBusy(true);
    try {
      if (mode === "login") await login(id, password);
      else await signup(name, id, password);
      if (looksLikePhone(id)) {
        try {
          const cur = JSON.parse(localStorage.getItem("nv-profile") || "{}");
          localStorage.setItem("nv-profile", JSON.stringify({ ...cur, mobile: toPhone(id) }));
        } catch { /* ignore */ }
      }
      nav("/dashboard");
    } catch (err) {
      setError(friendlyError(err, lang));
    } finally {
      setBusy(false);
    }
  }

  const google = async () => {
    setError("");
    try {
      await googleLogin();
      nav("/dashboard");
    } catch (err) {
      setError(friendlyError(err, lang));
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1 className="text-gradient">{t("login_title")}</h1>
      {!isFirebaseConfigured && (
        <div className="card" style={{ marginTop: 16, borderColor: "var(--gold)" }}>
          <p style={{ color: "var(--gold)" }}>{friendlyError({ code: "auth/api-key-not-valid" }, lang)}</p>
        </div>
      )}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button className={mode === "login" ? "btn" : "btn secondary"} onClick={() => setMode("login")}>{t("sign_in")}</button>
          <button className={mode === "signup" ? "btn" : "btn secondary"} onClick={() => setMode("signup")}>{t("sign_up")}</button>
        </div>

        {/* ---- Password ya OTP ---- */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <button
            type="button"
            className={how === "pass" ? "btn" : "btn secondary"}
            style={{ padding: "8px 16px", fontSize: ".85rem" }}
            onClick={() => { setHow("pass"); setError(""); }}
          >
            {t("password")}
          </button>
          <button
            type="button"
            className={how === "otp" ? "btn" : "btn secondary"}
            style={{ padding: "8px 16px", fontSize: ".85rem" }}
            onClick={() => { setHow("otp"); backToOtpStart(); }}
          >
            {d.otpTab}
          </button>
        </div>

        <form onSubmit={submit} className="grid">
          {mode === "signup" && (
            <div>
              <label className="label">{t("contact_name")}</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div>
            <label className="label">{d.idLabel}</label>
            <input
              className="input"
              type="text"
              inputMode={how === "otp" || isPhoneField ? "numeric" : "email"}
              autoComplete="username"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={isPhoneField ? "98765 43210" : "name@example.com"}
              required={!(how === "otp" && otpSent)}
              disabled={how === "otp" && otpSent}
            />
            <p style={{ fontSize: ".78rem", marginTop: 6 }}>{d.id}</p>
          </div>

          {/* ---- OTP ka doosra step ---- */}
          {how === "otp" && otpSent && (
            <div>
              <label className="label">{d.otpEnter}</label>
              <input
                className="input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                required
                autoFocus
              />
              {note && <p style={{ fontSize: ".8rem", marginTop: 6, color: "#34d399" }}>{note}</p>}
            </div>
          )}

          {/* ---- Password ---- */}
          {how === "pass" && (
            <div>
              <label className="label">{t("password")}</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          <button className="btn" disabled={busy}>
            {busy
              ? t("loading")
              : how === "otp"
                ? (otpSent ? d.otpVerify : d.otpSend)
                : (mode === "login" ? t("sign_in") : t("sign_up"))}
          </button>

          {/* ---- OTP ke buttons ---- */}
          {how === "otp" && otpSent && (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                className="btn secondary"
                style={{ flex: 1, padding: "10px 14px", fontSize: ".85rem" }}
                onClick={sendTheOtp}
                disabled={busy}
              >
                {d.otpResend}
              </button>
              <button
                type="button"
                className="btn secondary"
                style={{ flex: 1, padding: "10px 14px", fontSize: ".85rem" }}
                onClick={backToOtpStart}
              >
                {d.otpBack}
              </button>
            </div>
          )}
        </form>

        {/* ---- Firebase OTP ke liye ye div chahiye (reCAPTCHA yahan aata hai) ---- */}
        {how === "otp" && !otpSent && (
          <div id={CAPTCHA_ID} style={{ marginTop: 14 }} />
        )}
        <div style={{ marginTop: 12 }}>
          <button className="btn secondary" style={{ width: "100%" }} onClick={google}>{t("google_signin")}</button>
        </div>
        {error && <p style={{ color: "var(--danger)", marginTop: 10 }}>{error}</p>}
        <p style={{ marginTop: 12, fontSize: ".85rem" }}>
          <Link to="/experts" style={{ color: "var(--accent-2)" }}>{t("hero_cta2")} →</Link>
        </p>
      </div>
    </div>
  );
}
