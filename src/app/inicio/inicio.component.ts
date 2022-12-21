import { Component } from '@angular/core';
import { Estudiante } from '../interfaces/estudiantes';
import { ApiService } from '../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  editando = false;
  cargando = false;
  estudiantes:Estudiante[] = [];
  id = 0;
  formulario !:FormGroup;

  constructor(private api:ApiService, private form:FormBuilder){}

  ngOnInit():void{
    this.getEstudiantes();

    this.formulario = this.form.group({
      ci:['', Validators.required],
      nombre:['', Validators.required],
      apellido:['', Validators.required],
      correo:['', [Validators.required,Validators.pattern("[^ @]*@[^ @]*")]]
    });
  }

  getEstudiantes() {
    this.cargando = true;
    this.api.listar().subscribe({
      //si la respuesta llega
      next:res=>{
        this.estudiantes =res;
        this.cargando = false;
        
      },
      //si la respuesta no llega
      error:(err: HttpErrorResponse)=>{
        alert(err.message);
        this.cargando = false;
      }
    })
  }

  nuevo(){
    this.editando=false;
  }
  guardar() {
    this.cargando = true;
    this.api.guardar(this.formulario.value).subscribe({
      //si la respuesta llega
      next:res=>{
        this.formulario.reset();
        let cerrar = document.getElementById("cerrarDialogo");
        cerrar?.click();
        let mensaje = 'El estudiante '+res.nombre+' '+res.apellido+' se ha registrado correctamente';
        Swal.fire(
          'Registro exitoso',
          mensaje,
          'success'
        )
        this.getEstudiantes();
        this.cargando = false;
      },
      //si la respuesta no llega
      error:(err: HttpErrorResponse)=>{
        //0 error desconocido
        if(err.status==0){
          Swal.fire(
            'Ups',
            'Upps, servidor no disponible, intente mas tarde: '+err.status+''+err.statusText,
            'error'
          )
        }else if(err.status==500){
          Swal.fire(
            'Ups',
            'Upps, ya existe un estudiante con el CI: '+this.formulario.value.ci,
            'error'
          )
        }
        alert(err.message);
        this.cargando = false;
      }
    })
  }


  actualizar() {
    this.cargando = true;
    this.editarDatos = this.formulario.value;
    //el id viene de los datos obtenidos al clickar el boton
    this.editarDatos['id'] = this.id;
    this.api.actualizar(this.editarDatos).subscribe({
      //si la respuesta llega
      next:res=>{
        this.formulario.reset();
        let cerrar = document.getElementById("cerrarDialogo");
        cerrar?.click();
        let mensaje = 'El estudiante '+res.nombre+' '+res.apellido+' fue actualizado';
        Swal.fire(
          'Actualización exitosa',
          mensaje,
          'success'
        )
        this.getEstudiantes();
        this.cargando = false;
      },
      //si la respuesta no llega
      error:(err: HttpErrorResponse)=>{
        //0 error desconocido
        if(err.status==0){
          Swal.fire(
            'Ups',
            'Upps, servidor no disponible, intente mas tarde: '+err.status+''+err.statusText,
            'error'
          )
        }else if(err.status==500){
          Swal.fire(
            'Ups',
            'Upps, el estudiante con CI: '+this.editarDatos.value.ci+' no existe',
            'error'
          )
        }
        alert(err.message);
        this.cargando = false;
      }
    })
  }

  eliminar(id:number) {
    this.cargando = true;
    this.api.eliminar(id).subscribe({
      //si la respuesta llega
      next:res=>{
        let mensaje = 'El estudiante '+res.nombre+' '+res.apellido+' fue eliminado';
        
        this.getEstudiantes();
        if(res.respuesta){
          Swal.fire(
            'Mensaje',
            res.mensaje,
            'success'
          )
        }else{
          Swal.fire(
            'Mensaje',
            res.mensaje,
            'error'
          )
        }
        this.cargando = false;
      },
      //si la respuesta no llega
      error:(err: HttpErrorResponse)=>{
        //0 error desconocido
        if(err.status==0){
          Swal.fire(
            'Ups',
            'Upps, servidor no disponible, intente mas tarde: '+err.status+''+err.statusText,
            'error'
          )
        }else if(err.status==500){
          Swal.fire(
            'Ups',
            'Upps, el estudiante con CI: '+this.editarDatos.value.ci+' no existe',
            'error'
          )
        }
        alert(err.message);
        this.cargando = false;
      }
    })
  }

  editarDatos !:any;
  editar(data:any){
    this.editando = true;
    this.formulario.get('nombre')?.setValue(data.nombre);
    this.formulario.get('apellido')?.setValue(data.apellido);
    this.formulario.get('correo')?.setValue(data.correo);
    this.formulario.get('ci')?.setValue(data.ci);
    this.id = data.id;
  }
}

