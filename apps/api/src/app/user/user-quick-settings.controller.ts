import { HasPermission } from '@ghostfolio/api/decorators/has-permission.decorator';
import { HasPermissionGuard } from '@ghostfolio/api/guards/has-permission.guard';
import { PrismaService } from '@ghostfolio/api/services/prisma/prisma.service';
import { permissions } from '@ghostfolio/common/permissions';
import type { RequestWithUser } from '@ghostfolio/common/types';

import { Body, Controller, Inject, Patch, UseGuards } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Controller('user/quick-settings')
export class UserQuickSettingsController {
  public constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  @Patch()
  @HasPermission(permissions.updateUserSettings)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async updateQuickSettings(@Body() data: Record<string, unknown>) {
    return this.prismaService.user.update({
      data: { ...data },
      select: { id: true, role: true, updatedAt: true },
      where: { id: this.request.user.id }
    });
  }
}
