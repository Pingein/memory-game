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

// card styles
const colors = ['red', 'green', 'blue', 'yellow', 'navy', 'cyan',
                'yellowgreen', 'white', 'salmon', 'pink', 'coral', 'lightblue']
// const emojis = ['😆', '😂', '🤪', '😵‍💫', '🥸', '😩',
//                 '😡', '😈', '💀', '👽', '💯', '🤙']

if (!localStorage.getItem('wins')) {
    localStorage.setItem('wins', '0')
}


let board_size = S

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


const create_start_button = () => {
    let start_button = document.createElement('div')
    start_button.id = 'start-button'
    start_button.className = 'btn'
    start_button.innerHTML = 'START'
    start_button.addEventListener('click', () => {
        // uzsak timeri, katru sekundi executo update_time()
        timer = setInterval(update_time, 1000)
        start_button.remove()
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

// speles biegu ekrans
const game_over = () => {
    // uztaisa game over screen div
    document.body.removeChild(game_grid)
    let screen = document.createElement('div')
    screen.id = 'info-container'
    // parbauda vai atvera visas kartis
    points*2 == board_size ? screen.innerHTML = 'YOU WIN' : screen.innerHTML = 'YOU LOSE'
    // izveido restart pogu
    let restart_button = document.createElement('div')
    restart_button.id = 'restart-button'
    restart_button.className = 'btn'
    restart_button.innerHTML = 'RESTART'

    restart_button.addEventListener('click', () => {
        screen.remove()
        resetGame()
    })
    document.body.appendChild(screen)
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

const update_stats_span = (span: HTMLElement, new_val:number) => {
    let [text, count] = span.innerHTML.split(' ', 1)
    span.innerHTML = `${text} ${new_val}`
}



create_start_button()


let game_grid:HTMLDivElement

// gajienu skaits
let moves = 0
let max_moves:number
// gajienu span elements
const moves_span = document.getElementById('moves')



// flip un change BG
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

let points = 0


const resetGame = () => {
    points = 0
    moves = 0
    time = 0
    hand = []
    uncovered = []
    card_values.sort((a,b) => Math.random()-0.5)
    update_stats_span(moves_span, moves)
    update_stats_span(timer_span, time)
    create_start_button()  
}

const wins_span = document.getElementById('wins')
let wins = +localStorage.getItem('wins')
update_stats_span(wins_span, wins)


// izveido number[] kas satur karsu vertibas, un tas samaisa vietam
let card_values:number[] = []
for (let i = 0; i<board_size/2; i++){
    card_values.push(i)
    card_values.push(i)
}
card_values.sort((a,b) => Math.random()-0.5)

// sets kas satur jau atverto karsu vertibas
let uncovered:number[] = []
// sets kas satur izveleto karsu vertibu, max 2
let hand:card[] = []

// card click handler
const handleCardClick = (card:card) => {
    // skipo ja vertiba jau ir bijusi atverta
    if (uncovered.includes(card.value) || hand.includes(card)) {
        return
    }

    showCard(card)

    // ja pirma karts
    if (hand.length == 0) {
        hand.push(card)
    }

    else {
        hand.push(card)
        moves += 1
        update_stats_span(moves_span, moves)

        // parbauda vai nav exceedots max moves, lose condition
        if (moves > max_moves) {
            setTimeout(game_over, 400)
        }

        // parbauda vai vienada vertiba , un vai atskirigi card objekti
        if (hand[0].value == hand[1].value && hand[0] != hand[1]) {

            // pievieno atvertajam kartim
            uncovered.push(hand[0].value)

            // run ja izveleta pareiza karts
            points += 1

            // run ja atver visas kartis, win condition
            if (points*2 == board_size) {

                wins += 1

                localStorage.setItem('wins', wins+'')

                update_stats_span(wins_span, wins)

                setTimeout(game_over, 400)
            }
        }
        // run ja izveleta nepareiza karts
        else {
            hand.forEach(card => hideCard(card))     
        }
        // notira izvilktas kartis un atkal nem pirmo karti
        hand = []
    }
}


const create_grid = (rows:number, columns:number) => {
    // izveido jaunu elementu, izmaina vertibas un css
    game_grid = document.createElement('div')
    game_grid.id = 'game-grid'
    game_grid.className = 'grid'
    game_grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
    game_grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`

    // seto max moves 
    max_moves = rows*columns*1.5


    for (let i = 0; i<rows*columns; i++) {
        // izveido jaunu elementu, card, pievieno vertibu un id
        let card = document.createElement('div') as card

        card.value = card_values[i] // randomizets arr
        card.className = `btn card`
        card.id = ''+i
        //card.innerHTML = ''+card_values[i] // janonem

        // pievienu event handler un pievieno karti gridam
        card.addEventListener('click', () => {
            handleCardClick(card)
        })
        game_grid.appendChild(card)
    }
    // uzliek grid uz ekrana
    document.body.appendChild(game_grid)
}



class card extends HTMLDivElement {
    value: number
}