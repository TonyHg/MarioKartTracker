import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content-race',
  templateUrl: './race-modal.html',
  styleUrls: ['./race-modal.scss']
})
export class NgbdModalContentRace {
  @Input() race;
  @Input() cup;
  @Input() darkMode;

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

  @Input() race: any;
  @Input() cups: any;
  @Input() darkMode: boolean;

  constructor(private _httpClient: HttpClient, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open() {
    const modalRef = this.modalService.open(NgbdModalContentRace);
    modalRef.componentInstance.race = this.race;
    var coupe = this.cups.find(c => {
      return c.tracks.find(t => {
        return t.id == this.race.track.id;
      })
    });
    modalRef.componentInstance.cup = coupe;
    modalRef.componentInstance.darkMode = this.darkMode;
  }
}
