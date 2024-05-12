import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ) { }
  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = await this.itemsRepository.create(createItemInput);

    await this.itemsRepository.save(newItem);

    return newItem;
  }

  async findAll(): Promise<Item[]> {
    return await this.itemsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
