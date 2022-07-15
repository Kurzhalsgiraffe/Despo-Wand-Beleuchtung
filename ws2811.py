#!/usr/bin/env python3
from rpi_ws281x import PixelStrip, Color
import time

# LED strip configuration:
LED_COUNT = 424       # Number of LED pixels.
LED_PIN = 18          # GPIO pin connected to the pixels (18 uses PWM!).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 10          # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 200  # Set to 0 for darkest and 255 for brightest
LED_INVERT = False    # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53

# Set all Pixels to same Color
def set_all_pixels(color):
    for i in range(LED_COUNT):
        strip.setPixelColor(i, Color(color[0],color[1],color[2]))
    strip.show()

def update_frame(binaryColors):
    for index in range(LED_COUNT):
        r = binaryColors[index*3]
        g = binaryColors[index*3+1]
        b = binaryColors[index*3+2]
        colorvalue = Color(r,g,b)
        strip.setPixelColor(index, colorvalue)
    strip.show()

def update_brightness(brightness):
    strip.setBrightness(brightness)
    strip.show()

def wheel(pos):
    if pos < 85:
        return Color(pos * 3, 255 - pos * 3, 0)
    elif pos < 170:
        pos -= 85
        return Color(255 - pos * 3, 0, pos * 3)
    else:
        pos -= 170
        return Color(0, pos * 3, 255 - pos * 3)

def rainbow():
    for i in range(256):
        for j in range(LED_COUNT):
            strip.setPixelColor(j, wheel(((j * 256 // LED_COUNT) + i) % 256) )
        time.sleep(0.01)
        strip.show()

def init():
    global strip
    strip = PixelStrip(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
    strip.begin()
    set_all_pixels([0,0,0])

init()

while True:
    rainbow()
