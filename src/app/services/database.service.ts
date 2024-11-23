import { capSQLiteChanges, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';
import { EducationalLevel } from '../model/educational-level';
import { showAlertError } from '../tools/message-functions';
import { convertDateToString, convertStringToDate } from '../tools/date-functions';
import { Asistencia } from '../model/asistencia';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private testUser1!: User;
  private testUser2!: User;
  private testUser3!: User;
  private readonly sqlInsertUpdate = `
    INSERT OR REPLACE INTO USER (
      userName, 
      email, 
      password, 
      secretQuestion, 
      secretAnswer,
      firstName, 
      lastName,
      educationalLevel, 
      dateOfBirth,
      address,
      image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  private dataBaseName = 'DinosaurDataBase';
  private db!: SQLiteDBConnection;
  userList: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private sqliteService: SQLiteService) { }

  loadEducationalLevels(): EducationalLevel[] {
    return EducationalLevel.getLevels(); // Usamos el método getLevels() para obtener todos los niveles
  }

  async initializeDataBase() {
    try {
      await this.sqliteService.createDataBase({ database: this.dataBaseName, upgrade: this.userUpgrades });
      this.db = await this.sqliteService.open(this.dataBaseName, false, 'no-encryption', 1, false);
      this.initializeTestUsers();  // Inicializa usuarios de prueba después de abrir la base de datos
      await this.createTestUsers();
      await this.readUsers();
    } catch (error) {
      showAlertError('DatabaseService.initializeDataBase', error);
    }
  }

  private initializeTestUsers() {
    this.testUser1 = User.getNewUsuario(
      'atorres',
      'atorres@duocuc.cl',
      '1234',
      '¿Cuál es tu animal favorito?',
      'gato',
      'Ana',
      'Torres',
      EducationalLevel.findLevel(6)!,
      new Date(2000, 0, 5),
      'La Florida',
      'default-image.jpg'
    );
  
    this.testUser2 = User.getNewUsuario(
      'jperez',
      'jperez@duocuc.cl',
      '5678',
      '¿Cuál es tu postre favorito?',
      'panqueques',
      'Juan',
      'Pérez',
      EducationalLevel.findLevel(6)!,
      new Date(2000, 1, 10),
      'La Pintana',
      'default-image.jpg'
    );
  
    this.testUser3 = User.getNewUsuario(
      'cmujica',
      'cmujica@duocuc.cl',
      '0987',
      '¿Cuál es tu vehículo favorito?',
      'moto',
      'Carla',
      'Mujica',
      EducationalLevel.findLevel(6)!,
      new Date(2000, 2, 20),
      'Providencia',
      'default-image.jpg'
    );
  }

  private userUpgrades = [
    {
      toVersion: 1,
      statements: [`
        CREATE TABLE IF NOT EXISTS USER (
          userName         TEXT PRIMARY KEY NOT NULL,
          email            TEXT NOT NULL,
          password         TEXT NOT NULL,
          secretQuestion   TEXT NOT NULL,
          secretAnswer     TEXT NOT NULL,
          firstName        TEXT NOT NULL,
          lastName         TEXT NOT NULL,
          educationalLevel INTEGER NOT NULL,
          dateOfBirth      TEXT NOT NULL,
          address          TEXT NOT NULL,
          image            TEXT NOT NULL
        );
      `]
    }
  ];

  private async createTestUsers() {
    try {
      for (const user of [this.testUser1, this.testUser2, this.testUser3]) {
        const existingUser = await this.readUser(user.userName);
        if (!existingUser) {
          await this.saveUser(user);
        }
      }
    } catch (error) {
      showAlertError('DatabaseService.createTestUsers', error);
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      await this.db.run(this.sqlInsertUpdate, [
        user.userName,
        user.email,
        user.password,
        user.secretQuestion,
        user.secretAnswer,
        user.firstName,
        user.lastName,
        user.educationalLevel.id,
        convertDateToString(user.dateOfBirth),
        user.address,
        user.image
      ]);
      await this.readUsers();
    } catch (error) {
      showAlertError('DatabaseService.saveUser', error);
    }
  }

  async readUsers(): Promise<User[]> {
    try {
      const query = 'SELECT * FROM USER;';
      const rows = (await this.db.query(query)).values;
      const users = rows ? rows.map((row: any) => this.rowToUser(row)) : [];
      this.userList.next(users);
      return users;
    } catch (error) {
      showAlertError('DatabaseService.readUsers', error);
      return [];
    }
  }

  async readUser(userName: string): Promise<User | undefined> {
    try {
      const query = 'SELECT * FROM USER WHERE userName=?;';
      const rows = (await this.db.query(query, [userName])).values;
      return rows && rows.length ? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DatabaseService.readUser', error);
      return undefined;
    }
  }

  async deleteByUserName(userName: string): Promise<boolean> {
    try {
      const query = 'DELETE FROM USER WHERE userName=?';
      const result: capSQLiteChanges = await this.db.run(query, [userName]);
      const rowsAffected = result.changes?.changes ?? 0;
      await this.readUsers();
      return rowsAffected > 0;
    } catch (error) {
      showAlertError('DatabaseService.deleteByUserName', error);
      return false;
    }
  }

  async findUser(userName: string, password: string): Promise<User | undefined> {
    try {
      const query = 'SELECT * FROM USER WHERE userName=? AND password=?;';
      const rows = (await this.db.query(query, [userName, password])).values;
      return rows && rows.length ? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DatabaseService.findUser', error);
      return undefined;
    }
  }

  async getUserById(userName: string): Promise<User | undefined> {
    try {
      const query = 'SELECT * FROM USER WHERE userName=?;';
      const rows = (await this.db.query(query, [userName])).values;
      return rows && rows.length ? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DatabaseService.getUserById', error);
      return undefined;
    }
  }
  

  async findUserByUserName(userName: string): Promise<User | undefined> {
    try {
      const query = 'SELECT * FROM USER WHERE userName=?;';
      const rows = (await this.db.query(query, [userName])).values;
      return rows && rows.length ? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DatabaseService.findUserByUserName', error);
      return undefined;
    }
  }

  private rowToUser(row: any): User {
    return User.getNewUsuario(
      row.userName,
      row.email,
      row.password,
      row.secretQuestion,
      row.secretAnswer,
      row.firstName,
      row.lastName,
      EducationalLevel.findLevel(row.educationalLevel) || new EducationalLevel(),
      convertStringToDate(row.dateOfBirth),
      row.address,
      row.image
    );
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const query = 'SELECT * FROM USER WHERE email=?;';
      const rows = (await this.db.query(query, [email])).values;
      return rows && rows.length ? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DatabaseService.findUserByEmail', error);
      return undefined;
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      const query = `
        UPDATE USER
        SET 
          email = ?, 
          password = ?, 
          secretQuestion = ?, 
          secretAnswer = ?, 
          firstName = ?, 
          lastName = ?, 
          educationalLevel = ?, 
          dateOfBirth = ?, 
          address = ?, 
          image = ?
        WHERE userName = ?;
      `;
      await this.db.run(query, [
        user.email,
        user.password,
        user.secretQuestion,
        user.secretAnswer,
        user.firstName,
        user.lastName,
        user.educationalLevel.id,
        convertDateToString(user.dateOfBirth),
        user.address,
        user.image,
        user.userName
      ]);
      await this.readUsers();  // Actualiza la lista de usuarios
    } catch (error) {
      showAlertError('DatabaseService.updateUser', error);
    }
  }
  
  saveAsistencia(asistencia: Asistencia): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Simula la lógica de guardar la asistencia, por ejemplo en una base de datos o API
        console.log('Guardando asistencia:', asistencia);

        // Simulación de éxito
        resolve();

        // Si hay algún error, puedes rechazar la promesa:
        // reject('Error al guardar la asistencia');
      } catch (error) {
        reject(error);
      }
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM USER WHERE userName=?;';
      const rows = (await this.db.query(query, [username])).values;
      return rows && rows.length ? this.rowToUser(rows[0]) : null;
    } catch (error) {
      showAlertError('DatabaseService.getUserByUsername', error);
      return null;
    }
  }
}
