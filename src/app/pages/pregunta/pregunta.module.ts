import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule,IonicRouteStrategy } from '@ionic/angular';
import { PreguntaPageRoutingModule } from './pregunta-routing.module';
import { PreguntaPage } from './pregunta.page';
import { RouteReuseStrategy } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreguntaPageRoutingModule,
    MatDatepickerModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
  ],
  declarations: [PreguntaPage]
})
export class PreguntaPageModule {}
