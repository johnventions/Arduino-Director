#include <Director.h>

Director director;

ActorServo actors[] = {
  ActorServo("Mouth", 7),
  ActorServo("LeftEye", 8),
  ActorServo("RightEye", 9),
  ActorServo("Neck", 10),
};

ActorButton buttons[] = {
  ActorButton("Door", 2),
  ActorButton("Hand", 3),
};

void setup() {
  Serial.begin(500000);
  Serial.setTimeout(50);
  director.Assign(actors, 4);
  director.Assign(buttons, 2);
}

void loop() {
  director.Listen();
}
