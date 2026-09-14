import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPerformance } from './product-performance';

describe('ProductPerformance', () => {
  let component: ProductPerformance;
  let fixture: ComponentFixture<ProductPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPerformance],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPerformance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
