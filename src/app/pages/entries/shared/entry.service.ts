import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { Entry } from "./entry.model";
import { CategoryService } from "../../categories/shared/category.service";
import { Observable } from "rxjs";
import { flatMap, catchError, map } from "rxjs/operators";

import * as moment from "moment"

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector,private categoryService: CategoryService) {
    super("api/entries",injector, Entry.fromJson);
   }
  
  create(entry: Entry): Observable<Entry>{
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry>{
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  getByMonthAndYear(month: number, year: number): Observable<Entry[]>{
    //neste caso o ideal seria o backend retornar a lista já filtrada, isso é somente usado aqu devido ao inmemory database
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    )
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry)
      }),
      catchError(this.handleError)
    );
  }

  private filterByMonthAndYear(entries: Entry[], month: number, year: number){
    return entries.filter(entry => {
      const entryDate = moment(entry.date, "DD/MM/YYYY"); //O moment converte um string no padrão indicado para um obj do tipo DATE
      const monthMatches = entryDate.month() + 1 == month; //verifica se os meses do obj e do parametro são iguais, o +1 é necessário pois o moment considera ajneiro como 0
      const yearMatches = entryDate.year() == year;
      
      if(monthMatches && yearMatches) return entry;

    })
  }
}
