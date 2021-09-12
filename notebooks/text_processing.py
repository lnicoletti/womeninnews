
from bs4 import BeautifulSoup
import spacy
import unidecode
from word2number import w2n
# from pycontractions import Contractions
# import gensim.downloader as api

nlp = spacy.load('en_core_web_lg')
nlp.vocab["first"].is_stop = False

def strip_html_tags(text):
    """remove html tags from text"""
    soup = BeautifulSoup(text, "html.parser")
    stripped_text = soup.get_text(separator=" ")
    return stripped_text


def remove_whitespace(text):
    """remove extra whitespaces from text"""
    text = text.strip()
    return " ".join(text.split())


def remove_accented_chars(text):
    """remove accented characters from text, e.g. café"""
    text = unidecode.unidecode(text)
    return text



def text_preprocessing(text, accented_chars=True, contractions=False, 
                       convert_num=True, extra_whitespace=True, 
                       lemmatization=True, lowercase=True, punctuations=True,
                       remove_html=True, remove_num=True, special_chars=True, 
                       stop_words=True):
    """preprocess text with default option set to true for all steps"""
    if remove_html == True: #remove html tags
        text = strip_html_tags(text)
    #print(text)
    if extra_whitespace == True: #remove extra whitespaces
        text = remove_whitespace(text)
    if accented_chars == True: #remove accented characters
        text = remove_accented_chars(text)
    # if contractions == True: #expand contractions
    #     text = expand_contractions(text)
    if lowercase == True: #convert all characters to lowercase
        text = text.lower()

    doc = nlp(text) #tokenise text
    #print(doc)

    clean_text = []
    
    for token in doc:
        flag = True
        edit = token.text
        #print(edit, token.is_stop, token.pos_, flag)
        # remove stop words
        if stop_words == True and token.is_stop and token.pos_ != 'NUM': 
            flag = False
        # remove punctuations
        if punctuations == True and token.pos_ == 'PUNCT' and flag == True: 
            flag = False
        # remove special characters
        if special_chars == True and token.pos_ == 'SYM' and flag == True: 
            flag = False
        # remove numbers
        if remove_num == True and (token.pos_ == 'NUM' or token.text.isnumeric()) \
        and flag == True:
            flag = False
        # convert number words to numeric numbers
        if convert_num == True and token.pos_ == 'NUM' and flag == True:
            edit = w2n.word_to_num(token.text)
        # convert tokens to base form
        elif lemmatization == True and token.lemma_ != "-PRON-" and flag == True:
            edit = token.lemma_
            #print(edit)
        # append tokens edited and not removed to list 
        if edit != "" and flag == True:
            clean_text.append(edit)        
    return clean_text

from re import search

def remove_numbers(word):
    pattern = r'[0-9]'
    if search(pattern, word):
        return False
    else:
        return True

def remove_special_characters(word):
    #pattern = r'[/]{}:;,.<>'
    pattern = r"[^a-zA-Z0-9]"
    if search(pattern, word):
        return False
    else:
        return True

def remove_two_letter_words(word):
    if len(word)<=2:
        #print(word)
        return False
    else: 
        return True

def get_themes(word):
    
    female_words=set(['actress',  'actresses',  'airwomen',  'alderwoman',  'alderwomen',  'anchorwoman',  'anchorwomen',  'archduchess',  'archduchesses',  
                  'assemblywoman',  'assemblywomen',  'aunt',  'aunts',  'baroness',  'baronesses',  'baronetess',  'baronetesses',  'bogeywoman',  
                  'bogeywomen',  'bondswoman',  'bondswomen',  'bride',  'businesswoman',  'businesswomen',  'camerawoman',  'camerawomen',  
                  'cavewoman',  'cavewomen',  'chairwoman',  'chairwomen',  'clergywoman',  'clergywomen',  'comtesse',  'congresswoman',  
                  'congresswomen',  'councilwoman',  'councilwomen',  'countess',  'countesses',  'countrywoman',  'countrywomen',  
                  'craftswoman',  'craftswomen',  'damsel',  'daughter',  'daughters',  'deaconess',  'deaconesses',  'diva',  'donna', 
                  'housewife',  'doorwoman',  'doorwomen',  'duchess',  'duchesses',  'empress',  'empresses',  'fem',  'female',  'females',  
                  'fiancee',  'firewoman',  'firewomen',  'fisherwoman',  'fisherwomen',  'forewoman',  'forewomen',  'freshwoman',  'freshwomen',  
                  'gal',  'galpal',  'gals',  'garbagewoman',  'garbagewomen',  'gentleman',  'girl', 'gurl',  'girlfriend',  'girlfriends',  'girls',  
                  'goddess',  'goddesshead',  'goddesshood',  'goddessliness',  'goddessly',  'godmother',  'granddaughter',  'grandma',  'grandmas',  
                  'grandmother',  'handywoman',  'handywomen',  'hangwoman',  'hangwomen',  'henchwoman',  'henchwomen',  'her',  'hers','heroine',  
                  'heroines',  'herself',  'housewife',  'journeywoman',  'journeywomen',  'kinswoman',  'kinswomen',  'klanswoman',  'ladies',  
                  'ladiez',  'lady',  'lady-romance',  'ladysplain',  'laydeez',  'laywoman',  'laywomen',  "ma'am",  'madam', 'madame' ,'madwoman',  
                  'madwomen',  'maiden',  'mailwoman',  'mailwomen',  'mama',  'marchioness',  'margravine',  'markswoman',  'markswomen',  
                  'marquise',  'middlewoman',  'middlewomen',  'milkwoman',  'milkwomen',  'miss',  'mistress',  'mom',  'mamma','mawmaw' ,'momma',  
                  'mommies',  'mommy',  'moms',  'mother',  'mothers', 'mrs',  'ms',  'mum',  'mummy',  'mums',  'niece',  'nieces',  'noblewoman',  
                  'noblewomen',  'ombudswoman',  'ombudswomen',  'policewoman',  'policewomen',  'postwoman',  'postwomen',  'priestess',  
                  'priestesses',  'princess',  'princesses',  'prostitute',  'queen',  'queens',  'repairwoman',  'repairwomen',  'saleswoman',  
                  'saleswomen',  'sandwoman',  'sandwomen',  'servicewoman',  'servicewomen',  'she',  "she's",  'showwoman',  'showwomen',  'sis',  
                  'sistagrammer',  'sistas',  'sister',  'sisters',  'snowwoman',  'spacewoman',  'spacewomen',  'spokeswoman',  'spokeswomen',  
                  'sportswoman',  'sportswomen',  'stateswoman',  'stateswomen',  'stepmother',  'stepsister',  'superwoman',  'superwomen',  
                  'unwoman',  'viscountess',  'viscountesses',  'waitress',  'watchwoman',  'watchwomen',  'weatherwoman',  'weatherwomen',  
                  'widow',  'widows',  'wife',  'wives',  'woman',  'womanhood',  'womankind',  'women',  "women's",  'workwoman',  'workwomen', 
                  'missus', 'hooker', 'whore', 'hoe', 'wench', 'harlot', 'womxn', 'womyn'])

# this list of words
    female_bias_words = set(['adorable',  'affair',  'affection',  'affectionate',  'afraid',  'agree',  'angel',  'baby',  'banshee',  'barren',  
                         'beautiful',  'beauty',  'bikini',  'birth',  'bitch', "beyotch", 'feminist',   'bitchfest',  'bitchy',  'body',  'bossy',  
                         'breast', 'boobs',  'bride',  'bridezilla',  'bubbly', 'calm',  'care',  'caress',  'caring',  'catfight',  'catty',  
                         'chatty',  'cheat',  'cheer',  'child',  'clotheshorse',  'clucky',  'co-operate',  'cold',  'collab',  'commit',  
                         'commitment',  'committed',  'communal',  'compassion',  'compassionate',  'conscientious',  'considerate',  'cook',  
                         'cooking',  'cooperate',  'cougar',  'cries',  'cry', 'coy', 'crazy',  'crying',  'dedicated',  'demure',  'depend',  
                         'dependable',  'diligent',  'ditzy',  'divorce',  'domestic',  'drama',  'dramatic',  'dress',  'easy',  'emotion',  
                         'emotiona',  'emotional',  'emotions',  'empath',  'empathetic',  'empathize',  'enthusiast',  'family',  'fear',  'feel',  
                         'feeling',  'feisty',  'femaleness',  'feminazi',  'feminine',  'fishwife',  'flaky',  'flatter',  'flatterable',  'flirty',  
                         'frail',  'frigid',  'frumpy',  'gentle', 'gently',  'girlhood',  'girlier',  'girliest',  'girly',  'gossip',  'gossipy',  
                         'helpful', "grace", "graceful", "gracefully",  'honest',  'hormonal',  'houseproud',  'humourless',  'hysterical',  
                         'ice queen', "impatient", "patient",  'inclusive',  'inter-dependen',  'inter-dependence',  'inter-dependent',  
                         'inter-personal',  'interdependence',  'interdependent',  'interpersonal',  'irrational',  'kid',  'kind',  'kinship', 
                         "judgy", "judgemental",  'ladylike',  'lie',  'lippy',  'loose',  'love', "lovely",  'lover',  'loyal',  'maid',  'makeup',  
                         'man-eater',  'man-hater',  'marriage',  'married',  'marrigeable',  'marry',  'maternal',  'maternal',  'menstrual',  
                         'mistress',  'modest',  'modesty',  'moody',  'mousey',  'mumpreneur',  'mumsy',  'nag',  'naked',  'neurotic',  'new born',  
                         'new-born',  'newborn',  'nurse',  'nurtur',  'nurture',  'nurtures',  'nurturing',  'obedient',  'obey',  'over-sensitive',  
                         'pleasant',  'polite',  'powerless',  'pregnancy',  'pretty',  'prostitute',  'prude',  'quiet',  'relationship',  'respon',  
                         'sassy',  'secretary',  'seduce',  'seductive',  'sensitiv',  'sensitive',  'sex',  'sexual',  'sexually',  'share',  "sexy","sexism", "sexist",
                         'sharin',  'shop',  'shopping',  'shrew', "shrewd", 'single',  'slut',  'slutty',  'soft',  'spinster',  'submissive',  
                         'supermum',  'support',  'sympath',  'sympathy',  'tactful', "thin", "skinny", "voluptuous", "curvy", "curvaceous", 
                         "attractive", "slender", "round", "supple",  'tease',  'tender', "tenderness",  'together',  'tomboy ',  'trollop',  'trust',  
                         'understand',  'victim',  'virgin',  'vivacious',  'warm',  'weak',  'wedding',  'weight',  'whin',  'whitefemaleness',  
                         'whore',  'womanlier',  'womanliest',  'womanliness',  'womanly',  'yield', 'ladylike', 'unladylike', 'feminist', 'motherhood'])

# words we are doubtful about: "model", "accuse", "teen", "young", "home","question", "date", "good", "hair", "couple", "teenage", "fail", "struggle",

    male_words = set(['hero', 'man',  'men', 'his', 'him', 'he', 'husband', 'father', 'male', 'son', 'god',
                  'prince', 'king', 'mr', 'sir', 'brother', 'grandfather', 'uncle', 'nephew', 'master', 'patriarch',
                 'chairman', 'chairmen', "boy","boyfriend", "save", "guy", "dad"])

    discrimination_words = set(['race', 'caste', 'casteless', 'black', 'SC', 'ST', 'african', 'american', 'white', 'colour', 
                            'color', "brown", "asian", "native", "racial", "minority", "ethnic", "ethnicity", "indian",
                            'hindu', "muslim", "chinese", "indian"])

    male_bias_words = set(["active", "adventurous", "aggression",'aggressive', "ambition", "assert", 'assertive',
                       "athlete", 'athletic', "battle", "champion", "decisive", 'head', 'dominate', 'dominant',
                        "driven", 'confident', 'strong', 'force', 'master', 'superior', 'strength', 'bold', 
                       'ambitious', 'power', 'intelligent', 'greedy', 'hostile', 'uncaring', 'logic', 'logical', 'rational',
                       "fearless",'stubborn', 'independent', 'objective', "charismatic"])

    empowerement_words = set(['chairperson', 'leader','leadership',  'chairwoman', 'minister', 'power','powerful', 'authority', 
                          'queen', 'manager', 'success', 'successful', 'successes', 'career', 'job',
                         'CEO','CFO', 'chief', 'officer', 'employment', 'employed', 'millionaire', "ceo", "cfo", 
                          'wealth', 'wealthy', 'strong', 'strength', 'courage','achievement', 'achievements', 
                          'achieve', 'goal', 'ambition', 'ambitious', 'passionate','passion', 'badass', 
                          'confident', 'confidence', 'breakthrough', "inspirational", "educated"
                         'inspiring', 'inspiration', 'inspire', 'empower', 'empowered', 'empowerement',
                         'genius', 'expert', 'mastery', 'owner', 'businesswoman', 'intelligent', 'smart', 
                          'clever', 'wise', 'worth', 'role model', 'role-model', 'activist', "pay", "work", 
                          "business", "win", "award", "appoint", "lead", "star", "boss", "dream",'goddess', 
                          "actor", 'queen', "launch", "worker", "lawyer", "education", "director", "protester", 
                          "protest", "governor", "survive", "stallion", "doctor", "voice", "perfect", "author",
                          "mayor", "founder", "abortion", "rise", "1st", "winner", "artist", "graduate", 
                          "employee", "earning", "survivor", "scientist", "equality", "equal", "deputy", 
                          "entrepreneur", "survive", "parent", "freedom"])

    politics_words = set(["trump", "biden", "kamala", "harris", "joe", "vote", "election", "president", "elect", 
                      "state", "government", "obama", "office", "campaign", "melania", "vice", "govt", "donald", 
                      "voter", "congress", "candidate", "political", "breonna", "taylor", "pelosi", "democratic",
                      "politic", "democrats", "republican", "ivanka", "republicans", "hillary", "clinton", "susan", 
                      "collins", "warren", "rep", "rally", "debate", "senate", "washington", "speech", "presidential",
                      "boris", "mandela"])

    violence_words = set(["find", "allegedly", "fire", "life", 'violent', 'violence', 'crime', 'rape','rapist', 'raped', 'murder','kill', 'killed','killer',
                     'murdered', 'murderer', 'attack', 'alleged', 'criminal', 'stab', 'knife', 'gun', 'guns', 'knives',
                     'blood', 'bloodshed', 'court', 'rage', 'outrage', 'rob', 'steal', 'robber', 'stealer', 'beater', "beaten",
                     'domestic violence', 'aggression', 'aggressor', 'war', 'battle', 'abduction', 'assault', 'assaulted',
                     'drug', 'abuse', 'child abuse', 'prison', 'fraud', 'human traffic', 'homicide', 'organised crime',
                     'organized crime', 'genocide', 'fight', 'manslaughter', 'terrorist', 'weapon', 'smuggl', 'shoplift',
                     'vandalism', 'crime', 'theft', 'penalty', 'prison sentence', 'detained', 'guilty', 'trial',
                     'defense', 'defend', 'armed', 'jail', 'illegal', 'accomplice',"horrific",
                     'alcohol', 'allegation', 'arson', 'bail', 'battery', 'dead', 'death', 'deadly', 'corrupt', 'killer', 
                     'sex crime', 'wanted', "arrest", "police", "die", "charge", "suspect", "shoot", "sentence", "cop", "hit", 
                     "break", "beat", "judge", "kidnap", "law", "corruption", "gang", "suicide", "critically injured", 'harassment',
                     "run", "crash", "hospital", 'security', "report", "risk", "fall", "burn", "escape", "threaten", "slam",
                     "gangrape", "harass", "brutally", "drown", "justice", "hate", "racist", "allege", "lawsuit", "injure", "racism", 
                      "thug", "suffer", "injury", "horror", "killing", "robbery", "plead", "wound", "kidnapping", "convict", "shooting"])

    
    
    useful_words = violence_words.union(*[empowerement_words, male_bias_words, discrimination_words, male_words, female_bias_words, female_words])

    

    if word in violence_words:
        return "violence"
    elif word in empowerement_words:
        return "empowerement"
    elif word in female_words.union(*[female_bias_words]):
        return "female stereotypes"
    else:
        return "No theme"
#print(len([word for word in useless_from_dict_india if word not in useless]))

import numpy as np

def get_top_percentile_words(df, country, percentile):
    df1 = df[df['country']==country]
    df1 = df1[df1['count']>np.percentile(df1['count'], percentile)]
    df1['rank'] = df1['count'].rank(method = 'first', ascending = False)

    return df1

def remove_words(df1):

    women_words = ["women", "woman", "girl", "female", "lady", "ladies", "she", "her", "herself", "aunt", "grandmother", "mother", "sister"]
    
    people = ["bhatt", "beyonce", "bachchan", "banerjee", "deepika" "donald", "kamala", "harris", "janhvi", "jayalalitha",
     "jenner", "jennifer", "jessica", "kaif", "kangana", "karan", "kardashian", "kareena", "kate", "katrina", "kaur", "khanna", "kumar"
     "mirza", "mithali", "narendra", "obama", "padukone", "raj", "ranbir", "ranaut", "shah", "sharma", "shetty", "sindhu", "singh", "sonakishi",
     "sridevi", "swaraj", "vidya", "jackson", "jones", "katy", "katie", "kelly", "kylie", "lawrence", "rachel", "rihanna", "smith", "angelina", 
     "aniston", "antonio", "ashley", "bradley", "britney", "caitlyn", "greta", "harvey", "jolie", "kanye", "kendall", "kim", "kourtney", "lohan"
     ,"lopez", "megan", "melissa", "minaj", "nicki", "richard", "selena", "aaradhya", "mandela", "zuma", "zeffany"]
    
    places = ["delhi", "hyderabad", "ahmedabad", "surat", "mumbai", "afghan", "africa", "african", "andhra",
    "telangana", "america", "american", "arabia", "australia", "australian", "bangalore", "bengal", "bihar","german", "germany",
    "california", "chandigarh", "china", "gujarat", "gurgaon", "jharkand", "karnataka", "kashmir", "kolkata", "londo","abbey","zahara",
    "mizoram", "mumbai", "nepal", "pakistan", "pakistani", "pradesh", "punjab", "russian", "texas", "thane", "mexico","durban","malema", "bonang",
    "middleton", "scotland", 'scottish', 'carolina', 'georgia', 'indiana', 'houston', 'hudson', 'maryland', 'pennsylvania',"zodwa","wabantu",
    'tennessee', "zim", "zimbabwe", "york", "cape", "town", "joburg", "limpopo", "chennai", "brooklyn", "ramaphosa", "pretoria", "limpopo", "oklahoma"]


    useless = ["year", "old", "say", "india", "indian", "new", "not", "day", "find", "get", "life", "sa", "yr", "zealand", "apr", "aug",
           "world", "news", "meet", "video", "watch", "want", "time_right", "kerala", "covid", "ago", "TRUE","bjp","winnie",
           "give", "like", "share", 'share', 'khan', 'look', 'take', 'face', 'kapoor', 'tell', "anushka", "kzn", "anc",
           'good', 'call', 'make', 'know', 'miss', 'leave', 'need', 'ask', 'trump', 'post', "soweto","thehill", "dubran",
           'story',  'set', 'turn', 'gaga', 'break', 'open', 'priyanka', 'way', 'photo', 'book', "semenya",
           'birthday', 'show', 'viral', 'pay', 'right', 'play', 'chopra', 'high', 'team', 'report', 
           'live', 'try',  'talk', 'run', 'come', 'bengaluru', 'month', 'modi', 'charge', 'big', "mugabe","gauteng","soweto", 
           'house', "week", "self", "picture", "road", "series", "fly", "thank", "finally", "gift", 
           "welcome", "travel", "eye", "social", "speak", "visit", "start", "happy", "street", "amid", 
           "game", "keep", "catch", "real", "land", "bank", "film", "office", "end", "let", "official", 
           "return", "class", "centre", "late", "letter", "carry", "bring", "origin", "tech", "inside", 
           "think", "name", "medium", "tip", "receive", "air", "state", "survey", "list", "half", "stop", 
           "eat", "enter", "message", "drive", "check", "cover", "people", "sell", "fan", "jump", "public", 
           "place", "test", "national", "near", "push", "away", "buy", "hour", "train", "review", "bus", 
           "night", "remember", "join", "announce", "offer", "throw", "final", "well", "see", "friend", 
           "wish", "send", "today", "city", "number", "read", "plan", "hold", "hand", "use", "station", 
           "have", "seek", "step", "lockdown", "happen", "car", "village", "group", "moment", "industry", 
           "spend", "pass", "create", "ride", "long", "brand", "follow", "likely", "second", "international", 
           "will", "move", "thing", "dog", "stay", 'cardi', "continue", "drop", "wait", "link", "water", 
           "lay", "bite", "free", "base", "own", "mail", "deal", "hear", "update", "eff", "000", "detail", 
           "arm", "remain", "word", "local", "town", "remove", "urge", "listen", "put", "role", "pick", 
           "favorite", "host", "rock", "cast", "identify", "club", "expect", "suit", "outside", "close", 
           "line", "surprise", "park", "tour", "pandemic", "super", "season", "recap", "kick", "ew.com", 
           "case", "sign", "scene", "time.com", "respond", "problem", "hard", "scout", "red", "county", 
           "nearly", "hide", "trailer", "cause", "row", "telegraph", "holiday", "appear", "flat", "despite", 
           "tribute", "refuse", "punch", "exclusive", "sleep", "french", "leg", "pull", "british", 
           "spark", "condition", "cat", "charity", "huge", "bond", "fine", "match", "spot", "phone", 
           "flight", "bar", "confirm", 'country', "wwe", "youtube", "guardian"]
    
    df1 = df1[~(df1['word'].isin(women_words))]
    df1 = df1[~(df1['word'].isin(useless))]
    df1 = df1[~(df1['word'].isin(people))]
    df1 = df1[~(df1['word'].isin(places))]


    return df1