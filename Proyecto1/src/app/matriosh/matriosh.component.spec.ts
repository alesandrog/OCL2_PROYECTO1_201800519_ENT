import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrioshComponent } from './matriosh.component';

describe('MatrioshComponent', () => {
  let component: MatrioshComponent;
  let fixture: ComponentFixture<MatrioshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrioshComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrioshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
