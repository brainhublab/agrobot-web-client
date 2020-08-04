import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesStatsComponent } from './devices-stats.component';

describe('DevicesStatsComponent', () => {
  let component: DevicesStatsComponent;
  let fixture: ComponentFixture<DevicesStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
