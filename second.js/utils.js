function rectangularCollision({rectangle1,rectangle2}) {
   return ( rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width 
         && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
          && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
   )
}

function winningCondition ({player,enemy, timerId}) {

    clearTimeout(timerId)

    document.querySelector('#displayTie').style.display = 'flex'

    if(player.health === enemy.health){
        
        document.querySelector('#displayTie').innerHTML = 'Tie'
    
    } 
    else if(player.health > enemy.health){

        document.querySelector('#displayTie').innerHTML = 'Player 1 Wins'
        
    } 
    else if(enemy.health > player.health){

        document.querySelector('#displayTie').innerHTML = 'Player 2 Wins'
        
    }
}