import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from "rxjs/operators"; //para poder manipular a rota quando estiver trabalhando com activatedroute

import toastr from "toastr";



@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  //variável para informar se esta editando ou criando um novo recurso
  currentAction: string;
  //formulario
  categoryForm: FormGroup;
  //título dinâmico
  pageTitle: string;
  //mensagens retornadas do servidor caso ocorra algum erro
  serverErrorMessages: string[] =  null;
  //var bool para desabilitar o botão de submit após ele ser clicado uma vez, evitando várias requisições, voltando a ser habilitado após a resposta do servidor
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }
//método que é ionvocado apśo todas as diretivas terem sido carregadas, isso garente setar valores com as entidades já carregadas antes da renderização
  ngAfterContentChecked(){
    //método para setar o título da página
    this.setPageTitle();
  }


  //PRIVATE METHODS
  private setCurrentAction(){
    //verificando a rota para saber se a pessoa está editando ou não
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    }else {
      this.currentAction = "edit";
    }
  }

  private buildCategoryForm(){
    //construindo o formulário da categoria
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(2)]],
      description: [null]
    });
  }

  private loadCategory(){
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category); //bind a categoria carregada no formulário
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tared')
      );
    }
  }

  private setPageTitle(){
    if(this.currentAction == "new")
      this.pageTitle = "Cadastro de nova Categoria";
    else{
      const categoryName = this.category.nome || ""; // na primera vez que o content check tentar setar o titulo da página, provavelmete a cat n vai estar carregada aidna
      this.pageTitle = "Editando Categoria: "+ categoryName;
    }
      
  }

}
