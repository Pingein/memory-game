
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


// vertibai un lai var pievienot velvienu neredzamu variable, kas ir karts vertiba
class card extends HTMLDivElement {
    value: number
}


export {getShuffledCards, updateStatsSpan, card, loadWinCount}