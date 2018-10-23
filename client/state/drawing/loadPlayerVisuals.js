import dynamicLoadImage from './dynamicLoadImage'

const loadPlayerVisuals = (gm, x, y, color, data) => {
  let style = { font: "bold 32px Arial", fill: color};
  let newItem = gm.add.text(x, y, data.name, style);
  newItem.anchor.setTo(0, 0.5)

  if(data.profile != null) {
    let dataURI = data.profile
    let imageName = 'profileImage' + data.name // creates unique name by appending the username

    dynamicLoadImage(gm, {x: (x - 100), y: y}, { width:60, height:78 }, imageName, dataURI)
  }
}

export default loadPlayerVisuals
