import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './store/auth.state';


@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule, NgxsModule.forFeature([AuthState])],
})
export class AuthModule {}
