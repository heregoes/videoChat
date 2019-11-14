const getUserMedia = require('getusermedia')
const Peer = require('simple-peer')

getUserMedia({ video: true, audio: false }, (err, stream) => {
  if (err) {
    let errorDiv = document.getElementById('error')
    errorDiv.classList.add("alert", "alert-warning")
    errorDiv = errorDiv.innerHTML = "Camera not supported"
    console.error(err)
  }
  const peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream
  })

  peer.on('signal', data => {
    document.getElementById('yourId').value = JSON.stringify(data)
  })

  document.getElementById('connect').addEventListener('click', _ => {
    let otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })

  document.getElementById('send').addEventListener('click', _ => {
    let yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('data', data => {
    document.getElementById('messages').textContent += data + '\n'
  })

  peer.on('stream', stream => {
    let video = document.createElement('video')
    document.body.appendChild(video)

    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
})