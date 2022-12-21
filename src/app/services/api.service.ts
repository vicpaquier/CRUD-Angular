import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estudiante } from '../interfaces/estudiantes';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  URL = "http://localhost:8080/estudiantes";
  constructor(private http:HttpClient) { }
//todas las funciones que hará la api

  //agregar un nuevo estudiante
  add(estudiante:Estudiante):Observable<Estudiante>{//me va a devolver un dato de tipo estudiante
    return this.http.post<Estudiante>(this.URL, estudiante);
  }

  //guardar sin obligar que sea de tipo estudiante
  guardar(estudiante:any){//me va a devolver un dato de tipo estudiante
    return this.http.post<any>(this.URL, estudiante);
  }

  actualizar(estudiante:any){//me va a devolver un dato de tipo estudiante
    return this.http.post<any>(this.URL, estudiante);
  }

  eliminar(id:any){//me va a devolver un dato de tipo estudiante
    return this.http.delete<any>(this.URL+"/"+id);
  }

  //listar los estudiantes
  listar(){//me va a devolver un dato de tipo estudiante
    return this.http.get<any>(this.URL);
  }



}
