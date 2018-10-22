export const isDown = (game, key) => game.input.keyboard.isDown(key)
export const createText = (game, target) =>
  game.add.text(target.x, target.y, '', {
    fontSize: '12px',
    fill: '#FFF',
    align: 'center'
  })
export const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
