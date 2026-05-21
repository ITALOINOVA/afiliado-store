import re, urllib.request, json

static_file = r"C:\Users\italo\OneDrive\Documentos\fluxos\afiliado-store\src\lib\static-data.ts"

with open(static_file, encoding='utf-8') as f:
    content = f.read()

headers_img = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.mercadolivre.com.br/',
}
headers_page = {
    'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9',
}

def get_size(url):
    try:
        req = urllib.request.Request(url, headers=headers_img)
        with urllib.request.urlopen(req, timeout=8) as r:
            return int(r.headers.get('Content-Length', 0))
    except:
        return -1

def fetch_image_from_page(page_url):
    """Fetch a product page and extract the best image URL"""
    try:
        req = urllib.request.Request(page_url, headers=headers_page)
        with urllib.request.urlopen(req, timeout=15) as r:
            html = r.read().decode('utf-8', errors='ignore')

        # 1. Try JSON-LD
        json_ld_matches = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL)
        for jm in json_ld_matches:
            try:
                data = json.loads(jm.strip())
                items = data if isinstance(data, list) else [data]
                for item in items:
                    # Try offers.image
                    for offer in item.get('offers', [item]):
                        if isinstance(offer, dict):
                            img = offer.get('image', '')
                            if isinstance(img, list): img = img[0] if img else ''
                            if isinstance(img, dict): img = img.get('url', '')
                            if img and 'mlstatic.com' in img: return img
                    # Direct image
                    img = item.get('image', '')
                    if isinstance(img, list): img = img[0] if img else ''
                    if isinstance(img, dict): img = img.get('url', '')
                    if img and 'mlstatic.com' in img: return img
            except:
                pass

        # 2. Try og:image
        og = re.search(r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"', html)
        if og:
            img = og.group(1)
            if 'mlstatic.com' in img:
                return img

        # 3. Try to find product images in JSON data embedded in page
        # Look for "picture" arrays in script tags
        pic_matches = re.findall(r'"url"\s*:\s*"(https://http2\.mlstatic\.com/D_[^"]+)"', html)
        if pic_matches:
            # Find largest
            best = None
            best_sz = 0
            for url in pic_matches[:20]:
                sz = get_size(url)
                if sz > best_sz:
                    best_sz = sz
                    best = url
            return best

        return None
    except Exception as e:
        return None

# Find products with small AB.webp images and their buyLinks
pattern_block = r'\{\s*id: "([^"]+)"[^}]*?image: "([^"]+)"[^}]*?buyLink: "([^"]+)"[^}]*?\}'
matches = re.findall(pattern_block, content, re.DOTALL)

small_ab = []
for pid, img_url, buy_link in matches:
    if '-AB.webp' in img_url:
        size = get_size(img_url)
        if size > 0 and size < 30000:
            small_ab.append((pid, img_url, size, buy_link))

print(f"Buscando imagens via pages para {len(small_ab)} produtos pequenos...\n")

replacements = {}
for pid, old_url, orig_size, buy_link in small_ab:
    # Extract just the base page URL without affiliate params
    base_url = re.sub(r'\?.*', '', buy_link)
    print(f"  {pid} ({orig_size//1024}KB) -> {base_url[:80]}", end=' ', flush=True)

    new_url = fetch_image_from_page(base_url)
    if new_url and new_url != old_url:
        new_size = get_size(new_url)
        if new_size > orig_size:
            replacements[old_url] = new_url
            print(f"-> {new_size//1024}KB MELHOROU!")
        else:
            print(f"-> {new_size//1024}KB (nao melhorou)")
    else:
        print("-> sem imagem")

print(f"\nAplicando {len(replacements)} melhorias...")
new_content = content
for old, new in replacements.items():
    new_content = new_content.replace(old, new)

with open(static_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Salvo! {len(replacements)} imagens melhoradas")
