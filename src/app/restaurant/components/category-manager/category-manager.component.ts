import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { CategoryFacade } from '../../facades/category.facade';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';

interface CategoryManagerState {
  categories: Category[];
}

const initState: CategoryManagerState = {
  categories: [],
};

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss'],
  providers: [RxState],
})
export class CategoryManagerComponent implements OnInit {
  categories$: Observable<Category[]> = this.state.select('categories');
  categories: Category[] = [];
  newCategoryName = '';
  editingCategoryId: string | null = null;
  editingCategoryName = '';
  private restaurantId: string | null = null;

  constructor(
    private state: RxState<CategoryManagerState>,
    private categoryFacade: CategoryFacade,
    private restaurantFacade: RestaurantFacade,
    private dialogRef: MatDialogRef<CategoryManagerComponent>,
    private dialog: MatDialog
  ) {
    this.state.set(initState);
    this.state.connect('categories', this.categoryFacade.categories$);
  }

  ngOnInit(): void {
    this.categories$.subscribe((list) => (this.categories = list));
    this.restaurantFacade.selectedRestaurant$.subscribe((r: any) => {
      this.restaurantId = r?.id ?? r?._id ?? null;
      if (this.restaurantId) {
        this.categoryFacade.dispatchGetCategoriesByRestaurant(this.restaurantId);
      }
    });
  }

  addCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name || !this.restaurantId) return;
    this.categoryFacade.dispatchCreateCategory(name, this.restaurantId);
    this.newCategoryName = '';
  }

  startEdit(category: Category): void {
    this.editingCategoryId = category.id;
    this.editingCategoryName = category.name;
  }

  saveEdit(): void {
    if (!this.editingCategoryId || !this.restaurantId) return;
    const name = this.editingCategoryName.trim();
    if (!name) return;
    this.categoryFacade.dispatchUpdateCategory(
      this.editingCategoryId,
      name,
      this.restaurantId
    );
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to delete "${category.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.categoryFacade.dispatchDeleteCategory(category.id);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
