import {Howl} from 'howler'
import audioFeuArtificeExplosion from '../audio/audioFeuArtificeExplosion.mp3'
import audioFeuArtificeSifflement from '../audio/audioFeuArtificeSifflement.mp3'
import audioFinNiveau from '../audio/audioFinNiveau.mp3'
import audioMort from '../audio/audioMort.mp3'
import audioNiveau from '../audio/audioNiveau.mp3'
import audioNiveauGagné from '../audio/audioNiveauGagné.mp3'
import audioPerdu from '../audio/audioPerdu.mp3'
import audioPowerUpPerdu from '../audio/audioPowerUpPerdu.mp3'
import audioSaut from '../audio/audioSaut.mp3'
import audioTirBouleDefeu from '../audio/audioTirBouleDefeu.mp3'
import audioTombe from '../audio/audioTombe.mp3'
import goombaMort from '../audio/goombaMort.mp3'

export const audio = {
    goombaMort: new Howl({
        src: [goombaMort],
        volume: 0.05
    }),
    Tombe: new Howl({
        src: [audioTombe],
        volume: 0.05
    }),
    Saut: new Howl({
        src: [audioSaut],
        volume: 0.05
    }),
    PowerUpPerdu: new Howl({
        src: [audioPowerUpPerdu],
        volume: 0.05
    }),
    Perdu: new Howl({
        src: [audioPerdu],
        volume: 0.05
    }),
    NiveauGagné: new Howl({
        src: [audioNiveauGagné],
        volume: 0.05
    }),
    Niveau: new Howl({
        src: [audioNiveau],
        volume: 0.05,
        loop: true,
        autoplay: true
    }),
    Mort: new Howl({
        src: [audioMort],
        volume: 0.05
    }),
    FinNiveau: new Howl({
        src: [audioFinNiveau],
        volume: 0.05
    }),
    FeuArtificeSifflement: new Howl({
        src: [audioFeuArtificeSifflement],
        volume: 0.05
    }),
    FeuArtificeExplosion: new Howl({
           src: [audioFeuArtificeExplosion],
           volume: 0.05
    }),
    TirBouleDefeu: new Howl({
       src: [audioTirBouleDefeu],
       volume: 0.05
    })
}
