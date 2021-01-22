import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { RankingComponent, NgbdModalContent } from './ranking/ranking.component';
import { RaceComponent,NgbdModalContentRace } from './race/race.component';
import { CreateRaceComponent } from './create-race/create-race.component';

@NgModule({
  declarations: [
    AppComponent,
    RankingComponent,
    RaceComponent,
    CreateRaceComponent,
    NgbdModalContent,
    NgbdModalContentRace
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
