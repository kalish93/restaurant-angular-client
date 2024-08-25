import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryFacade } from '../../facades/category.facade';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';


interface MenuFormState{
  categories: Category[]
}

const initMenuFormState : MenuFormState = {
  categories:[]
}


@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.scss',
  providers: [RxState]
  
})
export class MenuFormComponent implements OnInit {

  addMenuForm!: FormGroup;
  menuType: "menuOnly" | "menuWithStock" = "menuOnly"
  categories: Category[] = [];


  categories$: Observable<Category[]> = this.state.select('categories');
    constructor(private fb: FormBuilder, private categoryFacade: CategoryFacade,private state: RxState<MenuFormState>){
    this.state.set(initMenuFormState);
    this.state.connect('categories', categoryFacade.categories$);
    this.addMenuForm = this.fb.group({
      category: [
        '',
        [
          Validators.required,
        ],
      ],
      name: [
        '',
        [Validators.required],
      ],
      ingredients: [
        '',
        [],
      ],
      price: ['', [Validators.required, Validators.min(0)]],
      quanitity:['']
    });
  }

ngOnInit(): void {
  this.categoryFacade.dispatchGetCategories();
  this.categories$.subscribe(cat=> this.categories = cat);
}

onMenuTypeChange(event:MatSelectChange){
  this.menuType = event.value;
}

submitForm(){
 const {} =  this.addMenuForm.value;
}

}
