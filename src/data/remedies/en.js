// Remedies data — English base.
//
// `planet` is a KEY, not display text — render it with grahaName(planet, lang).
// `mantra` is Sanskrit; every script writes it the same way, so it stays as-is.
//
// Har bhasha ka apna file: src/data/remedies/<lang>.js
export default {
  rudraksha: [
    { m: "1 Mukhi", planet: "Surya", devta: "Shiva", fayda: "Eyesight, heart and chest strength; builds self-confidence.", mantra: "ॐ ह्रीं नमः" },
    { m: "2 Mukhi", planet: "Chandra", devta: "Ardhnarishvara", fayda: "Peace of mind, marital happiness, sweeter relations.", mantra: "ॐ नमः" },
    { m: "3 Mukhi", planet: "Mangal", devta: "Agni", fayda: "Courage, energy, freedom from laziness; best for students.", mantra: "ॐ क्लीं नमः" },
    { m: "4 Mukhi", planet: "Budh", devta: "Brahma", fayda: "Intellect, speech, memory; success in study.", mantra: "ॐ ह्रीं नमः" },
    { m: "5 Mukhi", planet: "Guru", devta: "Kalagni Rudra", fayda: "Knowledge, health, mental peace; the most protective.", mantra: "ॐ ह्रीं नमः" },
    { m: "6 Mukhi", planet: "Shukra", devta: "Kartikeya", fayda: "Love, attraction, art; improves marital happiness.", mantra: "ॐ ह्रीं हुं नमः" },
    { m: "7 Mukhi", planet: "Shani", devta: "Mahalakshmi", fayda: "Protection from Saturn's afflictions and loss of wealth; steadies income.", mantra: "ॐ हुं नमः" },
    { m: "8 Mukhi", planet: "Rahu", devta: "Ganesha", fayda: "Protection from obstacles and evil eye; victory in competition.", mantra: "ॐ हुं नमः" },
    { m: "9 Mukhi", planet: "Ketu", devta: "Durga", fayda: "Fearlessness, spiritual power, protection from bad energies.", mantra: "ॐ ह्रीं हुं नमः" },
    { m: "10 Mukhi", planet: "Vishnu", devta: "Vishnu", fayda: "Peace of all planets, removal of the evil eye.", mantra: "ॐ ह्रीं नमः" },
    { m: "11 Mukhi", planet: "Rudra", devta: "Hanuman", fayda: "Courage, victory, happiness in travel; best for rulers and leaders.", mantra: "ॐ ह्रीं हुं नमः" },
    { m: "12 Mukhi", planet: "Surya", devta: "Surya", fayda: "Authority, fame and reputation; sharp eyesight.", mantra: "ॐ क्रौं स्रौं रौं नमः" },
    { m: "13 Mukhi", planet: "Kamdev", devta: "Indra", fayda: "Attraction, marital happiness, love in marriage.", mantra: "ॐ ह्रीं नमः" },
    { m: "14 Mukhi", planet: "Shiva", devta: "Hanuman", fayda: "Inner knowledge, health, ability to see ahead.", mantra: "ॐ नमः" },
    { m: "Gauri-Shankar", planet: "Chandra", devta: "Shiva-Parvati", fayda: "Marital happiness, union in the family, family peace.", mantra: "ॐ गौरीशंकराय नमः" },
  ],
  jadi: [
    { herb: "Aak", planet: "Surya", upyog: "Burnt on Sunday; for eyesight and self-confidence.", dharan: "Wear as a ring in gold on Sunday." },
    { herb: "Palash", planet: "Chandra", upyog: "Burnt on Monday; for peace of mind.", dharan: "Wear as a ring in silver on Monday." },
    { herb: "Khair", planet: "Mangal", upyog: "Burnt on Tuesday; for courage and energy.", dharan: "Wear as a ring in copper on Tuesday." },
    { herb: "Apamarg", planet: "Budh", upyog: "Burnt on Wednesday; for intellect and speech.", dharan: "Wear as a ring in silver on Wednesday." },
    { herb: "Peepal", planet: "Guru", upyog: "Peepal service on Thursday; for knowledge and children.", dharan: "Wear as a ring in gold on Thursday." },
    { herb: "Gular", planet: "Shukra", upyog: "Burnt on Friday; for love and luxury.", dharan: "Wear as a ring in silver on Friday." },
    { herb: "Shami", planet: "Shani", upyog: "Shami service on Saturday; wards off Saturn's afflictions.", dharan: "Wear as a ring in iron or silver on Saturday." },
    { herb: "Durva", planet: "Rahu", upyog: "Offered to Ganpati; removes obstacles.", dharan: "Wear as a ring in a mixed metal on Saturday." },
    { herb: "Kusha", planet: "Ketu", upyog: "Burnt for purification; spiritual protection.", dharan: "Wear as a ring in a mixed metal on Tuesday." },
  ],
  yantra: [
    { yantra: "Surya Yantra", planet: "Surya", fayda: "Health, eyesight, success in government work.", sthapana: "On copper, on Sunday, in an east-facing puja room." },
    { yantra: "Chandra Yantra", planet: "Chandra", fayda: "Peace of mind, sleep, emotional balance.", sthapana: "On silver, on Monday, with white flowers offered." },
    { yantra: "Mangal Yantra", planet: "Mangal", fayda: "Courage, land and property work, victory over enemies.", sthapana: "On copper, on Tuesday, with a red sandal tilak." },
    { yantra: "Budh Yantra", planet: "Budh", fayda: "Intellect, business, success in examinations.", sthapana: "On gold, on Wednesday, with a green cloth offered." },
    { yantra: "Guru Yantra", planet: "Guru", fayda: "Knowledge, children, removal of marriage obstacles.", sthapana: "On gold, on Thursday, with yellow flowers offered." },
    { yantra: "Shukra Yantra", planet: "Shukra", fayda: "Love, luxury, success in art.", sthapana: "On silver, on Friday, with an incense offering." },
    { yantra: "Shani Yantra", planet: "Shani", fayda: "Relief from Saturn's afflictions and Sade Sati pain.", sthapana: "On iron, on Saturday, with an oil lamp offered." },
    { yantra: "Rahu Yantra", planet: "Rahu", fayda: "Sudden obstacles, evil eye, foreign connections.", sthapana: "On a mixed metal, on Saturday, with black sesame offered." },
    { yantra: "Ketu Yantra", planet: "Ketu", fayda: "Spiritual growth, removal of hidden obstacles.", sthapana: "On a mixed metal, on Tuesday, installed with meditation." },
  ],
};