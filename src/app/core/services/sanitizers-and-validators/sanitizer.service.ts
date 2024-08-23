import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SanitizerService {
  spaceSanitizer(event: KeyboardEvent, input?: string) {
    if (event.key === ' ')
      if (!input || input.trimEnd() !== input) event.preventDefault();
  }

  numberSanitizer(event: KeyboardEvent) {
    if (event.key === 'e') event.preventDefault();
  }
}
