import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageConfirmModalComponent } from './message-confirm-modal.component';

describe('MessageConfirmModalComponent', () => {
  let component: MessageConfirmModalComponent;
  let fixture: ComponentFixture<MessageConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageConfirmModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
