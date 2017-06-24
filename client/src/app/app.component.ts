import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'MiniSpotify';
  public user: User;
  public identity; //comprobar los datos del usuario logueado
  public token; //junto con identity se guardan en el localStorage
  public errorMessage;

  constructor(
  	private _userService: UserService
  	){ 
  	this.user = new User('','','','','','ROLE_USER',''); //creamos el objeto vacio para cuando llene los datos tenga donde guardarlo
  }

  ngOnInit(){
    //Sacamos los datos almacenados en el localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log("**************************");
    console.log(this.identity);
    console.log(this.token);
    console.log("**************************");
  }

  public onSubmit(){
  	console.log(this.user);

  	//conseguir los datos del usuario identificado
  	//subscribe recibe 2 parametros, response y error
  	this._userService.signUp(this.user).subscribe(
  		response => { //Si la respuesta se devuelve correctamente
  			let identity = response.user; //guardamos el usuario que se logueo
  			this.identity = identity; 

  			if(!this.identity._id){
  				alert("El usuario no esta correctamente identificado");
  			}else{  
          //Crear elemento de la sesion en el local storage
          localStorage.setItem('identity',JSON.stringify(identity));

  				//conseguir el token para enviarselo a cada peticion Http, hacer lo mismo pero con el token
				  this._userService.signUp(this.user, 'true').subscribe(
			  		response => {
			  			let token = response.token; //guardamos el token del usuario logueado
			  			this.token = token; 

			  			if(this.token.length <=0){
			  				alert("El token se ha generado correctamente");
			  			}else{
			  				//Crear elemento de la sesion en el local storage del token
                localStorage.setItem('token', token);

			  				console.log(token);
			  				console.log(identity);
			  			}
			  		},	
			  		error => {
			  			var errorMessage = <any>error;

			  			if(errorMessage != null){
			  				var body = JSON.parse(error._body);
			  				this.errorMessage = body.message;
			  				console.log(error);
			  			}
			  		}
			  	);
  			}
  		},	
  		error => { //Si hay error en la respuesta
  			var errorMessage = <any>error;

  			if(errorMessage != null){
  				var body = JSON.parse(error._body);
  				this.errorMessage = body.message;
  				console.log(error);
  			}
  		}
  	);
  }
}
