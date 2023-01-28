import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {combineLatest, map, Observable, shareReplay, startWith} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StoreModel } from '../../models/store.model';
import { ProductModel } from '../../models/product.model';
import { StoresService } from '../../services/stores.service';
import { ProductsService } from '../../services/products.service';

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

  readonly searchForm: FormGroup = new FormGroup({ search: new FormControl('') });

  readonly searchVal$: Observable<string> = this.searchForm.controls['search'].valueChanges.pipe(
    startWith(''), shareReplay(1)
  );
  readonly currentStoreProducts$: Observable<ProductModel[]> = combineLatest([
    this.searchVal$,
    this._productsService.getAllProducts(),
    this.currentStore$.pipe(shareReplay(1))
  ]).pipe(
    map(([searchVal, products, store]: [any, ProductModel[], StoreModel]) => {
      console.log(store.id)
      return products
        .filter(product => product.storeIds.includes(store.id))
        .filter(product => product.name.includes(searchVal))
    })
  );

  constructor(private _storesService: StoresService, private _activatedRoute: ActivatedRoute, private _productsService: ProductsService) {
  }
}
