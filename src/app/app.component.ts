import { Component } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CategoryModel} from "./models/category.model";
import {StoreModel} from "./models/store.model";
import {CategoriesService} from "./services/categories.service";
import {StoresService} from "./services/stores.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-freshcard-bootstrap-theme';
  readonly categoriesList$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories();
  readonly storesList$: Observable<StoreModel[]> = this._storesService.getAllStores();
  readonly _isMobileMenuOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isMobileMenuOpen$: Observable<boolean> = this._isMobileMenuOpenSubject.asObservable();

  constructor(private _categoriesService: CategoriesService, private _storesService: StoresService) {
  }

  toggleMobileMenu(isOpened: boolean) {
    this._isMobileMenuOpenSubject.next(isOpened);
  }
}
