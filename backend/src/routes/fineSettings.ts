import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Get fine settings
router.get('/', async (req, res) => {
  try {
    let settings = await prisma.fineSettings.findFirst();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.fineSettings.create({
        data: {
          lateFeePenalty: 5,
          missingBookPercentage: 200,
          smallDamagePercentage: 10,
          largeDamagePercentage: 50,
        }
      });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fine settings' });
  }
});

// Update fine settings
router.put('/', async (req, res) => {
  try {
    const { lateFeePenalty, missingBookPercentage, smallDamagePercentage, largeDamagePercentage } = req.body;
    
    let settings = await prisma.fineSettings.findFirst();
    
    if (settings) {
      settings = await prisma.fineSettings.update({
        where: { id: settings.id },
        data: { lateFeePenalty, missingBookPercentage, smallDamagePercentage, largeDamagePercentage }
      });
    } else {
      settings = await prisma.fineSettings.create({
        data: { lateFeePenalty, missingBookPercentage, smallDamagePercentage, largeDamagePercentage }
      });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fine settings' });
  }
});

export default router;