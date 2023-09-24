/**
SPDX-License-Identifier: GPL-3.0-only
(c) Veghead 2023
*/

var context = null

const c5_tones = {
    'defs': {
        '1': {
            'f1': 700,
            'f2': 900,
            'ton': 55,
            'playing': false
        },
        '2': {
            'f1': 700,
            'f2': 1100,
            'ton': 55,
            'playing': false
        },
        '3': {
            'f1': 900,
            'f2': 1100,
            'ton': 55,
            'playing': false
        },
        '4': {
            'f1': 700,
            'f2': 1300,
            'ton': 55,
            'playing': false
        },
        '5': {
            'f1': 900,
            'f2': 1300,
            'ton': 55,
            'playing': false
        },
        '6': {
            'f1': 1100,
            'f2': 1300,
            'ton': 55,
            'playing': false
        },
        '7': {
            'f1': 700,
            'f2': 1500,
            'ton': 55,
            'playing': false
        },
        '8': {
            'f1': 900,
            'f2': 1500,
            'ton': 55,
            'playing': false
        },
        '9': {
            'f1': 1100,
            'f2': 1500,
            'ton': 55,
            'playing': false
        },
        '0': {
            'f1': 1300,
            'f2': 1500,
            'ton': 55,
            'playing': false
        },
        'ST': {
            'f1': 1500,
            'f2': 1700,
            'ton': 55,
            'playing': false
        },
        'ST2': {
            'f1': 900,
            'f2': 1700,
            'ton': 55,
            'playing': false
        },
        'ST2': {
            'f1': 900,
            'f2': 1700,
            'ton': 55,
            'playing': false
        },
        'ST3': {
            'f1': 700,
            'f2': 1700,
            'ton': 55,
            'playing': false
        },
        'KP': {
            'f1': 1100,
            'f2': 1700,
            'ton': 100,
            'playing': false
        },
        'KP2': {
            'f1': 1100,
            'f2': 1700,
            'ton': 100,
            'playing': false
        },
        'CFS': {
            'name': 'CF/S',
            'f1': 2400,
            'f2': 2600,
            'playing': false,
            'player': () => {
                key.osc1 = context.createOscillator()
                key.osc2 = context.createOscillator()
                key.osc3 = context.createOscillator()
                key.osc1.frequency.value = key.f1
                key.osc2.frequency.value = key.f2
                key.osc3.frequency.value = key.f1
                key.g1 = context.createGain()
                key.g2 = context.createGain()
                key.g3 = context.createGain()
                key.osc1.connect(key.g1)
                key.osc2.connect(key.g2)
                key.osc3.connect(key.g2)
                key.g1.connect(context.destination)
                key.g2.connect(context.destination)
                key.g3.connect(context.destination)
                key.osc1.start()
                key.osc2.start()
                key.osc3.start(context.currentTime + 160 / 1000)
                key.osc1.stop(context.currentTime + 150 / 1000)
                key.osc2.stop(context.currentTime + 150 / 1000)
                key.osc3.stop(context.currentTime + 390 / 1000)
            }
        },
    },
    'box': {
        'blue': ['1', '2', '3', 'ST2', '4,_br', '5', '6', 'KP2', '7,_br', '8', '9', 'ST3', 'KP,_br', '0', 'ST', 'CFS']
    },
    'keyplay': (key_id) => {
        key = c5_tones.defs[key_id]
        if (key.playing) return
        if (!context) {
            context = new AudioContext()
        }
        if ('player' in key) {
            key.player(key_id)
            return
        }
        key.osc1 = context.createOscillator()
        key.osc1.frequency.value = key.f1
        key.g1 = context.createGain()
        key.osc1.connect(key.g1)
        key.osc2 = context.createOscillator()
        key.osc2.frequency.value = key.f2
        key.g2 = context.createGain()
        key.osc2.connect(key.g2)
        key.g1.connect(context.destination)
        key.g2.connect(context.destination)
        key.osc1.start()
        key.osc2.start()
        key.osc1.stop(context.currentTime + key.ton / 1000)
        key.osc2.stop(context.currentTime + key.ton / 1000)
        key.playing = false
    }
}

function keypress(key) {
    c5_tones.keyplay(key.index)
}

function bluebox_boot() {
    var div = document.getElementById('keys')
    var key = document.createElement('button')
    key.className = 'key'
    c5_tones.box.blue.forEach((kd) => {
        var key_props = kd.split(',')
        var name = key_props[0]
        var k = key.cloneNode()
        k.textContent = ('name' in c5_tones.defs[name] ? c5_tones.defs[name].name : name)
        if (key_props.includes('_br')) {
            k.className += ' br'
        }
        k.onmousedown = (event) => { keypress(event.target) }
        k.touchstart = (event) => { keypress(event.target) }
        k.index = name
        div.appendChild(k)
    })
}
