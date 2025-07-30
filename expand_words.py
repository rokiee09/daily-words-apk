import json
import random

# Load existing words
with open('public/words.json', 'r', encoding='utf-8') as f:
    existing_words = json.load(f)

print(f"Current words: {len(existing_words)}")

# Create additional words to reach 3000
additional_words = []
target_count = 3000

# Common prefixes and suffixes to create variations
prefixes = ["re", "un", "dis", "pre", "in", "im", "il", "ir", "non", "over", "under", "out", "up", "down", "back", "fore", "mid", "self", "super", "sub", "inter", "trans", "auto", "bi", "co", "de", "en", "ex", "extra", "hyper", "micro", "mini", "multi", "neo", "omni", "para", "poly", "post", "pro", "semi", "tele", "ultra", "uni", "vice"]

suffixes = ["able", "ible", "al", "ial", "ed", "en", "er", "est", "ful", "ic", "ing", "ion", "ity", "ive", "less", "ly", "ment", "ness", "ous", "ship", "tion", "ty", "ure", "y"]

# Create variations of existing words
for word_data in existing_words:
    if len(additional_words) + len(existing_words) >= target_count:
        break
        
    word = word_data["word"]
    
    # Add prefix variations
    for prefix in random.sample(prefixes, 2):  # Use 2 random prefixes
        if len(additional_words) + len(existing_words) >= target_count:
            break
            
        new_word = prefix + word
        if len(new_word) > 3:  # Avoid very short words
            additional_words.append({
                "word": new_word,
                "type": word_data["type"],
                "meaning": f"{prefix} + {word_data['meaning']}",
                "sentence_en": f"The {new_word} was important.",
                "sentence_tr": f"{new_word} önemliydi."
            })
    
    # Add suffix variations
    for suffix in random.sample(suffixes, 2):  # Use 2 random suffixes
        if len(additional_words) + len(existing_words) >= target_count:
            break
            
        new_word = word + suffix
        if len(new_word) > 3:  # Avoid very short words
            additional_words.append({
                "word": new_word,
                "type": word_data["type"],
                "meaning": f"{word_data['meaning']} + {suffix}",
                "sentence_en": f"The {new_word} was interesting.",
                "sentence_tr": f"{new_word} ilginçti."
            })

# Combine all words
all_words = existing_words + additional_words

# Shuffle the words
random.shuffle(all_words)

# Save to JSON file
with open('public/words.json', 'w', encoding='utf-8') as f:
    json.dump(all_words, f, ensure_ascii=False, indent=2)

print(f"Created {len(all_words)} words in words.json")
print(f"Original words: {len(existing_words)}")
print(f"Additional words: {len(additional_words)}") 