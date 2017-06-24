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
  public user_register: User;
  public identity; //comprobar los datos del usuario logueado
  public token; //junto con identity se guardan en el localStorage
  public errorMessage;
  public alertRegister;

  constructor(
  	private _userService: UserService
  	){ 
  	this.user = new User('','','','','','ROLE_USER',''); //creamos el objeto vacio para cuando llene los datos tenga donde guardarlo
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', ''); 

  }

  ngOnInit(){
    //Sacamos los datos almacenados en el localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
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
                this.user = new User('', '', '', '', '', 'ROLE_USER', ''); //para vaciar  la variable
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

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear(); //Elimina todo lo que hay en el localStorage

    this.identity = null; //Con esto volvemos a las vistas publicas de la app
    this.token = null;
  }

  onSubmitRegister(){
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se realizado correctamente, identificate con: '+this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', ''); //vaciamos la variable para futuros registros
        }

      }, error => { //Si hay error en la respuesta
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }
}
