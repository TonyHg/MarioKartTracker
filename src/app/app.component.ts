import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { Component } from '@angular/core';
import { RaceSubscriber } from 'rxjs/internal/observable/race';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  constructor(private _httpClient: HttpClient) {
  }

  saveRaces: any[] = [];
  races: any[] = [];
  players: any[] = [];
  tracks: any[] = [];
  engines: any[] = [];
  cups: any[] = [];
  filterCups: any[] = [];
  filterEngine: any[] = [];

  lastRankingUpdate = new Date();
  title = 'Mario Kart';

  darkMode: boolean = false;
  darkModeText: string = "DARKMODE";

  getRanking() {
    this._httpClient.get<any[]>("api/Players/GlobalRanking").subscribe(
      (response) => {
        this.players = response;
      },
      (error) => {
        console.log("error: " + error);
      },
      () => {
        this.lastRankingUpdate = new Date();
      }
    )
  }

  getRaces() {
    this._httpClient.get<any>("api/Races").subscribe(
      (response) => {
        this.races = response;
        this.saveRaces = response;
      }
    );
  }

  getTracks() {
    this._httpClient.get<any>("api/Tracks").subscribe(
      (response) => {
        this.tracks = response;
      }
    );
  }

  getEngines() {
    this._httpClient.get<any>("api/EngineClasses").subscribe(
      (response) => {
        this.engines = response;
      }
    );
  }
  
  getCups() {
    this._httpClient.get<any>("api/Cups").subscribe(
      (response) => {
        this.cups = response;
      }
    );
  }

  ngOnInit() {
    this.getRaces();
    this.getRanking();
    this.getTracks();
    this.getEngines();
    this.getCups();
  }

  onRefreshRaces() {
    this.getRanking();
    this.getRaces();
  }

  getCupRace(id: number)
  {
    return this.cups.find(c => {
      return c.tracks.find(t => {
        return t.id == id;
      })
    });
  }

  filterRaces() {
    this.races = JSON.parse(JSON.stringify(this.saveRaces));
    if (this.filterCups.length != 0) {
      this.races = this.races.filter( r => {
        var cup = this.getCupRace(r.track.id);
        return this.filterCups.includes(cup);
      });
    }
    if (this.filterEngine.length != 0) {
      this.races = this.races.filter( r => {
        return this.filterEngine.find(e => { return r.engineClass.id == e.id; });
      });
    }
  }

  isCupSelected(cup: any) {
    return this.filterCups.includes(cup);
  }
  isEngineSelected(engine: any) {
    return this.filterEngine.includes(engine);
  }

  onSwitchFilter(cup: any) {
    if (this.filterCups.includes(cup))
      this.filterCups = this.filterCups.filter(c => { return c != cup; });
    else
      this.filterCups.push(cup);

    this.filterRaces();
  }

  onSwitchFilterEngine(engine: any) {
    if (this.filterEngine.includes(engine))
      this.filterEngine = this.filterEngine.filter(c => { return c != engine; });
    else
      this.filterEngine.push(engine);

    this.filterRaces();
  }

  scrollToElement($element: any): void {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  onSwitchTheme() {
    this.darkMode = !this.darkMode;
    this.darkModeText = (this.darkMode) ? "LIGHTMODE" : "DARKMODE";
  }
}
