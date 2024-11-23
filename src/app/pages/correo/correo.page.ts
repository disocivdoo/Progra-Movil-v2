import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage {
  
  usuario: User = new User();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private databaseService: DatabaseService // Inyectar DatabaseService
  ) {}

  // Método para validar el correo y manejar la pregunta de seguridad
  async validarCorreo() {
    try {
      // Validar correo con el servicio de base de datos
      const usuarioEncontrado = await this.databaseService.findUserByEmail(this.usuario.email);
      if (usuarioEncontrado) {
        this.usuario = usuarioEncontrado; // Asignar datos si se encuentra el usuario
        this.mostrarMensajeEmergente('Contesta la siguiente pregunta de seguridad');
        
        // Navegar a la página de pregunta enviando el email como estado
        this.router.navigate(['/pregunta'], { state: { correo: this.usuario.email } });
      } else {
        this.mostrarMensajeEmergente('Correo no encontrado. Inténtalo nuevamente.');
      }
    } catch (error) {
      console.error("Error en validarCorreo:", error);
      this.mostrarMensajeEmergente('Ocurrió un error. Inténtalo más tarde.');
    }
  }

  // Método para mostrar mensajes emergentes
  async mostrarMensajeEmergente(mensaje: string, duracion: number = 2000) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }
}
