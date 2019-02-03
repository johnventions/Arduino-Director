/*
  Director.h - Library for controlling multiple animatronic items
*/

#ifndef _ARDUINO_Director
#define _ARDUINO_Director

#include <Arduino.h>
#include <Servo.h>

class Actor {
  public:
    String GetName();
    void SetName(String _name);
  private:
    String name;
};

class ActorServo : public Actor {
  public:
    ActorServo(String _name, int _pin);
    void Move(int deg);
  private:
    Servo servo;
};

class ActorButton : public Actor {
  public:
    ActorButton(String _name, int _pin);
    int Read();
  private:
    int pin;
    int state;
    int reading;
    unsigned long lastDebounceTime;
    int lastButtonState;
};


class Director {
  public:
    Director();
    void Assign(ActorServo *_actors, int _qty);
    void Assign(ActorButton *_buttons, int _qty);
    void Options();
    void Listen();
  private:
    ActorServo *actors;
    ActorButton *buttons;
    int servoQuantity;
    int buttonQuantity;
    String incoming;
};




#endif
