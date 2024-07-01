import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: (string | Date) | (() => string | Date) | undefined | null) {
    if (!value) return;
    if (typeof value === 'function') {
      value = value();
    }
    const transformedValue = new Date(value);
    if (isNaN(transformedValue.getTime())) {
      throw new BadRequestException('无效的日期');
    }
    return transformedValue;
  }
}
