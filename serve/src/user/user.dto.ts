import { ApiProperty } from '@nestjs/swagger';
import { VNumber, VRequired, VString } from 'src/common/validation.decorator';

export class UserDto {
  id: number;

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
