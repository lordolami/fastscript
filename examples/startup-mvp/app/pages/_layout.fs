export default function Layout({ content }) {
  return `
    <Screen surface="plain">
      <Container>
        <Stack gap="5" pad="6">
          ${content}
        </Stack>
      </Container>
    </Screen>
  `;
}
