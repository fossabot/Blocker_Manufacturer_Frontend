from pop import Pilot
import time
import os

car = Pilot.AutoCar()

car.setSpeed(30)
car.forward()
time.sleep(10)
car.stop()

os._exit(0) 
