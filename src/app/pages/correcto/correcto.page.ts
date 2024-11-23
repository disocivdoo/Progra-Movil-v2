import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EducationalLevel } from 'src/app/model/educational-level';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
})
export class CorrectoPage implements OnInit {

  public listaNivelesEducacionales = EducationalLevel.getLevels();
  public usuario: User = new User();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService // Inyectar el servicio de base de datos
  ) {}

  ngOnInit() {
    this.recibirPregunta();
  }

  // Reemplazar el método `recibirPregunta` usando `DatabaseService`
  async recibirPregunta() {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state) {
      const correo = nav.extras.state['correo'];
  
      try {
        const usuarioEncontrado = await this.databaseService.findUserByEmail(correo);
        if (usuarioEncontrado) {
          console.log('Usuario encontrado:', usuarioEncontrado);
          console.log('Contraseña:', usuarioEncontrado.password);  // Agrega esta línea para depurar
          this.usuario = usuarioEncontrado;
        } else {
          this.router.navigate(['/correo']);
        }
      } catch (error) {
        console.error('Error al recuperar el usuario:', error);
      }
    }
  }
  

  // Método de navegación sin enviar datos de usuario
  navegarSinDatos(pagina: string) {
    this.router.navigate([pagina]);
  }
}
