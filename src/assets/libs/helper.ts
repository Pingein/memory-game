
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
    console.log(localStorage.getItem('accent-color'))
    if (!localStorage.getItem('accent-color')) {
        localStorage.setItem('accent-color', '#e94b4b')
    }
    return localStorage.getItem('accent-color')
}


const loadSavedSize = () => {
    console.log(localStorage.getItem('board-size'))
    if (!localStorage.getItem('board-size')) {
        localStorage.setItem('board-size', '6')
    }
    return +localStorage.getItem('board-size')
}


// vertibai un lai var pievienot velvienu neredzamu variable, kas ir karts vertiba
class card extends HTMLDivElement {
    value: number
}


export { getShuffledCards, updateStatsSpan, card, loadWinCount, loadSavedColor, loadSavedSize }