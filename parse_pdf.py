import pdfplumber
import json
import sys

pdf_path = r"C:\Users\callm\.gemini\antigravity-ide\brain\d17955a4-b2a3-49b7-9e4f-b2021c1a1c92\.user_uploaded\media_1791411266998.pdf"

results = []
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        table = page.extract_table()
        if table:
            for row in table:
                results.append(row)

print(json.dumps(results, indent=2))
