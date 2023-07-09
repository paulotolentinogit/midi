const audioList = [];
const audio = {};

function play(instrumento, tecla, nota, oitava) {
  if (nota.indexOf('#') !== -1) {
    nota = sharpToFlat(nota);
  }

  acorde = nota.split(",");
  audio[instrumento] = audio[instrumento] || {};
  acorde.forEach(function(nota) {
    try{
      log(`Iniciando a nota instrumento: ${instrumento}, tecla: ${tecla}, nota: ${nota}, oitava ${oitava}`);
      audio[instrumento][tecla] = audio[instrumento][tecla] || {};
      audio[instrumento][tecla][`${nota}`] = new Audio(MIDI.Soundfont.accordion[nota + oitava]);
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
    //D
    "54" : "D",
    "20" : "F#",
    "23" : "A,F#,D",
    "22" : "A,F,D",
    "21" : "C,F#,D",

    //G
    "35" : "G",
    "51" : "B",
    "50" : "D,B,G",
    "47" : "D,Bb,G",
    "52" : "F,B,G",

    //C
    "28" : "C",
    "55" : "E",
    "48" : "G,E,C",
    "40" : "G,Eb,C",
    "53" : "Bb,E,C",
    
    //F
    "33" : "F",
    "49" : "A",
    "34" : "C,F,A",
    "45" : "C,Ab,F",
    "46" : "Eb,A,F",

    //Bb
    "26" : "Bb",
    "54" : "D",
    "27" : "F,D,Bb",
    "38" : "F,Db,Bb",
    "39" : "Ab,D,Bb",

    //Eb
    "31" : "Eb",
    "35" : "G",
    "32" : "Bb,G,Eb",
    "43" : "Bb,Gb,Eb",
    "44" : "Db,G,Eb",

    //Ab
    "24" : "Ab",
    "28" : "C",
    "25" : "Eb,C,Ab",
    "36" : "Eb,B,Ab",
    "37" : "Gb,C,Ab",


    //Db
    "29" : "Db",
    "33" : "F",
    "30" : "Ab,F,Db",
    "41" : "Ab,E,Db",
    "42" : "B,F,Db"

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