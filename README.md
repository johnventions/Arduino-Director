
# Director
Director is a web-based animatronics control system for Arduino created by [John Horton](https://twitter.com/johnventions). Director gives you a web interface for planning out and testing servo motion instead of hard-coding sequences onto a microcontroller. All of the data is stored on the computer and sent via Serial to your Arduino, which is constantly listening for commands. With the most basic version of Director a custom animatronic can be built with less than 30 lines of code.

This project contains both the C++ Library for Director to include in your Arduino files as well as the web interface software (Node Express server with a Vue front-end and MongoDB storage) needed to plan out your animatronic motion.

## Requirements

 - [NPM](https://www.npmjs.com/get-npm) (Node Package Manager)
 -  [Mongo DB](https://docs.mongodb.com/v3.2/administration/install-community/) - running on port 27017 
 - [GulpJS](https://gulpjs.com/docs/en/getting-started/quick-start) - Task manager for compiling JS and CSS

## Arduino Basic Example
The most basic example of Director involves creating a Director object and the Actor Servos that it can control. Adjust the sample code to your setup and flash to your Arduino device. Alternatively, see the example in the examples folder.

```c++
#include  <Servo.h>
#include  <Director.h>  

Director director;
Servo myservo;
ActorServo actors[] = {
	ActorServo("Mouth", 9), //each servo has a name and pin number
	ActorServo("LeftEye", 8),
	ActorServo("RightEye", 7)
};
void  setup() {
	Serial.begin(500000);
	Serial.setTimeout(50);
	director.Assign(actors, 3);  //assign the servos and indicate number of servos
	director.StartServos();		//setup the servos
}
void  loop() {
	director.Listen();	//tell director to listen to commands
	delay(1);
}
```

## Getting Started (Web Interface)

 - Clone the repo to your Arduino Libraries directory
	 - (i.e. C:\users\username\Documents\Arduino\libraries)
 - Start Mongo DB (if not running)
 - NPM Install in the "interface" folder
 - Start the application (npm start)
```
    cd interface
    npm install
    npm start
```
After running "npm start", the application should open in your web browser at locahost:5000

## Demo Video
[Here is a demo video](https://www.youtube.com/watch?v=AfgRimX_5pM) of the interface running with 3 motors. The # of servos is only limited by the number of digital pins available on your device.

## Interface Tutorial
### Home screen
The home screen will scan the ports and show all of the connected devices in the sidebar. In the main panel, select an existing animatronic or click "Add Machine" to create a new one.
![Screen 1](https://i.imgur.com/gvd1Iq8.png)

### Sidebar Options
After connected to your Arduino, the device will request "OPTIONS" from the Arduino to get the list of available "Actor Servos". The Commands panel lets you send direct commands to the Arduino (i.e. SERVO:0,50 to tell Servo 0 to go to 50 degrees)
![Screen 2](https://i.imgur.com/wSlKqgo.png)

### Sequence Select
When a machine is selected, the list of Sequences will appear. Each animatronic can have multiple sequences. Click "Add Sequence" to create a new sequence.
![Screen 3](https://i.imgur.com/OFO9jX3.png)

### Sequence Edit
When a sequence is selected it will allow you to put in the URL of the audio track associated with the sequence. 

 - Click the graph to add a new point to the timeline or drag/drop existing points. 
 - Shift + click to delete a point.
 - Magnifying glass icons to zoom in/out of the timeline
 - Left / Right arrows to pan left/right.
 - The play/pause buttons will activate the sequence and send the commands to the Arduino
 
 The name next to each chart should match exactly to an Actor servo so that the interface knows which command to send
![Screen 4](https://i.imgur.com/4LbAqst.png)

When the sequence is being played, a preview of the motion will be shown on the screen to help visualize the activity.
![Screen 5](https://i.imgur.com/A8kBDiI.png)

### Audio Track
To add an audio track, place the file in the 'interface/dist folder', or a folder inside of dist (like "audio"). In the audio track field, type in the file name of the file. For example "/myfile.mp3" or "/audio/myfile.mp3" - do not include the "interface/dist" portion. Then hit the refresh icon to have the page load the audio file.

Audio can use mp3, wav, or any file supported by the Wavesurfer JS library

### Save Button
Be sure to hit the "Save" button when you're happy with your updates, the interface does not save automatically :)

## Upcoming Features
 - "Record" Function - record motion data via a potentiometer
 - "Actor Buttons" - connect button inputs to trigger sequences
 - "Actor Functions" - custom C++ functions that can be called via the interface. For example:
	 - Trigger LEDs
	 - Activate relays
 - Audio upload button
 - Autoplay functionality (Routines)

## Thanks
 - The Arduino community
 - Wavesurfer JS
