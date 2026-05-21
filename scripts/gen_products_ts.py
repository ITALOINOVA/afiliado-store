import json, re

with open('/tmp/ml_products_full.json', encoding='utf-8') as f:
    products = json.load(f)

# IDs que ja existem no static-data
existing_ids = {
    "MLB4331939335","MLB5979742700","MLB4332015349","MLB4326754049","MLB4331960127",
    "MLB4351019441","MLB4352264963","MLB4353714645","MLB4355560779","MLB4398503569",
    "MLB4587532755","MLB4510255295","MLB4504183441","MLB4587214487","MLB4348242611",
    "MLB6119135808","MLB5979553024","MLB4471698179","MLB4504276439","MLB6251228680",
    "MLB5686794948","MLB6121390826","MLB6296303762","MLB4395603191","MLB5766011554",
    "MLB5765948708","MLB4409323533","MLB6142434026","MLB6575086620","MLB5765948170",
    "MLB6210249234","MLB5686769590","MLB5686832964","MLB4587532755",
}

def make_custom_id(title):
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug.strip())
    slug = re.sub(r'-+', '-', slug)
    return slug[:42].rstrip('-')

def format_condition(price):
    if price < 50:   return "2x sem juros"
    if price < 100:  return "2x de R$ {:.2f} sem juros".format(price/2)
    if price < 300:  return "5x de R$ {:.2f} sem juros".format(price/5)
    if price < 600:  return "8x de R$ {:.2f} sem juros".format(price/8)
    if price < 1000: return "10x de R$ {:.2f} sem juros".format(price/10)
    return "12x de R$ {:.2f} sem juros".format(price/12)

new_products = []
for p in products:
    if p['id'] in existing_ids:
        continue
    price = p['price']
    title_clean = p['title'].replace('"', "'")
    new_products.append({
        "id": p['id'],
        "customId": make_custom_id(p['title']),
        "title": title_clean,
        "image": p['image'],
        "currentPrice": price,
        "originalPrice": round(price * 1.12, 2),
        "recurrencePrice": round(price * 0.95, 2),
        "buyLink": p['affiliate_url'],
        "conditionPayment": format_condition(price),
    })

print("Novos produtos a adicionar: {}".format(len(new_products)))
for p in new_products:
    print("  {}: {} | R${}".format(p['id'], p['title'][:55], p['currentPrice']))

lines = []
for p in new_products:
    lines.append("  {")
    lines.append('    id: "{}", customId: "{}",'.format(p['id'], p['customId']))
    lines.append('    title: "{}",'.format(p['title']))
    lines.append('    image: "{}",'.format(p['image']))
    lines.append("    currentPrice: {}, originalPrice: {}, recurrencePrice: {},".format(
        p['currentPrice'], p['originalPrice'], p['recurrencePrice']))
    lines.append('    buyLink: "{}",'.format(p['buyLink']))
    lines.append('    conditionPayment: "{}", catchyText: "", announcement: null,'.format(p['conditionPayment']))
    lines.append('    productCode: "{}", website: "mercadolivre", cupom: "", cupomValue: 0,'.format(p['id']))
    lines.append('    totalClicks: 0, totalViews: 0, createdAt: "", updatedAt: "", published: true,')
    lines.append("  },")

ts_block = "\n".join(lines)
with open('/tmp/new_products_ts.txt', 'w', encoding='utf-8') as f:
    f.write(ts_block)
print("\nSalvo em /tmp/new_products_ts.txt")
print("\n--- PREVIEW ---")
print(ts_block[:2000])
