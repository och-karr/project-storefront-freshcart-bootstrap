import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {CategoryModel} from "../../models/category.model";
import {CategoriesService} from "../../services/categories.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent {

  readonly categoriesList$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories();
  readonly currentCategory$: Observable<CategoryModel> = this._activatedRoute.params.pipe(
    switchMap((data) => {
      return this._categoriesService.getOneCategory(+data['categoryId'])
    })
  );

  constructor(private _categoriesService: CategoriesService, private _activatedRoute: ActivatedRoute) {
  }
}
