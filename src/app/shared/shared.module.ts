import { SharedDirectivesModule } from './shared-directives/shared-directives.module';
import { SharedPipesModule } from './shared-pipes/shared-pipes.module';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { RouterModule } from '@angular/router';

const MATERIAL_MODULES: any[] = [
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatButtonModule,
  MatDividerModule,
  MatTableModule,
  MatIconModule,
  MatDialogModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatSortModule,
  MatSelectModule,
  MatCardModule,
  MatStepperModule,
  MatListModule,
  MatCheckboxModule,
  MatRadioModule,
  MatExpansionModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MatBadgeModule,
  MatMenuModule,
  MatSnackBarModule,
  MatTreeModule,
  MatChipsModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatSliderModule,
];

const CDK_MODULES: any[] = [DragDropModule, LayoutModule];

const OTHER_MODULES: any[] = [
  LayoutModule,
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  AngularSlickgridModule,
];

const SHARED_MODULES = [
  SharedDirectivesModule,
  SharedPipesModule,
  SharedComponentsModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...OTHER_MODULES,
    ...MATERIAL_MODULES,
    ...CDK_MODULES,
    ...SHARED_MODULES,
  ],
  exports: [
    ...OTHER_MODULES,
    ...MATERIAL_MODULES,
    ...CDK_MODULES,
    ...SHARED_MODULES,
  ],
})
export class SharedModule {}
