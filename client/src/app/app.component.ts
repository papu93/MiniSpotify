import { Component } from '@angular/core';
import { User } from './models/user'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public title = 'MiniSpotify';
  public user: User;
  public identity; //comprobar los datos del usuario logueado
  public token; //junto con identity se guardan en el localStorage

  constructor(){ //creamos el objeto vacio para cuando llene los datos tenga donde guardarlo
  	this.user = new User('','','','','','ROLE_USER','');
  }
}
