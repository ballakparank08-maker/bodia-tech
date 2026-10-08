import json

facebook_data = [
  [
    "",
    "Facebook Accounts - USA Facebook",
    None,
    None,
    None,
    ""
  ],
  [
    None,
    "1",
    "FB Accounts | Verified by e-mail, there is no email in the set. Male or female. The account profiles may be empty or have limited entries such as photos and other information. 2FA included. Cookies",
    "1 pcs.",
    "$1.10",
    ""
  ],
  [
    None,
    "2",
    "Facebook Accounts | USA | Marketplace + Cookies Included | SMS & Email Verified | Email Included | 2FA Enabled | Registered from USA IP",
    "1133 pcs.",
    "$1.25",
    ""
  ],
  [
    None,
    "3",
    "Facebook Accounts | Email Included | Male & Female | 2FA Included | Profile & Cover Photo | USA IP Registered",
    "266 pcs.",
    "$1.30",
    ""
  ],
  [
    None,
    "4",
    "Facebook Accounts | USA | 2FA Enabled | USA SMS & Email Verified | Profile & Cover Photo Fully Filled | Registered from USA IP (No Cookies)",
    "159 pcs.",
    "$1.40",
    ""
  ],
  [
    None,
    "5",
    "Facebook Accounts | USA | Marketplace Enabled | The Accounts are Verified by SMS | Email Included | 2FA Enabled | The Profiles Information is Partially Filled | Registered from USA IP",
    "846 pcs.",
    "$1.50",
    ""
  ],
  [
    None,
    "6",
    "Facebook Accounts | USA | Marketplace + 2FA Enabled | SMS & Email Verified | Email Included | Male & Female | Registered from USA IP",
    "1333 pcs.",
    "$1.70",
    ""
  ],
  [
    "",
    "Facebook Accounts - Facebook With Page",
    None,
    None,
    None,
    ""
  ],
  [
    None,
    "7",
    "Facebook Page Accounts | 01-10 Real Friends | Page Activated | Email Verified & Included | 2FA Included | With Profile Picture | USA IP Registered",
    "6 pcs.",
    "$2.50",
    ""
  ],
  [
    None,
    "8",
    "Facebook Account With Page | SMS & Email Verified | Email Included | 2FA Enabled | Mix IP Registered",
    "16 pcs.",
    "$2.50",
    ""
  ],
  [
    None,
    "9",
    "Facebook Account With Page | No Followers | SMS & Email Verified | Email Included | 2FA Enabled | USA IP Registered",
    "14 pcs.",
    "$2.50",
    ""
  ],
  [
    None,
    "10",
    "Facebook Account With Page | Profile + Cover Photo Added | SMS & Email Verified | Email Included | 2FA + Cookies Included | Mixed IPs",
    "206 pcs.",
    "$3.00",
    ""
  ],
  [
    None,
    "11",
    "Facebook Account With Page | SMS & Email Verified | Email Included | 2FA Enabled | With Profile Picture | Cookies | Mixed IP Registered",
    "12 pcs.",
    "$3.10",
    ""
  ],
  [
    None,
    "12",
    "Facebook Account With Page | SMS & Email Verified | Email Included | 2FA Enabled | Cookies | Mixed IP Registered",
    "2 pcs.",
    "$3.30",
    ""
  ],
  [
    "",
    "Facebook Accounts - Facebook With Friends",
    None,
    None,
    None,
    ""
  ],
  [
    None,
    "13",
    "Facebook Accounts | 30–100 Real Friends | Outlook/Hotmail Email Verified & Included | Male & Female | 2FA Included | Profile Photo Uploaded | Random IP Registered",
    "206 pcs.",
    "$1.40",
    ""
  ],
  [
    None,
    "14",
    "France Facebook Accounts | 30+ Friends | Outlook/Hotmail Verified | Male & Female | 2FA & Profile Photo | FR IP",
    "201 pcs.",
    "$1.40",
    ""
  ],
  [
    None,
    "15",
    "USA Facebook Accounts | 30 Friends | Outlook/Hotmail Verified | Avatar Added | Cookies & 2FA Included | USA IP",
    "37 pcs.",
    "$2.00",
    ""
  ],
  [
    None,
    "16",
    "Facebook Accounts | 2019-2024 Aged Accounts | Real Friends 1-1k | Male & Female | Marketplace Activated | Cookies Included (Only Cookies Login) | Globally IP Registered",
    "731 pcs.",
    "$2.10",
    ""
  ],
  [
    None,
    "17",
    "FB Accounts | Number of friends 50+ (friends and followers). Verified by email@outlook.com/hotmail.com, email included. Female. The profiles information is partially filled. 2FA in the set.",
    "690 pcs.",
    "$2.50",
    ""
  ],
  [
    None,
    "18",
    "Facebook Accounts | 30+ Real Friends | Female | SMS and Email Verified & Included | 2FA + Cookies Included | Avatar Added | Registered From USA IP",
    "85 pcs.",
    "$2.50",
    ""
  ]
]

with open('pdf_out.json', 'r', encoding='utf-16le') as f:
    try:
        data = json.load(f)
    except:
        with open('pdf_out.json', 'r', encoding='utf-16') as f2:
            data = json.load(f2)

# Insert the facebook data right after the header rows
new_data = data[:2] + facebook_data + data[2:]

with open('pdf_out.json', 'w', encoding='utf-16le') as f:
    json.dump(new_data, f, indent=2)

print("Facebook data added to pdf_out.json")
