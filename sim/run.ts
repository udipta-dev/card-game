// Balance lab runner. Usage: npm run sim [gamesPerOrientation]
import { formatReport, runBalance } from '@ai/balanceLab';

const perSide = Number(process.argv[2] ?? 400);
process.stdout.write(formatReport(runBalance(perSide)));
