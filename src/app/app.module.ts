import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import {CategoriesService} from "./services/categories.service";
import {StoresService} from "./services/stores.service";
import {ProductsService} from "./services/products.service";
import {StoreTagsService} from "./services/store-tags.service";
import {BasketService} from "./services/basket.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CollapseModule,
    CommonModule,
    RouterModule,
  ],
  providers: [CategoriesService, StoresService, StoreTagsService, ProductsService, BasketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
