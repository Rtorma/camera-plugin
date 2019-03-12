import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { CameraPreview, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.css'],
  providers: [ScreenOrientation]
})
export class AppComponent {

  @ViewChild('canvas') canvasEl: ElementRef;
  private _CANVAS: any;
  private _CONTEXT: any;

  picture: any;

  pictureOpts: CameraPreviewPictureOptions;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private cameraPreview: CameraPreview,
    private screenOrientation: ScreenOrientation,
    public navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      let options = {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
        toBack: true,
        tapPhoto: false,
        tapFocus: false,
        previewDrag: false
      };

      // picture options
      this.pictureOpts = {
        width: 1280,
        height: 1280,
        quality: 100
      }

      this.cameraPreview.startCamera(options);

      console.log("focus mode: " + this.cameraPreview.getFocusMode());

      this._CANVAS = this.canvasEl.nativeElement;
      this._CANVAS.width = window.screen.width;
      this._CANVAS.height = window.screen.height;

      this.initialiseCanvas();

      // setTimeout(() => {
      //   this.takePic();
      // }, 1000);
    
    });
  }

  initialiseCanvas() {
    if (this._CANVAS.getContext) {
      this.setupCanvas();
    }
  }

  drawSquare(x: any, y: any): void {
    this.clearCanvas();
    this._CONTEXT.beginPath();
    this._CONTEXT.rect(x - 30, y - 30, 60, 60);
    this._CONTEXT.lineWidth = 1;
    this._CONTEXT.strokeStyle = '#ffffff';
    this._CONTEXT.stroke();
  }

  setupCanvas(): void {
    this._CONTEXT = this._CANVAS.getContext('2d');
    //this._CONTEXT.fillStyle = "#3e3e3e";
    //this._CONTEXT.fillRect(0, 0, 500, 500);
  }

  clearCanvas(): void {
    this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
    this.setupCanvas();
  }

  touchFocus(event: any) {
    console.log(event.x);
    console.log(event.y);

    this.drawSquare(event.x, event.y);

    this.cameraPreview.tapToFocus(event.x, event.y);

  }

  switchCamera() {
    this.clearCanvas();
    this.cameraPreview.switchCamera();
  }


  takePic() {
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
      this.picture = 'assets/img/test.jpg';
    });
    
  }
}
