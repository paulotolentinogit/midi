const audioList = [];
const audio = {};

function play(instrumento, tecla, nota, oitava) {

  acorde = nota.split(",");
  audio[instrumento] = audio[instrumento] || {};
  acorde.forEach(function(nota) {
    try{
      if (nota.indexOf('#') !== -1) {
        nota = sharpToFlat(nota);
      }
      if(instrumento == 2){
        oitava = parseInt(document.getElementById('oitavaBaixo').value);
        tipoSom = document.getElementById('tipoSom2').value;
      }else{
        tipoSom = document.getElementById('tipoSom1').value;
      }
      
      log(`Iniciando a nota instrumento: ${instrumento}, tecla: ${tecla}, nota: ${nota}, oitava ${oitava}`);
      audio[instrumento][tecla] = audio[instrumento][tecla] || {};
      var intrumentoEfeito = criarObjetoPorTipo(tipoSom);
      if(tipoSom == "corvinoAcordeon"){
        audio[instrumento][tecla][`${nota}`] = new Audio(intrumentoEfeito[tecla]);
      }else{
        audio[instrumento][tecla][`${nota}`] = new Audio(intrumentoEfeito[nota + oitava]);
      }
      audio[instrumento][tecla][`${nota}`].play();
    }catch(e){
      log(`Erro iniciando a nota instrumento: ${instrumento}, tecla: ${tecla}, nota: ${nota}`);
    }
  });
}


function stop(instrumento, tecla, nota) {

  acorde = nota.split(",");
  acorde.forEach(function(nota) {
    if (nota.indexOf('#') !== -1) {
      nota = sharpToFlat(nota);
    }

    if (audio[instrumento] && audio[instrumento][tecla] && audio[instrumento][tecla][nota]) {
      try{
        player = audio[instrumento][tecla][`${nota}`];
        player.pause();
        player.currentTime = 0;
        log(`Parando a nota instrumento: ${instrumento}, tecla: ${tecla}, nota: ${nota}`);
      }catch(e){
        log(`Erro parando a nota instrumento: ${instrumento}, tecla: ${tecla}, nota: ${nota}`);
      }
    }
  });
}
function traduzBaixos(note){

  const mapeamentoBaixos = {
    //F#
    "54" : "F#",
    "20" : "A#",
    "23" : "C#,A#,F#",
    "22" : "C#,A,F#",
    "21" : "E,A#,F#",

    //G
    "35" : "B",
    "51" : "D#",
    "50" : "F#,D#,B",
    "47" : "F#,D,B",
    "52" : "A,D#,B",

    //E
    "28" : "E",
    "55" : "G#",
    "48" : "B,G#,E",
    "40" : "B,G,E",
    "53" : "D,G#,E",
    
    //A
    "33" : "A",
    "49" : "C#",
    "34" : "E,C#,A",
    "45" : "E,C,A",
    "46" : "G,C#,A",

    //D
    "26" : "D",
    "54" : "F#",
    "27" : "A,F#,D",
    "38" : "A,F,D",
    "39" : "C,F#,D",

    //G
    "31" : "G",
    "35" : "B",
    "32" : "D,B,G",
    "43" : "D,Bb,G",
    "44" : "F,B,G",

    //C
    "24" : "C",
    "28" : "E",
    "25" : "G,E,C",
    "36" : "D,Eb,C",
    "37" : "Bb,E,C",


    //F
    "29" : "F",
    "33" : "A",
    "30" : "C,A,F",
    "41" : "C,Ab,F",
    "42" : "Eb,A,F"

  };
  note.name = mapeamentoBaixos[note.number] || note.name;
  return note;
}

function sharpToFlat(nota) {
    const mapeamento = {
      'C#': 'Db',
      'D#': 'Eb',
      'F#': 'Gb',
      'G#': 'Ab',
      'A#': 'Bb'
    };

    return mapeamento[nota] || nota;
  }

  function criarObjetoPorTipo(tipo) {
    var objeto = {
      corvinoAcordeon : MIDI.Soundfont.corvinoAcordeon,
      baritone_sax: MIDI.Soundfont.baritone_sax,
      bassoon: MIDI.Soundfont.bassoon,
      cello: MIDI.Soundfont.cello,
      clarinet: MIDI.Soundfont.clarinet,
      flute: MIDI.Soundfont.flute,
      harmonica: MIDI.Soundfont.harmonica,
      kalimba: MIDI.Soundfont.kalimba,
      oboe: MIDI.Soundfont.oboe,
      piccolo: MIDI.Soundfont.piccolo,
      pizzicato_strings: MIDI.Soundfont.pizzicato_strings,
      soprano_sax: MIDI.Soundfont.soprano_sax,
      tenor_sax: MIDI.Soundfont.tenor_sax,
      violin: MIDI.Soundfont.violin,
      accordion: MIDI.Soundfont.accordion
    };
  
    return objeto[tipo] || MIDI.Soundfont.accordion;
  }
