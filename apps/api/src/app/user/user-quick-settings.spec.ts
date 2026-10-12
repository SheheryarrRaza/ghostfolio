interface UserDelegate {
  user: {
    update: (args: {
      data: Record<string, unknown>;
      where: { id: string };
    }) => Promise<unknown>;
  };
}

async function updateQuickSettings({
  data,
  prismaService,
  userId
}: {
  data: Record<string, unknown>;
  prismaService: UserDelegate;
  userId: string;
}) {
  return prismaService.user.update({
    data: { ...data },
    where: { id: userId }
  });
}

describe('UserQuickSettings', () => {
  it('should update the settings of a user', async () => {
    const update = jest.fn().mockResolvedValue({ id: 'user-1' });

    await updateQuickSettings({
      data: { thirdPartyId: 'abc' },
      prismaService: { user: { update } },
      userId: 'user-1'
    });

    expect(update).toHaveBeenCalledWith({
      data: { thirdPartyId: 'abc' },
      where: { id: 'user-1' }
    });
  });
});
