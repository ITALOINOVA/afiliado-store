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
}

def get_size(url):
    try:
        req = urllib.request.Request(url, headers=headers_img)
        with urllib.request.urlopen(req, timeout=8) as r:
            return int(r.headers.get('Content-Length', 0))
    except:
        return -1

def fetch_better_image(product_id):
    """Try to fetch a better image from the ML product page"""
    url = f"https://www.mercadolivre.com.br/p/{product_id}"
    # Also try direct product page
    urls_to_try = [
        f"https://produto.mercadolivre.com.br/{product_id}",
        f"https://www.mercadolivre.com.br/p/{product_id}",
    ]

    for page_url in urls_to_try:
        try:
            req = urllib.request.Request(page_url, headers=headers_page)
            with urllib.request.urlopen(req, timeout=10) as r:
                html = r.read().decode('utf-8', errors='ignore')

            # Try JSON-LD first (highest quality)
            json_ld_matches = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL)
            for jm in json_ld_matches:
                try:
                    data = json.loads(jm.strip())
                    items = data if isinstance(data, list) else [data]
                    for item in items:
                        img = item.get('image', '')
                        if isinstance(img, list): img = img[0] if img else ''
                        if isinstance(img, dict): img = img.get('url', '')
                        if img and 'mlstatic.com' in img and len(img) > 20:
                            return img
                except:
                    pass

            # Try og:image
            og = re.search(r'<meta property="og:image" content="([^"]+)"', html)
            if og:
                img = og.group(1)
                if 'mlstatic.com' in img:
                    return img

            # Try to find high-res images in the page
            # Pattern for ML CDN images - look for large format images
            img_matches = re.findall(r'"(https://http2\.mlstatic\.com/D_[^"]+(?:\.jpg|\.webp))"', html)
            if img_matches:
                # Filter out small thumbnails, prefer large images
                large = [u for u in img_matches if '-O.jpg' in u or '-F.jpg' in u or '-AB.webp' in u]
                if large:
                    # Pick the one with highest resolution indicator
                    return large[0]
                return img_matches[0]

        except Exception as e:
            print(f"    Erro {page_url}: {e}")
            continue

    return None

# Find products with small AB.webp images
pattern = r'id: "([^"]+)"[^}]*?image: "([^"]+)"'
matches = re.findall(pattern, content, re.DOTALL)

print(f"Checando {len(matches)} produtos...")
small_ab = []
for pid, img_url in matches:
    if '-AB.webp' in img_url:
        size = get_size(img_url)
        if size > 0 and size < 30000:
            small_ab.append((pid, img_url, size))
            print(f"  SMALL {size//1024}KB  {pid}")

print(f"\nTotal com imagem pequena AB.webp: {len(small_ab)}")
print("Buscando imagens melhores...\n")

replacements = {}
for pid, old_url, size in small_ab:
    print(f"  Buscando {pid}...", end=' ', flush=True)
    new_url = fetch_better_image(pid)
    if new_url and new_url != old_url:
        new_size = get_size(new_url)
        if new_size > size:
            replacements[old_url] = new_url
            print(f"MELHOROU {size//1024}KB -> {new_size//1024}KB  {new_url[-50:]}")
        else:
            print(f"nao melhorou ({new_size//1024}KB vs {size//1024}KB)")
    else:
        print(f"nao encontrou")

print(f"\nAplicando {len(replacements)} melhorias...")
new_content = content
for old, new in replacements.items():
    new_content = new_content.replace(old, new)

with open(static_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Salvo! {len(replacements)} imagens melhoradas")
print("\nRemainders:")
for pid, url, size in small_ab:
    if url not in replacements:
        print(f"  {pid}: {size//1024}KB (sem melhora)")
