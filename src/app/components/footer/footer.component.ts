import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, bookOutline, personOutline, chatbubblesOutline } from 'ionicons/icons'; // Asegúrate de importar estos iconos


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonFooter,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonIcon
  ]
})
export class FooterComponent {

  selectedButton = 'welcome';
  @Output() footerClick = new EventEmitter<string>();

  constructor() { 
    // Aquí se añaden los iconos que usaremos en el componente
    addIcons({ 
      homeOutline, 
      bookOutline, 
      personOutline, 
      chatbubblesOutline 
    });
  }


  sendClickEvent(event: any) {
    const selectedValue = event.detail.value;
    this.footerClick.emit(selectedValue);
  }

}
