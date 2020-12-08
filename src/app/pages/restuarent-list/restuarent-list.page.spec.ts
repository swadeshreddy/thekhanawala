import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestuarentListPage } from './restuarent-list.page';

describe('RestuarentListPage', () => {
  let component: RestuarentListPage;
  let fixture: ComponentFixture<RestuarentListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestuarentListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestuarentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
