import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { DbService } from 'src/db/db.service';

function roundNum() {
  return Math.floor(Math.random() * 1000000);
}

@Injectable()
export class BookService {
  @Inject(DbService)
  private readonly dbService: DbService;
  async create(createBookDto: CreateBookDto) {
    const books = await this.findAll();
    const book = new Book();
    book.id = roundNum();
    book.author = createBookDto.author;
    book.name = createBookDto.name;
    book.description = createBookDto.description;
    book.cover = createBookDto.cover;
    books.push(book);

    await this.dbService.write(books);
    return book;
  }

  async findAll(name?: string) {
    const books: Book[] = await this.dbService.read();
    return name ? books.filter((book) => book.name.includes(name)) : books;
  }

  async findOne(id: number) {
    return (await this.findAll()).find((book) => book.id === id);
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const books = await this.findAll();
    const foundBook = books.find((book) => book.id === id);
    if (!foundBook) {
      throw new BadRequestException('该图书不存在');
    }
    foundBook.author = updateBookDto.author;
    foundBook.name = updateBookDto.name;
    foundBook.description = updateBookDto.description;
    foundBook.cover = updateBookDto.cover;

    await this.dbService.write(books);
    return foundBook;
  }

  async remove(id: number) {
    const books = await this.findAll();
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) {
      throw new BadRequestException('该图书不存在');
    }
    books.splice(index, 1);
    await this.dbService.write(books);
  }
}
