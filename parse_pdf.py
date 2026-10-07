import json
import pymupdf
import re
import os

pdf_path = r'C:\Users\callm\.gemini\antigravity-ide\brain\00fdadaf-218b-420d-be5a-aafc64dc8fb8\.user_uploaded\media_1791355979240.pdf'
out_path = r'C:\Users\callm\.gemini\antigravity-ide\scratch\bodia-tech\src\data\pdf_products.json'

doc = pymupdf.open(pdf_path)
products_extracted = []

for page in doc:
    text = page.get_text("text")
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    prices = []
    titles = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check if it's an ID
        if re.match(r'^\d+$', line) and i + 2 < len(lines):
            next_line = lines[i+1]
            next_next = lines[i+2]
            if 'pcs.' in next_line and next_next.startswith('$'):
                prices.append({
                    "no": line,
                    "stock": re.sub(r'[^\d]', '', next_line),
                    "price": next_next.replace('$', '')
                })
                i += 3
                continue
                
        # Check if it's a title (long string with '|')
        if ' | ' in line and len(line) > 20:
            titles.append(line)
            
        i += 1
        
    limit = min(len(prices), len(titles))
    for idx in range(limit):
        p = prices[idx]
        t = titles[idx]
        
        no = p['no']
        stock = p['stock'] or '0'
        price = p['price'] or '0'
        name = t
        
        platform = "Social Media"
        category = "social"
        
        ln = name.lower()
        if 'facebook' in ln or 'fb ' in ln: platform = "Facebook"
        elif 'instagram' in ln or 'ig ' in ln: platform = "Instagram"
        elif 'gmail' in ln or 'google' in ln or 'youtube' in ln: platform = "Google"; category = "email"
        elif 'twitter' in ln or ' x ' in ln: platform = "Twitter"
        elif 'tiktok' in ln: platform = "TikTok"
        elif 'linkedin' in ln: platform = "LinkedIn"
        elif 'discord' in ln: platform = "Discord"; category = "messaging"
        elif 'telegram' in ln: platform = "Telegram"; category = "messaging"
        elif 'whatsapp' in ln: platform = "WhatsApp"; category = "messaging"
        elif 'reddit' in ln: platform = "Reddit"
        elif 'dating' in ln or 'tinder' in ln or 'badoo' in ln: platform = "Dating"; category = "dating"
        
        products_extracted.append({
            "id": f"CAT-{no}-{int(float(price)*100)}",
            "name": name[:150],
            "platform": platform,
            "category": category,
            "shortDesc": name[:80] + "...",
            "fullDesc": name,
            "pricePerUnit": float(price),
            "stockCount": int(stock),
            "minPurchase": 1,
            "maxPurchase": 500,
            "deliveryFormat": "uid:pass:2fa:email:emailpass",
            "deliveryFormatExample": "user:pass:secret:email:epass",
            "imageUrl": "https://images.unsplash.com/photo-1614064641913-a520faff3e01?w=800&auto=format&fit=crop&q=80",
            "attributes": {
                "country": "Mix",
                "creationYear": "2020-2026",
                "isPVA": "sms" in ln or "verified" in ln,
                "has2FA": "2fa" in ln,
                "hasCookies": "cookie" in ln,
                "warmupStatus": "Aged" if "aged" in ln else "Fresh",
                "warrantyHours": 72
            },
            "bulkPricing": []
        })

os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(products_extracted, f, indent=2)

print(f"Extracted {len(products_extracted)} products to {out_path}")
