const audio = {};
const audioSampleCache = {};

const playbackConfig = {
  instrumento1: {
    tipoSom: 'accordion'
  },
  instrumento2: {
    tipoSom: 'corvinoAcordeon',
    oitava: 3
  }
};

function atualizarConfigPlayback(config) {
  if (!config) return;

  if (config.instrumento1 && config.instrumento1.tipoSom) {
    playbackConfig.instrumento1.tipoSom = config.instrumento1.tipoSom;
  }

  if (config.instrumento2) {
    if (config.instrumento2.tipoSom) {
      playbackConfig.instrumento2.tipoSom = config.instrumento2.tipoSom;
    }
    if (Number.isInteger(config.instrumento2.oitava)) {
      playbackConfig.instrumento2.oitava = config.instrumento2.oitava;
    }
  }
}

function resolverConfiguracaoInstrumento(instrumento) {
  if (instrumento === 2) {
    return {
      tipoSom: playbackConfig.instrumento2.tipoSom,
      oitava: playbackConfig.instrumento2.oitava
    };
  }

  return {
    tipoSom: playbackConfig.instrumento1.tipoSom,
    oitava: null
  };
}

function obterAudioCacheado(src, cacheKey) {
  if (!audioSampleCache[cacheKey]) {
    audioSampleCache[cacheKey] = new Audio(src);
    audioSampleCache[cacheKey].preload = 'auto';
  }

  return audioSampleCache[cacheKey].cloneNode();
}

function play(instrumento, tecla, nota, oitava) {

  const acorde = nota.split(",");
  audio[instrumento] = audio[instrumento] || {};
  acorde.forEach(function(notaAtual) {
    try {
      let notaNormalizada = notaAtual;
      if (notaNormalizada.indexOf('#') !== -1) {
        notaNormalizada = sharpToFlat(notaNormalizada);
      }

      const configuracao = resolverConfiguracaoInstrumento(instrumento);
      const oitavaFinal = instrumento === 2 ? configuracao.oitava : oitava;
      const tipoSom = configuracao.tipoSom;

      log(`Iniciando a nota instrumento: ${instrumento}, tecla: ${tecla}, nota: ${notaNormalizada}, oitava ${oitavaFinal}`);
      audio[instrumento][tecla] = audio[instrumento][tecla] || {};

      const instrumentoEfeito = criarObjetoPorTipo(tipoSom);
      const sampleSrc = tipoSom === "corvinoAcordeon"
        ? instrumentoEfeito[tecla]
        : instrumentoEfeito[notaNormalizada + oitavaFinal];

      if (!sampleSrc) {
        log(`Sample não encontrado para tipoSom: ${tipoSom}, nota: ${notaNormalizada}, oitava: ${oitavaFinal}`);
        return;
      }

      const cacheKey = `${tipoSom}|${sampleSrc}`;
      audio[instrumento][tecla][`${notaNormalizada}`] = obterAudioCacheado(sampleSrc, cacheKey);
      audio[instrumento][tecla][`${notaNormalizada}`].currentTime = 0;
      audio[instrumento][tecla][`${notaNormalizada}`].play();
    } catch (e) {
      log(`Erro iniciando a nota instrumento: ${instrumento}, tecla: ${tecla}, nota: ${notaAtual}. Erro: ${e?.message || e}`);
    }
  });
}


function stop(instrumento, tecla, nota) {

  const acorde = nota.split(",");
  acorde.forEach(function(notaAtual) {
    let notaNormalizada = notaAtual;
    if (notaNormalizada.indexOf('#') !== -1) {
      notaNormalizada = sharpToFlat(notaNormalizada);
    }

    if (audio[instrumento] && audio[instrumento][tecla] && audio[instrumento][tecla][notaNormalizada]) {
      try {
        const player = audio[instrumento][tecla][`${notaNormalizada}`];
        player.pause();
        player.currentTime = 0;
        log(`Parando a nota instrumento: ${instrumento}, tecla: ${tecla}, nota: ${notaNormalizada}`);
      } catch (e) {
        log(`Erro parando a nota instrumento: ${instrumento}, tecla: ${tecla}, nota: ${notaNormalizada}. Erro: ${e?.message || e}`);
      }
    }
  });
}
function traduzBaixos(note){

  const mapeamentoBaixos = {
    // F#
    "54" : "F#",
    "20" : "A#",
    "23" : "C#,A#,F#",
    "22" : "C#,A,F#",
    "21" : "E,A#,F#",

    // B
    "35" : "B",
    "51" : "D#",
    "50" : "F#,D#,B",
    "47" : "F#,D,B",
    "52" : "A,D#,B",

    // E
    "28" : "E",
    "55" : "G#",
    "48" : "B,G#,E",
    "40" : "B,G,E",
    "53" : "D,G#,E",
    
    // A
    "33" : "A",
    "49" : "C#",
    "34" : "E,C#,A",
    "45" : "E,C,A",
    "46" : "G,C#,A",

    // D
    "26" : "D",
    "27" : "A,F#,D",
    "38" : "A,F,D",
    "39" : "C,F#,D",

    // G
    "31" : "G",
    "32" : "D,B,G",
    "43" : "D,Bb,G",
    "44" : "F,B,G",

    // C
    "24" : "C",
    "25" : "G,E,C",
    "36" : "D,Eb,C",
    "37" : "Bb,E,C",


    // F
    "29" : "F",
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
