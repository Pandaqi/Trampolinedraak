const loadImageComplete = (gm, pos, dims, name) => {
  let newSprite = gm.add.sprite(pos.x, pos.y, name)
  newSprite.width = dims.width
  newSprite.height = dims.height
  newSprite.anchor.setTo(0.5, 0.5)
}

export default loadImageComplete
