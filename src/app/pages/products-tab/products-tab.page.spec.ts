import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductsTabPage } from './products-tab.page';

describe('ProductsTabPage', () => {
  let component: ProductsTabPage;
  let fixture: ComponentFixture<ProductsTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
