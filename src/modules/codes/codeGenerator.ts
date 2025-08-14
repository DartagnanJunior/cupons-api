export type DecisionArgs = {
  generation_amount: number | null;
  generation_pattern: string | null;
  max_codes_amount: number | null;
};

export type DecisionResult = {
  amountToGenerate: number;
  patternToUse: string | null;
};

export type GenerateCodesParams = {
  amount: number;
  pattern: string | null;
  maxAttempts?: number;
};

export function decisionCodeGeneration({ generation_amount, generation_pattern, max_codes_amount }: DecisionArgs): DecisionResult {
  let amountToGenerate = generation_amount ?? (generation_pattern ? 1 : 0);
  let patternToUse = generation_pattern ?? null;

  if (max_codes_amount != null) {
    amountToGenerate = Math.min(amountToGenerate, max_codes_amount);
  }

  return { amountToGenerate, patternToUse };
}

export function codeFromPattern(pattern: string): string {
  const A = 'A'.charCodeAt(0);
  const randLetter = () => String.fromCharCode(A + Math.floor(Math.random() * 26));
  const randDigit = () => Math.floor(Math.random() * 10).toString();

  return pattern
    .split('')
    .map((ch) => (ch === 'X' ? randLetter() : ch === '9' ? randDigit() : ch))
    .join('');
}

export function defaultPattern(): string {
  return 'XXXX-999999';
}

export function generateCodes({ amount, pattern, maxAttempts = amount * 10 + 50 }: GenerateCodesParams): string[] {
  const set = new Set<string>();
  let attempts = 0;

  while (set.size < amount && attempts < maxAttempts) {
    const pat = pattern ?? defaultPattern();
    set.add(codeFromPattern(pat));
    attempts++;
  }

  if (set.size < amount) {
    throw new Error('Failed to generate unique codes after multiple in-memory attempts.');
  }

  return Array.from(set);
}
