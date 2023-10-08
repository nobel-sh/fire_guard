from ultralytics import YOLO
import cv2
import math
import os
from pathlib import Path
import datetime
import requests

stream_ip = '192.168.1.132'
stream_port = '5000'
stream_subdirectory = 'video'
final_url = 'http://'+stream_ip+':'+stream_port+'/'+stream_subdirectory
print(final_url)

stream_url = 'http://192.168.18.85:5000/video'

cameras = requests.get('http://localhost:8000/api/location')
cameras = cameras.json()
_id = cameras[0]['_id']
print(cameras)

def main():
    BASE_DIR = Path(__file__).resolve().parent
    image_directory = os.path.join(BASE_DIR, "output")

    if not os.path.exists(image_directory):
        os.makedirs(image_directory)

    # Running real-time from webcam

    cap = cv2.VideoCapture(stream_url)
    #cap = cv2.VideoCapture(0)
    model = YOLO("fire_n.pt")

    classnames = ["smoke","fire"]
    # classnames = ["fire"]

    last_2_minutes = []

    capture_image = True
    confidence_accumulator = 0
    frame_count = 0
    start_time = datetime.datetime.now()
    
    while True:
        ret, frame = cap.read()
        frame = cv2.resize(frame, (640, 480))
        result = model(frame, stream=True)

        for info in result:
            boxes = info.boxes
            for box in boxes:
                confidence = box.conf[0]
                confidence = math.ceil(confidence * 100)
                Class = int(box.cls[0])

                if confidence > 50:
                    x1, y1, x2, y2 = box.xyxy[0]
                    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 5)
                    cv2.putText(
                        frame,
                        f"{classnames[Class]} {confidence}%",
                        (x1 + 8, y1 + 100),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1,
                        (0, 255, 0),
                        2,
                    )

                confidence_accumulator += confidence
                frame_count += 1

        current_time = datetime.datetime.now()
        elapsed_time = (current_time - start_time).total_seconds()

        if elapsed_time > 10:  # Check if a minute has passed
            print(f"Elapsed Time: {elapsed_time} seconds")
            print(f"Frame Count: {frame_count}")
            print(f"Confidence Accumulator: {confidence_accumulator}")
            if frame_count > 0:
                average_confidence = confidence_accumulator / frame_count
                print(f"Average Confidence Over a Minute: {average_confidence}%")
                if len(last_2_minutes) >= 2:
                    prev = last_2_minutes.pop(0)
                    last_2_minutes.append(average_confidence)
                    average_confidence = (average_confidence + prev) / 2
                    if average_confidence > 50:
                        print(f"Average confidence of last 2 mins over 50 reporting admin")
                        res = requests.post('http://localhost:8000/api/admin/inform', data = {'id':_id,'confidence':average_confidence})
                        res = res.json()
                        print(res)
                else:
                    last_2_minutes.append(average_confidence)
                    
            # Reset counters
            confidence_accumulator = 0
            frame_count = 0
            start_time = current_time

        cv2.imshow("frame", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
