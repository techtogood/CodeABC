// import "phaser";
import MusicManager from "@/plugins/musicManager";
import Router from "@/plugins/router";

declare module "phaser" {
  interface Scene {
    musicManager: MusicManager;
    router: Router;
  }
}