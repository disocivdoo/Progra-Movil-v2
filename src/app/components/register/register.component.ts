import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/model/user';
import { EducationalLevel } from 'src/app/model/educational-level';
import { Router } from '@angular/router'; // Importar Router
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  educationalLevels: EducationalLevel[] = [];

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private router: Router // Inyectar Router
  ) {}

  ngOnInit(): void {
    this.educationalLevels = this.databaseService.loadEducationalLevels();
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      secretQuestion: ['', Validators.required],
      secretAnswer: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      educationalLevel: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      image: ['default-image.jpg']
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;
      const newUser = User.getNewUsuario(
        formValues.userName,
        formValues.email,
        formValues.password,
        formValues.secretQuestion,
        formValues.secretAnswer,
        formValues.firstName,
        formValues.lastName,
        this.educationalLevels.find(level => level.id === formValues.educationalLevel)!,
        new Date(formValues.dateOfBirth),
        formValues.address,
        formValues.image
      );
      try {
        await this.databaseService.saveUser(newUser);
        alert('Usuario registrado exitosamente.');

        // Redirigir al login después de un registro exitoso
        this.router.navigate(['/login']); // Redirige a la página de login

        // Resetear el formulario después de la redirección
        this.registerForm.reset();
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
      }
    }
  }
}
