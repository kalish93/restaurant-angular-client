import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
import { jwtDecode } from 'jwt-decode';
import { Restaurant } from '../../models/restaurant.model';

interface SettingsComponentState {
  restaurant: Restaurant | null;
  accessToken: any;
}

const initSettingsComponentState: Partial<SettingsComponentState> = {
  restaurant: null,
  accessToken: undefined,
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;

  restaurant$ = this.state.select('restaurant');
  restaurant: any;
  accessToken$ = this.state.select('accessToken');
  decoded: any;

  constructor(
    private fb: FormBuilder,
    private state: RxState<SettingsComponentState>,
    private restaurantFacade: RestaurantFacade,
    private authFacade: AuthFacade
  ) {
    this.state.set(initSettingsComponentState);
    this.state.connect('restaurant', this.restaurantFacade.selectedRestaurant$)
    this.state.connect('accessToken', this.authFacade.accessToken$)
    this.state.connect('accessToken', this.authFacade.accessToken$);
    this.accessToken$.subscribe((token)=>{
       this.decoded = jwtDecode(token);
       this.restaurantFacade.dispatchGetRestaurant(this.decoded.restaurantId);

    })
    this.settingsForm = this.fb.group({
      taxRate: [null, [Validators.required, Validators.min(0)]],
      restaurantStatus: [false],
    });
  }

  ngOnInit(): void {
    this.restaurant$.subscribe((data)=>{
      this.restaurant = data;
      this.loadSettings();

    })

  }

  loadSettings() {
    this.settingsForm.patchValue({
      taxRate: this.restaurant?.taxRate,
      restaurantStatus: this.restaurant?.isOpen,
    });
  }

  onOpenOrClose() {
    const dataToSend = {
      restaurantId: this.restaurant.id,
      isOpen: !this.restaurant.isOpen,
    };

    this.restaurantFacade.dispatchUpdateRestaurantStatus(dataToSend);
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      const settings = this.settingsForm.value;
      const dataToSend = {
        restaurantId: this.restaurant.id,
        taxRate: settings.taxRate
      }

      this.restaurantFacade.dispatchUpdateRestaurantTaxRate(dataToSend);
    }
  }
}
