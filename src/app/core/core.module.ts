import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from '@angular/common/http'

//módulos de rotas utulizado após a estração da navbar ser realizada, ela é preciso para os routerslinks funcionarem
import { RouterModule } from "@angular/router";

/*configuração da api temporária*/ 
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDatabase } from '../in-memory-database';
import { NavbarComponent } from './components/navbar/navbar.component'
/******************************/



@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase)
  ],
  exports: [
    //shared modules
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    

    //shared components
    NavbarComponent
  ]
})
export class CoreModule { }
