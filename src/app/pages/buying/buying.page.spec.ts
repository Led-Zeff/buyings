import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyingPage } from './buying.page';

describe('BuyingPage', () => {
  let component: BuyingPage;
  let fixture: ComponentFixture<BuyingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
