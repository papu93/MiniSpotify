import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user
import { UserEditComponent } from './components/user-edit.component';

//import artist
import { ArtistListComponent } from './components/artist-list.component';

const appRoutes: Routes = [
	{/*redireccionamiento*/
		path: '',
		redirectTo: '/artists/1',
		pathMatch: 'full'	
	},
	{ path: '', component: ArtistListComponent },
	{ path: 'artists/:page', component: ArtistListComponent },
	{ path: 'mis-datos', component: UserEditComponent },
	{ path: '**', component: ArtistListComponent } //ruta inexistente
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);