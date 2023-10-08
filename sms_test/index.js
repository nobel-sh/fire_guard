const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort("/dev/ttyUSB0", {
    baudRate: 9600, // Make sure to set the correct baud rate for your A9G module.
});

const parser = port.pipe(new Readline({delimiter: '\n'}));

//port.on("open", () => {
//    setInterval(() => {
//        sendCommand("AT");
//    }, 5000)
//})

parser.on("data", (data) => {
    console.log("I GOT DATA BACK");
    console.log("The data is " + data);
})

const sendCommand = (command) => {
    console.log("Sending command " + command);
    port.write(command + "\n", (err) => {
        if (err) {
            console.log("Error sending data");
        }
    })
}
const sendCommandWithoutNewLine = (command) => {
    console.log("Sending command " + command);
    port.write(command, (err) => {
        if (err) {
            console.log("Error sending data");
        }
    })
}

function sendSMS(number, message) {
    sendCommand("AT+CMGF=1\r"); // Set SMS text mode

    setTimeout(() => {
        sendCommand("AT+CNMI=2,2,0,0,0\r"); // Configure SMS notifications
    }, 1000);

    setTimeout(() => {
        sendCommandWithoutNewLine(`AT+CMGS="${number}"\r`); // Set the recipient phone number
    }, 2000);

    setTimeout(() => {
        sendCommandWithoutNewLine(message); // Compose and send the SMS
    }, 3000);

    setTimeout(() => {
        sendCommandWithoutNewLine(String.fromCharCode(26));
    }, 4000);
}

// Open the serial port
port.on('open', () => {
    sendSMS("+9779803175075", "K XA BROOOOOOOOOOOOOOOOOOOOOOOOO");
});


