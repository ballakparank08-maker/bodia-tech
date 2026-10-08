import json
import re

with open('pdf_out.json', 'r', encoding='utf-16') as f:
    data = json.load(f)

products = []
current_section = None
for row in data:
    # A row looks like: [null, "1", "Facebook Accounts | ...", "1 pcs.", "$1.10", ""]
    # or [null, "Facebook Accounts - USA Facebook", null, null, null, ""]
    if row[1] and not row[2]:
        current_section = row[1].strip()
        continue
    
    # We only care about Facebook sections (1 to 109 based on the prompt OCR)
    if current_section and "Facebook" in current_section:
        if row[1] and row[2]:
            no = row[1]
            if no == "No" or not no.isdigit():
                continue
            
            name_desc = row[2]
            stock_str = row[3]
            price_str = row[4]
            
            # Parse price
            price = 0.0
            if price_str and price_str.startswith('$'):
                try:
                    price = float(price_str.replace('$', '').replace(',', '').strip())
                except ValueError:
                    price = 0.0
            
            # Parse stock
            stock = 0
            if stock_str and "pcs." in stock_str:
                try:
                    stock = int(stock_str.replace('pcs.', '').strip())
                except ValueError:
                    stock = 0
            
            # Platform is Facebook
            platform = "Facebook"
            if "Dating" in name_desc:
                platform = "Tinder" # Or Facebook Dating doesn't matter, we just use Facebook
            
            product = {
                "id": f"fb-{no}",
                "title": current_section,
                "description": name_desc.strip(),
                "price": price,
                "tier": "social-media-messaging",
                "platform": "Facebook",
                "stock": stock,
                "inStock": stock > 0,
                "features": ["Instant Delivery", "Checked before sale"]
            }
            products.append(product)

import textwrap

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
