const LOG_MAX_LINES = 200;
const LOG_FLUSH_INTERVAL_MS = 50;
const logQueue = [];
let logFlushTimeout = null;

const logTextArea = document.getElementById('logtext');
const tipoSom1Element = document.getElementById('tipoSom1');
const tipoSom2Element = document.getElementById('tipoSom2');
const oitavaBaixoElement = document.getElementById('oitavaBaixo');

let input1; // Variável para armazenar o teclado MIDI para o instrumento 1
let input2; // Variável para armazenar o teclado MIDI para o instrumento 2
let audioContext; // Objeto para o contexto de áudio

function flushLogQueue() {
  if (!logTextArea || logQueue.length === 0) {
    logFlushTimeout = null;
    return;
  }

  const novosLogs = logQueue.splice(0, logQueue.length);
  const logsAtuais = logTextArea.value ? logTextArea.value.split('\n').filter(Boolean) : [];
  const merged = [...novosLogs.reverse(), ...logsAtuais].slice(0, LOG_MAX_LINES);

  logTextArea.value = merged.join('\n');
  logFlushTimeout = null;
}

function log(texto) {
  logQueue.push(texto);

  if (logFlushTimeout) return;

  logFlushTimeout = setTimeout(flushLogQueue, LOG_FLUSH_INTERVAL_MS);
}

function atualizarConfiguracaoPlaybackPelaUI() {
  if (typeof atualizarConfigPlayback !== 'function') return;

  atualizarConfigPlayback({
    instrumento1: {
      tipoSom: tipoSom1Element.value
    },
    instrumento2: {
      tipoSom: tipoSom2Element.value,
      oitava: parseInt(oitavaBaixoElement.value, 10)
    }
  });
}

function detachInputListeners(input, noteOnHandler, noteOffHandler) {
  if (!input) return;

  try {
    input.removeListener('noteon', 'all', noteOnHandler);
    input.removeListener('noteoff', 'all', noteOffHandler);
  } catch (_e) {
    // ignora erros de remoção de listener para manter compatibilidade
  }
}

// Função para exibir os teclados MIDI disponíveis
function showMIDIInputs() {
  const midiInputs = WebMidi.inputs;
  const selectElement1 = document.getElementById('midi-inputs-1');
  const selectElement2 = document.getElementById('midi-inputs-2');

  midiInputs.forEach(function(input) {
    const optionElement1 = document.createElement('option');
    const optionElement2 = document.createElement('option');
    optionElement1.value = input.name;
    optionElement1.text = input.name;
    optionElement2.value = input.name;
    optionElement2.text = input.name;
    selectElement1.appendChild(optionElement1);
    selectElement2.appendChild(optionElement2);
  });
}

// Função para configurar o teclado MIDI para o instrumento 1
function setupMIDIInput1() {
  const selectElement = document.getElementById('midi-inputs-1');
  const selectedInputName = selectElement.value;

  detachInputListeners(input1, playNote1, releaseNote1);

  if (selectedInputName) {
    input1 = WebMidi.getInputByName(selectedInputName);

    if (input1) {
      console.log('Teclado MIDI para o instrumento 1 selecionado:', selectedInputName);
      log('Teclado MIDI para o instrumento 1 selecionado:' + selectedInputName);
      input1.addListener('noteon', 'all', playNote1);
      input1.addListener('noteoff', 'all', releaseNote1);
    }
  }
}

// Função para configurar o teclado MIDI para o instrumento 2
function setupMIDIInput2() {
  const selectElement = document.getElementById('midi-inputs-2');
  const selectedInputName = selectElement.value;

  detachInputListeners(input2, playNote2, releaseNote2);

  if (selectedInputName) {
    input2 = WebMidi.getInputByName(selectedInputName);

    if (input2) {
      console.log('Teclado MIDI para o instrumento 2 selecionado:', selectedInputName);
      log('Teclado MIDI para o instrumento 2 selecionado:' + selectedInputName);
      input2.addListener('noteon', 'all', playNote2);
      input2.addListener('noteoff', 'all', releaseNote2);
    }
  }
}

function playNote1(event) {
  const note = event.note;

  play(1, note.number, note.name, note.octave);
  console.log('Nota MIDI para o instrumento 1 recebida:', note.number);
  log(`Nota MIDI para o instrumento 1 recebida: number-> ${note.number}, name-> ${note.name} , octave-> ${note.octave}`);
}

// Função para liberar a nota no sintetizador do instrumento 1
function releaseNote1(event) {
  const note = event.note;
  stop(1, note.number, note.name);
  console.log('Nota MIDI para o instrumento 1 recebida:', note.number);
}

// Função para reproduzir a nota no sintetizador do instrumento 2
function playNote2(event) {
  let note = event.note;

  note = traduzBaixos(note);

  play(2, note.number, note.name, note.octave);
  console.log('Nota MIDI para o instrumento 2 recebida:', note.number);
  log(`Nota MIDI para o instrumento 2 recebida: number-> ${note.number}, name-> ${note.name} , octave-> ${note.octave}`);
}

// Função para liberar a nota no sintetizador do instrumento 2
function releaseNote2(event) {
  let note = event.note;
  note = traduzBaixos(note);
  stop(2, note.number, note.name);
  console.log('Nota MIDI para o instrumento 2 recebida:', note.number);
}

// Eventos de configuração de UI
document.getElementById('midi-inputs-1').addEventListener('change', setupMIDIInput1);
document.getElementById('midi-inputs-2').addEventListener('change', setupMIDIInput2);
tipoSom1Element.addEventListener('change', atualizarConfiguracaoPlaybackPelaUI);
tipoSom2Element.addEventListener('change', atualizarConfiguracaoPlaybackPelaUI);
oitavaBaixoElement.addEventListener('change', atualizarConfiguracaoPlaybackPelaUI);

// Inicializa o WebMIDI.js e exibe os teclados MIDI disponíveis
WebMidi.enable(function(err) {
  if (err) {
    console.log('Erro ao inicializar o WebMIDI:', err);
    log('Erro ao inicializar o WebMIDI:' + err);
  } else {
    console.log('WebMIDI inicializado com sucesso!');
    log('WebMIDI inicializado com sucesso!');
    showMIDIInputs();
    atualizarConfiguracaoPlaybackPelaUI();

    // Inicializa o contexto de áudio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
});

// Utility function to load a SoundFont file from a URL using XMLHttpRequest.
// The same origin policy will apply, as for all XHR requests.
// function loadSoundFont(url, success, error) {
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", url, true);
//   xhr.responseType = "arraybuffer";
//   xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4) {
//           if (xhr.status === 200) {
//               success(new Uint8Array(xhr.response));
//           } else {
//               if (options.error) {
//                   options.error(xhr.statusText);
//               }
//           }
//       }
//   };
//   xhr.send();
// }

// // Load and parse a SoundFont file.
// loadSoundFont("http://127.0.0.1:8080/CorvinoBaixoAcordeon.sf2", function (sfData) {
//     var parser = new sf2.Parser(sfData);
//     parser.parse();
// //    var instrumente = new sf2.getInstruments();
//     // Do something with the parsed SoundFont data.
// });
