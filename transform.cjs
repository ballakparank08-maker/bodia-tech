const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'initialProducts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Use regex to get the array literal
const arrayMatch = content.match(/export const INITIAL_PRODUCTS: AccountProduct\[\] = (\[[\s\S]*\]);/);
if (!arrayMatch) {
  console.error("Could not find array");
  process.exit(1);
}

let products;
try {
  // Use eval to parse the JS object literal (safe since we control it)
  products = eval(arrayMatch[1]);
} catch (e) {
  console.error("Failed to parse array:", e);
  process.exit(1);
}

const transformed = products.map(p => {
  return {
    id: p.id,
    name: p.title || p.name,
    platform: p.platform || "Facebook",
    category: p.tier || p.category || "Social Media",
    shortDesc: (p.description || p.shortDesc || "").substring(0, 100) + "...",
    fullDesc: p.description || p.fullDesc || "",
    pricePerUnit: p.price || p.pricePerUnit || 0,
    stockCount: p.stock !== undefined ? p.stock : (p.stockCount !== undefined ? p.stockCount : 0),
    minPurchase: 1,
    maxPurchase: p.stock !== undefined ? p.stock : (p.stockCount !== undefined ? p.stockCount : 100),
    deliveryFormat: "username:password:2fa:email:emailpass",
    deliveryFormatExample: "john_doe:Pass123!:MNO...:john@email.com:MailPass123",
    attributes: {
      country: (p.description || "").includes("USA") ? "US" : "Global",
      creationYear: "2023",
      isPVA: (p.description || "").includes("SMS") || (p.description || "").includes("Verified"),
      has2FA: (p.description || "").includes("2FA"),
      hasCookies: (p.description || "").includes("Cookies"),
      warmupStatus: "Standard",
      warrantyHours: 24
    },
    bulkPricing: []
  };
});

const newContent = `import { AccountProduct, SupportConfig, UserProfile } from '../types/index.ts';

export const INITIAL_PRODUCTS: AccountProduct[] = ${JSON.stringify(transformed, null, 2)};
`;

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log("Transformed successfully");
