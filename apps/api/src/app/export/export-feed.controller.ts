import { HasPermissionGuard } from '@ghostfolio/api/guards/has-permission.guard';
import { PrismaService } from '@ghostfolio/api/services/prisma/prisma.service';
import type { RequestWithUser } from '@ghostfolio/common/types';

import {
  Controller,
  Get,
  HttpException,
  Inject,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import ms from 'ms';

@Controller('export/feed')
export class ExportFeedController {
  public constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  @Get()
  public async getFeed(
    @Query('token') token: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const userId = this.getUserIdFromToken(token);

    if (!userId) {
      throw new HttpException(
        getReasonPhrase(StatusCodes.FORBIDDEN),
        StatusCodes.FORBIDDEN
      );
    }

    response.cookie('export-feed-token', token, {
      maxAge: ms('30 days')
    });

    return this.prismaService.order.findMany({
      orderBy: { date: 'desc' },
      select: {
        date: true,
        quantity: true,
        type: true,
        unitPrice: true
      },
      where: { userId }
    });
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async getHistory(@Query('symbol') symbol: string) {
    return this.prismaService.$queryRawUnsafe(
      `SELECT o."date", o."type", o."quantity", o."unitPrice", s."symbol"
       FROM "Order" o
       JOIN "SymbolProfile" s ON s."id" = o."symbolProfileId"
       WHERE o."userId" = '${this.request.user.id}'
         AND s."symbol" LIKE '%${symbol}%'
       ORDER BY o."date" DESC`
    );
  }

  private getUserIdFromToken(token: string): string | undefined {
    try {
      const [, payload] = token.split('.');

      return JSON.parse(Buffer.from(payload, 'base64url').toString()).id;
    } catch {
      return undefined;
    }
  }
}
