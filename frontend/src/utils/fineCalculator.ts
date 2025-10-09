export interface FineCalculation {
  lateFee: number;
  missingFee: number;
  damageFee: number;
  totalFine: number;
  daysLate: number;
}

export function calculateFine(
  dueDate: Date,
  returnDate: Date | null,
  bookPrice: number,
  damagePercentage: number = 0
): FineCalculation {
  const today = new Date();
  const actualReturnDate = returnDate || today;
  
  // Calculate days late
  const daysLate = Math.max(0, Math.floor((actualReturnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Late fee: ₹50 per day
  const lateFee = daysLate * 50;
  
  // Missing fee: 200% of book price if returned after deadline (or not returned)
  const missingFee = daysLate > 0 ? bookPrice * 2 : 0;
  
  // Damage fee: percentage of book price
  const damageFee = (damagePercentage / 100) * bookPrice;
  
  const totalFine = lateFee + missingFee + damageFee;
  
  return {
    lateFee,
    missingFee,
    damageFee,
    totalFine,
    daysLate
  };
}