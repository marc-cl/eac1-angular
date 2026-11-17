import { Service, signal } from '@angular/core';
import { CercaDesada } from '../models/element.model';

const MAX_CERQUES = 8;

@Service()
export class HistorialCerquesService {
  private readonly clauStorage = 'cataleg-historial-cerques';
  private readonly historialSignal = signal<CercaDesada[]>(this.llegir());

  readonly historial = this.historialSignal.asReadonly();

  /** Desa una cerca confirmada, evitant repetir la mateixa cerca dues vegades consecutives */
  desar(text: string, categoria: string): void {
    const textNormalitzat = text.trim();
    if (textNormalitzat.length < 3) {
      return;
    }

    const novaCerca: CercaDesada = {
      text: textNormalitzat,
      categoria,
      data: new Date().toISOString(),
    };
    const anterior = this.historialSignal()[0];

    if (anterior?.text === novaCerca.text && anterior.categoria === novaCerca.categoria) {
      return;
    }

    this.historialSignal.update((historial) => [novaCerca, ...historial].slice(0, MAX_CERQUES));
    this.escriure();
  }

  netejar(): void {
    this.historialSignal.set([]);
    this.escriure();
  }

  private llegir(): CercaDesada[] {
    try {
      const dades = localStorage.getItem(this.clauStorage);
      const historial: unknown = dades ? JSON.parse(dades) : [];

      if (!Array.isArray(historial)) {
        return [];
      }

      return historial.filter(
        (cerca): cerca is CercaDesada =>
          typeof cerca?.text === 'string' &&
          typeof cerca?.categoria === 'string' &&
          typeof cerca?.data === 'string',
      );
    } catch {
      return [];
    }
  }

  private escriure(): void {
    try {
      localStorage.setItem(this.clauStorage, JSON.stringify(this.historialSignal()));
    } catch {
      // La cerca continua funcionant encara que el navegador no permeti persistir-la.
    }
  }
}
