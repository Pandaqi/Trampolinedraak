import loadImageComplete from './loadImageComplete'

const dynamicLoadImage = (gm, pos, dims, name, dataURI) => {
  let doesKeyExist = gm.cache.checkKey(Phaser.Cache.IMAGE, name)
  if(!doesKeyExist) {
    // load the image; display once loaded
    var loader = new Phaser.Loader(gm); 
    loader.image(name, dataURI+'');
    loader.onLoadComplete.addOnce(loadImageComplete, this, 0, gm, pos, dims, name);
    loader.start();
  } else {
    // if image was already in cache, just add the sprite (but don't load it again)
    loadImageComplete(gm, pos, dims, name)
  }
}

export default dynamicLoadImage
