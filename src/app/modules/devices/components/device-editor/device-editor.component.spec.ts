import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceEditorComponent } from './device-editor.component';

describe('DeviceEditorComponent', () => {
  let component: DeviceEditorComponent;
  let fixture: ComponentFixture<DeviceEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
