import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryFacade } from '../../facades/category.facade';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuFacade } from '../../facades/menu.facade';
import { Menu } from '../../models/menu.model';

interface MenuFormState {
  categories: Category[];
}

const initMenuFormState: MenuFormState = {
  categories: [],
};

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.scss',
  providers: [RxState],
})
export class MenuFormComponent implements OnInit {
  addMenuForm!: FormGroup;
  menuType: 'menuOnly' | 'menuWithStock' = 'menuOnly';
  categories: Category[] = [];
  imageFile: File | null = null;

  categories$: Observable<Category[]> = this.state.select('categories');

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryFacade: CategoryFacade,
    private menuFacade: MenuFacade,
    public dialogRef: MatDialogRef<MenuFormComponent>,
    private state: RxState<MenuFormState>
  ) {
    this.state.set(initMenuFormState);
    this.state.connect('categories', categoryFacade.categories$);
    this.addMenuForm = this.fb.group({
      category: ['', [Validators.required]],
      name: ['', [Validators.required]],
      ingredients: ['', []],
      price: ['', [Validators.required, Validators.min(0)]],
      itemType: ['', Validators.required],  // New form control for item type
    });
    if (data) {
      this.addMenuForm.patchValue({
        ...data,
      });
    }

    if (data?.stockItem) {
      this.setStockItemData(data.stockItem);
    } else if (data?.editableItem) {
      this.setEditMenuItemData(data?.editableItem);
    }
  }

  ngOnInit(): void {
    this.categoryFacade.dispatchGetCategories();
    this.categories$.subscribe((data) => {
      this.categories = data;
    });

  }

  setStockItemData(stockItem: any): void {
    this.addMenuForm.patchValue({
      name: stockItem.name,
      ingredients: stockItem.ingredients,
      // Populate other fields as needed
    });
  }

  setEditMenuItemData(menuItem: Menu): void {
    this.addMenuForm.patchValue({
      name: menuItem.name,
      ingredients: menuItem.ingredients,
      price: menuItem.price,
      category: menuItem.category.id,
      itemType: menuItem.destination
    });

    this.imageFile = menuItem.image as any;
  }


  onMenuTypeChange(event: MatSelectChange) {
    this.menuType = event.value;
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.addMenuForm.valid && this.imageFile) {
      const formData = new FormData();
      formData.append('name', this.addMenuForm.get('name')?.value);
      formData.append('ingredients', this.addMenuForm.get('ingredients')?.value);
      formData.append('categoryId', this.addMenuForm.get('category')?.value);
      formData.append('price', this.addMenuForm.get('price')?.value);
      formData.append('quantity', this.addMenuForm.get('quantity')?.value);
      formData.append('image', this.imageFile);
      formData.append('destination',  this.addMenuForm.get('itemType')?.value);

      if(this.data?.editableItem){
        formData.append('id', this.data?.editableItem?.id);
        this.menuFacade.dispatchUpdateMenu(this.data.editableItem.id, formData);
      }else if(this.data?.stockItem){
        formData.append('stockId', this.data?.stockItem?.id);
        this.menuFacade.dispatchCreateMenu(formData);
      }else{
        this.menuFacade.dispatchCreateMenu(formData);
      }

      // if (this.data) {
      //   this.menuFacade.dispatchUpdateMenu(this.data.id, formData);
      // } else {
      //   this.menuFacade.dispatchCreateMenu(formData);
      // }

      this.dialogRef.close(formData);
    }
  }
}
