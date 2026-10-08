import json
import re

raw_data = [
  # 1-18
  ["Facebook Accounts - USA Facebook", "1", "FB Accounts | Verified by e-mail, there is no email in the set. Male or female. The account profiles may be empty or have limited entries such as photos and other information. 2FA included. Cookies", "1 pcs.", "$1.10"],
  ["Facebook Accounts - USA Facebook", "2", "Facebook Accounts | USA | Marketplace + Cookies Included | SMS & Email Verified | Email Included | 2FA Enabled | Registered from USA IP", "1133 pcs.", "$1.25"],
  ["Facebook Accounts - USA Facebook", "3", "Facebook Accounts | Email Included | Male & Female | 2FA Included | Profile & Cover Photo | USA IP Registered", "266 pcs.", "$1.30"],
  ["Facebook Accounts - USA Facebook", "4", "Facebook Accounts | USA | 2FA Enabled | USA SMS & Email Verified | Profile & Cover Photo Fully Filled | Registered from USA IP (No Cookies)", "159 pcs.", "$1.40"],
  ["Facebook Accounts - USA Facebook", "5", "Facebook Accounts | USA | Marketplace Enabled | The Accounts are Verified by SMS | Email Included | 2FA Enabled | The Profiles Information is Partially Filled | Registered from USA IP", "846 pcs.", "$1.50"],
  ["Facebook Accounts - USA Facebook", "6", "Facebook Accounts | USA | Marketplace + 2FA Enabled | SMS & Email Verified | Email Included | Male & Female | Registered from USA IP", "1333 pcs.", "$1.70"],
  ["Facebook Accounts - Facebook With Page", "7", "Facebook Page Accounts | 01-10 Real Friends | Page Activated | Email Verified & Included | 2FA Included | With Profile Picture | USA IP Registered", "6 pcs.", "$2.50"],
  ["Facebook Accounts - Facebook With Page", "8", "Facebook Account With Page | SMS & Email Verified | Email Included | 2FA Enabled | Mix IP Registered", "16 pcs.", "$2.50"],
  ["Facebook Accounts - Facebook With Page", "9", "Facebook Account With Page | No Followers | SMS & Email Verified | Email Included | 2FA Enabled | USA IP Registered", "14 pcs.", "$2.50"],
  ["Facebook Accounts - Facebook With Page", "10", "Facebook Account With Page | Profile + Cover Photo Added | SMS & Email Verified | Email Included | 2FA + Cookies Included | Mixed IPs", "206 pcs.", "$3.00"],
  ["Facebook Accounts - Facebook With Page", "11", "Facebook Account With Page | SMS & Email Verified | Email Included | 2FA Enabled | With Profile Picture | Cookies | Mixed IP Registered", "12 pcs.", "$3.10"],
  ["Facebook Accounts - Facebook With Page", "12", "Facebook Account With Page | SMS & Email Verified | Email Included | 2FA Enabled | Cookies | Mixed IP Registered", "2 pcs.", "$3.30"],
  ["Facebook Accounts - Facebook With Friends", "13", "Facebook Accounts | 30–100 Real Friends | Outlook/Hotmail Email Verified & Included | Male & Female | 2FA Included | Profile Photo Uploaded | Random IP Registered", "206 pcs.", "$1.40"],
  ["Facebook Accounts - Facebook With Friends", "14", "France Facebook Accounts | 30+ Friends | Outlook/Hotmail Verified | Male & Female | 2FA & Profile Photo | FR IP", "201 pcs.", "$1.40"],
  ["Facebook Accounts - Facebook With Friends", "15", "USA Facebook Accounts | 30 Friends | Outlook/Hotmail Verified | Avatar Added | Cookies & 2FA Included | USA IP", "37 pcs.", "$2.00"],
  ["Facebook Accounts - Facebook With Friends", "16", "Facebook Accounts | 2019-2024 Aged Accounts | Real Friends 1-1k | Male & Female | Marketplace Activated | Cookies Included (Only Cookies Login) | Globally IP Registered", "731 pcs.", "$2.10"],
  ["Facebook Accounts - Facebook With Friends", "17", "FB Accounts | Number of friends 50+ (friends and followers). Verified by email@outlook.com/hotmail.com, email included. Female. The profiles information is partially filled. 2FA in the set.", "690 pcs.", "$2.50"],
  ["Facebook Accounts - Facebook With Friends", "18", "Facebook Accounts | 30+ Real Friends | Female | SMS and Email Verified & Included | 2FA + Cookies Included | Avatar Added | Registered From USA IP", "85 pcs.", "$2.50"],
  # 19-24
  ["Facebook Accounts - Selfie Verified", "19", "Facebook Accounts | Selfie Verified | Warmed Up | Marketplace + 2FA Enabled | SMS & Email Verified | Email Included | Registered from MIXED IP", "300 pcs.", "$9.00"],
  ["Facebook Accounts - Selfie Verified", "20", "Facebook Accounts | Selfie Verified | Warmed Up | Marketplace + 2FA Enabled | SMS & Email Verified | Email & Cookies Included | Registered from MIXED IP", "36 pcs.", "$11.00"],
  ["Facebook Accounts - Selfie Verified", "21", "Facebook Accounts | Selfie Verified | Female | Warmed Up | Marketplace + 2FA Enabled | SMS & Email Verified | Email & Cookies Included | Registered from MIXED IP", "33 pcs.", "$20.00"],
  ["Facebook Accounts - Selfie Verified", "22", "Facebook Accounts | Selfie Verified | Female | Warmed Up | Marketplace + 2FA Enabled | USA SMS & Email Verified | Email Included | Cookies Included | Registered from USA IP", "93 pcs.", "$28.00"],
  ["Facebook Accounts - Selfie Verified", "23", "Facebook Accounts | Selfie Verified | Warmed Up | Marketplace + 2FA Enabled | USA SMS & Email Verified | Email Included | Cookies Included | Empty Profile | Registered from USA IP", "89 pcs.", "$38.00"],
  ["Facebook Accounts - Selfie Verified", "24", "Facebook Accounts | Selfie Verified | Warmed Up | Marketplace + 2FA Enabled | SMS & Email Verified | Email Included | Cookies Included | Registered from EU IP", "15 pcs.", "$48.00"],
  # 34-39
  ["Facebook Accounts - Facebook Ads Accounts", "34", "Facebook Ads Accounts | 1-10 Real Friends | Page +1 Business Manager Activated | Marketplace Enabled | Female | Email Verified & Included | 2FA Included | With Profile Picture | USA IP Registered", "5 pcs.", "$2.95"],
  ["Facebook Accounts - Facebook Ads Accounts", "35", "Facebook Ads Accounts | Page +1 Business Manager Activated | Email + SMS Verified | 2FA Included | Empty Profile | USA IP Registered", "75 pcs.", "$3.00"],
  ["Facebook Accounts - Facebook Ads Accounts", "36", "Facebook Ads Accounts | 30+ Friends | Page +1 Business Manager Activated | SMS + Email Verified | 2FA Included | With Profile Picture | Cookies Included | Mixed IP Registered", "1 pcs.", "$4.30"],
  ["Facebook Accounts - Facebook Ads Accounts", "37", "Facebook Ads Accounts | 20-60 Real Friends | Page +1 Business Manager Activated | Email Verified & Included | 2FA Included | With Profile Picture | Cookies Included | USA IP Registered", "2 pcs.", "$4.40"],
  ["Facebook Accounts - Facebook Ads Accounts", "38", "Facebook Ads Accounts | Page +1 Business Manager Activated | SMS + Email Verified | 2FA Included | Empty Profile | Cookies Included | USA IP Registered", "110 pcs.", "$4.50"],
  ["Facebook Accounts - Facebook Ads Accounts", "39", "Facebook Ads Accounts | 30+ Friends | Page +1 Business Manager Activated | SMS + Email Verified | 2FA Included | With Profile Picture | Cookies Included | Mixed IP Registered", "1 pcs.", "$4.50"],
  # 40-45
  ["Facebook Accounts - Facebook Followers", "40", "USA Facebook Accounts | Marketplace + Professional Mode | 30+ Followers | SMS & Email Verified | 2FA Secured | Profile Photo | USA IP", "24 pcs.", "$2.00"],
  ["Facebook Accounts - Facebook Followers", "41", "Facebook Accounts | 50+ Followers | US Phone & Email Verified | Professional Mode On | 2FA Enabled | Partially Filled profile | Registered from USA IP", "63 pcs.", "$2.30"],
  ["Facebook Accounts - Facebook Followers", "42", "Facebook Accounts | 2010-2024 Aged Accounts | Real Friends 1-1k | Male & Female | Marketplace Activated | Cookies Included (Only Cookies Login) | Globally IP Registered", "701 pcs.", "$2.50"],
  ["Facebook Accounts - Facebook Followers", "43", "Facebook Accounts | 50-100 Followers | US Phone & Email Verified | Professional Mode On | 2FA Enabled | Registered from USA IP", "73 pcs.", "$2.70"],
  ["Facebook Accounts - Facebook Followers", "44", "Facebook Accounts | 100 Followers | Marketplace Enabled | 2FA Enabled | Professional Mode On | SMS & Email Verified | Email Included | Profile & Cover Photo Updated | Registered from USA IP", "199 pcs.", "$3.50"],
  ["Facebook Accounts - Facebook Followers", "45", "Facebook Accounts | 2025-2026 Aged Accounts | Real Friends 2k+ | Male & Female | Marketplace Activated | Cookies Included (Only Cookies Login) | Globally IP Registered", "1 pcs.", "$4.50"],
  # 46-51
  ["Facebook Accounts - UK & Europe Facebook", "46", "UK Facebook Accounts | Marketplace Enabled | 20+ Friends | 2FA Secured | Email Verified | Cookies Included | Profile Photo | UK IP Registered", "1 pcs.", "$1.62"],
  ["Facebook Accounts - UK & Europe Facebook", "47", "UK Facebook Accounts | Marketplace Enabled | 2FA Secured | Email Verified | Cookies Included | Profile Photo | UK IP Registered", "30 pcs.", "$1.62"],
  ["Facebook Accounts - UK & Europe Facebook", "48", "UK Facebook Accounts | Marketplace Enabled | 2FA Secured | Email Verified | Cookies Included | Profile Photo | UK IP Registered", "18 pcs.", "$1.70"],
  ["Facebook Accounts - UK & Europe Facebook", "49", "Facebook Accounts - Portugal | FEMALE | 2FA Enabled | SMS & Email Verified | Email Included | The Profiles Information is Partially Filled | Registered from Portugal IP", "279 pcs.", "$1.70"],
  ["Facebook Accounts - UK & Europe Facebook", "50", "Facebook Accounts - Romania | Marketplace + 2FA Enabled | SMS & Email Verified | Email Included | Profile & Cover Photo | Registered from RO IP", "398 pcs.", "$1.70"],
  ["Facebook Accounts - UK & Europe Facebook", "51", "Facebook Accounts - Spain | Marketplace + 2FA Enabled | SMS & Email Verified | Email Included | Profile & Cover Photo | Registered from ES IP", "285 pcs.", "$1.75"],
]

products = []
for section, no, name_desc, stock_str, price_str in raw_data:
    price = 0.0
    if price_str and price_str.startswith('$'):
        try: price = float(price_str.replace('$', '').replace(',', '').strip())
        except ValueError: price = 0.0
    
    stock = 0
    if stock_str and "pcs" in stock_str:
        try: stock = int(stock_str.replace('pcs.', '').replace('pcs', '').strip())
        except ValueError: stock = 0
    
    desc_lower = name_desc.lower()
    country = "Global"
    if "usa" in desc_lower or "us " in desc_lower or "america" in desc_lower: country = "US"
    elif "uk" in desc_lower or "united kingdom" in desc_lower: country = "UK"
    elif "europe" in desc_lower or "eu " in desc_lower: country = "EU"
    elif "russia" in desc_lower: country = "RU"
    elif "france" in desc_lower or "fr ip" in desc_lower: country = "FR"
    elif "portugal" in desc_lower: country = "PT"
    elif "romania" in desc_lower: country = "RO"
    elif "spain" in desc_lower: country = "ES"

    creation_year = "2024"
    match = re.search(r'(20\d{2})', name_desc)
    if match: creation_year = match.group(1)
        
    is_pva = "sms" in desc_lower or "verified" in desc_lower or "phone" in desc_lower
    has_2fa = "2fa" in desc_lower or "secured" in desc_lower
    has_cookies = "cookies" in desc_lower or "session" in desc_lower
    
    product = {
        "id": f"item-{no}",
        "name": name_desc,
        "platform": "Facebook",
        "category": "social-media-messaging",
        "shortDesc": section,
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
print(f"Generated {len(products)} isolated products based on strict orders!")
