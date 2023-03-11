let avatar

let lobbyForm = document.getElementById('lobby_form')
lobbyForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    if(!avatar) {
        alert('Dont forget to set your avatar!')
        return
    }

    let urlParams = new URLSearchParams(window.location.search)
    let roomId = urlParams.get('room')

    sessionStorage.setItem('display_name', e.target.name.value)
    lobbyForm.reset()
    window.location = `room.html?room=${roomId}`
})

let avatarOptions = document.getElementsByClassName('avatar_option')

for (let i=0; avatarOptions.length > i; i++) {
    avatarOptions[i].addEventListener('click', (e) => {

        for (let i=0; avatarOptions.length > i; i++) {
            avatarOptions[i].classList.remove('avatar_option_selected')
        }

        e.target.classList.add('avatar_option_selected')
        avatar = e.target.src
        sessionStorage.setItem('avatar', avatar)
    })

}
