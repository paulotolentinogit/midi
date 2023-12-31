function log(texto){
    document.getElementById('logtext').value = texto + "\n" + document.getElementById('logtext').value; 
  }
  var input1; // Variável para armazenar o teclado MIDI para o instrumento 1
  var input2; // Variável para armazenar o teclado MIDI para o instrumento 2
  var audioContext; // Objeto para o contexto de áudio

  // Função para exibir os teclados MIDI disponíveis
  function showMIDIInputs() {
    var midiInputs = WebMidi.inputs;
    var selectElement1 = document.getElementById('midi-inputs-1');
    var selectElement2 = document.getElementById('midi-inputs-2');

    midiInputs.forEach(function(input) {
      var optionElement1 = document.createElement('option');
      var optionElement2 = document.createElement('option');
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
    var selectElement = document.getElementById('midi-inputs-1');
    var selectedInputName = selectElement.value;

    if (selectedInputName) {
      input1 = WebMidi.getInputByName(selectedInputName);

      if (input1) {
        console.log('Teclado MIDI para o instrumento 1 selecionado:', selectedInputName);
        log('Teclado MIDI para o instrumento 1 selecionado:'+ selectedInputName);
        input1.addListener('noteon', 'all', playNote1);
        input1.addListener('noteoff', 'all', releaseNote1);
      }
    }
  }

  // Função para configurar o teclado MIDI para o instrumento 2
  function setupMIDIInput2() {
    var selectElement = document.getElementById('midi-inputs-2');
    var selectedInputName = selectElement.value;

    if (selectedInputName) {
      input2 = WebMidi.getInputByName(selectedInputName);

      if (input2) {
        console.log('Teclado MIDI para o instrumento 2 selecionado:', selectedInputName);
        log('Teclado MIDI para o instrumento 2 selecionado:'+ selectedInputName);
        input2.addListener('noteon', 'all', playNote2);
        input2.addListener('noteoff', 'all', releaseNote2);
      }
    }
  }

  const osciladoresInput1 = [];
  function playNote1(event) {
    var note = event.note;

    play(1, note.number, note.name , note.octave);
    console.log('Nota MIDI para o instrumento 1 recebida:', note.number);
    log(`Nota MIDI para o instrumento 1 recebida: number-> ${note.number}, name-> ${note.name} , octave-> ${note.octave}`);
  }

  // Função para liberar a nota no sintetizador do instrumento 1
  function releaseNote1(event) {
    var note = event.note;
    stop(1, note.number, note.name);
    console.log('Nota MIDI para o instrumento 1 recebida:', note.number);
    // log(`ociladores: ${qtocilador} agora: ${osciladoresInput1.length}`);

  }

// Função para reproduzir a nota no sintetizador do instrumento 2
function playNote2(event) {
var note = event.note;

note = traduzBaixos(note);

play(2, note.number, note.name , note.octave);
console.log('Nota MIDI para o instrumento 2 recebida:', note.number);
log(`Nota MIDI para o instrumento 2 recebida: number-> ${note.number}, name-> ${note.name} , octave-> ${note.octave}`);
}

  // Função para liberar a nota no sintetizador do instrumento 2
  function releaseNote2(event) {
    var note = event.note;
    note = traduzBaixos(note);
    stop(2, note.number, note.name);
    console.log('Nota MIDI para o instrumento 2 recebida:', note.number);
    // log(`ociladores: ${qtocilador} agora: ${osciladoresInput1.length}`);

  }

  // Evento quando a escolha do teclado MIDI para o instrumento 1 é alterada
  document.getElementById('midi-inputs-1').addEventListener('change', setupMIDIInput1);

  // Evento quando a escolha do teclado MIDI para o instrumento 2 é alterada
  document.getElementById('midi-inputs-2').addEventListener('change', setupMIDIInput2);

  // Inicializa o WebMIDI.js e exibe os teclados MIDI disponíveis
  WebMidi.enable(function(err) {
    if (err) {
      console.log('Erro ao inicializar o WebMIDI:', err);
      log('Erro ao inicializar o WebMIDI:'+ err);
    } else {
      console.log('WebMIDI inicializado com sucesso!');
      log('WebMIDI inicializado com sucesso!');
      showMIDIInputs();

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
