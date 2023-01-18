
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


const round = (number:number, decimal:number) => {
    return Math.round(number*(10**decimal))/10**decimal
}


const updateStatsSpan = (span: HTMLElement, new_val:number|string) => {
    let text = span.innerHTML.split(':')[0]
    span.innerHTML = `${text}: ${new_val}`
}


const loadLocalStorage = (item:string, default_value:string) => {
    if (!localStorage.getItem(item)) {
        localStorage.setItem(item, default_value)
    }
    return localStorage.getItem(item)
}


interface GameScore {
    moves: number
    time: number
    deck_size: number
}


class Scores {
    scores: GameScore[] = []
    saved_scores: string

    constructor (saved_scores:string) {
        this.scores = JSON.parse(saved_scores)
    }

    update(moves:number, time:number, deck_size:number) {
        let score:GameScore = {'moves':moves, 'time':round(time, 2), 'deck_size':deck_size}
        this.scores.push(score)
        this.saveScores()
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

    saveScores() {
        localStorage.setItem('saved-scores', JSON.stringify(this.scores))
    }
}



// vertibai un lai var pievienot velvienu neredzamu variable, kas ir karts vertiba
class Card extends HTMLDivElement {
    value: number
}


export { Scores, Card, round, getShuffledCards, updateStatsSpan, loadLocalStorage }