import json
import re

with open('pdf_out.json', 'r', encoding='utf-16le') as f:
    try:
        data = json.load(f)
    except Exception as e:
        with open('pdf_out.json', 'r', encoding='utf-16') as f2:
            data = json.load(f2)

def map_category_platform(section_name):
    s = section_name.lower()
    
    if 'facebook' in s or 'instagram' in s or 'twitter' in s or 'tiktok' in s or 'threads' in s or 'snapchat' in s or 'reddit' in s or 'pinterest' in s or 'whatsapp' in s or 'telegram' in s or 'discord' in s:
        category = 'social-media-messaging'
    elif 'gmail' in s or 'yahoo' in s or 'outlook' in s or 'proton' in s or 'gmx' in s or 'mail.ru' in s or 'zoho' in s or 'aol' in s or 'rambler' in s or 'yandex' in s or 'web mail' in s or 'onet pl' in s or 'random email' in s or 'mail' in s or 'leads' in s or 'database' in s:
        category = 'email-services'
    elif 'amazon' in s or 'ecommerce' in s or 'ebay' in s or 'walmart' in s or 'etsy' in s or 'craigslist' in s or 'shein' in s or 'temu' in s or 'linkedin' in s or 'indeed' in s:
        category = 'ecommerce-professional'
    elif 'youtube' in s or 'twitch' in s or 'google' in s:
        category = 'google-ecosystem'
    elif 'vpn' in s or 'proxy' in s or 'vps' in s or 'rdp' in s or 'cloud' in s or 'data center' in s or 'product key' in s or 'windows' in s or 'office' in s or 'steam' in s or 'playstation' in s or 'roblox' in s:
        category = 'proxies-vps-software'
    elif 'gift card' in s or 'apple' in s or 'mastercard' in s or 'nitro' in s:
        category = 'gift-cards-financial'
    elif 'premium' in s or 'netflix' in s or 'spotify' in s or 'canva' in s or 'gemini' in s or 'capcut' in s or 'iptv' in s:
        category = 'subscriptions-ai'
    elif 'trustpilot' in s or 'yelp' in s or 'uber' in s:
        category = 'reviews-local'
    elif 'dating' in s or 'tinder' in s or 'badoo' in s or 'grindr' in s or 'eharmony' in s:
        category = 'dating'
    else:
        category = 'social-media-messaging'

    platform = "Other"
    if 'facebook' in s: platform = "Facebook"
    elif 'instagram' in s: platform = "Instagram"
    elif 'twitter' in s or 'x ' in s: platform = "Twitter/X"
    elif 'tiktok' in s: platform = "TikTok"
    elif 'threads' in s: platform = "Threads"
    elif 'snapchat' in s: platform = "Snapchat"
    elif 'reddit' in s: platform = "Reddit"
    elif 'pinterest' in s: platform = "Pinterest"
    elif 'gmail' in s or 'google' in s: platform = "Google"
    elif 'yahoo' in s: platform = "Yahoo"
    elif 'outlook' in s or 'hotmail' in s: platform = "Microsoft"
    elif 'youtube' in s: platform = "YouTube"
    elif 'twitch' in s: platform = "Twitch"
    elif 'whatsapp' in s: platform = "WhatsApp"
    elif 'telegram' in s: platform = "Telegram"
    elif 'discord' in s: platform = "Discord"
    elif 'linkedin' in s: platform = "LinkedIn"
    elif 'indeed' in s: platform = "Indeed"
    elif 'netflix' in s: platform = "Netflix"
    elif 'spotify' in s: platform = "Spotify"
    elif 'amazon' in s: platform = "Amazon"
    elif 'roblox' in s: platform = "Roblox"
    elif 'uber' in s: platform = "Uber"
    elif 'steam' in s: platform = "Steam"
    elif 'apple' in s: platform = "Apple"
    elif 'canva' in s: platform = "Canva"
    elif 'trustpilot' in s: platform = "Trustpilot"

    return category, platform

products = []
current_section = "General"
for row in data:
    if len(row) < 5: continue
    
    if row[1] and not row[2]:
        current_section = row[1].strip()
        continue
    
    if row[1] and row[2]:
        no = row[1]
        if no == "No" or not no.isdigit():
            continue
        
        name_desc = row[2].strip()
        stock_str = row[3]
        price_str = row[4]
        
        price = 0.0
        if price_str and price_str.startswith('$'):
            try: price = float(price_str.replace('$', '').replace(',', '').strip())
            except ValueError: price = 0.0
        
        stock = 0
        if stock_str and "pcs" in stock_str:
            try: stock = int(stock_str.replace('pcs.', '').replace('pcs', '').strip())
            except ValueError: stock = 0
        
        category, platform = map_category_platform(current_section)
        
        desc_lower = name_desc.lower()
        
        country = "Global"
        if "usa" in desc_lower or "us " in desc_lower or "america" in desc_lower: country = "US"
        elif "uk" in desc_lower or "united kingdom" in desc_lower: country = "UK"
        elif "europe" in desc_lower or "eu " in desc_lower: country = "EU"
        elif "russia" in desc_lower: country = "RU"
        elif "india" in desc_lower: country = "IN"
        elif "brazil" in desc_lower: country = "BR"
        elif "vietnam" in desc_lower: country = "VN"
        elif "nigeria" in desc_lower: country = "NG"

        creation_year = "2024"
        match = re.search(r'(20\d{2})', name_desc)
        if match: creation_year = match.group(1)
            
        is_pva = "sms" in desc_lower or "verified" in desc_lower or "phone" in desc_lower
        has_2fa = "2fa" in desc_lower
        has_cookies = "cookies" in desc_lower or "session" in desc_lower
        
        product = {
            "id": f"item-{no}",
            "name": name_desc, # Do not split, keep the full detailed string as requested
            "platform": platform,
            "category": category,
            "shortDesc": current_section, # Use the original section heading as short desc
            "fullDesc": name_desc,
            "pricePerUnit": price,
            "stockCount": stock,
            "minPurchase": 1,
            "maxPurchase": stock if stock > 0 else 100,
            "deliveryFormat": "email:password",
            "deliveryFormatExample": "user@example.com:pass123",
            "attributes": {
                "country": country,
                "creationYear": creation_year,
                "isPVA": is_pva,
                "has2FA": has_2fa,
                "hasCookies": has_cookies,
                "warmupStatus": "Standard",
                "warrantyHours": 24
            },
            "bulkPricing": []
        }
        products.append(product)

ts_code = "import { AccountProduct, SupportConfig, UserProfile } from '../types/index.ts';\n\n"
ts_code += "export const INITIAL_PRODUCTS: AccountProduct[] = " + json.dumps(products, indent=2) + ";\n\n"
ts_code += """export const INITIAL_SUPPORT_CONFIG: SupportConfig = {
  telegramHandle: '@BodiaTechSupport',
  telegramUrl: 'https://t.me/BodiaTechSupport',
  whatsAppNumber: '+1 (555) 263-4283',
  whatsAppUrl: 'https://wa.me/15552634283',
  supportEmail: 'support@bodiatech.io',
  operatingHours: '24/7/365 — Automated Dispatch & Live Shift Engineers',
  warrantyPolicy: '24h to 72h replacement coverage on all verified credential checkpoints before account activity.',
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-client-2026',
  name: 'Agency Growth Client',
  email: 'buyer@agencygrowth.com',
  role: 'customer',
  status: 'active',
};
"""

with open('src/data/initialProducts.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)
print(f"Generated {len(products)} products!")
