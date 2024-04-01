import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFileByUrlComponent } from './get-file-by-url.component';

describe('GetFileByUrlComponent', () => {
  let component: GetFileByUrlComponent;
  let fixture: ComponentFixture<GetFileByUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetFileByUrlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetFileByUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
