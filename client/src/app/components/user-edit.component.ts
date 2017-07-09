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
						/*then() recibe dos argumentos: un callback para cuando se tiene éxito y otro para 
						cuando sucede lo contrario.Ambos son opcionales; puedes agregar un callback solo para 
						cuando se tiene éxito como hacemos ahora.*/
						this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
							(result: any) => {
								//Callback luego de resolverse la promesa
								this.user.image = result.image; //agregamos la img y recargamos el localStorege
								localStorage.setItem('identity', JSON.stringify(this.user));
								let image_path = this.url + 'get-image-user/' + this.user.image;
								document.getElementById('image-logged').setAttribute('src',image_path);
							},
							err => {
								console.log(err);
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
		/*Una promesa indica hacer algo, de manera asincrona */
		return new Promise(function(resolve, reject) {
			/*Recibe un callback con 2 parametros, si todo sale bien se hace el resolve, sino el reject(rechazado)*/

			var formData: any = new FormData(); //Simular comportamiento de un formulario
			var xhr = new XMLHttpRequest(); //para manipular una solicitud. Es un canal de comunicación con el servidor

			for (var i = 0; i < files.length; i++) {
				formData.append('image', files[i], files[i].name);
			}

			xhr.onreadystatechange = function() { //si esta lista la peticion para realizarse. Se llama cada vez que cambia el estado de xhr
				if (xhr.readyState == 4) { //indica que se ha recibido la información solicitada del servidor.
					if(xhr.status == 200) { //respuesta del servidor a la peticion
						resolve(JSON.parse(xhr.response)); //promesa resuelta y pasamos la respuesta de enviar el archivo
					} else {
						reject(xhr.response); //promesa rechazada y enviamos la respuesta de la peticion
					}
				}
			}

			xhr.open('POST', url, true); //inicializa la solicitud
			xhr.setRequestHeader('Authorization', this.token); //agregamos la autorizacion a la solicitud
			xhr.send(formData);  //Relizamos la solicitud
		});
	}
}



