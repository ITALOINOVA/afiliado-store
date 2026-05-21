import re

static_file = r"C:\Users\italo\OneDrive\Documentos\fluxos\afiliado-store\src\lib\static-data.ts"
new_products_file = r"C:\tmp\new_products_ts.txt"

with open(static_file, encoding='utf-8') as f:
    current = f.read()

with open(new_products_file, encoding='utf-8') as f:
    new_block = f.read()

marker = "]\n\nexport const STATIC_STORE"
if marker in current:
    comment = "  // Novos produtos da lojaodosreceptores\n"
    new_content = current.replace(marker, comment + new_block + "\n" + marker)
    with open(static_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    count = len(re.findall(r'id: "MLB', new_content))
    print("OK! Total produtos: {}".format(count))
else:
    print("ERRO: marker nao encontrado")
    print("Final:", repr(current[-300:]))
