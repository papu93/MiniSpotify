import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';


@Component({
	selector: 'user-edit',
	templateUrl: '../views/user-edit.html',
	providers: [UserService]
})

export class UserEditComponent implements OnInit{
	public titulo: string;
	public user: User;
	public identity;
	public token;
	public alertMessage;
	public url: string;

	constructor(
		private _userService: UserService
	){
		this.titulo = 'Actualizar mis datos';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.user = this.identity;
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('user-edit.component.ts cargado');
	}

	onSubmit() {
		this._userService.updateUser(this.user).subscribe(
			response => {
				if(!response.user){
					this.alertMessage = 'El usuario no se ha actualizado';
				} else {
					//this.user = response.user; //actualizamos usuario
					localStorage.setItem('identity', JSON.stringify(this.user)); //actualizamos lo guardado
					document.getElementById("identity_name").innerHTML = this.user.name;

					if(!this.filesToUpload) { //Si no existe archivos no sube nada
						//redireccion
						console.log("NO HAY FILES TO UPLOAD");
					} else {

						this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
							(result: any) => {
								this.user.image = result.image; //agregamos la img y recargamos el localStorege
								localStorage.setItem('identity', JSON.stringify(this.user)); 
								console.log(this.user);
							}
						);
					}
					this.alertMessage = 'Datos actualizados correctamente';
				}
			}, 
			error => {
				var errorMessage = <any>error;
				console.log("body: " + error._body);

				if (errorMessage != null) {
					var body = JSON.parse(error._body);
					this.alertMessage = body.message;
					console.log(error);
				}
			});
	}

	public filesToUpload: Array<File>;

	fileChangeEvent(fileInput:any) {
		this.filesToUpload = <Array<File>>fileInput.target.files; //recoge los arch seleccionados en el input
	}

	makeFileRequest(url: string, params: Array<string>, files:Array<File>) {

		var token = this.token; 
		return new Promise(function(resolve, reject) {

			var formData: any = new FormData(); //Simular comportamiento de un formulario
			var xhr = new XMLHttpRequest(); 

			for (var i = 0; i < files.length; i++) {
				formData.append('image', files[i], files[i].name);
			}

			xhr.onreadystatechange = function() { //si esta lista la peticion para realizarse
				if(xhr.readyState == 4) {
					if(xhr.status == 200) {
						resolve(JSON.parse(xhr.response)); //respuesta de enviar el archivo
					} else {
						reject(xhr.response);
					}
				}
			}

			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);
		});
	}
}



