import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatePaybillList } from './allocate-paybill-list';

describe('AllocatePaybillList', () => {
  let component: AllocatePaybillList;
  let fixture: ComponentFixture<AllocatePaybillList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocatePaybillList],
    }).compileComponents();

    fixture = TestBed.createComponent(AllocatePaybillList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
