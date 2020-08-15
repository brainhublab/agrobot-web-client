import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceChartsComponent } from './device-charts.component';

describe('DeviceChartsComponent', () => {
  let component: DeviceChartsComponent;
  let fixture: ComponentFixture<DeviceChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
