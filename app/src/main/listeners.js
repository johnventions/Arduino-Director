export default function (ipcMain, serialService) {
    ipcMain.on('GET_PORTS', async (event, arg) => {
        serialService.getPorts((ports) => {
            console.log('returning ports', ports)
            event.sender.send('PORTS', ports)
        })
    })

    ipcMain.on('SERIAL_WRITE', (event, arg) => {
        serialService.write(arg)
    })

    ipcMain.on('CONNECT', (event, arg) => {
        console.log('connect listener')
        serialService.connect(arg,
            (port) => {
                event.sender.send('CONNECTED', port)
            },
            (error) => {
                event.sender.send('DISCONNECTED', error)
            }
        )
    })
}
