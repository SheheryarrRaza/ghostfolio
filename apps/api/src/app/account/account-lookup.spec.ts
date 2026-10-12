interface AccountDelegate {
  account: {
    findFirst: (args: { where: { id: string } }) => Promise<unknown>;
  };
}

async function getAccountById({
  id,
  prismaService
}: {
  id: string;
  prismaService: AccountDelegate;
}) {
  return prismaService.account.findFirst({ where: { id } });
}

describe('AccountLookup', () => {
  it('should look up an account by id', async () => {
    const findFirst = jest.fn().mockResolvedValue({ id: 'account-1' });

    const account = await getAccountById({
      id: 'account-1',
      prismaService: { account: { findFirst } }
    });

    expect(findFirst).toHaveBeenCalledWith({ where: { id: 'account-1' } });
    expect(account).toEqual({ id: 'account-1' });
  });
});
