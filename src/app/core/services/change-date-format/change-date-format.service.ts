import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChangeDateFormatService {
  changeDateFormat = (dateObj: any) => {
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return dateObj.toLocaleDateString('en-US', options).replace(/,/g, '.');
  };
}
