import { Router } from 'express';
import { animalService } from '../services';
import { asyncHandler } from '../middleware/errorHandling';
import { Species } from '../generated/prisma/enums';

export const animalsRouter = Router();
function isSpecies(raw: string): raw is Species {
  if ((Object.values(Species) as string[]).includes(raw)) {
    return true
  }
  return false
}

animalsRouter.get('/', asyncHandler(async (req, res) => {
  let raw = req.query.species;
  if (typeof raw === 'string') {
    raw = raw.toUpperCase()
  }
  
  if (raw != null && typeof raw === 'string' && isSpecies(raw)) {
    const animals = await animalService.getAll(raw)
    res.json({ data: animals })
    return
  }
  if (raw == null) {
    const animals = await animalService.getAll();
    res.json({ data: animals, meta: { count: animals.length } });
    return
  }
  res.status(400).json({ error: { code: 'NOT_FOUND', message: 'Animal not found' } });
}));

animalsRouter.get('/:id', asyncHandler(async (req, res) => {
  const animal = await animalService.getById(req.params.id);
  if (!animal) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Animal not found' } });
    return;
  }
  res.json({ data: animal });
}));
