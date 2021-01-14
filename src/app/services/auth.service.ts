import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UsuarioModel } from "../models/usuario.model";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url='';//aqui se anota la url de donde se va a obtener la informacion http...
  private apykey=''; //aqui anotamos la apykey de la aplicacion

  userToken: string;

  //Crear nuevo usuario

  //Login

  constructor(private http: HttpClient) {
      this.leerToken();
  }

  logout(){
    localStorage.removeItem('token');
  }

  login(usuario:UsuarioModel){
    const authData = {
      ...usuario,
       returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apykey}`,
      authData
    ).pipe(
      map(resp => {
        console.log('entro en el mapa del rxjs');
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }

  nuevoUsuario(usuario: UsuarioModel){
    const authData = {
      //tambien puedo escribirlos asi;
      // email: usuario.email,
      // password: usuario.password,
      ...usuario,
       returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signUp?key=${this.apykey}`,
      authData
    ).pipe(
      map(resp => {
        console.log('entro en el mapa del rxjs');
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }

  private guardarToken(idToken: string){
    this.userToken =idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken(){
    if(localStorage.getItem('token')){
      this.userToken= localStorage.getItem('token');
    }else{
      this.userToken='';
    }

    return this.userToken;
  }

  estaAutenticado():boolean{
    if(this.userToken.length<2){
      return false;
    }

    const expira =Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setDate(expira);

    if(expiraDate > new Date()){
      return true;
    }else{
      return false;
    }
  }

}
