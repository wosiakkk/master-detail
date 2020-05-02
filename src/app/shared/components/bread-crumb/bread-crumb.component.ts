import { Component, OnInit, Input } from '@angular/core';

//interface para padronizar o tipo do item do breadcrumb
interface BreadCrumbItem{
  text: string;
  link?: string; //link opcional, pois o item referente a page atual é somente active
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  @Input() itens: Array<BreadCrumbItem> = [];

  constructor() { }

  ngOnInit(): void {
  }
//método para verificar se o item é o último da lista, o qual receberá a classe active no template
  isTheLastItem(item: BreadCrumbItem): boolean{
    const index = this.itens.indexOf(item)
    return index + 1 == this.itens.length;
  }

}
