const spells=[
    {
        "name": "快速1",
        "cost": 125,
        "heal": 224,
        "add": 0.45
    },
    {
        "name": "快速2",
        "cost": 155,
        "heal": 297,
        "add": 0.45
    },
    {
        "name": "快速3",
        "cost": 185,
        "heal": 372,
        "add": 0.45
    },
    {
        "name": "快速4",
        "cost": 215,
        "heal": 453,
        "add": 0.45
    },
    {
        "name": "快速5",
        "cost": 265,
        "heal": 583,
        "add": 0.45
    },
    {
        "name": "快速6",
        "cost": 315,
        "heal": 722,
        "add": 0.45
    },
    {
        "name": "快速7",
        "cost": 380,
        "heal": 901,
        "add": 0.45
    },
    {
        "name": "治疗术1",
        "cost": 155,
        "heal": 330,
        "add": 0.85
    },
    {
        "name": "治疗术2",
        "cost": 205,
        "heal": 476,
        "add": 0.85
    },
    {
        "name": "治疗术3",
        "cost": 255,
        "heal": 624,
        "add": 0.85
    },
    {
        "name": "治疗术4",
        "cost": 305,
        "heal": 780,
        "add": 0.85
    },
    {
        "name": "强效1",
        "cost": 370,
        "heal": 981,
        "add": 0.85
    },
    {
        "name": "强效2",
        "cost": 455,
        "heal": 1248,
        "add": 0.85
    },
    {
        "name": "强效3",
        "cost": 545,
        "heal": 1556,
        "add": 0.85
    },
    {
        "name": "强效4",
        "cost": 655,
        "heal": 1917,
        "add": 0.85
    },
    {
        "name": "强效5",
        "cost": 710,
        "heal": 2080,
        "add": 0.85
    },
    {
        "name": "恢复1",
        "cost": 30,
        "heal": 45,
        "add": 1
    },
    {
        "name": "恢复2",
        "cost": 65,
        "heal": 100,
        "add": 1
    },
    {
        "name": "恢复3",
        "cost": 105,
        "heal": 175,
        "add": 1
    },
    {
        "name": "恢复4",
        "cost": 140,
        "heal": 245,
        "add":1
    },
    {
        "name": "恢复5",
        "cost": 170,
        "heal": 315,
        "add": 1
    },
    {
        "name": "恢复6",
        "cost": 205,
        "heal": 400,
        "add":1
    },
    {
        "name": "恢复7",
        "cost": 250,
        "heal": 510,
        "add": 1
    },
    {
        "name": "恢复8",
        "cost": 305,
        "heal": 650,
        "add": 1
    },
    {
        "name": "恢复9",
        "cost": 365,
        "heal": 810,
        "add": 1
    },
    {
        "name": "恢复10",
        "cost": 410,
        "heal": 970,
        "add": 1
    }
]

function countHeal(power) {
    if (!power) {
        power=0
    }
    
    const arr = spells.map(n=>{
        const realHeal = n.heal + power*n.add
        return {
            name:n.name,
            cost:n.cost,
            heal:realHeal,
            hpm:(realHeal/n.cost).toFixed(2)
        }
    })

    return arr

}