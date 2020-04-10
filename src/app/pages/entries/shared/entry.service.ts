import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { Entry } from "./entry.model"
import { CategoryService } from "../../categories/shared/category.service";
import { Observable } from "rxjs"
import { flatMap } from "rxjs/operators"

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector,private categoryService: CategoryService) {
    super("api/entries",injector);
   }
  
  create(entry: Entry): Observable<Entry>{
    /*ajuste para in-memory-database*/
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category =>{
        entry.category = category
        return super.create(entry);
      })
    )
    /**/
  }

  update(entry: Entry): Observable<Entry>{
    /*ajuste para in-memory-database*/
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    )
    /**/ 
  }

  protected jsonDataToResources(jsonData: any[]): Entry[]{
    const entries: Entry[] = [];
    jsonData.forEach(elemento => {
      const entry = Object.assign(new Entry(), elemento);
      entries.push(entry);
    });
    return entries;
  }

  protected jsonDataToResource(jsonData: any): Entry{
    return Object.assign(new Entry(), jsonData);
  }

}
