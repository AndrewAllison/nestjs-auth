import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class Mapper<T> {
  public static flattern(raw: any) {}
}
