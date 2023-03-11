let appID = "8e149cda1cab45e89639ff5348e063cc"
let token = null;
let uid = String(Math.floor(Math.random() * 1232))

let roomsData = {}

let initiate = async () => {
    let rtmClient = await AgoraRTM.createInstance(appID)
    await rtmClient.login({uid})
    

    let lobbyChannel = await rtmClient.createChannel('lobby')
    await lobbyChannel.join()

    rtmClient.on('MessageFromPeer', async (message, peerId) => {
        console.log("We just got a message from peer")
        let messageData = JSON.parse(message.text)
        let count = await rtmClient.getChannelMemberCount([messageData.room])
        roomsData[messageData.room] = {'members':count}

        let rooms = document.getElementById('room_container')
        let room = document.getElementById(`room_${messageData.room}`)
        if(room === null) {
            console.log('room is null')
            room = await buildRoom(count, messageData.room)
            rooms.insertAdjacentHTML('beforeend', room)
        }
    })

    let buildRoom = async (count, room_id) => {
        let attributes = await rtmClient.getChannelAttributes(room_id, ['room_name', 'host', 'host_image'])
        let roomName = attributes.room_name.value
        let hostName = attributes.host.value
        let hostImage = attributes.host_image.value

        let roomItem = `<div class="room_item" id="room_${room_id}">
        <img src="/Images/1.png" alt="Room Image">
        <div class="room_content">
            <p class="room_meta">
                <!--svg xmls="http://www.w3.org/2000/svg" width="40" height="40"></svg-->
                <span>${count} Watching</span>
            </p>
            <h4 class="room_title">${roomName}</h4>
            <div class="room_box">
                <div class="room_author">
                    <img src="${hostImage}" alt="" class="avatar_md">
                    <strong class="message_author">${hostName}</strong>
                </div>
                <a href="join.html?room=${room_id}" class="room_action">Join Now</a>
            </div>
        </div>
    </div>`
    return roomItem
    }

    let checkHeartBeat = async () => {
        console.log('checkHeartBeat....')
        for(let room_id in roomsData) {
            let count = await rtmClient.getChannelMemberCount([room_id])
            if(count[room_id] < 1) {
                document.getElementById(`room_${room_id}`).remove()
                delete roomsData[room_id]
            }else {
                let newRoom; //= document.getElementById(`room_${room_id}`)
                let rooms = document.getElementById('room_container')
                newRoom = await buildRoom(count[room_id], room_id)
                document.getElementById(`room_${room_id}`).innerHTML = newRoom
                //rooms.insertAdjacentHTML(newRoom)
            }
        }
    }

    let interval = setInterval(() => {
        checkHeartBeat()
    }, 2000)
    return () => clearInterval(interval)
}

initiate()