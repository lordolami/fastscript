export default function Home() {
  return `
    <Screen pad="6" surface="panel">
      <Container>
        <Stack gap="6">
          <div class="saas-chip">Reference app - Team dashboard SaaS</div>

          <div class="hero-grid">
            <Card pad="5" radius="lg" surface="card" shadow="soft">
              <Stack gap="4">
                <Text tone="primary" size="sm" weight="semibold">FastScript startup reference</Text>
                <Heading size="3xl">Run a team dashboard, billing flow, jobs, and admin ops in one runtime.</Heading>
                <Text tone="muted" size="lg">This is the first real product-shaped FastScript app: public marketing, authenticated workspace, projects, teammate invites, billing, notification jobs, and admin review paths all in <code>.fs</code>.</Text>
                <div class="inline-actions">
                  <a class="btn-inline" href="/sign-in">Create workspace</a>
                  <a class="btn-inline btn-secondary" href="/dashboard">Open dashboard</a>
                </div>
              </Stack>
            </Card>

            <Card pad="5" radius="lg" surface="card" shadow="soft">
              <Stack gap="3">
                <Heading size="xl">What this app proves</Heading>
                <div class="detail-list">
                  <div>
                    <div class="detail-label">Frontend</div>
                    <div class="detail-value">Marketing + dashboard routes</div>
                  </div>
                  <div>
                    <div class="detail-label">Backend</div>
                    <div class="detail-value">Workspace, projects, billing APIs</div>
                  </div>
                  <div>
                    <div class="detail-label">Jobs</div>
                    <div class="detail-value">Receipt + notification queue flow</div>
                  </div>
                  <div>
                    <div class="detail-label">Deploy</div>
                    <div class="detail-value">Cloudflare-first adapter</div>
                  </div>
                </div>
              </Stack>
            </Card>
          </div>

          <div class="metric-grid">
            <div class="metric-card">
              <Text tone="muted" size="sm">Workspaces</Text>
              <Heading size="2xl">Create one in sign-in</Heading>
              <Text tone="muted">The login flow creates a workspace and owner membership so the dashboard can start with real product state.</Text>
            </div>
            <div class="metric-card">
              <Text tone="muted" size="sm">Core records</Text>
              <Heading size="2xl">Projects</Heading>
              <Text tone="muted">Track active work, client ownership, and delivery status from the same app boundary as your billing and settings flows.</Text>
            </div>
            <div class="metric-card">
              <Text tone="muted" size="sm">Revenue path</Text>
              <Heading size="2xl">Plans + invoices</Heading>
              <Text tone="muted">Upgrade a workspace plan, emit invoices, and enqueue receipts and notification jobs without leaving FastScript.</Text>
            </div>
          </div>

          <div class="info-grid">
            <Card pad="4" radius="md" surface="card">
              <Stack gap="2">
                <Heading size="lg">Small-team SaaS shape</Heading>
                <Text tone="muted">Best for startups and internal product teams that want one workspace, teammates, project tracking, and simple billing in an MVP footprint.</Text>
              </Stack>
            </Card>
            <Card pad="4" radius="md" surface="card">
              <Stack gap="2">
                <Heading size="lg">Governed compatibility</Heading>
                <Text tone="muted">This app is meant to consume the existing FastScript product contract, not invent a new one. Real gaps become support-matrix work.</Text>
              </Stack>
            </Card>
            <Card pad="4" radius="md" surface="card">
              <Stack gap="2">
                <Heading size="lg">Cloudflare first</Heading>
                <Text tone="muted">The MVP deploy target is Cloudflare, but the app remains inside the standard FastScript deployment surface for Node and Vercel too.</Text>
              </Stack>
            </Card>
          </div>
        </Stack>
      </Container>
    </Screen>
  `;
}
