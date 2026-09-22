import { Species } from '../generated/prisma/enums';
import { prisma } from '../lib/prisma';

export class AnimalService {
  async getAll(input?: Species) {
    let whereClause = {}
    if (input) {
      whereClause = { species: input }
    }
    return prisma.animal.findMany({
      include: { owner: true, patientIdentifier: true },
      where: whereClause,
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    return prisma.animal.findUnique({
      where: { id },
      include: {
        owner: true,
        patientIdentifier: true,
        vaccinations: { orderBy: { administeredDate: 'desc' } },
      },
    });
  }
}

export const animalService = new AnimalService();
