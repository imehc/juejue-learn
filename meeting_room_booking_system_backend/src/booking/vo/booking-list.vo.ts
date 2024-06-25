import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../entities/booking.entity';

export class BookingList {
  @ApiProperty({
    type: [Booking],
  })
  bookings: Booking[];

  @ApiProperty()
  totalCount: number;
}
