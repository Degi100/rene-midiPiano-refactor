import * as utils from './utils.js';

const whiteKeyWidth = 80;
const pianoHeight = 400;

const naturalNotes = ["C", "D", "E", "F", "G", "A", "B"];
const naturalNotesSharps = ["C", "D", "F", "G", "A"];
const naturalNotesFlats = ["D", "E", "G", "A", "B"];

const range = ["C2", "C7"];

//global midi setup
const channelKeyMap = {
  127: "G9",
  126: "F#9",
  125: "F9",
  124: "E9",
  123: "D#9",
  122: "D9",
  121: "C#9",
  120: "C9",
  119: "B8",
  118: "A#8",
  117: "A8",
  116: "G#8",
  115: "G8",
  114: "F#8",
  113: "F8",
  112: "E8",
  111: "D#8",
  110: "D8",
  109: "C#8",
  108: "C8",
  107: "B7",
  106: "A#7",
  105: "A7",
  104: "G#7",
  103: "G7",
  102: "F#7",
  101: "F7",
  100: "E7",
  99: "D#7",
  98: "D7",
  97: "C#7",
  96: "C7",
  95: "B6",
  94: "A#6",
  93: "A6",
  92: "G#6",
  91: "G6",
  90: "F#6",
  89: "F6",
  88: "E6",
  87: "D#6",
  86: "D6",
  85: "C#6",
  84: "C6",
  83: "B5",
  82: "A#5",
  81: "A5",
  80: "G#5",
  79: "G5",
  78: "F#5",
  77: "F5",
  76: "E5",
  75: "D#5",
  74: "D5",
  73: "C#5",
  72: "C5",
  71: "B4",
  70: "A#4",
  69: "A4",
  68: "G#4",
  67: "G4",
  66: "F#4",
  65: "F4",
  64: "E4",
  63: "D#4",
  62: "D4",
  61: "C#4",
  60: "C4",
  59: "B3",
  58: "A#3",
  57: "A3",
  56: "G#3",
  55: "G3",
  54: "F#3",
  53: "F3",
  52: "E3",
  51: "D#3",
  50: "D3",
  49: "C#3",
  48: "C3",
  47: "B2",
  46: "A#2",
  45: "A2",
  44: "G#2",
  43: "G2",
  42: "F#2",
  41: "F2",
  40: "E2",
  39: "D#2",
  38: "D2",
  37: "C#2",
  36: "C2",
  35: "B1",
  34: "A#1",
  33: "A1",
  32: "G#1",
  31: "G1",
  30: "F#1",
  29: "F1",
  28: "E1",
  27: "D#1",
  26: "D1",
  25: "C#1",
  24: "C1",
  23: "B0",
  22: "A#0",
  21: "A0",
  20: "G#",
  19: "G",
  18: "F#",
  17: "F",
  16: "E",
  15: "D#",
  14: "D",
  13: "C#",
  12: "C0",
  11: "B",
  10: "A#",
  9: "A",
  8: "G#",
  7: "G",
  6: "F#",
  5: "F",
  4: "E",
  3: "D#",
  2: "D",
  1: "C#",
  0: "C-1",
};
console.log(channelKeyMap[60]);

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let ctx;
const startButton = document.querySelector("button");
const oscillators = {};
startButton.addEventListener("click", () => {
  ctx = new AudioContext();
  console.log(ctx);
});

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(success, failure);
}

const app = {
  setupPiano() {
    const piano = document.querySelector("#piano");
    const allNaturalNotes = this.getAllNaturalNotes(range);
    const pianoWidth = allNaturalNotes.length * whiteKeyWidth;

    const SVG = this.createMainSVG(pianoWidth, pianoHeight);

    // Add white keys
    let whiteKeyPositionX = 0;

    allNaturalNotes.forEach((noteName) => {
      const whiteKeyTextGroup = utils.createSVGElement("g");
      const whiteKey = this.createKey({
        className: "white-key",
        width: whiteKeyWidth,
        height: pianoHeight,
      });
      const text = utils.createSVGElement("text");

      utils.addTextContent(text, noteName);
      utils.setAttributes(whiteKeyTextGroup, { width: whiteKeyWidth });
      utils.setAttributes(text, {
        x: whiteKeyPositionX + whiteKeyWidth / 2,
        y: 380,
        "text-anchor": "middle",
      });
      utils.setAttributes(whiteKey, {
        x: whiteKeyPositionX,
        "data-note-name": noteName,
        rx: "15",
        ry: "15",
      });

      text.classList.add("white-key-text");
      whiteKeyTextGroup.appendChild(whiteKey);
      whiteKeyTextGroup.appendChild(text);
      SVG.appendChild(whiteKeyTextGroup);

      // Increment spacing between keys
      whiteKeyPositionX += whiteKeyWidth;
    });
    // Add black keys
    let blackKeyPositionX = 60;
    allNaturalNotes.forEach((naturalNote, index, array) => {
      // If last iteration of keys, do not add black key
      if (index === array.length - 1) {
        return;
      }

      const blackKeyTextGroup = utils.createSVGElement("g");
      const blackKey = this.createKey({
        className: "black-key",
        width: whiteKeyWidth / 2,
        height: pianoHeight / 1.6,
      });
      const flatNameText = utils.createSVGElement("text");
      const sharpNameText = utils.createSVGElement("text");

      utils.setAttributes(blackKeyTextGroup, { width: whiteKeyWidth / 2 });

      for (let i = 0; i < naturalNotesSharps.length; i++) {
        let naturalSharpNoteName = naturalNotesSharps[i];
        let naturalFlatNoteName = naturalNotesFlats[i];

        if (naturalSharpNoteName === naturalNote[0]) {
          utils.setAttributes(blackKey, {
            x: blackKeyPositionX,
            "data-sharp-name": `${naturalSharpNoteName}#${naturalNote[1]}`,
            "data-flat-name": `${naturalFlatNoteName}b${naturalNote[1]}`,
            rx: "8",
            ry: "8",
          });

          utils.setAttributes(sharpNameText, {
            "text-anchor": "middle",
            y: 215,
            x: blackKeyPositionX + whiteKeyWidth / 4,
          });

          utils.setAttributes(flatNameText, {
            "text-anchor": "middle",
            y: 235,
            x: blackKeyPositionX + whiteKeyWidth / 4,
          });

          utils.addTextContent(sharpNameText, `${naturalSharpNoteName}♯`);
          utils.addTextContent(flatNameText, `${naturalFlatNoteName}♭`);

          flatNameText.classList.add("black-key-text");
          sharpNameText.classList.add("black-key-text");

          // Add double spacing between D# and A#
          if (naturalSharpNoteName === "D" || naturalSharpNoteName === "A") {
            blackKeyPositionX += whiteKeyWidth * 2;
          } else {
            blackKeyPositionX += whiteKeyWidth;
          }

          blackKeyTextGroup.appendChild(blackKey);
          blackKeyTextGroup.appendChild(flatNameText);
          blackKeyTextGroup.appendChild(sharpNameText);
        }
      }
      SVG.appendChild(blackKeyTextGroup);
    });
    // Add main SVG to piano div
    piano.appendChild(SVG);
  },
  createOctave(octaveNumber) {
    const octave = utils.createSVGElement("g");
    octave.classList.add("octave");
    octave.setAttribute(
      "transform",
      `translate(${octaveNumber * octaveWidth}, 0)`
    );
    return octave;
  },
  createKey({ className, width, height }) {
    const key = utils.createSVGElement("rect");
    key.classList.add(className, "key");
    utils.setAttributes(key, {
      width: width,
      height: height,
    });
    return key;
  },
  getAllNaturalNotes([firstNote, lastNote]) {
    // Assign octave number, notes and positions to variables
    const firstNoteName = firstNote[0];
    const firstOctaveNumber = parseInt(firstNote[1]);

    const lastNoteName = lastNote[0];
    const lastOctaveNumber = parseInt(lastNote[1]);

    const firstNotePosition = naturalNotes.indexOf(firstNoteName);
    const lastNotePosition = naturalNotes.indexOf(lastNoteName);

    const allNaturalNotes = [];

    for (
      let octaveNumber = firstOctaveNumber;
      octaveNumber <= lastOctaveNumber;
      octaveNumber++
    ) {
      // Handle first octave
      if (octaveNumber === firstOctaveNumber) {
        naturalNotes.slice(firstNotePosition).forEach((noteName) => {
          allNaturalNotes.push(noteName + octaveNumber);
        });

        // Handle last octave
      } else if (octaveNumber === lastOctaveNumber) {
        naturalNotes.slice(0, lastNotePosition + 1).forEach((noteName) => {
          allNaturalNotes.push(noteName + octaveNumber);
        });
      } else {
        naturalNotes.forEach((noteName) => {
          allNaturalNotes.push(noteName + octaveNumber);
        });
      }
    }
    return allNaturalNotes;
  },
  createMainSVG(pianoWidth, pianoHeight) {
    const svg = utils.createSVGElement("svg");

    utils.setAttributes(svg, {
      width: "100%",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      viewBox: `0 0 ${pianoWidth} ${pianoHeight}`,
    });

    return svg;
  },
  displayNotes(notes) {
    const pianoKeys = document.querySelectorAll(".key");
    utils.removeClassFromNodeCollection(pianoKeys, "show");

    notes.forEach((noteName) => {
      pianoKeys.forEach((key) => {
        const naturalName = key.dataset.noteName;
        const sharpName = key.dataset.sharpName;
        const flatName = key.dataset.flatName;

        if (
          naturalName === noteName ||
          sharpName === noteName ||
          flatName === noteName
        ) {
          key.classList.add("show");
        }
      });
    });
  },
};


function success(midiAccess) {
  midiAccess.addEventListener("statechange", updateDevices);
  const inputs = midiAccess.inputs;

  inputs.forEach((input) => {
    input.addEventListener("midimessage", handleInput);
  });
}

function handleInput(input) {
  console.log(input);
  const command = input.data[0];
  const note = input.data[1];
  const velocity = input.data[2];

  switch (command) {
    case 144: //noteOn
      if (velocity > 0) {
        noteOn(note, velocity);
      } else {
        noteOff(note);
      }
      break;
    case 128: // note off
      noteOff(note);
      break;
  }
}

function midiToFrequency(number) {
  const a = 440;
  return (a / 32) * 2 ** ((number - 9) / 12);
}

function noteOn(note, velocity) {
  const osc = ctx.createOscillator();

  const oscGain = ctx.createGain();
  oscGain.gain.value = 0.33;

  const velocityGainAmount = (1 / 127) * velocity;
  const velocityGain = ctx.createGain();
  velocityGain.gain.value = velocityGainAmount;

  osc.type = "square";
  osc.frequency.value = midiToFrequency(note);

  console.log(channelKeyMap[note.toString()]);
  const stringNote = channelKeyMap[note.toString()];
  if (stringNote) app.displayNotes([stringNote]);

  osc.connect(oscGain);
  osc.connect(velocityGain);
  velocityGain.connect(ctx.destination);

  osc.gain = oscGain;

  oscillators[note.toString()] = osc;
  console.log(oscillators);
  console.log(note.toString());
  osc.start();
}

function noteOff(note) {
  const osc = oscillators[note.toString()];
  const oscGain = osc.gain;

  //nobody knows whats going on here, but its works...
  oscGain.gain.setValueAtTime(oscGain.gain.value, ctx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.003);

  setTimeout(() => {
    osc.stop();
    osc.disconnect();
  }, 20);

  delete oscillators[note.toString()];
  console.log(oscillators);
}

function updateDevices(event) {
  console.log(
    `Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State, ${event.port.state}, Type ${event.port.type}`
  );
}

function failure() {
  console.log("Could not connect MIDI");
}

app.setupPiano();
