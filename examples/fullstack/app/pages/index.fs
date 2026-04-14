export default function Home() {
  return `
    <Screen pad="6" surface="panel">
      <Container>
        <Stack gap="4" pad="6" radius="lg" shadow="soft" surface="card">
          <Text tone="primary" size="sm" weight="semibold">Full-stack starter</Text>
          <Heading size="3xl">FastScript Fullstack</Heading>
          <Text tone="muted" size="lg">Production-style starter with pages, APIs, migrations, queues, and deploy adapters already wired.</Text>
          <Row gap="3">
            <Button tone="primary" href="/docs">Read docs</Button>
            <Button tone="ghost" href="/benchmarks">View benchmarks</Button>
          </Row>
        </Stack>
      </Container>
    </Screen>
  `;
}
