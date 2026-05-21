import re, urllib.request

static_file = r"C:\Users\italo\OneDrive\Documentos\fluxos\afiliado-store\src\lib\static-data.ts"

with open(static_file, encoding='utf-8') as f:
    content = f.read()

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.mercadolivre.com.br/',
}

def get_size(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as r:
            return int(r.headers.get('Content-Length', 0))
    except:
        return -1

# Find all product blocks with id and image
pattern = r'id: "([^"]+)"[^}]*?image: "([^"]+)"'
matches = re.findall(pattern, content, re.DOTALL)

print(f"Total produtos: {len(matches)}")
small_products = []

for pid, img_url in matches:
    size = get_size(img_url)
    if size >= 0 and size < 30000:
        small_products.append((pid, img_url, size))
        print(f"  SMALL {size}b  {pid}  {img_url[-60:]}")

print(f"\nTotal imagens pequenas (<30KB): {len(small_products)}")
for pid, url, size in small_products:
    print(f"  {pid}: {size}b")
