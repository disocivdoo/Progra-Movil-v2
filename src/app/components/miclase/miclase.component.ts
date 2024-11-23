import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { Asistencia } from '../../model/asistencia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';  // Importar Router
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-miclase',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MiClaseComponent implements OnInit {
  // Propiedades con inicializador o '!' para indicar que se asignarán más tarde
  sede!: string;
  idAsignatura!: string;
  seccion!: string;
  nombreAsignatura!: string;
  nombreProfesor!: string;
  dia!: string;
  bloqueInicio!: number;
  bloqueTermino!: number;
  horaInicio!: string;
  horaFin!: string;

  asistencia: Asistencia | null = null; // Asistencia puede ser null

  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router  // Inyectar Router
  ) {}

  ngOnInit() {
    // Obtener el parámetro qrData de la URL
    this.route.queryParams.subscribe(params => {
      const qrData = params['qrData'];
      console.log('QR Data recibido: ', qrData);

      if (qrData) {
        try {
          // Parseo los datos del QR y los asigno a las propiedades correspondientes
          const parsedData = JSON.parse(qrData);

          this.sede = parsedData.sede;
          this.idAsignatura = parsedData.idAsignatura;
          this.seccion = parsedData.seccion;
          this.nombreAsignatura = parsedData.nombreAsignatura;
          this.nombreProfesor = parsedData.nombreProfesor;
          this.dia = parsedData.dia;
          this.bloqueInicio = Number(parsedData.bloqueInicio);
          this.bloqueTermino = Number(parsedData.bloqueTermino);
          this.horaInicio = parsedData.horaInicio;
          this.horaFin = parsedData.horaFin;

          // Crear un objeto de asistencia
          this.asistencia = {
            sede: this.sede,
            idAsignatura: this.idAsignatura,
            seccion: this.seccion,
            nombreAsignatura: this.nombreAsignatura,
            nombreProfesor: this.nombreProfesor,
            dia: this.dia,
            bloqueInicio: this.bloqueInicio,
            bloqueTermino: this.bloqueTermino,
            horaInicio: this.horaInicio,
            horaFin: this.horaFin,
            setAsistencia: function () {
              console.log('Método setAsistencia ejecutado');
            }
          };

          // Almacenar la asistencia en el sessionStorage
          sessionStorage.setItem('asistencia', JSON.stringify(this.asistencia));

          // Llamar al método saveAsistencia desde el servicio
          this.databaseService.saveAsistencia(this.asistencia).then(() => {
            console.log('Asistencia guardada correctamente');
          }).catch((error: any) => {
            this.showAlertError('MiClaseComponent.onQrScanned', error);
          });

        } catch (error) {
          console.error('Error al procesar el QR:', error);
          this.showAlertError('MiClaseComponent.onQrScanned', error);
        }
      } else {
        // Si no hay datos en la URL, intentamos recuperar la asistencia guardada
        const savedAsistencia = sessionStorage.getItem('asistencia');
        if (savedAsistencia) {
          this.asistencia = JSON.parse(savedAsistencia);
          // Asegurarse de que asistencia no es null antes de acceder a sus propiedades
          if (this.asistencia) {
            this.sede = this.asistencia.sede;
            this.idAsignatura = this.asistencia.idAsignatura;
            this.seccion = this.asistencia.seccion;
            this.nombreAsignatura = this.asistencia.nombreAsignatura;
            this.nombreProfesor = this.asistencia.nombreProfesor;
            this.dia = this.asistencia.dia;
            this.bloqueInicio = this.asistencia.bloqueInicio;
            this.bloqueTermino = this.asistencia.bloqueTermino;
            this.horaInicio = this.asistencia.horaInicio;
            this.horaFin = this.asistencia.horaFin;
          }
        }
      }
    });
  }

  onQrScanned(scanResult: any): void {
    // Este método ya no será necesario si el QR ya se ha procesado en ngOnInit
  }

  onQrStopped(): void {
    console.log('Escaneo detenido');
  }

  showAlertError(component: string, error: any): void {
    console.error(`Error en ${component}:`, error);
  }

  navegarSinDatos(url: string): void {
    console.log('Navegando a', url);
    this.router.navigate([url]);
  }
}
