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

def try_variants(url):
    """Try different URL variants to find a larger image"""
    base = 'https://http2.mlstatic.com/'
    candidates = []

    # Parse the current URL
    # Format: https://http2.mlstatic.com/D_Q_NP_2X_618375-MLB99255221882_112025-AB.webp
    # or:     https://http2.mlstatic.com/D_NQ_NP_2X_618375-MLB99255221882_112025-O.jpg

    # Extract the image ID part (the numbers)
    m = re.search(r'/(D_[^/]+)$', url)
    if not m:
        return None, 0

    img_part = m.group(1)

    # Extract just the number part (e.g., 618375-MLB99255221882_112025)
    num_m = re.search(r'D_[^_]+_(?:2X_)?(\d+-\w+-\w+)-', img_part)
    if not num_m:
        return None, 0

    num_part = num_m.group(1)

    # Build candidate URLs with different quality/format variants
    prefixes = ['D_NQ_NP_2X_', 'D_NQ_NP_', 'D_Q_NP_2X_', 'D_Q_NP_']
    suffixes = ['-O.jpg', '-F.jpg', '-AB.webp', '-B.jpg', '-V.jpg']

    for prefix in prefixes:
        for suffix in suffixes:
            candidate = f"{base}{prefix}{num_part}{suffix}"
            if candidate != url:
                candidates.append(candidate)

    best_url = None
    best_size = get_size(url)

    for c in candidates[:20]:  # Limit to 20 attempts per product
        sz = get_size(c)
        if sz > best_size:
            best_size = sz
            best_url = c
            print(f"    BETTER: {sz//1024}KB  {c[-60:]}")

    return best_url, best_size

# Find products with small AB.webp images
pattern = r'id: "([^"]+)"[^}]*?image: "([^"]+)"'
matches = re.findall(pattern, content, re.DOTALL)

small_ab = []
for pid, img_url in matches:
    if '-AB.webp' in img_url:
        size = get_size(img_url)
        if size > 0 and size < 30000:
            small_ab.append((pid, img_url, size))

print(f"Tentando melhorar {len(small_ab)} imagens pequenas...\n")

replacements = {}
for pid, old_url, orig_size in small_ab:
    print(f"  {pid} ({orig_size//1024}KB)...")
    new_url, new_size = try_variants(old_url)
    if new_url:
        replacements[old_url] = new_url
        print(f"  -> MELHOROU: {new_size//1024}KB")
    else:
        print(f"  -> sem melhora (max testado)")

print(f"\nAplicando {len(replacements)} melhorias...")
new_content = content
for old, new in replacements.items():
    new_content = new_content.replace(old, new)

with open(static_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Salvo! {len(replacements)} imagens melhoradas")
