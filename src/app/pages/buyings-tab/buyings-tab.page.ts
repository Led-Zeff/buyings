import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-buyings-tab',
  templateUrl: './buyings-tab.page.html',
  styleUrls: ['./buyings-tab.page.scss'],
})
export class BuyingsTabPage implements OnInit {

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.databaseService.executeQuery('select * from product');
  }

}
