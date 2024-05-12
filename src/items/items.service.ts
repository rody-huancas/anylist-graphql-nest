import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id });
    if ( !item ) throw new NotFoundException(`Item whit ID '${id}' not found`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemsRepository.preload({ id, ...updateItemInput });

    if ( !item ) throw new NotFoundException(`Item whit ID '${id}' not found`);

    await this.itemsRepository.save(item);

    return item;
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);
    await this.itemsRepository.remove(item);
    return {...item, id};
  }
}
