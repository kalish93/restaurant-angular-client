import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { API_BASE_URL, MEDIA_URL } from 'src/app/core/constants/api-endpoints';
import { MenuFacade } from 'src/app/restaurant/facades/menu.facade';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';
import { Menu } from 'src/app/restaurant/models/menu.model';

interface MenuPreviewComponentState {
  restaurant: any;
  menus: Menu[];
}

const initMenuPreviewComponentState: MenuPreviewComponentState = {
  restaurant: null,
  menus: [],
};

@Component({
  selector: 'app-menu-preview', // <-- Updated Selector
  templateUrl: './menu-preview.component.html',
  styleUrls: ['./menu-preview.component.scss'],
  providers: [RxState],
})
export class MenuPreviewComponent implements OnInit, OnChanges {
  // <-- Added OnChanges
  // --- INPUTS FOR APPEARANCE CUSTOMIZATION ---
  @Input() primaryColor: string = '#F97316';
  @Input() secondaryColor: string = '#F9FAFB';
  @Input() accentColor: string = '#374151';

  // Property to hold the dynamic CSS styles for the preview container
  public previewStyles: { [key: string]: string } = {};
  // ------------------------------------------

  $restaurant = this.state.select('restaurant');
  restaurant: any = null;
  restaurantId: string | null = null;
  tableId: string | null = null;
  menus: Menu[] = [];
  menus$ = this.state.select('menus');

  categorizedMenus: { [category: string]: Menu[] } = {};
  selectedCategory: string | null = null;
  searchTerm: string = '';

  constructor(
    private state: RxState<MenuPreviewComponentState>,
    private restaurantFacade: RestaurantFacade,
    private menuFacade: MenuFacade,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.state.set(initMenuPreviewComponentState);
    this.state.connect('restaurant', this.restaurantFacade.selectedRestaurant$);
    this.state.connect('menus', this.menuFacade.menus$);
  }

  ngOnInit(): void {
    // Note: If this component is used solely as a preview (without URL routing)
    // the route.paramMap logic is unnecessary, but kept for completeness

    // The restaurant ID here should come from a service/state in the actual app
    // For the purpose of the preview, we'll assume the parent component handles fetching the data
    // based on a placeholder ID, or the data is available in the facade.

    this.$restaurant.subscribe((data) => {
      this.restaurant = data;
      // Fetch data based on the restaurant object's ID if available
      if (this.restaurant?.id) {
        this.menuFacade.dispatchGetMenuByRestaurant(this.restaurant.id);
      }
    });

    this.menus$.subscribe((data) => {
      this.menus = data;
      this.categorizeMenus();
    });

    // Initialize styles on load
    this.updatePreviewStyles();
  }

  // ----------------------------------------------------
  // --- LIFECYCLE HOOK AND COLOR MAPPING FUNCTIONALITY ---
  // ----------------------------------------------------

  /**
   * Updates CSS variables whenever an @Input() color property changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['primaryColor'] ||
      changes['secondaryColor'] ||
      changes['accentColor']
    ) {
      this.updatePreviewStyles();
    }
  }

  /**
   * Maps the Angular Inputs to CSS Variables for dynamic styling in the template.
   */
  private updatePreviewStyles(): void {
    // Map the colors to the CSS variables used in the HTML template
    this.previewStyles = {
      '--primary-color': this.primaryColor,
      '--primary-ring': this.primaryColor,
      '--price-color': this.secondaryColor, // Secondary color for price text

      // Accent color controls the active filter state
      // We'll use a slightly lighter/darker version of the primary color for text contrast
      '--active-filter-bg': this.accentColor,
      '--active-filter-text': this.primaryColor, // Use Primary for contrast text
    };
  }

  // ----------------------------------------------------
  // --- ORIGINAL FUNCTIONALITY (no changes needed) ---
  // ----------------------------------------------------

  getImageUrl(imagePath: string): string {
    return `${MEDIA_URL}/${imagePath}`;
  }

  get availableCategories(): string[] {
    return Object.keys(this.categorizedMenus);
  }

  get filteredMenus() {
    let result = this.menus;
    if (this.selectedCategory) {
      result = result.filter(
        (menu) => menu.category.name === this.selectedCategory
      );
    }
    if (this.searchTerm && this.searchTerm.trim().length > 0) {
      const q = this.searchTerm.trim().toLowerCase();
      result = result.filter(
        (menu) =>
          menu.name?.toLowerCase().includes(q) ||
          menu.ingredients?.toLowerCase().includes(q) ||
          menu.category?.name?.toLowerCase().includes(q)
      );
    }
    return result;
  }

  setCategoryFilter(category: string | null) {
    this.selectedCategory = category;
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
  }

  getFilterButtonClass(category: string | null): string {
    const baseClasses =
      'rounded-full px-6 py-2.5 text-sm font-medium whitespace-nowrap transition-all';

    if (this.selectedCategory === category) {
      return `${baseClasses} bg-[var(--active-filter-bg)] text-[var(--active-filter-text)] shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]`;
    } else {
      return `${baseClasses} bg-white text-gray-700 shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]`;
    }
  }

  categorizeMenus(): void {
    this.categorizedMenus = this.menus.reduce((acc, item) => {
      const category = item.category?.name || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as { [category: string]: Menu[] });
  }
}
