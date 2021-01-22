import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-race',
  templateUrl: './create-race.component.html',
  styleUrls: ['./create-race.component.scss']
})
export class CreateRaceComponent implements OnInit {

  @Input() tracks: any;
  @Input() players: any;
  @Input() engines: any;

  @Output("onRefreshRaces") onRefreshRaces: EventEmitter<any> = new EventEmitter();
  @Output("scrollToElement") scrollToElement: EventEmitter<any> = new EventEmitter();

  onRefresh() {
      this.onRefreshRaces.emit();
  }

  onScroll() {
    this.scrollToElement.emit();
  }

  selectedPlayers = [];
  currRank = 1;

  showToast = 0;

  constructor(private _httpClient: HttpClient) { }

  today = new Date();
  race = {
      "trackId": 0,
      "engineClassId": 0,
      "players": [],
      "creationDate": this.today.toISOString()
  };

  dummy = {
      "id": 0,
      "firstname": "",
      "avatar": "",
      "rank": 1,
  }

  onKey(event: any, player: any) {
    var selectedPlayer = this.selectedPlayers.filter(p => p.id == player.id);
    selectedPlayer[0]["rank"] = event.target.value;
  }

  onPlus(player: any) {
    var selectedPlayer = this.selectedPlayers.filter(p => p.id == player.id);
    if (selectedPlayer[0]["rank"] != '12')
      selectedPlayer[0]["rank"] += 1;
  }

  onMinus(player: any) {
    var selectedPlayer = this.selectedPlayers.filter(p => p.id == player.id);
    if (selectedPlayer[0]["rank"] != '1')
      selectedPlayer[0]["rank"] -= 1;
  }

  getAvailableRank()
  {
    var rank = 1;

    while (rank < 12)
    {
      if (!this.selectedPlayers.find(x => x["rank"] == rank))
        return rank;
      rank += 1;
    }
    return rank;
  }

  onAddPlayer(player: any)
  {
    var p = JSON.parse(JSON.stringify(this.dummy));
    p.id = player.id;
    p.firstname = player.firstname;
    p.avatar = player.avatar;
    p.rank = this.getAvailableRank();
    this.selectedPlayers.push(p);
  }

  onRemovePlayer(player: any)
  {
    this.selectedPlayers = this.selectedPlayers.filter(p => p.id != player.id);
  }

  onSwitchPlayer(player: any)
  {
    if (this.selectedPlayers.some(p => p.id == player.id))
      this.onRemovePlayer(player);
    else
      this.onAddPlayer(player);
  }

  postRace() {
    this._httpClient
    .post("api/Races", this.race)
    .subscribe(
      () => {
        console.log("Create Race: success!");
        this.showToast = 1;
        setTimeout(() => {
          this.showToast = 0;
        }, 3000);
        this.onRefresh();
      },
      (error) => {
        console.log("Couldn't create the race.");
      }
    );
  }

  ngOnInit(): void {
  }

  isAllUnique() {
    var valuesSoFar = [];
    for (var i = 0; i < this.selectedPlayers.length; ++i) {
        var value = this.selectedPlayers[i]['rank'];
        if (valuesSoFar.indexOf(value) !== -1) {
            return true;
        }
        valuesSoFar.push(value);
    }
    return false;
  }

  isValid() {
    if (this.selectedPlayers.length == 0)
      return true;
    
    if (this.selectedPlayers.length > 12)
      return true;

    if (this.isAllUnique())
      return true;
    
    return false;
  }

  isSelectedEmpty() {
    return this.selectedPlayers.length == 0;
  }

  onClean(form: NgForm)
  {
    this.selectedPlayers = [];
    form.reset();
  }

  onSubmit(form: NgForm)
  {
    this.race.trackId = form.value['track'];
    this.race.engineClassId = form.value['engine'];
    var now = new Date();
    this.race.creationDate = now.toISOString();
    this.race.players = [];

    this.selectedPlayers.forEach((sp) => {
      this.race.players.push({
        'playerId': sp.id,
        'position': sp.rank
      })
    });
    
    this.postRace();
    this.onClean(form);

    // scroll to the top
    this.onScroll();
  }

}
