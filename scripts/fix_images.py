import re, urllib.request

static_file = r"C:\Users\italo\OneDrive\Documentos\fluxos\afiliado-store\src\lib\static-data.ts"

with open(static_file, encoding='utf-8') as f:
    content = f.read()

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.mercadolivre.com.br/',
}

def test_url(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as r:
            return r.status == 200, int(r.headers.get('Content-Length', 0))
    except:
        return False, 0

# Atualizar todas as imagens D_NQ_NP_ para D_NQ_NP_2X_ (melhor qualidade)
# Mas verificar se 2X existe antes de trocar
all_images = re.findall(r'(https://http2\.mlstatic\.com/D_NQ_NP_[^"]+)', content)
replacements = {}

print("Verificando {} imagens para upgrade 2X...".format(len(all_images)))

for img_url in all_images:
    if img_url in replacements:
        continue
    url_2x = img_url.replace("D_NQ_NP_", "D_NQ_NP_2X_")
    if url_2x == img_url:
        continue

    ok_2x, size_2x = test_url(url_2x)
    ok_orig, size_orig = test_url(img_url)

    if ok_2x and size_2x > size_orig:
        replacements[img_url] = url_2x
        print("  UPGRADE {} ({} -> {}b)".format(img_url[-50:], size_orig, size_2x))
    elif ok_2x:
        replacements[img_url] = url_2x
        print("  UPGRADE (same size) {}".format(img_url[-50:]))
    else:
        print("  SKIP (2X falhou) {}".format(img_url[-50:]))

print("\nAplicando {} upgrades...".format(len(replacements)))
new_content = content
for old, new in replacements.items():
    new_content = new_content.replace(old, new)

with open(static_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Salvo! {} imagens melhoradas".format(len(replacements)))
