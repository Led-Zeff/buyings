import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyingsTabPage } from './buyings-tab.page';

describe('BuyingsTabPage', () => {
  let component: BuyingsTabPage;
  let fixture: ComponentFixture<BuyingsTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyingsTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyingsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
