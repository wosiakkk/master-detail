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

  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == "new")
      this.createCategory();
    else
      this.updateCategory();
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
      nome: [null, [Validators.required, Validators.minLength(2)]],
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

  //object assing atribui os valores do categoryForm para o novo obj ategory criado
  //metodos para tratar o retorno criado de forma que podem ser reaproveitados tanto em update quando e create
  private createCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  //redirect/reload component page
   //Forçar um recarregamento utilizando um redirecionamento para voltar ao form(de categories/new para / e depois para /:id/edit, co o id da categor criada)
    //de forma trasparente no qual o usário não irá perceber
    //skipLocationsChange evita que o navegador salve a rota navegada, impossibilitando do usuário apertar e voltar e ir ná página não desejada no redirecionamento
  private actionsForSuccess(category :Category){
    toastr.success("Solicitação processada com sucesso!");
   
    this.router.navigateByUrl("categories", {skipLocationChange: true}).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error:any){
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;
    
    if(error.status === 422)//servidor processou mas deu algum erro de validação
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else //erro de comunicação
      this.serverErrorMessages = ["Falha na comunicação com o servidor, por favor tente mais tarde."];
  }
}
