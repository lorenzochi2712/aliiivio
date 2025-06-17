import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContfreePage } from './contfree.page';

describe('ContfreePage', () => {
  let component: ContfreePage;
  let fixture: ComponentFixture<ContfreePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContfreePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
