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

	signUp(user_to_login, gethash = null){
		if(gethash != null){
			user_to_login.gethash = gethash;
		}
		let json = JSON.stringify(user_to_login);
		let params = json;

		let headers = new Headers({'Content-Type':'application/json'});

		return this._http.post(this.url+'login',params, {headers: headers})
				.map(res => res.json());
				//lo que nos devuelve el servidor lo convertimos en JSON
	}
}