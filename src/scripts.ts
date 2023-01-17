import { getShuffledCards, updateStatsSpan, Card, loadWinCount, loadSavedColor, loadSavedSize } from './assets/libs/helper'
import {SMALL, MEDIUM, LARGE, XLARGE, colors} from './assets/libs/consts'
import { showCard, hideCard } from './assets/libs/animations'


let board_size = loadSavedSize()

let cards_found = 0
let moves = 0
let time = 0
let wins = loadWinCount()
let timer:NodeJS.Timer // time interval kas ik pec sekundes laikam pieliek 1

let max_moves:number // seto gajienus kad izveido grid
let game_grid:HTMLDivElement // game-grid elements

let card_values = getShuffledCards(board_size)
let uncovered:number[] = [] // sets kas satur jau atverto karsu vertibas
let hand:Card[] = [] // sets kas satur izveleto karsu vertibu, max 2


const timer_span = document.getElementById('time')
const menu = document.getElementById('menu')
const moves_span = document.getElementById('moves')
const wins_span = document.getElementById('wins') 
const root = document.querySelector(':root') as HTMLElement


// card click handler
const handleCardClick = (card:Card) => {

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
        updateStatsSpan(moves_span, moves)

        // parbauda vai nav exceedots max moves, lose condition
        if (moves > max_moves) {
            setTimeout(gameOver, 400)
        }

        // parbauda vai vienada vertiba , un vai atskirigi card objekti
        if (hand[0].value == hand[1].value && hand[0] != hand[1]) {

            // pievieno atvertajam kartim
            uncovered.push(hand[0].value)
            // run ja izveleta pareiza karts
            cards_found += 2

            // run ja atver visas kartis, win condition
            if (cards_found == board_size) {
                // pivieno uzvaru, un updato localStorage
                wins += 1
                localStorage.setItem('wins', wins+'')
                updateStatsSpan(wins_span, wins)
                setTimeout(gameOver, 400)
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


// izveido 'start-button' elementu, saliek visas vertibas tam 
const createStartButton = () => {
    let start_button = document.createElement('div')
    start_button.id = 'start-button'
    start_button.className = 'btn'
    start_button.innerHTML = 'START'
    start_button.addEventListener('click', () => {
        // uzsak timeri, katru sekundi executo update_time()
        timer = setInterval(() => {
            time += 1
            updateStatsSpan(timer_span, time)
        }, 1000)
        start_button.remove()
        switch (board_size) {
            case SMALL:
                create_grid(2, 3)
                break
            case MEDIUM:
                create_grid(3, 4)
                break
            case LARGE:
                create_grid(4, 6)
                break
            case XLARGE:
                create_grid(6, 8)
                break
        }
    })
    document.body.appendChild(start_button)
    return start_button
}


const create_grid = (rows:number, columns:number) => {
    // izveido jaunu elementu, saliek vertibas un css grid layout
    game_grid = document.createElement('div')
    game_grid.id = 'game-grid'
    game_grid.className = 'grid'
    game_grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
    game_grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`

    // seto max moves 
    max_moves = rows*columns*1.5


    for (let i = 0; i<rows*columns; i++) {
        // izveido jaunu elementu, card, pievieno vertibu un id
        let card = document.createElement('div') as Card
        card.className = `btn card`
        card.value = card_values[i] // randomizets arr

        //card.innerHTML = ''+card_values[i] + ' ' + colors[card.value] // janonem
        // pievienu event handler un pievieno karti gridam
        card.addEventListener('click', () => {
            handleCardClick(card)
        })
        game_grid.appendChild(card)
    }
    // uzliek grid uz ekrana
    document.body.appendChild(game_grid)
    return game_grid
}


// speles biegu ekrans
const gameOver = () => {
    // uztaisa game over screen div
    document.body.removeChild(game_grid)
    let screen = document.createElement('div')
    screen.id = 'info-container'
    // parbauda vai atvera visas kartis
    cards_found == board_size ? screen.innerHTML = 'YOU WIN' : screen.innerHTML = 'YOU LOSE'
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


// reseto status, samaisa kartis un uzliek jaunu start pogu
const resetGame = (skip_start_btn:boolean = false) => {
    cards_found = 0
    moves = 0
    time = 0
    hand = []
    uncovered = []
    card_values.sort((a,b) => Math.random()-0.5)
    updateStatsSpan(moves_span, moves)
    updateStatsSpan(timer_span, time)
    clearInterval(timer)

    let start_button = createStartButton() 
    if (skip_start_btn) {
        start_button.click()
    }

}


// uztaisa menu pogas
const createMenuBtn = (fn:Function, innerHTML:string='', tooltip:string='') => {
    let menu_btn = document.createElement('div')
    menu_btn.className = 'menu-btn'
    menu_btn.innerHTML = innerHTML
    menu_btn.title = tooltip
    menu_btn.addEventListener('click', ()=>{fn()})
    menu.appendChild(menu_btn)
    return menu_btn
}

// relaodo board ar jauno izmeru
const changeBoardSize = (size:number) => {
    board_size = size
    card_values = getShuffledCards(board_size)
    localStorage.setItem('board-size', ''+size)
    if (document.getElementById('start-button')) {
        document.getElementById('start-button').remove()
    }  
    if (document.getElementById('game-grid')) {
        document.getElementById('game-grid').remove()

        resetGame(true)
        return
    }
    if (document.getElementById('info-container')) {
        document.getElementById('info-container').remove()
    }
    resetGame()
}

// poga lai switchotu starp izmeriem
let change_size_btn = createMenuBtn(() => {
    let sizes = [SMALL, MEDIUM, LARGE, XLARGE] 
    if (board_size == XLARGE) {
        board_size = SMALL
    } else {
        board_size = sizes[sizes.indexOf(board_size)+1]
    }
    changeBoardSize(board_size)
    change_size_btn.innerHTML = ''+board_size

}, ''+board_size, 'Change Board Size')

// poga lai mainitu krasu
createMenuBtn(() => {
    let color_picker = document.createElement('input')
    color_picker.type = 'color'
    color_picker.click()
    color_picker.value = localStorage.getItem('accent-color')
    color_picker.addEventListener('input', () => {
        root.style.setProperty('--accent-color', color_picker.value)
        localStorage.setItem('accent-color', color_picker.value)
    })
}, 'C', 'Change color')

//poga lai resetotu visu back uz default
createMenuBtn(() => {
    localStorage.setItem('accent-color', '#e94b4b')
    localStorage.setItem('wins', '0')
    localStorage.setItem('board-size', ''+MEDIUM)
    document.location.reload()
}, '۩', 'Restore')

//poga lai paraditu karsu vertibas
createMenuBtn(() => {
    let cards = [...game_grid.children] as Card[]
    if (cards[0].innerHTML == '') {
        cards.forEach(card => {
            card.innerHTML = (card as Card).value + ''
        })
    } else {
        cards.forEach(card => {
            card.innerHTML = ''
        })
    }
}, '۞', 'See card values')


// expand menu
menu.addEventListener('mouseenter', () => {
    menu.style.transition = '0.2s'
    menu.style.height = ((40*menu.childElementCount)-10)+'px'
})
menu.addEventListener('mouseleave', () => {
    menu.style.height = '30px'
    setTimeout(() => {
        menu.style.transition = '0s'
    }, 200)
})


root.style.setProperty('--accent-color', loadSavedColor())
updateStatsSpan(wins_span, wins)
createStartButton()
