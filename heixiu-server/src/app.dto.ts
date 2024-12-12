import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileDto {
  @ApiProperty({ description: '文件名称' })
  @IsNotEmpty({ message: '文件名不能为空' })
  name: string;

  @ApiProperty({ description: '文件切片', format: 'binary' })
  files: File[];
}

export class WeatherDto {
  @ApiProperty({ description: '城市名称' })
  @IsNotEmpty({ message: '城市名不能为空' })
  city: string;
}

export class UrlDto {
  @ApiProperty({ description: 'url' })
  @IsNotEmpty({ message: 'url不能为空' })
  url: string;
}

export class CodeDto {
  @ApiProperty({ description: 'code' })
  @IsNotEmpty({ message: 'code不能为空' })
  code: string;
}

