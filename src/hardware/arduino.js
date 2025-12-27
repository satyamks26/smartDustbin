import { SerialPort } from "serialport";

let port;

try {
    port = new SerialPort({
        path: "COM3",
        baudRate: 9600,
        autoOpen: false, // 1. Don't auto-open to control error handling
    });

    // 2. Attempt to open manually
    port.open((err) => {
        if (err) {
            console.warn("⚠️  Arduino NOT detected on COM3. Running in simulation mode.");
        } else {
            console.log("✅ Arduino connected on COM3");
        }
    });

    port.on("error", (err) => {
        console.error("❌ Serial Port Error:", err.message);
    });

} catch (err) {
    console.warn("⚠️  SerialPort setup failed (Running without hardware).", err.message);
}

function send(cmd) {
    // 3. Safety check before writing
    if (!port || !port.isOpen) {
        console.log(`[SIMULATION] Sending to Arduino: ${cmd}`);
        return;
    }

    const message = cmd + "\r\n";
    port.write(message, (err) => {
        if (err) {
            return console.error("Error writing to port:", err.message);
        }
        port.drain();
        console.log("Sent to Arduino:", JSON.stringify(message));
    });
}

export function openServo() {
    send("OPEN");
}

export function closeServo() {
    send("CLOSE");
}
