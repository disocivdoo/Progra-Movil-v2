import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { QrWebScannerComponent } from 'src/app/components/qr-web-scanner/qr-web-scanner.component';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { MiClaseComponent } from 'src/app/components/miclase/miclase.component';
import { MisDatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
      CommonModule, FormsModule, TranslateModule, IonContent,
      HeaderComponent, FooterComponent,MiClaseComponent, MisDatosComponent,
      WelcomeComponent, QrWebScannerComponent, ForumComponent,
  ]
})
export class HomePage {
  
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'welcome';

  constructor(
    private auth: AuthService, 
    private scanner: ScannerService,
    private router: Router // Inyecta Router aquí
  ) { }

  ionViewWillEnter() {
    this.changeComponent('welcome');
  }

  async headerClick(button: string) {
    if (button === 'scan' && Capacitor.getPlatform() === 'web') {
      this.selectedComponent = 'qrwebscanner';
      this.footer.selectedButton = 'scan';
    }
  }

  webQrStopped() {
    this.changeComponent('welcome');
  }

  webQrScanned(data: any) {
    console.log('QR Scanned:', data);
    // Agrega aquí la lógica para manejar el QR escaneado
  }

  footerClick(button: string) {
    this.selectedComponent = button;
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }
}
  