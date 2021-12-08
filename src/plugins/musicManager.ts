/**
 * 使用插件的方式，控制全局音频的播放
 */

export default class MusicManager extends Phaser.Plugins.BasePlugin {
  bgm: Phaser.Sound.WebAudioSound;
  time: number;
  playingMap: Map<string, Phaser.Sound.BaseSound> = new Map();
  constructor(pluginManager) {
    super(pluginManager);
  }
  playBgm(markerName: string) {
    if (this.bgm) return;
    this.bgm = <Phaser.Sound.WebAudioSound>this.game.sound.add(markerName);
    this.time = window.setInterval(() => {
      if (Math.floor(this.bgm.seek) > Math.floor(this.bgm.duration)) {
        // console.log(this.bgm.seek, this.bgm.duration);
        //解决phaser的scene restart 后导致不能循环播放的bug
        clearInterval(this.time);
        this.bgm.destroy();
        this.bgm = null;
        this.playBgm(markerName);
      }
    }, 1000);
    this.bgm.on("complete", () => {
      // console.log("complete");
      clearInterval(this.time);
      this.bgm.destroy();
      this.bgm = null;
      this.playBgm(markerName);
    });
    this.bgm.play();
  }
  updateBgm(markerName?: string) {
    this.time && clearInterval(this.time);
    this.bgm && this.bgm.destroy();
    this.bgm = null;
    this.playBgm(markerName);
  }
  pauseBgm() {
    this.bgm && this.bgm.pause();
  }
  resumeBgm() {
    this.bgm && this.bgm.resume();
  }
  add(markerName?: string, config?: Phaser.Types.Sound.SoundConfig) {
    let music = this.playingMap.get(markerName);
    if (music) return music;
    music = this.game.sound.add(markerName, config);
    this.playingMap.set(markerName, music);
    return music;
  }
  play(markerName?: string, config?: Phaser.Types.Sound.SoundConfig) {
    let music = this.playingMap.get(markerName);
    if (music) {
      music.play();
      return music
    };
    music = this.game.sound.add(markerName, config);
    music.play();
    this.playingMap.set(markerName, music);
    return music;
  }
  pause(markerName?: string) {
    if (markerName) {
      const music = this.playingMap.get(markerName);
      music && music.pause();
    } else {
      for (let music of this.playingMap.values()) {
        music.pause();
      }
    }
  }
  resume(markerName?: string) {
    if (markerName) {
      const music = this.playingMap.get(markerName);
      music && music.resume();
    } else {
      for (let music of this.playingMap.values()) {
        music.resume();
      }
    }
  }
  stop(markerName?: string) {
    if (markerName) {
      const music = this.playingMap.get(markerName);
      music && music.stop();
    } else {
      for (let music of this.playingMap.values()) {
        music.stop();
      }
      this.playingMap.clear();
    }
  }
  clear() {
    for (let music of this.playingMap.values()) {
      music.destroy();
    }
    this.playingMap.clear();
  }
}