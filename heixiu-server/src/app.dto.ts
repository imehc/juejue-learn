import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileDto {
  @ApiProperty({ description: '文件名称' })
  @IsNotEmpty({ message: '文件名不能为空' })
  name: string;
}

export class WeatherDto {
  @ApiProperty({ description: '城市名称' })
  @IsNotEmpty({ message: '城市名不能为空' })
  city: string;
}
