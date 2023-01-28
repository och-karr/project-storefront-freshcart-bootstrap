import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {Observable, switchMap} from 'rxjs';
import { StoreModel } from '../../models/store.model';
import { StoresService } from '../../services/stores.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-store-products',
  styleUrls: ['./store-products.component.scss'],
  templateUrl: './store-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreProductsComponent {
  readonly currentStore$: Observable<StoreModel> = this._activatedRoute.params.pipe(
    switchMap((data) => {
      return this._storesService.getOneStore(+data['storeId'])
    })
  );

  constructor(private _storesService: StoresService, private _activatedRoute: ActivatedRoute) {
  }
}
