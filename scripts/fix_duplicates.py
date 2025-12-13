#!/usr/bin/env python3
import re

with open('translations.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Track which keys we've seen in each language section
seen_keys = {}
current_lang = None
output_lines = []

for i, line in enumerate(lines):
    # Check if we're starting a new language section
    lang_match = re.match(r'\s+(en|hi|fr|ar|ur|bn|id|ms|zh|de|ru|nl|he|tr|bs|sq):\s*{', line)
    if lang_match:
        current_lang = lang_match.group(1)
        seen_keys[current_lang] = set()
        output_lines.append(line)
        continue
    
    # Check if we're ending a language section
    if re.match(r'\s+},\s*$', line) and current_lang:
        current_lang = None
        output_lines.append(line)
        continue
    
    # If we're in a language section, check for duplicate keys
    if current_lang:
        key_match = re.match(r'\s+([a-z_]+):\s*', line)
        if key_match:
            key = key_match.group(1)
            if key in seen_keys[current_lang]:
                # Skip this line (duplicate key)
                print(f"Removing duplicate key '{key}' in {current_lang} language")
                continue
            else:
                seen_keys[current_lang].add(key)
    
    output_lines.append(line)

# Write back
with open('translations.ts', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("\n✅ All duplicate keys removed!")
