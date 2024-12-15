import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() pictureUrl: string;
  @Output() userLoggedOut = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
}