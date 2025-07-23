import json
import random
from tqdm import tqdm

# Kaynak dosya ve hedef dosya
SOURCE = "dictionary.json"
TARGET = "public/words.json"

# Örnek cümle şablonları
SENTENCE_TEMPLATES = [
    "{word_cap} is an important word in English. For example: '{example}'.",
    "Many people use the word '{word}' when they want to say: {tr}.",
    "Here is a sentence with '{word}': {example}",
    "If you know the word '{word}', you can say: {example}",
    "A common usage of '{word}' is: {example}",
    "Let's see '{word}' in a sentence: {example}",
    "The meaning of '{word}' is '{tr}'. For example: {example}",
    "You might hear: {example} (Here, '{word}' means '{tr}')",
]

# Basit örnek cümle üretici (daha doğal ve çeşitli)
def generate_example(word, tr, word_type):
    # Farklı türler için farklı cümleler
    word_cap = word.capitalize()
    if word_type.startswith("v"):  # verb
        base = [
            f"I want to {word} every day.",
            f"She decided to {word} after work.",
            f"They {word} together on weekends.",
            f"You should {word} if you want to succeed.",
            f"He didn't {word} yesterday.",
        ]
    elif word_type.startswith("n"):  # noun
        base = [
            f"The {word} is on the table.",
            f"I have a {word} in my bag.",
            f"{word_cap} can change your life.",
            f"Many people like this {word}.",
            f"We talked about the {word}.",
        ]
    elif word_type.startswith("adj"):  # adjective
        base = [
            f"This is a very {word} day.",
            f"She is {word} and friendly.",
            f"The weather is {word} today.",
            f"I feel {word} when I see you.",
            f"It's not {word} to do that.",
        ]
    elif word_type.startswith("adv"):  # adverb
        base = [
            f"He runs {word}.",
            f"She answered the question {word}.",
            f"They finished the work {word}.",
            f"You can do it {word} if you try.",
            f"He spoke {word} during the meeting.",
        ]
    else:
        base = [
            f"I like to use the word '{word}'.",
            f"Do you know what '{word}' means?",
            f"Learning '{word}' is useful.",
            f"Can you use '{word}' in a sentence?",
            f"'{word_cap}' is a good word to know.",
        ]
    return random.choice(base)

# 3000 farklı kelimeyi seç ve uygun formatta kaydet
def main():
    with open(SOURCE, encoding="utf-8") as f:
        data = json.load(f)
    words = []
    seen = set()
    for entry in tqdm(data, desc="Kelime seçiliyor"):  # Büyük dosya için ilerleme çubuğu
        word = entry["word"].strip().lower()
        tr = entry["tr"].strip()
        word_type = entry.get("type", "")
        # Sadece harf içeren ve tekrar etmeyen kelimeler
        if not word.isalpha() or word in seen:
            continue
        seen.add(word)
        # Cümle üret
        example = generate_example(word, tr, word_type)
        template = random.choice(SENTENCE_TEMPLATES)
        sentence = template.format(word=word, word_cap=word.capitalize(), tr=tr, example=example)
        words.append({
            "word": word,
            "meaning": tr,
            "sentence": sentence
        })
        if len(words) >= 3000:
            break
    with open(TARGET, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    print(f"{len(words)} kelime kaydedildi: {TARGET}")

if __name__ == "__main__":
    main() 