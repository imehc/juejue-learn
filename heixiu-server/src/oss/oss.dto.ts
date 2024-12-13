import { PickType } from '@nestjs/swagger';
import { FileDto } from 'src/app.dto';

export class OssQueryDto extends PickType(FileDto, ['name']) {}
