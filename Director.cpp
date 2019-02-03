#include "Arduino.h"
#include "Director.h"

#include <Servo.h>

String Actor::GetName() {
   return name;
}

void Actor::SetName(String _name) {
   name = _name;
}

ActorServo::ActorServo(String _name, int _pin) {
   servo.attach(_pin);
   SetName(_name);
}

void ActorServo::Move(int deg) {
   servo.write(deg);
   Serial.println("Servo moved to " + String(deg));
}

ActorButton::ActorButton(String _name, int _pin) {
   SetName(_name);
   pinMode(_pin, INPUT);
   pin = _pin;
   state = 0;
   lastDebounceTime = 0;
   lastButtonState = 0;
}

int ActorButton::Read() {
   reading = digitalRead(pin);
   if (reading != lastButtonState) {
      lastDebounceTime = millis();
   }
   if ((millis() - lastDebounceTime) > 50) {
      if (reading != state) {
         state = reading;
         if (state == HIGH) {
            return 1;
         }
      }
   }
   lastButtonState = reading; 
   return 0;
}

Director::Director() {
}

void Director::Assign(ActorServo *_actors, int _qty) {
   actors = _actors;
   servoQuantity = _qty;
}

void Director::Assign(ActorButton *_buttons, int _qty) {
   buttons = _buttons;
   buttonQuantity = _qty;
}

void Director::Options() {
   String output = String("OPTIONS:");
   for (int i=0; i < servoQuantity; i++) {
      output = output + i + "," + (actors[i].GetName()) + ",S|";
   }
   for (int i=0; i < buttonQuantity; i++) {
      output = output + i + "," + (buttons[i].GetName()) + ",B|";
   }
   Serial.println(output);
}

void Director::Listen(){
   while(Serial.available()) {
      incoming = Serial.readString();
      // Serial.println(incoming);
      if (incoming.startsWith("OPTIONS")) {
         Options();
      } else if (incoming.startsWith("SERVO:")) {
         //format: SERVO:0,90
         int id = incoming.substring(6, incoming.indexOf(",")).toInt();
         int deg = incoming.substring( incoming.indexOf(",") + 1 ).toInt();
         if (id < servoQuantity) {
            actors[id].Move(deg);
         }
      }
   }
   for (int i=0; i < buttonQuantity; i++) {
      if(buttons[i].Read() == 1) {
         Serial.println("B:" + i );
      }
   }
}
