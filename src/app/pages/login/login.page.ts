import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      TranslateModule,
      LanguageComponent
  ]
})
export class LoginPage implements ViewWillEnter {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  correo: string;
  password: string;

  constructor(
      private router: Router,
      private translate: TranslateService,
      private authService: AuthService
  ) {
    this.correo = 'atorres';
    this.password = '1234';
    addIcons({ colorWandOutline });
  }

  map() {
    // Cambia navCtrl por router
    this.router.navigate(['/map']); // Asegúrate de que '/map' sea la ruta correcta para tu mapa
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  login() {
    this.authService.login(this.correo, this.password);
  }


  passwordRecovery() {
    // Implementa la lógica para la recuperación de contraseña
  }

  registerNewUser() {
    this.router.navigate(['/register']);
  }
}
