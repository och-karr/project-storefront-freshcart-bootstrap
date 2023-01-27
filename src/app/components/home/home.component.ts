import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {combineLatest, map, Observable} from "rxjs";
import {StoreModel} from "../../models/store.model";
import {StoresService} from "../../services/stores.service";
import {StoreTagsService} from "../../services/store-tags.service";
import {StoreTagModel} from "../../models/store-tag.model";
import {StoreWithTagsNamesQueryModel} from "../../query-models/store-with-tags-names.query-model";

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly stores$: Observable<StoreModel[]> = this._storesService.getAllStores();
  readonly storeTags$: Observable<StoreTagModel[]> = this._storeTagsService.getAllStoreTags();

  readonly storesList$: Observable<StoreWithTagsNamesQueryModel[]> = combineLatest([
    this.stores$,
    this.storeTags$
  ]).pipe(
    map(([stores, tags]: [StoreModel[], StoreTagModel[]]) =>
      this._mapToStoresWithTagsNames(stores, tags)
  ));

  constructor(private _storesService: StoresService,private _storeTagsService: StoreTagsService) {
  }

  private _mapToStoresWithTagsNames(stores: StoreModel[], tags: StoreTagModel[]): StoreWithTagsNamesQueryModel[] {
    const tagsMap = tags.reduce((a, c) => ({...a, [c.id]: c}), {}) as Record<string, StoreTagModel>

    return stores.map((store) => ({
        distanceInMeters: store.distanceInMeters,
        id: store.id,
        logoUrl: store.logoUrl,
        name: store.name,
        tagNames: store.tagIds.map((id) => tagsMap[id].name)
      })
    )
  }
}
