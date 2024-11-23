export class EducationalLevel {
  id: number;
  name: string;

  private static levels: EducationalLevel[] = [
    new EducationalLevel(1, 'Básica Incompleta'),
    new EducationalLevel(2, 'Básica Completa'),
    new EducationalLevel(3, 'Media Incompleta'),
    new EducationalLevel(4, 'Media Completa'),
    new EducationalLevel(5, 'Superior Incompleta'),
    new EducationalLevel(6, 'Superior Completa')
  ];

  constructor(id: number = 1, name: string = 'Básica Incompleta') {
    this.id = id;
    this.name = name;
  }

  // Método para cambiar el nivel
  setLevel(id: number, name: string): void {
    this.id = id;
    this.name = name;
  }

  static findLevel(id: number): EducationalLevel | undefined {
    return EducationalLevel.levels.find(level => level.id === id);
  }

  static getLevels(): EducationalLevel[] {
    return EducationalLevel.levels;
  }

  getEducation(): string {
    return `${this.id} - ${this.name}`;
  }
}
