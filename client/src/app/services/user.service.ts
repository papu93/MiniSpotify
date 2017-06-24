import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'; //Permite usar el metodo map
import { Observable } from 'rxjs/Observable';  //para recoger las respuestas cuando hacemos peticiones Ajax al servidor
import { GLOBAL } from './global'; //fichero de configuraciones globales

@Injectable()
export class UserService{
	public url: string;

	constructor(private _http: Http){
		this.url = GLOBAL.url;
	}

	signUp(user_to_login, gethash = null){ //en caso de no estar logueado, declaramos getHash en null por defecto
		if(gethash != null){
			user_to_login.gethash = gethash; //Si no es null, la cargamos
		}
		let json = JSON.stringify(user_to_login); //convertimos a string
		let params = json;

		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url+'login',params, {headers: headers})
				.map(res => res.json());
				//llamamos al metodo login del Api Rest
				//lo que nos devuelve el servidor lo convertimos en JSON
	}
}