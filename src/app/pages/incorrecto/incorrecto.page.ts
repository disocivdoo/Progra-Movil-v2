import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
})
export class IncorrectoPage implements OnInit {

  public user: User = new User();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService // Inyección del servicio
  ) {}

  ngOnInit() {
    // Obtener el ID del usuario desde los parámetros de URL
    this.activatedRoute.queryParams.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        // Llamada al servicio para obtener los datos del usuario por ID
        this.databaseService.getUserById(userId)
          .then((userData: User | undefined) => {
            if (userData) {
              this.user = userData; // Asignar los datos obtenidos al objeto user
            } else {
              console.error('Usuario no encontrado.');
            }
          })
          .catch(error => {
            console.error('Error al obtener los datos del usuario:', error);
          });
      }
    });
  }

  navegar(pagina: string) {
    this.user.navegarSinEnviarUsuario(this.router, pagina);
  }
}
