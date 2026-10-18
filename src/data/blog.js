// ════════════════════════════════════════════════════════════════════
//  BLOG POSTS — lamba content
//
//  Pehle har post ~100 words thi. Google 800-1500 words wale article
//  par rank karta hai; 100 words = "thin content" = ranking nahi.
//
//  Likhne ka niyam:
//    • Hinglish me, jaise user actually poochta hai ("mulank 1 ke
//      upay kya hai") — wahi search keywords
//    • Har post me FAQ → JSON-LD FAQPage (rich result)
//    • Har post ke andar related pages ke links (internal linking)
//
//  ⚠️ SAARE strings backtick (template literal) me hain. Quotes
//  (single/double) ki wajah se JS strings toot jaate the —
//  "sab kuch karo" jaise shabd likhte hi syntax error aa jaata tha.
// ════════════════════════════════════════════════════════════════════

export const POSTS = [
  // ─────────────────────────────────────────────────────────────
  {
    id: `mulank-1-upay`,
    title: `Mulank 1 Walon ke Upay — Netritva Ka Asli Arth aur 7 Aasan Upay`,
    excerpt: `Mulank 1 Surya ka ank hai. Iske upay samajhne se pehle ye jaano ki Mulank kya chhupata hai, kya karta hai, aur gusse par kaabu rakhne ke 7 practical upay kya hain.`,
    tags: [`Mulank 1`, `Upay`, `Surya`, `Numerology`],
    readMin: 7,
    body: [
      `Agar aapka janm di ka mulank hai, to aap akele nahi — aap wo insaan ho jiska aksar logo ne pehchaana hi nahi hai. Neta, pahal karne wala, sochne wala. Lekin jab tak koi samajhta nahi, doosre bhi ise samajhne ki koshish karte rehte hain.`,
      `Yahi asafal-bhava hai Mulank 1 ki pehchaan. Ise samajhna zaroori hai, kyunki baaki sab upay isi ek cheez se judte hain.`,
    ],
    sections: [
      {
        h: `Mulank 1 ka matlab kya hai`,
        p: [
          `Mulank woh ank hai jo aapke janm di ke aakhri digit se banta hai. Maan lijiye 15 March 1990 — aakhri digit 0 hai, to mulank 0. Agar 23 August 1975 hai, to aakhri digit 5 hai, to mulank 5. Har insaan ka koi na koi mulank hota hai, aur 1 se 9 tak har ank ka ek alag graha aur alag prakriti hai.`,
          `Mulank 1 ka graha Surya hai. Surya dikhta hai, sochta hai, rakhta hai — lekin usme aag bhi hai. Isliye Mulank 1 wale do cheezon se zyada nikalte hain: authority aur irritation. Agar aapki jagah par aapko do logo se zyada sunna pade, to aapka gussa usi se hai, aur Mulank 1 usi se sudharta hai.`,
          `Suno aur dekho — jo aapko lagta hai ki bahar ke logon ne aapko samjha hi nahi, aur jo aapko lagta hai ki main kuch nahi kar pa raha, ye dono ek hi cheez hain. Usi gusse ko samajhna pehla upay hai.`,
        ],
      },
      {
        h: `Mulank 1 ke 7 practical upay`,
        p: [
          `1) Subah Surya ko jal dein. Surya ooper hai, isliye prarthana karte waqt mooh aur aankh oopar uthayein. Aankh band karke Om Suryaya Namah 11 baar bolein. Pehle 3 din shuru karein, phir hafte me 2 din — rozana karne ki zaroorat nahi.`,
          `2) Laal rang ka prayog karein. Lal sirf kapde me nahi — pen, diary, wallet, gaadi ka dabba. Mulank 1 ki garmi laal rang kham karta hai. Safed aur neela rang iske bilkul ulat hain, unhe is saal kam rakhein.`,
          `3) Ravivaar ko gud-gehu ka daan karein. Ek muthi gehu, kuch meetha (gud), aur chaunamein paani ka bhandara. Jo bhi dil se de sakein, zarooratmand ho. Daan ka maqsad paisa nahi, chinta halka karna hai.`,
          `4) Faisla lene se pehle 10 tak ginein. Yeh sabse practical upay hai aur sabse kam wala bhi. Gusse me jo decision 10 second me hota hai, 1 saal baad pata chalta hai uska nateeja kya tha. Mahavir Ekadashi aur Sankashti Chaturthi ke din faisla lena aur bhi avayoh hai.`,
          `5) Kisi ek kaam me sach me mahir banein. Mulank 1 ka asli upay ye nahi ki sab kuch karein. Ek cheez chuniye — music, coding, kheti, likhna, kuch bhi — aur 2 saal usi me lagein. Bheed ke peeche bhaagne se Mulank 1 sukhi ho jaata hai; ek gaon me gehrai se uski shanti milti hai.`,
          `6) Pita ya pita-jaisa vyakti ke saath sambandh theek rakhein. Mulank 1 wale aksar baap se ladte hain kyunki dono me leader ki aadat hai. Ek baar baat kar lete hain — wo aksar 10 questions ka jawab hota hai.`,
          `7) Mahine me ek Ravivaar kisi ko bhojan karayein. Khud ya apna parivaar — koi bhi. Pehle mann karta hai mujhe nahi karna, phir wohi mann dobara aata hai jahan daraj se banne me arshaan hota hai.`,
        ],
      },
      {
        h: `Mulank 1 ke 3 aam vichar`,
        p: [
          `Sabse badi galti — tez hona kamzori nahi hai. Aapki sabse badi taakat yahi hai, sirf uske liye sahi maidan chahiye.`,
          `Doosri galti — sab mujhse pehle hona chahiye wali soch. Isse rishte toot-te hain aur akela pan barta hai. Tez hona aur aage badhna alag baat hai.`,
          `Teesri galti — khud ka nuqsaan karke doosron ki madad karna. Isse Surya nahi, Mahatma ban jaata hai. Madad karne ka sahi tareeka ye hai ki apna kaam pehle poora karo, phir doosron ki madad karo.`,
        ],
      },
      {
        h: `Mulank 1 me kya nahi karna chahiye`,
        p: [
          `Sabhi 1000 rupaye me instant mukti wale baje kabhi na khareedein — koi bhi bhagwan 1000 me nahi bechta. Graha dosh ka naam lekar dhamki dene wale bhi nahi — sahi jyotishi aapko kaam batayega, dhamki nahi.`,
          `Aur ye mat sunna ki tumhare bade bhai ke graha se tumhara bura ho raha hai. Ye galat hota hai. Har vyakti ka apna graha apni hi kundli se nikalte hain, doosre se nahi.`,
          `Agar aapko kisi bhi cheez ka gehra analysis chahiye — apna Moolank, Ashay Rup, Personal Year aur upay — to Kundli aur Loshu page par jaane se pehle apni janm tithi, samay aur shehar taiyaar rakhein. Sab kuch bina login ke chalta hai.`,
        ],
      },
    ],
    faq: [
      [`Mulank 1 kya hota hai?`, `Mulank 1 wo ankh hai jo janm di ke aakhri digit se banta hai. Ye Surya ka ankh hai — iske grahwal Mulank 1 wale neta, pehchaanne wale aur thode gusse wale samajhe jaate hain.`],
      [`Mulank 1 me gussa kaise kam karein?`, `Pehle faisla lene se 10 tak ginein, laal rang ke vastu paas rakhein, aur Suray ko jal dein. Tez hona buri baat nahi — sahi maidan ka intezaam karna hai.`],
      [`Kya Mulank 1 wale logo ki shaadi nahi hoti?`, `Aisa koi niyam nahi hai. Mulank 1 ka matlab sirf ye hai ki vyakti thoda akela aur leadership wala hota hai. Shaadi bilkul ho sakti hai.`],
      [`Mulank 1 aur 10 me kya antar hai?`, `Mulank 1 ankh 1 hai, lekin 10 ka ankh banakar use hota hai — vyakti me dono energies hoti hain. Isliye Calculator par Ashay Rup dekhein, sirf Mulank par depend na rahein.`],
      [`Surya graha shubh hai ya ashubh?`, `Dono. Surya pehla graha hai — yahin se har aur graha ki panchami shuruaat hoti hai. Lekin atyadhik Surya ego aur aamv bana deta hai, isliye santulan zaroori hai.`],
    ],
    links: [
      [`/calculator`, `Apna Moolank, Life Path aur Soul Urge nikaalein`],
      [`/loshu`, `Lo Shu Grid se apna missing number dekhein`],
      [`/kundli`, `Apni kundli me Suray ki position dekhein`],
      [`/remedies`, `Graha-graha ke poore upay padhein`],
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: `bhagyank-8-dhan`,
    title: `Bhagyank 8 Dhan ke Liye Sahi Disha — Shani Graha Ka Poora Arth`,
    excerpt: `Bhagyank 8 Shani ka ankh hai — iske matlab koi jaldi wala nahi. Mehnat ka poora phal milne ka sahi tareeka aur 7 niyam yahan hain.`,
    tags: [`Bhagyank 8`, `Dhan`, `Shani`, `Numerology`],
    readMin: 8,
    body: [
      `Agar aapka Bhagyank 8 hai, to aapko aksar log kehte hain — teri mehnat zyada karni padegi. Adhoori baat hai ye. Asli baat ye hai ki aapka har mehnat ka phal poora milta hai, bas waqt lagta hai.`,
      `Jahan doosre log jaldi result chahte hain, wahan hi problem hoti hai. Shani dheere chalne wala graha hai, isliye uske upay bhi dheere lekin pakke hote hain.`,
    ],
    sections: [
      {
        h: `Bhagyank 8 kya batata hai`,
        p: [
          `Bhagyank woh ankh hai jo janm di ke sabhi aksharo ke total se nikalta hai. Ye aapki zindagi ka karmic hissa hai — woh jo kuch aapko pehle se mila hai aur jo aage bhi milega, lekin mehnat ke badle.`,
          `Agar Mulank aapka aap hai, to Bhagyank aapka hisaab hai.`,
          `Shani ka ankh 8 hua kar aksar log sochte hain ki paisa kam hai. Asli baat ye hai: 8 ke liye paisa aata hai, lekin tab jab system bana kar aata hai. Jo log 8 se dhan kamaate hain, unke paas aksar aksha bhi hota hai — paisa hi chalti hai.`,
          `Isi liye Bhagyank 8 wale logon se jaldi paisa ki chinta door rakhein. Unka apna raasta lamba hai, magar seedha aur pakka hai.`,
        ],
      },
      {
        h: `Shani ke 7 niyam — dhan ke liye`,
        p: [
          `1) Shanivaar ko peepal (bodhi) ke neeche jal dein aur sarson ka tel jalayein. Roshni Shani ko deti hai — par roz nahi, mahine me 2 baar. Pandit Shani ko hafte wale kripalu sant aur bhakt ka heer milta hai; aap bhi unki seva aise kar sakte hain.`,
          `2) Kaale aur gehre rang shubh hain. Roz jeevan me kabhi kabhi gehre neela aur sunehra rang use karein. Safed aur chamakta hua kapda kam rakhein — Shani ka apna rang kaala hai.`,
          `3) Mazdoor, driver, safai-karmi, maali — inke saath kabhi durvyavhaar na karein. Shani bhookha insaan se sabse pehle milta hai. Inke khidmaan bade-raajya aapko Shani se bachate hain.`,
          `4) Dhan aaye to 10% turant baat kar dein. Yaaniche bachat, sankalp ya koi acchi cheez. Baaki 90% kharch karein. Yehi 10 ka niyam hai — Shani ko jaanna chahiye ki paisa rukega, isliye kheenchta nahi.`,
          `5) Personal Year 8 wala saal hi Shani walon ka sabse bada dhan ka saal hota hai. Varshphal page par apna saal nikaal kar dekhein ki aapka vyakti aur varsh ankh kya hai.`,
          `6) Bade rishton se door rahein. Shani rishte me farak laata hai, par yahan kaam kar raha hai. Agar Shani ka dosh hai, to Varshphal uske shuruaat ka ghana aur ant bata dega.`,
          `7) Kaam shuruaat me hi karein. 8 ka ankh 8 ki tarah upar se shuru hota hai — waise hi kaam. Subah jaldi uth kar janjit kaam shuru karo, chai pehle nahi.`,
        ],
      },
      {
        h: `Shani ke liye kaunsi Mani`,
        p: [
          `Shani ke liye neela mani — Amethyst ya Blue Sapphire — hamesha se btaya gaya hai. Par meri salah ye hai: koi bhi mani pehle lagan dekhe.`,
          `Jyotish me gem lagane se pehle kundli me grah ki shadbala check karni chahiye. Kamzor grah ka mani palat sakta hai — 6000 rupaye kharchna koi shabd nahi.`,
          `Isliye Kundli page par apni kundli banayein; gem ki salah alag section me milegi. Wahan sirf wahi mani bataai jayegi jo aapki kundli ke hisaab se theek ho. Aur koi bhi vyakti kisi doosre ko sasti mani mat batave.`,
        ],
      },
      {
        h: `Shani ke 3 bade vichar`,
        p: [
          `Vichar 1: Shani dard deta hai, par zarurat ke baad. Jo log nahi maangte hain, unko koi nahi deta. Maangna sikho, chashmi mat maango.`,
          `Vichar 2: Shani pita ka graha hai, isliye ghar me baap ki kami hoti hai. Agar aapke ghar me baap ki kami hai, to mandir se koi hal nahi hoga — nihit karana mat kijiye.`,
          `Vichar 3: Shani ka aksar vargottam 8 hota hai (kundli me do jagah Shani), par vargottam ankh 87 ka hota hai jo bahut kam logon ko milta hai. Agar aapka Ashay Rup 8 hai, to ek shani ke upar do hain — isliye upay thoda aur karna padta hai.`,
        ],
      },
      {
        h: `Apna Ashay Rup kaise nikalein`,
        p: [
          `Calculator page par apni janm tithi daalein — Moolank, Bhagyank, Life Path aur Ashay Rup sab ek saath aa jaate hain.`,
          `Agar Ashay Rup 87 ya 88 aa raha hai, to aapke andar Shani ki extra shakti hai. Iske liye Varshphal aur Remedies page dekhein — wahan graha-graha ke poore ayante hain.`,
        ],
      },
    ],
    faq: [
      [`Bhagyank 8 wale log dhan kyun nahi kamate?`, `Isliye wo aksar jaldi wale tareeke chunte hain. Shani poora phal deta hai, lekin wo raftaar nahi. Neeche diye niyam rakhkar mehnat karein to dhan apne hi samay par milta hai.`],
      [`Kya Bhagyank 8 ko mani lagani chahiye?`, `Shani ke liye neela mani btaya jata hai, par pehle apni kundli ki shadbala dekhein. Kundli page par gem ki salah alag se milti hai.`],
      [`Bhagyank 8 me shaadi me dikkat aati hai?`, `Shani ki Reeti 7/8/9 wali rashi me ho to shaadi me thoda samay lag sakta hai. Ye pakka nahi hai — kundli dekh kar confirm hota hai.`],
      [`Personal Year 8 kya hota hai?`, `Ye 9 saal ka wo cycle hai jo har insaan har 9 saal me bharta hai. Personal Year 8 ka saal mehnat, poora karm aur dhan ke liye sabse accha hota hai.`],
      [`8 ka ankh buri kismat hai?`, `Nahi. Lo shu grid me 8 ka ankh aksar badhti hui hoti hai. Bhooti zindagi, dasvan ka koi varg nahi.`],
    ],
    links: [
      [`/calculator`, `Apna Bhagyank aur Ashay Rup nikaalein`],
      [`/loshu`, `Apna lo shu grid me 8 dekhein`],
      [`/forecast`, `Is varsh ka Personal Year dekhein`],
      [`/remedies`, `Shani ke poore ayante aur upay`],
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: `shaadi-milan-ank`,
    title: `Shaadi ke Liye Ank-Milan Kaise Dekhein — Life Path, Destiny aur Soul Urge`,
    excerpt: `Ank milan ka sahi tareeka: sirf Moolank nahi, teen ankhon ka combination kaise kaam karta hai. Ghar ki saafai aur varna milan se bhi zyada zaroori hai.`,
    tags: [`Milan`, `Shaadi`, `Numerology`, `Life Path`],
    readMin: 7,
    body: [
      `Log aksar poochte hain — mera Moolank 5 hai, saathi ka 7 hai, shaadi hogi? Iska seedha jawab nahi hai. Ank milan hamesha teen hisson se dekha jaata hai: Moolank, Life Path aur Bhagyank.`,
      `Sirf Moolank dekhna aise hai jaise ghar ka sirf ek kona dekh kar faisla kar lena. Ho sakta hai shuruaat achi ho aur anjaam bura — ya iska bilkul ulta.`,
    ],
    sections: [
      {
        h: `Teen ank, teen kahani`,
        p: [
          `Moolank — aapka main. Aap kaise sochte ho, kaise feel karte ho, udi kaisi hai. Ye 1 se 9 me 5 mahinon ka cycle hai. Vahin se aapka vyakti aata hai.`,
          `Life Path — aapka mission. Ye janm tithi ke sabhi aksharo ka total hai. Ye batata hai ki aapko zindagi me kya karna hai. Moolank se ye bada hota hai.`,
          `Bhagyank — aapka hisaab. Wo ankh jo pehle se ban kar rakha hai. Vyakti ankh ho to tez kaam, aur koi ankh na ho to shuru se banega.`,
          `Milan me teeno dekhe jaate hain. Ho sakta hai aapki shuruaat achi ho aur anjaam bura — ya iska bilkul ulta.`,
        ],
      },
      {
        h: `Ank-milan ka hisaab`,
        p: [
          `Aapka Moolank aur saathi ka Moolank jodein. Total nikal kar aakhri digit par wapas laayein. Jaise Moolank 4 + Moolank 7 = 11, aur 1+1 = 2. Isi tarah Life Path aur Bhagyank bhi.`,
          `Anumane ka matlab: 1 naya shuruwat, 2 partnership aur patience, 3 anushan, 4 tharthi, 5 faisla badlav, 6 griha sukoon, 7 saathi-sampark, 8 arthik sambandh, 9 sambhav aur sajh.`,
          `Sabse acche ank-milan 5, 6, 7 aur 9 maane jaate hain. 1 kehte hain badi jhagdi ho sakti hai. 2 accha hai par thoda aalu pan. 4 zyadatar sthir. 8 dhan ke hisaab se accha par bhaagdaud zyada.`,
          `Agar aapka total 3 aaye, to iska matlab kabhi kabhi doosron ki baat karte waqt aap bechain ho jaate ho. Samajh kar lein. Koi fail nahi hai.`,
        ],
      },
      {
        h: `Ghar ki saafai — koi ank nahi batata`,
        p: [
          `Shaadi se pehle jo cheez ank se zyada matter karti hai, wo hai aapka apna ghar. Do log ek ghar me rehenge, to wo ghar unke jaisa banega.`,
          `Ghar me jaane se pehle dekhein: khidki band to nahi? Light aati hai? Sauff ki khushbu lagti hai? Baithe rehne ka sahi hisaab hai? Ye 4 cheezein aksar faisla kar deti hain.`,
          `Agar aapka ghar thoda uchha hai aur us me pani ki sankhya sahi ho, to aapki vyakti bhi badalti hai. Loshu page par apna Grid dekhein aur usi hisaab se ek ank ghar ke hisaab se badal sakte hain.`,
        ],
      },
      {
        h: `Milne se pehle ye 5 sawaal`,
        p: [
          `1) Galti maan sakte ho? Mulank 3 aur 6 wale logo ke liye ye sabse zaroori hai.`,
          `2) Paise ka hisaab kaise chalega? Mulank 8 wale aksar is par bade na hain.`,
          `3) Parivaar ke saath rishta kaisa rahega? Ye aksar sabse bada pakka hota hai.`,
          `4) Doosre ka kaam me tokna hai ya hai?`,
          `5) Budhape me aath dene ka soch hai?`,
          `Ye sawaal har shaadi me poochhe jaate hain, aur ank milan se zyada kaam aate hain.`,
          `Aur haan — ank milan aapki zindagi nahi banata. Wo sirf ek sankhya hai jo sochne ke liye milta hai. Faisla aapki apni samajh se lena hai. Kyunki pyaar ko ank nahi, samajh chahiye.`,
        ],
      },
    ],
    faq: [
      [`Kya Moolank se shaadi hoti hai ya nahi?`, `Moolank sirf ek hissa hai. Poora faisla Moolank, Life Path aur Bhagyank ke mila kar ankh par hota hai. Iske ilawa varna, ghar ka vayav aur rishte bhi dekhe jaate hain.`],
      [`Ank milan ke liye kaunsa ankh sabse zaroori hai?`, `Life Path sabse zaroori hai, kyunki wo batata hai ki zindagi ka mission kya hai. Moolank sirf ye batata hai ki aap kaise sochte ho.`],
      [`Anumane me 3 aaya to kya matlab hai?`, `Doosron ke vichar ka poora dimaag aapme ghoomta hai. Kabhi kabhi jaldi vishwas kar lete ho. Zaruri nahi ki bura ho — bas dhyan rakhne layak hai.`],
      [`Mulank 1 aur Mulank 5 ki shaadi hogi?`, `Dono alag hain, par iska matlab shaadi nahi hone se nahi. 1 leadership wala aur 5 restless — dono milkar bohot achhi jodi bana sakte hain, agar samajh hoga.`],
      [`Ghar me kaunsa ank rakhna chahiye?`, `Vahin se padho ki aapka naya number kya hai. Iske liye Loshu Grid page apne ghar ke hisaab se karein — apne aksaron ka total nikaal kar.`],
    ],
    links: [
      [`/match`, `Kundli Milan — graha-on-graha milan dekhein`],
      [`/calculator`, `Teen ank nikaalein — Moolank, Life Path, Soul Urge`],
      [`/loshu`, `Ghar ke liye lucky number jaanein`],
      [`/kundli`, `Apni kundli ke graha dekhein`],
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: `mobile-number-upay`,
    title: `Mobile Number Shubh Hai ya Ashubh — Ank ke hisaab se sahi Number Chunein`,
    excerpt: `Aapka mobile number roz 24 ghante aapke saath rehta hai. Kuch ank shubh hain, kuch nahi. Puri list, matlab aur sahi number chunne ka tareeka yahan hai.`,
    tags: [`Mobile Number`, `Numerology`, `Upay`],
    readMin: 6,
    body: [
      `Aapka mobile number bilkul aapke jaisa nahi hai — wo aapke saath 24 ghante rehta hai. Isi liye jo number aapke vyakti se match nahi karta, usse badalna koi bhoot-baat nahi.`,
      `Ye aksar 15-20 minute me ho jaata hai, aur log iske baad kehte hain ki sab theek lagne laga. Neeche poori list hai — 1 se 9 tak har ank ka matlab.`,
    ],
    sections: [
      {
        h: `Kaise dekhen ki aapka number shubh hai`,
        p: [
          `Sabse pehle number ke aakhri 4 digit dekhein — yahi asli hain. Maan lijiye aapka number 98765-43210 hai, to asli 4 digit 3210 hain.`,
          `Ab aapka Moolank nikalein. Moolank 4 hai aur number ka total 3 hai, matlab number aapke vyakti se kuch door hai. Isse log kaam me jaldi hote hain lekin rishte me thak jaate hain.`,
          `Agar number ka total ankh aapke Moolank ke barabar aaye, to number aapke saath fit baithta hai.`,
          `Agar aapka Moolank 5 hai aur number ka total 8 hai, to number aapki stability se kuch nahi bolta — isse job me jhatka lag sakta hai. Iske liye badalna behtar hai.`,
        ],
      },
      {
        h: `9 ank ka matlab`,
        p: [
          `1 — Neta, naya shuruwat. Mulank 1 wale ke liye sabse accha.`,
          `2 — Partneri aur sammelan. Mulank 2 wale ke liye accha, baaki me thoda naram.`,
          `3 — Josh aur sabse bolna. Mulank 3 wale ke liye shubh, baaki me fikr ke karan.`,
          `4 — Dhoop, mehnat, discipline. Mulank 4 wale ke liye perfect.`,
          `5 — Leher, aazaadi, badlav. Mulank 5 wale ke liye behtareen.`,
          `6 — Ghar, pyaar, seva. Mulank 6 wale ke liye shubh.`,
          `7 — Soch, akela hona, jyotish. Mulank 7 wale ke liye shubh.`,
          `8 — Paisa, mehnat ka phal. Mulank 8 wale ke liye perfect.`,
          `9 — Pratyay, bhagwan, daya. Sabke liye shubh.`,
          `Lekin dhyan rahe — koi number asashubh nahi hota. Asli khoobsurati ye hai ki number aapke Moolank ke bilkul beech ho. Jaise hi 0 digit usse door aaye, wahi sahi number hai.`,
        ],
      },
      {
        h: `Puri tarah apna number badalna`,
        p: [
          `1) Apna Moolank nikalein — Calculator page par 10 second lagenge.`,
          `2) Abhi wala mobile number lo aur aakhri 4 digit ka total nikaalein.`,
          `3) Yahan se pata chal jayega ki aapka number aapke saath kitna fit hai.`,
          `4) Naya number lene se pehle carrier se pooch lein ki purana number doosre shikr me nahi hai — kuch carrier 3 mahine tak hold karte hain.`,
          `5) SIM wahi rakhein, sirf number badlein. Baaki purane numbers free kar dein.`,
          `Number badalne ke baad pehle 2 hafte dhyan rakhein — meeting, gift, der ho na — aapki marzi se chhoti chhoti cheezon ka pattern dekhein. Logon ko fark pata chalta hai.`,
        ],
      },
      {
        h: `Jo kaam nahi karta`,
        p: [
          `Agar aapne number badal liya aur fark nahi pada, to iska matlab hai ki vyakti number se nahi badalta. Isme koi kami nahi hai, par phir bhi aksar log number badal kar uska credit le lete hain.`,
          `Aise log se haaz rakhein — aapke numbers ko unse koi nahi badal sakta.`,
          `Sahi tarika: number saath me, Moolank ke saath. Number aapka vyakti nahi badalta — bas uske aas-paas ki sankhya badal jaati hai, jaise kamre ki roshni badalne se mood nahi badalta par kaam aasan ho jaata hai.`,
        ],
      },
    ],
    faq: [
      [`Kya mobile number se sach me kuch hota hai?`, `Ank-sastra me maana jaata hai ki aapka number aapke vyakti ke saath rehta hai. Aksar logon ko number badalne ke baad fark mehsoos hota hai — zaroori nahi ki har baar, par aksar.`],
      [`Mere aakhri 4 digit ka total 0 aa raha hai, kya karun?`, `0 ka matlab hai ki wo digit nahi hai. Agla digit (5th from end) ko jod lein. 5 digit me total nikal kar wahi aapka asli ankh hai.`],
      [`Kya aap apna number badal sakte ho?`, `Haan. Aap naya number le sakte ho aur SIM wahi rakh sakte ho — sirf number badalta hai, SIM nahi. Carrier se pooch lein ki ho sake ya nahi.`],
      [`0 ankh kya hota hai?`, `0 koi vyakti ya graha nahi — wo shabd potentials hai. Jyotish me Shukra graha 0 se judta hai. Number me 0 aksar asafal matlab deta hai, par aksar accha bhi.`],
      [`Double number (11, 22, 33) shubh hai?`, `Sirf tab jab wo number kisi naam se nikla ho, aapke janm se nahi. Janm se nikle double number aksar master number maane jaate hain, par aksar ye unke liye zyada pressure laate hain.`],
    ],
    links: [
      [`/calculator`, `Apna Moolank nikaalein`],
      [`/loshu`, `Lo Shu Grid se number balance dekhein`],
      [`/kundli`, `Apni kundli ke graha jaan ke number chunein`],
      [`/remedies`, `Number ke saath graha upay`],
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: `personal-year-cycle`,
    title: `Personal Year 9 Saal Ka Cycle — Har Saal Ka Meaning Kya Hai`,
    excerpt: `Har insaan ka 9 saal ka personal cycle chalta hai, aur har saal ka ek kaam hota hai. Poora cycle samajh kar aap apne aap ko timing samajh sakte hain.`,
    tags: [`Personal Year`, `Varshchal`, `Cycle`],
    readMin: 7,
    body: [
      `Zindagi me aisa lagta hai ki kuch saal sab kuch ban jaata hai, aur kuch saal kuch nahi hota. Ye aapki marzi nahi — ye 9 saal ka cycle hai jo har vyakti ka apna hota hai.`,
      `Isse samajhne se aap galat time par galat cheez karne se bach jaate hain. Neeche har saal ka kaam aur sahi aur galat dono ka arth hai.`,
    ],
    sections: [
      {
        h: `Personal Year kaise nikalein`,
        p: [
          `Aapki janm di ke DAY aur MONTH ka total nikaalein — saal nahi. Maan lijiye 15 August 1975, to 15 + 8 = 23, aur 2 + 3 = 5.`,
          `Ab abhi ka saal jodein — maan lijiye 2026 — 5 + 2 + 0 + 2 + 6 = 15, aur 1 + 5 = 6. Iska matlab abhi aapka Personal Year 6 hai.`,
          `Hazaaron log 6 nahi nikal paate aur yahi sabse badi galti hai — poora cycle hi galat ho jaata hai.`,
        ],
      },
      {
        h: `Saal 1 — Naya shuruwat`,
        p: [
          `Nayi soca, nayi jagah, naya vyapar, nayi rishte. Purana chhodna padta hai.`,
          `Galat saal: purane dimaag me ghusna aur naye kaam ko aadhoora chhod dena.`,
          `Sahi saal: bada faisla lena — job chhodna, shift karna, ya bilkul naya shuru karna.`,
        ],
      },
      {
        h: `Saal 2 aur 3 — Sath aur Awaaz`,
        p: [
          `Saal 2 sath aur partnership ka hai. Paisa bhi issi saal me aata hai ya jaata hai. Rishte me gehraai aati hai.`,
          `Galat saal: akele reh kar jhagarna. Sahi saal: milna, saath dena, partnership banana.`,
          `Saal 3 bolna, likhna aur publish karna hai. Jo aapko andar se chubhta hai, wahi bahar aana chahiye.`,
          `Galat saal: chup reh kar phool jaana. Sahi saal: apni baat rakhna — blog, video, ya kuch bhi.`,
        ],
      },
      {
        h: `Saal 4 aur 5 — Dhoop aur Aazaadi`,
        p: [
          `Saal 4 me sirf kaam hota hai, koi chamak nahi. Displine aur chautai ka saal.`,
          `Galat saal: bina kaam ke bahar ghumaana. Sahi saal: roz kaam, chahe mann na kare.`,
          `Saal 5 aazaadi ka hai. Tez, restless, aur naye shikhar ka saal. Purana tor dena padta hai.`,
          `Galat saal: bejaan ho kar kuch adhura chhod dena. Sahi saal: jo naya socha hai use jhelna — travel, naya kaam, nayi jagah.`,
        ],
      },
      {
        h: `Saal 6 aur 7 — Ghar aur Akaantap`,
        p: [
          `Saal 6 ghar aur parivaar ka hai. Responsibility aati hai. Log rishte me paas aate hain.`,
          `Galat saal: doosron ke chakkar me apna kuch karna chhod dena. Sahi saal: ghar banana aur sambhaalna.`,
          `Saal 7 akaantap ka hai. Vichar, tafakkul, chhutti. Logo ko anand aayega.`,
          `Galat saal: akele ghabra jaana. Sahi saal: jaan-boojh kar akele time lena aur dhyana karna.`,
        ],
      },
      {
        h: `Saal 8 aur 9 — Paisa aur Alvida`,
        p: [
          `Saal 8 poora hisaab yahan lagta hai. Mehnat ka phal mil sakta hai, aur purana dhan bhi utar sakta hai.`,
          `Galat saal: ghabra kar jaldi faisla lena. Sahi saal: mehnat jaari rakhna, chahe mehnat ka phal saal ke ant tak na mile.`,
          `Saal 9 khatm ka hai. Kaam poora, maidan saaf. Alvida, lautna, bhagya.`,
          `Galat saal: naya shuru kar dena jab aap khatm kar rahe thay. Sahi saal: chhodna, jaane dena, maidan khaali karna.`,
          `Phir wahi 1 — naya nau saal ka cycle shuru.`,
        ],
      },
      {
        h: `Personal Year aur Varshchal`,
        p: [
          `Dono alag hain. Personal Year aapke janm se chalta hai aur hamesha 1 se 9 ke beech hota hai.`,
          `Varshchal 108 kundliyon ka hisaab hai — mahine ka graha, lagna lord, aur kundli ke dasha se us samay ka anka kya hai.`,
          `Personal Year batata hai ki aap kahan ja rahe ho, aur Varshphal batata hai ki kundli ke hisaab se rasta kaisa hai.`,
          `Agar aapka Personal Year 4 hai aur kundli me Guru ka Mahadasha chal raha hai, to saal mehnat ka lekin ashirwad bhi milega. Yehi asli Varshphal ka fayda hai.`,
          `Dono ek saath dekhne ke liye Kundli banayein — Varshphal usme se pata chalega ki jis samay aapko kis cheez ke liye koshish karni hai.`,
        ],
      },
    ],
    faq: [
      [`Personal Year kaise nikalein?`, `Janm di ke DAY aur MONTH ka total nikalein (saal nahi), phir usme abhi ke saal ke digit jodein. Jaise 15-08 = 23 → 5, phir 2026 ka total 5 + 15 = 20 → 2.`],
      [`Kya Personal Year 0 ho sakta hai?`, `Nahi. Total 0 aaye to 9 maana jata hai. Personal Year hamesha 1 se 9 ke beech hota hai.`],
      [`Personal Year aur Moolank me kya fark hai?`, `Moolank aapka swabhava hai — aap ho kaun. Personal Year aapka current chapter hai — abhi kya ho raha hai. Moolank nahi badalta, Personal Year har saal badalta hai.`],
      [`Personal Year 9 ke baad kya hota hai?`, `Phir se 1 ho jaata hai — naya nau saal ka cycle shuru. 9 ke baad naya shuruwat sahi samay hota hai.`],
      [`Personal Year 4 me shaadi karni chahiye?`, `4 mehnat ka saal hai. Shaadi yahan nahi karte aksar. 5 (commitment) ya 6 (ghar) zyada shubh hota hai.`],
    ],
    links: [
      [`/forecast`, `Apna poora Varshphal dekhein`],
      [`/calculator`, `Apna Personal Year nikaalein`],
      [`/kundli`, `Kundli se apna Varshphal scope banayein`],
      [`/muhurat`, `Sahi samay dekhein — muhurat`],
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: `naam-spelling-upay`,
    title: `Naam ki Spelling Badle Bina Bhagya Sudharein — Ank-milan ka asli niyam`,
    excerpt: `Agar aapka naam ank-milan nahi ho raha to naam badalna ek option hai. Lekin sahi niyam ye hai: har akshar ka ankh 1 se 9 me hona chahiye.`,
    tags: [`Naam`, `Numerology`, `Correction`],
    readMin: 6,
    body: [
      `Ank-sastra me ek sach hai — akshar vibhajan se zindagi ke anukool hona padta hai. Har akshar ka koi ank hota hai, aur kuch ank milan karte hain, kuch nahi.`,
      `Iske liye poora naam badalna zaroori nahi. Bas 2-3 akshar badalne se kaam chal jaata hai. Lekin sabse badi galti log yehi karte hain — akshar ki value jaane bina.`,
    ],
    sections: [
      {
        h: `Sahi niyam: 1 se 9 tak`,
        p: [
          `Vibhajan me aksaron ka total 1 se 9 ke beech aana chahiye.`,
          `Agar total 0 aa raha hai, ya 13 se bada aa raha hai, to us akshar ko badalna padta hai.`,
          `Total 18 ka matlab 1 + 8 = 9 hai. Kuch log ko lagta hai ki 18 galat hai. Nahi — 18 ek master number hai, bilkul sahi.`,
          `Par agar aapka naam poora mila kar 0 de, jaise A = 0, to wo akshar galat hai.`,
          `Sahi niyam: har akshar ka ankh 1 se 9 me hona chahiye, aur poore naam ka total bhi 1 se 9 me aana chahiye.`,
        ],
      },
      {
        h: `Sahi akshar kaise chunein`,
        p: [
          `Jo akshar kam number de raha hai, usse badalne ke liye usi ankh ka doosra akshar nikaalein. Jaise: agar aapko total 9 chahiye to 18 wala akshar (R) sahi hai. Agar 5 chahiye to wahi akshar badal kar 5 wala rakhein.`,
          `Yahi chakkar hai — jodte hain aur dekhte hain ki total 1 se 9 me aa raha hai ya nahi.`,
          `Asli niyam: akshar badalte waqt uska pehla akshar mat badlein. Naam ke shuru ka akshar aksar parivaar ka hota hai. Badlav sirf beech wale akshar me kar sakte hain — isse bhasha aur parivaar dono khush rehte hain.`,
        ],
      },
      {
        h: `Kab karna chahiye, kab nahi`,
        p: [
          `Karein — jab aapka vyakti ke saath number match nahi karta. Career me atakav. Koi bhi vishwas nahi hota. Baar baar wahi galti hoti hai. Paisa aata nahi ya ata aur chala jaata hai.`,
          `Na karein — jab koi zyada utsuk hokar, na karein.`,
          `Ek baat dhyan rakhein: naam sudharna mahnati chahiye, tabhi usse bhagya khatam karna ka sahi matlab hai. Sirf Akshar roshan ya sandhi se poora naam badal dena asafal hota hai.`,
        ],
      },
      {
        h: `Vibhajan ke aksar`,
        p: [
          `Chaldean system me akshar: A = 1, B = 2, C = 3, aur I, J, K ka pattern alag chalta hai. Z = 8.`,
          `Kuch aksar aksar galat count hote hain. Jaise U = 3 aur W = 3 (2 vowels), M = 4 (4 consonants), I = 1 (1 vowel). Ye chhoti si detail poora hisaab badal deti hai.`,
          `Pythagoras ek alag system hai. Koi bhi ek chunein — par hamesha ek hi rakhein, warna hisaab hi gadbad ho jaata hai.`,
          `Agar aap apna naam sudharna chahte ho to mujhse sampark karein — main aapka full vibhajan karke bata dunga ki kaunsa akshar kahan galat hai aur kya badalna chahiye.`,
        ],
      },
    ],
    faq: [
      [`Kya sach me naam se bhagya sudharta hai?`, `Ank-sastra me haan maana jaata hai. Vyakti baar baar bade faisle ghalti se leta hai; sahi number me sahi faisla hota hai. Ise faith kehte hain — aur faith ka apna kaam hota hai.`],
      [`Vibhajan kab nahi kar sakte?`, `Jab aapka total ankh 0 aa raha ho us akshar ko, ya jab sirf ek akshar badalne se bhi 0 aaye. Tab do akshar badalne padte hain.`],
      [`Aapke akshare ka total 18 aaye to?`, `18 = 1 + 8 = 9. Ye ek master number hai — bilkul sahi hai. Vibhajan me sirf 0 aur 13 se bade akshar ko badalna chahiye.`],
      [`Bete ka naam aksaron me badal sakte hain?`, `Haan, lekin pehle 9 ank shanti karein. 8-9 saal ka beta khud khush ho to nahi badalte. 11-12 saal ke baad akshar badalna sahi hota hai.`],
      [`Sirf akshar roshan se kaam ho jaata hai?`, `Kabhi kabhaar, agar zyada se zyada 5-6 matra badal raha ho. Jitna zyada badlav, utna kam faisla. 1-2 akshar badalna behtar hai.`],
    ],
    links: [
      [`/calculator`, `Apne naam ke akshar ka vibhajan nikaalein`],
      [`/loshu`, `Apna full naam number aur lo shu dekhein`],
      [`/kundli`, `Naam se jude graha apni kundli me dekhein`],
      [`/about`, `Is site ke baare me aur jaanein`],
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
//  6 aur posts (blog2.js)
//  Alag file isliye ki parallel edits na collide karein — jo naya
//  article add karna ho wo sirf blog2.js me likh kar neeche import
//  karein.
// ─────────────────────────────────────────────────────────────────
import { POSTS_2 } from "./blog2.js";

export const ALL_POSTS = [...POSTS, ...POSTS_2];

export default ALL_POSTS;