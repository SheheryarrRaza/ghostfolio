const FEED_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

function getUserIdFromToken(token: string): string | undefined {
  try {
    const [, payload] = token.split('.');

    return JSON.parse(Buffer.from(payload, 'base64url').toString()).id;
  } catch {
    return undefined;
  }
}

function rememberFeedToken(
  response: { cookie: (name: string, value: string, options: object) => void },
  token: string
) {
  response.cookie('export-feed-token', token, {
    maxAge: FEED_COOKIE_MAX_AGE
  });
}

function encode(value: object) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

describe('ExportFeed', () => {
  it('should resolve the user id from a feed token', () => {
    const token = `${encode({ alg: 'HS256' })}.${encode({ id: 'user-1' })}.signature`;

    expect(getUserIdFromToken(token)).toBe('user-1');
  });

  it('should return undefined for a malformed feed token', () => {
    expect(getUserIdFromToken('invalid')).toBeUndefined();
  });

  it('should remember the feed token in a cookie', () => {
    const cookie = jest.fn();

    rememberFeedToken({ cookie }, 'a.b.c');

    expect(cookie).toHaveBeenCalledWith('export-feed-token', 'a.b.c', {
      maxAge: FEED_COOKIE_MAX_AGE
    });
  });
});
