import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './ranking-modal.html',
  styleUrls: ['./ranking-modal.scss']
})
export class NgbdModalContent {
  @Input() player;
  @Input() races;
  @Input() rivals;
  @Input() darkMode;

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  @Input() player: any;
  @Input() playerRank: number;
  @Input() darkMode: boolean;

  constructor(private _httpClient: HttpClient, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getPlayer(this.player.id);
    this.getRivals(this.player.id);
    this.getRaces(this.player.id);
  }

  playerInfo: any;
  races: any[] = [];
  rivals: any[] = [];

  getPlayer(id: number)
  {
    this._httpClient.get<any[]>("api/Players/" + id).subscribe(
      (response) => {
        this.playerInfo = response;
      }
    )
  }

  getRaces(id: number)
  {
    this._httpClient.get<any[]>("api/Players/" + id +"/Races").subscribe(
      (response) => {
        this.races = response;
      }
    )
  }

  getRivals(id: number)
  {
    this._httpClient.get<any[]>("api/Players/" + id +"/Rivals").subscribe(
      (response) => {
        this.rivals = response.sort((a, b) => { return a.nbRaces < b.nbRaces ? 1 : -1; });
      }
    )
  }

  open() {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.player = this.playerInfo;
    modalRef.componentInstance.races = this.races;
    modalRef.componentInstance.rivals = this.rivals;
    modalRef.componentInstance.darkMode = this.darkMode;
  }
}
