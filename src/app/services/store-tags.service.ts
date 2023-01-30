import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreTagModel } from '../models/store-tag.model';

@Injectable()
export class StoreTagsService {
  constructor(private _httpClient: HttpClient) {
  }

  getAllStoreTags(): Observable<StoreTagModel[]> {
    return this._httpClient.get<StoreTagModel[]>('https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-store-tags');
  }
}
