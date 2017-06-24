import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'; //Permite usar el metodo map
import { Observable } from 'rxjs/Observable';  //para recoger las respuestas cuando hacemos peticiones Ajax al servidor
import { GLOBAL } from './global'; //fichero de configuraciones globales

@Injectable()
export class UserService{
	public identity;
	public token;
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	signUp(user_to_login, gethash = null){ //en caso de no estar logueado, declaramos getHash en null por defecto
		if(gethash != null){
			user_to_login.gethash = gethash; //Si no es null, la cargamos
		}
		let params = JSON.stringify(user_to_login); //convertimos a string
		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url+'login',params, {headers: headers})
						 .map(res => res.json());
				//llamamos al metodo login del Api Rest
				//lo que nos devuelve el servidor lo convertimos en JSON
	}

	register(user_to_register){
		let params = JSON.stringify(user_to_register); //convertimos a string
		let headers = new Headers({ 'Content-Type': 'application/json' });

		return this._http.post(this.url + 'register', params, { headers: headers })
						 .map(res => res.json());
	}

	getIdentity() {
	//Saca el usaurio identificado almacenado en el localStorage
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
	//Saca el token almacenado en el localStorage
		let token = localStorage.getItem('token');

		if (token != "undefined") {
			this.token = token;
		}else{
			this.token = null;
		}

		return this.token;
	}
}