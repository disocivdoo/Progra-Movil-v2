import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service'; // Importar AuthService
import { User } from 'src/app/model/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para ngModel
import { IonicModule } from '@ionic/angular'; // Módulo principal de Ionic
import { EducationalLevel } from 'src/app/model/educational-level';

@Component({
  selector: 'app-misdatos',
  standalone: true,
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule], // Agregar módulos necesarios
})
export class MisDatosComponent implements OnInit {
  user: User = new User();  // Inicializa el objeto user para evitar 'undefined'
  listaNivelesEducacionales: EducationalLevel[] = [];

  constructor(private databaseService: DatabaseService, private authService: AuthService) { } // Inyectar AuthService

  ngOnInit(): void {
    this.loadUserData();
    this.loadEducationalLevels();
  }

  // Cargar los datos del usuario desde la base de datos
  async loadUserData(): Promise<void> {
    try {
      const username = this.authService.getCurrentUsername(); // Obtener el nombre de usuario autenticado
      if (username) {
        const currentUser = await this.databaseService.getUserByUsername(username); // Cargar datos por nombre de usuario
        if (currentUser) {
          this.user = currentUser;  // Asignar los datos al objeto user
        } else {
          console.error('Usuario no encontrado');
        }
      } else {
        console.error('No se encontró un nombre de usuario autenticado');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario', error);
    }
  }

  // Cargar niveles educativos
  loadEducationalLevels() {
    this.listaNivelesEducacionales = this.databaseService.loadEducationalLevels();
  }

  // Función para actualizar los datos del usuario
  async actualizarDatos(): Promise<void> {
    if (this.user) {
      try {
        await this.databaseService.updateUser(this.user); // Actualiza los datos del usuario
        console.log('Datos de usuario actualizados correctamente');
      } catch (error) {
        console.error('Error al actualizar los datos del usuario', error);
      }
    } else {
      console.warn('No se pueden actualizar los datos, el usuario no está definido');
    }
  }

  // Función para navegar sin datos
  navegarSinDatos(url: string): void {
    // Lógica para navegar a otra página (por ejemplo, al login)
    console.log('Navegando a:', url);
  }

  // Verifica que el usuario tenga los datos completos y válidos
  isValidUser(): boolean {
    return (
      !!this.user.firstName &&
      !!this.user.email &&
      this.user.dateOfBirth instanceof Date &&
      !isNaN(this.user.dateOfBirth?.getTime())
    );
  }
}
