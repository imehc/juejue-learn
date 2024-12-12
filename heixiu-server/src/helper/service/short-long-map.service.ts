import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UniqueCodeStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UniqueCodeService } from './unique-code.service';

@Injectable()
export class ShortLongMapService {
  private readonly logger = new Logger();

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(UniqueCodeService)
  private uniqueCodeService: UniqueCodeService;

  /** 生成短链接和长链接的映射 */
  public async generate(longUrl: string) {
    let uniqueCode = await this.prismaService.uniqueCode.findFirst({
      where: { status: UniqueCodeStatus.UNUSED },
    });
    try {
      if (!uniqueCode) {
        uniqueCode = (await this.uniqueCodeService.generateCode(1)).at(0);
      }
      await this.prismaService.$transaction([
        this.prismaService.shortLongMap.create({
          data: { shortUrl: uniqueCode.code, longUrl },
        }),
        this.prismaService.uniqueCode.update({
          where: { id: uniqueCode.id },
          data: { status: UniqueCodeStatus.USED },
        }),
      ]);
      return uniqueCode.code;
    } catch (error) {
      this.logger.error(error, ShortLongMapService.name);
    }
  }

  /** 获取短链接对应的长链接  */
  public async getLongUrl(shortUrl: string) {
    const shortLongMap = await this.prismaService.shortLongMap.findFirst({
      where: { shortUrl },
      select: { longUrl: true, shortUrl: true },
    });
    if (!shortLongMap) {
      throw new BadRequestException('该短链不存在');
    }
    // TODO: 短时间内不再统计访问次数
    await this.prismaService.shortLongMap.update({
      where: { shortUrl: shortLongMap.shortUrl },
      data: {
        visitCount: { increment: 1 },
      },
    });
    return shortLongMap.longUrl;
  }
}
