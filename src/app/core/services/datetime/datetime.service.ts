import { Injectable } from '@angular/core';
import { DATE_TIME_URL } from '../../constants/api-endpoints';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getCurrentDateTime(): Observable<string> {
    return this.http.get<string>(`${DATE_TIME_URL}/now`, this.httpOptions);
  }

  getDateOnly(date: Date) {
    var dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    return dateOnly.toISOString().slice(0, 10);
  }

  convertTimeToAMPM(time: any) {
    var splitTime = time.split(':');
    var hours = parseInt(splitTime[0], 10);
    var minutes = parseInt(splitTime[1], 10);

    var period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    var convertedTime =
      hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + period;

    return convertedTime;
  }

  convertTimeTo24HourFormat(time: any) {
    var splitTime = time.split(' ');
    var hoursMinutes = splitTime[0].split(':');
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = parseInt(hoursMinutes[1], 10);
    var period = splitTime[1].toUpperCase();

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    var convertedTime =
      (hours < 10 ? '0' + hours : hours) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':00';

    return convertedTime;
  }

  compareTimes(time1: any, time2: any) {
    var date1 = new Date();
    var date2 = new Date();

    var [hours1, minutes1] = time1.split(':');
    var [hours2, minutes2] = time2.split(':');

    date1.setHours(hours1, minutes1, 0);
    date2.setHours(hours2, minutes2, 0);

    var comparison = 0;

    if (date1 > date2) {
      comparison = 1;
    } else if (date1 < date2) {
      comparison = -1;
    }

    return comparison;
  }
}
