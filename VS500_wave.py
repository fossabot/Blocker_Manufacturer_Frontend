from pop import Pilot
import time
import os

def move():
    car = Pilot.AutoCar()
    car.setSpeed(30)
    print("구불구불 주행 시작")

    car.turnLeft()
    car.forward()
    time.sleep(1.5)

    car.turnCenter()
    time.sleep(1.0)

    car.turnRight()
    time.sleep(1.5)

    car.turnCenter()
    time.sleep(1.0)

    car.stop()
    print("✅ 주행 종료")

    os._exit(0)

if __name__ == "__main__":
    move()