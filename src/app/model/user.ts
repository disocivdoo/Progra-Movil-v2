import { EducationalLevel } from './educational-level';
import { Person } from "./person";
import { convertDateToString } from '../tools/date-functions';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

export class User extends Person {
  userName: string = '';
  email: string = '';
  password: string = '';
  secretQuestion: string = '';
  secretAnswer: string = '';
  image: string = '';

  constructor() {
    super();
  }

  static getNewUsuario(
    userName: string,
    email: string,
    password: string,
    secretQuestion: string,
    secretAnswer: string,
    firstName: string,
    lastName: string,
    educationalLevel: EducationalLevel,
    dateOfBirth: Date,
    address: string,
    image: string
  ): User {
    let usuario = new User();
    usuario.userName = userName;
    usuario.email = email;
    usuario.password = password;
    usuario.secretQuestion = secretQuestion;
    usuario.secretAnswer = secretAnswer;
    usuario.firstName = firstName;
    usuario.lastName = lastName;
    usuario.educationalLevel = educationalLevel;
    usuario.dateOfBirth = dateOfBirth;
    usuario.address = address;
    usuario.image = image;
    return usuario;
  }

  override toString(): string {
    return `
      User name: ${this.userName}
      Email: ${this.email}
      Password: ${this.password}
      Secret Question: ${this.secretQuestion}
      Secret Answer: ${this.secretAnswer}
      First name: ${this.firstName}
      Last name: ${this.lastName}
      Education level: ${this.educationalLevel.getEducation()}
      Date of birth: ${convertDateToString(this.dateOfBirth)}
      Address: ${this.address}
      Image: ${this.image !== ''}
    `;
  }


  private assignUserData(usu: User) {
    this.userName = usu.userName;
    this.email = usu.email;
    this.password = usu.password;
    this.secretQuestion = usu.secretQuestion;
    this.secretAnswer = usu.secretAnswer;
    this.firstName = usu.firstName;
    this.lastName = usu.lastName;
    this.educationalLevel = usu.educationalLevel;
    this.dateOfBirth = usu.dateOfBirth;
  }

  navegarEnviandousuario(router: Router, pagina: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        userName: this.userName,
        password: this.password,
      }
    };

    router.navigate([pagina], navigationExtras);
  }

  navegarSinEnviarUsuario(router: Router, pagina: string) {
    router.navigate([pagina]);
  }

  navegarEnviandoPregunta(router: Router, pagina: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        email: this.email,
        secretQuestion: this.secretQuestion,
        secretAnswer: this.secretAnswer,
      }
    };
    router.navigate([pagina], navigationExtras);
  }

  navegarEnviandoTodo(router: Router, pagina: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        userName: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        secretQuestion: this.secretQuestion,
        secretAnswer: this.secretAnswer,
        educationalLevel: this.educationalLevel,
        dateOfBirth: this.dateOfBirth,
        address: this.address,
        image: this.image,
      }
    };
    router.navigate([pagina], navigationExtras);
  }

  validarCorreoPregunta(): string | null {
    if (!this.email) {
      return 'El correo no puede estar vacío.';
    }
    if (!this.secretQuestion || !this.secretAnswer) {
      return 'La pregunta o respuesta de seguridad no pueden estar vacías.';
    }
    return null; // No hay error
  }
}
