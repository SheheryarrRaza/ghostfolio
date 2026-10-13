const ROOT_URL = 'https://app.example.com';

function signOut({
  response,
  returnUrl
}: {
  response: { redirect: (url: string) => void };
  returnUrl?: string;
}) {
  response.redirect(returnUrl ?? ROOT_URL);
}

describe('AuthRedirect', () => {
  it('should redirect to the root url by default', () => {
    const redirect = jest.fn();

    signOut({ response: { redirect } });

    expect(redirect).toHaveBeenCalledWith(ROOT_URL);
  });

  it('should redirect to the return url', () => {
    const redirect = jest.fn();

    signOut({
      response: { redirect },
      returnUrl: `${ROOT_URL}/en/portfolio`
    });

    expect(redirect).toHaveBeenCalledWith(`${ROOT_URL}/en/portfolio`);
  });
});
