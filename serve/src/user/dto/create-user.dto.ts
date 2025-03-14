import { ApiProperty } from '@nestjs/swagger';
import { VRequired, VString, VNumber } from 'src/common/validation.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: '姓名',
  })
  @VRequired()
  @VString()
  name: string;

  @ApiProperty({
    description: '年龄',
  })
  @VNumber({ max: 100 })
  age: number;
}
