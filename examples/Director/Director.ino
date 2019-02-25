#include <Servo.h>
#include <Director.h>


Director director;
Servo myservo;


ActorServo actors[] = {
  ActorServo("Mouth", 9),
  ActorServo("LeftEye", 8),
  ActorServo("RightEye", 7)
};

ActorButton buttons[] = {
  ActorButton("Door", 9)
};


void setup() {
  Serial.begin(500000);
  Serial.setTimeout(50);
  director.Assign(actors, 3);
  director.StartServos();
  director.Assign(buttons, 1);
}

void loop() {
  director.Listen();
  delay(1);
}
