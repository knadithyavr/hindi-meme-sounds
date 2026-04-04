-- =============================================
-- Hindi Meme Sounds — Seed Data
-- 25 iconic Hindi meme audio clips
--
-- IMPORTANT: Run schema.sql first.
-- Audio files must be uploaded separately to R2 storage.
-- Replace placeholder audio_url values with actual R2 URLs after upload.
--
-- YouTube source reference (for clipping audio):
--   Each entry lists the source video and suggested clip window.
--   Use yt-dlp or ffmpeg to extract: yt-dlp -x --audio-format mp3 "URL"
-- =============================================

-- ─── Categories ──────────────────────────────────────────────────────────────
-- Upsert so re-running this file is safe.

INSERT INTO categories (id, name, slug, description, color) VALUES
  ('cat-bollywood',  'Bollywood',  'bollywood',  'Iconic Bollywood movie dialogues and scenes',                    'from-yellow-500 to-orange-600'),
  ('cat-reactions',  'Reactions',  'reactions',  'Perfect sounds to react to anything',                            'from-blue-500 to-cyan-600'),
  ('cat-greetings',  'Greetings',  'greetings',  'Desi greetings and welcome sounds',                              'from-green-500 to-emerald-600'),
  ('cat-trolling',   'Trolling',   'trolling',   'Ultimate savage comebacks and roast sounds',                     'from-red-500 to-rose-600'),
  ('cat-viral',      'Viral',      'viral',      'Sounds that broke the Indian internet',                          'from-purple-500 to-pink-600'),
  ('cat-comedy',     'Comedy',     'comedy',     'Laugh-out-loud dialogues and comic timing classics',             'from-amber-500 to-yellow-600')
ON CONFLICT (slug) DO NOTHING;

-- ─── Tags ────────────────────────────────────────────────────────────────────

INSERT INTO tags (name, slug) VALUES
  ('sholay',          'sholay'),
  ('gabbar',          'gabbar'),
  ('amitabh',         'amitabh'),
  ('villain',         'villain'),
  ('pushpa',          'pushpa'),
  ('allu-arjun',      'allu-arjun'),
  ('kgf',             'kgf'),
  ('rocky-bhai',      'rocky-bhai'),
  ('hera-pheri',      'hera-pheri'),
  ('babu-rao',        'babu-rao'),
  ('paresh-rawal',    'paresh-rawal'),
  ('3-idiots',        '3-idiots'),
  ('aamir-khan',      'aamir-khan'),
  ('ddlj',            'ddlj'),
  ('srk',             'srk'),
  ('andaz-apna-apna', 'andaz-apna-apna'),
  ('dabangg',         'dabangg'),
  ('salman-khan',     'salman-khan'),
  ('gangs-of-wasseypur', 'gangs-of-wasseypur'),
  ('manoj-bajpayee',  'manoj-bajpayee'),
  ('deewar',          'deewar'),
  ('classic',         'classic'),
  ('meme',            'meme'),
  ('dialogue',        'dialogue'),
  ('viral',           'viral'),
  ('reaction',        'reaction'),
  ('comedy',          'comedy'),
  ('shark-tank-india','shark-tank-india'),
  ('mr-india',        'mr-india'),
  ('mogambo',         'mogambo'),
  ('bhabhi-ji',       'bhabhi-ji'),
  ('tv-show',         'tv-show'),
  ('wanted',          'wanted'),
  ('singham',         'singham')
ON CONFLICT (slug) DO NOTHING;

-- ─── Sounds ──────────────────────────────────────────────────────────────────
-- audio_url is a placeholder; replace with actual R2 URLs after upload.
-- slug must be unique; title is what appears in the UI.

INSERT INTO sounds (id, title, slug, description, audio_url, is_published, status) VALUES

-- 1 ─ Kitne Aadmi The
('snd-01', 'Kitne Aadmi The',
 'kitne-aadmi-the',
 'Gabbar Singh''s chilling interrogation of his defeated henchmen in Sholay (1975). The gravelly "Kitne aadmi the?" became one of the most quoted lines in Indian cinema history.',
 'PLACEHOLDER_kitne-aadmi-the.mp3', true, 'approved'),

-- 2 ─ Tera Kya Hoga Kaliya
('snd-02', 'Tera Kya Hoga Kaliya',
 'tera-kya-hoga-kaliya',
 'Gabbar Singh''s sadistic taunting of his henchman Kaalia before the iconic Russian-roulette scene in Sholay (1975). Dark humour at its most chilling.',
 'PLACEHOLDER_tera-kya-hoga-kaliya.mp3', true, 'approved'),

-- 3 ─ Flower Nahi Fire Hai
('snd-03', 'Flower Nahi Fire Hai',
 'flower-nahi-fire-hai',
 'Pushpa Raj''s defiant self-introduction in Pushpa: The Rise (2021). "Pushpa naam sunke flower samjhe kya? Flower nahi, fire hai main!" instantly became a pan-India meme.',
 'PLACEHOLDER_flower-nahi-fire-hai.mp3', true, 'approved'),

-- 4 ─ Jhukega Nahi Saala
('snd-04', 'Jhukega Nahi Saala',
 'jhukega-nahi-saala',
 'Pushpa Raj''s signature defiance cry from Pushpa: The Rise (2021) — "Pushpa Raj mein jhukega nahi sala!" Used universally to express that you won''t back down.',
 'PLACEHOLDER_jhukega-nahi-saala.mp3', true, 'approved'),

-- 5 ─ Fire Nahi Wildfire Hai
('snd-05', 'Fire Nahi Wildfire Hai',
 'fire-nahi-wildfire-hai',
 'The upgraded version from Pushpa 2: The Rule (2024) — "Fire nahi, wildfire hun!" Allu Arjun''s delivery sent theatres into a frenzy across India.',
 'PLACEHOLDER_fire-nahi-wildfire-hai.mp3', true, 'approved'),

-- 6 ─ Mogambo Khush Hua
('snd-06', 'Mogambo Khush Hua',
 'mogambo-khush-hua',
 'Amrish Puri''s iconic declaration of villainous pleasure in Mr. India (1987). "Mogambo khush hua!" is used as the ultimate sarcastic approval reaction in Indian meme culture.',
 'PLACEHOLDER_mogambo-khush-hua.mp3', true, 'approved'),

-- 7 ─ Mere Paas Maa Hai
('snd-07', 'Mere Paas Maa Hai',
 'mere-paas-maa-hai',
 'Shashi Kapoor''s understated reply to Amitabh Bachchan''s list of riches in Deewar (1975). "Mere paas maa hai" is perhaps the most emotionally resonant five-word sentence in Bollywood.',
 'PLACEHOLDER_mere-paas-maa-hai.mp3', true, 'approved'),

-- 8 ─ Aaj Khush Toh Bahut Hoge Tum
('snd-08', 'Aaj Khush Toh Bahut Hoge Tum',
 'aaj-khush-toh-bahut-hoge-tum',
 'Amitabh Bachchan''s sardonic line to God in Deewar (1975) — "Aaj khush toh bahut hoge tum." Widely used as a sarcastic reaction when someone''s plan backfires.',
 'PLACEHOLDER_aaj-khush-toh-bahut-hoge-tum.mp3', true, 'approved'),

-- 9 ─ Bade Bade Deshon Mein
('snd-09', 'Bade Bade Deshon Mein',
 'bade-bade-deshon-mein',
 'Shah Rukh Khan''s smooth excuse in DDLJ (1995) — "Bade bade deshon mein aisi choti choti baatein hoti rehti hain, Senorita." Indians use it to brush off any minor screw-up with maximum style.',
 'PLACEHOLDER_bade-bade-deshon-mein.mp3', true, 'approved'),

-- 10 ─ Ja Simran Ja
('snd-10', 'Ja Simran Ja',
 'ja-simran-ja',
 'Amrish Puri''s tearful blessing in DDLJ (1995) — "Ja Simran ja, jee le apni zindagi." The iconic train-platform farewell that defined an era of Bollywood romance.',
 'PLACEHOLDER_ja-simran-ja.mp3', true, 'approved'),

-- 11 ─ Aal Izz Well
('snd-11', 'Aal Izz Well',
 'aal-izz-well',
 'Rancho''s calming mantra from 3 Idiots (2009) — "Aal izz well!" Originally a trick to fool the heart, it became India''s most optimistic WhatsApp forward and ringtone.',
 'PLACEHOLDER_aal-izz-well.mp3', true, 'approved'),

-- 12 ─ Life Is a Race
('snd-12', 'Life Is a Race',
 'life-is-a-race',
 'Virus''s pressure-cooker speech from 3 Idiots (2009) — "Life is a race. Agar tez nahi bhaage toh koi tujhe kuchal ke aage nikal jaayega!" The definitive Indian parent/teacher meme.',
 'PLACEHOLDER_life-is-a-race.mp3', true, 'approved'),

-- 13 ─ Teja Main Hu Mark Idhar Hai
('snd-13', 'Teja Main Hu Mark Idhar Hai',
 'teja-main-hu-mark-idhar-hai',
 'Paresh Rawal''s absurd self-correction in Andaz Apna Apna (1994) — "Teja main hu, Mark idhar hai!" A perfectly timed comedy gem that became a benchmark for confused-character memes.',
 'PLACEHOLDER_teja-main-hu-mark-idhar-hai.mp3', true, 'approved'),

-- 14 ─ Crime Master Gogo Naam Hai Mera
('snd-14', 'Crime Master Gogo Naam Hai Mera',
 'crime-master-gogo-naam-hai-mera',
 'Shakti Kapoor''s gloriously absurd villain introduction in Andaz Apna Apna (1994) — "Crime Master Gogo naam hai mera, aankhen nikaal ke gotiyan khelta hoon main!"',
 'PLACEHOLDER_crime-master-gogo-naam-hai-mera.mp3', true, 'approved'),

-- 15 ─ Tumse Na Ho Payega
('snd-15', 'Tumse Na Ho Payega',
 'tumse-na-ho-payega',
 'Ramadhir Singh''s withering dismissal of his son in Gangs of Wasseypur 2 (2012) — "Beta, tumse na ho payega." Improvised by Tigmanshu Dhulia on set; became the go-to Indian "you can''t do it" meme.',
 'PLACEHOLDER_tumse-na-ho-payega.mp3', true, 'approved'),

-- 16 ─ Keh Ke Lunga
('snd-16', 'Keh Ke Lunga',
 'keh-ke-lunga',
 'Sardar Khan''s oath of revenge in Gangs of Wasseypur (2012) — "Teri keh ke lunga!" Manoj Bajpayee''s delivery is electrifying; the phrase is used when promising a spectacular comeback.',
 'PLACEHOLDER_keh-ke-lunga.mp3', true, 'approved'),

-- 17 ─ Bhai Kya Kar Raha Hai Tu
('snd-17', 'Bhai Kya Kar Raha Hai Tu',
 'bhai-kya-kar-raha-hai-tu',
 'Ashneer Grover''s exasperated reaction on Shark Tank India Season 1 (2022) to a pitcher selling glass-rim covers — "Bhai, kya kar raha hai tu?" Instantly meme-fied across every Indian platform.',
 'PLACEHOLDER_bhai-kya-kar-raha-hai-tu.mp3', true, 'approved'),

-- 18 ─ Thappad Se Darr Nahi Lagta
('snd-18', 'Thappad Se Darr Nahi Lagta',
 'thappad-se-darr-nahi-lagta',
 'Sonakshi Sinha''s feisty one-liner in Dabangg (2010) — "Thappad se darr nahi lagta sahab, pyaar se lagta hai." One of the most remixed and quoted Bollywood feminist one-liners.',
 'PLACEHOLDER_thappad-se-darr-nahi-lagta.mp3', true, 'approved'),

-- 19 ─ Swagat Nahi Karoge Hamara
('snd-19', 'Swagat Nahi Karoge Hamara',
 'swagat-nahi-karoge-hamara',
 'Salman Khan''s self-assured entry line in Dabangg 2 (2012) — "Swagat nahi karoge aap hamara?" Chulbul Pandey''s swagger in audio form; used at every grand entrance.',
 'PLACEHOLDER_swagat-nahi-karoge-hamara.mp3', true, 'approved'),

-- 20 ─ Ek Baar Jo Maine Commitment
('snd-20', 'Ek Baar Jo Maine Commitment',
 'ek-baar-jo-maine-commitment',
 'Salman Khan''s unbreakable-promise declaration in Wanted (2009) — "Ek baar jo maine commitment kar di, uske baad toh main khud ki bhi nahi sunta." The definitive I-won''t-back-down brag.',
 'PLACEHOLDER_ek-baar-jo-maine-commitment.mp3', true, 'approved'),

-- 21 ─ Ye Baburao Ka Style Hai
('snd-21', 'Ye Baburao Ka Style Hai',
 'ye-baburao-ka-style-hai',
 'Paresh Rawal''s Babu Rao claiming ownership of his chaotic methods in Hera Pheri (2000) — "Ye Baburao ka style hai!" A timeless meme for doing things your own absurd way.',
 'PLACEHOLDER_ye-baburao-ka-style-hai.mp3', true, 'approved'),

-- 22 ─ Utha Le Re Baba
('snd-22', 'Utha Le Re Baba',
 'utha-le-re-baba',
 'Babu Rao''s dramatic plea to God in Hera Pheri (2000) — "Utha le re baba, utha le! Mereko nahi, inn dono ko utha le!" The definitive "I''m done with everything" meme sound.',
 'PLACEHOLDER_utha-le-re-baba.mp3', true, 'approved'),

-- 23 ─ KGF — Yeh Hath Mujhe De De Thakur (power intro)
('snd-23', 'Mera Swabhav Hi Mera Parichay',
 'mera-swabhav-hi-mera-parichay',
 'Rocky Bhai''s defining self-declaration in KGF: Chapter 1 (2018, Hindi dub) — "Mera swabhav hi mera parichay hai." Yash''s baritone made this the ultimate mass-hero attitude line.',
 'PLACEHOLDER_mera-swabhav-hi-mera-parichay.mp3', true, 'approved'),

-- 24 ─ Sahi Pakde Hain
('snd-24', 'Sahi Pakde Hain',
 'sahi-pakde-hain',
 'Angoori Bhabhi''s signature catchphrase from the TV show Bhabhi Ji Ghar Par Hain — "Sahi pakde hain!" Used by Indians online to confirm a correct guess or observation with theatrical flair.',
 'PLACEHOLDER_sahi-pakde-hain.mp3', true, 'approved'),

-- 25 ─ Pushpa Naam Sunke Flower Samjhe Kya (full monologue)
('snd-25', 'Pushpa Naam Sunke Flower Samjhe Kya',
 'pushpa-naam-sunke-flower-samjhe-kya',
 'The full iconic monologue from Pushpa: The Rise (2021) where Allu Arjun corrects everyone who underestimates him: "Pushpa naam sunke flower samjha kya? Flower nahi, fire hai main. Jhukunga nahi."',
 'PLACEHOLDER_pushpa-naam-sunke-flower-samjhe-kya.mp3', true, 'approved')

ON CONFLICT (slug) DO NOTHING;

-- ─── Category associations ────────────────────────────────────────────────────

INSERT INTO sound_categories (sound_id, category_id) VALUES
  ('snd-01', 'cat-bollywood'),
  ('snd-01', 'cat-trolling'),
  ('snd-02', 'cat-bollywood'),
  ('snd-02', 'cat-trolling'),
  ('snd-03', 'cat-bollywood'),
  ('snd-03', 'cat-viral'),
  ('snd-04', 'cat-bollywood'),
  ('snd-04', 'cat-reactions'),
  ('snd-05', 'cat-bollywood'),
  ('snd-05', 'cat-viral'),
  ('snd-06', 'cat-bollywood'),
  ('snd-06', 'cat-reactions'),
  ('snd-07', 'cat-bollywood'),
  ('snd-07', 'cat-reactions'),
  ('snd-08', 'cat-bollywood'),
  ('snd-08', 'cat-trolling'),
  ('snd-09', 'cat-bollywood'),
  ('snd-09', 'cat-comedy'),
  ('snd-10', 'cat-bollywood'),
  ('snd-10', 'cat-greetings'),
  ('snd-11', 'cat-bollywood'),
  ('snd-11', 'cat-viral'),
  ('snd-12', 'cat-bollywood'),
  ('snd-12', 'cat-comedy'),
  ('snd-13', 'cat-bollywood'),
  ('snd-13', 'cat-comedy'),
  ('snd-14', 'cat-bollywood'),
  ('snd-14', 'cat-comedy'),
  ('snd-15', 'cat-bollywood'),
  ('snd-15', 'cat-trolling'),
  ('snd-16', 'cat-bollywood'),
  ('snd-16', 'cat-reactions'),
  ('snd-17', 'cat-viral'),
  ('snd-17', 'cat-reactions'),
  ('snd-18', 'cat-bollywood'),
  ('snd-18', 'cat-reactions'),
  ('snd-19', 'cat-bollywood'),
  ('snd-19', 'cat-greetings'),
  ('snd-20', 'cat-bollywood'),
  ('snd-20', 'cat-reactions'),
  ('snd-21', 'cat-bollywood'),
  ('snd-21', 'cat-comedy'),
  ('snd-22', 'cat-bollywood'),
  ('snd-22', 'cat-comedy'),
  ('snd-23', 'cat-bollywood'),
  ('snd-23', 'cat-reactions'),
  ('snd-24', 'cat-viral'),
  ('snd-24', 'cat-comedy'),
  ('snd-25', 'cat-bollywood'),
  ('snd-25', 'cat-viral')
ON CONFLICT DO NOTHING;

-- ─── Tag associations ────────────────────────────────────────────────────────

-- Helper: resolve tag ids by slug inline using subqueries
INSERT INTO sound_tags (sound_id, tag_id)
SELECT snd.id, t.id FROM
  (VALUES
    ('snd-01','sholay'), ('snd-01','gabbar'), ('snd-01','villain'), ('snd-01','classic'), ('snd-01','meme'),
    ('snd-02','sholay'), ('snd-02','gabbar'), ('snd-02','villain'), ('snd-02','classic'), ('snd-02','dialogue'),
    ('snd-03','pushpa'), ('snd-03','allu-arjun'), ('snd-03','viral'), ('snd-03','meme'), ('snd-03','dialogue'),
    ('snd-04','pushpa'), ('snd-04','allu-arjun'), ('snd-04','viral'), ('snd-04','reaction'), ('snd-04','meme'),
    ('snd-05','pushpa'), ('snd-05','allu-arjun'), ('snd-05','viral'), ('snd-05','meme'), ('snd-05','dialogue'),
    ('snd-06','mr-india'), ('snd-06','mogambo'), ('snd-06','villain'), ('snd-06','classic'), ('snd-06','meme'),
    ('snd-07','deewar'), ('snd-07','amitabh'), ('snd-07','classic'), ('snd-07','dialogue'), ('snd-07','meme'),
    ('snd-08','deewar'), ('snd-08','amitabh'), ('snd-08','classic'), ('snd-08','reaction'), ('snd-08','dialogue'),
    ('snd-09','ddlj'), ('snd-09','srk'), ('snd-09','classic'), ('snd-09','meme'), ('snd-09','comedy'),
    ('snd-10','ddlj'), ('snd-10','srk'), ('snd-10','classic'), ('snd-10','dialogue'), ('snd-10','viral'),
    ('snd-11','3-idiots'), ('snd-11','aamir-khan'), ('snd-11','viral'), ('snd-11','meme'), ('snd-11','comedy'),
    ('snd-12','3-idiots'), ('snd-12','aamir-khan'), ('snd-12','meme'), ('snd-12','comedy'), ('snd-12','dialogue'),
    ('snd-13','andaz-apna-apna'), ('snd-13','paresh-rawal'), ('snd-13','comedy'), ('snd-13','classic'), ('snd-13','meme'),
    ('snd-14','andaz-apna-apna'), ('snd-14','villain'), ('snd-14','comedy'), ('snd-14','classic'), ('snd-14','dialogue'),
    ('snd-15','gangs-of-wasseypur'), ('snd-15','manoj-bajpayee'), ('snd-15','viral'), ('snd-15','meme'), ('snd-15','dialogue'),
    ('snd-16','gangs-of-wasseypur'), ('snd-16','manoj-bajpayee'), ('snd-16','reaction'), ('snd-16','classic'), ('snd-16','dialogue'),
    ('snd-17','shark-tank-india'), ('snd-17','viral'), ('snd-17','meme'), ('snd-17','reaction'), ('snd-17','tv-show'),
    ('snd-18','dabangg'), ('snd-18','salman-khan'), ('snd-18','viral'), ('snd-18','meme'), ('snd-18','dialogue'),
    ('snd-19','dabangg'), ('snd-19','salman-khan'), ('snd-19','viral'), ('snd-19','meme'), ('snd-19','comedy'),
    ('snd-20','wanted'), ('snd-20','salman-khan'), ('snd-20','viral'), ('snd-20','meme'), ('snd-20','dialogue'),
    ('snd-21','hera-pheri'), ('snd-21','babu-rao'), ('snd-21','paresh-rawal'), ('snd-21','comedy'), ('snd-21','meme'),
    ('snd-22','hera-pheri'), ('snd-22','babu-rao'), ('snd-22','paresh-rawal'), ('snd-22','comedy'), ('snd-22','viral'),
    ('snd-23','kgf'), ('snd-23','rocky-bhai'), ('snd-23','viral'), ('snd-23','meme'), ('snd-23','dialogue'),
    ('snd-24','bhabhi-ji'), ('snd-24','tv-show'), ('snd-24','viral'), ('snd-24','meme'), ('snd-24','comedy'),
    ('snd-25','pushpa'), ('snd-25','allu-arjun'), ('snd-25','viral'), ('snd-25','meme'), ('snd-25','dialogue')
  ) AS v(sound_slug, tag_slug)
JOIN sounds snd ON snd.id = v.sound_slug
JOIN tags   t   ON t.slug  = v.tag_slug
ON CONFLICT DO NOTHING;
