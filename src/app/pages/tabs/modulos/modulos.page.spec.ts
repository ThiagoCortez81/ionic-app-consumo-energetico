import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModulosPage } from './modulos.page';

describe('ModulosPage', () => {
  let component: ModulosPage;
  let fixture: ComponentFixture<ModulosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModulosPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModulosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
