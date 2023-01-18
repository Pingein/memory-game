
// izveido number[] kas satur karsu vertibas, un tas samaisa vietam
const getShuffledCards = (board_size:number):number[] => {
    let card_values:number[] = []
    for (let i = 0; i<board_size/2; i++){
        card_values.push(i)
        card_values.push(i)
    }
    card_values.sort((a,b) => Math.random()-0.5)
    return card_values
}


const updateStatsSpan = (span: HTMLElement, new_val:number) => {
    let text = span.innerHTML.split(':')[0]
    span.innerHTML = `${text}: ${new_val}`
}


const loadWinCount = () => {
    if (!localStorage.getItem('wins')) {
        localStorage.setItem('wins', '0')
    }
    return +localStorage.getItem('wins')
}


const loadSavedColor = () => {
    if (!localStorage.getItem('accent-color')) {
        localStorage.setItem('accent-color', '#e94b4b')
    }
    return localStorage.getItem('accent-color')
}


const loadSavedSize = () => {
    if (!localStorage.getItem('board-size')) {
        localStorage.setItem('board-size', '6')
    }
    return +localStorage.getItem('board-size')
}


interface HighScores {
    board_size: number
    moves: number[]
    time: number[]
}


interface GameScore {
    moves: number
    time: number
    deck_size: number
}

class Scores {
    scores: GameScore[] = []

    constructor () {
        
    }

    update(moves:number, time:number, deck_size:number) {
        this.scores.push({'moves':moves, 'time':time, 'deck_size':deck_size})
    }

    getTop5(deck_size:number, stat:'moves'|'time') {
        return this.filterDeckSize(deck_size)
                                .map(score => score[stat])
                                .sort((a,b)=>a-b)
                                .slice(0,5)
    }

    filterDeckSize(deck_size:number) {
        return this.scores.filter(score => score.deck_size == deck_size)
    }

    // "6time:1,1,2,3,4 6moves:3,3,3,4,5 12time:3,4,4,5,5 12m:..."
    saveScores() {
        let save_str = ''
        for (let deck_size of [6,12,24,48]) {
            save_str += `${deck_size}t:${this.getTop5(deck_size, 'time').join(',')} `
            save_str += `${deck_size}m:${this.getTop5(deck_size, 'moves').join(',')} `
        }
        console.log(save_str)
    }

    loadScores(saved_str:string) {
        let saved_scores = saved_str.split(' ')
        for (let score of saved_scores) {
            let [score_deck, scores] = score.split(':')
            let scores_arr = scores.split(',').map(c=>parseInt(c))
            let stat = score_deck.slice(score_deck.length-1)
            let size = score_deck.replace(stat, '')
            console.log(stat, size, scores_arr)
        }
    }
}


// vertibai un lai var pievienot velvienu neredzamu variable, kas ir karts vertiba
class Card extends HTMLDivElement {
    value: number
}


export { Scores, getShuffledCards, updateStatsSpan, Card, loadWinCount, loadSavedColor, loadSavedSize }