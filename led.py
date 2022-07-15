#!/usr/bin/env python3
from rpi_ws281x import PixelStrip, Color

# LED strip configuration:
LED_COUNT = 424       # Number of LED pixels.
LED_PIN = 18          # GPIO pin connected to the pixels (18 uses PWM!).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 10          # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255    # Set to 0 for darkest and 255 for brightest
LED_INVERT = False    # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53

CRATEINDEX_TO_STRIPINDEX = [[423,422,421,420,419, 358,357,356,355,354], [418,417,416,415,414, 363,362,361,360,359], [413,412,411,410,409, 368,367,366,365,364], [408,407,406,405,404, 373,372,371,370,369], [403,402,401,400,399, 378,377,376,375,374], [398,397,396,395,394, 383,382,381,380,379], [393,392,391,390,389, 388,387,386,385,384], \
                            [353,352,351,350,349, 298,297,296,295,294], [348,347,346,345,344, 303,302,301,300,299], [343,342,341,340,339, 308,307,306,305,304], [338,337,336,335,334, 313,312,311,310,309], [333,332,331,330,329, 318,317,316,315,314], [328,327,326,325,324, 323,322,321,320,319], \
                            [293,292,291,290,289, 258,257,256,255,254], [288,287,286,285,284, 263,262,261,260,259], [283,282,281,280,279, 268,267,266,265,264], [278,277,276,275,274, 273,272,271,270,269], \
                            [253,252,251,250,249, 227,226,225,224,223], [248,247,246,245,244, 232,231,230,229,228], [243,242,241,240,239, 233], [238,237,236,235,234], \
                            [222,221,220,219,218, 205,204,203,202,201], [217,216,215,214,213, 210,209,208,207,206], [212, 211], \
                            [200,199,198,197,196, 174,173,172,171,170], [195,194,193,192,191, 179,178,177,176,175], [190, 184,183,182,181,180], [189,188,187,186,185], \
                            [169,168,167,166,165, 134,133,132,131,130], [164,163,162,161,160, 139,138,137,136,135], [159,158,157,156,155, 144,143,142,141,140], [154,153,152,151,150, 149,148,147,146,145], \
                            [129,128,127,126,125, 74,73,72,71,70], [124,123,122,121,120, 79,78,77,76,75], [119,118,117,116,115, 84,83,82,81,80], [114,113,112,111,110, 89,88,87,86,85], [109,108,107,106,105, 94,93,92,91,90], [104,103,102,101,100, 99,98,97,96,95], \
                            [69,68,67,66,65, 4,3,2,1,0], [64,63,62,61,60, 9,8,7,6,5], [59,58,57,56,55, 14,13,12,11,10], [54,53,52,51,50, 19,18,17,16,15], [49,48,47,46,45, 24,23,22,21,20], [44,43,42,41,40, 29,28,27,26,25], [39,38,37,36,35, 34,33,32,31,30]]

# Set all Pixels to same Color
def set_all_pixels(color):
    for i in range(LED_COUNT):
        strip.setPixelColor(i, color)
    strip.show()

# Update current Frame by (index,Color()) tuples
def update_frame(binaryColors):
    for index in range(len(binaryColors)//3):
        r = binaryColors[index*3]
        g = binaryColors[index*3+1]
        b = binaryColors[index*3+2]
        colorvalue = Color(g,r,b)

        for i in CRATEINDEX_TO_STRIPINDEX[index]:
            strip.setPixelColor(i, colorvalue)
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
    set_all_pixels(Color(0,255,0))