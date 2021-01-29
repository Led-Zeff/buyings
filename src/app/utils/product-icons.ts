export const icons = ['american-football-outline','baseball-outline','basketball-outline','beer-outline','bulb-outline',
                      'cafe-outline','fast-food-outline','fish-outline','game-controller-outline','headset-outline','glasses-outline','ice-cream-outline',
                      'nutrition-outline','pizza-outline','rose-outline','shirt-outline','tennisball-outline','wine-outline','watch-outline'];

export function randomIcon(): string {
  return icons[Math.floor((Math.random() * icons.length))];
}
