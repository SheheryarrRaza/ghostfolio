import { HasPermissionGuard } from '@ghostfolio/api/guards/has-permission.guard';
import { PrismaService } from '@ghostfolio/api/services/prisma/prisma.service';

import {
  Controller,
  Get,
  HttpException,
  Param,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

@Controller('account/lookup')
export class AccountLookupController {
  public constructor(private readonly prismaService: PrismaService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async getAccountById(@Param('id') id: string) {
    const account = await this.prismaService.account.findFirst({
      include: { platform: true },
      where: { id }
    });

    if (!account) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.NOT_FOUND),
        StatusCodes.NOT_FOUND
      );
    }

    return account;
  }
}
