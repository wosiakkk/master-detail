import { BaseResourceModel } from "../models/base-resource.model";
import { HttpClient } from "@angular/common/http"
import { Injector } from "@angular/core";
import { Observable, throwError } from "rxjs"
import { map, catchError } from "rxjs/operators"
import { element } from 'protractor';


export abstract class BaseResourceService<T extends BaseResourceModel>{

    protected http: HttpClient;

    constructor(
      protected apiPath: string,
      protected inejctor: Injector,
      protected jsonDataToResourceFn: (jsonData: any)=> T
    ){
        this.http = inejctor.get(HttpClient)
    }

    getAll(): Observable<T[]>{
        return this.http.get(this.apiPath).pipe(
          map(this.jsonDataToResources.bind(this)),
          catchError(this.handleError)
        )
      }
    
      getById(id: number): Observable<T>{
        const url = `${this.apiPath}/${id}`;
        return this.http.get(url).pipe(
          map(this.jsonDataToResource.bind(this)),
          catchError(this.handleError)
        );
      }
      
      create(resource: T): Observable<T>{
        return this.http.post(this.apiPath, resource).pipe(
          map(this.jsonDataToResource.bind(this)),
          catchError(this.handleError)
        )
      }
    
      update(resource: T): Observable<T>{
        const url = `${this.apiPath}/${resource.id}`;
        return this.http.put(url, resource).pipe(
           map(() => resource,
           catchError(this.handleError)
          )
        );
      }
    
      delete(id: number): Observable<any>{
        const url = `${this.apiPath}/${id}`;
        return this.http.delete(url).pipe(
          map(() => null),
          catchError(this.handleError)
        );
      }

      //PROTECED METHODS
    protected jsonDataToResources(jsonData: any[]): T[]{
        const resources: T[] = [];
        jsonData.forEach(
          elemento => resources.push( this.jsonDataToResourceFn(elemento) )
        );
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T{
        return  this.jsonDataToResourceFn(jsonData);
    }

    protected handleError(error: any): Observable<any>{
        console.log('Error na requisição =>', error);
        return throwError(error);
    }


}