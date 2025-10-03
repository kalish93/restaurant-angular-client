import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
contactForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      restaurant: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  submitContact() {
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;
    // Replace with your backend API endpoint
    fetch('https://contact-5wcrv0lfs-kaleab-tekaligns-projects.vercel.app/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.contactForm.value)
    })
      .then(res => {
        if (res.ok) {
          this.snackBar.open('Message sent successfully!', 'Close', { duration: 3000 });
          this.contactForm.reset();
        } else {
          this.snackBar.open('Failed to send message. Try again.', 'Close', { duration: 3000 });
        }
        this.isSubmitting = false;
      })
      .catch(err => {
        console.error(err);
        this.snackBar.open('Something went wrong. Please try again.', 'Close', { duration: 3000 });
        this.isSubmitting = false;
      });
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  goToRegister(){
    this.router.navigate(['/register']);
  }
}
