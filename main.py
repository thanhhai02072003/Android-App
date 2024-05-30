import serial.tools.list_ports
import random
import time
import  sys
from  Adafruit_IO import  MQTTClient

AIO_FEED_IDS = ["led", "lux", "rh", "pump", "sm", "temp", "auto-light", "auto-pump"]
AIO_USERNAME = "duongwt16"
AIO_KEY = "aio_MIUM06wSINOY8prFX5h2aRXvKJ3q"

def  connected(client):
    print("Ket noi thanh cong...")
    for feed in AIO_FEED_IDS:
        client.subscribe(feed)

def  subscribe(client , userdata , mid , granted_qos):
    print("Subcribe thanh cong...")

def  disconnected(client):
    print("Ngat ket noi...")
    sys.exit (1)

# def  message(client , feed_id , payload):
#     print("Nhan du lieu tu feed " + feed_id + ": " +payload)
#     if isMicrobitConnected:
#         ser.write((str(payload) + "#").encode())

def  message(client , feed_id , payload):
    print("Nhan du lieu tu feed " + feed_id + ": " +payload)
    # if isMicrobitConnected:
    if feed_id == "led":
        if payload == "0":
            ser.write((str(0)).encode())
        else:
            ser.write((str(1)).encode())
    if feed_id == "pump":
        if payload == "0":
            ser.write((str(2)).encode())
        else:
            ser.write((str(3)).encode())
    if feed_id == "auto-light":
        if payload == "0":
            ser.write((str(4)).encode())
        else:
            ser.write((str(5)).encode())
    if feed_id == "auto-pump":
        if payload == "0":
            ser.write((str(6)).encode())
        else:
            ser.write((str(7)).encode())

client = MQTTClient(AIO_USERNAME , AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect()
client.loop_background()

def getPort():
    # ports = serial.tools.list_ports.comports()
    # N = len(ports)
    # commPort = "None"
    commPort = "COM3"
    # for i in range(0, N):
    #     port = ports[i]
    #     strPort = str(port)
    #     if "USB Serial Device" in strPort:
    #         splitPort = strPort.split(" ")
    #         commPort = (splitPort[0])
    return commPort

isMicrobitConnected = True
if getPort() != "None":
    ser = serial.Serial(port=getPort(), baudrate=115200)
    isMicrobitConnected = True


def processData(data):
    data = data.replace("!", "")
    data = data.replace("#", "")
    splitData = data.split(":")
    print(splitData)
    if splitData[1] == "LED":
        client.publish("led", splitData[2])
    if splitData[1] == "TEMP":
        client.publish("temp", splitData[2])
    if splitData[1] == "SM":
        client.publish("sm", splitData[2])
    if splitData[1] == "LUX":
        client.publish("lux", splitData[2])
    if splitData[1] == "Auto_Light":
        client.publish("auto-light", splitData[2])
    if splitData[1] == "Auto_Pump":
        client.publish("auto-pump", splitData[2])
mess = ""
def readSerial():
    bytesToRead = ser.inWaiting()
    if (bytesToRead > 0):
        global mess
        mess = mess + ser.read(bytesToRead).decode("UTF-8")
        while ("#" in mess) and ("!" in mess):
            start = mess.find("!")
            end = mess.find("#")
            processData(mess[start:end + 1])
            if (end == len(mess)):
                mess = ""
            else:
                mess = mess[end+1:]

while True:
    if isMicrobitConnected:
        readSerial()

    time.sleep(2)