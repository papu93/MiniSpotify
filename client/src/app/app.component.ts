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

  constructor(
  	private _userService: UserService
  	){ 
  	this.user = new User('','','','','','ROLE_USER',''); //creamos el objeto vacio para cuando llene los datos tenga donde guardarlo
  }

  ngOnInit(){
  }

  public onSubmit(){
  	console.log(this.user);
  }
}
