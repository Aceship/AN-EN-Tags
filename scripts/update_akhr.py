import json
import os

# --- Configuration ---
# Get the absolute path of the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# The project root is one level up from the scripts directory
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Build paths relative to the project root
CHAR_TABLE_PATH = os.path.join(PROJECT_ROOT, 'json', 'gamedata', 'zh_CN', 'gamedata', 'excel', 'character_table.json')
HANDBOOK_INFO_TABLE_PATH = os.path.join(PROJECT_ROOT, 'json', 'gamedata', 'zh_CN', 'gamedata', 'excel', 'handbook_info_table.json')
TL_AKHR_PATH = os.path.join(PROJECT_ROOT, 'json', 'tl-akhr.json')
TL_AKHR_PATH_OUT = os.path.join(PROJECT_ROOT, 'json', 'tl-akhr-test-out.json')

# --- Mappings ---
# Maps rarity enum to a numeric level
RARITY_TO_LEVEL = {
    "TIER_1": 1,
    "TIER_2": 2,
    "TIER_3": 3,
    "TIER_4": 4,
    "TIER_5": 5,
    "TIER_6": 6,
}

# Maps profession enum to Chinese name
PROFESSION_MAP = {
    "PIONEER": "先锋",
    "WARRIOR": "近卫",
    "SNIPER": "狙击",
    "TANK": "重装",
    "MEDIC": "医疗",
    "SUPPORT": "辅助",
    "CASTER": "术师",
    "SPECIAL": "特种",
    "TOKEN": "TOKEN",
    "TRAP": "TRAP",
}

# Maps nationId to Chinese name
NATION_MAP = {
    "rhodes": "罗德岛",
    "babel": "巴别塔",
    "kazimierz": "卡西米尔",
    "victoria": "维多利亚",
    "laterano": "拉特兰",
    "siracusa": "叙拉古",
    "ursus": "乌萨斯",
    "bolivar": "玻利瓦尔",
    "minos": "米诺斯",
    "sami": "萨米",
    "kjerag": "谢拉格",
    "columbia": "哥伦比亚",
    "yan": "炎",
    "higashi": "东国",
    "sargon": "萨尔贡",
    "abyssal": "阿戈尔",
    "kazdel": "卡兹戴尔",
    "leithanien": "莱塔尼亚",
    "iberia": "伊比利亚",
    "rim": "雷姆必朗",
    "reunion": "整合运动",
}

def get_position_tag(position_str):
    """Maps position string to the correct tag."""
    return "近战位" if position_str == "MELEE" else "远程位"

def get_characteristic(char_data):
    """Gets the characteristic, checking for trait overrides."""
    trait = char_data.get('trait')
    if trait and trait.get('candidates') and trait['candidates'][0].get('overrideDescripton'):
        return trait['candidates'][0]['overrideDescripton']
    return char_data.get('description', '')

def main():
    """
    Extracts new characters from character_table.json and populates them
    into tl-akhr.json.
    """
    print("Starting character update script...")

    # --- 1. Load JSON data ---
    try:
        with open(CHAR_TABLE_PATH, 'r', encoding='utf-8') as f:
            char_table = json.load(f)
        with open(HANDBOOK_INFO_TABLE_PATH, 'r', encoding='utf-8') as f:
            handbook_table = json.load(f)
        with open(TL_AKHR_PATH, 'r', encoding='utf-8') as f:
            tl_akhr_data = json.load(f)
    except FileNotFoundError as e:
        print(f"Error: Could not find a required file. {e}")
        return
    except json.JSONDecodeError as e:
        print(f"Error: Could not parse a JSON file. {e}")
        return

    # Pre-process handbook data for quick gender lookup
    gender_map = {char_id: entry['storyTextAudio'][0]['stories'][0]['storyText'].split('，')[0] for char_id, entry in handbook_table.get('charStories', {}).items() if entry.get('storyTextAudio')}

    # --- 2. Identify existing characters for quick lookup ---
    print("Identifying existing characters...")
    existing_char_ids = {char['id'] for char in tl_akhr_data}
    print(f"Found {len(existing_char_ids)} characters in '{os.path.basename(TL_AKHR_PATH)}'.")

    # --- 3. Find and process new characters ---
    new_characters = []
    for char_id, char_data in char_table.items():
        # Skip tokens and other non-playable entries
        if not char_id.startswith('char_'):
            continue

        if char_id not in existing_char_ids:
            print(f"Found new character: {char_data.get('name', 'Unknown')} ({char_id})")

            # Add position tag (近战位/远程位)
            tags = [get_position_tag(char_data.get('position'))]
            # Add other tags
            tags.extend(char_data.get('tagList', []))

            new_char_entry = {
                "id": char_id,
                "name_cn": char_data.get('name', ''),
                "name_en": char_data.get('appellation', ''),
                "name_jp": "",
                "name_kr": "",
                "characteristic_cn": "",
                "characteristic_en": "",
                "characteristic_jp": "",
                "characteristic_kr": "",
                "camp": NATION_MAP.get(char_data.get('nationId'), ''),
                "type": PROFESSION_MAP.get(char_data.get('profession'), ''),
                "level": RARITY_TO_LEVEL.get(char_data.get('rarity'), 0),
                "sex": gender_map.get(char_id, "女"), # Default to 女 if not found
                "tags": tags,
                "hidden": char_data.get('isNotObtainable', True),
                "globalHidden": char_data.get('isNotObtainable', True)
            }
            new_characters.append(new_char_entry)

    # --- 4. Append new data and save ---
    if not new_characters:
        print("No new characters found. The file is already up-to-date.")
        return

    # Sort the newly found characters by their ID before appending
    new_characters.sort(key=lambda char: char['id'])

    print(f"\nAdding {len(new_characters)} new character(s) to '{os.path.basename(TL_AKHR_PATH)}'.")
    tl_akhr_data.extend(new_characters)

    try:
        with open(TL_AKHR_PATH_OUT, 'w', encoding='utf-8') as f:
            # Use ensure_ascii=False to write Chinese characters directly
            # Use indent for pretty-printing
            json.dump(tl_akhr_data, f, ensure_ascii=False, indent='\t')
        print("Successfully updated the file.")
    except IOError as e:
        print(f"Error: Could not write to the file. {e}")

if __name__ == '__main__':
    main()
