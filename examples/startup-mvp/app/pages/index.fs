export async function load(ctx) {
  const products = ctx.db.collection("products").all();
  return { products };
}

export default function Home({ products }) {
  const cards = (products || []).map((p) => `
    <Card pad="4" radius="md" surface="card" shadow="soft">
      <Stack gap="2">
        <Heading size="lg">${p.name}</Heading>
        <Text tone="muted">$${p.price}</Text>
        <Row gap="2">
          <Button tone="primary" data-add="${p.id}">Add to cart</Button>
        </Row>
      </Stack>
    </Card>
  `).join("");

  return `
    <Screen pad="6" surface="panel">
      <Container>
        <Stack gap="5">
          <Stack gap="3">
            <Text tone="primary" size="sm" weight="semibold">Startup MVP</Text>
            <Heading size="3xl">Storefront built in .fs</Heading>
            <Text tone="muted" size="lg">Route loader data, API actions, and reusable UI primitives all share one FastScript codebase.</Text>
          </Stack>
          <Grid cols="3" gap="4">${cards}</Grid>
          <Row gap="3">
            <Button tone="ghost" href="/dashboard">Dashboard</Button>
          </Row>
        </Stack>
      </Container>
    </Screen>
  `;
}

export function hydrate({ root }) {
  for (const b of root.querySelectorAll('[data-add]')) {
    b.addEventListener('click', async () => {
      await fetch('/api/cart', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ productId: b.getAttribute('data-add'), qty: 1 })});
      alert('Added to cart');
    });
  }
}
