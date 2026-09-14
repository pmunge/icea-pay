import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPerformance } from './channel-performance';

describe('ChannelPerformance', () => {
  let component: ChannelPerformance;
  let fixture: ComponentFixture<ChannelPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelPerformance],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelPerformance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
