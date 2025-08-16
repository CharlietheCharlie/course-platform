export function formatPlural(
  count: number,
  { singular, plural }: { singular: string; plural: string },
  { includeCount = true }: { includeCount?: boolean } = {}
) {
  const word = count === 1 ? singular : plural;
  return includeCount ? `${count} ${word}` : word;
}

export function formatPrice(priceInDollars: number, {showZeroAsNumber = false}: {showZeroAsNumber?: boolean} = {}) {
 const formatter = new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
   minimumFractionDigits: Number.isInteger(priceInDollars) ? 0 : 2,
 })

 if(!showZeroAsNumber && priceInDollars === 0) {
   return 'Free';
 } else {
   return formatter.format(priceInDollars);
 }
} 

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
 dateStyle: 'medium',
 timeStyle: 'short',
});

export function formatDate(date: Date) {
  return DATE_FORMATTER.format(date);
} 