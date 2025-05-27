import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectorPage } from './selector.page';

describe('SelectorPage', () => {
  let component: SelectorPage;
  let fixture: ComponentFixture<SelectorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
