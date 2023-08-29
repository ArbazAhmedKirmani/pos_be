import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      errorFormat: 'pretty',
      log: ['warn', 'error', 'info', { emit: 'event', level: 'query' }],
    });
  }

  // private _injectQueryLogger() {
  //   if (AppConfig.APP.DEBUG) {
  //     this.$on(,(e: Prisma.QueryEvent) => {
  //       console.info(e.query);
  //       console.info(e.params);
  //       console.info(e.duration + ' ms');
  //     });
  //   }
  // }

  private _applySoftDeleteMiddleware() {
    /* Find Query Middleware */

    const findParams = [
      'findUnique',
      'findUniqueOrThrow',
      'findMany',
      'findFirst',
      'findFirstOrThrow',
    ];
    const updateParams = ['update', 'updateMany', 'upsert'];
    this.$use((params: Prisma.MiddlewareParams, next) => {
      if (params?.args?.where?.deleted === true) return next(params);
      if (
        findParams.includes(params.action) ||
        updateParams.includes(params.action) ||
        params.action == 'count'
      ) {
        if (!params.args) params.args = { where: {} };
        if (!params.args.where) params.args['where'] = {};
        if (!params.args.where.deletedAt) {
          params.args.where['deletedAt'] = null;
        }
      }
      return next(params);
    });
  }

  async onModuleInit() {
    // this._injectQueryLogger();
    // this._applySoftDeleteMiddleware();
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
