import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generateRandomStr } from '../utils';
import { UniqueCode } from '@prisma/client';

@Injectable()
export class UniqueCodeService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  private readonly logger = new Logger(UniqueCodeService.name);

  /** 向数据库插入一批唯一码 */
  public async generateCode(num = 10, len = 6) {
    const codesToInsert = new Set<string>();
    while (codesToInsert.size < num) {
      const code = generateRandomStr(len);
      codesToInsert.add(code);
    }

    const uniqueCodes: UniqueCode[] = [];

    const codesArray = Array.from(codesToInsert);
    try {
      await this.prismaService.$transaction(async (tx) => {
        for (const code of codesArray) {
          const existingCode = await tx.uniqueCode.findUnique({
            where: { code },
          });
          if (existingCode) {
            // 如果code存在，则重新生成并插入新的code
            codesToInsert.delete(code);
            codesToInsert.add(generateRandomStr(len));
          } else {
            const uniqueCode = await tx.uniqueCode.create({
              data: { code },
            });
            uniqueCodes.push(uniqueCode);
          }
        }
      });
      return uniqueCodes;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
