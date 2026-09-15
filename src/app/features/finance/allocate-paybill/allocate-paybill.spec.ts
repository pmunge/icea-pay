import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatePaybill } from './allocate-paybill';

describe('AllocatePaybill', () => {
  let component: AllocatePaybill;
  let fixture: ComponentFixture<AllocatePaybill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocatePaybill],
    }).compileComponents();

    fixture = TestBed.createComponent(AllocatePaybill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
