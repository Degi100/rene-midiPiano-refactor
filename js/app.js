import { channelKeyMap } from './channelKeyMap.js';
import { piano } from './piano.js';

piano.setup();
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();
const oscillators = {};
if (navigator.requestMIDIAccess) {
	navigator.requestMIDIAccess().then(success, failure);
}

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
	if (stringNote) piano.displayNotes([stringNote]);

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