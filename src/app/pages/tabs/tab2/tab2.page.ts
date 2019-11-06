import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  url: any;

  constructor(private sanitizer:DomSanitizer) {}

  ngOnInit(): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('http://cortezit.me?timestamp=' + new Date().toISOString());
  }


}
