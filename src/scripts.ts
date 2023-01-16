const S = 6
/*  6 cards
    O O O
    O O O
    O O O  
*/
const M = 12
/*  12 cards
    O O O O
    O O O O
    O O O O  
*/
const L = 24
/*  24 cards
    O O O O O O
    O O O O O O
    O O O O O O
    O O O O O O
*/
const XL = 48
/*  48 cards
    O O O O O O O O
    O O O O O O O O
    O O O O O O O O
    O O O O O O O O
    O O O O O O O O
    O O O O O O O O
*/



const create_start_button = ():HTMLDivElement => {
    let start_button = document.createElement('div')
    start_button.id = 'start-button'
    start_button.className = 'btn'
    start_button.innerHTML = 'START'
    start_button.addEventListener('click', () => {
        start_button.remove()
        //start_button.style.display = 'none'
        switch (board_size) {
            case S:
                create_grid(2, 3)
                break
            case M:
                create_grid(3, 4)
                break
            case L:
                create_grid(4, 6)
                break
            case XL:
                create_grid(6, 8)
                break
        }
    })
    document.body.appendChild(start_button)
    return start_button
}


create_start_button()


let game_grid:HTMLDivElement

// gajienu skaits
let moves = 0
let max_moves = 0
// gajienu span elements
const moves_span = document.getElementById('moves')

let wins = 0
const wins_span = document.getElementById('wins')


const timer_span = document.getElementById('time')




const update_stats_span = (span: HTMLElement, new_val:number) => {
    let [text, count] = span.innerHTML.split(' ', 1)
    span.innerHTML = `${text} ${new_val}`
}




let points = 0


let board_size = S

// izveido number[] kas satur karsu vertibas, un tas samaisa vietam
let card_values:number[] = []
for (let i = 0; i<board_size/2; i++){
    card_values.push(i)
    card_values.push(i)
}
card_values.sort((a,b) => Math.random()-0.5)


// variable kas pasaka vai si ir pirma vai otra karts kas tiek nemta
let first = true
// sets kas satur izveleto karsu vertibu, max 2
let hand:card[] = []
// card click handler
const handleCardClick = (card:card) => {
    console.log(card.value)
    console.log(hand)



    // ja pirma karts
    if (first) {
        hand.push(card)
        card.style.opacity = '0.7'
        first = false
    }

    // ja otra karts
    else {
        hand.push(card)
        moves += 1


        // parbauda vai nav exceedots max moves
        if (moves > max_moves) {
            // start button popup

            

            moves = 0
            update_stats_span(moves_span, 0)
        }

        
        update_stats_span(moves_span, moves)
    
        // parbauda vai vienada vertiba , un vai atskirigi card objekti
        if (hand[0].value == hand[1].value && hand[0] != hand[1]) {

            // run ja izveleta pareiza karts
            points += 1
            console.log(points)
            hand.forEach(card => card.style.opacity = '0.1')

            // run ja beidzas neatvertas kartis
            if (points*2 == board_size) {

                // pievieno W, reseto points, shufflo card_values
                wins += 1
                points = 0
                card_values.sort((a,b) => Math.random()-0.5)
                // moves: nomaina uz nulle, wins: uz wins
                update_stats_span(moves_span, 0)
                update_stats_span(wins_span, wins)

                // nonem grid
                document.body.removeChild(document.getElementById('game-grid'))
                
                create_start_button()
                
            }

        }
        else {

            // run ja izveleta nepareiza karts
            hand[0].style.opacity = '1'
        }
        // notira izvilktas kartis un atkal nem pirmo karti
        hand = []
        first = true
    }
}








const create_grid = (rows:number, columns:number) => {

    game_grid = document.createElement('div')
    game_grid.id = 'game-grid'
    game_grid.className = 'grid'

    // norada grid izvietojumu
    game_grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
    game_grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`

    // seto max moves
    max_moves = rows*columns*2

    // katru reizi uztaisa jaunu elementu un pievieno grid
    for (let i = 0; i<rows*columns; i++) {
        let card = document.createElement('div') as card

        card.value = card_values[i]

        card.innerHTML = ''+card_values[i] // janonem
        card.className = `btn card` // pedeja klase nosaka kur atrodas
        card.id = ''+i
        card.addEventListener('click', () => {
            handleCardClick(card)
        })
        game_grid.appendChild(card)

    }

    document.body.appendChild(game_grid)
}


class card extends HTMLDivElement {
    value: number
}