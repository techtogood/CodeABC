/**
 * 参考模板
 */
export default {
  preload: {
    files: [
      {
        type: 'image',
        key: 'one',
        url: require('./images/1.png'),
      },
        type: 'audio',
        key: 'goAudio',
        url: require('./audio/word-go.mp3'),
      },
    
      {
        type: 'spritesheet',
        key: 'yummyDaze',
        url: require('./sprites/yummy-daze.png'),
        frameConfig: {
          frameWidth: 257,
          frameHeight: 270,
        },
      },
      {
        type: 'json',
        key: 'animationJSON',
        url: require('../animations/animations.json'),
      },
    ],
  },
};
