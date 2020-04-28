import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

import { BaseResourceFormComponent } from "../../../shared/components/base-resource-form/base-resource-form.component";

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector
  ) { 
    super(injector, new Category(), categoryService, Category.fromJson);
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  //sobrescrevendo os métodos para o título da página, para não utilizar o valor padrão
  protected creationPageTitle(): string{
    return "Cadastro de nova Categoria";
  }

  protected editionPageTitle(): string{
    const categoryName = this.resource.nome || ""; //caso ainda nao tenha sido carregado o dado, "" será exibido, evitnado o undefined
    return "Editando Categoria: "+ categoryName;
  }

}
