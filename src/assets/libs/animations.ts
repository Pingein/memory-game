import { card } from './helper'
import { colors } from './consts'

//flip un change BG
const showCard = (card:card) => {
    //card.innerHTML = card.value+''
    card.style.width = '0%'
    setTimeout(() => {
        //card.innerHTML = emojis[card.value]  

        card.style.width = '100%'
        card.style.background = colors[card.value]
    }, 70)
}
// flip un change BG
const hideCard = (card:card) => {
    // lai var paspet atcereties
    setTimeout(()=>{
        card.style.width = '0%'
        setTimeout(() => {
            //card.innerHTML = ''
            card.style.width = '100%'
            card.style.background = 'url(./assets/images/pattern.svg)'
        }, 70)
    }, 350)
}

export {showCard, hideCard}