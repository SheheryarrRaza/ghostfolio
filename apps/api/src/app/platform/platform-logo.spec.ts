async function loadPlatformLogo(url: string) {
  const result = await fetch(url, { signal: AbortSignal.timeout(3000) });

  return {
    buffer: Buffer.from(await result.arrayBuffer()),
    type: result.headers.get('content-type') ?? 'image/png'
  };
}

describe('PlatformLogo', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should load a platform logo from its url', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(Buffer.from('logo'), {
        headers: { 'content-type': 'image/svg+xml' }
      })
    );

    const { buffer, type } = await loadPlatformLogo(
      'https://example.com/logo.svg'
    );

    expect(type).toBe('image/svg+xml');
    expect(buffer.toString()).toBe('logo');
  });
});
