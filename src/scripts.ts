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


const timer_span = document.getElementById('time')
let timer:NodeJS.Timer = setInterval(()=>{})
let time = 0
const update_time = () => {
    time += 1
    update_stats_span(timer_span, time)
}
const clear_time = () => {
    time = 0
    update_time()
}


const create_start_button = ():HTMLDivElement => {
    let start_button = document.createElement('div')
    start_button.id = 'start-button'
    start_button.className = 'btn'
    start_button.innerHTML = 'START'
    start_button.addEventListener('click', () => {
        timer = setInterval(update_time, 1000)
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


const game_over = (message:string) => {
    let screen = document.createElement('div')
    screen.id = 'info-container'
    screen.innerHTML = message
    // screen.addEventListener('click', () => {

    // })
    document.body.appendChild(screen)
    let restart_button = document.createElement('div')
    restart_button.id = 'restart-button'
    restart_button.className = 'btn'
    restart_button.innerHTML = 'RESTART'
    restart_button.addEventListener('click', () => {
        screen.remove()
        resetGame()
    })
    screen.appendChild(restart_button)
    clearInterval(timer)
}


let options = ['change_size', 'change_color']


const menu = document.getElementById('menu')
menu.addEventListener('mouseenter', () => {
    menu.style.height = (30*(options.length+1) + 10*options.length)+'px'

})
menu.addEventListener('mouseleave', () => {
    menu.style.height = '30px'
})


create_start_button()


let game_grid:HTMLDivElement

// gajienu skaits
let moves = 0
let max_moves = 0
// gajienu span elements
const moves_span = document.getElementById('moves')

let wins = 0
const wins_span = document.getElementById('wins')


const update_stats_span = (span: HTMLElement, new_val:number) => {
    let [text, count] = span.innerHTML.split(' ', 1)
    span.innerHTML = `${text} ${new_val}`
}

const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'cyan',
                'yellowgreen', 'white', 'pink', 'salmon', 'coral', 'lightblue']


const showCard = (card:card) => {
    card.style.opacity = '0.8'
    card.innerHTML = card.value+''
    card.style.backgroundColor = colors[card.value]
}
const hideCard = (card:card) => {
    setTimeout(() => {
        card.innerHTML = ''
        card.style.opacity = '1'
        card.style.backgroundColor = null
    }, 200)
}

let points = 0


const resetGame = () => {
    //document.body.removeChild(game_grid)
    points = 0
    moves = 0
    time = 0
    hand = []
    card_values.sort((a,b) => Math.random()-0.5)
    update_stats_span(moves_span, moves)
    update_stats_span(timer_span, time)
    //update_time()
    create_start_button()  
}


let board_size = S

// izveido number[] kas satur karsu vertibas, un tas samaisa vietam
let card_values:number[] = []
for (let i = 0; i<board_size/2; i++){
    card_values.push(i)
    card_values.push(i)
}
card_values.sort((a,b) => Math.random()-0.5)




// sets kas satur izveleto karsu vertibu, max 2
let hand:card[] = []
// card click handler
const handleCardClick = (card:card) => {
    showCard(card)

    // ja pirma karts
    if (hand.length == 0) {
        hand.push(card)
    }

    // ja otra karts
    else {
        hand.push(card)
        moves += 1
        update_stats_span(moves_span, moves)

        // parbauda vai nav exceedots max moves, lose condition
        if (moves > max_moves) {
            // game over screen
            document.body.removeChild(game_grid)
            game_over('YOU LOSE')
        }

        
        
    
        // parbauda vai vienada vertiba , un vai atskirigi card objekti
        if (hand[0].value == hand[1].value && hand[0] != hand[1]) {

            // run ja izveleta pareiza karts
            points += 1
            
            // run ja atver visas kartis, win condition
            if (points*2 == board_size) {

                wins += 1
                update_stats_span(wins_span, wins)

                document.body.removeChild(game_grid)
                game_over('YOU WIN')
            }

        }
        else {
            // run ja izveleta nepareiza karts
            hand.forEach(card => hideCard(card))
            
        }
        // notira izvilktas kartis un atkal nem pirmo karti
        hand = []
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
    max_moves = rows*columns

    // katru reizi uztaisa jaunu elementu un pievieno grid
    for (let i = 0; i<rows*columns; i++) {
        let card = document.createElement('div') as card

        card.value = card_values[i]

        //card.innerHTML = ''+card_values[i] // janonem
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